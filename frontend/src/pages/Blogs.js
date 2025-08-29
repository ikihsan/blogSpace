import React, { useState } from 'react';
import { useQuery } from 'react-query';
import axios from 'axios';
import BlogCard from '../components/BlogCard';
import { motion } from 'framer-motion';

const fetchBlogs = async (page, search) => {
  const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/blogs`, {
    params: { page, search, limit: 9 }
  });
  return data;
};

const Blogs = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const { data, isLoading, isError, isFetching } = useQuery(['blogs', page, search], () => fetchBlogs(page, search), { keepPreviousData: true });

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1); // Reset to first page on new search
  };

  return (
    <motion.div className="max-w-7xl mx-auto py-12 px-4" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
      <motion.h1 className="text-4xl font-bold mb-8 text-center" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>All Blog Posts</motion.h1>
      <motion.div className="mb-8 max-w-lg mx-auto" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }}>
        <input
          type="text"
          value={search}
          onChange={handleSearchChange}
          placeholder="Search for posts..."
          className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </motion.div>

      {isLoading ? (
        <p className="text-center">Loading posts...</p>
      ) : isError ? (
        <p className="text-center text-red-500">Error loading posts.</p>
      ) : (
        <>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {data && data.blogs && data.blogs.map((blog, idx) => (
              <motion.div key={blog.id} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: idx * 0.1 }}>
                <BlogCard blog={blog} />
              </motion.div>
            ))}
          </div>

          <motion.div className="flex justify-center items-center mt-12 space-x-4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.3 }}>
            <button
              onClick={() => setPage(old => Math.max(old - 1, 1))}
              disabled={page === 1}
              className="px-4 py-2 bg-gray-700 rounded disabled:opacity-50"
            >
              Previous
            </button>
            <span>Page {page} of {data ? data.totalPages : 1}</span>
            <button
              onClick={() => setPage(old => (data && data.blogs && data.blogs.length > 0 ? old + 1 : old))}
              disabled={data ? page === data.totalPages : true}
              className="px-4 py-2 bg-gray-700 rounded disabled:opacity-50"
            >
              Next
            </button>
          </motion.div>
          {isFetching && <p className="text-center mt-4">Updating...</p>}
        </>
      )}
    </motion.div>
  );
};

export default Blogs;



