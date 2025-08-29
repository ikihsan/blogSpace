const express = require('express');
const {
  getCommentsByBlogId,
  createComment,
  getCommentCount
} = require('../controllers/commentController');

const router = express.Router();

// Get all comments for a specific blog
router.get('/blogs/:blogId/comments', getCommentsByBlogId);

// Get comment count for a specific blog
router.get('/blogs/:blogId/comments/count', getCommentCount);

// Create a new comment for a specific blog
router.post('/blogs/:blogId/comments', createComment);

module.exports = router;
