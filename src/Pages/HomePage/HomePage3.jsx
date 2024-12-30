import React, { useState, useEffect } from 'react';
import { ChevronRight, Phone, MessageCircle, Users, Play, Pause, Volume2, VolumeX } from 'lucide-react';

// Navigation Component
const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-black/90 backdrop-blur-sm' : 'bg-transparent'
    }`}>
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <span className="text-2xl font-bold text-green-400">WhatsApp Pro</span>
          </div>
          <div className="hidden md:block">
            <div className="flex items-center space-x-8">
              <a href="#demo" className="text-gray-300 hover:text-green-400">Demo</a>
              <a href="#features" className="text-gray-300 hover:text-green-400">Features</a>
              <a href="#testimonials" className="text-gray-300 hover:text-green-400">Testimonials</a>
              <a href="#contact" className="text-gray-300 hover:text-green-400">Contact</a>
              <button className="bg-green-500 text-black px-6 py-2 rounded-full hover:bg-green-400 transition-colors">
                Try Free
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

// Hero Section Component
const HeroSection = () => (
  <div className="relative min-h-screen flex items-center bg-gradient-to-r from-black to-gray-900">
    <div className="absolute inset-0 bg-grid-pattern opacity-5" />
    <div className="container mx-auto px-6 py-24">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div>
          <h1 className="text-5xl font-bold leading-tight mb-6 text-white">
            Transform Customer Engagement with
            <span className="text-green-400"> WhatsApp Automation</span>
          </h1>
          <p className="text-xl text-gray-400 mb-8">
            Automate customer interactions, boost sales, and provide 24/7 support with our intelligent WhatsApp solution.
          </p>
          <div className="flex space-x-4">
            <button className="bg-green-500 text-black px-8 py-4 rounded-full hover:bg-green-400 transition-all transform hover:scale-105">
              Request Demo <ChevronRight className="inline ml-2" size={20} />
            </button>
            <button className="border-2 border-green-400 text-green-400 px-8 py-4 rounded-full hover:bg-green-400/10 transition-all">
              Learn More
            </button>
          </div>
        </div>
        <div className="relative">
          <img
            src="/api/placeholder/600/400"
            alt="WhatsApp Automation Dashboard"
            className="rounded-lg shadow-2xl"
          />
        </div>
      </div>
    </div>
  </div>
);

// Chatbot Demo Section Component
const ChatbotDemo = () => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="bg-gray-900 py-24" id="demo">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 text-white">Experience Our Chatbot Live</h2>
          <p className="text-xl text-gray-400">Scan the QR code to start an interactive demo</p>
        </div>
        <div className="flex justify-center">
          <div
            className={`relative transition-transform duration-300 ${
              isHovered ? 'transform scale-105' : ''
            }`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <img
              src="/api/placeholder/300/300"
              alt="Demo QR Code"
              className="rounded-lg shadow-lg"
            />
            <div className="absolute inset-0 bg-green-400 opacity-0 hover:opacity-20 rounded-lg transition-opacity" />
          </div>
        </div>
      </div>
    </div>
  );
};

// Infographic Section Component
const InfographicSection = () => (
  <div className="bg-black py-24" id="features">
    <div className="container mx-auto px-6">
      <div className="grid md:grid-cols-2 gap-12 mb-24">
        <div className="relative">
          <img
            src="/api/placeholder/500/400"
            alt="Sales Analytics"
            className="rounded-lg shadow-xl"
          />
        </div>
        <div className="flex flex-col justify-center">
          <h2 className="text-4xl font-bold mb-6 text-blue-400">
            Sales is a Numbers Game
          </h2>
          <p className="text-xl text-gray-400 mb-8">
            Track, analyze, and optimize your WhatsApp campaigns with our powerful analytics dashboard.
          </p>
          <button className="bg-blue-500 text-black px-8 py-4 rounded-full hover:bg-blue-400 transition-all w-fit">
            Learn More
          </button>
        </div>
      </div>
      <div className="grid md:grid-cols-2 gap-12">
        <div className="flex flex-col justify-center">
          <h2 className="text-4xl font-bold mb-6 text-green-400">
            WhatsApp is where Numbers Add Up!
          </h2>
          <p className="text-xl text-gray-400 mb-8">
            Leverage the world's most popular messaging platform to grow your business exponentially.
          </p>
          <button className="bg-green-500 text-black px-8 py-4 rounded-full hover:bg-green-400 transition-all w-fit">
            Schedule Demo
          </button>
        </div>
        <div className="relative">
          <img
            src="/api/placeholder/500/400"
            alt="WhatsApp Business Growth"
            className="rounded-lg shadow-xl"
          />
        </div>
      </div>
    </div>
  </div>
);

// Video Advertisement Section Component
const VideoAd = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  return (
    <div className="bg-gray-900 py-24">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <div className="relative rounded-2xl overflow-hidden shadow-2xl">
            <img
              src="/api/placeholder/800/450"
              alt="Video Placeholder"
              className="w-full"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
              <div className="flex space-x-4">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="bg-black/80 text-white rounded-full p-4 hover:bg-black transition-colors"
                >
                  {isPlaying ? <Pause size={24} /> : <Play size={24} />}
                </button>
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="bg-black/80 text-white rounded-full p-4 hover:bg-black transition-colors"
                >
                  {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
                </button>
              </div>
            </div>
          </div>
          <div className="text-center mt-12">
            <p className="text-xl text-gray-400 italic">
              "WhatsApp Automation transformed our customer service. We've seen a 300% increase in response rates!"
            </p>
            <p className="mt-4 font-semibold text-white">John Doe, CEO of TechCorp</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Footer Component
const Footer = () => (
  <footer className="bg-black text-white py-16">
    <div className="container mx-auto px-6">
      <div className="grid md:grid-cols-4 gap-12">
        <div>
          <h3 className="text-2xl font-bold mb-6 text-green-400">WhatsApp Pro</h3>
          <p className="text-gray-400">
            Transform your business communication with intelligent automation.
          </p>
        </div>
        <div>
          <h4 className="text-lg font-semibold mb-4 text-white">Quick Links</h4>
          <ul className="space-y-2">
            <li><a href="#" className="text-gray-400 hover:text-green-400">About Us</a></li>
            <li><a href="#" className="text-gray-400 hover:text-green-400">Features</a></li>
            <li><a href="#" className="text-gray-400 hover:text-green-400">Pricing</a></li>
            <li><a href="#" className="text-gray-400 hover:text-green-400">Contact</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-lg font-semibold mb-4 text-white">Legal</h4>
          <ul className="space-y-2">
            <li><a href="#" className="text-gray-400 hover:text-green-400">Privacy Policy</a></li>
            <li><a href="#" className="text-gray-400 hover:text-green-400">Terms of Service</a></li>
            <li><a href="#" className="text-gray-400 hover:text-green-400">Cookie Policy</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-lg font-semibold mb-4 text-white">Newsletter</h4>
          <form className="space-y-4">
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:border-green-400"
            />
            <button className="w-full bg-green-500 text-black px-6 py-2 rounded-lg hover:bg-green-400 transition-colors">
              Subscribe
            </button>
          </form>
        </div>
      </div>
      <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
        <p>&copy; 2024 WhatsApp Pro. All rights reserved.</p>
      </div>
    </div>
  </footer>
);

// Main App Component
const WhatsAppLandingPage = () => (
  <div className="min-h-screen bg-black">
    <Navigation />
    <HeroSection />
    <ChatbotDemo />
    <InfographicSection />
    <VideoAd />
    <Footer />
  </div>
);

export default WhatsAppLandingPage;