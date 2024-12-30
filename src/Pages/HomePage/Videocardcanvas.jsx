import React, { useState, useEffect } from 'react';
import { ChevronRight, Phone, MessageCircle, Users, Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { motion } from 'framer-motion';

// Particle component for background animation
const Particle = ({ animate }) => (
  <motion.div
    className="absolute rounded-full bg-green-400 opacity-20"
    animate={animate}
    transition={{
      duration: Math.random() * 10 + 20,
      repeat: Infinity,
      repeatType: "reverse",
    }}
    style={{
      width: Math.random() * 30 + 10,
      height: Math.random() * 30 + 10,
    }}
  />
);

// Navigation Component
const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-black/90 backdrop-blur-sm' : 'bg-transparent'
    }`}>
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <span className="text-2xl font-bold text-green-400">WhatsApp Pro</span>
          </div>
          <div className="hidden md:block">
            <div className="flex items-center space-x-8">
              <a href="#demo" className="text-gray-300 hover:text-green-400">Demo</a>
              <a href="#features" className="text-gray-300 hover:text-green-400">Features</a>
              <a href="#testimonials" className="text-gray-300 hover:text-green-400">Testimonials</a>
              <a href="#contact" className="text-gray-300 hover:text-green-400">Contact</a>
              <button className="bg-green-500 text-black px-6 py-2 rounded-full hover:bg-green-400 transition-colors">
                Try Free
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

// Updated Hero Section Component
const HeroSection = () => (
  <div className="py-24 bg-black relative min-h-screen">
    {/* Particle background */}
    {[...Array(20)].map((_, i) => (
      <Particle
        key={i}
        animate={{
          x: [Math.random() * window.innerWidth, Math.random() * window.innerWidth],
          y: [Math.random() * window.innerHeight, Math.random() * window.innerHeight],
        }}
      />
    ))}

    <div className="container mx-auto px-6 lg:px-12 pt-16">
      <div className="flex flex-col lg:flex-row items-center gap-12">
        <motion.div
          className="w-full lg:w-1/2 lg:pl-16"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className="text-7xl font-extrabold mb-6 text-green-500 leading-tight">
            Transform Your Customer Engagement
          </h2>
          <p className="text-xl text-white mb-10 leading-relaxed">
            Automate customer interactions, boost sales, and provide 24/7 support with our intelligent WhatsApp solution.
          </p>

          {/* CTAs Section */}
          <div className="flex flex-col md:flex-row gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{ backgroundColor: "#f87171" }}
              className="text-white font-bold py-4 px-10 rounded-full text-lg shadow-lg hover:bg-green-600 transition duration-300"
            >
              Get Started Now
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{ backgroundColor: "#4a90e2" }}
              className="text-white font-bold py-4 px-10 rounded-full text-lg shadow-lg hover:bg-purple-600 transition duration-300"
            >
              Book a Demo
            </motion.button>
          </div>
        </motion.div>

        <motion.div
          className="w-full lg:w-1/2 mb-12 lg:mb-0 relative"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Placeholder for your image */}
          <div className="relative w-full" style={{ marginTop: '-50px' }}>
            <img
              src="/api/placeholder/600/400"
              alt="WhatsApp Automation Dashboard"
              className="w-full h-auto rounded-lg shadow-2xl"
            />
          </div>
        </motion.div>
      </div>
    </div>
  </div>
);

export default HeroSection;