import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, Users } from 'lucide-react';
import { PopupButton } from 'react-calendly';

const CalendlySection = () => {
  return (
    <section className="py-20 bg-gradient-to-r from-gray-900 to-gray-800 relative overflow-hidden text-white">
      <motion.div
        className="absolute top-10 left-10 w-20 h-20 bg-purple-500 rounded-full opacity-20"
        animate={{ y: [0, 20, 0] }}
        transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-10 right-10 w-16 h-16 bg-blue-500 rounded-full opacity-20"
        animate={{ y: [0, -20, 0] }}
        transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
      />
      
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-purple-300 mb-4">Experience NurenAI Live</h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            See how NurenAI enhances your WhatsApp business communication. Book a demo today.
          </p>
        </motion.div>
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-full md:w-1/2"
          >
            <div className="bg-gray-800 p-6 rounded-lg shadow-xl">
              <div className="flex items-center mb-4">
                <Calendar className="w-6 h-6 text-purple-400 mr-3" />
                <h3 className="text-xl font-bold text-white">Flexible Scheduling</h3>
              </div>
              <p className="text-gray-300 mb-4">
                Choose a time that works for you. Our calendar adapts to your schedule.
              </p>
              <div className="flex items-center mb-4">
                <Clock className="w-6 h-6 text-purple-400 mr-3" />
                <h3 className="text-xl font-bold text-white">30-Minute Demo</h3>
              </div>
              <p className="text-gray-300 mb-4">
                Explore NurenAI's features and get your questions answered in just 30 minutes.
              </p>
              <div className="flex items-center">
                <Users className="w-6 h-6 text-purple-400 mr-3" />
                <h3 className="text-xl font-bold text-white">Expert Guidance</h3>
              </div>
              <p className="text-gray-300">
                Connect with specialists for a demo tailored to your business needs.
              </p>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="w-full md:w-1/2 flex flex-col items-center"
          >
            <h3 className="text-2xl font-bold text-purple-300 mb-4">Ready to Transform Your Business?</h3>
            <p className="text-lg text-gray-300 mb-6 text-center">
              Schedule your demo and start your journey with NurenAI.
            </p>
            <PopupButton
              url="https://calendly.com/kumar-ayush121564/30min"
              rootElement={document.getElementById("root")}
              text="Schedule Your Demo"
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-full text-lg transition duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CalendlySection;