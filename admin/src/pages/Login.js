import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await login(email, password);
      navigate('/');
    } catch (error) {
      let errorMsg = 'Login failed';
      if (error.response) {
        if (error.response.data?.message) {
          errorMsg = error.response.data.message;
        } else if (typeof error.response.data === 'string') {
          errorMsg = error.response.data;
        } else if (error.response.data?.error) {
          errorMsg = error.response.data.error;
        } else {
          errorMsg = JSON.stringify(error.response.data);
        }
      } else if (error.message) {
        errorMsg = error.message;
      }
      toast.error(errorMsg);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f2027] via-[#2c5364] to-[#1c1c1c] p-0">
      <div className="max-w-md w-full bg-white/10 backdrop-blur-2xl p-12 rounded-3xl shadow-2xl border border-white/20 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none z-0" style={{background: 'radial-gradient(circle at 60% 40%, #6366f1 0%, transparent 70%)'}}></div>
        <h2 className="text-5xl font-extrabold text-center bg-gradient-to-r from-[#6366f1] via-[#8b5cf6] to-[#ec4899] bg-clip-text text-transparent mb-10 drop-shadow-lg z-10 relative animate-pulse">Admin Login</h2>
        <form onSubmit={handleSubmit} className="space-y-8 z-10 relative">
          <div>
            <label className="block text-lg font-bold text-indigo-300 mb-2" htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-white/20 border border-indigo-700 rounded-xl text-white placeholder-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-lg shadow"
              required
            />
          </div>
          <div>
            <label className="block text-lg font-bold text-indigo-300 mb-2" htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-white/20 border border-indigo-700 rounded-xl text-white placeholder-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-lg shadow"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] text-white font-bold py-3 px-4 rounded-2xl transition-all shadow-xl disabled:opacity-50 text-lg hover:scale-105 hover:from-[#8b5cf6] hover:to-[#6366f1]"
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
