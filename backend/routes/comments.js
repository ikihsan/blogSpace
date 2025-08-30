const express = require('express');
const {
  getCommentsByBlogId,
  createComment,
  getCommentCount,
  deleteComment,
  archiveComment
} = require('../controllers/commentController');
const { authenticateToken, adminOnly } = require('../middleware/authMiddleware');

const router = express.Router();

// Test endpoint to verify routes are working
router.get('/test', (req, res) => {
  res.json({ message: 'Comments routes are working!' });
});

// Get all comments for a specific blog
router.get('/:blogId/comments', getCommentsByBlogId);

// Get comment count for a specific blog
router.get('/:blogId/comments/count', getCommentCount);


// Create a new comment for a specific blog (public)
router.post('/:blogId/comments', createComment);

// Admin routes - require authentication and admin privileges
router.use(authenticateToken, adminOnly);

// Delete a comment (admin only)
router.delete('/:id', deleteComment);

// Archive a comment (admin only)
router.patch('/:id/archive', archiveComment);

module.exports = router;
