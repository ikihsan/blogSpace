const User = require('./User');
const Blog = require('./Blog');
const BlogImage = require('./BlogImage');

// Define associations
User.hasMany(Blog, { foreignKey: 'userId', onDelete: 'CASCADE' });
Blog.belongsTo(User, { foreignKey: 'userId' });

Blog.hasMany(BlogImage, { foreignKey: 'blogId', onDelete: 'CASCADE', as: 'images' });
BlogImage.belongsTo(Blog, { foreignKey: 'blogId' });

module.exports = {
  User,
  Blog,
  BlogImage
};
