import { useState } from "react";
import { motion } from "framer-motion";
import { 
  MessageSquare, 
  Bot, 
  Zap, 
  ShoppingCart, 
  ArrowRight, 
  Users, 
  Shield, 
  Star 
} from 'lucide-react';
import dale from '../../assets/dale.png'
const VideoSection = () => {
  return (
    <div className="relative bg-black overflow-hidden min-h-[calc(100vh-7rem)]">
      {/* Gradient background that complements navbar and banner */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-green-950/40 to-emerald-950/40" />
      
      {/* Subtle pattern overlay */}
      <div className="absolute inset-0">
        <svg className="absolute w-full h-full opacity-5" viewBox="0 0 100 100" preserveAspectRatio="none">
          <pattern id="hexagons" width="8" height="14" patternUnits="userSpaceOnUse">
            <path d="M4 0l4 7-4 7H0l-4-7L0 0z" fill="none" stroke="currentColor" className="text-emerald-500" strokeWidth="0.2" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#hexagons)" />
        </svg>
      </div>

      <div className="container mx-auto px-6 pt-24 pb-16 relative z-10">
        {/* Stats row with adjusted styling */}
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          {/* Content Column */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="text-left"
          >
            <h1 className="text-5xl font-bold mb-6 leading-tight">
              <span className="text-white">
              Transform Your WhatsApp
              </span>
              <br />
              <span className="bg-gradient-to-r from-emerald-400 to-green-300 bg-clip-text text-transparent">
              Into a 24/7 Revenue Engine
              </span>
            </h1>

            <p className="text-xl text-emerald-100/90 mb-8"> Boost sales and engagement with AI-driven WhatsApp automation. Simplify campaigns and convert leads effortlessly. </p>

            {/* Key benefits with adjusted spacing */}
            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-emerald-900/20 border border-emerald-500/20">
                  <Bot className="w-5 h-5 text-emerald-400" />
                </div>
                <span className="text-emerald-100">Auto-reply to 90% of common questions</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-emerald-900/20 border border-emerald-500/20">
                  <ShoppingCart className="w-5 h-5 text-emerald-400" />
                </div>
                <span className="text-emerald-100">Convert enquiries into sales 24/7</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-emerald-900/20 border border-emerald-500/20">
                  <Zap className="w-5 h-5 text-emerald-400" />
                </div>
                <span className="text-emerald-100">Bulk broadcast to 1000s in one click</span>
              </div>
            </div>

            {/* CTAs with adjusted styling */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-500 text-white rounded-lg font-semibold text-lg flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
              >
                Start 14-Day Free Trial
                <ArrowRight className="w-5 h-5" />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-6 py-3 border border-emerald-500/30 text-emerald-400 rounded-lg font-semibold text-lg flex items-center justify-center gap-2"
              >
                Watch 2-Min Demo
                <MessageSquare className="w-5 h-5" />
              </motion.button>
            </div>

            {/* Trust badge */}
            <div className="flex items-center gap-2 text-sm text-emerald-300/80">
              <Shield className="w-4 h-4" />
              <span>Official WhatsApp Tech Provider</span>
            </div>
          </motion.div>

          {/* Image Column */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="relative"
          >
            <div className="relative">
              {/* Subtle glow */}
              <div className="absolute -inset-4 bg-emerald-500/5 rounded-3xl blur-2xl" />
              {/* Image container */}
              <div className="relative rounded-2xl overflow-hidden border border-emerald-500/20">
                <img 
                  src={dale} 
                  alt="WhatsApp Business Automation Dashboard"
                  className="w-full object-cover"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default VideoSection;