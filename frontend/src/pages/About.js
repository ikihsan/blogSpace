

import React from 'react';
import aboutPhoto from '../assets/images/about-photo.jpg';

const About = () => {
  return (
    <div className="min-h-screen bg-[#181f2a] text-white px-4 pb-10">
      <header className="pt-10 pb-4 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-purple-400 mb-2">About Me</h1>
        <div className="flex justify-center mb-6">
          <div className="rounded-xl overflow-hidden shadow-lg border-4 border-purple-300 animate-fadeIn" style={{ width: 180, height: 180, background: 'rgba(99,102,241,0.15)' }}>
            <img src={aboutPhoto} alt="Fathima NK" className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" />
          </div>
        </div>
        <p className="text-lg text-gray-300 max-w-2xl mx-auto">Hi there! I'm <span className="text-purple-300 font-semibold">Fathima NK</span>, a 22-year-old engineering student sharing my journey, thoughts, and experiences through this blog.</p>
      </header>

      <section className="max-w-2xl mx-auto mb-8">
        <div className="bg-[#23293a] rounded-xl p-6 mb-6 border border-purple-700 shadow-md">
          <h2 className="text-xl font-bold text-purple-300 mb-2">About Me</h2>
          <p className="text-gray-300 mb-2">I'm currently pursuing my engineering degree at <span className="text-purple-400 font-semibold">KMCT College of Engineering</span>. At 22, I'm passionate about technology, learning, and sharing my experiences as I navigate through my academic journey and personal growth.</p>
          <p className="text-gray-400">This blog is my digital space where I document my engineering adventures, share insights about student life, and connect with fellow learners and tech enthusiasts.</p>
        </div>
      </section>

      <section className="max-w-3xl mx-auto mb-8">
        <h2 className="text-xl font-bold text-purple-300 mb-4">My Journey</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-[#23293a] rounded-xl p-5 border border-purple-700 text-center shadow-md">
            <span className="text-3xl mb-2 block">🎓</span>
            <h3 className="text-lg font-semibold text-purple-200 mb-1">Student</h3>
            <p className="text-gray-400 text-sm">Engineering at KMCT College</p>
          </div>
          <div className="bg-[#23293a] rounded-xl p-5 border border-purple-700 text-center shadow-md">
            <span className="text-3xl mb-2 block">💻</span>
            <h3 className="text-lg font-semibold text-purple-200 mb-1">Tech Enthusiast</h3>
            <p className="text-gray-400 text-sm">Exploring new technologies</p>
          </div>
          <div className="bg-[#23293a] rounded-xl p-5 border border-purple-700 text-center shadow-md">
            <span className="text-3xl mb-2 block">📝</span>
            <h3 className="text-lg font-semibold text-purple-200 mb-1">Blogger</h3>
            <p className="text-gray-400 text-sm">Sharing experiences & insights</p>
          </div>
        </div>
      </section>

      <section className="max-w-3xl mx-auto mb-8">
        <h2 className="text-xl font-bold text-purple-300 mb-4">What I Share</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-[#23293a] rounded-xl p-4 border border-purple-700 text-center shadow-md">
            <span className="text-lg mb-1 block">�️</span>
            <p className="text-purple-200 font-semibold">Tech Projects</p>
          </div>
          <div className="bg-[#23293a] rounded-xl p-4 border border-purple-700 text-center shadow-md">
            <span className="text-lg mb-1 block">�</span>
            <p className="text-purple-200 font-semibold">Learning Insights</p>
          </div>
          <div className="bg-[#23293a] rounded-xl p-4 border border-purple-700 text-center shadow-md">
            <span className="text-lg mb-1 block">�</span>
            <p className="text-purple-200 font-semibold">Personal Growth</p>
          </div>
          <div className="bg-[#23293a] rounded-xl p-4 border border-purple-700 text-center shadow-md">
            <span className="text-lg mb-1 block">🏫</span>
            <p className="text-purple-200 font-semibold">Engineering Life</p>
          </div>
        </div>
      </section>

      <section className="max-w-2xl mx-auto mb-8">
        <h2 className="text-xl font-bold text-purple-300 mb-4">Let's Connect</h2>
        <div className="bg-[#23293a] rounded-xl p-6 border border-purple-700 shadow-md text-center">
          <p className="text-gray-300 mb-4">I love connecting with fellow students, tech enthusiasts, and anyone who's interested in engineering, learning, or just sharing experiences. Feel free to reach out!</p>
          <div className="flex justify-center gap-4">
            <a href="https://instagram.com/" target="_blank" rel="noopener noreferrer" className="bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2 px-4 rounded transition-colors">Instagram</a>
            <a href="mailto:fathima@example.com" className="bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2 px-4 rounded transition-colors">Contact Me</a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
