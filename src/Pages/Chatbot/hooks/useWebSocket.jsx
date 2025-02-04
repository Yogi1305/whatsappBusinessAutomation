import { useEffect } from 'react';
import io from 'socket.io-client';

import { whatsappURL } from '../../../Navbar';
export default function useWebSocket(selectedContact, onNewMessage) {
  useEffect(() => {
    const socket = io(whatsappURL);

    socket.on('new-message', (message) => {
      if (message?.contactPhone === selectedContact?.phone) {
        onNewMessage({
          text: message.message,
          sender: 'user',
          timestamp: new Date().toISOString()
        });
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [selectedContact, onNewMessage]);
}