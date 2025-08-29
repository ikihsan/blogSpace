const express = require('express');
const {
  getAllBlogs,
  getBlogBySlug,
  createBlog,
  updateBlog,
  deleteBlog,
  getAdminBlogs,
  getDashboardStats
} = require('../controllers/blogController');
const { authenticateToken, adminOnly } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

const router = express.Router();

// Public routes
router.get('/', getAllBlogs);
router.get('/:slug', getBlogBySlug);

// Admin routes - All routes below are protected and for admins only
router.use(authenticateToken, adminOnly);

router.get('/admin/all', getAdminBlogs);
router.get('/admin/stats', getDashboardStats);
router.post('/', upload.array('images', 3), createBlog);
router.put('/:id', upload.array('images', 3), updateBlog);
router.delete('/:id', deleteBlog);

module.exports = router;
