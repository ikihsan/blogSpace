import React from 'react';
import { useQuery } from 'react-query';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

const fetchBlogBySlug = async (slug) => {
  const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/blogs/${slug}`);
  return data;
};

const BlogDetail = () => {
  const { slug } = useParams();
  const { data: blog, isLoading, isError } = useQuery(['blog', slug], () => fetchBlogBySlug(slug));

  if (isLoading) return <div className="text-center py-12">Loading...</div>;
  if (isError) return <div className="text-center py-12 text-red-500">Error loading post.</div>;

  const API_BASE_URL = process.env.REACT_APP_API_URL.replace('/api', '');

  return (
    <>
      <Helmet>
        <title>{`${blog.title} - ${process.env.REACT_APP_SITE_NAME}`}</title>
        <meta name="description" content={blog.content.substring(0, 160)} />
      </Helmet>
      <div className="max-w-4xl mx-auto py-12 px-4">
        <h1 className="text-4xl font-bold mb-4 text-white">{blog.title}</h1>
        <div className="text-gray-400 mb-8">
          <span>By {blog.User?.email || 'Admin'}</span>
          <span className="mx-2">&bull;</span>
          <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
          <span className="mx-2">&bull;</span>
          <span>{blog.views} views</span>
        </div>
        
        {blog.images && blog.images.length > 0 && (
          <div className="mb-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {blog.images.map(image => (
              <img 
                key={image.id} 
                src={`${API_BASE_URL}${image.imageUrl}`} 
                alt={blog.title} 
                className="rounded-lg object-cover w-full h-64"
              />
            ))}
          </div>
        )}

        <div className="prose prose-invert max-w-none text-gray-300" dangerouslySetInnerHTML={{ __html: blog.content }}>
        </div>
      </div>
    </>
  );
};

export default BlogDetail;
