const express = require('express');
const {
  getCommentsByBlogId,
  createComment,
  getCommentCount,
  deleteComment,
  archiveComment
} = require('../controllers/commentController');

const router = express.Router();

// Get all comments for a specific blog
router.get('/blogs/:blogId/comments', getCommentsByBlogId);

// Get comment count for a specific blog
router.get('/blogs/:blogId/comments/count', getCommentCount);

// Create a new comment for a specific blog
router.post('/blogs/:blogId/comments', createComment);

// Delete a comment
router.delete('/:id', deleteComment);

// Archive a comment
router.patch('/:id/archive', archiveComment);

module.exports = router;
