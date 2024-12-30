import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Import your images and videos
import broadcast from '../../assets/4574.png';
import whatsapp from '../../assets/slider/whatsapp.png';
import flow from '../../assets/slider/flow.mp4';

const slides = [
  {
    title: "Transform Your Reach",
    description: "Imagine reaching thousands of eager customers with a single message. Our smart broadcasting turns every campaign into a conversation starter, delivering 5x higher engagement than traditional channels.",
    buttonText: "Amplify Your Message",
    accentColor: "from-blue-400 to-blue-600",
    image: broadcast,
    link: "/register",
  },
  {
    title: "Ads That Click To Whatsapp",
    description: "Turn ads into instant conversations on WhatsApp, driving engagement and boosting conversions",
    buttonText: "Connect with Customers",
    accentColor: "from-yellow-400 to-yellow-600",
    image: whatsapp,
    link: "/register",
  },
  {
    title: "Your Tireless Digital Team",
    description: "Sleep well while your business grows. Our AI chatbots handle customer queries 24/7, cutting response time by 75% and turning midnight inquiries into morning sales. Experience the future of customer service.",
    buttonText: "Launch Your AI Assistant",
    accentColor: "from-red-400 to-red-600",
    video: flow,
    link: "/demo/chatbot",
  },
];

const HeroSlider = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => paginate(1), 7000);
    return () => clearTimeout(timer);
  }, [page]);

  const paginate = (newDirection) => {
    setDirection(newDirection);
    setPage((prevPage) => (prevPage + newDirection + slides.length) % slides.length);
  };

  return (
    <div className="relative h-screen overflow-hidden bg-gradient-to-br from-gray-900 to-black">
      {/* Dynamic background elements */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,black_70%,transparent_110%)]" />
      
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-black to-transparent z-10" />
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black to-transparent z-10" />
      </div>

      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={page}
          custom={direction}
          initial={{ opacity: 0, x: direction > 0 ? 1000 : -1000 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: direction < 0 ? 1000 : -1000 }}
          transition={{
            x: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: 0.2 },
          }}
          className="absolute w-full h-full flex items-center justify-center px-4 lg:px-24"
        >
          <div className="container mx-auto flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-16">
            <div className="lg:w-1/2 space-y-6 relative z-20">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className={`inline-block px-4 py-1 rounded-full bg-gradient-to-r ${slides[page].accentColor} bg-opacity-10 backdrop-blur-sm`}
              >
                <p className="text-sm font-medium text-white">Featured</p>
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className={`text-5xl lg:text-6xl font-bold bg-gradient-to-r ${slides[page].accentColor} bg-clip-text text-transparent`}
              >
                {slides[page].title}
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-xl text-gray-300 max-w-xl"
              >
                {slides[page].description}
              </motion.p>

              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                onClick={() => navigate(slides[page].link)}
                className={`group flex items-center gap-2 px-8 py-4 rounded-lg bg-gradient-to-r ${slides[page].accentColor} text-white font-semibold text-lg transition-all duration-300 hover:gap-4`}
              >
                {slides[page].buttonText}
                <ArrowRight className="w-5 h-5 transition-all duration-300" />
              </motion.button>
            </div>

            <div className="lg:w-1/2 relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-transparent via-white/5 to-transparent rounded-lg blur-lg" />
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="relative rounded-lg overflow-hidden bg-gray-900/50 backdrop-blur-sm border border-white/10"
              >
                {slides[page].video ? (
                  <video
                    src={slides[page].video}
                    className="w-full max-w-2xl mx-auto rounded-lg"
                    autoPlay
                    loop
                    muted
                    style={{ clipPath: 'inset(1px 1px)' }}
                  />
                ) : (
                  <img
                    src={slides[page].image}
                    alt={slides[page].title}
                    className="w-full max-w-2xl mx-auto rounded-lg"
                  />
                )}
              </motion.div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation arrows */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4 z-20">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => paginate(-1)}
          className="p-2 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors duration-200"
        >
          <ChevronLeft className="w-6 h-6 text-white" />
        </motion.button>
        
        {/* Slide indicators */}
        <div className="flex gap-3">
          {slides.map((_, index) => (
            <motion.button
              key={index}
              onClick={() => {
                setDirection(index > page ? 1 : -1);
                setPage(index);
              }}
              className={`w-12 h-1 rounded-full transition-all duration-300 ${
                index === page 
                  ? `bg-gradient-to-r ${slides[index].accentColor}`
                  : 'bg-white/20'
              }`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            />
          ))}
        </div>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => paginate(1)}
          className="p-2 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors duration-200"
        >
          <ChevronRight className="w-6 h-6 text-white" />
        </motion.button>
      </div>
    </div>
  );
};

export default HeroSlider;