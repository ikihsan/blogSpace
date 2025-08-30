const { sequelize } = require('./config/database');
const { Comment } = require('./models');

const migrateComments = async () => {
  try {
    console.log('Starting comment migration...');

    // Check if status column exists
    const tableDescription = await sequelize.getQueryInterface().describeTable('Comments');
    console.log('Current Comments table structure:', Object.keys(tableDescription));

    if (!tableDescription.status) {
      console.log('Adding status column to Comments table...');
      await sequelize.getQueryInterface().addColumn('Comments', 'status', {
        type: sequelize.Sequelize.STRING,
        defaultValue: 'active',
        allowNull: false
      });
      console.log('Status column added successfully');
    } else {
      console.log('Status column already exists');
    }

    // Update any existing comments without status to have 'active' status
    const [results] = await sequelize.query(`
      UPDATE "Comments"
      SET status = 'active'
      WHERE status IS NULL OR status = ''
    `);
    console.log(`Updated ${results} comments with default status`);

    console.log('Migration completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
};

migrateComments();
