import React, { useState, useEffect, useRef } from 'react';
import './chatbot.css';
// import OpenAI from "openai";
import { Navigate, useNavigate, useParams } from "react-router-dom"; 
import axiosInstance from "../../api.jsx";
import MailIcon from '@mui/icons-material/Mail';
import SearchIcon from '@mui/icons-material/Search';
import CallRoundedIcon from '@mui/icons-material/CallRounded';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import EditIcon from '@mui/icons-material/Edit';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SendIcon from '@mui/icons-material/Send';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import CloseIcon from '@mui/icons-material/Close'
import uploadToBlob from "../../azureUpload.jsx";
import Picker from 'emoji-picker-react';
import shortid from 'shortid';
import ImageEditorComponent from "../../Components/ImageEditor/imageeditor.jsx";
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid'; 

import io from 'socket.io-client';
import { PhoneIcon, PlusIcon } from 'lucide-react';
import { useAuth } from '../../authContext.jsx';
import AuthPopup from './AuthPopup.jsx';
import { div } from 'framer-motion/client';

const socket = io('https://8twdg37p-8080.inc1.devtunnels.ms/');


const getTenantIdFromUrl = () => {
  const pathArray = window.location.pathname.split('/');
  if (pathArray.length >= 2) {
    return pathArray[1]; // Assumes tenant_id is the first part of the path
  }
  return null; 
};

