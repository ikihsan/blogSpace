const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const BlogImage = sequelize.define('BlogImage', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  imageUrl: {
    type: DataTypes.STRING,
    allowNull: false
  },
  blogId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Blogs',
      key: 'id'
    }
  }
});

module.exports = BlogImage;
