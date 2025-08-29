import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

const fetchAdminBlogs = async (page, status, search) => {
  const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/blogs/admin/all`, {
    params: { page, status, search }
  });
  return data;
};

const ManageBlogs = () => {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState('');
  const [search, setSearch] = useState('');
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery(['adminBlogs', page, status, search], () => fetchAdminBlogs(page, status, search), { keepPreviousData: true });

  const deleteMutation = useMutation(
    (id) => axios.delete(`${process.env.REACT_APP_API_URL}/blogs/${id}`),
    {
      onSuccess: () => {
        toast.success('Blog deleted successfully');
        queryClient.invalidateQueries('adminBlogs');
      },
      onError: () => {
        toast.error('Error deleting blog');
      }
    }
  );

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this blog?')) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Manage Blogs</h1>
      
      <div className="flex justify-between items-center mb-6">
        <div className="flex space-x-4">
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg"
          />
          <select
            value={status}
            onChange={(e) => { setStatus(e.target.value); setPage(1); }}
            className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg"
          >
            <option value="">All Statuses</option>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
        </div>
        <Link to="/blogs/new" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg">
          Create New Blog
        </Link>
      </div>

      {isLoading ? (
        <div>Loading blogs...</div>
      ) : isError ? (
        <div className="text-red-500">Error loading blogs.</div>
      ) : (
        <div className="bg-gray-800 rounded-lg shadow">
          <table className="w-full">
            <thead className="bg-gray-700">
              <tr>
                <th className="p-4 text-left">Title</th>
                <th className="p-4 text-left">Status</th>
                <th className="p-4 text-left">Created At</th>
                <th className="p-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.blogs.map(blog => (
                <tr key={blog.id} className="border-b border-gray-700 hover:bg-gray-700">
                  <td className="p-4">{blog.title}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      blog.status === 'published' ? 'bg-green-500 text-green-900' : 
                      blog.status === 'draft' ? 'bg-yellow-500 text-yellow-900' : 'bg-gray-500 text-gray-900'
                    }`}>{blog.status}</span>
                  </td>
                  <td className="p-4">{new Date(blog.createdAt).toLocaleDateString()}</td>
                  <td className="p-4 flex space-x-2">
                    <Link to={`/blogs/edit/${blog.id}`} className="text-indigo-400 hover:text-indigo-300">
                      <PencilIcon className="h-5 w-5" />
                    </Link>
                    <button onClick={() => handleDelete(blog.id)} className="text-red-400 hover:text-red-300">
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      <div className="flex justify-center items-center mt-6 space-x-4">
        <button onClick={() => setPage(p => Math.max(p - 1, 1))} disabled={page === 1} className="px-4 py-2 bg-gray-700 rounded disabled:opacity-50">
          Previous
        </button>
        <span>Page {page} of {data?.totalPages || 1}</span>
        <button onClick={() => setPage(p => p + 1)} disabled={page === data?.totalPages || data?.blogs.length === 0} className="px-4 py-2 bg-gray-700 rounded disabled:opacity-50">
          Next
        </button>
      </div>
    </div>
  );
};

export default ManageBlogs;
