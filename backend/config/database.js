const { Sequelize } = require('sequelize');
require('dotenv').config();

let sequelize;

// Check if we have a valid DATABASE_URL (not a placeholder)
const hasValidDatabaseUrl = process.env.DATABASE_URL &&
  process.env.DATABASE_URL !== 'your_render_postgresql_url' &&
  process.env.DATABASE_URL.startsWith('postgresql://');

if (process.env.NODE_ENV === 'production' && hasValidDatabaseUrl) {
  // Production: Use PostgreSQL from DATABASE_URL
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    protocol: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    },
    logging: false
  });
} else {
  // Development: Use SQLite
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database.sqlite',
    logging: process.env.NODE_ENV === 'development' ? console.log : false
  });
}

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database Connected...');
    await sequelize.sync({ alter: true }); // Use alter: true to update schema without dropping data
    console.log('All models were synchronized successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    process.exit(1);
  }
};

module.exports = { sequelize, connectDB };
