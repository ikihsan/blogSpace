import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const BlogCard = ({ blog }) => {
  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return 'https://via.placeholder.com/400x250';

    // If it's already a full URL (Cloudinary), return as is
    if (imageUrl.startsWith('http')) {
      return imageUrl;
    }

    // If it's a local path, prepend the API URL
    return `${process.env.REACT_APP_API_URL.replace('/api', '')}${imageUrl}`;
  };

  const imageUrl = blog.images && blog.images.length > 0
    ? getImageUrl(blog.images[0].imageUrl)
    : 'https://via.placeholder.com/400x250';

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-gray-800 rounded-lg overflow-hidden shadow-lg"
    >
      <Link to={`/blog/${blog.slug}`}>
        <img className="w-full h-48 object-cover" src={imageUrl} alt={blog.title} />
        <div className="p-6">
          <h3 className="text-xl font-bold mb-2 text-white">{blog.title}</h3>
          <p className="text-gray-400 mb-4 line-clamp-3">{blog.content.substring(0, 100)}...</p>
          <div className="text-sm text-gray-500">
            <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
            <span className="mx-2">&bull;</span>
            <span>{blog.views} views</span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default BlogCard;
