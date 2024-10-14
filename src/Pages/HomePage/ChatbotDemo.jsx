// Import necessary dependencies
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import qrbg from "../../assets/qrbg.png";
import WhatsAppQRCode from '../Chatbot/WhatsappQrCode';
import axios from 'axios';
import camera from "../../assets/camera.png";

// Function to get tenant ID from the URL
const getTenantIdFromUrl = () => {
  const pathArray = window.location.pathname.split('/');
  if (pathArray.length >= 2) {
    var tenant_id = pathArray[1];
    if (tenant_id === "demo") tenant_id = 'll';
    return tenant_id;
  }
  return null;
};

// Particle animation component
const Particle = ({ animate }) => (
  <motion.div
    className="absolute rounded-full bg-green-400 opacity-20"
    animate={animate}
    transition={{
      duration: Math.random() * 10 + 20,
      repeat: Infinity,
      repeatType: "reverse",
    }}
    style={{
      width: Math.random() * 30 + 10,
      height: Math.random() * 30 + 10,
    }}
  />
);

// Main component for Chatbot Demo Section
const ChatbotDemoSection = ({ isAuthenticated }) => {
  const navigate = useNavigate();
  const [socket, setSocket] = useState(null);
  const tenantId = getTenantIdFromUrl();
  const [businessPhoneNumberId, setBusinessPhoneNumberId] = useState('');
  const [sessionId, setSessionId] = useState(null);

  // Fetch business phone ID
  useEffect(() => {
    const fetchBusinessPhoneId = async () => {
      try {
        const response = await axios.get('get-bpid/', {
          headers: {
            'X-Tenant-Id': 'tlb'
          }
        });
        setBusinessPhoneNumberId(response.data.business_phone_number_id);
      } catch (error) {
        console.error('Error fetching business phone ID:', error);
      }
    };

    fetchBusinessPhoneId();
  }, [tenantId]);

  // Setup socket connection
  useEffect(() => {
    const newSocket = io('https://whatsappbotserver.azurewebsites.net');
    setSocket(newSocket);

    const generatedSessionId = `*/` + Math.random().toString(36).substr(2, 9);
    setSessionId(generatedSessionId);
    localStorage.setItem('sessionId', generatedSessionId);

    return () => newSocket.close();
  }, []);

  // Handle incoming messages from socket
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
    <section className="py-20 bg-black text-white min-h-screen flex items-center">
      {[...Array(20)].map((_, i) => (
        <Particle
          key={i}
          animate={{
            x: [Math.random() * window.innerWidth, Math.random() * window.innerWidth],
            y: [Math.random() * window.innerHeight, Math.random() * window.innerHeight],
          }}
        />
      ))}
      <div className="container mx-auto px-4">
        <motion.h2
          className="text-4xl md:text-5xl font-bold text-center mb-16 font-gliker bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-blue-600"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          EXPERIENCE OUR CHATBOT
        </motion.h2>

        <div className="flex flex-col md:flex-row items-center justify-center gap-12">
          <motion.div
            className="w-full md:w-1/3 max-w-md"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="p-8 ">
              <img
                src={camera}
                alt="Chatbot Demo"
                className="w-full h-auto rounded-lg mb-4"
              />
              <p className="text-gray-300 text-center">
                Scan the QR code using the WhatsApp camera icon or any other scanner
              </p>
            </div>
          </motion.div>

          <motion.div
            className="w-full md:w-1/3 max-w-md"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="relative p-8 rounded-lg shadow-xl">
              <img
                src={qrbg}
                alt="Background"
                className="w-full h-auto rounded-lg opacity-30"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-white p-6 rounded-lg shadow-xl" style={{ width: '80%', height: '80%' }}>
                  <WhatsAppQRCode sessionId={sessionId} />
                </div>
              </div>
            </div>
            <p className="mt-4 text-gray-300 text-center">
              Scan this QR code with your phone's camera to begin the demo
            </p>
          </motion.div>
        </div>

        {/* CTA Section */}
        <div className="mt-12 text-center">
          <motion.button
            className="bg-green-500 text-white px-6 py-2 rounded-lg shadow-md hover:bg-green-700 transition duration-300"
            onClick={() => navigate('/demo/chatbot')}
          >
            Chat Now
          </motion.button>
          <motion.button
            className="bg-blue-400 text-white px-6 py-2 rounded-lg shadow-md hover:bg-blue-700 transition duration-300 ml-4"
            onClick={() => navigate('/blogs')}
          >
            Learn More
          </motion.button>
        </div>
      </div>
    </section>
  );
};

export default ChatbotDemoSection;
