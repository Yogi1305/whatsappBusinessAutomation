import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import io from 'socket.io-client';
import WhatsAppQRCode from './WhatsappQrCode';

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
      localStorage.removeItem('homepageQRScanned'); // Clear the flag
    } else {
      setShowPopup(true);
    }

    const newSocket = io('https://whatsappbotserver.azurewebsites.net');
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

  if (!showPopup) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Test Our Amazing Chatbot</h2>
          {/* <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button> */}
        </div>
        <p className="mb-4">To experience our incredible chatbot, please scan the QR code below:</p>
        <div className="mb-4 flex items-center justify-center">
          <WhatsAppQRCode sessionId={sessionId} />
        </div>
        <p className="mb-4">Once you've scanned the QR code, click the button below to start chatting!</p>
        {/* <button
          onClick={onClose}
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition duration-200"
        >
          I've Scanned the QR
        </button> */}
      </div>
    </div>
  );
};

export default AuthPopup;