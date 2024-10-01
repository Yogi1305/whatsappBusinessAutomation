import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useSpring, animated } from 'react-spring';
import { MessageCircle, Users, Zap, BarChart2, Send, Star, Shield, Rocket, Check, ChevronDown } from 'lucide-react';
import HeroSlider from './HeroSlider';
import VideoSection from './Videocardcanvas';
import birds from "../../assets/birds.mp4";
import man from "../../assets/man.png";
import connection from "../../assets/connection.png";
import "./Homepage.css";
import CalendlySection from './Calendly';
import ChatbotDemoSection from './ChatbotDemo';
import ad from '../../assets/slider/ad.mp4';

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
      className="bg-gray-800 rounded-lg p-6 text-white transition-all duration-300 hover:bg-gray-700"
    >
      <Icon className="w-12 h-12 mb-4 text-green-400" />
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-300">{description}</p>
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
  const handlePlayVideo = () => {
    if (videoRef.current) {
      videoRef.current.play();
    }
  };
  const videoRef = useRef(null);

  return (
    <div className="bg-gray-900 min-h-screen overflow-x-hidden w-full main-homepage" style={{width:'98.9vw'}}>
      {/* Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-2 bg-green-400 z-50"
        style={{ scaleX: scrollYProgress }}
      />

      {/* Hero Section */}
      <VideoSection 
        videoSrc={ad}
        title="Market Where You Mingle!"
        description="See how Nuren AI transforms WhatsApp business communication with AI-powered chatbots, automated campaigns, and advanced analytics. Our cutting-edge technology helps businesses engage customers more effectively, save time, and drive growth."
      />


      <section className="relative">
        <HeroSlider />
      </section>

      <ChatbotDemoSection />
      {/* Features Section */}
      <section className="py-20 bg-gray-800">
        <div className="container mx-auto px-4">
          <ScrollAnimatedSection>
            <h2 className="text-5xl font-bold text-center mb-16 text-white">Powerful Features</h2>
          </ScrollAnimatedSection>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { icon: MessageCircle, title: "AI-Powered Chatbots", description: "Automate customer interactions with intelligent chatbots that understand context and intent." },
              { icon: Users, title: "Advanced Segmentation", description: "Target the right audience with precision using our advanced customer segmentation tools." },
              { icon: Zap, title: "Quick Responses", description: "Create and manage a library of quick responses to common queries, saving time and ensuring consistency." },
              { icon: Star, title: "Personalized Experiences", description: "Deliver tailored messages and recommendations based on customer behavior and preferences." },
              { icon: Shield, title: "Secure & Compliant", description: "Ensure data privacy and comply with regulations using our robust security measures." },
              { icon: Rocket, title: "Scalable Solutions", description: "Grow your business effortlessly with our scalable WhatsApp marketing solutions." },
            ].map((feature, index) => (
              <ScrollAnimatedSection key={index}>
                <FeatureCard {...feature} />
              </ScrollAnimatedSection>
            ))}
          </div>
        </div>
      </section>



      {/* How It Works Section */}
      <section className="py-20 bg-gray-900 relative overflow-hidden">
        <FloatingElement yOffset={30} duration={5}>
          <div className="absolute top-10 left-10 w-20 h-20 bg-green-400 rounded-full opacity-10" />
        </FloatingElement>
        <FloatingElement yOffset={-20} duration={4}>
          <div className="absolute bottom-10 right-10 w-16 h-16 bg-blue-400 rounded-full opacity-10" />
        </FloatingElement>
        <div className="container mx-auto px-4">
          <ScrollAnimatedSection>
            <h2 className="text-5xl font-bold text-center mb-16 text-white">How Nuren AI Works</h2>
          </ScrollAnimatedSection>
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="w-full md:w-1/2 mb-8 md:mb-0">
              <img
                src={man}
                alt="Nuren AI Illustration"
                className="w-full h-auto object-cover rounded-lg"
              />
            </div>
            <div className="w-full md:w-1/2 md:ml-12">
              {[
                "Connect your WhatsApp Business API",
                "Set up AI-powered chatbots and flows",
                "Create targeted broadcast lists",
                "Launch automated campaigns",
                "Analyze performance and optimize",
              ].map((step, index) => (
                <ScrollAnimatedSection key={index}>
                  <motion.div
                    className="flex items-center mb-8"
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <div className="bg-green-400 text-gray-900 rounded-full w-12 h-12 flex items-center justify-center mr-6 text-xl font-bold shadow-lg">
                      {index + 1}
                    </div>
                    <p className="text-xl text-white">{step}</p>
                  </motion.div>
                </ScrollAnimatedSection>
              ))}
            </div>
          </div>
        </div>
      </section>

      <CalendlySection />

      {/* Connection Section */}
      <section className="py-20 bg-gray-800">
        <div className="container mx-auto px-4">
          <ScrollAnimatedSection>
            <h2 className="text-5xl font-bold text-center mb-16 text-white">Connecting You with Your Customers</h2>
          </ScrollAnimatedSection>
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="w-full md:w-1/2 mb-8 md:mb-0">
              <ScrollAnimatedSection>
                <img
                  src={connection}
                  alt="Connection Illustration"
                  className="w-full h-auto object-cover rounded-lg"
                />
              </ScrollAnimatedSection>
            </div>
            <div className="w-full md:w-1/2 md:ml-12">
              <ScrollAnimatedSection>
                <p className="text-xl text-gray-300 mb-8">
                  Nuren AI bridges the gap between businesses and customers, creating meaningful connections through intelligent, personalized communication. Our AI-driven platform ensures that every interaction is valuable, timely, and aligned with your brand voice.
                </p>
              </ScrollAnimatedSection>
              <ScrollAnimatedSection>
                <ul className="space-y-4">
                  {[
                    "Understand customer needs with AI-powered sentiment analysis",
                    "Deliver personalized content at scale",
                    "Build lasting relationships through consistent, meaningful interactions",
                    "Seamlessly transition between AI and human support",
                  ].map((item, index) => (
                    <motion.li
                      key={index}
                      className="flex items-center"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <Check className="text-green-400 mr-2" size={20} />
                      <span className="text-white">{item}</span>
                    </motion.li>
                  ))}
                </ul>
              </ScrollAnimatedSection>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-r from-green-600 to-blue-600 text-white relative overflow-hidden">
        <FloatingElement yOffset={40} duration={6}>
          <div className="absolute top-20 right-20 w-32 h-32 bg-white rounded-full opacity-10" />
        </FloatingElement>
        <FloatingElement yOffset={-30} duration={5}>
          <div className="absolute bottom-20 left-20 w-24 h-24 bg-white rounded-full opacity-10" />
        </FloatingElement>
        <div className="container mx-auto px-4">
          <ScrollAnimatedSection>
            <h2 className="text-5xl font-bold text-center mb-16">Nuren AI in Numbers</h2>
          </ScrollAnimatedSection>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            {[
              { icon: Send, value: 6000, label: 'Messages Sent' },
              { icon: Users, value: 60, label: 'Approved Templates' },
              { icon: BarChart2, value: 100, label: 'Customer Satisfaction' },
            ].map(({ icon: Icon, value, label }, index) => (
              <ScrollAnimatedSection key={index}>
                <motion.div
                  className="bg-white bg-opacity-20 rounded-lg p-8 backdrop-blur-sm"
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Icon className="w-16 h-16 mx-auto mb-6" />
                  <h3 className="text-5xl font-bold mb-4">
                    <AnimatedCounter value={value} />
                    {label === 'Customer Satisfaction' && '%'}
                  </h3>
                  <p className="text-2xl">{label}</p>
                </motion.div>
              </ScrollAnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section
      <section className="py-20 bg-gray-800">
        <div className="container mx-auto px-4">
          <ScrollAnimatedSection>
            <h2 className="text-5xl font-bold text-center mb-16 text-white">Simple, Transparent Pricing</h2>
          </ScrollAnimatedSection>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { plan: "Starter", price: "$99", features: ["1,000 messages/month", "Basic chatbot", "Email support"] },
              { plan: "Pro", price: "$299", features: ["10,000 messages/month", "Advanced AI chatbot", "Priority support", "Custom integrations"] },
              { plan: "Enterprise", price: "Custom", features: ["Unlimited messages", "Full AI suite", "Dedicated account manager", "Custom development"] },
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
                    >
                      {tier.plan === "Enterprise" ? "Contact Sales" : "Get Started"}
                    </motion.button>
                  </div>
                </motion.div>
              </ScrollAnimatedSection>
            ))}
          </div>
        </div>
      </section>
 */}
      {/* Testimonials Section */}
      <section className="py-20 bg-gray-900">
        <div className="container mx-auto px-4">
          {/*<ScrollAnimatedSection>
            <h2 className="text-5xl font-bold text-center mb-16 text-white">What Our Customers Say</h2>
          </ScrollAnimatedSection>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { name: "John Doe", company: "Tech Innovators", quote: "Nuren AI has revolutionized our customer service. Our response times have improved by 80%, and customer satisfaction is at an all-time high." },
              { name: "Jane Smith", company: "Global Retail", quote: "The personalization capabilities of Nuren AI have helped us increase our sales by 25%. It's like having a personal shopper for each customer." },
              { name: "Alex Johnson", company: "StartUp Solutions", quote: "As a startup, Nuren AI has been a game-changer. It's like having an entire customer service team at a fraction of the cost." },
            ].map((testimonial, index) => (
              <ScrollAnimatedSection key={index}>
              <motion.div
                className="bg-gray-800 p-6 rounded-lg shadow-md"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <p className="text-gray-300 mb-4">"{testimonial.quote}"</p>
                <p className="font-bold text-white">{testimonial.name}</p>
                <p className="text-sm text-gray-400">{testimonial.company}</p>
              </motion.div>
            </ScrollAnimatedSection>
          ))}
        </div>*/}
      </div>
    </section>

      {/* FAQ Section
      <section className="py-20 bg-gray-800">
        <div className="container mx-auto px-4">
          <ScrollAnimatedSection>
            <h2 className="text-5xl font-bold text-center mb-16 text-white">Frequently Asked Questions</h2>
          </ScrollAnimatedSection>
          <div className="max-w-3xl mx-auto">
            {[
              { question: "How does Nuren AI integrate with WhatsApp Business API?", answer: "Nuren AI seamlessly integrates with your existing WhatsApp Business API account. Our platform acts as an intelligent layer on top of the API, providing advanced features like AI chatbots, automated campaigns, and analytics." },
              { question: "Is Nuren AI compliant with data protection regulations?", answer: "Yes, Nuren AI is fully compliant with GDPR, CCPA, and other major data protection regulations. We implement strict security measures to ensure your data and your customers' data is always protected." },
              { question: "Can I customize the AI chatbots to match my brand voice?", answer: "Absolutely! Our AI chatbots are highly customizable. You can train them with your specific brand voice, create custom flows, and even integrate them with your knowledge base to provide accurate, brand-specific responses." },
              { question: "What kind of support does Nuren AI offer?", answer: "We offer tiered support based on your plan. All customers receive email support, while Pro and Enterprise customers get priority support with faster response times. Enterprise customers also benefit from a dedicated account manager." },
            ].map((faq, index) => (
              <ScrollAnimatedSection key={index}>
                <motion.div
                  className="mb-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <h3 className="text-2xl font-bold mb-4 text-green-400">{faq.question}</h3>
                  <p className="text-gray-300">{faq.answer}</p>
                </motion.div>
              </ScrollAnimatedSection>
            ))}
          </div>
        </div>
      </section>
 */}
      {/* CTA Section
      <section className="py-20 bg-gradient-to-r from-green-600 to-blue-600 text-white relative overflow-hidden">
        <FloatingElement yOffset={30} duration={5}>
          <div className="absolute top-10 left-10 w-24 h-24 bg-white rounded-full opacity-10" />
        </FloatingElement>
        <FloatingElement yOffset={-20} duration={4}>
          <div className="absolute bottom-10 right-10 w-16 h-16 bg-white rounded-full opacity-10" />
        </FloatingElement>
        <div className="container mx-auto px-4 text-center">
          <ScrollAnimatedSection>
            <h2 className="text-5xl font-bold mb-8">Ready to Transform Your WhatsApp Business?</h2>
            <p className="text-2xl mb-12 max-w-3xl mx-auto">
              Join thousands of businesses already using Nuren AI to streamline their WhatsApp communication and boost customer engagement.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-green-600 font-bold py-4 px-10 rounded-full text-xl shadow-lg hover:bg-gray-100 transition duration-300"
            >
              Start Your Free Trial
            </motion.button>
          </ScrollAnimatedSection>
        </div>
      </section>
 */}
      {/* Footer */}
     {/* Footer */}
