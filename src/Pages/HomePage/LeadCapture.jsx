import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Rocket, TrendingUp, Zap } from 'lucide-react';

const LeadCapturePopup = ({ onClose, onSubmit }) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

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
        className="fixed bottom-4 right-4 z-50 p-4"
      >
        <motion.div
          className="bg-black border border-[#25D366] rounded-xl shadow-lg w-[380px]"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 50, opacity: 0 }}
        >
          <div className="p-6">
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-5 right-5 text-gray-400 hover:text-white"
            >
              <X size={20} />
            </button>

            <h2 className="text-xl font-bold text-white mb-2">
              📬 Stay Updated!
            </h2>
            
            <p className="text-gray-400 text-sm mb-4">
              Get the latest WhatsApp marketing strategies and Nuren AI updates delivered to your inbox.
            </p>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError('');
                  }}
                  placeholder="Your email address"
                  className="w-full p-2.5 bg-gray-900 border border-gray-700 rounded-lg text-white 
                    focus:outline-none focus:border-[#25D366] text-sm"
                  required
                />
                {error && (
                  <p className="text-red-400 text-xs mt-1">{error}</p>
                )}
              </div>

              <button
                type="submit"
                className="w-full bg-[#25D366] text-black py-2.5 rounded-lg text-sm font-medium 
                  hover:bg-[#128C7E] transition-colors flex items-center justify-center"
              >
                <Send className="mr-2 h-4 w-4" />
                Subscribe to Newsletter
              </button>
            </form>

            <p className="text-gray-500 text-xs mt-3 text-center">
              No spam. Unsubscribe anytime.
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default LeadCapturePopup;