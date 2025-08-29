import React, { useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const NewBlog = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [status, setStatus] = useState('draft');
  const [images, setImages] = useState([]);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const mutation = useMutation(
    (newBlog) => {
      const formData = new FormData();
      formData.append('title', newBlog.title);
      formData.append('content', newBlog.content);
      formData.append('status', newBlog.status);
      for (let i = 0; i < newBlog.images.length; i++) {
        formData.append('images', newBlog.images[i]);
      }
      return axios.post(`${process.env.REACT_APP_API_URL}/blogs`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
    },
    {
      onSuccess: () => {
        toast.success('Blog created successfully!');
        queryClient.invalidateQueries('adminBlogs');
        navigate('/blogs');
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Error creating blog');
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

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Create New Blog</h1>
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
          </select>
        </div>
        <div>
          <label htmlFor="images" className="block text-sm font-medium text-gray-300">Images (up to 3)</label>
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
            {mutation.isLoading ? 'Creating...' : 'Create Blog'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewBlog;
