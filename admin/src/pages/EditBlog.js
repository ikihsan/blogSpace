import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const fetchBlog = async (id) => {
  const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/blogs/admin/all?id=${id}`);
  // Assuming the endpoint can filter by ID and returns it in the blogs array
  return data.blogs[0];
};

const EditBlog = () => {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  
  const { data: blog, isLoading, isError } = useQuery(['blog', id], () => fetchBlog(id));

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [status, setStatus] = useState('draft');
  const [images, setImages] = useState([]);

  useEffect(() => {
    if (blog) {
      setTitle(blog.title);
      setContent(blog.content);
      setStatus(blog.status);
    }
  }, [blog]);

  const mutation = useMutation(
    (updatedBlog) => {
      const formData = new FormData();
      formData.append('title', updatedBlog.title);
      formData.append('content', updatedBlog.content);
      formData.append('status', updatedBlog.status);
      if (updatedBlog.images.length > 0) {
        for (let i = 0; i < updatedBlog.images.length; i++) {
          formData.append('images', updatedBlog.images[i]);
        }
      }
      return axios.put(`${process.env.REACT_APP_API_URL}/blogs/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
    },
    {
      onSuccess: () => {
        toast.success('Blog updated successfully!');
        queryClient.invalidateQueries('adminBlogs');
        queryClient.invalidateQueries(['blog', id]);
        navigate('/blogs');
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Error updating blog');
      }
    }
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate({ title, content, status, images });
  };

  const handleImageChange = (e) => {
    if (e.target.files.length > 3) {
      toast.warn('You can only upload a maximum of 3 images');
      return;
    }
    setImages(e.target.files);
  };

  if (isLoading) return <div>Loading blog...</div>;
  if (isError) return <div className="text-red-500">Error loading blog data.</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Edit Blog</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-300">Title</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 block w-full bg-gray-800 border border-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>
        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-300">Content</label>
          <textarea
            id="content"
            rows="10"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="mt-1 block w-full bg-gray-800 border border-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            required
          ></textarea>
        </div>
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-300">Status</label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="mt-1 block w-full bg-gray-800 border border-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
        </div>
        <div>
            <h3 className="text-sm font-medium text-gray-300 mb-2">Current Images</h3>
            <div className="flex space-x-4">
                {blog.images && blog.images.map(img => (
                    <img key={img.id} src={`${process.env.REACT_APP_API_URL.replace('/api', '')}${img.imageUrl}`} alt="blog" className="h-24 w-24 object-cover rounded-md" />
                ))}
            </div>
        </div>
        <div>
          <label htmlFor="images" className="block text-sm font-medium text-gray-300">Upload New Images (optional, replaces existing)</label>
          <input
            type="file"
            id="images"
            multiple
            accept="image/*"
            onChange={handleImageChange}
            className="mt-1 block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
          />
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={mutation.isLoading}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg disabled:opacity-50"
          >
            {mutation.isLoading ? 'Updating...' : 'Update Blog'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditBlog;
