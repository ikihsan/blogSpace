const { User } = require('./models');
const { connectDB, sequelize } = require('./config/database');
require('dotenv').config();

const addAdminUser = async (email, password) => {
  try {
    console.log(`Adding admin user: ${email}`);

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

const main = async () => {
  try {
    console.log('Connecting to database...');
    await connectDB();
    console.log('Database connected successfully');

    // Get command line arguments
    const args = process.argv.slice(2);

    if (args.length < 2) {
      console.log('\n❌ Usage: node add-admin.js <email> <password>');
      console.log('Example: node add-admin.js admin2@example.com mypassword123\n');
      process.exit(1);
    }

    const email = args[0];
    const password = args[1];

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log('❌ Invalid email format');
      process.exit(1);
    }

    // Validate password length
    if (password.length < 6) {
      console.log('❌ Password must be at least 6 characters long');
      process.exit(1);
    }

    await addAdminUser(email, password);

    console.log('\n🎉 Admin user setup completed!');
    console.log(`📧 Email: ${email}`);
    console.log('🔑 Role: admin');

    process.exit(0);
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    process.exit(1);
  }
};

main();
