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
import CalendlySection from './Calendly';
import ChatbotDemoSection from './ChatbotDemo';
import LeadCapturePopup from './LeadCapture';
import ad from '../../assets/slider/ad.mp4';
import { Link } from 'react-router-dom';
import Footer from '../footer';

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
    <div className="bg-black min-h-screen overflow-x-hidden w-full main-homepage" style={{width:'98.9vw',paddingTop:'20px'}}>
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
      <section className="relative py-20 bg-black text-white">
  <div className="absolute inset-0 bg-black opacity-60"></div> {/* Overlay */}

  <div className="container mx-auto relative z-10 px-4">
    <ScrollAnimatedSection>
      <h2 className="text-5xl font-gliker text-center mb-16 text-white">FEATURES</h2>
    </ScrollAnimatedSection>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
      {[
        { icon: MessageCircle, title: "AI-POWERED CHATBOTS", description: "Automate customer interactions with intelligent chatbots that understand context and intent.", backgroundImage: chatbot, link: 'blogs/chatbot' },
        { icon: Users, title: "ADVANCED SEGMENTATION", description: "Target the right audience with precision using our advanced customer segmentation tools.", backgroundImage: connection, link: 'blogs/segmentation' },
        { icon: Zap, title: "QUICK RESPONSES", description: "Create and manage a library of quick responses to common queries, saving time and ensuring consistency.", backgroundImage: chatbot, link: 'blogs/quick-responses' },
        { icon: Star, title: "PERSONALISED EXPERIENCES", description: "Deliver tailored messages and recommendations based on customer behavior and preferences.", backgroundImage: outreach, link: 'blogs/whatsapp-engagement' },
        { icon: Shield, title: "SECURE & COMPLIANT", description: "Ensure data privacy and comply with regulations using our robust security measures.", backgroundImage: security, link: 'blogs/security-compliance' },
        { icon: Rocket, title: "SCALABLE SOLUTIONS", description: "Grow your business effortlessly with our scalable WhatsApp marketing solutions.", backgroundImage: outreach, link: 'blogs/scalable-solutions' },
      ].map((feature, index) => (
        <ScrollAnimatedSection key={index}>
          <a href={feature.link} className="block"> {/* Wrap in anchor tag */}
            <div 
              className={`p-8 rounded-lg shadow-lg hover:shadow-xl transition duration-300 ${
                feature.title === "AI-POWERED CHATBOTS" ? 'relative' : 'bg-gray-900'
              }`}
              style={{
                backgroundImage: feature.backgroundImage ? `url(${feature.backgroundImage})` : 'none',
                backgroundSize: feature.backgroundImage ? 'cover' : 'none',
                backgroundPosition: feature.backgroundImage ? 'center' : 'none',
              }}
            >
              {feature.backgroundImage && <div className="absolute inset-0 bg-black opacity-70 rounded-lg"></div>} {/* Overlay for image */}
              <div className="relative z-10">
                <FeatureCard {...feature} title={feature.title.toUpperCase()} /> {/* Apply uppercase */}
              </div>
            </div>
          </a>
        </ScrollAnimatedSection>
      ))}
    </div>
  </div>
</section>




            

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

    
      {/* Stats Section gradient-to-r from-green-600 to-blue-600*/}
      <section className="py-20 bg-black text-blue-400 relative overflow-hidden">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-4xl font-bold text-green-400 mb-4">
          Elevate Your Business with WhatsApp Automation!
        </h2>
        <p className="text-xl mb-8">
          Streamline customer engagement and boost satisfaction with our powerful WhatsApp Business API.
        </p>
        <Link
          to="/register"
          className="bg-blue-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-600 transition duration-300"
        >
          Get Started Today
        </Link>
      </div>
    </section>
<Footer/>
    </div>
  );
};

export default Homepage;