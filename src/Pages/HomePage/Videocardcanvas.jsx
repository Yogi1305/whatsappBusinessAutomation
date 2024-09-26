import React from 'react';
import { motion } from 'framer-motion';

const VideoSection = ({ videoSrc, title, description }) => {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center">
          <motion.div 
            className="w-full lg:w-1/2 lg:pl-12"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h2 className="text-4xl font-bold mb-6 text-gray-800">{title}</h2>
            <p className="text-xl text-gray-600 mb-8">{description}</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-green-500 text-white font-bold py-3 px-8 rounded-full text-lg shadow-lg hover:bg-green-600 transition duration-300"
            >
              Learn More
            </motion.button>
          </motion.div>
          <motion.div 
            className="w-full lg:w-1/2 mb-12 lg:mb-0"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <video 
              className="w-full rounded-lg shadow-2xl"
              controls
              autoPlay
              muted
              loop
            >
              <source src={videoSrc} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default VideoSection;