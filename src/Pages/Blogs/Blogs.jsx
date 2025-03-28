import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { BookOpen, ArrowRight } from "lucide-react";
import Footer from '../footer';

// Import images
import WhatsappChatbot from '../../assets/chatbot.webp';
import WhatsappEngage from '../../assets/WhatsappEngage.webp';
import BusinessGrowth from '../../assets/BusinessGrowth.webp';
import Feedback from '../../assets/Feedback.webp';
import MarketingSt from '../../assets/marketingStrat.webp';
import Segment from '../../assets/connection.webp';

const blogs = [ 
  {
    id: 1,
    title: "Top 10 WhatsApp Marketing Strategies for Small Businesses",
    description: "Learn effective marketing strategies to grow your small business using WhatsApp Business API.",
    imageUrl: MarketingSt,
    link: "/blogs/marketing-strategy",
    category: "Marketing"
  },
  {
    id: 2,
    title: "Using Technology to Boost Business Outreach & Revenue",
    description: "Discover how modern technology can help expand your business reach and increase revenue.",
    imageUrl: BusinessGrowth,
    link: "/blogs/business-outreach",
    category: "Growth"
  },
  {
    id: 3,
    title: "Maximize Customer Engagement with WhatsApp",
    description: "Explore techniques to enhance customer engagement through WhatsApp's powerful features.",
    imageUrl: WhatsappEngage,
    link: "/blogs/whatsapp-engagement",
    category: "Engagement"
  },
  {
    id: 4,
    title: "How to Handle Customer Feedback via WhatsApp: Best Practices",
    description: "Best practices for collecting, managing, and acting on customer feedback through WhatsApp.",
    imageUrl: Feedback,
    link: "/blogs/customer-feedback",
    category: "Customer Service"
  },
  {
    id: 5,
    title: "AI Chatbots: The Future of Customer Engagement on WhatsApp",
    description: "How AI-powered chatbots are revolutionizing customer interactions on WhatsApp.",
    imageUrl: WhatsappChatbot,
    link: "/blogs/chatbot",
    category: "AI & Automation"
  },
  {
    id: 6,
    title: "Segmenting & Personalizing User Experience for Increased Revenue",
    description: "Strategies for segmenting your audience and delivering personalized experiences that drive revenue.",
    imageUrl: Segment,
    link: "/blogs/segmentation",
    category: "Personalization"
  },
];

const Blogs = () => {
  const [showAnimation, setShowAnimation] = useState(false);
  const [hoveredBlog, setHoveredBlog] = useState(null);
  
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
  
  // Common card styling
  const cardBaseStyle = "relative bg-card/80 backdrop-blur-sm rounded-2xl shadow-md overflow-hidden transition-all duration-300 group border border-border/40 hover:border-emerald-500/30 hover:bg-emerald-500/5";

  return (
    <div className="min-h-screen bg-black">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.05)_1px,transparent_1px)] bg-[size:32px_32px] opacity-20 pointer-events-none" />
      
      <div className="container mx-auto px-4 py-12 md:py-20 relative z-10">
        <motion.div 
          className="text-center max-w-3xl mx-auto mb-16"
          initial="hidden"
          animate={showAnimation ? "visible" : "hidden"}
          variants={fadeInUpVariants}
        >
          <div className="inline-flex items-center justify-center mb-6">
            <Badge variant="outline" className="px-3 py-1 border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs font-medium">
              Knowledge Center
            </Badge>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent">
            Our Latest Blogs
          </h1>
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
            Insights, tips, and strategies to help you maximize your WhatsApp Business potential
          </p>
        </motion.div>

        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          animate={showAnimation ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {blogs.map((blog) => (
            <motion.div
              key={blog.id}
              variants={fadeInUpVariants}
              className={cn(cardBaseStyle, "cursor-pointer overflow-hidden h-full flex flex-col")}
              onClick={() => window.location.href = blog.link}
              onMouseEnter={() => setHoveredBlog(blog.id)}
              onMouseLeave={() => setHoveredBlog(null)}
              whileHover={{ y: -10, transition: { duration: 0.2 } }}
            >
              <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-emerald-500/80 to-emerald-500" />
              
              <div className="relative overflow-hidden aspect-video">
                <img 
                  src={blog.imageUrl} 
                  alt={blog.title} 
                  className="w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
                  loading="lazy" // Added lazy loading
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                <Badge 
                  className="absolute top-4 left-4 bg-emerald-500/90 text-white border-none text-xs font-medium px-2.5 py-1"
                >
                  {blog.category}
                </Badge>
              </div>
              
              <div className="p-6 flex-grow flex flex-col">
                <h2 className="text-xl font-bold mb-3 text-foreground group-hover:text-emerald-500 transition-colors line-clamp-2">
                  {blog.title}
                </h2>
                <p className="text-muted-foreground text-sm mb-4 line-clamp-3 flex-grow">
                  {blog.description}
                </p>
                <div className="flex items-center text-emerald-500 text-sm font-medium mt-auto">
                  <span>Read Article</span>
                  <ArrowRight className={`ml-2 h-4 w-4 transition-transform duration-300 ${hoveredBlog === blog.id ? 'translate-x-1' : ''}`} />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
        
        <motion.div 
          className="mt-16 text-center max-w-3xl mx-auto"
          initial={{ opacity: 0 }}
          animate={showAnimation ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
        >
          <div className="inline-flex p-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-6">
            <BookOpen className="w-6 h-6 text-emerald-500" />
          </div>
          <h2 className="text-2xl font-bold mb-4">Want to learn more?</h2>
          <p className="text-muted-foreground mb-6">
            Explore our comprehensive guides and tutorials to master WhatsApp Business automation
          </p>
          <a 
            href="/blogs/learn-more" 
            className="inline-flex items-center px-6 py-3 rounded-lg bg-gradient-to-r from-emerald-500/80 to-emerald-500 text-white font-semibold hover:opacity-90 transition-all duration-300 group shadow-lg hover:shadow-emerald-500/30"
          >
            <span>View All Resources</span>
            <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </a>
        </motion.div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Blogs;