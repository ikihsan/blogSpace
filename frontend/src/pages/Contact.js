import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import emailjs from 'emailjs-com';

const Contact = () => {
  const form = useRef();
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const sendEmail = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    emailjs.sendForm('service_xxx', 'template_xxx', form.current, 'user_xxx')
      .then(() => {
        setSent(true);
        setLoading(false);
      }, (err) => {
        setError('Failed to send. Try again later.');
        setLoading(false);
      });
  };

  return (
    <motion.div className="max-w-4xl mx-auto py-12 px-4 text-center" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
      <motion.h1 className="text-4xl font-bold mb-4" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>Contact Me</motion.h1>
      <motion.p className="text-lg text-gray-200 mb-8" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }}>
        Feel free to reach out for collaborations, questions, or just to say hi!
      </motion.p>
      <motion.form ref={form} onSubmit={sendEmail} className="bg-[#181f2a] rounded-xl p-8 shadow-2xl max-w-lg mx-auto flex flex-col gap-6 border border-indigo-900" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.3 }}>
        <input type="text" name="name" placeholder="Your Name" required className="px-4 py-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        <input type="email" name="email" placeholder="Your Email" required className="px-4 py-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        <textarea name="message" placeholder="Your Message" required rows={5} className="px-4 py-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        <motion.button type="submit" whileHover={{ scale: 1.05 }} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition-colors" disabled={loading}>
          {loading ? 'Sending...' : 'Send Message'}
        </motion.button>
        {sent && <p className="text-green-400 mt-2">Message sent successfully!</p>}
        {error && <p className="text-red-400 mt-2">{error}</p>}
      </motion.form>
      <motion.div className="flex flex-col items-center gap-4 mt-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.4 }}>
        <motion.a href="https://www.instagram.com/fathma.nk" target="_blank" rel="noopener noreferrer" className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded transition-colors mt-2" whileHover={{ scale: 1.08 }}>
          Contact me via Instagram
        </motion.a>
        <motion.a href="mailto:fathima@fathivlog.com" className="bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2 px-4 rounded transition-colors" whileHover={{ scale: 1.08 }}>
          Email Me
        </motion.a>
      </motion.div>
    </motion.div>
  );
};

export default Contact;
