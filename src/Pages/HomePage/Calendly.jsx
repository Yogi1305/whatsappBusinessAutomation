import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, Users } from 'lucide-react';
import { PopupButton } from 'react-calendly';

const CalendlySection = () => {
  return (
    <section className="py-20 bg-gradient-to-r from-blue-900 to-green-200 relative overflow-hidden text-white">
  {/* Floating motion divs */}
  <motion.div
    className="absolute top-10 left-10 w-20 h-20 bg-green-500 rounded-full opacity-20"
    animate={{ y: [0, 20, 0] }}
    transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
  />
  <motion.div
    className="absolute bottom-10 right-10 w-16 h-16 bg-blue-900 rounded-full opacity-20"
    animate={{ y: [0, -20, 0] }}
    transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
  />

  <div className="container mx-auto px-28">
    {/* Flex container for the text and button */}
    <div className="flex flex-col md:flex-row items-center justify-between gap-8">
      {/* Left side - Heading and text */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="w-full md:w-1/2"
      >
        <h1 className="text-5xl font-gliker text-green-400 mb-4 leading-tight">
          Ready to Transform <br /> Your Business?
        </h1>
        <p className="text-xl text-white-300 mb-6">
          Schedule your demo and start your journey with Nuren AI.
        </p>  
      </motion.div>

      {/* Right side - Popup Button */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="w-full md:w-1/2 flex justify-end"
        style={{marginRight:'120px'}}
      >
        <PopupButton
          url="https://calendly.com/adarsh1885/schedule-a-demo"
          rootElement={document.getElementById("root")}
          text="Talk to the Founder"
          className="bg-blue-500 hover:bg-blue-700 text-white font-gliker py-4 px-10 text-2xl rounded-full shadow-lg transition-transform duration-300 transform hover:scale-105"
        />  
      </motion.div>
    </div>
  </div>
</section>

  );
};

export default CalendlySection;