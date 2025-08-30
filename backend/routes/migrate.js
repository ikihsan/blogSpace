const express = require('express');
const { sequelize } = require('../config/database');
const { Comment } = require('../models');

const router = express.Router();

// Migration endpoint for comments table
router.post('/comments', async (req, res) => {
  try {
    console.log('Running comment migration...');

    // Check if status column exists
    const tableDescription = await sequelize.getQueryInterface().describeTable('Comments');
    console.log('Current table structure:', Object.keys(tableDescription));

    let statusColumnAdded = false;
    if (!tableDescription.status) {
      console.log('Adding status column...');
      await sequelize.getQueryInterface().addColumn('Comments', 'status', {
        type: sequelize.Sequelize.STRING,
        defaultValue: 'active',
        allowNull: false
      });
      statusColumnAdded = true;
      console.log('Status column added successfully');
    } else {
      console.log('Status column already exists');
    }

    // Update existing comments
    const [results] = await sequelize.query(`
      UPDATE "Comments"
      SET status = 'active'
      WHERE status IS NULL OR status = ''
    `);
    console.log(`Updated ${results} comments with default status`);

    res.json({
      message: 'Migration completed successfully',
      statusColumnAdded,
      commentsUpdated: results
    });
  } catch (error) {
    console.error('Migration error:', error);
    res.status(500).json({
      error: error.message,
      stack: error.stack
    });
  }
});

module.exports = router;
