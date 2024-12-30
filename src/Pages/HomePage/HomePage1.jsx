import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { MessageSquare, Zap, Lock, Smartphone, Bot, Send, Globe, Code } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import ChatbotDemoSection from './ChatbotDemo';

const AnimatedFeatureCard = ({ Icon, title, description }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <Card className="bg-white/5 backdrop-blur-lg border-0 overflow-hidden relative group">
      <CardContent className="p-6">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <motion.div
          className="relative z-10"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <div className="flex items-center mb-4">
            <Icon className="w-6 h-6 text-primary" />
            <h3 className="text-lg font-semibold ml-3 text-white">{title}</h3>
          </div>
          <p className="text-gray-300 leading-relaxed">{description}</p>
        </motion.div>
      </CardContent>
    </Card>
  );
};

const HeroSection = () => {
  return (
    <section className="min-h-screen relative overflow-hidden bg-gradient-to-b from-background via-background/95 to-background">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 opacity-30 blur-3xl" />
      </div>
      <div className="container mx-auto px-6 py-32 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <motion.div 
            className="lg:w-1/2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl lg:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary/80 to-secondary leading-tight">
              Transform Your Business with AI-Powered Communication
            </h1>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              Elevate customer engagement with intelligent chatbots, automated marketing campaigns, and seamless WhatsApp integration.
            </p>
            <div className="flex flex-wrap gap-4">
              <motion.button 
                className="bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-lg font-medium transition-all shadow-lg shadow-primary/25"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Start Free Trial
              </motion.button>
              <motion.button 
                className="bg-white/10 backdrop-blur-lg hover:bg-white/20 text-white px-8 py-3 rounded-lg font-medium transition-all"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Watch Demo
              </motion.button>
            </div>
          </motion.div>
          <motion.div 
            className="lg:w-1/2"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/30 to-secondary/30 blur-2xl" />
              <img 
                src="/api/placeholder/600/400" 
                alt="Dashboard Preview" 
                className="rounded-xl shadow-2xl relative z-10 border border-white/10"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const FeaturesSection = () => {
  const features = [
    {
      Icon: MessageSquare,
      title: "Intelligent Chatbots",
      description: "Advanced AI-powered conversational agents that understand context and deliver personalized responses."
    },
    {
      Icon: Lock,
      title: "Secure Verification",
      description: "Enterprise-grade security with instant number verification and compliance measures."
    },
    {
      Icon: Send,
      title: "Smart Marketing",
      description: "Data-driven campaign management with automated targeting and engagement tracking."
    },
    {
      Icon: Code,
      title: "Seamless Integration",
      description: "Easy-to-implement APIs and SDKs for perfect integration with your existing systems."
    },
    {
      Icon: Smartphone,
      title: "Mobile-First Platform",
      description: "Powerful mobile app for managing your business communications on the go."
    },
    {
      Icon: Globe,
      title: "Global Scale",
      description: "Reach customers worldwide with multi-language support and regional optimization."
    }
  ];

  return (
    <section className="py-32 bg-gradient-to-b from-background via-background/95 to-background relative">
      <div className="container mx-auto px-6">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-bold mb-4 text-white">
            Enterprise-Grade Features
          </h2>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Everything you need to scale your business communication and automate customer engagement.
          </p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <AnimatedFeatureCard {...feature} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const StatsSection = () => {
  const stats = [
    { label: "Active Users", value: "100,000+" },
    { label: "Messages Processed", value: "10M+" },
    { label: "Customer Satisfaction", value: "99.9%" },
    { label: "Response Time", value: "< 1s" }
  ];

  return (
    <section className="py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 opacity-30" />
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <h3 className="text-4xl font-bold text-white mb-2">{stat.value}</h3>
              <p className="text-gray-300 font-medium">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const CallToAction = () => {
  return (
    <section className="py-32 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/30 to-secondary/30 opacity-30 blur-3xl" />
      </div>
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center"
        >
          <h2 className="text-4xl font-bold text-white mb-6">Ready to Transform Your Business?</h2>
          <p className="text-xl text-gray-300 mb-8">
            Join industry leaders using our platform to revolutionize their customer communication
          </p>
          <motion.button
            className="bg-primary hover:bg-primary/90 text-white px-12 py-4 rounded-lg font-medium transition-all shadow-lg shadow-primary/25 text-lg"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Start Free Trial
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

const HomePage = () => {
  const { scrollYProgress } = useScroll();
  
  return (
    <div className="bg-background min-h-screen">
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-secondary transform origin-left z-50"
        style={{ scaleX: scrollYProgress }}
      />
      <HeroSection />
      <FeaturesSection />
      <ChatbotDemoSection/>
      <StatsSection />
      <CallToAction />
    </div>
  );
};

export default HomePage;