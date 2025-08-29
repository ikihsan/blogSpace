import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ManageBlogs from './pages/ManageBlogs';
import NewBlog from './pages/NewBlog';
import EditBlog from './pages/EditBlog';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import NotFound from './pages/NotFound'; // Add this import

const queryClient = new QueryClient();

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <Router basename="/admin">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="blogs" element={<ManageBlogs />} />
              <Route path="blogs/new" element={<NewBlog />} />
              <Route path="blogs/edit/:id" element={<EditBlog />} />
              <Route path="*" element={<NotFound />} /> {/* Catch-all for unknown routes */}
            </Route>
            <Route path="*" element={<NotFound />} /> {/* Top-level catch-all */}
          </Routes>
        </Router>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
        />
      </QueryClientProvider>
    </AuthProvider>
  );
}

export default App;
