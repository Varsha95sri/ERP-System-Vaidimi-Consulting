const { sequelize, User, Employee, Attendance, LeaveBalance, LeaveRequest, Project, ProjectMember, Task, Notification } = require('../models');
const { Op } = require('sequelize');
const { testConnection } = require('../config/db');

async function cleanDummyData() {
  console.log('=== Cleaning Dummy Employees, Leaves, and Attendance Data ===');
  const dbStatus = await testConnection();
  if (!dbStatus.connected) {
    console.error('Database connection failed:', dbStatus.error);
    process.exit(1);
  }

  // 1. Identify Admin User and Admin Employee
  const adminUser = await User.findOne({
    where: {
      [Op.or]: [
        { email: 'gargi@vidimiconsulting.in' },
        { email: 'admin@vaidimiconsulting.in' },
        { role: 'ADMIN' },
        { email: 'gargi@vaidimiconsulting.in' },
        { email: 'admin@company.com' }
      ]
    }
  });
  if (!adminUser) {
    console.error('Admin user not found! Aborting to protect system.');
    process.exit(1);
  }

  const adminEmp = await Employee.findOne({ where: { user_id: adminUser.id } });
  const adminEmpId = adminEmp ? adminEmp.id : null;
  const adminUserId = adminUser.id;

  console.log(`Preserving Admin Account: User ID ${adminUserId} (email: ${adminUser.email}), Employee ID: ${adminEmpId}`);

  // 2. Remove all leave requests
  const deletedLeaves = await LeaveRequest.destroy({ where: {} });
  console.log(`✅ Deleted ${deletedLeaves} dummy leave request records.`);

  // 3. Remove all leave balances for dummy employees (non-admin)
  const deletedBalances = await LeaveBalance.destroy({
    where: adminEmpId ? { employee_id: { [Op.ne]: adminEmpId } } : {},
  });
  console.log(`✅ Deleted ${deletedBalances} dummy leave balance records.`);

  // 4. Remove all attendance records for dummy employees (non-admin)
  const deletedAttendance = await Attendance.destroy({
    where: adminEmpId ? { employee_id: { [Op.ne]: adminEmpId } } : {},
  });
  console.log(`✅ Deleted ${deletedAttendance} dummy attendance records.`);

  // 5. Clean up Project and Task associations
  // Reassign dummy staff tasks to admin
  const [updatedTasks] = await Task.update(
    { assigned_to: adminEmpId },
    { where: adminEmpId ? { assigned_to: { [Op.ne]: adminEmpId } } : {} }
  );
  console.log(`✅ Updated ${updatedTasks} tasks previously assigned to dummy staff.`);

  // Remove dummy employee memberships from projects
  const deletedMembers = await ProjectMember.destroy({
    where: adminEmpId ? { employee_id: { [Op.ne]: adminEmpId } } : {},
  });
  console.log(`✅ Deleted ${deletedMembers} dummy project memberships.`);

  // Reassign project manager to admin if held by dummy employee
  const [updatedProjects] = await Project.update(
    { project_manager_id: adminEmpId },
    { where: adminEmpId ? { project_manager_id: { [Op.ne]: adminEmpId } } : {} }
  );
  console.log(`✅ Updated ${updatedProjects} projects with non-admin managers.`);

  // 6. Delete notifications for dummy users
  const deletedNotifications = await Notification.destroy({
    where: { user_id: { [Op.ne]: adminUserId } },
  });
  console.log(`✅ Deleted ${deletedNotifications} dummy user notifications.`);

  // 7. Clear self-referencing foreign keys on employees (reporting_manager_id, mentor_id)
  await Employee.update(
    { reporting_manager_id: null, mentor_id: null },
    { where: {} }
  );

  // 8. Delete all dummy non-admin employees and interns
  const deletedEmployees = await Employee.destroy({
    where: { user_id: { [Op.ne]: adminUserId } },
  });
  console.log(`✅ Deleted ${deletedEmployees} dummy employee/intern profiles.`);

  // 9. Delete all non-admin user accounts
  const deletedUsers = await User.destroy({
    where: { id: { [Op.ne]: adminUserId } },
  });
  console.log(`✅ Deleted ${deletedUsers} dummy login accounts.`);

  console.log('====================================================');
  console.log('🎉 Clean-up successfully completed!');
  console.log('The database is now a fresh, clean slate ready for Admin to onboard their own employees.');
  console.log('Active Admin Account: admin@company.com / AdminPassword123!');
  console.log('====================================================');
}

cleanDummyData()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('❌ Error during clean-up:', err);
    process.exit(1);
  });
