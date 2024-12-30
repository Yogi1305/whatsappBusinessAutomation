import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, Clock, Bot, Zap, ShoppingCart, HeartHandshake } from 'lucide-react';
import { FaVolumeMute, FaVolumeUp, FaPlay } from "react-icons/fa";

const VideoSection = ({ videoSrc, title, description }) => {
  const videoRef = useRef(null);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showControls, setShowControls] = useState(false);

  const handleVideoClick = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(!isMuted);
      setShowControls(true);
      
      if (!isPlaying) {
        videoRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => setShowControls(false), 2000);
    return () => clearTimeout(timeout);
  }, [isMuted, isPlaying]);

  return (
    <div className="relative bg-gradient-to-b from-black via-green-950 to-emerald-950 overflow-hidden">
      {/* Enhanced particle effect */}
      <div className="absolute inset-0 opacity-20">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute h-3 w-3 bg-gradient-to-r from-emerald-400 to-green-300 rounded-full blur-sm"
            animate={{
              x: [Math.random() * 100, Math.random() * window.innerWidth],
              y: [Math.random() * 100, Math.random() * window.innerHeight],
              scale: [1, 2.5, 1],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: Math.random() * 10 + 5,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Futuristic grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,128,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,128,0.03)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,black,transparent)]" />

      <div className="container mx-auto px-4 py-24 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <motion.div
            className="w-full lg:w-1/2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Enhanced headline styling */}
            <h2 className="text-6xl font-bold mb-8 bg-gradient-to-r from-emerald-300 via-green-200 to-emerald-300 bg-clip-text text-transparent [text-shadow:0_4px_8px_rgba(0,255,128,0.1)] leading-tight">
  Transform Your{' '}
  <span
    className="relative text-transparent bg-gradient-to-br from-green-500 to-green-300 bg-clip-text"
    style={{
      textShadow: "0 2px 6px rgba(72, 255, 128, 0.3), 0 -1px 3px rgba(72, 255, 128, 0.2)",
    }}
    
  >
    WhatsApp
  </span>{' '}
  Into a 24/7 Revenue Engine
</h2>

            
            {/* Enhanced feature list */}
            <div className="space-y-6 mb-12">
              <motion.div 
                className="flex items-center space-x-4 p-4 rounded-xl bg-gradient-to-r from-emerald-900/30 to-transparent border border-emerald-500/10 backdrop-blur-sm"
                whileHover={{ x: 10, backgroundColor: "rgba(16, 185, 129, 0.1)" }}
              >
                <Zap className="w-6 h-6 flex-shrink-0 text-emerald-400" />
                <p className="text-lg text-emerald-100">Instant AI responses in 0.6 seconds</p>
              </motion.div>
              <motion.div 
                className="flex items-center space-x-4 p-4 rounded-xl bg-gradient-to-r from-emerald-900/30 to-transparent border border-emerald-500/10 backdrop-blur-sm"
                whileHover={{ x: 10, backgroundColor: "rgba(16, 185, 129, 0.1)" }}
              >
                <ShoppingCart className="w-6 h-6 flex-shrink-0 text-emerald-400" />
                <p className="text-lg text-emerald-100">Automated sales funnel & payment processing</p>
              </motion.div>
              
            </div>

            {/* Enhanced CTA buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <motion.button
                whileHover={{ scale: 1.05, backgroundColor: "#059669" }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-green-500 text-white rounded-xl font-semibold text-lg shadow-lg shadow-emerald-500/30 flex items-center justify-center space-x-2 border border-emerald-400/20 backdrop-blur-sm"
              >
                <span>Start Free Trial</span>
                <Zap className="w-5 h-5" />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05, backgroundColor: "rgba(16, 185, 129, 0.1)" }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 border-2 border-emerald-500/50 text-emerald-400 rounded-xl font-semibold text-lg flex items-center justify-center space-x-2 backdrop-blur-sm"
              >
                <span>Watch Demo</span>
                <FaPlay className="w-4 h-4" />
              </motion.button>
            </div>
          </motion.div>

          <motion.div
            className="w-full lg:w-1/2 relative"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* Enhanced video container */}
            <div className="relative rounded-2xl overflow-hidden shadow-[0_0_40px_rgba(16,185,129,0.2)] border border-emerald-500/20">
              <video
                ref={videoRef}
                className="w-full h-auto cursor-pointer transform transition-transform duration-300 hover:scale-[1.02]"
                autoPlay
                muted={isMuted}
                loop
                onClick={handleVideoClick}
                style={{zIndex:1000}}
              >
                <source src={videoSrc} type="video/mp4" />
              </video>
              
              <AnimatePresence>
                {showControls && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute bottom-4 right-4 bg-black/70 p-3 rounded-full cursor-pointer backdrop-blur-sm border border-emerald-500/20"
                    onClick={handleVideoClick}
                  >
                    {isMuted ? (
                      <FaVolumeMute className="text-emerald-400 text-xl" />
                    ) : (
                      <FaVolumeUp className="text-emerald-400 text-xl" />
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {!isPlaying && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="bg-gradient-to-r from-emerald-500 to-green-500 p-4 rounded-full shadow-lg shadow-emerald-500/30"
                  >
                    <FaPlay className="text-white text-2xl" />
                  </motion.div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default VideoSection;