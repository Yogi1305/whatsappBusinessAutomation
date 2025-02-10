import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import io from 'socket.io-client';
import { useAuth } from '../../authContext.jsx';
import AuthPopup from './AuthPopup.jsx';
import { Button} from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, ChevronRight, ChevronLeft, X } from 'lucide-react';
import Picker from 'emoji-picker-react';
import { renderInteractiveMessage } from './messageRenderers';
import { getTenantIdFromUrl, fixJsonString } from './chatbot/utilityfunctions.jsx';
import { axiosInstance, fastURL, djangoURL} from '../../api.jsx';
import { whatsappURL } from '../../Navbar.jsx';

const socket = io(whatsappURL);

const Chatbot = () => {
  const { authenticated } = useAuth();
  const tenantId = getTenantIdFromUrl();
  const messageEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const selectedContactRef = useRef(null);
  const [authPopup, setAuthPopup] = useState(false);
  
  // State variables
  const [contacts, setContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [messageInput, setMessageInput] = useState('');
  const [conversations, setConversations] = useState({});
  const [unreadCounts, setUnreadCounts] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [businessPhoneNumberId, setBusinessPhoneNumberId] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    const fetchBusinessPhoneId = async () => {
      try {
        console.log("fetching business phone number id")
        const response = await axios.get(`${fastURL}/whatsapp_tenant/`, {
          headers: {
            'X-Tenant-Id': tenantId
          }
        });
        console.log(response.data.whatsapp_data[0].business_phone_number_id,"THIS IS BPID");
        setBusinessPhoneNumberId(response.data.whatsapp_data[0].business_phone_number_id);
      } catch (error) {
        console.error('Error fetching business phone ID:', error);
      }
    };

    fetchBusinessPhoneId();
  }, [tenantId]);
  // Socket connection management
  useEffect(() => {
    const connectSocket = () => {
      socket.connect();
      setupSocketListeners();
      return () => {
        socket.off('new-message');
        socket.off('message-status');
        socket.disconnect();
      };
    };

    if (authenticated) {
      connectSocket();
   
    }
  }, [authenticated]);

  const setupSocketListeners = useCallback(() => {
    const handleNewMessage = (message) => {
      if (message.phone_number_id !== businessPhoneNumberId) return;

      updateConversation(message.contactPhone, {
        text: message.message,
        sender: 'user',
        timestamp: new Date().toISOString()
      });

      if (selectedContactRef.current?.phone !== message.contactPhone) {
        setUnreadCounts(prev => ({
          ...prev,
          [message.contactPhone]: (prev[message.contactPhone] || 0) + 1
        }));
      }
    };

    const handleMessageStatus = (statusUpdate) => {
      updateMessageStatus(statusUpdate.messageId, statusUpdate.status);
    };

    socket.on('new-message', handleNewMessage);
    socket.on('message-status', handleMessageStatus);

    return () => {
      socket.off('new-message', handleNewMessage);
      socket.off('message-status', handleMessageStatus);
    };
  }, [businessPhoneNumberId]);

  // Data fetching
  const fetchContacts = useCallback(async (page = 1) => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get(`${fastURL}/contacts/${page}?order_by=last_replied&sort_by=desc`);
      setContacts(response.data.contacts);
      setTotalPages(response.data.total_pages);
      setCurrentPage(page);
    } catch (error) {
      console.error("Error fetching contacts:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchConversation = useCallback(async (phoneNumber) => {
    if (!phoneNumber) return;

    try {
      setIsLoading(true);
      const response = await axiosInstance.get(`${djangoURL}/whatsapp_convo_get/${phoneNumber}/`, {
        params: { source: 'whatsapp', bpid: businessPhoneNumberId },
        headers: { 'X-Tenant-Id': tenantId }
      });
      
      setConversations(prev => ({
        ...prev,
        [phoneNumber]: response.data
      }));
    } catch (error) {
      console.error("Error fetching conversation:", error);
    } finally {
      setIsLoading(false);
    }
  }, [businessPhoneNumberId, tenantId]);

  // Message handling
  const sendMessage = useCallback(async (message) => {
    if (!selectedContactRef.current || !message.trim()) return;

    const phoneNumber = selectedContactRef.current.phone.replace(/^91/, '');
    const tempMessageId = Date.now().toString();

    try {
      const response = await axiosInstance.post(`${whatsappURL}/send-message`, {
        phoneNumbers: [phoneNumber],
        message: message,
        business_phone_number_id: businessPhoneNumberId,
        messageType: "text",
      });

      updateConversation(selectedContactRef.current.phone, {
        id: tempMessageId,
        text: message,
        sender: 'bot',
        timestamp: new Date().toISOString(),
        status: 'sent'
      });

      return response.data;
    } catch (error) {
      updateConversation(selectedContactRef.current.phone, {
        id: tempMessageId,
        error: true,
        status: 'failed'
      });
      console.error("Error sending message:", error);
    }
  }, [businessPhoneNumberId]);

  // UI handlers
  const handleContactSelect = useCallback((contact) => {
    setSelectedContact(contact);
    selectedContactRef.current = contact;
    setUnreadCounts(prev => ({ ...prev, [contact.phone]: 0 }));
    fetchConversation(contact.phone);
  }, [fetchConversation]);

  const handleSend = useCallback(async () => {
    if (!messageInput.trim()) return;

    await sendMessage(messageInput);
    setMessageInput('');
    setShowEmojiPicker(false);
  }, [messageInput, sendMessage]);

  // Helpers
  const updateConversation = useCallback((phoneNumber, newMessage) => {
    setConversations(prev => ({
      ...prev,
      [phoneNumber]: [...(prev[phoneNumber] || []), newMessage]
    }));
  }, []);

  const updateMessageStatus = useCallback((messageId, status) => {
    if (!selectedContactRef.current) return;
    
    setConversations(prev => ({
      ...prev,
      [selectedContactRef.current.phone]: prev[selectedContactRef.current.phone].map(msg => 
        msg.id === messageId ? { ...msg, status } : msg
      )
    }));
  }, []);

  // Scroll handling
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversations, selectedContact]);

  return (
    <div className="chat-container">
      {!authenticated && <AuthPopup onClose={() => setAuthPopup(false)} />}
      
      <div className="contacts-panel">
        <div className="contacts-header">
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search contacts"
            prefix={<Search size={16} />}
          />
        </div>

        <div className="contacts-list">
          {contacts.map(contact => (
            <div
              key={contact.phone}
              className={`contact-item ${selectedContact?.phone === contact.phone ? 'active' : ''}`}
              onClick={() => handleContactSelect(contact)}
            >
              <div className="contact-avatar">
                {contact.name ? contact.name[0] : contact.phone[0]}
              </div>
              <div className="contact-info">
                <div className="contact-name">{contact.name || 'Unknown'}</div>
                <div className="contact-phone">{contact.phone}</div>
              </div>
              {unreadCounts[contact.phone] > 0 && (
                <div className="unread-count">{unreadCounts[contact.phone]}</div>
              )}
            </div>
          ))}
        </div>

        <div className="pagination-controls">
          <Button disabled={currentPage === 1} onClick={() => fetchContacts(currentPage - 1)}>
            <ChevronLeft size={16} />
          </Button>
          <span>Page {currentPage} of {totalPages}</span>
          <Button disabled={currentPage === totalPages} onClick={() => fetchContacts(currentPage + 1)}>
            <ChevronRight size={16} />
          </Button>
        </div>
      </div>

      <div className="chat-panel">
        {selectedContact ? (
          <>
            <div className="chat-header">
              <div className="contact-info">
                <div className="avatar">{selectedContact.name?.[0] || selectedContact.phone?.[0]}</div>
                <div>
                  <h3>{selectedContact.name || 'Unknown'}</h3>
                  <p>{selectedContact.phone}</p>
                </div>
              </div>
            </div>

            <div className="messages-container">
              {conversations[selectedContact.phone]?.map((message, index) => (
                <div key={index} className={`message ${message.sender}`}>
                  <div className="message-content">
                    {message.text && typeof message.text === 'string' ? (
                      message.text.startsWith('{') ? (
                        renderInteractiveMessage(JSON.parse(fixJsonString(message.text)))
                      ) : (
                        <div className="text-message">{message.text}</div>
                      )
                    ) : (
                      <div className="error-message">Unable to display message</div>
                    )}
                  </div>
                </div>
              ))}
              <div ref={messageEndRef} />
            </div>

            <div className="message-input-container">
              <div className="input-tools">
                <Button variant="ghost" onClick={() => setShowEmojiPicker(!showEmojiPicker)}>🙂</Button>
                <input
                  type="file"
                  ref={fileInputRef}
                  style={{ display: 'none' }}
                  onChange={handleFileUpload}
                />
                <Button variant="ghost" onClick={() => fileInputRef.current.click()}>
                  📎
                </Button>
              </div>

              <Input
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Type a message..."
              />

              <Button onClick={handleSend} disabled={!messageInput.trim()}>
                Send
              </Button>

              {showEmojiPicker && (
                <div className="emoji-picker">
                  <Picker
                    onEmojiClick={(emoji) => setMessageInput(prev => prev + emoji.emoji)}
                    disableSearchBar
                  />
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="no-contact-selected">
            Please select a contact to start chatting
          </div>
        )}
      </div>
    </div>
  );
};

export default Chatbot;