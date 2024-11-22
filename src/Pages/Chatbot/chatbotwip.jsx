import React, { useState, useEffect } from 'react';
import Sidebar from './chatbot/sidebar/sidebar';
import ChatHeader from './chatbot/chat/chatheader';
import MessageList from './chatbot/chat/messagelist';
import MessageInput from './chatbot/chat/messageinput';
import DetailsPanel from './chatbot/detailspanel/detailspanel';
import AuthPopup from './AuthPopup';
import { useAuth } from '../../authContext';
import './chatbot.css';

const Chatbot = () => {
  const { authenticated } = useAuth();
  const [showAuthPopup, setShowAuthPopup] = useState(false);

  // State Management
  const [contacts, setContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [messageTemplates, setMessageTemplates] = useState('');
  const [showNewChatInput, setShowNewChatInput] = useState(false);
  const [newPhoneNumber, setNewPhoneNumber] = useState('');
  const [conversation, setConversation] = useState([]);
  const [flows, setFlows] = useState([]);
  const [selectedFlow, setSelectedFlow] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('');
  const [inputFields, setInputFields] = useState([{ value: '' }]);

  // Handlers
  const toggleNewChatInput = () => setShowNewChatInput(!showNewChatInput);

  const handleNewChat = async () => {
    if (!newPhoneNumber.trim()) return;
    // Implement new chat logic
    // ...
  };

  const handleSend = async () => {
    // Implement send message logic
    // ...
  };

  const handleSelectSmiley = (emoji) => {
    setMessageTemplates((prev) => prev + emoji.emoji + ' ');
  };

  const toggleSmileys = () => setShowSmileys((prev) => !prev);

  const handleSelectContact = (contact) => {
    setSelectedContact(contact);
    // Fetch conversation
    // ...
  };

  return (
    <div className="flex h-screen">
      {!authenticated && showAuthPopup && <AuthPopup onClose={() => setShowAuthPopup(false)} />}
      <Sidebar
        contacts={contacts}
        selectedContact={selectedContact}
        onSelectContact={handleSelectContact}
        searchText={searchText}
        setSearchText={setSearchText}
        showNewChatInput={showNewChatInput}
        toggleNewChatInput={toggleNewChatInput}
        handleNewChat={handleNewChat}
        newPhoneNumber={newPhoneNumber}
      />
      {selectedContact && (
        <div className="flex flex-col flex-1">
          <ChatHeader contact={selectedContact} profileImage={selectedContact.profileImage} />
          <MessageList conversation={conversation} />
          <MessageInput
            messageTemplates={messageTemplates}
            setMessageTemplates={setMessageTemplates}
            handleSend={handleSend}
            showSmileys={showSmileys}
            toggleSmileys={toggleSmileys}
            handleSelectSmiley={handleSelectSmiley}
            fileInputRef={fileInputRef}
            handleFileSelect={handleFileSelect}
          />
        </div>
      )}
      {selectedContact && (
        <DetailsPanel
          contact={selectedContact}
          profileImage={selectedContact.profileImage}
          selectedFlow={selectedFlow}
          flows={flows}
          handleFlowChange={setSelectedFlow}
          handleSendFlowData={handleSendFlowData}
          isSending={isSending}
          handleUpload={handleUpload}
          inputFields={inputFields}
          addInputField={addInputField}
          deleteInputField={deleteInputField}
          handleInputChange={handleInputChange}
          handleFileChange={handleFileChange}
          uploadStatus={uploadStatus}
        />
      )}
    </div>
  );
};

export default Chatbot;