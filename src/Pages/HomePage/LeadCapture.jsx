import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Rocket, TrendingUp, Zap } from 'lucide-react';

const LeadCapturePopup = ({ onClose, onSubmit }) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isHovered, setIsHovered] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }
    onSubmit(email);
  
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4"
      >
        <motion.div
          className="bg-gradient-to-br from-[#121212] to-[#1e1e1e] border border-green-500 rounded-2xl shadow-2xl shadow-green-500/20 w-full max-w-md overflow-hidden"
          initial={{ scale: 0.8, y: 50 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.8, y: 50 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors z-50"
          >
            <X size={24} />
          </button>

          {/* Background Glow Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-green-900/20 to-blue-900/20 opacity-50 pointer-events-none"></div>

          {/* Content */}
          <div className="relative z-10 p-8 text-center">
            <div className="flex justify-center mb-6">
              <Rocket className="text-green-400" size={48} />
            </div>

            <h2 className="text-3xl font-bold text-white mb-4">
              Accelerate Your <span className="text-green-400">WhatsApp Marketing</span>
            </h2>

            <p className="text-gray-300 mb-6 text-lg">
              Transform your business with insider strategies, exclusive tips, and cutting-edge insights.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError('');
                  }}
                  placeholder="Enter your professional email"
                  className="w-full p-4 bg-gray-800 border border-gray-700 rounded-lg text-white 
                    focus:outline-none focus:ring-2 focus:ring-green-500 
                    transition-all duration-300 placeholder-gray-500"
                  required
                />
                {error && (
                  <p className="text-red-400 text-sm mt-2 text-left">{error}</p>
                )}
              </div>

              <motion.button
                type="submit"
                className="w-full bg-green-500 text-black py-4 rounded-lg text-lg font-bold 
                  hover:bg-green-400 focus:outline-none flex items-center justify-center
                  transition-all duration-300 group"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                <span className="flex items-center">
                  <Send className="mr-2 group-hover:translate-x-1 transition-transform" size={20} />
                  Unlock My Growth
                </span>
              </motion.button>
            </form>

            {/* Benefits */}
            <div className="mt-6 text-gray-400 text-sm space-y-2">
              <div className="flex items-center justify-center space-x-2">
                <TrendingUp size={16} className="text-green-400" />
                <span>No spam. Only growth-focused content.</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <Zap size={16} className="text-green-400" />
                <span>Unsubscribe anytime, zero commitment.</span>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default LeadCapturePopup;