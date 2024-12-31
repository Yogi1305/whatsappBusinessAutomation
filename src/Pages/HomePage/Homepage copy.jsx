import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useSpring, animated } from 'react-spring';
import { MessageCircle, Users, Zap, BarChart2, Send, Star, Shield, Rocket, Check, ChevronDown } from 'lucide-react';
import HeroSlider from './HeroSlider';
import VideoSection from './Videocardcanvas';
import content0 from '../../assets/content0.png'; // Replace with your image path
import content1 from '../../assets/content1.mp4'; 
import man from "../../assets/man.png";
import connection from "../../assets/connection.png";
import chatbot from "../../assets/chatbot.jpeg";
import security from "../../assets/security.png";
import outreach from "../../assets/outreach.png";
import "./Homepage.css";
//import CalendlySection from './Calendly';
import ChatbotDemoSection from './ChatbotDemo';
import LeadCapturePopup from './LeadCapture';
import ad from '../../assets/slider/ad.mp4';
import { Link } from 'react-router-dom';
import {Footer,CalendlySection,StatsSection} from './footercal';
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
      {/* Other content above the slider */}
      { <HeroSlider/>}
      {/* Other content below the slider */}
    </div>
       

    <section className="relative m-4">
  <div className="max-w-6xl mx-auto">

    {/* First Row: Image on Left, Heading on Right */}
    <div className="flex flex-col md:flex-row items-center mb-8">
      <div className="md:w-1/2">
        <img 
          src={content0}  
          alt="Content" 
          className="w-full rounded-lg" 
        />
      </div>
      <div className="md:w-1/2 mt-4 md:mt-0 md:ml-8">
        <h1 className="text-6xl font-gliker text-white" style={{ marginLeft: '30%' }}>
          <span style={{ color: '#3b82f6' }}>SALES</span><br/> IS A <span style={{ color: 'White' }}>NUMBERS</span> GAME
        </h1>
      </div>
    </div>

    {/* Second Row: Heading on Left, Video on Right */}
    <div className="flex flex-col md:flex-row items-center">
      <div className="md:w-1/2 mt-4 md:mr-8">
        <h1 className="text-6xl font-gliker text-white">
          <span style={{ color: '#22c55e' }}>WHATSAPP </span><br/>IS WHERE <span style={{ color: 'white' }}>NUMBERS</span><br/>ADD UP!
        </h1>
      </div>
      <div className="md:w-1/2 mt-4 md:mt-0">
        <video 
          ref={videoRef} 
          className="w-full rounded-lg" 
          autoPlay loop muted
        >
          <source src={content1} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
    </div>

    {/* CTA Section */}
    <div className="flex flex-col md:flex-row items-center justify-center mt-8">
     

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="bg-blue-400 text-white font-bold py-3 px-6 rounded-lg shadow-lg mb-4 transition duration-300"
        onClick={() => window.location.href='/blogs'} // Link to Schedule a Demo page
      >
        Learn More
      </motion.button>
    </div>
    
  </div>

</section>


   
     
        {/* Hero Slider */}
      
  
        
        {/* Second Slider or Content */}
   

      
        {/* Add more sections as needed */}
 
  
     
      {/* Features Section */}
      import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Users, Zap, Star, Shield, Rocket } from 'lucide-react';

const FloatingOrb = ({ className }) => (
  <div className={`absolute w-96 h-96 blur-3xl rounded-full ${className}`} />
);

