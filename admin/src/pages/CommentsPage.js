import React from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';

const fetchComments = async (blogId) => {
  const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/blogs/${blogId}/comments`);
  return data;
};

const CommentsPage = () => {
  const { blogId } = useParams();
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery(['blogComments', blogId], () => fetchComments(blogId));

  const deleteMutation = useMutation(
    (commentId) => axios.delete(`${process.env.REACT_APP_API_URL}/comments/${commentId}`),
    {
      onSuccess: () => {
        toast.success('Comment deleted');
        queryClient.invalidateQueries(['blogComments', blogId]);
      },
      onError: () => {
        toast.error('Error deleting comment');
      }
    }
  );

  const archiveMutation = useMutation(
    (commentId) => axios.patch(`${process.env.REACT_APP_API_URL}/comments/${commentId}/archive`),
    {
      onSuccess: () => {
        toast.success('Comment archived');
        queryClient.invalidateQueries(['blogComments', blogId]);
      },
      onError: () => {
        toast.error('Error archiving comment');
      }
    }
  );

  const handleDelete = (commentId) => {
    if (window.confirm('Delete this comment?')) {
      deleteMutation.mutate(commentId);
    }
  };

  const handleArchive = (commentId) => {
    if (window.confirm('Archive this comment?')) {
      archiveMutation.mutate(commentId);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f2027] via-[#2c5364] to-[#1c1c1c] text-white p-0"
    >
      <div className="max-w-4xl mx-auto py-10 px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-8"
        >
          <Link
            to="/blogs"
            className="inline-flex items-center px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-all duration-200 mb-4"
          >
            ← Back to Manage Blogs
          </Link>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent mb-2">
            Comments for Blog ID: {blogId}
          </h1>
          <p className="text-gray-400 text-lg">Manage comments for this blog</p>
        </motion.div>

        {isLoading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col justify-center items-center py-16"
          >
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-500 border-t-transparent mb-4"></div>
            <p className="text-xl text-gray-400">Loading comments...</p>
          </motion.div>
        ) : isError ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-red-900/20 border border-red-700/50 rounded-2xl p-8 text-center shadow-xl"
          >
            <h3 className="text-xl font-semibold text-red-400 mb-2">Error Loading Comments</h3>
            <p className="text-gray-300">Please try refreshing the page.</p>
          </motion.div>
        ) : data && data.comments && data.comments.length > 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-white/10 backdrop-blur-2xl rounded-3xl shadow-2xl overflow-hidden border border-white/20 relative animate-fade-in"
            style={{boxShadow:'0 8px 32px 0 rgba(31, 38, 135, 0.37)'}}
          >
            <div className="absolute inset-0 pointer-events-none z-0" style={{background: 'radial-gradient(circle at 60% 40%, #6366f1 0%, transparent 70%)'}}></div>
            <div className="p-8">
              <div className="space-y-6">
                {data.comments.map((comment, index) => (
                  <motion.div
                    key={comment.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    className="bg-gray-800/70 border border-gray-700/40 rounded-xl p-6 flex flex-col"
                  >
                    <div className="text-gray-200 font-medium mb-2">{comment.username || 'Anonymous'}</div>
                    <div className="text-gray-400 text-sm mb-4">{comment.content}</div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">{new Date(comment.createdAt).toLocaleString()}</span>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleArchive(comment.id)}
                          className="px-3 py-1 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 text-xs font-semibold transition-all"
                        >
                          Archive
                        </button>
                        <button
                          onClick={() => handleDelete(comment.id)}
                          className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 text-xs font-semibold transition-all"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16 bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-700/50 shadow-xl"
          >
            <h3 className="text-xl font-semibold text-gray-300 mb-2">No Comments Found</h3>
            <p className="text-gray-500">This blog has no active comments.</p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default CommentsPage;
