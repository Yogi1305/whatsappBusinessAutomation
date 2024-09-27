import React from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Smartphone } from 'lucide-react';
import waqr from "../../assets/waqr.png";
import WhatsAppQRCode from '../Chatbot/WhatsappQrCode';
const ChatbotDemoSection = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.h2
          className="text-5xl font-bold text-center mb-16 text-gray-800"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Experience Our Chatbot Demo
        </motion.h2>
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="w-full md:w-1/2 mb-12 md:mb-0">
            <motion.div
              className="bg-white p-8 rounded-lg shadow-lg"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center mb-6">
                <MessageSquare className="w-12 h-12 text-green-500 mr-4" />
                <h3 className="text-3xl font-bold text-gray-800">Try It Now</h3>
              </div>
              <p className="text-xl text-gray-600 mb-8">
                Scan the QR code with your smartphone to start a conversation with our AI-powered chatbot. Experience firsthand how NurenAI can transform your customer interactions.
              </p>
              <div className="flex items-center text-green-500 font-semibold">
                <Smartphone className="w-6 h-6 mr-2" />
                <span>Scan with your phone's camera</span>
              </div>
            </motion.div>
          </div>
          <div className="w-full md:w-1/2 md:pl-12">
            <motion.div
              className="relative p-4 rounded-lg inline-block"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              {/* Background image */}
              <img src={waqr} alt="Background" className="w-74 h-84" />
              
              {/* Overlay container for QR code */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-white p-2 rounded-lg">
                  <WhatsAppQRCode />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ChatbotDemoSection;