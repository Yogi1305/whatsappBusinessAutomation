import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { FaVolumeMute, FaVolumeUp } from "react-icons/fa"; // Icons for mute and unmute

// Particle component (copied from your slider component)
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

const VideoSection = ({ videoSrc, title, description }) => {
  const videoRef = useRef(null);
  const [isMuted, setIsMuted] = useState(true); // Track mute state
  const [showIcon, setShowIcon] = useState(true); // Control visibility of the overlay icon

  // Handle video click to toggle sound
  const handleVideoClick = () => {
    if (videoRef.current) {
      // Toggle the muted property and icon state
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(!isMuted);
      setShowIcon(true); // Show the icon immediately when clicked
    }
  };

  // Automatically hide the icon after 2 seconds of clicking
  useEffect(() => {
    const timeout = setTimeout(() => setShowIcon(false), 2000);
    return () => clearTimeout(timeout); // Cleanup timeout on component unmount or re-click
  }, [isMuted]); // Reset timeout on mute/unmute change

  return (
    <div className="py-24 bg-black relative">
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
  
    <div className="container mx-auto px-6 lg:px-12">
      <div className="flex flex-col lg:flex-row items-center gap-12">
        <motion.div
          className="w-full lg:w-1/2 lg:pl-16"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className="text-7xl font-extrabold mb-6 text-green-500 font-gliker leading-tight">
            {title} 
          </h2>
          <p className="text-xl text-white mb-10 leading-relaxed">{description}</p>
  
          {/* CTAs Section */}
          <div className="flex flex-col md:flex-row gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{ backgroundColor: "#f87171" }}
              className="text-white font-bold py-4 px-10 rounded-full text-lg shadow-lg hover:bg-green-600 transition duration-300"
              onClick={() => window.location.href='/register'} // Link to Registration Page
            >
              Get Started Now
            </motion.button>
  
            <motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
  style={{ backgroundColor: "#4a90e2" }}
  className="text-white font-bold py-4 px-10 rounded-full text-lg shadow-lg hover:bg-purple-600 transition duration-300"
  onClick={() => window.open('https://calendly.com/adarsh1885/schedule-a-demo', '_blank')} // Open in new tab
>
  Book a Demo
</motion.button>

          </div>
        </motion.div>
  
        <motion.div
          className="w-full lg:w-1/2 mb-12 lg:mb-0 relative"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Video */}
          <div className="relative w-full" style={{ marginTop: '-50px' }}>
            <video
              ref={videoRef}
              className="w-full h-auto rounded-lg shadow-2xl cursor-pointer"
              autoPlay
              muted={isMuted} // Set based on state
              loop
              onClick={handleVideoClick}
            >
              <source src={videoSrc} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <h2 style={{ fontFamily: 'Gliker', backgroundColor: 'black', color: 'white' }}>
                Click For Sound
              </h2>
            </div>
            {/* Mute/Unmute Icon */}
            {showIcon && (
              <div className="absolute inset-0 flex justify-center items-center">
                <div className="bg-gray-800 bg-opacity-70 p-4 rounded-full">
                  {isMuted ? (
                    <FaVolumeMute className="text-white text-3xl" />
                  ) : (
                    <FaVolumeUp className="text-white text-3xl" />
                  )}
                </div>
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
