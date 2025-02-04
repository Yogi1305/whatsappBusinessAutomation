import React, { useCallback } from 'react';
import { useAuth } from '../../authContext';
import AuthPopup from './AuthPopup';
import ContactList from './parts/ContactList/ContactList';
import ChatInterface from './parts/ChatInterface/ChatInterface';
import RightSidebar from './parts/RightSidebar/RightSidebar';
import useContacts from './hooks/useContacts';
import useChat from './hooks/useChat';
import useWebSocket from './hooks/useWebSocket';
import './chatbot.css';

const Chatbot = () => {
  const { authenticated } = useAuth();
  const {
    contacts,
    selectedContact,
    searchTerm,
    currentPage,
    totalPages,
    handleContactSelect,
    handleSearch,
    handlePagination
  } = useContacts();

  const {
    messages,
    inputText,
    handleSend,
    handleInputChange,
    handleFileUpload,
    emojiHandlers,
    showImagePreview,
    imageHandlers,
    addMessage  // Make sure useChat exposes this function
  } = useChat(selectedContact);

  // Define message handler for WebSocket
  const handleNewMessage = useCallback((message) => {
    addMessage({
      text: message.content,
      sender: message.sender,
      timestamp: new Date().toISOString()
    });
  }, [addMessage]);

  // Initialize WebSocket connection
  useWebSocket(selectedContact, handleNewMessage);

  return (
    <div className="chatbot-container">
      {!authenticated && <AuthPopup />}
      <ContactList
        contacts={contacts}
        selectedContact={selectedContact}
        searchTerm={searchTerm}
        currentPage={currentPage}
        totalPages={totalPages}
        onSelectContact={handleContactSelect}
        onSearch={handleSearch}
        onPaginate={handlePagination}
      />
      <ChatInterface
        selectedContact={selectedContact}
        messages={messages}
        inputText={inputText}
        onInputChange={handleInputChange}
        onSend={handleSend}
        onFileUpload={handleFileUpload}
        emojiHandlers={emojiHandlers}
        showImagePreview={showImagePreview}
        imageHandlers={imageHandlers}
      />
      <RightSidebar selectedContact={selectedContact} />
    </div>
  );
};

export default Chatbot;