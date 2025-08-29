const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const jwt = require('jsonwebtoken');
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
      'https://checkk-czzg.onrender.com',
      'https://fathii.coms.codes/',
      process.env.FRONTEND_URL,
      process.env.ADMIN_URL

    ].filter(Boolean);

    // Add CORS_ORIGIN if set (comma-separated list)
    if (process.env.CORS_ORIGIN) {
      const corsOrigins = process.env.CORS_ORIGIN.split(',').map(url => url.trim());
      allowedOrigins.push(...corsOrigins);
    }

    console.log('Allowed origins:', allowedOrigins);
    console.log('Request origin:', origin);

    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log('Origin not allowed:', origin);
      callback(new Error('Not allowed by CORS'));
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
app.use('/api', require('./routes/comments'));
app.use('/api/blogs', require('./routes/blogs'));

// Health check endpoint
app.get('/api/health', (req, res) => {
  const cloudinaryConfigured = !!(process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET);
  res.json({
    status: 'UP',
    timestamp: new Date(),
    cloudinary: cloudinaryConfigured,
    environment: process.env.NODE_ENV || 'development'
  });
});

// Debug endpoint to check JWT_SECRET
app.get('/api/debug/jwt-test', (req, res) => {
  try {
    const jwt = require('jsonwebtoken');
    const testToken = jwt.sign({ test: 'data' }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ 
      jwt_secret_exists: !!process.env.JWT_SECRET,
      jwt_secret_length: process.env.JWT_SECRET ? process.env.JWT_SECRET.length : 0,
      jwt_generation_success: true,
      test_token: testToken.substring(0, 50) + '...'
    });
  } catch (error) {
    res.status(500).json({ 
      jwt_secret_exists: !!process.env.JWT_SECRET,
      jwt_secret_length: process.env.JWT_SECRET ? process.env.JWT_SECRET.length : 0,
      jwt_generation_success: false,
      error: error.message
    });
  }
});

// Debug endpoint to check admin user
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

// Simple test login endpoint for admin panel
app.post('/api/test-login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check password
    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if user is admin
    if (user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin privileges required.'
      });
    }

    // Generate token
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.json({
      success: true,
      token,
      user: { id: user.id, email: user.email, role: user.role }
    });
  } catch (error) {
    console.error('Test login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
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

  // Let's check the actual Render structure
  const info = {
    cwd: process.cwd(),
    dirname: __dirname,
    env: process.env.NODE_ENV,
    paths: {
      currentDir: checkPath('.'),
      parentDir: checkPath('..'),
      grandparentDir: checkPath('../..'),
      projectSrc: checkPath('/opt/render/project/src'),
      projectRoot: checkPath('/opt/render/project'),
      frontendFromSrc: checkPath('/opt/render/project/src/frontend/build'),
      adminFromSrc: checkPath('/opt/render/project/src/admin/build'),
      frontendFromProject: checkPath('/opt/render/project/frontend/build'),
      adminFromProject: checkPath('/opt/render/project/admin/build'),
      backendRelativeFrontend: checkPath(path.join(__dirname, '..', 'frontend', 'build')),
      backendRelativeAdmin: checkPath(path.join(__dirname, '..', 'admin', 'build'))
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
  const fs = require('fs');
  
  // Determine the correct project root based on Render's structure
  let projectRoot;
  if (process.cwd().includes('/opt/render/project/src/backend')) {
    // Render puts code in /opt/render/project/src/
    projectRoot = '/opt/render/project/src';
  } else {
    // Standard structure
    projectRoot = path.join(__dirname, '..');
  }
  
  console.log('Detected project root:', projectRoot);
  console.log('Current working directory:', process.cwd());
  console.log('__dirname:', __dirname);
  
  // Define build paths
  const frontendBuildPath = path.join(projectRoot, 'frontend', 'build');
  const adminBuildPath = path.join(projectRoot, 'admin', 'build');
  
  console.log('Looking for frontend build at:', frontendBuildPath);
  console.log('Looking for admin build at:', adminBuildPath);
  
  const frontendExists = fs.existsSync(frontendBuildPath);
  const adminExists = fs.existsSync(adminBuildPath);
  
  console.log('Frontend build exists:', frontendExists);
  console.log('Admin build exists:', adminExists);
  
  // If frontend build doesn't exist, try alternative paths
  if (!frontendExists) {
    const alternatePaths = [
      path.join(__dirname, '..', 'frontend', 'build'),
      path.join(process.cwd(), '..', 'frontend', 'build'),
      '/opt/render/project/frontend/build'
    ];
    
    console.log('Frontend not found, trying alternate paths...');
    for (const altPath of alternatePaths) {
      console.log('Checking:', altPath);
      if (fs.existsSync(altPath)) {
        console.log('Found frontend at alternate path:', altPath);
        // Update the path
        frontendBuildPath = altPath;
        frontendExists = true;
        break;
      }
    }
  }
  
  if (frontendExists) {
    // Serve frontend build
    app.use(express.static(frontendBuildPath));
    console.log('Serving frontend from:', frontendBuildPath);
  } else {
    console.log('WARNING: Frontend build not found at any location');
    // Serve a simple HTML page that loads the admin panel
    app.get('/', (req, res) => {
      res.send(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>FathiVlog</title>
          <style>
            body { font-family: Arial, sans-serif; text-align: center; padding: 50px; background: #1a1a2e; color: white; }
            .container { max-width: 600px; margin: 0 auto; }
            .btn { display: inline-block; padding: 12px 24px; background: #ff6b6b; color: white; text-decoration: none; border-radius: 5px; margin: 10px; }
            .btn:hover { background: #ff5252; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>🚧 Frontend Build Missing</h1>
            <p>The frontend is currently unavailable due to a build issue.</p>
            <p>You can still access the admin panel:</p>
            <a href="/admin" class="btn">Go to Admin Panel</a>
            <br><br>
            <p><strong>API Status:</strong> ✅ Working</p>
            <p><strong>Database:</strong> ✅ Connected</p>
            <p><strong>Admin Panel:</strong> ✅ Available</p>
            <br>
            <p><small>Debug info: Project root: ${projectRoot}</small></p>
          </div>
        </body>
        </html>
      `);
    });
  }
  
  if (adminExists) {
    // Serve admin build at /admin route
    app.use('/admin', express.static(adminBuildPath));
    console.log('Serving admin from:', adminBuildPath);
  }
  
  // Admin panel route - handle all /admin/* routes
  app.get('/admin*', (req, res) => {
    if (adminExists) {
      res.sendFile(path.resolve(adminBuildPath, 'index.html'));
    } else {
      res.status(404).json({ error: 'Admin panel not available - build not found' });
    }
  });
  
  // Frontend routes (catch-all for everything else)
  app.get('*', (req, res) => {
    if (frontendExists) {
      res.sendFile(path.resolve(frontendBuildPath, 'index.html'));
    } else {
      res.status(404).json({ 
        error: 'Frontend not available - build not found',
        message: 'Please ensure the frontend is built properly',
        debug_info: {
          cwd: process.cwd(),
          dirname: __dirname,
          projectRoot: projectRoot,
          frontendPath: frontendBuildPath,
          adminPath: adminBuildPath,
          frontend_found: frontendExists,
          admin_found: adminExists
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
    console.log('Starting server...');
    console.log('Connecting to database...');
    await connectDB();
    console.log('Database connected successfully');
    
    console.log('Creating admin user...');
    await createAdminUser();
    console.log('Admin user creation completed');
    
    console.log(`Starting server on port ${PORT}...`);
    app.listen(PORT, () => {
      console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
      console.log('Server startup complete!');
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
