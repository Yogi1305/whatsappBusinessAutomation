import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Smartphone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import qrbg from "../../assets/qrbg.png";
import WhatsAppQRCode from '../Chatbot/WhatsappQrCode';
import axios from 'axios';
import camera from "../../assets/camera.png";
const getTenantIdFromUrl = () => {
  const pathArray = window.location.pathname.split('/');
  if (pathArray.length >= 2) {
    var tenant_id = pathArray[1];
    if (tenant_id == "demo") tenant_id = 'll';
    return tenant_id;
  }
  return null;
};

const ChatbotDemoSection = ({ isAuthenticated }) => {
  const navigate = useNavigate();
  const [socket, setSocket] = useState(null);
  const tenantId = getTenantIdFromUrl();
  const [businessPhoneNumberId, setBusinessPhoneNumberId] = useState('');
  const [sessionId, setSessionId] = useState(null);

  useEffect(() => {
    const fetchBusinessPhoneId = async () => {
      try {
        const response = await axios.get('https://backenreal-hgg2d7a0d9fzctgj.eastus-01.azurewebsites.net/get-bpid/', {
          headers: {
            'X-Tenant-Id': "ll"
          }
        });
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

    const generatedSessionId = `*/` + Math.random().toString(36).substr(2, 9);
    setSessionId(generatedSessionId);
    localStorage.setItem('sessionId', generatedSessionId);

    return () => newSocket.close();
  }, []);

  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (message) => {
      if (message && !isAuthenticated) {
        localStorage.setItem('homepageQRScanned', 'true');
        localStorage.setItem('chatbotContactPhone', message.contactPhone);
        navigate(`/demo/chatbot/`, { 
          state: { 
            contactPhone: message.contactPhone,
            fromHomepage: true,
            sessionId: sessionId
          } 
        });
      }
    };

    const handleTempUser = (message) => {
      if (message && !isAuthenticated) {
        const storedSessionId = localStorage.getItem('sessionId');
        const formattedMessageTempUser = `*/${message.temp_user}`;
        
        if (formattedMessageTempUser === storedSessionId) {
          localStorage.setItem('homepageQRScanned', 'true');
          localStorage.setItem('chatbotContactPhone', message.contactPhone);
          navigate(`/demo/chatbot/`, { 
            state: { 
              contactPhone: message.contactPhone,
              fromHomepage: true,
              sessionId: storedSessionId
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
  }, [socket, isAuthenticated, navigate, sessionId]);

  return (
    <section className="py-20 bg-black">
  <div className="container mx-auto px-4">
    <motion.h2
      className="text-5xl font-bold text-center mb-16 text-gray-800"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      Experience Our Chatbot Demo
    </motion.h2>

    {/* Flex container for the image on the left and QR code on the right */}
    <div className="flex flex-col md:flex-row items-center justify-between">
      {/* Left side: Image */}
      <div className="w-full md:w-1/4 mb-12 md:mb-0" style={{marginLeft:'15%'}}>
        <motion.div
         
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <img
            src={camera} // Replace with your image source
            alt="Chatbot Demo"
          />
        </motion.div>
      </div>

      {/* Right side: Background image and QR code */}
      <div className="w-full md:w-1/2 md:pl-12">
        <motion.div
          className="relative p-4 rounded-lg inline-block"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <img
            src={qrbg}
            alt="Background"
            className="w-full h-auto rounded-lg"
            style={{ width: '252px', height: '100px' }} // Double size of the background image
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-white p-2 rounded-lg shadow-xl">
              <WhatsAppQRCode sessionId={sessionId} />
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