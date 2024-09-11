import React, { useState, useEffect, useRef } from 'react';
import './chatbot.css';
// import OpenAI from "openai";
import { useParams } from "react-router-dom"; 
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

const socket = io('https://whatsappbotserver.azurewebsites.net/');


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
  const [messages, setMessages] = useState({});
  const [showSmileys, setShowSmileys] = useState(false);
  const [firebaseContacts, setFirebaseContacts] = useState([]);
  const [profileImage, setProfileImage] = useState(null); 
  const [searchQuery, setSearchQuery] = useState('');
  const [file, setFile] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [conversation, setConversation] = useState(['']);
  const [flows, setFlows] = useState([]);
  const [selectedFlow, setSelectedFlow] = useState('');
  const [previousContact, setPreviousContact] = useState(null);
  const [newMessages, setNewMessages] = useState([]);
  const [showBroadcastPopup, setShowBroadcastPopup] = useState(false);
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [selectedPhones, setSelectedPhones] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [groups, setGroups] = useState([]);
  const [allConversations, setAllConversations] = useState({});
  const [allMessages, setAllMessages] = useState([]);
  const [lastFetchTime, setLastFetchTime] = useState(null);
  const [lastMessageTimes, setLastMessageTimes] = useState({});
  const [isSendingBroadcast, setIsSendingBroadcast] = useState(false);
  const [unreadCounts, setUnreadCounts] = useState({});
  const messageEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const [imageToSend, setImageToSend] = useState(null);
  const [showImagePreview, setShowImagePreview] = useState(false);
  const [imageCaption, setImageCaption] = useState('');
  const [imageMap, setImageMap] = useState({});
  const [blobUrl, setBlobUrl] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [accessToken, setAccessToken] = useState('');
  const [businessPhoneNumberId, setBusinessPhoneNumberId] = useState('');
  const [headerMediaId, setHeaderMediaId] = useState('');
  const [inputMessage, setInputMessage] = useState('');
  const [showNewChatInput, setShowNewChatInput] = useState(false);
  const [newPhoneNumber, setNewPhoneNumber] = useState('');

  const openPopup = () => {
    setShowPopup(true);
  };

  const handlePopupClose = () => {
    setShowPopup(false);
  };


  useEffect(() => {
    socket.on('connect', () => {
      console.log('Connected to the server');
      fetchAllMessages();
    });
  
    socket.on('new-message', handleNewMessage);
  
    return () => {
      socket.off('new-message', handleNewMessage);
    };
  }, []);

   useEffect(() => {
    fetchContacts();
    socket.on('new-message', handleNewMessage);

    return () => {
      socket.off('new-message', handleNewMessage);
    };
  }, []);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation]);


  
  

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
          <img src={image.link} alt="Sent image" className="message-image" />
          {image.caption && <p className="message-caption">{image.caption}</p>}
        </div>
      );
    }

    return <p className="error-message">Unsupported message type</p>;
  };
  
  const fixJsonString = (jsonString) => {
    try {
      // Replace single quotes with double quotes
      let fixedString = jsonString.replace(/'/g, '"');
      // Ensure proper escape sequences
      fixedString = fixedString.replace(/\\"/g, '\\\\"');
      return fixedString;
    } catch (e) {
      console.error('Error fixing JSON string:', e);
      return jsonString; // Return as-is if fixing fails
    }
  };
  const fetchAllMessages = () => {
    socket.emit('get-all-messages', {}, (response) => {
      if (response && response.messages && Array.isArray(response.messages)) {
        const newMessages = response.messages;
        
        setAllMessages(prevMessages => {
          const combinedMessages = [...prevMessages, ...newMessages];
          const uniqueMessages = combinedMessages.filter((message, index, self) =>
            index === self.findIndex((t) => t.id === message.id)
          );
          return uniqueMessages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
        });

        const newLastMessageTimes = {};
        const newUnreadCounts = {};
        newMessages.forEach(message => {
          if (message.contactPhone && message.timestamp) {
            newLastMessageTimes[message.contactPhone] = message.timestamp;
            newUnreadCounts[message.contactPhone] = (newUnreadCounts[message.contactPhone] || 0) + 1;
          }
        });

        setLastMessageTimes(prev => ({...prev, ...newLastMessageTimes}));
        setUnreadCounts(prev => ({...prev, ...newUnreadCounts}));

        updateContactsWithNewMessages(newMessages);
      } else {
        console.error('Invalid response format for messages:', response);
      }
    });
  };

  
  const fetchContacts = async () => {
    try {
      const response = await axiosInstance.get('/contacts/', {
        headers: {
          token: localStorage.getItem('token'),
        },
      });
      // Ensure all contacts have the necessary properties
      const processedContacts = response.data.map(contact => ({
        ...contact,
        first_name: contact.first_name || '',
        last_name: contact.last_name || '',
        lastMessageTime: contact.lastMessageTime || null,
        hasNewMessage: contact.hasNewMessage || false
      }));
      setContacts(sortContacts(processedContacts));
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

  const generateChatbotMessage = async () => {
    try {
      if (!selectedContact) {
        console.error('No contact selected');
        return;
      }
  
      const name = `${selectedContact.first_name} ${selectedContact.last_name}`;
      const prompts = [
        `Hey ${name}! 😊 Thinking Python for AI. Simple and powerful. What do you think, ${name}?`,
        `Hi ${name}! 😄 Python's great for AI. Let's make something cool!`,
      ];
  
      const randomIndex = Math.floor(Math.random() * prompts.length);
      const prompt = prompts[randomIndex];
  
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: prompt },
        ],
      });
  
      const messageContent = response.choices[0].message.content.trim();
      setMessageTemplates(prevTemplates => ({
        ...prevTemplates,
        [selectedContact.id]: messageContent
      }));
    } catch (error) {
      console.error('Error generating WhatsApp message:', error);
    }
  };

  const handleGenerateMessage = async (e) => {
    e.preventDefault();
    await generateChatbotMessage();
  };

  useEffect(() => {
    const fetchTenantData = async () => {
      try {
        const business_phone_number_id = 241683569037594;
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
          'https://graph.facebook.com/v16.0/241683569037594/media',
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
  
    try {
      const response = await axiosInstance.post(
        'https://whatsappbotserver.azurewebsites.net/send-message',
        {
          phoneNumbers: [selectedContact.phone],
          messageType: "image",
          additionalData: {
            imageId: setImageToSend, // Use the media ID here
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



  // const handleImageSend = async () => {
  //   if (!imageToSend || !selectedContact) return;

  //   try {
  //     const imageUrl = imageMap[imageToSend];
  //     const response = await axiosInstance.post(
  //       'https://hx587qc4-8080.inc1.devtunnels.ms/send-message',
  //       {
  //         phoneNumbers: [selectedContact.phone],
  //         url: false,
  //         messageType: "image",
  //         additionalData: {
  //           imageUrl: imageUrl,
  //           caption: imageCaption
  //         },
  //         business_phone_number_id: "241683569037594"
  //       }
  //     );

  //     if (response.status === 200) {
  //       setConversation(prev => [...prev, { 
  //         type: 'image', 
  //         sender: 'bot', 
  //         imageId: imageToSend,
  //         imageUrl: imageUrl, // Add this line
  //         caption: imageCaption 
  //       }]);
  //       setImageToSend(null);
  //       setImageCaption('');
  //       setShowImagePreview(false);
  //     }
  //   } catch (error) {
  //     console.error('Error sending image:', error);
  //   }
  // };

  // Function to handle back navigation
  const handleBack = () => {
    // navigate(-1);
  };

  // Scroll to bottom of chat
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation]);

  // Render message function
  // const renderMessage = (message, index) => {
  //   const isUser = message.sender === 'user';
  //   const messageClass = `cb-message ${isUser ? 'cb-user-message' : 'cb-bot-message'}`;

  //   if (message.type === 'image') {
  //     return (
  //       <div key={index} className={messageClass}>
  //         <img 
  //           src={message.imageUrl || imageMap[message.imageId]} 
  //           alt="Sent image" 
  //           className="cb-message-image" 
  //           onError={(e) => {
  //             console.error("Error loading image:", e);
  //             e.target.onerror = null;
  //             e.target.src = "path/to/fallback/image.png"; // Add a fallback image
  //           }}
  //         />
  //         {message.caption && <p className="cb-message-caption">{message.caption}</p>}
  //       </div>
  //     );
  //   }

  //   // Handle text and interactive messages
  //   if (typeof message.text === 'string') {
  //     if (message.text.trim().startsWith('{') || message.text.trim().startsWith('[')) {
  //       try {
  //         const fixedMessage = fixJsonString(message.text);
  //         const parsedMessage = JSON.parse(fixedMessage);
  //         return renderInteractiveMessage(parsedMessage);
  //       } catch (e) {
  //         console.error('Failed to parse JSON message:', e);
  //         return <div className="error">Failed to parse message</div>;
  //       }
  //     }
  //     return <div>{message.text || <span className="error">Message content is undefined</span>}</div>;
  //   }
  //   return <div className="error">Invalid message format</div>;
  // };


  const handleUploadedFile = async (event, contactId) => {
    const selectedFile = event.target.files[0];
    console.log('Selected file:', selectedFile);
    console.log('this is contactId',contactId);
    if (selectedFile) {
      setFile(selectedFile);
      console.log('File state set:', selectedFile);

      try {
        console.log('Uploading file to Azure Blob Storage...');
        const fileUrl = await uploadToBlob(selectedFile);
        console.log('File uploaded to Azure, URL:', fileUrl);

        console.log('Sending POST request to backend...');
        const response = await axiosInstance.post('/documents/', {
          name: selectedFile.name,
          document_type: selectedFile.type,
          description: 'Your file description',
          file_url: fileUrl,
          entity_type: 10,
          entity_id: contactId,
          tenant: tenantId,
        });
        console.log('POST request successful, response:', response.data);

        setUploadedFiles(prevFiles => [...prevFiles, { name: selectedFile.name, url: fileUrl }]);
        console.log('File uploaded successfully:', response.data);
      } catch (error) {
        console.error('Error uploading file:', error);
      }
    } else {
      console.log('No file selected');
    }
  };

  useEffect(() => {
    socket.on('connect', () => {
      console.log('Connected to the server');
      // Request all messages upon connection
      socket.emit('fetch-all-messages', { tenantId });
    });

    socket.on('all-messages', (messages) => {
      handleAllMessages(messages);
    });

    socket.on('new-message', (message) => {
      if (message) {
        console.log('Got New Message', message.contactPhone.wa_id);
        
        setContacts(prevContacts => {
          const updatedContacts = prevContacts.map(contact => 
            parseInt(contact.phone) === parseInt(message.contactPhone.wa_id)
              ? { ...contact, hasNewMessage: true }
              : contact
          );
          
          // Sort contacts: new messages first, then alphabetically
          return updatedContacts.sort((a, b) => {
            if (a.hasNewMessage === b.hasNewMessage) {
              return a.first_name.localeCompare(b.first_name);
            }
            return b.hasNewMessage ? 1 : -1;
          });
        });

        setAllConversations(prevConversations => ({
          ...prevConversations,
          [message.contactPhone.wa_id]: [
            ...(prevConversations[message.contactPhone.wa_id] || []),
            { text: message.message, sender: 'user' }
          ]
        }));
    
        if (selectedContact && parseInt(message.contactPhone.wa_id) === parseInt(selectedContact.phone)) {
          setConversation(prevMessages => [...prevMessages, { text: message.message, sender: 'user' }]);
          setNewMessages(prevMessages => [...prevMessages, { text: message.message, sender: 'user' }]);
        }
      }
    });

    return () => {
      socket.off('connect');
      socket.off('all-messages');
      socket.off('new-message');
    };
  }, []);

  const handleAllMessages = (messages) => {
    setAllMessages(messages);
    updateContactsWithMessages(messages);
  };

  const handleNewMessage = (message) => {
    if (message && message.contactPhone && message.contactPhone.wa_id) {
      const contactPhone = message.contactPhone.wa_id;
      
      const newMessage = {
        contactPhone: contactPhone,
        text: message.message,
        sender: 'user',
        timestamp: new Date().toISOString()
      };
  
      setAllMessages(prevMessages => [...prevMessages, newMessage]);
  
      setLastMessageTimes(prev => ({
        ...prev,
        [contactPhone]: new Date().toISOString()
      }));
  
      setUnreadCounts(prev => ({
        ...prev,
        [contactPhone]: (prev[contactPhone] || 0) + 1
      }));
  
      updateContactPriority(contactPhone, newMessage);
  
      if (selectedContact && selectedContact.phone === contactPhone) {
        setConversation(prevConversation => [...prevConversation, newMessage]);
        setUnreadCounts(prev => ({ ...prev, [contactPhone]: 0 }));
      }
    }
  };

  const updateContactPriority = (contactPhone, newMessage) => {
    setContacts(prevContacts => {
      const updatedContacts = prevContacts.map(contact => 
        contact.phone === contactPhone
          ? { 
              ...contact, 
              hasNewMessage: true, 
              lastMessageTime: new Date().toISOString(),
              lastMessage: newMessage.text
            }
          : contact
      );
      
      return sortContacts(updatedContacts);
    });
  };

  const sortContacts = (contactsToSort) => {
    return contactsToSort.sort((a, b) => {
      if (a.hasNewMessage !== b.hasNewMessage) {
        return b.hasNewMessage ? 1 : -1;
      }
      if (a.lastMessageTime !== b.lastMessageTime) {
        return new Date(b.lastMessageTime || 0) - new Date(a.lastMessageTime || 0);
      }
      const nameA = `${a.first_name || ''} ${a.last_name || ''}`.trim();
      const nameB = `${b.first_name || ''} ${b.last_name || ''}`.trim();
      return nameA.localeCompare(nameB);
    });
  };

  const updateContactsWithNewMessages = (newMessages) => {
    setContacts(prevContacts => {
      const updatedContacts = prevContacts.map(contact => {
        const contactMessages = newMessages.filter(msg => msg.contactPhone === contact.phone);
        if (contactMessages.length > 0) {
          const latestMessage = contactMessages[contactMessages.length - 1];
          return {
            ...contact,
            lastMessageTime: latestMessage.timestamp,
            hasNewMessage: true,
            lastMessage: latestMessage.text
          };
        }
        return contact;
      });

      return sortContacts(updatedContacts);
    });
  };
  
  
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
      
          return axiosInstance.post(
            'https://whatsappbotserver.azurewebsites.net/send-message',
            {
              phoneNumbers: [phoneNumber],
              message: newMessage.content,
              business_phone_number_id: "241683569037594",
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
        await axiosInstance.post(
          'https://whatsappbotserver.azurewebsites.net/send-message',
          {
            phoneNumbers: [phoneNumber],
            message: newMessage.content,
            business_phone_number_id: "241683569037594",
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

  
  


  const filteredContacts = contacts.filter(contact => {
    const searchLower = searchText.toLowerCase();
    return (
      contact.first_name?.toLowerCase().includes(searchLower) ||
      contact.last_name?.toLowerCase().includes(searchLower) ||
      contact.phone?.toLowerCase().includes(searchLower) ||
      contact.email?.toLowerCase().includes(searchLower)
    );
  });
  

  const sendDataToBackend = async (contactPhone, conversation) => {
    try {
      const formattedConversation = conversation
        .filter(msg => msg.text && msg.text.trim() !== '')
        .map(msg => ({
          text: msg.text,
          sender: msg.sender,
        }));
  
      if (formattedConversation.length === 0) return;
  
      const response = await fetch(`https://backenreal-hgg2d7a0d9fzctgj.eastus-01.azurewebsites.net/whatsapp_convo_post/${contactPhone}/?source=whatsapp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Tenant-Id': tenantId
        },
        body: JSON.stringify({
          contact_id: contactPhone,
          conversations: formattedConversation,
          tenant: 'll',
        }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to send data to backend');
      }
  
      console.log('Data sent to backend successfully');
  
    } catch (error) {
      console.error('Error sending data to backend:', error);
    }
  };
  
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
    if (previousContact) {
      // Save conversation data for the previous contact
      console.log("commentsdsdsd::::::::::::::::::::::::::::::::::::",conversation);
      sendDataToBackend(previousContact.phone, newMessages);
    }
    
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
    
    setContacts(prevContacts => 
      prevContacts.map(c => 
        c.id === contact.id ? { ...c, hasNewMessage: false } : c
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
      window.location.href = 'https://www.facebook.com/v18.0/dialog/oauth?client_id=1546607802575879&redirect_uri=https%3A%2F%2Fcrm.nuren.ai%2Fchatbotredirect&response_type=code&config_id=1573657073196264&state=pass-through%20value';
    };

    const handleCreateFlow = () => {
      // navigate(`/${tenantId}/flow`); // Use navigate instead of history.push
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
          business_phone_number_id:'241683569037594'
        };
        console.log('Sending flow data:', dataToSend);
        const response = await axiosInstance.post('https://8twdg37p-8000.inc1.devtunnels.ms/insert-data/', dataToSend, {
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
    useEffect(() => {
      return () => {
        // This cleanup function will run when the component unmounts
        setIsSending(false);
        const savedGroups = JSON.parse(localStorage.getItem('broadcastGroups') || '[]');
        setGroups(savedGroups);
      };
    }, []);
    const handleBroadcastMessage = () => {
      setShowBroadcastPopup(true);
    };

    const handleCloseBroadcastPopup = () => {
      setShowBroadcastPopup(false);
      setBroadcastMessage('');
      setSelectedPhones([]);
      setGroupName('');
      setIsSendingBroadcast(false);
    };

    
   
    const handleSendBroadcast = async () => {
      if (selectedPhones.length === 0 || !broadcastMessage.trim()) {
        alert("Please select at least one contact and enter a message.");
        return;
      }
    
      setIsSendingBroadcast(true);
    
      try {
        // Create a new group and save it to local storage
        const newGroup = {
          id: uuidv4(),
          name: groupName || `Broadcast Group ${new Date().toISOString()}`,
          members: selectedPhones
        };
        saveGroupToLocalStorage(newGroup);
    
        // Prepare the data in the specified format
        const phoneNumbers = selectedPhones.map(contactId => {
          const contact = contacts.find(c => c.id === contactId);
          return parseInt(contact.phone); // Ensure the phone number is an integer
        });
    
        const payload = {
          phoneNumbers: phoneNumbers,
          message: broadcastMessage,
           business_phone_number_id: "241683569037594",
           messageType: "text",
        };
    
        // Send the broadcast message
        const response = await axiosInstance.post('https://whatsappbotserver.azurewebsites.net/send-message/', payload);
    
        if (response.status === 200) {
          console.log("Broadcast sent successfully");
          alert("Broadcast message sent successfully!");
          handleCloseBroadcastPopup();
        } else {
          throw new Error("Failed to send broadcast");
        }

        const broadcastMessageObj = { text: broadcastMessage, sender: 'bot' };
        setGroups(prevGroups => prevGroups.map(group => ({
          ...group,
          conversation: [...(group.conversation || []), broadcastMessageObj]
        })));
    
        // If the current selected contact is a group, update the conversation
        if (selectedContact && selectedContact.isGroup) {
          setConversation(prevConversation => [...prevConversation, broadcastMessageObj]);
        }

      } catch (error) {
        console.error("Error sending broadcast:", error);
        alert("Failed to send broadcast message. Please try again.");
      } finally {
        setIsSendingBroadcast(false);
      }
    };


const handlePhoneSelection = (contactId) => {
  setSelectedPhones(prevSelected => 
    prevSelected.includes(contactId)
      ? prevSelected.filter(id => id !== contactId)
      : [...prevSelected, contactId]
  );
};

const saveGroupToLocalStorage = (group) => {
  const existingGroups = JSON.parse(localStorage.getItem('broadcastGroups') || '[]');
  const updatedGroups = [...existingGroups, group];
  localStorage.setItem('broadcastGroups', JSON.stringify(updatedGroups));
};


const handleSendMessage = async () => {
  if (!selectedContact || !inputMessage.trim()) return;

  try {
    await axiosInstance.post('https://whatsappbotserver.azurewebsites.net/send-message', {
      phoneNumbers: [selectedContact.phone],
      message: inputMessage,
      business_phone_number_id: "241683569037594",
      messageType: "text",
    });

    setMessages(prev => ({
      ...prev,
      [selectedContact.phone]: [...(prev[selectedContact.phone] || []), { text: inputMessage, sender: 'bot' }]
    }));
    setInputMessage('');
  } catch (error) {
    console.error('Error sending message:', error);
  }
};


const handleNewChat = async () => {
  if (!newPhoneNumber.trim()) return;

  try {
    const response = await axiosInstance.post('/contacts/', {
      phone: newPhoneNumber,
      // Add other required fields for creating a new contact
    }, {
      headers: { token: localStorage.getItem('token') },
    });

    const newContact = response.data;
    setContacts(prev => sortContacts([newContact, ...prev]));
    setSelectedContact(newContact);
    setShowNewChatInput(false);
    setNewPhoneNumber('');
  } catch (error) {
    console.error("Error creating new contact:", error);
  }
};

// return (
//   <div className="flex h-screen bg-gray-100">
//     <div className="w-1/3 bg-white border-r">
//       <div className="p-4 border-b flex justify-between items-center">
//         <h2 className="text-xl font-semibold">Chats</h2>
//         <button onClick={() => setShowNewChatInput(!showNewChatInput)} className="text-blue-500 hover:text-blue-700">
//           <PlusIcon />
//         </button>
//       </div>
//       {showNewChatInput && (
//         <div className="p-4 border-b">
//           <input
//             type="text"
//             value={newPhoneNumber}
//             onChange={(e) => setNewPhoneNumber(e.target.value)}
//             placeholder="Enter phone number"
//             className="w-full p-2 border rounded"
//           />
//           <button onClick={handleNewChat} className="mt-2 w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
//             Start New Chat
//           </button>
//         </div>
//       )}
//       <div className="overflow-y-auto h-full">
//         {contacts.map(contact => (
//           <div
//             key={contact.id}
//             onClick={() => handleContactSelection(contact)}
//             className={`p-4 border-b cursor-pointer ${selectedContact?.id === contact.id ? 'bg-gray-200' : ''} ${contact.hasNewMessage ? 'font-bold' : ''}`}
//           >
//             <div className="flex items-center">
//               <PhoneIcon className="mr-2" />
//               <span>{contact.phone}</span>
//               {contact.hasNewMessage && <span className="ml-2 w-3 h-3 bg-blue-500 rounded-full"></span>}
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//     <div className="flex-1 flex flex-col">
//       {selectedContact ? (
//         <>
//           <div className="p-4 border-b">
//             <h3 className="text-lg font-semibold">{selectedContact.phone}</h3>
//           </div>
//           <div className="flex-1 overflow-y-auto p-4">
//             {messages[selectedContact.phone]?.map((message, index) => (
//               <div key={index} className={`mb-4 ${message.sender === 'user' ? 'text-right' : 'text-left'}`}>
//                 <div className={`inline-block p-2 rounded-lg ${message.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}>
//                   {message.text}
//                 </div>
//               </div>
//             ))}
//           </div>
//           <div className="p-4 border-t flex">
//             <input
//               type="text"
//               value={inputMessage}
//               onChange={(e) => setInputMessage(e.target.value)}
//               placeholder="Type a message"
//               className="flex-1 p-2 border rounded-l"
//             />
//             <button onClick={handleSendMessage} className="bg-blue-500 text-white p-2 rounded-r">
//               <SendIcon />
//             </button>
//           </div>
//         </>
//       ) : (
//         <div className="flex-1 flex items-center justify-center">
//           <p className="text-gray-500">Select a contact to start chatting</p>
//         </div>
//       )}
//     </div>
//   </div>
// );

 return (
    <div className="cb-container">
      <div className="cb-sidebar">
        <div className="cb-sidebar-header">
        <h1 className='cb-sidebar-title'>
      <ArrowBackIcon className="cb-back-icon" onClick={handleBack} /> 
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
          
          {filteredContacts.map(contact => (
            <div
              key={contact.id}
              className={`cb-contact-item ${selectedContact?.id === contact.id ? 'cb-selected' : ''}`}
              onClick={() => handleContactSelection(contact)}
            >
              <div className="cb-contact-info">
                <span className="cb-contact-name">{contact.name} {contact.last_name}</span>
                <span className="cb-contact-phone">{contact.phone}</span>
                {contact.hasNewMessage && <span className="cb-unread-count"></span>}
                {contact.lastMessageTime && (
                  <span className="cb-last-message-time">
                    {new Date(contact.lastMessageTime).toLocaleTimeString()}
                  </span>
                )}
                {contact.lastMessage && (
                  <span className="cb-last-message-preview">
                    {contact.lastMessage.substring(0, 30)}...
                  </span>
                )}
              </div>
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
              console.log('Parsed Message:', parsedMessage);
              return renderInteractiveMessage(parsedMessage);
            } catch (e) {
              console.error('Failed to parse JSON message:', e);
              return <div className="error">Failed to parse message</div>;
            }
          }
          return message.text || <div className="error">Message content is undefined</div>;
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
    
      {/* <button onClick={() => navigate(`/${tenantId}/broadcast`)} className="cb-action-btn"> */}
  {/* Broadcast History */}
{/* </button> */}
        <h1 className='cb-details-title' style={{textAlign:'center'}}>Contact Details</h1>
        {selectedContact && (
  <div className="cb-contact-full-details">
    <div className="cb-profile-section">
      {profileImage ? (
        <img src={profileImage} alt="Profile" className="cb-profile-image" />
      ) : (
        <span className="cb-default-avatar-large">{selectedContact.first_name && selectedContact.first_name[0]}</span>
      )}
      <h2>{selectedContact.first_name} {selectedContact.last_name}</h2>
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
          <button 
            onClick={handleBroadcastMessage} 
            className="cb-broadcast-btn"
          >
            Broadcast Message
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
      {showBroadcastPopup && (
        <div className="cb-broadcast-popup">
          <div className="cb-broadcast-content">
            <h2>Broadcast Message</h2>
            <input
              type="text"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="Enter group name (optional)"
              className="cb-group-name-input"
            />
            <textarea
              value={broadcastMessage}
              onChange={(e) => setBroadcastMessage(e.target.value)}
              placeholder="Type your broadcast message here..."
              className="cb-broadcast-message-input"
            />
            <div className="cb-broadcast-contact-list">
              <h3>Select Contacts:</h3>
              {contacts.map(contact => (
                <div key={contact.id} className="cb-broadcast-contact-item">
                  <input
                    type="checkbox"
                    id={`contact-${contact.id}`}
                    checked={selectedPhones.includes(contact.id)}
                    onChange={() => handlePhoneSelection(contact.id)}
                  />
                  <label htmlFor={`contact-${contact.id}`}>
                    {contact.name} ({contact.phone})
                  </label>
                </div>
              ))}
            </div>
            <div className="cb-broadcast-actions">
              <button 
                onClick={handleSendBroadcast} 
                disabled={isSendingBroadcast || selectedPhones.length === 0 || !broadcastMessage.trim()}
                className="cb-send-broadcast-btn"
              >
                {isSendingBroadcast ? "Sending..." : "Send Broadcast"}
              </button>
              <button onClick={handleCloseBroadcastPopup} className="cb-cancel-broadcast-btn">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

};

export default Chatbot;