import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Smartphone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import qrbg from "../../assets/qrbg.png";
import WhatsAppQRCode from '../Chatbot/WhatsAppQRCode';
import axios from 'axios';

const getTenantIdFromUrl = () => {
  const pathArray = window.location.pathname.split('/');

  if (pathArray.length >= 2) {
    var tenant_id = pathArray[1]
    if(tenant_id == "demo") tenant_id = 'll'
    return tenant_id; // Assumes tenant_id is the first part of the path
  }
  return null; 
};


const ChatbotDemoSection = ({ isAuthenticated }) => {
  const navigate = useNavigate();
  const [socket, setSocket] = useState(null);
  const tenantId =getTenantIdFromUrl();
  const [businessPhoneNumberId, setBusinessPhoneNumberId] = useState('');

  useEffect(() => {
    const fetchBusinessPhoneId = async () => {
      try {
        const response = await axios.get('https://backenreal-hgg2d7a0d9fzctgj.eastus-01.azurewebsites.net/get-bpid/', {
          headers: {
            'X-Tenant-Id': "ll"
          }
        });
        console.log(response.data.business_phone_number_id,"THIS IS BPID");
        setBusinessPhoneNumberId(response.data.business_phone_number_id);
      } catch (error) {
        console.error('Error fetching business phone ID:', error);
      }
    };

    fetchBusinessPhoneId();
  }, [tenantId]);


  useEffect(() => {
    const newSocket = io('https://whatsappbotserver.azurewebsites.net');
    setSocket(newSocket);

    return () => newSocket.close();
  }, []);

  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (message) => {
      if (message && !isAuthenticated) {
        console.log('Got New Message', message.message);
        localStorage.setItem('homepageQRScanned', 'true');
        localStorage.setItem('chatbotContactPhone', message.contactPhone);
        navigate(`/demo/chatbot/`, { 
          state: { 
            contactPhone: message.contactPhone,
            fromHomepage: true
          } 
        });
      }
    };

    const handleTempUser = (message) => {
      if (message && !isAuthenticated) {
        console.log("New temp user logged");
        const storedSessionId = localStorage.getItem('sessionId');
        const formattedMessageTempUser = `*/${message.temp_user}`;
        
        if (formattedMessageTempUser === storedSessionId) {
          localStorage.setItem('homepageQRScanned', 'true');
          localStorage.setItem('chatbotContactPhone', message.contactPhone);
          navigate(`/demo/chatbot/`, { 
            state: { 
              contactPhone: message.contactPhone,
              fromHomepage: true
            } 
          });
        }
      }
    };

    socket.on('new-message', handleNewMessage);
    socket.on('temp-user', handleTempUser);

    return () => {
      socket.off('new-message', handleNewMessage);
      socket.off('temp-user', handleTempUser);
    };
  }, [socket, isAuthenticated, navigate]);

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
              <img src={qrbg} alt="Background" className="w-63 h-50" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-white p-2 rounded-lg shadow-xl">
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