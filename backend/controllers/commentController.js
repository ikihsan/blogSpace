const { Comment, Blog } = require('../models');
const Joi = require('joi');

// Validation schemas
const createCommentSchema = Joi.object({
  username: Joi.string().min(2).max(50).required(),
  content: Joi.string().min(1).max(1000).required()
});

// Get all comments for a specific blog
const getCommentsByBlogId = async (req, res) => {
  try {
    const { blogId } = req.params;

    // Check if blog exists
    const blog = await Blog.findByPk(blogId);
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    const comments = await Comment.findAll({
      where: { blogId },
      order: [['createdAt', 'ASC']],
      attributes: ['id', 'username', 'content', 'createdAt', 'updatedAt']
    });

    res.json({
      blogId,
      comments,
      totalComments: comments.length
    });
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create a new comment
const createComment = async (req, res) => {
  try {
    const { error } = createCommentSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { blogId } = req.params;
    const { username, content } = req.body;

    // Check if blog exists
    const blog = await Blog.findByPk(blogId);
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    const comment = await Comment.create({
      username: username.trim(),
      content: content.trim(),
      blogId
    });

    // Return the created comment with formatted data
    const formattedComment = {
      id: comment.id,
      username: comment.username,
      content: comment.content,
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt
    };

    res.status(201).json({
      message: 'Comment added successfully',
      comment: formattedComment
    });
  } catch (error) {
    console.error('Error creating comment:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get comment count for a blog (for displaying comment counts)
const getCommentCount = async (req, res) => {
  try {
    const { blogId } = req.params;

    const count = await Comment.count({
      where: { blogId }
    });

    res.json({ blogId, commentCount: count });
  } catch (error) {
    console.error('Error getting comment count:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getCommentsByBlogId,
  createComment,
  getCommentCount
};
