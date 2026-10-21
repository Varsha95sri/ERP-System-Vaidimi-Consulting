const { sequelize, User, Employee, Department } = require('../models');
const { ROLES, EMPLOYMENT_TYPES, EMPLOYEE_STATUS } = require('../config/constants');
const { testConnection } = require('../config/db');

async function seed() {
  console.log('--- Initializing Database Sync & Seed ---');

  // Ensure DB connection
  const dbStatus = await testConnection();
  if (!dbStatus.connected) {
    console.error('❌ Database connection failed:', dbStatus.error);
    console.error('Please configure DB_PASSWORD in server/.env before running seed.');
    process.exit(1);
  }

  // Synchronize Sequelize models with MySQL tables
  console.log('🔄 Synchronizing models with MySQL database (tables: users, departments, employees)...');
  await sequelize.sync({ alter: true });
  console.log('✅ Tables synchronized successfully.');

  // 1. Seed Departments
  console.log('🏢 Seeding Departments...');
  const departmentsData = [
    { department_name: 'Engineering & Development', description: 'Software architecture, backend, frontend, and DevOps.' },
    { department_name: 'Quality Assurance', description: 'Testing, automation, performance, and bug tracking.' },
    { department_name: 'Human Resources', description: 'Talent recruitment, company culture, and employee welfare.' },
    { department_name: 'UI/UX Design', description: 'User interface design, branding, and design systems.' },
    { department_name: 'Sales & Marketing', description: 'Client partnerships, growth, and brand communication.' },
  ];

  const departments = {};
  for (const dept of departmentsData) {
    const [d] = await Department.findOrCreate({
      where: { department_name: dept.department_name },
      defaults: dept,
    });
    departments[dept.department_name] = d;
  }
  console.log('✅ Departments ready.');

  // 2. Seed Default Admin User
  console.log('👤 Seeding Default Admin (gargi@vidimiconsulting.in)...');
  let adminUser = await User.scope('withPassword').findOne({ where: { email: 'gargi@vidimiconsulting.in' } });
  if (!adminUser) {
    adminUser = await User.create({
      email: 'gargi@vidimiconsulting.in',
      password_hash: 'Gargi@2026',
      saved_password: 'Gargi@2026',
      role: ROLES.ADMIN,
      is_active: true,
    });
    console.log('✅ Created Admin user: gargi@vidimiconsulting.in');
  } else {
    await adminUser.update({
      password_hash: 'Gargi@2026',
      saved_password: 'Gargi@2026',
      role: ROLES.ADMIN,
      is_active: true,
    });
  }

  let adminEmp = await Employee.findOne({ where: { user_id: adminUser.id } });
  if (!adminEmp) {
    await Employee.create({
      user_id: adminUser.id,
      employee_code: 'EMP-001',
      first_name: 'Gargi',
      last_name: 'Singh',
      email: 'gargi@vidimiconsulting.in',
      phone: '+91 9876500001',
      gender: 'FEMALE',
      date_of_birth: '1992-06-18',
      designation: 'Director of Operations & Admin',
      department_id: departments['Human Resources']?.id || null,
      employment_type: EMPLOYMENT_TYPES.EMPLOYEE,
      joining_date: '2021-01-15',
      skills: 'Executive Management, Operations, Leadership, Strategy',
      status: EMPLOYEE_STATUS.ACTIVE,
      base_salary: 60000.00,
    });
  } else {
    await adminEmp.update({
      first_name: 'Gargi',
      last_name: 'Singh',
      email: 'gargi@vidimiconsulting.in',
      designation: 'Director of Operations & Admin',
    });
  }

  // 3. Seed Default HR User (Vinit Kumar)
  console.log('👤 Seeding Default HR (Vinit Kumar)...');
  let hrUser = await User.scope('withPassword').findOne({ where: { email: 'vinit.kumar@vaidimi.com' } });
  if (!hrUser) {
    hrUser = await User.create({
      email: 'vinit.kumar@vaidimi.com',
      password_hash: 'Vinit@2026',
      role: ROLES.HR,
      is_active: true,
    });
    console.log('✅ Created HR user: vinit.kumar@vaidimi.com');
  }

  let hrEmp = await Employee.findOne({ where: { user_id: hrUser.id } });
  if (!hrEmp) {
    await Employee.create({
      user_id: hrUser.id,
      employee_code: 'EMP-HR01',
      first_name: 'Vinit',
      last_name: 'Kumar',
      email: 'vinit.kumar@vaidimi.com',
      phone: '+91 9876543210',
      gender: 'MALE',
      date_of_birth: '1990-05-15',
      designation: 'Head of Human Resources & People Operations',
      department_id: departments['Human Resources']?.id || null,
      employment_type: EMPLOYMENT_TYPES.EMPLOYEE,
      joining_date: '2022-03-01',
      skills: 'Workforce Administration, Talent Acquisition, Attendance & Leave Management',
      status: EMPLOYEE_STATUS.ACTIVE,
      base_salary: 45000.00,
    });
  }

  // 4. Seed Standard Employees (Varsha Srivastava, Madhumita Prajapati, Aryan Tiwari)
  console.log('👥 Seeding Core Staff (Varsha, Madhumita, Aryan)...');
  const staffList = [
    {
      first: 'Varsha',
      last: 'Srivastava',
      email: 'varsha.srivastava@vaidimi.com',
      code: 'EMP-002',
      pass: 'Varsha@2026',
      role: 'Software Developer',
      dept: departments['Engineering & Development']?.id || null,
      salary: 35000.00,
      gender: 'FEMALE',
    },
    {
      first: 'Madhumita',
      last: 'Prajapati',
      email: 'madhumita.prajapati@vaidimi.com',
      code: 'EMP-003',
      pass: 'Madhumita@2026',
      role: 'IT Team Head',
      dept: departments['Engineering & Development']?.id || null,
      salary: 42000.00,
      gender: 'FEMALE',
    },
    {
      first: 'Aryan',
      last: 'Tiwari',
      email: 'aryan.tiwari@vaidimi.com',
      code: 'EMP-004',
      pass: 'Aryan@2026',
      role: 'Frontend Developer',
      dept: departments['Engineering & Development']?.id || null,
      salary: 30000.00,
      gender: 'MALE',
    },
  ];

  for (const s of staffList) {
    let u = await User.scope('withPassword').findOne({ where: { email: s.email } });
    if (!u) {
      u = await User.create({
        email: s.email,
        password_hash: s.pass,
        role: ROLES.EMPLOYEE,
        is_active: true,
      });
    }

    let emp = await Employee.findOne({ where: { user_id: u.id } });
    if (!emp) {
      await Employee.create({
        user_id: u.id,
        employee_code: s.code,
        first_name: s.first,
        last_name: s.last,
        email: s.email,
        gender: s.gender,
        designation: s.role,
        department_id: s.dept,
        employment_type: EMPLOYMENT_TYPES.EMPLOYEE,
        status: EMPLOYEE_STATUS.ACTIVE,
        base_salary: s.salary,
      });
    } else {
      await emp.update({
        first_name: s.first,
        last_name: s.last,
        email: s.email,
        designation: s.role,
        base_salary: s.salary,
      });
    }
  }

  // 5. Seed Default Company Settings
  console.log('⚙️ Seeding Default Office Timing Settings...');
  const { CompanySetting } = require('../models');
  await CompanySetting.findOrCreate({
    where: { key: 'office_start_time' },
    defaults: { key: 'office_start_time', value: '10:30', description: 'Office shift official start time' },
  });
  await CompanySetting.findOrCreate({
    where: { key: 'office_grace_end_time' },
    defaults: { key: 'office_grace_end_time', value: '11:00', description: 'On-time login window end time (Late after this)' },
  });
  await CompanySetting.findOrCreate({
    where: { key: 'office_end_time' },
    defaults: { key: 'office_end_time', value: '17:30', description: 'Office shift official end time' },
  });
  await CompanySetting.findOrCreate({
    where: { key: 'work_hours_standard' },
    defaults: { key: 'work_hours_standard', value: '6.0', description: 'Standard net work hours per day' },
  });

  console.log('====================================================');
  console.log('🎉 Seed Completed Successfully!');
  console.log('Admin Account:      Gargi Singh (gargi@vaidimiconsulting.in / EMP-001)');
  console.log('HR Account:         Vinit Kumar (vinit.kumar@vaidimi.com / EMP-HR01)');
  console.log('Employee Accounts:  Varsha Srivastava (EMP-002)');
  console.log('                    Madhumita Prajapati (EMP-003)');
  console.log('                    Aryan Tiwari (EMP-004)');
  console.log('====================================================');
}

if (require.main === module) {
  seed()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('❌ Seed error:', err);
      process.exit(1);
    });
}

module.exports = { seed };
