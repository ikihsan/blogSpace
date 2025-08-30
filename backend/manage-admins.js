const { User } = require('./models');
const { connectDB, sequelize } = require('./config/database');
require('dotenv').config();

const listAdminUsers = async () => {
  try {
    const admins = await User.findAll({
      where: { role: 'admin' },
      attributes: ['id', 'email', 'role', 'createdAt', 'updatedAt']
    });

    console.log('\n👥 Current Admin Users:');
    console.log('='.repeat(60));

    if (admins.length === 0) {
      console.log('No admin users found.');
    } else {
      admins.forEach((admin, index) => {
        console.log(`${index + 1}. Email: ${admin.email}`);
        console.log(`   Role: ${admin.role}`);
        console.log(`   Created: ${admin.createdAt.toLocaleDateString()}`);
        console.log(`   Last Updated: ${admin.updatedAt.toLocaleDateString()}`);
        console.log('-'.repeat(40));
      });
    }
  } catch (error) {
    console.error('❌ Error listing admin users:', error.message);
  }
};

const addAdminUser = async (email, password) => {
  try {
    console.log(`\n👤 Adding admin user: ${email}`);

    const [user, created] = await User.findOrCreate({
      where: { email },
      defaults: {
        password, // The hook will hash it
        role: 'admin'
      }
    });

    if (created) {
      console.log(`✅ Admin user ${email} created successfully!`);
    } else {
      console.log(`ℹ️  Admin user ${email} already exists.`);
      // Update password if it's different
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        user.password = password; // The hook will re-hash
        await user.save();
        console.log(`🔄 Admin password updated for ${email}.`);
      }
    }
  } catch (error) {
    console.error(`❌ Error adding admin user ${email}:`, error.message);
  }
};

const removeAdminUser = async (email) => {
  try {
    console.log(`\n🗑️  Removing admin privileges from: ${email}`);

    const user = await User.findOne({ where: { email } });

    if (!user) {
      console.log(`❌ User ${email} not found.`);
      return;
    }

    if (user.role !== 'admin') {
      console.log(`ℹ️  User ${email} is not an admin.`);
      return;
    }

    // Change role to 'user' instead of deleting
    user.role = 'user';
    await user.save();

    console.log(`✅ Admin privileges removed from ${email}. User is now a regular user.`);
  } catch (error) {
    console.error(`❌ Error removing admin privileges from ${email}:`, error.message);
  }
};

const main = async () => {
  try {
    console.log('🔗 Connecting to database...');
    await connectDB();
    console.log('✅ Database connected successfully');

    const args = process.argv.slice(2);
    const command = args[0];

    switch (command) {
      case 'list':
        await listAdminUsers();
        break;

      case 'add':
        if (args.length < 3) {
          console.log('\n❌ Usage: node manage-admins.js add <email> <password>');
          console.log('Example: node manage-admins.js add admin2@example.com mypassword123\n');
          process.exit(1);
        }
        const addEmail = args[1];
        const addPassword = args[2];
        await addAdminUser(addEmail, addPassword);
        await listAdminUsers();
        break;

      case 'remove':
        if (args.length < 2) {
          console.log('\n❌ Usage: node manage-admins.js remove <email>');
          console.log('Example: node manage-admins.js remove admin2@example.com\n');
          process.exit(1);
        }
        const removeEmail = args[1];
        await removeAdminUser(removeEmail);
        await listAdminUsers();
        break;

      default:
        console.log('\n📋 Admin User Management Tool');
        console.log('='.repeat(40));
        console.log('Usage:');
        console.log('  node manage-admins.js list                    - List all admin users');
        console.log('  node manage-admins.js add <email> <password>  - Add new admin user');
        console.log('  node manage-admins.js remove <email>          - Remove admin privileges');
        console.log('\nExamples:');
        console.log('  node manage-admins.js list');
        console.log('  node manage-admins.js add admin2@example.com mypassword123');
        console.log('  node manage-admins.js remove admin2@example.com');
        break;
    }

    console.log('\n🎉 Operation completed!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    process.exit(1);
  }
};

main();
