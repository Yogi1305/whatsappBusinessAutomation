import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { MessageCircle, Zap, BarChart2, Send, CheckCircle, ArrowRight, HelpCircle, BookOpen, Rocket } from "lucide-react";
import Footer from '../footer';

const Learn = () => {
  const [showAnimation, setShowAnimation] = useState(false);
  
  useEffect(() => {
    // Trigger animations after component mounts
    setShowAnimation(true);
    
    // Scroll to top on component mount
    window.scrollTo(0, 0);
  }, []);

  const fadeInUpVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6 }
    }
  };
  
  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };
  
  // Common card styling - keeping relative positioning but removing the horizontal line
  const cardBaseStyle = "relative bg-card/80 backdrop-blur-sm rounded-2xl shadow-md overflow-hidden transition-all duration-300 group border border-border/40 hover:border-emerald-500/30 hover:bg-emerald-500/5";

  const features = [
    {
      icon: <MessageCircle className="w-6 h-6 text-emerald-500" />,
      title: "Chatbot Integration",
      description: "Automate customer service with intelligent chatbots that handle inquiries 24/7."
    },
    {
      icon: <Send className="w-6 h-6 text-emerald-500" />,
      title: "Broadcast Messaging",
      description: "Send promotional messages to your entire customer base in a few clicks."
    },
    {
      icon: <Zap className="w-6 h-6 text-emerald-500" />,
      title: "Interactive Campaigns",
      description: "Engage your customers with rich media like images, videos, and buttons directly in WhatsApp."
    },
    {
      icon: <BarChart2 className="w-6 h-6 text-emerald-500" />,
      title: "Real-Time Analytics",
      description: "Track the performance of your campaigns and optimize them for better results."
    }
  ];

  const faqs = [
    {
      question: "What is WhatsApp Automation?",
      answer: "WhatsApp automation involves using bots and other tools to manage customer interactions on WhatsApp automatically. It allows businesses to scale their communication while maintaining personalization."
    },
    {
      question: "How can WhatsApp Marketing benefit my business?",
      answer: "It can significantly boost customer engagement, reduce manual work, and improve your conversion rates through personalized marketing. WhatsApp has a 98% open rate, making it one of the most effective marketing channels available today."
    },
    {
      question: "How can I start using WhatsApp Automation?",
      answer: "You can sign up for a free trial with us and get started in minutes. Our platform is designed to be user-friendly, requiring no coding knowledge to set up and run campaigns."
    },
    {
      question: "Is WhatsApp automation compliant with privacy regulations?",
      answer: "Yes, our platform is designed to be compliant with WhatsApp's Business Policy and privacy regulations like GDPR. We only send messages to users who have opted in to receive communications."
    }
  ];

  const benefits = [
    {
      title: "Instant Response",
      description: "Keep your customers engaged with real-time automated responses."
    },
    {
      title: "Personalized Marketing",
      description: "Send personalized messages to improve your marketing efforts."
    },
    {
      title: "Increased Efficiency",
      description: "Save time by automating repetitive tasks, allowing your team to focus on more important activities."
    },
    {
      title: "Enhanced Customer Experience",
      description: "Provide 24/7 customer support, reducing response time and improving satisfaction."
    },
    {
      title: "Boost Conversion Rates",
      description: "WhatsApp marketing campaigns have higher open rates and better engagement than traditional methods."
    }
  ];

  return (
    <div className="min-h-screen bg-black">
      {/* SEO Meta Tags */}
      <Helmet>
        <title>WhatsApp Automation & Marketing | Boost Engagement & Sales</title>
        <meta name="description" content="Learn how to leverage WhatsApp automation to skyrocket your business growth. Use our WhatsApp marketing solution to engage customers and increase conversions." />
        <meta name="keywords" content="WhatsApp automation, WhatsApp marketing, chatbot marketing, customer engagement, increase sales, marketing automation" />
        <meta name="robots" content="index, follow" />
      </Helmet>

      {/* Background pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.05)_1px,transparent_1px)] bg-[size:32px_32px] opacity-20 pointer-events-none" />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-16 md:pt-32 md:pb-24">
        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            className="text-center max-w-3xl mx-auto"
            initial="hidden"
            animate={showAnimation ? "visible" : "hidden"}
            variants={fadeInUpVariants}
          >
            <div className="inline-flex items-center justify-center mb-6">
              <Badge variant="outline" className="px-3 py-1 border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs font-medium">
                Learn & Grow
              </Badge>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent">
              WhatsApp Automation & Marketing
            </h1>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Revolutionize your customer engagement with our powerful WhatsApp automation solution. Automate conversations, drive more leads, and skyrocket your sales with ease!
            </p>
            
            <motion.div
              whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
              className="inline-block"
            >
              <a 
                href="/register" 
                className="inline-flex items-center px-8 py-4 rounded-lg bg-gradient-to-r from-emerald-500/80 to-emerald-500 text-white font-semibold hover:opacity-90 transition-all duration-300 group shadow-lg hover:shadow-emerald-500/30"
              >
                <span>Get Started Free</span>
                <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
              </a>
            </motion.div>
          </motion.div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-1/2 left-0 w-64 h-64 bg-emerald-500/10 rounded-full filter blur-3xl opacity-30 transform -translate-y-1/2 -translate-x-1/2"></div>
        <div className="absolute top-1/3 right-0 w-80 h-80 bg-emerald-500/10 rounded-full filter blur-3xl opacity-30 transform -translate-y-1/2 translate-x-1/2"></div>
      </section>

      {/* What is WhatsApp Automation Section */}
      <section className="py-16 md:py-24 relative">
        <div className="container mx-auto px-4">
          <motion.div 
            className="max-w-4xl mx-auto"
            initial="hidden"
            animate={showAnimation ? "visible" : "hidden"}
            variants={fadeInUpVariants}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-8 bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent">
              What is WhatsApp Automation?
            </h2>
            <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
              WhatsApp Automation allows businesses to automate communication with customers through WhatsApp. With tools like chatbots, you can automatically respond to customer queries, send notifications, and even initiate marketing campaigns. This not only saves time but also enhances the customer experience, making it easier for businesses to convert leads into paying customers.
            </p>
            
            <div className={cn(cardBaseStyle, "p-6 md:p-8 mt-12")}>
              {/* Removed horizontal line */}
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                <div className="p-4 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                  <Rocket className="w-8 h-8 text-emerald-500" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Did you know?</h3>
                  <p className="text-muted-foreground">
                    WhatsApp has over 2 billion users worldwide, with an average of 100 billion messages sent daily. Businesses using WhatsApp automation see up to 70% higher customer engagement rates compared to traditional channels.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 md:py-24 relative bg-gradient-to-b from-black to-emerald-950/20">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center max-w-3xl mx-auto mb-16"
            initial="hidden"
            animate={showAnimation ? "visible" : "hidden"}
            variants={fadeInUpVariants}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent">
              Why Use WhatsApp Automation for Marketing?
            </h2>
            <p className="text-muted-foreground text-lg">
              Discover how WhatsApp automation can transform your business communication and marketing efforts
            </p>
          </motion.div>
          
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            animate={showAnimation ? "visible" : "hidden"}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto"
          >
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                variants={fadeInUpVariants}
                className={cn(cardBaseStyle, "p-6")}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                {/* Removed horizontal line */}
                <div className="flex items-start mb-4">
                  <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 mr-4">
                    <CheckCircle className="w-5 h-5 text-emerald-500" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground group-hover:text-emerald-500 transition-colors">
                    {benefit.title}
                  </h3>
                </div>
                <p className="text-muted-foreground text-sm pl-11">
                  {benefit.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 relative">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center max-w-3xl mx-auto mb-16"
            initial="hidden"
            animate={showAnimation ? "visible" : "hidden"}
            variants={fadeInUpVariants}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent">
              Features of Our WhatsApp Marketing Product
            </h2>
            <p className="text-muted-foreground text-lg">
              Our WhatsApp automation platform is designed to give your business the tools it needs to succeed in the modern marketing landscape
            </p>
          </motion.div>
          
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            animate={showAnimation ? "visible" : "hidden"}
            className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={fadeInUpVariants}
                className={cn(cardBaseStyle, "p-6 md:p-8")}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                {/* Removed horizontal line */}
                <div className="flex items-center mb-4">
                  <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 mr-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-foreground group-hover:text-emerald-500 transition-colors">
                    {feature.title}
                  </h3>
                </div>
                <p className="text-muted-foreground pl-16">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 relative bg-gradient-to-b from-emerald-950/20 to-black">
        <div className="container mx-auto px-4">
          <motion.div 
            className="max-w-4xl mx-auto text-center"
            initial="hidden"
            animate={showAnimation ? "visible" : "hidden"}
            variants={fadeInUpVariants}
          >
            <div className="inline-flex p-3 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-6">
              <Rocket className="w-8 h-8 text-emerald-500" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent">
              Ready to Automate Your Marketing?
            </h2>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed max-w-2xl mx-auto">
              Join the hundreds of businesses using our WhatsApp automation to grow their revenue. Start your free trial today and see the results for yourself.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <motion.div
                whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
              >
                <a 
                  href="/register" 
                  className="inline-flex items-center px-8 py-4 rounded-lg bg-gradient-to-r from-emerald-500/80 to-emerald-500 text-white font-semibold hover:opacity-90 transition-all duration-300 group shadow-lg hover:shadow-emerald-500/30 w-full sm:w-auto justify-center"
                >
                  <span>Start Free Trial</span>
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                </a>
              </motion.div>
              
              <a 
                href="/pricing" 
                className="inline-flex items-center px-8 py-4 rounded-lg bg-card/80 backdrop-blur-sm border border-border/40 text-foreground font-semibold hover:bg-emerald-500/5 hover:border-emerald-500/30 transition-all duration-300 group w-full sm:w-auto justify-center"
              >
                <span>View Pricing</span>
                <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 md:py-24 relative">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center max-w-3xl mx-auto mb-16"
            initial="hidden"
            animate={showAnimation ? "visible" : "hidden"}
            variants={fadeInUpVariants}
          >
            <div className="inline-flex p-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-6">
              <HelpCircle className="w-6 h-6 text-emerald-500" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent">
              Frequently Asked Questions
            </h2>
            <p className="text-muted-foreground text-lg">
              Get answers to common questions about WhatsApp automation and marketing
            </p>
          </motion.div>
          
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            animate={showAnimation ? "visible" : "hidden"}
            className="max-w-4xl mx-auto space-y-6"
          >
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                variants={fadeInUpVariants}
                className={cn(cardBaseStyle, "p-6 md:p-8")}
              >
                {/* Removed horizontal line */}
                <h3 className="text-xl font-bold mb-4 text-foreground group-hover:text-emerald-500 transition-colors">
                  {faq.question}
                </h3>
                <p className="text-muted-foreground">
                  {faq.answer}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Explore More Section */}
      <section className="py-16 md:py-24 relative bg-gradient-to-b from-black to-emerald-950/10">
        <div className="container mx-auto px-4">
          <motion.div 
            className="max-w-4xl mx-auto"
            initial="hidden"
            animate={showAnimation ? "visible" : "hidden"}
            variants={fadeInUpVariants}
          >
            <div className="text-center mb-12">
              <div className="inline-flex p-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-6">
                <BookOpen className="w-6 h-6 text-emerald-500" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent">
                Explore More
              </h2>
              <p className="text-muted-foreground text-lg">
                Discover more resources to help you master WhatsApp marketing
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { title: "WhatsApp Automation Features", link: "/features" },
                { title: "Pricing Plans", link: "/pricing" },
                { title: "Latest Blog on WhatsApp Marketing", link: "/blogs" },
                { title: "Sign Up for Free Trial", link: "/register" }
              ].map((item, index) => (
                <a 
                  key={index}
                  href={item.link}
                  className={cn(
                    cardBaseStyle, 
                    "p-6 flex items-center justify-between group cursor-pointer"
                  )}
                >
                  {/* No horizontal line needed here */}
                  <span className="font-medium text-foreground group-hover:text-emerald-500 transition-colors">
                    {item.title}
                  </span>
                  <ArrowRight className="h-5 w-5 text-emerald-500 transition-transform duration-300 group-hover:translate-x-1" />
                </a>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Learn;