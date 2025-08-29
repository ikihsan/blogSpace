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
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:3001', 
      process.env.FRONTEND_URL,
      process.env.ADMIN_URL,
      'https://checkk-czzg.onrender.com'
    ].filter(Boolean);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(null, true); // Allow all origins in production for now
    }
  },
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};
app.use(cors(corsOptions));

// Middleware
app.use(compression());
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static files from the 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Serve test files in development/debugging
app.use('/test', express.static(path.join(__dirname, 'public')));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/blogs', require('./routes/blogs'));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'UP', timestamp: new Date() });
});

// Debug endpoint to check admin user (remove in production)
app.get('/api/debug/admin', async (req, res) => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL;
    if (!adminEmail) {
      return res.json({ error: 'ADMIN_EMAIL not set' });
    }
    
    const user = await User.findOne({ 
      where: { email: adminEmail },
      attributes: ['id', 'email', 'role', 'createdAt']
    });
    
    if (user) {
      res.json({ 
        found: true, 
        user: user,
        env_vars: {
          ADMIN_EMAIL: !!process.env.ADMIN_EMAIL,
          ADMIN_PASSWORD: !!process.env.ADMIN_PASSWORD,
          JWT_SECRET: !!process.env.JWT_SECRET
        }
      });
    } else {
      res.json({ 
        found: false, 
        adminEmail,
        env_vars: {
          ADMIN_EMAIL: !!process.env.ADMIN_EMAIL,
          ADMIN_PASSWORD: !!process.env.ADMIN_PASSWORD,
          JWT_SECRET: !!process.env.JWT_SECRET
        }
      });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Debug endpoint to test login functionality
app.post('/api/debug/test-login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;
    
    console.log('Debug login attempt:', { email, receivedPassword: !!password });
    console.log('Expected admin:', { adminEmail, hasAdminPassword: !!adminPassword });
    
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.json({ 
        success: false, 
        message: 'User not found',
        debug: { email, adminEmail, userExists: false }
      });
    }
    
    const isMatch = await user.comparePassword(password);
    console.log('Password comparison result:', isMatch);
    
    res.json({
      success: isMatch,
      user: { id: user.id, email: user.email, role: user.role },
      debug: {
        passwordMatch: isMatch,
        userRole: user.role,
        isAdmin: user.role === 'admin'
      }
    });
  } catch (error) {
    console.error('Debug login error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Debug endpoint for deployment structure
app.get('/api/debug/deployment', (req, res) => {
  const fs = require('fs');
  
  const checkPath = (path) => {
    try {
      const exists = fs.existsSync(path);
      const contents = exists ? fs.readdirSync(path) : null;
      return { exists, contents };
    } catch (error) {
      return { exists: false, error: error.message };
    }
  };

  const info = {
    cwd: process.cwd(),
    dirname: __dirname,
    env: process.env.NODE_ENV,
    paths: {
      currentDir: checkPath('.'),
      frontendBuild: checkPath('./frontend/build'),
      adminBuild: checkPath('./admin/build'),
      backendRelativeFrontend: checkPath(path.join(__dirname, '..', 'frontend', 'build')),
      backendRelativeAdmin: checkPath(path.join(__dirname, '..', 'admin', 'build')),
      cwdFrontend: checkPath(path.join(process.cwd(), 'frontend', 'build')),
      cwdAdmin: checkPath(path.join(process.cwd(), 'admin', 'build'))
    }
  };
  
  res.json(info);
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

// Serve static files for frontend and admin builds
if (process.env.NODE_ENV === 'production') {
  // Try multiple possible paths for the builds
  const possiblePaths = {
    frontend: [
      path.join(process.cwd(), 'frontend', 'build'),
      path.join(__dirname, '..', 'frontend', 'build'),
      path.join(__dirname, '..', '..', 'frontend', 'build'),
      path.join(__dirname, 'frontend', 'build')
    ],
    admin: [
      path.join(process.cwd(), 'admin', 'build'),
      path.join(__dirname, '..', 'admin', 'build'),
      path.join(__dirname, '..', '..', 'admin', 'build'),
      path.join(__dirname, 'admin', 'build')
    ]
  };
  
  console.log('Current working directory:', process.cwd());
  console.log('__dirname:', __dirname);
  
  const fs = require('fs');
  let frontendPath = null;
  let adminPath = null;
  
  // Find the correct frontend path
  for (const fPath of possiblePaths.frontend) {
    console.log('Checking frontend path:', fPath);
    if (fs.existsSync(fPath)) {
      frontendPath = fPath;
      console.log('Found frontend build at:', fPath);
      break;
    }
  }
  
  // Find the correct admin path
  for (const aPath of possiblePaths.admin) {
    console.log('Checking admin path:', aPath);
    if (fs.existsSync(aPath)) {
      adminPath = aPath;
      console.log('Found admin build at:', aPath);
      break;
    }
  }
  
  if (!frontendPath) {
    console.log('WARNING: Frontend build directory not found. Tried paths:', possiblePaths.frontend);
  }
  if (!adminPath) {
    console.log('WARNING: Admin build directory not found. Tried paths:', possiblePaths.admin);
  }
  
  if (frontendPath) {
    // Serve frontend build
    app.use(express.static(frontendPath));
    console.log('Serving frontend from:', frontendPath);
  }
  
  if (adminPath) {
    // Serve admin build at /admin route
    app.use('/admin', express.static(adminPath));
    console.log('Serving admin from:', adminPath);
  }
  
  // Admin panel route - handle all /admin/* routes
  app.get('/admin*', (req, res) => {
    if (adminPath) {
      res.sendFile(path.resolve(adminPath, 'index.html'));
    } else {
      res.status(404).json({ error: 'Admin panel not available - build not found' });
    }
  });
  
  // Frontend routes (catch-all for everything else)
  app.get('*', (req, res) => {
    if (frontendPath) {
      res.sendFile(path.resolve(frontendPath, 'index.html'));
    } else {
      res.status(404).json({ 
        error: 'Frontend not available - build not found',
        message: 'Please ensure the frontend is built properly',
        debug_info: {
          cwd: process.cwd(),
          dirname: __dirname,
          tried_paths: possiblePaths,
          frontend_found: !!frontendPath,
          admin_found: !!adminPath
        }
      });
    }
  });
} else {
  // Development mode - just return a message
  app.get('*', (req, res) => {
    res.json({ 
      message: 'Backend API is running. Please start frontend and admin separately in development mode.',
      endpoints: {
        api: '/api/*',
        health: '/api/health'
      }
    });
  });
}


// Create admin user if it doesn't exist
const createAdminUser = async () => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminEmail || !adminPassword) {
      console.log('ADMIN_EMAIL or ADMIN_PASSWORD not set in environment variables. Skipping admin creation.');
      console.log('Please set ADMIN_EMAIL and ADMIN_PASSWORD in your environment variables.');
      return;
    }

    console.log(`Creating admin user with email: ${adminEmail}`);

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
      // Update password if it's different
      const isMatch = await user.comparePassword(adminPassword);
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
