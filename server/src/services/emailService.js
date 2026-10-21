const path = require('path');
const nodemailer = require('nodemailer');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

// Check if live email credentials are provided
const isConfigured = Boolean(
  process.env.SMTP_USER &&
  process.env.SMTP_PASS &&
  process.env.SMTP_PASS !== 'app_password_placeholder' &&
  process.env.SMTP_PASS !== 'your_email_app_password'
);

let transporter = null;

if (isConfigured) {
  try {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: Number(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      pool: true,
      maxConnections: 5,
    });
    console.log(`[Email Service] Live SMTP transporter initialized for: ${process.env.SMTP_USER}`);
  } catch (err) {
    console.warn(`[Email Service Warning] Failed to initialize SMTP transporter:`, err.message);
    transporter = null;
  }
} else {
  console.log(`[Email Service] Development Mock Mode active (Live SMTP credentials not set). Outgoing emails will be logged.`);
}

/**
 * Standard Vaidimi Consulting Branded HTML Template
 */
function getBrandedEmailHtml({ title, preheader, bodyHtml, actionUrl, actionText }) {
  const primaryColor = '#0f766e';
  const actionButton = actionUrl && actionText ? `
    <div style="margin: 28px 0; text-align: center;">
      <a href="${actionUrl}" style="background-color: ${primaryColor}; color: #ffffff; padding: 12px 28px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 15px; display: inline-block; box-shadow: 0 4px 6px rgba(15, 118, 110, 0.25);">
        ${actionText} &rarr;
      </a>
    </div>
  ` : '';

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${title}</title>
      </head>
      <body style="margin: 0; padding: 0; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b;">
        <div style="max-width: 600px; margin: 30px auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(15, 23, 42, 0.08); border: 1px solid #e2e8f0;">
          
            <!-- Corporate Header -->
            <div style="background-color: #042f2e; padding: 24px 32px; border-bottom: 3px solid #0f766e;">
              <div style="color: #ffffff; font-size: 20px; font-weight: 800; letter-spacing: -0.02em;">
                Vaidimi <span style="color: #2dd4bf;">Consulting</span>
              </div>
              <div style="color: #94a3b8; font-size: 12px; margin-top: 4px; letter-spacing: 0.03em;">
                Guidance &bull; Growth &bull; Success &bull; info@vaidimiconsulting.in
              </div>
            </div>

            <!-- Email Content Body -->
            <div style="padding: 32px;">
              <h2 style="margin-top: 0; color: #0f172a; font-size: 20px; font-weight: 700; border-bottom: 1px solid #f1f5f9; padding-bottom: 12px;">
                ${title}
              </h2>
              ${preheader ? `<p style="color: #64748b; font-size: 14px; margin-bottom: 20px;">${preheader}</p>` : ''}
              
              <div style="font-size: 15px; line-height: 1.6; color: #334155;">
                ${bodyHtml}
              </div>

              ${actionButton}
            </div>

            <!-- Footer -->
            <div style="background-color: #f8fafc; padding: 20px 32px; border-top: 1px solid #e2e8f0; font-size: 12px; color: #64748b; text-align: center;">
              <p style="margin: 0 0 6px 0;">This is an automated system notification from Vaidimi Consulting Management Suite (<a href="mailto:info@vaidimiconsulting.in" style="color: #0f766e; text-decoration: none;">info@vaidimiconsulting.in</a>).</p>
              <p style="margin: 0; color: #94a3b8;">&copy; ${new Date().getFullYear()} Vaidimi Consulting. All rights reserved.</p>
            </div>

          </div>
        </body>
      </html>
    `;
  }

  /**
   * Generic Send Email Method
   */
  async function sendEmail({ to, subject, html, text }) {
    if (process.env.EMAIL_NOTIFICATIONS_ENABLED === 'false') {
      return { success: false, message: 'Email notifications disabled in configuration.' };
    }

    if (!to) {
      return { success: false, message: 'Recipient email address missing.' };
    }

    // If live transporter is configured and active
    if (transporter) {
      try {
        const from = process.env.SMTP_FROM || `"Vaidimi Consulting" <${process.env.SMTP_USER || 'info@vaidimiconsulting.in'}>`;
      const info = await transporter.sendMail({
        from,
        to,
        subject,
        text: text || subject,
        html,
      });
      console.log(`[Email Service] Live email sent to ${to}: ${info.messageId}`);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error(`[Email Service Error] Failed to send email to ${to}:`, error.message);
      return { success: false, error: error.message };
    }
  }

  // Graceful development logger (simulation)
  console.log(`====================================================`);
  console.log(`✉️ [EMAIL SIMULATION (DEV MODE)]`);
  console.log(`To:      ${to}`);
  console.log(`Subject: ${subject}`);
  console.log(`Details: Live SMTP credentials not supplied; logged successfully.`);
  console.log(`====================================================`);
  return { success: true, simulated: true };
}

/**
 * Send Leave Application / Approval / Rejection Notification Email
 */
async function sendLeaveStatusEmail({ to, employeeName, leaveType, startDate, endDate, status, adminRemarks }) {
  const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
  const statusColor = status === 'APPROVED' ? '#059669' : status === 'REJECTED' ? '#dc2626' : '#d97706';

  const bodyHtml = `
    <p>Dear <strong>${employeeName || 'Colleague'}</strong>,</p>
    <p>Your leave request has been processed with the following status:</p>
    
    <div style="background-color: #f8fafc; border-left: 4px solid ${statusColor}; padding: 16px; border-radius: 6px; margin: 16px 0;">
      <p style="margin: 4px 0;"><strong>Leave Type:</strong> ${leaveType.replace('_', ' ')}</p>
      <p style="margin: 4px 0;"><strong>Duration:</strong> ${startDate} to ${endDate}</p>
      <p style="margin: 4px 0;"><strong>Status:</strong> <span style="color: ${statusColor}; font-weight: 700;">${status}</span></p>
      ${adminRemarks ? `<p style="margin: 4px 0;"><strong>Review Remarks:</strong> "${adminRemarks}"</p>` : ''}
    </div>

    <p>You can view your updated leave balance and corporate calendar in your workspace.</p>
  `;

  const html = getBrandedEmailHtml({
    title: `Leave Request Update: ${status}`,
    preheader: `Update on your ${leaveType} application from ${startDate} to ${endDate}`,
    bodyHtml,
    actionUrl: `${clientUrl}/employee/leaves`,
    actionText: 'View Leave Balances',
  });

  return await sendEmail({
    to,
    subject: `[Vaidimi HRMS] Leave Request ${status} - ${startDate} to ${endDate}`,
    html,
  });
}

/**
 * Send Task Assignment Notification Email
 */
async function sendTaskAssignmentEmail({ to, employeeName, taskTitle, priority, dueDate, assignedBy }) {
  const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';

  const bodyHtml = `
    <p>Hello <strong>${employeeName || 'Team Member'}</strong>,</p>
    <p>A new task has been assigned to you by <strong>${assignedBy || 'Project Lead'}</strong>.</p>
    
    <div style="background-color: #f8fafc; border-left: 4px solid #0284c7; padding: 16px; border-radius: 6px; margin: 16px 0;">
      <p style="margin: 4px 0;"><strong>Task:</strong> ${taskTitle}</p>
      <p style="margin: 4px 0;"><strong>Priority:</strong> <span style="font-weight: 700; color: ${priority === 'URGENT' ? '#dc2626' : '#0284c7'};">${priority}</span></p>
      <p style="margin: 4px 0;"><strong>Due Date:</strong> ${dueDate || 'Not Specified'}</p>
    </div>

    <p>Please log in to your workspace to review project milestones and update task status.</p>
  `;

  const html = getBrandedEmailHtml({
    title: 'New Task Assignment',
    preheader: `You have been assigned to: ${taskTitle}`,
    bodyHtml,
    actionUrl: `${clientUrl}/employee/tasks`,
    actionText: 'Open My Tasks',
  });

  return await sendEmail({
    to,
    subject: `[Vaidimi Workspace] New Task Assigned: ${taskTitle}`,
    html,
  });
}

/**
 * Send Payslip Ready Notification Email
 */
async function sendPayslipReadyEmail({ to, employeeName, month, year, netSalary }) {
  const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';

  const bodyHtml = `
    <p>Dear <strong>${employeeName || 'Colleague'}</strong>,</p>
    <p>Your payslip for <strong>${month} ${year}</strong> has been generated and approved by the finance department.</p>
    
    <div style="background-color: #f8fafc; border-left: 4px solid #059669; padding: 16px; border-radius: 6px; margin: 16px 0;">
      <p style="margin: 4px 0;"><strong>Period:</strong> ${month} ${year}</p>
      <p style="margin: 4px 0;"><strong>Net Disbursed Salary:</strong> <span style="font-size: 18px; font-weight: 800; color: #059669;">₹${Number(netSalary).toLocaleString('en-IN')}</span></p>
    </div>

    <p>You can view and download your detailed breakdown and payslip summary from your salary portal.</p>
  `;

  const html = getBrandedEmailHtml({
    title: `Payslip Available: ${month} ${year}`,
    preheader: `Your salary slip for ${month} ${year} is ready for download`,
    bodyHtml,
    actionUrl: `${clientUrl}/employee/salary`,
    actionText: 'View Salary Slip',
  });

  return await sendEmail({
    to,
    subject: `[Vaidimi Payroll] Payslip Released for ${month} ${year}`,
    html,
  });
}

/**
 * Send Password Reset OTP Email
 */
async function sendPasswordResetOtpEmail({ to, employeeName, otp, expiresInMinutes = 10 }) {
  const bodyHtml = `
    <p>Dear <strong>${employeeName || 'User'}</strong>,</p>
    <p>We received a request to reset your password for your Vaidimi Consulting corporate workspace account.</p>
    
    <div style="text-align: center; margin: 30px 0;">
      <div style="display: inline-block; background-color: #042f2e; color: #2dd4bf; font-size: 32px; font-weight: 800; letter-spacing: 8px; padding: 16px 36px; border-radius: 10px; border: 2px dashed #0f766e; font-family: monospace;">
        ${otp}
      </div>
      <p style="color: #64748b; font-size: 13px; margin-top: 10px;">This One-Time Password (OTP) is valid for <strong>${expiresInMinutes} minutes</strong>.</p>
    </div>

    <div style="background-color: #fffbeb; border-left: 4px solid #f59e0b; padding: 14px; border-radius: 6px; margin: 20px 0; font-size: 13px; color: #78350f;">
      <strong>Security Notice:</strong> If you did not initiate this request, please ignore this email or notify your system administrator immediately. Do not share this OTP with anyone.
    </div>
  `;

  const html = getBrandedEmailHtml({
    title: 'Password Reset Verification Code',
    preheader: `Your verification code is ${otp}. Valid for ${expiresInMinutes} minutes.`,
    bodyHtml,
  });

  return await sendEmail({
    to,
    subject: `[Vaidimi Consulting] Password Reset Verification Code: ${otp}`,
    html,
  });
}

module.exports = {
  sendEmail,
  getBrandedEmailHtml,
  sendLeaveStatusEmail,
  sendTaskAssignmentEmail,
  sendPayslipReadyEmail,
  sendPasswordResetOtpEmail,
};
