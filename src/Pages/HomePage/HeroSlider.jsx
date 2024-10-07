import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

// Import your images and videos here
import broadcast from '../../assets/slider/broadcast.mp4';
import whatsapp from '../../assets/slider/whatsapp.png';
import flow from '../../assets/slider/flow.mp4';

const slides = [
  {
    title: "ONE CLICK, BROADCAST THOUSANDS!",
    description: "Reach your audience with targeted messages at scale. Our advanced broadcasting features ensure your message lands with impact.",
    buttonText: "Start Broadcasting Now",
    buttonColor: "#4a90e2",
    video: broadcast,
    link: "/register", // Add link for the first slide
  },
  {
    title: "ADS THAT CLICK TO WHATSAPP",
    description: "Engage customers on their favorite messaging platform. Leverage WhatsApp's popularity to boost your business communication.",
    buttonText: "Connect with Customers",
    buttonColor: "#facc15",
    image: whatsapp,
    link: "/register", // Add link for the second slide
  },
  {
    title: "24/7 CHATBOT SUPPORT",
    description: "Send personalized messages to thousands in minutes. Our powerful bulk messaging tool saves time without sacrificing personalization.",
    buttonText: "Send Your First Message",
    buttonColor: "#f87171",
    video: flow,
    link: "/demo/chatbot", // Optional third link
  },
];

const HeroSlider2 = () => {
  const navigate = useNavigate(); // Initialize useNavigate
  const [page, setPage] = useState(0);
  const [direction, setDirection] = useState(0);

  const paginate = (newDirection) => {
    setDirection(newDirection);
    setPage((prevPage) => (prevPage + newDirection + slides.length) % slides.length);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      paginate(1);
    }, 7000);

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
          <div className="container mx-auto px-4 flex flex-col md:flex-row items-center" style={{ marginLeft: '5%' }}>
            <div className="md:w-1/3 mb-2 md:mb-0 md:pr-4">
              <motion.h2
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className="text-4xl md:text-5xl font-bold mb-4 font-gliker"
                style={{ color: slides[page].buttonColor }}
              >
                {slides[page].title}
              </motion.h2>
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="text-xl mb-4 text-white"
              >
                {slides[page].description}
              </motion.p>
              <motion.button
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.8 }}
                whileHover={{ scale: 1.05, boxShadow: "0px 0px 8px rgba(0,230,118,0.4)" }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate(slides[page].link)} // Navigate to link on button click
                className={`bg-blue-400 text-white font-bold py-2 px-6 rounded-full hover:bg-blue-600 transition duration-300`}
              >
                {slides[page].buttonText}
              </motion.button>
            </div>

            <div className="md:w-4/6 relative" style={{ marginLeft: '10%' }}>
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className="relative z-10"
              >
                {slides[page].video ? (
                  <video
                    src={slides[page].video}
                    className="w-full max-w-lg h-auto rounded-lg"
                    autoPlay
                    loop
                    muted
                  />
                ) : (
                  <img
                    src={slides[page].image}
                    alt={slides[page].title}
                    className="w-full max-w-lg h-auto rounded-lg"
                  />
                )}
              </motion.div>
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

export default HeroSlider2;