export const FeaturesSection = () => {
  const features = [
    { 
      icon: MessageCircle, 
      title: "AI-POWERED CHATBOTS", 
      description: "Automate customer interactions with intelligent chatbots that understand context and intent.", 
      link: 'blogs/chatbot',
      image: "/api/placeholder/800/600"
    },
    { 
      icon: Users, 
      title: "ADVANCED SEGMENTATION", 
      description: "Target the right audience with precision using our advanced customer segmentation tools.", 
      link: 'blogs/segmentation',
      image: "/api/placeholder/800/600"
    },
    { 
      icon: Zap, 
      title: "QUICK RESPONSES", 
      description: "Create and manage a library of quick responses to common queries, saving time and ensuring consistency.", 
      link: 'blogs/quick-responses',
      image: "/api/placeholder/800/600"
    },
    { 
      icon: Star, 
      title: "PERSONALISED EXPERIENCES", 
      description: "Deliver tailored messages and recommendations based on customer behavior and preferences.", 
      link: 'blogs/whatsapp-engagement',
      image: "/api/placeholder/800/600"
    },
    { 
      icon: Shield, 
      title: "SECURE & COMPLIANT", 
      description: "Ensure data privacy and comply with regulations using our robust security measures.", 
      link: 'blogs/security-compliance',
      image: "/api/placeholder/800/600"
    },
    { 
      icon: Rocket, 
      title: "SCALABLE SOLUTIONS", 
      description: "Grow your business effortlessly with our scalable WhatsApp marketing solutions.", 
      link: 'blogs/scalable-solutions',
      image: "/api/placeholder/800/600"
    },
  ];

  return (
    <section className="relative py-32 bg-gradient-to-b from-black via-emerald-950 to-black overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.02)_1px,transparent_1px)] bg-[size:30px_30px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,black,transparent)]" />
      
      <FloatingOrb className="top-20 left-20 bg-gradient-to-r from-emerald-500/20 to-green-500/20" />
      <FloatingOrb className="bottom-20 right-20 bg-gradient-to-r from-green-500/20 to-emerald-500/20" />

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-6xl font-bold mb-6">
            <span className="text-emerald-400 [text-shadow:0_4px_8px_rgba(0,255,128,0.1)]">
              Features
            </span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.a
              href={feature.link}
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative overflow-hidden"
            >
              <div className="absolute inset-0">
                <img 
                  src={feature.image} 
                  alt={feature.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/60 group-hover:bg-black/40 transition-colors duration-300" />
              </div>
              
              <div className="backdrop-blur-sm p-8 rounded-2xl border border-emerald-900/20 hover:border-emerald-500/30 transition-all duration-300 h-full relative z-10">
                <div className="flex flex-col items-center text-center">
                  <div className="p-4 rounded-xl bg-emerald-950/50 mb-6 group-hover:scale-110 transition-transform duration-300">
                    <feature.icon className="w-8 h-8 text-emerald-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4 [text-shadow:0_2px_4px_rgba(0,255,128,0.1)]">
                    {feature.title}
                  </h3>
                  <p className="text-lg text-gray-200">{feature.description}</p>
                </div>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;




            

   {/* How It Works Section */}
   <section className="py-20 bg-black">
  <div className="container mx-auto px-4 text-center">
    <h2 className="text-5xl font-gliker text-white mb-8">TRANSPARENT PRICING</h2>
    
    {/* Pricing Graphic */}
    <div className="flex flex-col md:flex-row justify-center items-center mb-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {[
          { plan: "Starter", price: "$89", features: ["1,000 messages/month", "Basic chatbot", "Email support","Basic Support"] },
          { plan: "Pro", price: "$119", features: ["10,000 messages/month", "Advanced AI chatbot", "Priority support", "Custom integrations"] },
        ].map((tier, index) => (
          <ScrollAnimatedSection key={index}>
            <motion.div
              className="bg-gray-700 rounded-lg shadow-lg overflow-hidden"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="p-8 bg-green-600 text-white text-center">
                <h3 className="text-3xl font-bold mb-2">{tier.plan}</h3>
                <p className="text-4xl font-bold">{tier.price}</p>
                <p className="text-sm opacity-75">per month</p>
              </div>
              <ul className="p-8">
                {tier.features.map((feature, idx) => (
                  <li key={idx} className="mb-4 flex items-center text-white">
                    <Check className="text-green-400 mr-2" size={20} />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <div className="px-8 pb-8">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full bg-green-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-600 transition duration-300"
                  onClick={() => window.location.href='/pricing'} // Link to /pricing
                >
                  {tier.plan === "Enterprise" ? "Contact Sales" : "Get Started"}
                </motion.button>
              </div>
            </motion.div>
          </ScrollAnimatedSection>
        ))}
      </div>
    </div>
    
    {/* CTA Section */}
 
  </div>
</section>



      <CalendlySection />

    
     <StatsSection/>
<Footer/>
    </div>
  );
};

export default Homepage;