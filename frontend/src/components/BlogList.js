import React from 'react';
import { useQuery } from 'react-query';
import axios from 'axios';
import BlogCard from '../components/BlogCard';
import { Link } from 'react-router-dom';

const fetchBlogs = async () => {
  const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/blogs?limit=3`);
  return data.blogs;
};

const BlogList = () => {
  const { data: blogs, isLoading, isError } = useQuery('latestBlogs', fetchBlogs);

  if (isLoading) return <p className="text-center">Loading posts...</p>;
  if (isError) return <p className="text-center text-red-500">Error loading posts.</p>;

  return (
    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      {blogs.map(blog => (
        <BlogCard key={blog.id} blog={blog} />
      ))}
       <div className="col-span-full text-center mt-8">
            <Link to="/blogs" className="text-indigo-400 hover:text-indigo-300 font-semibold">
                View All Posts &rarr;
            </Link>
        </div>
    </div>
  );
};

export default BlogList;
