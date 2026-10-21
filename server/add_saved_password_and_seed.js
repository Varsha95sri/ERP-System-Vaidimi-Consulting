require('dotenv').config();
const bcrypt = require('bcryptjs');
const { sequelize, User, Employee } = require('./src/models');

async function migrateSavedPassword() {
  console.log('--- ADDING saved_password COLUMN & SETTING PASSWORDS ---');

  try {
    // 1. Check if column exists, if not add it
    const [columns] = await sequelize.query("SHOW COLUMNS FROM users LIKE 'saved_password'");
    if (columns.length === 0) {
      console.log("Adding 'saved_password' column to 'users' table...");
      await sequelize.query("ALTER TABLE users ADD COLUMN saved_password VARCHAR(255) NULL AFTER password_hash");
      console.log("✅ 'saved_password' column added successfully.");
    } else {
      console.log("ℹ️ 'saved_password' column already exists in 'users' table.");
    }

    // 2. Default passwords for known accounts
    const initialPasswords = {
      'admin@company.com': 'AdminPassword123!',
      'gargi@vaidimiconsulting.in': 'AdminPassword123!',
      'gargi.singh@vaidimi.com': 'AdminPassword123!',
      'vinit.kumar@vaidimi.com': 'Vinit@2026!',
      'varsha.srivastava@vaidimi.com': 'Varsha@2026!',
      'madhumita.prajapati@vaidimi.com': 'Madhu@2026!',
      'aryan.tiwari@vaidimi.com': 'Aryan@2026!',
      'rohan.test@vaidimi.com': 'Rohan@2026!',
    };

    const users = await User.scope('withPassword').findAll({
      include: [{ model: Employee, as: 'employeeProfile' }]
    });

    console.log(`Found ${users.length} users in database. Setting passwords...`);

    for (const user of users) {
      const email = user.email.toLowerCase();
      let pass = initialPasswords[email];
      if (!pass) {
        const empName = user.employeeProfile?.first_name || 'User';
        pass = `${empName}@2026!`;
      }

      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(pass, salt);

      await sequelize.query(
        "UPDATE users SET password_hash = :hash, saved_password = :pass WHERE id = :id",
        {
          replacements: { hash, pass, id: user.id }
        }
      );

      const name = user.employeeProfile
        ? `${user.employeeProfile.first_name} ${user.employeeProfile.last_name}`
        : 'System User';

      console.log(`✅ [${user.role}] ${name} (${user.email}) -> Password saved: "${pass}"`);
    }

    console.log('--- MIGRATION AND PASSWORD SETUP COMPLETED SUCCESSFULLY ---');
    process.exit(0);
  } catch (err) {
    console.error('❌ Migration Error:', err.message);
    process.exit(1);
  }
}

migrateSavedPassword();
