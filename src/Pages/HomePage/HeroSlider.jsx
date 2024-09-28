import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Import your images here
import broadcast from '../../assets/slider/broadcast.png';
import whatsapp from '../../assets/slider/whatsapp.png';
import flow from '../../assets/slider/flow.png';
import ad from '../../assets/slider/ad.mp4';

const slides = [
  {
    title: "Experience NurenAI in Action",
    description: "See how NurenAI transforms WhatsApp business communication with AI-powered chatbots, automated campaigns, and advanced analytics. Our cutting-edge technology helps businesses engage customers more effectively, save time, and drive growth.",
    buttonText: "Get Started",
    buttonColor: "green",
    video: ad,
  },
  {
    title: "Broadcast with Precision",
    description: "Reach your audience with targeted messages at scale. Our advanced broadcasting features ensure your message lands with impact.",
    buttonText: "Learn More",
    buttonColor: "green",
    image: broadcast,
  },
  {
    title: "WhatsApp Business Solutions",
    description: "Engage customers on their favorite messaging platform. Leverage WhatsApp's popularity to boost your business communication.",
    buttonText: "Explore Features",
    buttonColor: "green",
    image: whatsapp,
  },
  {
    title: "Bulk Messaging Made Easy",
    description: "Send personalized messages to thousands in minutes. Our powerful bulk messaging tool saves time without sacrificing personalization.",
    buttonText: "Get Started",
    buttonColor: "green",
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
    <div className="relative h-screen overflow-hidden bg-gray-900">
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
            <div className="md:w-1/2 mb-8 md:mb-0 md:pr-8">
              <motion.h2
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className="text-4xl md:text-5xl font-bold mb-6 text-white"
              >
                {slides[page].title}
              </motion.h2>
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="text-xl mb-8 text-gray-300"
              >
                {slides[page].description}
              </motion.p>
              <motion.button
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.8 }}
                whileHover={{ scale: 1.05, boxShadow: "0px 0px 8px rgba(0,230,118,0.4)" }}
                whileTap={{ scale: 0.95 }}
                className={`bg-green-500 text-white font-bold py-3 px-8 rounded-full hover:bg-green-600 transition duration-300`}
              >
                {slides[page].buttonText}
              </motion.button>
            </div>
            <div className="md:w-1/2 relative">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className="relative z-10"
              >
                {slides[page].video ? (
                  <video
                    src={slides[page].video}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-auto rounded-lg shadow-2xl"
                  />
                ) : (
                  <img
                    src={slides[page].image}
                    alt={slides[page].title}
                    className="w-full h-auto rounded-lg shadow-2xl"
                  />
                )}
              </motion.div>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-green-400 to-blue-500 rounded-lg"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 0.2 }}
                transition={{ delay: 0.1, duration: 1 }}
                style={{ filter: "blur(20px)", transform: "rotate(5deg)" }}
              />
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