import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { Helmet, HelmetProvider } from 'react-helmet-async';


// Pages
import Home from './pages/Home';
import About from './pages/About';
import BlogDetail from './pages/BlogDetail';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';
import Blogs from './pages/Blogs';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';

// Styles
import './styles/globals.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      cacheTime: 1000 * 60 * 60, // 1 hour
      retry: 1,
    },
  },
});

function App() {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <Router>
          <Helmet>
            <title>{process.env.REACT_APP_SITE_NAME}</title>
            <meta name="description" content={process.env.REACT_APP_SITE_DESCRIPTION} />
          </Helmet>
          <ScrollToTop />
          <div className="flex flex-col min-h-screen bg-gray-900 text-white">
            <Navbar />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/blogs" element={<Blogs />} />
                <Route path="/blog/:slug" element={<BlogDetail />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </HelmetProvider>
  );
}

export default App;
