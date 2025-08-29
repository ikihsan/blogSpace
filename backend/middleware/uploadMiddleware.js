const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Try to load Cloudinary storage, fallback to local if not available
let CloudinaryStorage;
try {
  CloudinaryStorage = require('multer-storage-cloudinary').CloudinaryStorage;
} catch (error) {
  console.warn('multer-storage-cloudinary not available, using local storage only');
  CloudinaryStorage = null;
}

// Configure Cloudinary
if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });
}

// Check if we should use Cloudinary (production) or local storage (development)
const useCloudinary = process.env.NODE_ENV === 'production' &&
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET;

// Local storage configuration
const createLocalStorage = () => {
  const uploadDir = path.join(__dirname, '../uploads/blog-images');
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  return multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
  });
};

// Cloudinary storage configuration
const createCloudinaryStorage = () => {
  if (!CloudinaryStorage) {
    throw new Error('Cloudinary storage not available');
  }
  return new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'blog-images',
      allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
      transformation: [{ width: 1200, height: 800, crop: 'limit' }]
    }
  });
};

// File filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const mimetype = allowedTypes.test(file.mimetype);
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());

  if (mimetype && extname) {
    return cb(null, true);
  }
  cb(new Error('Error: File type not allowed! Only JPEG, PNG, GIF, WEBP are allowed.'));
};

// Create multer upload instance
const storage = useCloudinary ? createCloudinaryStorage() : createLocalStorage();

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 1024 * 1024 * 5 } // 5MB file size limit
});

// Helper function to get the correct image URL
const getImageUrl = (file) => {
  if (useCloudinary) {
    return file.path; // Cloudinary returns the full URL in file.path
  } else {
    return `/uploads/blog-images/${file.filename}`;
  }
};

module.exports = {
  upload,
  getImageUrl,
  useCloudinary
};