<footer className="py-20 bg-gradient-to-r from-green-600 to-blue-600 text-white relative overflow-hidden">
  <FloatingElement yOffset={30} duration={5}>
    <div className="absolute top-10 left-10 w-24 h-24 bg-white rounded-full opacity-10" />
  </FloatingElement>
  <FloatingElement yOffset={-20} duration={4}>
    <div className="absolute bottom-10 right-10 w-16 h-16 bg-white rounded-full opacity-10" />
  </FloatingElement>
  <div className="container mx-auto px-4">
    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-black">
      <div>
        <h3 className="text-2xl font-gliker mb-4">Nuren AI</h3>
        <p className="text-white">Revolutionizing WhatsApp business communication with AI-powered solutions.</p>
      </div>
      {[
        { title: "Product", links: ["Features", "Pricing", "Case Studies"] },
        { title: "Company", links: ["About Us", "Careers", "Contact"] },
        { title: "Legal", links: ["Privacy Policy", "Terms of Service", "GDPR Compliance"] },
      ].map((column, index) => (
        <div key={index}>
          <h4 className="text-xl font-gliker mb-4 ">{column.title}</h4>
          <ul className="space-y-2 ">
            {column.links.map((link, linkIndex) => (
              <li key={linkIndex}>
                <a href="#" className="text-white hover:text-green-400 transition duration-300 ">{link}</a>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
    <div className="mt-12 pt-8 border-t border-gray-800 text-center text-white font-gliker">
      <p>&copy; 2024 Nu Renaissance Fabrica Pvt Ltd. All rights reserved.</p>
    </div>
  </div>
</footer>
    </div>
  );
};

export default Homepage;