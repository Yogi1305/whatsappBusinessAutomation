import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, MessageSquare, Users, Send, BarChart2 } from 'lucide-react';

const steps = [
  {
    title: "Connect WhatsApp Business API",
    description: "Seamlessly integrate your WhatsApp Business account with Nuren AI.",
    icon: <MessageSquare className="w-8 h-8" />
  },
  {
    title: "Set up AI-powered Chatbots",
    description: "Create intelligent conversational flows to engage your customers.",
    icon: <CheckCircle className="w-8 h-8" />
  },
  {
    title: "Create Targeted Lists",
    description: "Segment your audience for personalized messaging campaigns.",
    icon: <Users className="w-8 h-8" />
  },
  {
    title: "Launch Automated Campaigns",
    description: "Schedule and send targeted messages to boost engagement.",
    icon: <Send className="w-8 h-8" />
  },
  {
    title: "Analyze and Optimize",
    description: "Track performance metrics and refine your strategies for better results.",
    icon: <BarChart2 className="w-8 h-8" />
  }
];

const HowNurenAIWorks = () => {
  return (
    <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <motion.h2 
          className="text-5xl font-bold text-center mb-16 text-gray-800"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          How Nuren AI Works
        </motion.h2>
        <div className="max-w-5xl mx-auto">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              className="flex items-center mb-16 last:mb-0"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="bg-green-500 text-white rounded-full w-20 h-20 flex items-center justify-center mr-8 shadow-lg">
                {step.icon}
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-semibold text-gray-800 mb-2">{step.title}</h3>
                <p className="text-lg text-gray-600">{step.description}</p>
              </div>
              <div className="hidden md:block w-24 h-24 bg-green-100 rounded-full opacity-20 absolute -right-12 -z-10"></div>
            </motion.div>
          ))}
        </div>
        <motion.div 
          className="text-center mt-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <a href="#" className="bg-green-500 text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-green-600 transition-colors duration-300">
            Get Started Now
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default HowNurenAIWorks;