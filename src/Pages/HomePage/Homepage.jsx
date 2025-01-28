import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useSpring, animated } from 'react-spring';
import { MessageCircle, Users, Zap, BarChart2, Send, Star, Shield, Rocket, Check, ChevronDown } from 'lucide-react';
import HeroSlider from './HeroSlider';
import VideoSection from './Videocardcanvas';

import "./Homepage.css";
//import CalendlySection from './Calendly';
import ChatbotDemoSection from './ChatbotDemo';
import LeadCapturePopup from './LeadCapture';
import ad from '../../assets/slider/ad.mp4';
import { Link } from 'react-router-dom';
import {Footer,CalendlySection,FeaturesSection,PricingSection,SocialProofSection} from './footercal';
//import Footer from '../footer';

const FeatureCard = ({ icon: Icon, title, description }) => {
  const [isHovered, setIsHovered] = useState(false);
  const springProps = useSpring({
    scale: isHovered ? 1.05 : 1,
    boxShadow: isHovered
      ? '0 10px 30px rgba(37, 211, 102, 0.3)'
      : '0 5px 15px rgba(0, 0, 0, 0.2)',
  });

  return (
    <animated.div
      style={springProps}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="rounded-lg p-6 text-bluee transition-all duration-300 "
    >
      <Icon className="w-12 h-12 mb-4 text-green-400" />
      <h3 className="text-xl font-gliker text-blue mb-2">{title}</h3>
      <p className="text-white">{description}</p>
    </animated.div>
  );
};

const AnimatedCounter = ({ value, duration = 2000 }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = null;
    const step = (timestamp) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      setCount(Math.floor(progress * value));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }, [value, duration]);

  return <span>{count.toLocaleString()}</span>;
};

const ScrollAnimatedSection = ({ children }) => {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(ref.current);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isVisible ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5 }}
    >
      {children}
    </motion.div>
  );
};

const FloatingElement = ({ children, yOffset = 20, duration = 3 }) => {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, yOffset]);

  return (
    <motion.div
      style={{ y }}
      animate={{ y: [0, yOffset, 0] }}
      transition={{ repeat: Infinity, duration, ease: "easeInOut" }}
    >
      {children}
    </motion.div>
  );
};

const Homepage = () => {
  const { scrollYProgress } = useScroll();
  const [isPopupVisible, setIsPopupVisible] = useState(false);

  // Show popup after 10 seconds of page load
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPopupVisible(true); // Show the popup after 10 seconds
    }, 10000);

    return () => clearTimeout(timer); // Cleanup timer on component unmount
  }, []);

  // Show popup when user scrolls 30% down the page
  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight;
      const scrollPosition = window.scrollY + window.innerHeight;

      // Check if the user has scrolled 30% of the page height
      if (scrollPosition >= scrollHeight * 0.3) {
        setIsPopupVisible(true); // Show the popup
        window.removeEventListener('scroll', handleScroll); // Remove scroll listener after triggering
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll); // Cleanup the scroll event listener
    };
  }, []);
  

  const handleEmailSubmit = (email) => {
    console.log("Submitted email:", email);
    setIsPopupVisible(false); // Close popup after submission
  };
  const handlePopupClose = () => {
    setIsPopupVisible(false); 
  };
  const handlePlayVideo = () => {
    if (videoRef.current) {
      videoRef.current.play();
    }
  };
  const videoRef = useRef(null);
  const [showSlider, setShowSlider] = useState(false);

  const handleScroll = () => {
    setShowSlider(true);
  };

  return (
    <div className="bg-black min-h-screen overflow-x-hidden w-full main-homepage" style={{width:'98.9vw',paddingTop:'0px'}}>
      {/* Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-2 bg-green-400 z-50"
        style={{ scaleX: scrollYProgress }}
      />

{isPopupVisible && (
        <LeadCapturePopup
          onClose={handlePopupClose}
          onSubmit={handleEmailSubmit}
        />
      )}
     
      {/* Hero Section */}
      <VideoSection 
        videoSrc={ad}
        title="MARKET WHERE YOU MINGLE!"
        description="Send messages to a global audience of 3 billion unique users"
        style={{ borderBottom: '100px solid white' }}  
   
      />
          <ChatbotDemoSection />
          <div>

      { <HeroSlider/>}
  
    </div>
    <SocialProofSection />
    {/*socialproof*/}
      <FeaturesSection/>
      <PricingSection/>
      <CalendlySection />  
     
      
      <Footer/>
    </div>
  );
};

export default Homepage;