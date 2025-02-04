import { useState, useCallback } from 'react';
import { axiosInstance } from '../../../api';
import { fixJsonString } from '../utils/helpers';
import { whatsappURL } from '../../../Navbar';

export default function useChat(selectedContact) {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showImagePreview, setShowImagePreview] = useState(false);
  const [imageData, setImageData] = useState(null);

  const handleSend = useCallback(async () => {
    if (!selectedContact || !inputText.trim()) return;

    try {
      await axiosInstance.post(`${whatsappURL}/send-message`, {
        phoneNumbers: [selectedContact.phone],
        message: inputText,
        business_phone_number_id: selectedContact.businessPhoneNumberId
      });

      const newMessage = {
        text: inputText,
        sender: 'bot',
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, newMessage]);
      setInputText('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  }, [selectedContact, inputText]);

  const handleFileUpload = useCallback(async (file) => {
    // File upload logic here
  }, [selectedContact]);

  const emojiHandlers = {
    togglePicker: () => setShowEmojiPicker(prev => !prev),
    addEmoji: (emoji) => setInputText(prev => prev + emoji.emoji)
  };

  const imageHandlers = {
    setImagePreview: setShowImagePreview,
    handleImageSend: async () => {
      // Image send logic
    }
  };

  return {
    messages,
    inputText,
    handleSend,
    handleInputChange: setInputText,
    handleFileUpload,
    emojiHandlers,
    showImagePreview,
    imageHandlers
  };
}