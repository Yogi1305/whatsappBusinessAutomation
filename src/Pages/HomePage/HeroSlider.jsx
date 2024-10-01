import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Import your images here
import broadcast from '../../assets/slider/broadcast.png';
import whatsapp from '../../assets/slider/whatsapp.png';
import flow from '../../assets/slider/flow.png';

const slides = [
  
  {
    title: "Broadcast with Precision",
    description: "Reach your audience with targeted messages at scale. Our advanced broadcasting features ensure your message lands with impact.",
    buttonText: "Learn More",
    buttonColor: "#d8b4fe",
    image: broadcast,
  },
  {
    title: "WhatsApp Business Solutions",
    description: "Engage customers on their favorite messaging platform. Leverage WhatsApp's popularity to boost your business communication.",
    buttonText: "Explore Features",
    buttonColor: "#fef08a",
    image: whatsapp,
  },
  {
    title: "Bulk Messaging Made Easy",
    description: "Send personalized messages to thousands in minutes. Our powerful bulk messaging tool saves time without sacrificing personalization.",
    buttonText: "Get Started",
    buttonColor: "#fecaca",
    image: flow,
  },
];

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

const HeroSlider = () => {
  const [page, setPage] = useState(0);
  const [direction, setDirection] = useState(0);

  const paginate = (newDirection) => {
    setDirection(newDirection);
    setPage((prevPage) => (prevPage + newDirection + slides.length) % slides.length);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      paginate(1);
    }, 5000);

    return () => clearTimeout(timer);
  }, [page]);

  const variants = {
    enter: (direction) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  };

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset, velocity) => {
    return Math.abs(offset) * velocity;
  };

  return (
    <div className="relative h-screen overflow-hidden bg-black mx-auto px-12 lg:px-24">
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

      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={page}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: 0.2 },
          }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={1}
          onDragEnd={(e, { offset, velocity }) => {
            const swipe = swipePower(offset.x, velocity.x);
            if (swipe < -swipeConfidenceThreshold) {
              paginate(1);
            } else if (swipe > swipeConfidenceThreshold) {
              paginate(-1);
            }
          }}
          className="absolute w-full h-full flex items-center justify-center"
        >
          <div className="container mx-auto px-4 flex flex-col md:flex-row items-center">
            {/* Adjust the width of the text to be smaller */}
            <div className="md:w-1/3 mb-8 md:mb-0 md:pr-8">
              <motion.h2
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className="text-4xl md:text-5xl font-bold mb-6 font-gliker "
                style={{color: slides[page].buttonColor }}
              >
                {slides[page].title}
              </motion.h2>
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="text-xl mb-8 text-white"
              >
                {slides[page].description}
              </motion.p>
              <motion.button
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.8 }}
                whileHover={{ scale: 1.05, boxShadow: "0px 0px 8px rgba(0,230,118,0.4)" }}
                whileTap={{ scale: 0.95 }}
                className={`bg-blue-400 text-white font-bold py-3 px-8 rounded-full hover:bg-blue-600 transition duration-300`}
              >
                {slides[page].buttonText}
              </motion.button>
            </div>

            {/* Adjust image container width to be larger */}
            <div className="md:w-1/3 relative">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className="relative z-10"
              >
                <img
                  src={slides[page].image}
                  alt={slides[page].title}
                  className="w-full max-w-lg h-auto rounded-lg"
                  style={{marginLeft:'300px'}} // Set max width
                />
              </motion.div>
          { /*   <motion.div
                className="absolute inset-0 bg-gradient-to-r from-green-400 to-blue-500 rounded-lg"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 0.2 }}
                transition={{ delay: 0.1, duration: 1 }}
                style={{ filter: "blur(20px)", transform: "rotate(5deg)" }}
              />*/}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation arrows */}
      <motion.button
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-gray-800 p-2 rounded-full shadow-lg z-10"
        onClick={() => paginate(-1)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <ChevronLeft className="w-6 h-6 text-white" />
      </motion.button>
      <motion.button
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-gray-800 p-2 rounded-full shadow-lg z-10"
        onClick={() => paginate(1)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <ChevronRight className="w-6 h-6 text-white" />
      </motion.button>

      {/* Slide indicators */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-4">
        {slides.map((_, index) => (
          <motion.button
            key={index}
            onClick={() => {
              setDirection(index > page ? 1 : -1);
              setPage(index);
            }}
            className={`w-3 h-3 rounded-full ${
              index === page ? 'bg-green-500' : 'bg-gray-600'
            }`}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.8 }}
          />
        ))}
      </div>
    </div>
  );
};




export default HeroSlider;