const Chatbot = () => {
  const tenantId=getTenantIdFromUrl();
  // const navigate = useNavigate();
  const [contacts, setContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [messageTemplates, setMessageTemplates] = useState({});

  const [showSmileys, setShowSmileys] = useState(false);
 
  const [profileImage, setProfileImage] = useState(null); 
  const [conversation, setConversation] = useState(['']);
  const [flows, setFlows] = useState([]);
  const [selectedFlow, setSelectedFlow] = useState('');
  const [previousContact, setPreviousContact] = useState(null);
  const [newMessages, setNewMessages] = useState([]);
 
  const [showPopup, setShowPopup] = useState(false);
 
  const [allConversations, setAllConversations] = useState({});
  const [allMessages, setAllMessages] = useState([]);
  
  const [unreadCounts, setUnreadCounts] = useState({});
  const messageEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const [imageToSend, setImageToSend] = useState(null);
  const [showImagePreview, setShowImagePreview] = useState(false);
  const [imageCaption, setImageCaption] = useState('');
  const [imageMap, setImageMap] = useState({});
  
  const [isUploading, setIsUploading] = useState(false);
  const [accessToken, setAccessToken] = useState('');
  const [businessPhoneNumberId, setBusinessPhoneNumberId] = useState('');
  const [headerMediaId, setHeaderMediaId] = useState('');
  // const tenantId = getTenantIdFromUrl();
  const [showNewChatInput, setShowNewChatInput] = useState(false);
  const [newPhoneNumber, setNewPhoneNumber] = useState('');
  const { authenticated } = useAuth();
  const [authPopupp, setAuthPopupp] = useState(false);
  const navigate = useNavigate();
  const [prioritizedContacts, setPrioritizedContacts] = useState([]);


  const handleCloseAuthPopupp = () => {
    setAuthPopupp(false);
  };
  
  useEffect(() => {
    // Show popup only if not authenticated and not in demo mode
    setAuthPopupp(!authenticated);
  }, [authenticated]);




  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation]);


  useEffect(() => {
    const fetchBusinessPhoneId = async () => {
      try {
        const response = await axios.get('https://8twdg37p-8000.inc1.devtunnels.ms/get-bpid/', {
          headers: {
            'X-Tenant-Id': tenantId
          }
        });
        setBusinessPhoneNumberId(response.data.business_phone_id);
      } catch (error) {
        console.error('Error fetching business phone ID:', error);
      }
    };

    fetchBusinessPhoneId();
  }, [tenantId]);
  
  const renderMessageContent = (message) => {
    if (typeof message.text === 'object' && message.text !== null) {
      // Handle message types
      switch (message.text.type) {
        case 'text':
          return message.text.body || <div className="error">No text body provided</div>;
  
        case 'interactive':
          // Replace `renderInteractiveMessage` with your logic to handle interactive messages
          return renderInteractiveMessage(message.text.interactive) || <div className="error">Interactive message rendering failed</div>;
  
        default:
          return <div className="error">Unknown message type: {message.text.type}</div>;
      }
    } else if (typeof message.text === 'string') {
      // Fallback for plain text messages
      return message.text || <div className="error">Message content is undefined</div>;
    }
  
    return <div className="error">Invalid message format</div>;
  };

  const renderInteractiveMessage = (parsedMessage) => {
    const { type, interactive, text, image } = parsedMessage;

    if (type === 'interactive') {
      if (interactive.type === 'list') {
        return (
          <div className="interactive-message list-message">
            <p className="message-text">{interactive.body.text}</p>
            <ul className="message-list">
              {interactive.action.sections.map((section, sectionIndex) => (
                <li key={sectionIndex} className="list-section">
                  {section.title && <h4 className="section-title">{section.title}</h4>}
                  <ul>
                    {section.rows.map((row) => (
                      <li key={row.id} className="list-item">
                        {row.title}
                        {row.description && <p className="item-description">{row.description}</p>}
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </div>
        );
      } else if (interactive.type === 'button') {
        return (
          <div className="interactive-message button-message">
            <p className="message-text">{interactive.body.text}</p>
            <div className="message-buttons">
              {interactive.action.buttons.map((button, buttonIndex) => (
                <button key={buttonIndex} className="interactive-button">
                  {button.reply.title}
                </button>
              ))}
            </div>
          </div>
        );
      }
    } else if (type === 'text') {
      return <p className="plain-message">{text.body}</p>;
    } else if (type === 'image') {
      return (
        <div className="image-message">
          <img src={image.id} alt="Sent image" className="message-image" />
          {image.caption && <p className="message-caption">{image.caption}</p>}
        </div>
      );
    }

    return <p className="error-message">Unsupported message type</p>;
  };
  
  const fixJsonString = (jsonString) => {
    try {
      // Replace single quotes with double quotes
      const regex = /("(?:[^"\\]|\\.)*")|'/g;

      // Replace single quotes with double quotes outside of double-quoted segments
      let fixedString = jsonString.replace(regex, (match) => {
          if (match.startsWith('"') && match.endsWith('"')) {
              // If the segment is within double quotes, return it as is
              return match;
          }
          // Replace single quotes with double quotes
          return match.replace(/'/g, '"');
      });
      // Ensure proper escape sequences
      fixedString = fixedString.replace(/\\"/g, '\\\\"');
      return fixedString;
    } catch (e) {
      console.error('Error fixing JSON string:', e);
      return jsonString; // Return as-is if fixing fails
    }
  };




  
  const fetchContacts = async () => {
    try {
      const response = await axiosInstance.get('/contacts/', {
        headers: {
          token: localStorage.getItem('token'),
        },
      });
      // Ensure all contacts have the necessary properties
     
      setContacts(response.data);
    } catch (error) {
      console.error("Error fetching contacts data:", error);
    }
  };


  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchProfileImage = async (contactId) => {
    try {
        
        console.log('Tenant ID:', tenantId);
        console.log("this is id", contactId);

        const response = await axiosInstance.get(`/return-documents/10/${contactId}`);
        console.log('GET request successful, response:', response.data);

        const documents = response.data.documents;
        console.log('Documents array:', documents);

        if (documents && documents.length > 0) {
            const profileImage = documents[0].file;
            console.log('Found profile image:', profileImage);
            setProfileImage(profileImage);
        } else {
            console.log('No profile image found.');
            setProfileImage(null); // Set a default image URL or null if no image found
        }
    } catch (error) {
        console.error('Error fetching profile image:', error);
    }
};

  useEffect(() => {
    if ( tenantId) {
        fetchProfileImage();
    }
}, [ tenantId]);




  useEffect(() => {
    const fetchTenantData = async () => {
      try {
        // const business_phone_number_id = 241683569037594;
        const response = await axiosInstance.get(`/whatsapp_tenant/?business_phone_id=${business_phone_number_id}`);
        setAccessToken(response.data.access_token);
        setBusinessPhoneNumberId(response.data.business_phone_number_id);
      } catch (error) {
        console.error('Error fetching tenant data:', error);
      }
    };
    
    fetchTenantData();
  }, []);

  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (file) {
      setIsUploading(true);
      try {
        // Create FormData object
        const formData = new FormData();
        formData.append('file', file);
        formData.append('type', 'image'); // Adjust based on file type if needed
        formData.append('messaging_product', 'whatsapp');
  
        // Upload to Facebook Graph API
        const response = await axiosInstance.post(
          'https://graph.facebook.com/v16.0/241683569037594/media', //HARDCODE
          formData,
          {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'multipart/form-data',
            },
          }
        );
        console.log('File uploaded to WhatsApp, ID:', response.data.id);
        setHeaderMediaId(response.data.id);
        setImageToSend(response.data.id);
  
        if (response.data && response.data.id) {
          // Store the media ID
          const mediaId = response.data.id;
          
          // You might want to store this mediaId in state or use it immediately
          setImageToSend(mediaId);
          setShowImagePreview(true);
  
          // If you want to show a preview, you can still use FileReader
          const reader = new FileReader();
          reader.onload = (e) => {
            setImageMap(prevMap => ({
              ...prevMap,
              [mediaId]: e.target.result
            }));
          };
          reader.readAsDataURL(file);
        } else {
          throw new Error('Failed to upload media');
        }
      } catch (error) {
        console.error('Error uploading file:', error);
        alert('Failed to upload file. Please try again.');
      } finally {
        setIsUploading(false);
      }
    }
  };


  const handleImageSend = async () => {
    if (!imageToSend || !selectedContact) return;
    let phoneNumber = selectedContact.phone;
    if (phoneNumber.startsWith("91")) {
      phoneNumber = phoneNumber.slice(2);
    }
    try {
      const response = await axiosInstance.post(
        'https://whatsappbotserver.azurewebsites.net/send-message',
        {
          phoneNumbers: [phoneNumber],
          messageType: "image",
          additionalData: {
            imageId: imageToSend, // Use the media ID here
            caption: imageCaption
          },
          business_phone_number_id: "241683569037594"
        }
      );
  
      if (response.status === 200) {
        setConversation(prev => [...prev, { 
          type: 'image', 
          sender: 'bot', 
          imageId: imageToSend,
          imageUrl: imageMap[imageToSend], // This is for preview purposes
          caption: imageCaption 
        }]);
        setImageToSend(null);
        setImageCaption('');
        setShowImagePreview(false);
      }
    } catch (error) {
      console.error('Error sending image:', error);
      alert('Failed to send image. Please try again.');
    }
  };


  
  const createNewContact = (contactPhone) => ({
    id: Date.now(), // Generate a unique ID or use another method
    phoneNumber: contactPhone,
    name: 'New Contact', // Default or empty name
    hasNewMessage: true // Default or initial state
  });
  
  // Scroll to bottom of chat
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation]);



  useEffect(() => {
    socket.on('connect', () => {
      console.log('Connected to the server');
    });
  
    socket.on('new-message', (message) => {
      if (message) {
        console.log('Got New Message', message.message);
        updateContactPriority(message.contactPhone, message.message);
        if (parseInt(message.contactPhone) == parseInt(selectedContact?.phone)) {
          console.log("hogyaaaaaaaaaaaaaaaaaaaaaaaaaaaa");  
          setConversation(prevMessages => [...prevMessages, { text: JSON.stringify(message.message), sender: 'user'}]);
          //setNewMessages(prevMessages => [...prevMessages, { text: message.message, sender: 'user'}]);
         } else {
          // Update unread count for non-selected contacts
          setContacts(prevContacts => 
            prevContacts.map(contact => 
              contact.phone === message.contactPhone
                ? { ...contact, unreadCount: (contact.unreadCount || 0) + 1 }
                : contact
            )
          );
  
      }}
    });
  
    socket.on('node-message', (message) => {
      console.log(message.message, "this is node");
      console.log(selectedContact,"yahandekhhhhhh");
      if (message) {
          if (parseInt(message.contactPhone) === parseInt(selectedContact?.phone)) {
            console.log("hogyaaaaaaaaaaaaaaaaaaaaaaaaaaaa");
            setConversation(prevMessages => [...prevMessages, { text: JSON.stringify(message.message), sender: 'bot' }]);
          }

      }
    });
    socket.on('temp-user', (message) => {
      console.log("New temp user logged");
    
      if (message) {
        const storedSessionId = localStorage.getItem('sessionId');
        console.log("Stored session ID:", storedSessionId);
        console.log("Received message temp_user:", message.temp_user);
        
        const formattedMessageTempUser = `*/${message.temp_user}`;
        if (formattedMessageTempUser === storedSessionId) {
          console.log("Session ID matches. Adding new contact.");
        
          // Add new contact and select it
          setContacts(prevContacts => {
            // Create a new contact object
            const newContact = {
              id: message.temp_user + message.contactPhone,  // Use a unique combination for id
              phone: message.contactPhone
            };
        
            // Check if contact with the same ID already exists
            const contactExists = prevContacts.some(contact => contact.id === newContact.id);
        
            // If the contact doesn't exist, add it
            if (!contactExists) {
              const updatedContacts = [...prevContacts, newContact];
              console.log("New contacts array:", updatedContacts);
              return updatedContacts;
            }
        
            console.log("Contact already exists. Skipping addition.");
            return prevContacts;  // Return the current contacts if no addition is made
          });
        
          setSelectedContact({
            phone: message.contactPhone
          });
        
          setShowNewChatInput(false);
          console.log("Selected contact:", message.contactPhone);
        }else {
          console.log("Session ID does not match.");
        }
      } else {
        console.log("Message is undefined or null.");
      }
    });
    
  
    return () => {
      socket.off('node-message');
      socket.off('new-message');
      socket.off('temp_user');
    };
  }, [selectedContact]);
  

 

 

  
  
  const handleSend = async () => {
    if (!selectedContact || !messageTemplates[selectedContact.id]) {
      console.error('Message template or contact not selected');
      return;
    }
  
    const newMessage = { 
      content: messageTemplates[selectedContact.id],
      timestamp: new Date().toISOString(),
      sender: 'bot'
    };
  
    try {
      if (selectedContact.isGroup) {
        // Send message to all group members
        const sendPromises = selectedContact.members.map(memberId => {
          const member = contacts.find(c => c.id === memberId);
          let phoneNumber = member.phone;
          if (phoneNumber.startsWith("91")) {
            phoneNumber = phoneNumber.slice(2);
          }
      
          return axios.post(
            'https://whatsappbotserver.azurewebsites.net/send-message',
            {
              phoneNumbers: [phoneNumber],
              message: newMessage.content,
              business_phone_number_id: businessPhoneNumberId,
              messageType: "text",
            }
          );
        });
        await Promise.all(sendPromises);
      } else {
        // Send message to individual contact
        let phoneNumber = selectedContact.phone;
        if (phoneNumber.startsWith("91")) {
          phoneNumber = phoneNumber.slice(2);
        }
        await axios.post(
          'https://whatsappbotserver.azurewebsites.net/send-message',
          {
            phoneNumbers: [phoneNumber],
            message: newMessage.content,
            business_phone_number_id: businessPhoneNumberId,
            messageType: "text",
          }
        );
      }
  
      // Update local state with the new message
      setConversation(prevConversation => [
        ...prevConversation,
        { text: newMessage.content, sender: 'bot', timestamp: newMessage.timestamp }
      ]);
      setNewMessages(prevMessages => [...prevMessages, newMessage]);
      setMessageTemplates(prevTemplates => ({
        ...prevTemplates,
        [selectedContact.id]: ''
      }));
      console.log("Message sent successfully");
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const getFilteredAndSortedContacts = () => {
    return contacts
      .filter(contact => {
        const searchLower = searchText.toLowerCase();
        return (
          contact.name?.toLowerCase().includes(searchLower) ||
          contact.phone?.toLowerCase().includes(searchLower) ||
          contact.email?.toLowerCase().includes(searchLower)
        );
      })
      .sort((a, b) => {
        // First, sort by unread count
        if (b.unreadCount !== a.unreadCount) {
          return b.unreadCount - a.unreadCount;
        }
        // Then, sort by last message timestamp
        return (b.lastMessageTimestamp || 0) - (a.lastMessageTimestamp || 0);
      });
  };

  const updateContactPriority = (contactPhone, message) => {
    setContacts(prevContacts => {
      const updatedContacts = prevContacts.map(contact => {
        if (contact.phone === contactPhone) {
          return {
            ...contact,
            unreadCount: (contact.unreadCount || 0) + 1,
            lastMessageTimestamp: new Date().getTime()
          };
        }
        return contact;
      });
      // Sort the contacts after updating
      return updatedContacts.sort((a, b) => {
        if (b.unreadCount !== a.unreadCount) {
          return b.unreadCount - a.unreadCount;
        }
        return (b.lastMessageTimestamp || 0) - (a.lastMessageTimestamp || 0);
      });
    });
  };

  useEffect(() => {
    setPrioritizedContacts(getFilteredAndSortedContacts());
  }, [contacts, searchText]);

  
  // Function to fetch conversation data for a given contact
  const fetchConversation = async (contactId) => {
    try {
      const response = await fetch(`https://backenreal-hgg2d7a0d9fzctgj.eastus-01.azurewebsites.net/whatsapp_convo_get/${contactId}/?source=whatsapp`, {
        method: 'GET',
        headers: {
          'X-Tenant-ID': tenantId
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch data from backend');
      }
      const data = await response.json();
      
      // Merge fetched data with any new messages
      const mergedConversation = [
        ...(allConversations[contactId] || []),
        ...data
      ];
      setAllConversations(prev => ({
        ...prev,
        [contactId]: mergedConversation
      }));
      setConversation(mergedConversation);

      console.log('Data fetched from backend successfully:', mergedConversation);
    } catch (error) {
      console.error('Error fetching data from backend:', error);
    }
  };


  
 
  useEffect(() => {
    // Clear current conversation
    setConversation(['']);
    setNewMessages(['']);
  
    // Fetch conversation data for the new selected contact
    if(selectedContact){
    fetchConversation(selectedContact.phone);}
    
  }, [selectedContact]);


  const handleContactSelection = async (contact) => {
    if (selectedContact) {
      setPreviousContact(selectedContact);
    }
    setSelectedContact({ ...contact, isGroup: false });
    
    // Safeguard to check if each contact has an id
    setContacts(prevContacts => 
      prevContacts.map(c => 
        c?.id === contact.id ? { ...c, unreadCount: 0 } : c
      )
    );

    setConversation(allConversations[contact.phone] || []);
    if (!allConversations[contact.phone]) {
      fetchConversation(contact.phone);
    }
  
    const contactMessages = allMessages
      .filter(message => message.contactPhone === contact.phone)
      .map(message => ({ 
        text: message.text, 
        sender: message.sender, 
        timestamp: message.timestamp 
      }));
    
    setConversation(contactMessages);
    setNewMessages([]);
    setUnreadCounts(prev => ({ ...prev, [contact.phone]: 0 }));
};


 
  const handleToggleSmileys = () => {
    setShowSmileys(!showSmileys);
  };

  const handleSelectSmiley = (emoji) => {
    const newMessageTemplate = (messageTemplates[selectedContact?.id] || '') + emoji.emoji + ' ';
    setMessageTemplates(prevTemplates => ({
      ...prevTemplates,
      [selectedContact?.id]: newMessageTemplate
    }));
  };

  

    const handleRedirect = () => {
      window.location.href = 'https://www.facebook.com/v18.0/dialog/oauth?client_id=1546607802575879&redirect_uri=https%3A%2F%2Fwhatsapp.nuren.ai%2Fchatbotredirect&response_type=code&config_id=1573657073196264&state=pass-through%20value';
    };

    const handleCreateFlow = () => {
      navigate(`/${tenantId}/flow-builder`); // Use navigate instead of history.push
    };
  
    const fetchFlows = async () => {
      try {
        const response = await axiosInstance.get('https://backenreal-hgg2d7a0d9fzctgj.eastus-01.azurewebsites.net/node-templates/', {
          headers: { token: localStorage.getItem('token') },
        });
        // Ensure each flow has an id property
        const flowsWithIds = response.data.map(flow => ({
          ...flow,
          id: flow.id.toString() // Ensure id is a string for consistency
        }));
        setFlows(flowsWithIds);
        console.log('Fetched flows:', flowsWithIds);
      } catch (error) {
        console.error("Error fetching flows:", error);
      }
    };
  
    useEffect(() => {
      fetchFlows();
    }, []);
  
    const handleFlowChange = (event) => {
      const selectedValue = event.target.value;
      console.log("Selected flow ID:", selectedValue);
      setSelectedFlow(selectedValue);
      const selectedFlowData = flows.find(flow => flow.id === selectedValue);
      console.log("Selected flow data:", selectedFlowData);
    };
  
    useEffect(() => {
      console.log("Selected flow has changed:", selectedFlow);
    }, [selectedFlow]);
    const [isSending, setIsSending] = useState(false);

    const handleSendFlowData = async () => {
      if (!selectedFlow) {
        console.error('No flow selected');
        return;
      }
    
      const selectedFlowData = flows.find(flow => flow.id === selectedFlow);
      if (!selectedFlowData) {
        console.error('Selected flow data not found');
        console.log('Current flows:', flows);
        console.log('Selected flow ID:', selectedFlow);
        return;
      }

      const accountID = 397261306804870;
    
      try {
        setIsSending(true);
        const dataToSend = {
          ...selectedFlowData,
          // accountID: accountID,
          // access_token:'EAAVZBobCt7AcBO8trGDsP8t4bTe2mRA7sNdZCQ346G9ZANwsi4CVdKM5MwYwaPlirOHAcpDQ63LoHxPfx81tN9h2SUIHc1LUeEByCzS8eQGH2J7wwe9tqAxZAdwr4SxkXGku2l7imqWY16qemnlOBrjYH3dMjN4gamsTikIROudOL3ScvBzwkuShhth0rR9P',
          // firstInsert:'8',
          business_phone_number_id: businessPhoneNumberId,
        };
        console.log('Sending flow data:', dataToSend);
        const response = await axiosInstance.post('https://backenreal-hgg2d7a0d9fzctgj.eastus-01.azurewebsites.net/insert-data/', dataToSend, {
          headers: {
            'Content-Type': 'application/json',
            token: localStorage.getItem('token'),
          },
        });
        console.log('Flow data sent successfully:', response.data);
        if (response.status === 200) {
          // Add user feedback here (e.g., success message)
          console.log('Flow data sent successfully');
        }
      } catch (error) {
        console.error('Error sending flow data:', error);
        // Add user feedback here (e.g., error message)
      } finally {
        setIsSending(false);
      }
    };
 



const handleNewChat = async () => {
  if (!newPhoneNumber.trim()) return;

  try {
    const response = await axiosInstance.post('https://backenreal-hgg2d7a0d9fzctgj.eastus-01.azurewebsites.net/contacts/', {
      phone: newPhoneNumber,
      tenant: tenantId,
      // Add other required fields for creating a new contact
    }, {
      headers: { token: localStorage.getItem('token') },
    });

    const newContact = response.data;
    //setContacts(prev => sortContacts([newContact, ...prev]));
    setSelectedContact(newContact);
    setShowNewChatInput(false);
    setNewPhoneNumber('');
  } catch (error) {
    console.error("Error creating new contact:", error);
  }
};

 return (
  <div>
      {authPopupp && <AuthPopup onClose={handleCloseAuthPopupp} />}
     <div className={`${showPopup ? 'filter blur-lg' : ''}`}>
   <div className="cb-container">
      <div className="cb-sidebar">
        <div className="cb-sidebar-header">
        <h1 className='cb-sidebar-title'>
      {/* <ArrowBackIcon className="cb-back-icon" onClick={handleBack} />  */}
          Contacts 
          </h1>
          <button onClick={() => setShowNewChatInput(!showNewChatInput)} className="text-blue-500 hover:text-blue-700">
          <PlusIcon />
        </button>
        </div>
        {showNewChatInput && (
          <div className="p-4 border-b">
            <input
              type="text"
              value={newPhoneNumber}
              onChange={(e) => setNewPhoneNumber(e.target.value)}
              placeholder="Enter phone number"
              className="w-full p-2 border rounded"
            />
            <button onClick={handleNewChat} className="mt-2 w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
              Start New Chat
            </button>
          </div>
        )}
        <div className='cb-search-container'>
          <input
            type="text"
            placeholder="Search contacts..."
            value={searchText}
            className='cb-search-input'
            onChange={(e) => setSearchText(e.target.value)}
          />
          <SearchIcon className="cb-search-icon" />
        </div>
        <div className="cb-contact-list">
          <h2 className='cb-contact-title'>Contacts</h2>
          
          {prioritizedContacts.map(contact => (
        <div
          key={contact.id || contact.phone}
          className={`cb-contact-item ${selectedContact?.phone === contact.phone ? 'cb-selected' : ''}`}
          onClick={() => handleContactSelection(contact)}
        >
          <div className="cb-contact-info">
            <span className="cb-contact-name">{contact.name || 'Unknown Name'}</span>
            <span className="cb-contact-phone">{contact.phone || 'No Phone'}</span>
          </div>
          {contact.unreadCount > 0 && (
            <span className="cb-unread-count">{contact.unreadCount}</span>
          )}
                </div>
              ))}
        </div>
      </div>
      <div className="cb-main">
      {selectedContact && (
   <div className="cb-chat-header">
   {selectedContact && (
     <div className="cb-chat-contact-info">
       {profileImage ? (
         <img src={profileImage} alt="Profile" className="cb-profile-icon" />
       ) : (
         <span className="cb-default-avatar">{selectedContact.first_name && selectedContact.first_name[0]}</span>
       )}
       <div className="cb-contact-details">
         <span className="cb-contact-name">{selectedContact.name} {selectedContact.last_name}</span>
         <span className="cb-contact-phone">{selectedContact.phone}</span>
       </div>
     </div>
   )}
 </div>
)}
      <div className="cb-message-container">
  {conversation.map((message, index) => (
    <div
      key={index}
      className={`cb-message ${message.sender === 'user' ? 'cb-user-message' : 'cb-bot-message'}`}
    >
      {(() => {
      
        if (typeof message.text === 'string') {
          if (message.text.trim().startsWith('{') || message.text.trim().startsWith('[')) {
            try {
              const fixedMessage = fixJsonString(message.text);
              const parsedMessage = JSON.parse(fixedMessage);
              //console.log('Parsed Message:', parsedMessage);
              return renderInteractiveMessage(parsedMessage);
            } catch (e) {
              console.error('Failed to parse JSON message:', e);
              return <div className="error">Failed to parse message</div>;
            }
          }
          return message.text || <div className="error">Message content is undefined</div>;
        }else if (typeof message.text === 'object' && message.text !== null) {
          // Handle non-string message formats
          return renderMessageContent(message);
        }
        return <div className="error">Invalid message format</div>;
      })()}
    </div>
  ))}
  <div ref={messageEndRef} />
</div>
    <div className="cb-input-container">
          <div className="cb-input-actions">
            <EmojiEmotionsIcon className="cb-action-icon" onClick={handleToggleSmileys} />
            <input
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleFileSelect}
              ref={fileInputRef}
            />
            <AttachFileIcon className="cb-action-icon" onClick={() => fileInputRef.current.click()} />
          </div>
          <textarea
            value={selectedContact && messageTemplates[selectedContact.id] || ''}
            onChange={(e) => {
              if (selectedContact) {
                setMessageTemplates(prevTemplates => ({
                  ...prevTemplates,
                  [selectedContact.id]: e.target.value
                }));
              }
            }}
            placeholder="Type a message"
            className="cb-input-field"
          />
          <SendIcon className="cb-send-icon" onClick={handleSend} />
        </div>
        {showSmileys && (
          <div className="cb-emoji-picker">
            <Picker onEmojiClick={handleSelectSmiley} />
          </div>
        )}
      </div>
      <div className="cb-details-panel">
      <button className="cb-signup-btn" onClick={handleRedirect}>Sign Up</button>
    
      <button onClick={() => navigate(`/${tenantId}/broadcast`)} className="cb-action-btn" style={{marginTop:'1rem'}}>
  Broadcast History
</button>
        <h1 className='cb-details-title' style={{textAlign:'center'}}>Contact Details</h1>
        {selectedContact && (
  <div className="cb-contact-full-details">
    <div className="cb-profile-section">
      {profileImage ? (
        <img src={profileImage} alt="Profile" className="cb-profile-image" />
      ) : (
        <span className="cb-default-avatar-large">{selectedContact.first_name && selectedContact.first_name[0]}</span>
      )}
      <h2>{selectedContact.name} {selectedContact.last_name}</h2>
    </div>
    <div className="cb-contact-info-details">
      <p className='cb-info-item'>
        <CallRoundedIcon className="cb-info-icon" />
        {selectedContact.phone}
      </p>
      <p className='cb-info-item'>
        <MailIcon className="cb-info-icon" />
        {selectedContact.email}
      </p>
    </div>
  </div>
)}
        <div className="cb-actions">
          <button onClick={handleCreateFlow} className="cb-action-btn">Create Flow</button>
          <select value={selectedFlow} onChange={handleFlowChange} className="cb-flow-select">
            <option value="" disabled>Select a flow</option>
            {flows.map(flow => (
              <option key={flow.id} value={flow.id}>
                {flow.name || flow.id}
              </option>
            ))}
          </select>
          <button 
            onClick={handleSendFlowData} 
            className="cb-flow-btn"
            disabled={isSending}
          >
            {isSending ? "Sending..." : "Send Flow Data"}
          </button>
         
        </div>
      </div>
      {showImagePreview && (
      <div className="cb-image-preview-overlay">
        <div className="cb-image-preview-container">
          <CloseIcon className="cb-close-preview" onClick={() => setShowImagePreview(false)} />
          <img src={imageMap[imageToSend]} alt="Preview" className="cb-preview-image" />
          <textarea
            value={imageCaption}
            onChange={(e) => setImageCaption(e.target.value)}
            placeholder="Add a caption..."
            className="cb-image-caption-input"
          />
          <button 
            className="cb-send-image-btn" 
            onClick={handleImageSend}
            // disabled={isUploading || !blobUrl}
          >
            {isUploading ? "Uploading..." : "Send"}
          </button>
        </div>
      </div>
    )}
    </div>
    </div>
    </div>
  );

};

export default Chatbot;