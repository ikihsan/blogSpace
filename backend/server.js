const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const path = require('path');
require('dotenv').config();

const { connectDB, sequelize } = require('./config/database');
const { User } = require('./models');
const bcrypt = require('bcryptjs');

// Initialize Express
const app = express();

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// CORS configuration
const corsOptions = {
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  allowedHeaders: ['Content-Type', 'Authorization']
};
app.use(cors(corsOptions));

// Middleware
app.use(compression());
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static files from the 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/blogs', require('./routes/blogs'));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'UP', timestamp: new Date() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ message: 'Something broke!', error: err.message });
});

// 404 handler for API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({ message: 'API endpoint not found' });
});

// Serve frontend for any other route
// This is important for single-page applications
app.use(express.static(path.join(__dirname, '..', 'frontend', 'build')));
app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '..', 'frontend', 'build', 'index.html'));
});


// Create admin user if it doesn't exist
const createAdminUser = async () => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminEmail || !adminPassword) {
      console.log('Admin email or password not set in .env file. Skipping admin creation.');
      return;
    }

    const [user, created] = await User.findOrCreate({
      where: { email: adminEmail },
      defaults: {
        password: adminPassword, // The hook will hash it
        role: 'admin'
      }
    });

    if (created) {
      console.log('Admin user created successfully.');
    } else {
      console.log('Admin user already exists.');
      // If you want to ensure the password is up to date, you can add this:
      const isMatch = await bcrypt.compare(adminPassword, user.password);
      if(!isMatch) {
        user.password = adminPassword; // The hook will re-hash
        await user.save();
        console.log('Admin password updated.');
      }
    }
  } catch (error) {
    console.error('Error creating admin user:', error);
  }
};

// Start server
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    await createAdminUser();
    app.listen(PORT, () => {
      console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  // Perform cleanup if necessary
  sequelize.close();
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received. Shutting down gracefully...');
  // Perform cleanup if necessary
  sequelize.close();
  process.exit(0);
});
