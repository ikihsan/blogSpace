const { Blog, BlogImage, User, Comment } = require('../models');
const { Op, Sequelize } = require('sequelize');
const Joi = require('joi');
const { getImageUrl } = require('../middleware/uploadMiddleware');
const { sequelize } = require('../config/database');

const createBlogSchema = Joi.object({
  title: Joi.string().min(3).max(200).required(),
  content: Joi.string().min(20).required(),
  status: Joi.string().valid('draft', 'published').default('draft')
});

const updateBlogSchema = Joi.object({
  title: Joi.string().min(3).max(200).optional(),
  content: Joi.string().min(20).optional(),
  status: Joi.string().valid('draft', 'published', 'archived').optional()
});

// Public endpoints
const getAllBlogs = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;
    const offset = (page - 1) * limit;

    const whereClause = {
      status: 'published',
      [Op.or]: [
        { title: { [Op.iLike]: `%${search}%` } },
        { content: { [Op.iLike]: `%${search}%` } }
      ]
    };

    const { count, rows } = await Blog.findAndCountAll({
      where: whereClause,
      include: [
        { model: User, attributes: ['email'] },
        { model: BlogImage, as: 'images', attributes: ['imageUrl'] }
      ],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset),
      distinct: true
    });

    res.json({
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      blogs: rows
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getBlogBySlug = async (req, res) => {
  try {
    const blog = await Blog.findOne({
      where: { slug: req.params.slug, status: 'published' },
      include: [
        { model: User, attributes: ['email'] },
        { model: BlogImage, as: 'images', attributes: ['imageUrl'] },
        {
          model: Comment,
          as: 'comments',
          attributes: ['id', 'username', 'content', 'createdAt', 'updatedAt'],
          order: [['createdAt', 'ASC']]
        }
      ]
    });

    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    // Increment view count
    blog.views += 1;
    await blog.save();

    res.json(blog);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Admin endpoints
const createBlog = async (req, res) => {
  try {
    const { error } = createBlogSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { title, content, status } = req.body;
    const blog = await Blog.create({
      title,
      content,
      status,
      userId: req.user.id
    });

    if (req.files) {
      for (const file of req.files) {
        await BlogImage.create({
          imageUrl: getImageUrl(file),
          blogId: blog.id
        });
      }
    }

    res.status(201).json(blog);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const updateBlog = async (req, res) => {
  try {
    const { error } = updateBlogSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const blog = await Blog.findByPk(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    await blog.update(req.body);

    if (req.files) {
      // Optionally clear existing images first
      // await BlogImage.destroy({ where: { blogId: blog.id } });
      for (const file of req.files) {
        await BlogImage.create({
          imageUrl: getImageUrl(file),
          blogId: blog.id
        });
      }
    }

    const updatedBlog = await Blog.findByPk(req.params.id, {
        include: [{ model: BlogImage, as: 'images' }]
    });

    res.json(updatedBlog);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findByPk(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    // Images will be deleted via CASCADE constraint
    await blog.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getAdminBlogs = async (req, res) => {
    try {
      const { page = 1, limit = 10, status, search = '' } = req.query;
      const offset = (page - 1) * limit;
  
      let whereClause = {
        [Op.or]: [
          { title: { [Op.iLike]: `%${search}%` } },
        ]
      };

      if(status) {
        whereClause.status = status;
      }
  
      const { count, rows } = await Blog.findAndCountAll({
        where: whereClause,
        include: [
          { model: User, attributes: ['email'] },
          { model: BlogImage, as: 'images', attributes: ['imageUrl'] }
        ],
        order: [['createdAt', 'DESC']],
        limit: parseInt(limit),
        offset: parseInt(offset),
        distinct: true
      });
  
      res.json({
        totalPages: Math.ceil(count / limit),
        currentPage: parseInt(page),
        blogs: rows
      });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  };

const getDashboardStats = async (req, res) => {
    try {
        const totalBlogs = await Blog.count();
        const publishedBlogs = await Blog.count({ where: { status: 'published' } });
        const draftBlogs = await Blog.count({ where: { status: 'draft' } });
        const totalViews = await Blog.sum('views');

        const recentBlogs = await Blog.findAll({
            limit: 5,
            order: [['createdAt', 'DESC']],
            attributes: ['id', 'title', 'status', 'createdAt']
        });

        res.json({
            totalBlogs,
            publishedBlogs,
            draftBlogs,
            totalViews: totalViews || 0,
            recentBlogs
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const getAdminBlogById = async (req, res) => {
  try {
    const blog = await Blog.findByPk(req.params.id, {
      include: [
        { model: User, attributes: ['email'] },
        { model: BlogImage, as: 'images', attributes: ['imageUrl'] }
      ]
    });

    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    res.json(blog);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  // Public endpoints
  getAllBlogs,
  getBlogBySlug,
  // Admin endpoints
  createBlog,
  updateBlog,
  deleteBlog,
  getAdminBlogs,
  getDashboardStats,
  getAdminBlogById
};
