import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, Users } from 'lucide-react';
import { PopupButton } from 'react-calendly';

const CalendlySection = () => {
  return (
    <section className="py-20 bg-gradient-to-r from-green-50 to-blue-50 relative overflow-hidden">
      <motion.div
        className="absolute top-10 left-10 w-20 h-20 bg-green-200 rounded-full opacity-50"
        animate={{ y: [0, 20, 0] }}
        transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-10 right-10 w-16 h-16 bg-blue-200 rounded-full opacity-50"
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
          <h2 className="text-5xl font-bold text-gray-800 mb-4">Discover NurenAI in Action</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            See how NurenAI can revolutionize your WhatsApp business communication. Book a personalized demo with our experts today.
          </p>
        </motion.div>
        
        <div className="flex flex-col md:flex-row items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-full md:w-1/2 mb-8 md:mb-0"
          >
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <div className="flex items-center mb-6">
                <Calendar className="w-8 h-8 text-green-500 mr-4" />
                <h3 className="text-2xl font-bold text-gray-800">Flexible Scheduling</h3>
              </div>
              <p className="text-gray-600 mb-6">
                Choose a convenient time for your personalized demo. Our calendar adapts to your schedule.
              </p>
              <div className="flex items-center mb-6">
                <Clock className="w-8 h-8 text-green-500 mr-4" />
                <h3 className="text-2xl font-bold text-gray-800">30-Minute Demo</h3>
              </div>
              <p className="text-gray-600 mb-6">
                In just half an hour, explore NurenAI's features and get answers to all your questions.
              </p>
              <div className="flex items-center">
                <Users className="w-8 h-8 text-green-500 mr-4" />
                <h3 className="text-2xl font-bold text-gray-800">Expert Guidance</h3>
              </div>
              <p className="text-gray-600 mt-2">
                Connect with our specialists who will tailor the demo to your business needs.
              </p>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="w-full md:w-1/2 md:pl-8 flex flex-col items-center"
          >
            <h3 className="text-3xl font-bold text-gray-800 mb-6">Ready to Transform Your Business?</h3>
            <p className="text-xl text-gray-600 mb-8 text-center">
              Click the button below to schedule your personalized demo and start your journey with NurenAI.
            </p>
            <PopupButton
              url="https://calendly.com/kumar-ayush121564/30min"
              rootElement={document.getElementById("root")}
              text="Schedule Your Demo"
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-full text-lg transition duration-300 ease-in-out transform hover:scale-105"
              />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CalendlySection;