import React, { useEffect, useState } from 'react';
import { X, MessageSquare } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import io from 'socket.io-client';
import WhatsAppQRCode from './WhatsappQrCode';
import { whatsappURL } from '../../Navbar';

const AuthPopup = ({ onClose, isAuthenticated }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [socket, setSocket] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const homepageQRScanned = localStorage.getItem('homepageQRScanned');
    const contactPhone = location.state?.contactPhone;

    if (homepageQRScanned === 'true' || contactPhone) {
      setShowPopup(false);
      localStorage.removeItem('homepageQRScanned');
    } else {
      setShowPopup(true);
    }

    const newSocket = io(whatsappURL);
    setSocket(newSocket);

    const generatedSessionId = `*/` + Math.random().toString(36).substr(2, 9);
    setSessionId(generatedSessionId);
    localStorage.setItem('sessionId', generatedSessionId);

    return () => newSocket.close();
  }, [location.state]);

  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (message) => {
      if (message && !isAuthenticated) {
        console.log('Got New Message', message.message);
        setShowPopup(false);
        onClose();
      }
    };

    const handleTempUser = (message) => {
      if (message && !isAuthenticated) {
        console.log("New temp user logged");
        const storedSessionId = localStorage.getItem('sessionId');
        const formattedMessageTempUser = `*/${message.temp_user}`;
       
        if (formattedMessageTempUser === storedSessionId) {
          setShowPopup(false);
          onClose();
        }
      }
    };

    socket.on('new-message', handleNewMessage);
    socket.on('temp-user', handleTempUser);

    return () => {
      socket.off('new-message', handleNewMessage);
      socket.off('temp-user', handleTempUser);
    };
  }, [socket, isAuthenticated, onClose]);

  const handleWhatsAppClick = () => {
    const message = encodeURIComponent('Hi I need help with Whatsapp Automation');
    window.open(`https://wa.me/16194560588?text=${message}`, '_blank');
  };

  if (!showPopup) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-md bg-black/30 flex items-center justify-center z-50"style={{zIndex:500}}>
      <div className="bg-white/90 p-12 rounded-xl shadow-2xl max-w-2xl w-full mx-4 relative backdrop-blur-sm">
        <button 
          onClick={() => {
            setShowPopup(false);
            onClose();
          }}
          className="absolute top-6 right-6 p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
        >
          <X className="w-6 h-6 text-gray-500" />
        </button>

        <div className="mb-8 text-center">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Test Our Amazing Chatbot</h2>
          <p className="text-lg text-gray-600">To experience our incredible chatbot, please scan the QR code below:</p>
        </div>

        <div className="mb-8 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl shadow-md">
            <WhatsAppQRCode sessionId={sessionId} />
          </div>
        </div>

        <div className="space-y-6 max-w-md mx-auto">
          <p className="text-lg text-gray-600 text-center">Or connect with us directly via WhatsApp:</p>
          
          <button
            onClick={handleWhatsAppClick}
            className="w-full flex items-center justify-center gap-3 bg-green-500 hover:bg-green-600 text-white py-4 px-6 rounded-xl text-lg font-medium transition-all duration-200 hover:shadow-lg"
          >
            <MessageSquare className="w-6 h-6" />
            <span>Chat on WhatsApp</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthPopup;