import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import WhatsAppQRCode from './WhatsappQrCode';  // Adjust the import path if needed

const AuthPopup = ({ onClose }) => {
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Test Our Amazing Chatbot</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>
        <p className="mb-4">To experience our incredible chatbot, please scan the QR code below:</p>
        <div className="mb-4 flex items-center justify-center">
          {/* Pass the sessionId to WhatsAppQRCode as a prop */}
          <WhatsAppQRCode/>
        </div>
        <p className="mb-4">Once you've scanned the QR code, click the button below to start chatting!</p>
        <button
          onClick={onClose}
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition duration-200"
        >
          I've Scanned the QR
        </button>
      </div>
    </div>
  );
};

export default AuthPopup;
