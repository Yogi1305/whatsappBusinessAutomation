import React, { useState, useEffect, useRef,useMemo,useCallback } from 'react';
import './chatbot.css';
import { getTenantIdFromUrl,fixJsonString,setCSSVariable,getContactIDfromURL} from './chatbot/utilityfunctions.jsx';
import { renderMessageContent, renderInteractiveMessage,renderTemplateMessage } from './messageRenderers';
// import OpenAI from "openai";
import { toast } from "sonner";
import { format } from 'date-fns';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Navigate, useNavigate, useParams } from "react-router-dom"; 
import {axiosInstance,fastURL, djangoURL} from "../../api.jsx";

import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import SendIcon from '@mui/icons-material/Send';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import CloseIcon from '@mui/icons-material/Close'
import FullPageLoader from './FullPageLoader.jsx';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import Picker from 'emoji-picker-react';

import axios from 'axios';
import { parse, v4 as uuidv4 } from 'uuid'; 
import {whatsappURL}  from '../../Navbar';

import io from 'socket.io-client';
import { PhoneIcon, PlusCircle, PlusIcon, Upload, X,Search, ChevronRight,ChevronLeft} from 'lucide-react';
import { useAuth } from '../../authContext.jsx';
import AuthPopup from './AuthPopup.jsx';
import { base, div } from 'framer-motion/client';


//import { Button, Input } from 'antd';
import { 
  Phone, 
  Mail, 
  Plus, 
} from "lucide-react";  

const socket = io(whatsappURL);

// Add this near the top of your file, after imports
const DUMMY_CONTACTS = [
  {
    id: 'dummy1',
    name: 'John Doe',
    phone: '911234567890',
    email: 'john@example.com',
    unreadCount: 2,
    last_replied: new Date().toISOString(),
  },
  {
    id: 'dummy2',
    name: 'Alice Smith',
    phone: '919876543210',
    email: 'alice@example.com',
    unreadCount: 0,
    last_seen: new Date().toISOString(),
  },
  {
    id: 'dummy3',
    name: 'Bob Johnson',
    phone: '917890123456',
    email: 'bob@example.com',
    unreadCount: 1,
    last_delivered: new Date().toISOString(),
  },
];

const DUMMY_CONVERSATIONS = {
  dummy1: [
    {
      id: 'd1m1',
      text: 'Hello! How can I help you today?',
      sender: 'user',
      time: new Date(Date.now() - 3600000).toISOString(),
    },
    {
      id: 'd1m2',
      text: 'I need information about your services',
      sender: 'bot',
      time: new Date(Date.now() - 3300000).toISOString(),
    },
    {
      id: 'd1m3',
      text: 'Sure! We offer various solutions including...',
      sender: 'user',
      time: new Date(Date.now() - 3000000).toISOString(),
    },
  ],
  dummy2: [
    {
      id: 'd2m1',
      text: 'Hi Alice! Welcome to our platform',
      sender: 'bot',
      time: new Date(Date.now() - 7200000).toISOString(),
    },
    {
      id: 'd2m2',
      text: 'Thank you! I excited to get started',
      sender: 'user',
      time: new Date(Date.now() - 7000000).toISOString(),
    },
  ],
  dummy3: [
    {
      id: 'd3m1',
      text: 'Good morning! Any updates on my request?',
      sender: 'user',
      time: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      id: 'd3m2',
      text: 'Yes, were processing it right now',
      sender: 'bot',
      time: new Date(Date.now() - 86000000).toISOString(),
    },
  ],
};


const Chatbot = () => {
  
  const tenantId=getTenantIdFromUrl();
  // const navigate = useNavigate();
  const [totalPages, setTotalPages] = useState(1);
  const [contacts, setContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [messageTemplates, setMessageTemplates] = useState({});
  const [buttons, setButtons] = useState([]);
  const [showSmileys, setShowSmileys] = useState(false);
  const [inputFields, setInputFields] = useState([{ type: 'text', value: '' }]);
  const [profileImage, setProfileImage] = useState(null); 
  const [conversation, setConversation] = useState([]);
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
  const [file, setFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');
  const [currentMessagePage, setCurrentMessagePage] = useState(1);
const [isLoadingMore, setIsLoadingMore] = useState(false);
const [hasMoreMessages, setHasMoreMessages] = useState(true);
const messagesContainerRef = useRef(null);
const previousScroll = useRef({ height: 0, top: 0 });
const [lastUpdateType, setLastUpdateType] = useState(null);
const [showLoadMoreButton, setShowLoadMoreButton] = useState(false);
useEffect(() => {
  const container = messagesContainerRef.current;
  if (!container) return;

  const handleScroll = () => {
    const buffer = 100; // Pixels from top to show button
    setShowLoadMoreButton(container.scrollTop <= buffer && hasMoreMessages);
  };

  container.addEventListener('scroll', handleScroll);
  return () => container.removeEventListener('scroll', handleScroll);
}, [hasMoreMessages]);
  
  const [isOpen, setIsOpen] = useState(false);
  const toggleFab = () => {
    setIsOpen(!isOpen);
  };
  const handleCloseAuthPopupp = () => {
    setAuthPopupp(false);
  };

  useEffect(() => {
    // Show popup only if not authenticated and not in demo mode
    setAuthPopupp(!authenticated);
  }, [authenticated]);


  useEffect(() => {
    fetchContacts();
  }, []);


 

  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;
  
    if (lastUpdateType === 'append') {
      const newHeight = container.scrollHeight;
      setTimeout(() => {
        container.scrollTop = newHeight - previousScroll.current.height;
      }, 50); // Add small delay for DOM updates
      setLastUpdateType(null);
    }
    else if (lastUpdateType === 'new') {
      setTimeout(() => {
        messageEndRef.current?.scrollIntoView({ 
          behavior: 'auto',
          block: 'nearest' 
        });
      }, 100); // Add slight delay for initial render
      setLastUpdateType(null);
    }
  }, [conversation, lastUpdateType]);

  
  useEffect(() => {
    const fetchBusinessPhoneId = async () => {
      try {
        //console.log("fetching business phone number id")
        const response = await axiosInstance.get(`${fastURL}/whatsapp_tenant/`, {
          headers: {
            'X-Tenant-Id': tenantId
          }
        });
        //console.log(response.data.whatsapp_data[0].business_phone_number_id,"THIS IS BPID");
        setBusinessPhoneNumberId(response.data.whatsapp_data[0].business_phone_number_id);
      } catch (error) {
      //  console.error('Error fetching business phone ID:', error);
      }
    };

    fetchBusinessPhoneId();
  }, [tenantId]);
    
  const handlePhoneSearch = async () => {
    if (searchTerm.length !== 12 || !/^\d{12}$/.test(searchTerm)) {
      toast.warning('Invalid Phone Number', {
        description: 'Search term must be exactly 12 digits.',
        duration: 3000
      });
      return; // Exit the function if validation fails
    }
  
    try {
      const response = await axiosInstance.get(`${fastURL}/contacts/${currentPage}?phone=${searchTerm}`);
      
      if (response.data.page_no) {
        const updatedPage = response.data.page_no;
        setCurrentPage(updatedPage); // Update the state
        fetchContacts(updatedPage); // Use the updated value directly
      }
    } catch (error) {
    //  console.error('Error fetching contact page:', error);
      // Optionally handle error (show toast, etc.)
    }
  };

``
  /*const fetchContacts = async () => {
    try {
      const response = await axiosInstance.get(`${fastURL}/contacts`, {
        headers: {
          token: localStorage.getItem('token'),
        },
      });
      // Ensure all contacts have the necessary properties
      
      setContacts(response.data);
    } catch (error) {
      console.error("Error fetching contacts data:", error);
    }
  };*/
  const fetchContacts = async (page = 1) => {
    try {
      setIsLoading(true);
      
      // Fetch contacts for the specific page
      const response = await axiosInstance.get(`${fastURL}/contacts/${page}?order_by=last_replied&sort_by=desc`);
      if (!response.data.contacts || response.data.contacts.length === 0) {
        setContacts(DUMMY_CONTACTS);
        setTotalPages(1);
        setCurrentPage(1);
      } else {
        setContacts(response.data.contacts);
        setTotalPages(response.data.total_pages);
        setCurrentPage(page);
      }
    
    } catch (error) {
      setContacts(DUMMY_CONTACTS);
    setTotalPages(1);
    setCurrentPage(1);
   //   console.error("Error fetching contacts data:", error);
    } finally {
      setIsLoading(false);
    }
  };  

  const getInitials = (firstName, lastName) => {
      const firstInitial = firstName && firstName.charAt(0) ? firstName.charAt(0).toUpperCase() : '';
      const lastInitial = lastName && lastName.charAt(0) ? lastName.charAt(0).toUpperCase() : '';
      return firstInitial + lastInitial || '??';
  };

  const getAvatarColor = (initials) => {
      const charCode = (initials.charCodeAt(0) || 0) + (initials.charCodeAt(1) || 0);
      return `avatar-bg-${(charCode % 10) + 1}`;
  };


  useEffect(() => {
    const fetchTenantData = async () => {
      try {
        // const business_phone_number_id = 241683569037594;
       // console.log("bpiddddddd: ", businessPhoneNumberId)
        const response = await axiosInstance.get(`${fastURL}/whatsapp_tenant/`);
        setAccessToken(response.data.whatsapp_data[0].access_token);

      } catch (error) {
       // console.error('Error fetching tenant data:', error);
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
        const response = await axios.post(
          `https://graph.facebook.com/v16.0/${businessPhoneNumberId}/media`, //HARDCODE
          formData,
          {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'multipart/form-data',
            },
          }
        );
        //console.log('File uploaded to WhatsApp, ID:', response.data.id);
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
      //  console.error('Error uploading file:', error);
        alert('Failed to upload file. Please try again.');
      } finally {
        setIsUploading(false);
      }
    }
  };


  const handleAddField = () => {
    setInputFields([...inputFields, { type: 'text', value: '' }]);
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleInputChange = (index, e) => {
    const newInputFields = [...inputFields];
    newInputFields[index].value = e.target.value;
    setInputFields(newInputFields);
  };

  const handleImageSend = async () => {
    if (!imageToSend || !selectedContact) return;
    let phoneNumber = selectedContact.phone;
    if (phoneNumber.startsWith("91")) {
      phoneNumber = phoneNumber.slice(2);
    }
    try {
      const response = await axiosInstance.post(
        `${whatsappURL}/send-message`,
        {
          phoneNumbers: [phoneNumber],
          messageType: "image",
          additionalData: {
            imageId: imageToSend, 
            caption: imageCaption
          },
          business_phone_number_id: businessPhoneNumberId
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
    //  console.error('Error sending image:', error);
      alert('Failed to send image. Please try again.');
    }
  };


  const createNewContact = (contactPhone) => ({
    id: Date.now(), // Generate a unique ID or use another method
    phoneNumber: contactPhone,
    name: 'New Contact', // Default or empty name
    hasNewMessage: true // Default or initial state
  });

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'auto' });
  }, [conversation]);
  const isSocketUpdate = useRef(false);

  useEffect(() => {
    // Add a ref to track socket-initiated updates
    
    const handleConnect = () => {
     // console.log('Connected to the server');
      if (selectedContact) {
        socket.emit('request-messages', {
          phone: selectedContact.phone,
          lastReceived: Date.now() - 60000
        });
      }
    };
  
    const handleTempUser = (message) => {
      if (!message) return;
      
      const storedSessionId = localStorage.getItem('sessionId');
      
      if (`*/${message.temp_user}` === storedSessionId) {
        const newContactId = `${message.temp_user}-${message.contactPhone}`;
        
        setContacts(prevContacts => {
          if (prevContacts.some(c => c.id === newContactId)) {
            return prevContacts;
          }
          return [...prevContacts, {
            id: newContactId,
            phone: message.contactPhone,
            unreadCount: 0
          }];
        });
  
        // Set flag before updating selectedContact
        isSocketUpdate.current = true;
        setSelectedContact({ phone: message.contactPhone, fromSocket: true });
        setShowNewChatInput(false);
      }
    };
    const handleNewMessage = (message) => {
      if (
        message && 
        parseInt(message.phone_number_id) === parseInt(businessPhoneNumberId)
      ) {
        //console.log('Received normal message:', message);
        isSocketUpdate.current = true; // Flag that this is a socket update
        if (selectedContact?.phone !== message.contactPhone) {
          setContacts(prevContacts => 
            prevContacts.map(contact => 
              contact.phone === message.contactPhone
                ? { ...contact, unreadCount: (contact.unreadCount || 0) + 1 }
                : contact
            )
          );
          return; // Exit the function here if it's not the selected contact
        }
        // Update conversation if it's for the selected contact
        if (parseInt(message.contactPhone) === parseInt(selectedContact?.phone)) {
          setConversation((prev) => [
            ...prev,
            {
              id: `msg_${Date.now()}`,
              text: JSON.stringify(message.message),
              sender: 'user',
              timestamp: Date.now(),
            },
          ]);
        }
        
        // Update unread count if message is not for selected contact
        if (selectedContact?.phone !== message.contactPhone) {
          setContacts(prevContacts => 
            prevContacts.map(contact => 
              contact.phone === message.contactPhone
                ? { ...contact, unreadCount: (contact.unreadCount || 0) + 1 }
                : contact
            )
          );
        }
      }
    };
    
    const handleNodeMessage = (rawMessage) => {
      if (
        rawMessage && 
        parseInt(rawMessage.phone_number_id) === parseInt(businessPhoneNumberId)
      ) {
        try {
         // console.log('Received node message:', rawMessage);
          isSocketUpdate.current = true;
          if (selectedContact?.phone !== rawMessage.contactPhone) {
            setContacts(prevContacts => 
              prevContacts.map(contact => 
                contact.phone === rawMessage.contactPhone
                  ? { ...contact, unreadCount: (contact.unreadCount || 0) + 1 }
                  : contact
              )
            );
            return; // Exit the function here if it's not the selected contact
          }
          // Update conversation if it's for the selected contact
          if (parseInt(rawMessage.contactPhone) === parseInt(selectedContact?.phone)) {
            setConversation((prev) => [
              ...prev,
              {
                id: `msg_${Date.now()}`,
                text: JSON.stringify(rawMessage.message),
                sender: 'bot',
                timestamp: Date.now(),
              },
            ]);
          }
    
          // Update unread count if message is not for selected contact
         
    
        } catch (error) {
        //  console.error('Global message handling error:', error);
        }
      }
    };
// Add this helper function outside the component

    socket.on('connect', handleConnect);
    socket.on('temp-user', handleTempUser);
    socket.on('new-message', handleNewMessage);
    socket.on('node-message', handleNodeMessage);
    socket.on('error', (error) => {
    //  console.error('Socket error:', error);
    });
  
    return () => {
      socket.off('connect', handleConnect);
      socket.off('temp-user', handleTempUser);
      socket.off('new-message', handleNewMessage);
      socket.off('node-message', handleNodeMessage);
      socket.off('error');
    };
  }, [selectedContact?.phone, businessPhoneNumberId]);

  const handleSend = async () => {
    if (!selectedContact || !messageTemplates[selectedContact.id]) {
      toast.error('Please select a contact and enter a message');
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
            `${whatsappURL}/send-message`,
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
       axiosInstance.post(
          `${whatsappURL}/send-message`,
          {
            phoneNumbers: [phoneNumber],
            message: newMessage.content,
            business_phone_number_id: businessPhoneNumberId,
            messageType: "text",
          }
        );
      }

      setMessageTemplates(prevTemplates => ({
        ...prevTemplates,
        [selectedContact.id]: ''
      }));
      
      // Add success toast
      toast.success("Message sent successfully");
    } catch (error) {
      // Add error toast with specific error message
      toast.error(`Failed to send message: ${error.response?.data?.message || error.message || 'Unknown error'}`);
    //  console.error('Error sending message:', error);
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

    
  const fetchConversation = useCallback(async (contactId, page = 1, append = false, signal) => {
    try {
      setIsLoadingMore(append);
      
      // Check if this is a dummy contact by checking the phone number
      const isDummyContact = DUMMY_CONTACTS.some(contact => contact.phone === contactId);
      
      if (isDummyContact) {
        // Find the dummy contact and its corresponding conversations
        const dummyContact = DUMMY_CONTACTS.find(contact => contact.phone === contactId);
        if (dummyContact) {
          const dummyConversation = DUMMY_CONVERSATIONS[dummyContact.id] || [];
          setConversation(prev => append ? [...prev, ...dummyConversation] : dummyConversation);
          setHasMoreMessages(false);
          setCurrentMessagePage(1);
          setLastUpdateType(append ? 'append' : 'new');
          return;
        }
      }
  
      // Only proceed with API call if it's not a dummy contact
      if (!contactId || !businessPhoneNumberId) return;
  
      const container = messagesContainerRef.current;
      const prevScrollInfo = append && container ? {
        height: container.scrollHeight,
        top: container.scrollTop
      } : null;
  
      const response = await axiosInstance.get(
        `/whatsapp_convo_get/${contactId}`,
        {
          baseURL: fastURL,
          headers: { 'X-Tenant-Id': tenantId },
          params: {
            source: 'whatsapp',
            bpid: businessPhoneNumberId.toString(),
            page_no: page
          },
          signal
        }
      );
  
      const data = response.data.conversations || [];
      const serverPage = response.data.page_no;
      const totalPages = response.data.total_pages;
  
      const hasMore = serverPage < totalPages;
      setHasMoreMessages(hasMore);
      setCurrentMessagePage(serverPage);
  
      setConversation(prev => {
        const updated = append ? [...data, ...prev] : data;
        
        if (append && container && prevScrollInfo) {
          requestAnimationFrame(() => {
            const newHeight = container.scrollHeight;
            container.scrollTop = newHeight - prevScrollInfo.height;
          });
        }
        return updated;
      });
  
    } catch (error) {
      if (!axios.isCancel(error)) {
        // Only show error toast for non-dummy contacts
        if (!DUMMY_CONTACTS.some(contact => contact.phone === contactId)) {
          console.error('Fetch conversation error:', error);
          toast.error('Failed to load messages');
        }
      }
    } finally {
      setIsLoadingMore(false);
    }
  }, [businessPhoneNumberId, tenantId]);
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;
  
    if (lastUpdateType === 'new') {
      setTimeout(() => {
        messageEndRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest'
        });
      }, 100);
      setLastUpdateType(null);
    }
  }, [conversation, lastUpdateType]);
  useEffect(() => {
    const contactID = getContactIDfromURL();
    if (contactID && contacts.length > 0 && businessPhoneNumberId) {
      const contact = contacts.find(c => c.id === parseInt(contactID));
      if (contact) {
        if (!selectedContact || selectedContact.id !== contact.id) {
          setConversation([]); // Reset conversation state
          setSelectedContact(contact);
        }
        fetchConversation(contact.phone);
      }
    }
  }, [contacts, selectedContact?.id, businessPhoneNumberId, fetchConversation]);
  useEffect(() => {
    if (selectedContact?.phone && businessPhoneNumberId && !isSocketUpdate.current) {
      const controller = new AbortController();
      fetchConversation(selectedContact.phone, 1, false, controller.signal);
      return () => controller.abort();
    }
    // Reset the flag after the effect runs
    isSocketUpdate.current = false;
  }, [selectedContact?.phone, businessPhoneNumberId]);
  const addInputField = () => {
    setInputFields([...inputFields, { value: '' }]);
  };

  const deleteInputField = (index) => {
    const newInputFields = inputFields.filter((_, i) => i !== index);
    setInputFields(newInputFields);
  };
    
  
  useEffect(() => {
    setConversation(['']);
    setNewMessages(['']);
    //console.log("selected contact 3:", selectedContact)
    
    if(selectedContact){
    fetchConversation(selectedContact.phone);}
  }, [selectedContact]);

  const [isLoading, setIsLoading] = useState(false);
  const handleLoadMore = () => {
    if (currentMessagePage > totalPages) {
      setHasMoreMessages(false); // Explicitly disable loading
      return;
    }
    setLastUpdateType('append');
    fetchConversation(selectedContact.phone, currentMessagePage + 1, true);
  };
  const handleContactSelection = async (contact) => {
    try {
      setIsLoading(true);
      setConversation([]); // Clear messages immediately
      setCurrentMessagePage(1);
      setHasMoreMessages(true);
  
      navigate({ search: `?id=${contact.id}` }, { replace: true });
      setSelectedContact(contact);
      
      // Update unread count
      setContacts(prev => prev.map(c => 
        c.id === contact.id ? { ...c, unreadCount: 0 } : c
      ));
  
      // Check if it's a dummy contact
      const isDummyContact = DUMMY_CONTACTS.some(dc => dc.phone === contact.phone);
      if (isDummyContact) {
        const dummyContact = DUMMY_CONTACTS.find(dc => dc.phone === contact.phone);
        setConversation(DUMMY_CONVERSATIONS[dummyContact.id] || []);
        setIsLoading(false);
      } else {
        await fetchConversation(contact.phone);
      }
  
    } catch (error) {
      console.error('Contact selection failed:', error);
    } finally {
      setIsLoading(false);
    }
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

  const handleUpload = async () => {
    if (!file) {
      setUploadStatus('Please select a file to upload.');
      return;
    }

    setIsUploading(true);
    setUploadStatus('Uploading...');

    const jsonData = {};
    inputFields.forEach((field, index) => {
      jsonData[`description_${index}`] = field.value;
    });

    const formData = new FormData();
    formData.append('file', file);
    formData.append('jsonData', JSON.stringify(jsonData));

    try {
      const response = await axiosInstance.post('/upload/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setUploadStatus('File uploaded successfully!');
    } catch (error) {
    //  console.error('Error uploading file:', error);
      setUploadStatus('Error uploading file. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };
    
  const fetchFlows = async () => {
    try {
      const response = await axiosInstance.get(`${fastURL}/node-templates/`, {
        headers: { token: localStorage.getItem('token') },
      });
      // Ensure each flow has an id property
      const flowsWithIds = response.data.map(flow => ({
        ...flow,
        id: flow.id.toString() // Ensure id is a string for consistency
      }));
      setFlows(flowsWithIds);
      //console.log('Fetched flows:', flowsWithIds);
    } catch (error) {
    //  console.error("Error fetching flows:", error);
    }
  };

  useEffect(() => {
    fetchFlows();
  }, []);

  const handleFlowChange = (event) => {
    const selectedValue = event.target.value;
   // console.log("Selected flow ID:", selectedValue);
    setSelectedFlow(selectedValue);
    const selectedFlowData = flows.find(flow => flow.id === selectedValue);
   // console.log("Selected flow data:", selectedFlowData);
  };
    
  useEffect(() => {
  //  console.log("Selected flow has changed:", selectedFlow);
  }, [selectedFlow]);

  const [isSending, setIsSending] = useState(false);

  const handleSendFlowData = async () => {
    if (!selectedFlow) {
    //  console.error('No flow selected');
      return;
    }

    try {
     // console.log("FLOW ID: ", selectedFlow)
      setIsSending(true);
      const dataToSend = {
        node_template_id: selectedFlow
      };
    
     // console.log('Sending flow data:', dataToSend);
    
      // First POST request to insert data
      const insertResponse = await axiosInstance.post(
        `${djangoURL}/insert-data/`,
        dataToSend,
        {
          headers: {
            'Content-Type': 'application/json',
            token: localStorage.getItem('token'),
          },
        }
      );
    
     // console.log('Flow data sent successfully:', insertResponse.data);
    
      // Check if the first request is successful
      if (insertResponse.status === 200) {
        // Second POST request to reset the session
        const resetSessionResponse = await axiosInstance.post(
          `${whatsappURL}/reset-session`,
          { business_phone_number_id: businessPhoneNumberId },
          {
            headers: {
              'Content-Type': 'application/json',
              token: localStorage.getItem('token'),
            },
          }
        );
    
     //   console.log('Session reset successfully:', resetSessionResponse.data);
    
        if (resetSessionResponse.status === 200) {
     //     console.log(`Session deleted successfully for ${businessPhoneNumberId}`);
        }
      }
    
    } catch (error) {
    //  console.error('Error occurred:', error);
    } finally {
      setIsSending(false);
    }
  };
    
    

  const handleNewChat = async () => {
  if (!newPhoneNumber.trim()) return;

  try {
  const response = await axiosInstance.post(`${djangoURL}/contacts/`, {
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
 //console.error("Error creating new contact:", error);
  }
  };
  const [searchTerm, setSearchTerm] = useState('');

  // Filtered and prioritized contacts based on search term
  const filteredContacts = useMemo(() => {
    if (!searchTerm) return contacts;
    
    const lowercasedSearch = searchTerm.toLowerCase();
    return contacts.filter(contact => 
      contact.name?.toLowerCase().includes(lowercasedSearch) ||
      contact.phone?.toLowerCase().includes(lowercasedSearch)
    );
  }, [contacts, searchTerm])
  const [showContactsDrawer, setShowContactsDrawer] = useState(false);
const [visibleMessages, setVisibleMessages] = useState([]);

const [currentPage, setCurrentPage] = useState(1);
const MESSAGES_PER_PAGE = 10;

// New function to load messages with pagination
const loadMessages = useCallback(() => {
  if (!selectedContact) return;

  const startIndex = Math.max(0, conversation.length - (currentPage * MESSAGES_PER_PAGE));
  const endIndex = conversation.length - ((currentPage - 1) * MESSAGES_PER_PAGE);
  
  const loadedMessages = conversation.slice(startIndex, endIndex);
  
  setVisibleMessages(prevMessages => [...loadedMessages, ...prevMessages]);
  setHasMoreMessages(startIndex > 0);
}, [conversation, currentPage, selectedContact]);

// Function to load more messages
const loadMoreMessages = useCallback(() => {
  setCurrentPage(prevPage => prevPage + 1);
}, []);

// Effect to load initial messages or reload when contact changes
useEffect(() => {
  if (selectedContact) {
  
    setVisibleMessages([]);
    setHasMoreMessages(true);
    loadMessages();
  }
}, [selectedContact, loadMessages]);

// Effect to load messages when current page changes
useEffect(() => {
  loadMessages();
}, [currentPage, loadMessages]);
const [inputPage, setInputPage] = useState(currentPage);

const handleNextPage = () => {
  if (currentPage < totalPages) {
    fetchContacts(currentPage + 1);
  }
};

const handlePreviousPage = () => {
  if (currentPage > 1) {
    fetchContacts(currentPage - 1);
  }
};

const handleGoToPage = (pageNumber) => {
  if (pageNumber >= 1 && pageNumber <= totalPages) {
    fetchContacts(pageNumber);
  }
};
function renderMessageWithNewLines(text) {
  try {
    // Ensure text is properly escaped for JSON.parse
    const sanitizedText = text.replace(/\\/g, "\\\\");
    
    // Decode Unicode escape sequences
    const decodedText = JSON.parse(`"${sanitizedText}"`);
    
    // Split by \n and render with line breaks
    return decodedText.split('\n').map((line, index) => ( 
      <React.Fragment key={index}>
        {line}
        <br />
      </React.Fragment>
    ));
  } catch (error) {
   // console.error("Failed to render message:", error);
    return <div>Error rendering message</div>;
  }
}



  return (
 <div
  className={`${
    authenticated ? "" : "mt-[60px]"
  } `}
>
   <div className="md:hidden">
   <div className="mobile-chat-container flex flex-col h-screen">
  {/* Sliding Contacts Drawer */}
  <div className={`contacts-drawer fixed inset-0 z-50 transform transition-transform duration-300 ${
    showContactsDrawer ? 'translate-x-0' : '-translate-x-full'
  } bg-white w-full h-full overflow-hidden`} style={{zIndex:'201'}}>
    <div className="contacts-header flex items-center justify-between p-4 border-b">
      <h2 className="text-xl font-semibold">Contacts</h2>
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={() => setShowContactsDrawer(false)}
      >
        <X /> {/* Close icon */}
      </Button>
    </div>

    {/* Search Input */}
    <div className="p-4 border-b">
      <div className="relative">
      <Search 
  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
  size={20} 
  onClick={handlePhoneSearch}
/>
        <Input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search contacts"
          className="w-full pl-10"
        />
        
      </div>
    </div>
{/* Pagination Div */}
{/* Pagination Div */}
<div className="flex justify-center items-center space-x-2 p-4 border-t">
  <button 
    onClick={handlePreviousPage}
    disabled={currentPage === 1}
    className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-50"
  >
    <ChevronLeft size={20} className="text-gray-600" />
  </button>
  
  <div className="flex items-center space-x-2">
    <input 
      type="number" 
      value={currentPage}
      onClick={(e) => e.target.select()}
      onChange={(e) => {
        const page = parseInt(e.target.value);
        if (!isNaN(page)) {
          setCurrentPage(page);
          handleGoToPage(page);
        }
      }}
      min="1"
      max={totalPages}
      className="w-16 text-center border rounded py-1 px-2"
    />
    <span className="text-gray-500">of {totalPages}</span>
  </div>
  
  <button 
    onClick={handleNextPage}
    disabled={currentPage === totalPages}
    className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-50"
  >
    <ChevronRight size={20} className="text-gray-600" />
  </button>
</div>
    {/* Contact List */}
    <div className="contacts-list overflow-y-auto max-h-[calc(100vh-150px)]">
      {filteredContacts.length > 0 ? (
        
        <div className="divide-y">
          
          {filteredContacts
            .sort((a, b) => {
              // Previous sorting logic remains the same
              // ... (keep the existing sorting logic)
            })
            .map((contact) => (
              <div
                key={contact.id || contact.phone}
                className={`p-4 hover:bg-gray-100 cursor-pointer flex justify-between items-center ${
                  selectedContact?.phone === contact.phone ? 'bg-blue-50' : ''
                }`}
                onClick={() => {
                  handleContactSelection(contact);
                  setShowContactsDrawer(false);
                }}
              >
                <div>
                  <p className="font-semibold">{contact.name || 'Unknown Name'}</p>
                  <p className="text-sm text-gray-500">{contact.phone || 'No Phone'}</p>
                </div>
                {contact.unreadCount > 0 && (
                  <span className="bg-blue-500 text-white rounded-full px-2 py-1 text-xs">
                    {contact.unreadCount}
                  </span>
                )}
              </div>
            ))
          }
        </div>
      ) : (
        <div className="p-4 text-center text-gray-500">No contacts found</div>
      )}
    </div>
  </div>

  {/* Main Chat Interface */}
  <div className="cb-main flex-grow relative">
    {/* Chat Header with Contact Selector */}
    {selectedContact ? (
      <div className="cb-chat-header flex justify-between items-center p-4 border-b">
        <div 
          className="flex items-center cursor-pointer"
          onClick={() => setShowContactsDrawer(true)}
        >
          {profileImage && typeof profileImage === 'string' ? (
            <img src={profileImage} alt="Profile" className="w-10 h-10 rounded-full mr-3" />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center mr-3">
              {getInitials(selectedContact.name, selectedContact.last_name)}
            </div>
          )}
          <div>
            <span className="font-semibold">{selectedContact.name} {selectedContact.last_name}</span>
            <span className="block text-xs text-gray-500">{selectedContact.phone}</span>
          </div>
        </div>
        <ChevronRight onClick={() => setShowContactsDrawer(true)} className="text-gray-500" />
      </div>
    ) : (
      <div className="p-4 text-center text-gray-500">
        <Button onClick={() => setShowContactsDrawer(true)}>
          Select a Contact
        </Button>
      </div>
    )}

    {/* Pagination and Load More */}
    {selectedContact && visibleMessages.length > 0 && (
     <div className="load-more-container top-0 z-10 bg-white p-2 text-center">
       {hasMoreMessages && (
  <Button 
    variant="outline"
    onClick={() => fetchConversation(
      selectedContact.phone, 
      currentMessagePage + 1, 
      true
    )}
    disabled={!hasMoreMessages || isLoadingMore}
  >
    {isLoadingMore ? 'Loading...' : 'Load Earlier Messages'}
  </Button>
)}
      </div>
    )}

    {/* Message Container with Limited Messages */}
    <div className="cb-message-container overflow-y-auto flex-grow relative">
  {isLoading && (
    <div className="absolute inset-0 flex items-center justify-center z-50 bg-white bg-opacity-75">
      <div className="spinner border-4 border-blue-500 border-t-transparent rounded-full w-12 h-12 animate-spin"></div>
    </div>
  )}
  {visibleMessages.map((message, index) => (
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
              return renderInteractiveMessage(parsedMessage);
            } catch (e) {
            //  console.error('Failed to parse message', e);
              return <div className="error">Failed to parse message</div>;
            }
          }
          return message.text || <div className="error">Message content is undefined</div>;
        }
        return <div className="error">null</div>;
      })()}
    </div>
  ))}
  <div ref={messageEndRef} />
</div>

    {/* Message Input Container */}
    <div
  className="cb-input-container sticky bottom-0 bg-white p-2 border-t flex flex-col md:flex-row items-end md:items-center"
  style={{ zIndex: '200' }}
>
  <div className="cb-input-actions flex items-center gap-2 w-full">
    <EmojiEmotionsIcon
      className="cb-action-icon"
      onClick={handleToggleSmileys}
    />
    <input
      type="file"
      accept="image/*"
      style={{ display: 'none' }}
      onChange={handleFileSelect}
      ref={fileInputRef}
    />
    <AttachFileIcon
      className="cb-action-icon"
      onClick={() => fileInputRef.current.click()}
    />
    <textarea
      value={(selectedContact && messageTemplates[selectedContact.id]) || ''}
      onChange={(e) => {
        if (selectedContact) {
          setMessageTemplates((prevTemplates) => ({
            ...prevTemplates,
            [selectedContact.id]: e.target.value,
          }));
        }
      }}
      placeholder="Type a message"
      className="cb-input-field flex-grow resize-none bg-gray-100 rounded-md p-2 border outline-none focus:ring-2 focus:ring-primary"
      rows={1}
    />
    <SendIcon className="cb-send-icon text-primary cursor-pointer" onClick={handleSend} />
  </div>

  {showSmileys && (
    <div className="cb-emoji-picker mt-2">
      <Picker onEmojiClick={handleSelectSmiley} />
    </div>
  )}
</div>

  </div>
</div>
      </div>
    <div className="hidden md:block">
     {isLoading && <FullPageLoader />}
     {authPopupp && <AuthPopup onClose={handleCloseAuthPopupp} />}
      <div className={`${showPopup ? 'filter blur-lg' : ''}`}>
        <div className="cb-container flex">
          {/* Contact List - Fixed width of 300px */}
          <Card className="w-[300px] border-r overflow-hidden">
            <CardHeader className="border-b p-4 flex flex-row items-center justify-between">
              <CardTitle>Contacts</CardTitle>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setShowNewChatInput(!showNewChatInput)}
              >
                <Plus />
              </Button>
            </CardHeader>
            
            <div className="p-4 border-b">
        <div className="relative">
        <Search 
  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
  size={20} 
  onClick={handlePhoneSearch}
/>
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search contacts"
            className="w-full pl-10"
          />
        </div>
      </div>
      
      {showNewChatInput && (
        <div className="p-4 border-b">
          <Input
            value={newPhoneNumber}
            onChange={(e) => setNewPhoneNumber(e.target.value)}
            placeholder="Enter phone number"
             className="w-full mb-2 border-blue-500 ring-2 ring-blue-200 focus:ring-blue-500"
          />
          <Button onClick={handleNewChat} className="w-full">
            Start New Chat
          </Button>
        </div>
      )}
      <div className="flex justify-center items-center space-x-2 p-4 border-t">
  <button 
    onClick={handlePreviousPage}
    disabled={currentPage === 1}
    className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-50"
  >
    <ChevronLeft size={20} className="text-gray-600" />
  </button>
  
  <div className="flex items-center space-x-2">
    <input 
      type="number" 
      value={currentPage}
      onClick={(e) => e.target.select()}
      onChange={(e) => {
        const page = parseInt(e.target.value);
        if (!isNaN(page)) {
          setCurrentPage(page);
          handleGoToPage(page);
        }
      }}
      min="1"
      max={totalPages}
      className="w-16 text-center border rounded py-1 px-2"
    />
    <span className="text-gray-500">of {totalPages}</span>
  </div>
  
  <button 
    onClick={handleNextPage}
    disabled={currentPage === totalPages}
    className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-50"
  >
    <ChevronRight size={20} className="text-gray-600" />
  </button>
</div>
      {/* Contact List */}
      <CardContent className="custom-scrollbar p-0 overflow-y-auto max-h-[calc(100vh-250px)]">
  <div className="divide-y">
    {filteredContacts.length > 0 ? (
      filteredContacts
        .sort((a, b) => {
          // Priority order of interaction
          const interactionPriority = [
            'last_replied',
            'last_seen',
            'last_delivered',
            'no_interaction'
          ];

          // Determine interaction status for each contact
          const getInteractionStatus = (contact) => {
            if (contact.last_replied) return 'last_replied';
            if (contact.last_seen) return 'last_seen';
            if (contact.last_delivered) return 'last_delivered';
            return 'no_interaction';
          };

          const aStatus = getInteractionStatus(a);
          const bStatus = getInteractionStatus(b);

          // First, sort by interaction priority
          const priorityDiff = interactionPriority.indexOf(aStatus) - 
                                interactionPriority.indexOf(bStatus);
          if (priorityDiff !== 0) return priorityDiff;

          // If same interaction status, sort by timestamp within that status
          switch (aStatus) {
            case 'last_replied':
              return new Date(b.last_replied).getTime() - 
                     new Date(a.last_replied).getTime();
            case 'last_seen':
              return new Date(b.last_seen).getTime() - 
                     new Date(a.last_seen).getTime();
            case 'last_delivered':
              return new Date(b.last_delivered).getTime() - 
                     new Date(a.last_delivered).getTime();
            default:
              // For no interaction, sort by unread count
              return (b.unreadCount || 0) - (a.unreadCount || 0);
          }
        })
        .map((contact) => (
          <div
            key={contact.id || contact.phone}
            className={`p-4 hover:bg-gray-100 cursor-pointer flex justify-between items-center ${
              selectedContact?.phone === contact.phone ? 'bg-blue-50' : ''
            }`}
            onClick={() => handleContactSelection(contact)}
          >
            <div>
              <p className="font-semibold">{contact.name || 'Unknown Name'}</p>
              <p className="text-sm text-gray-500">{contact.phone || 'No Phone'}</p>
              {/* Optional: Add interaction status hint */}
              <p className="text-xs text-gray-400">
                {contact.last_replied ? 'Replied' :
                 contact.last_seen ? 'Seen' :
                 contact.last_delivered ? 'Delivered' :
                 'No Interaction'}
              </p>
            </div>
            {contact.unreadCount > 0 && (
              <span className="bg-blue-500 text-white rounded-full px-2 py-1 text-xs">
                {contact.unreadCount}
              </span>
            )}
          </div>
        ))
    ) : (
      <div className="p-4 text-center text-gray-500">No contacts found</div>
    )}
  </div>
</CardContent>
          </Card>
          <div className="cb-main flex-grow">
    {selectedContact && (
  <div className="cb-chat-header">
  {selectedContact && (
  <div className="cb-chat-contact-info">
  {profileImage && typeof profileImage === 'string' ? (
    <img src={profileImage} alt="Profile" className="cb-profile-icon" />
  ) : (
    <div className={`cb-default-avatar`}>
      {getInitials(selectedContact.name, selectedContact.last_name)}
    </div>
  )}
  <div className="cb-contact-details">
    <span className="cb-contact-name">{selectedContact.name} {selectedContact.last_name}</span>
    <span className="cb-contact-phone">{selectedContact.phone}</span>
  </div>
  </div>
  )}

  </div>
  )}
 <div className="cb-message-container" ref={messagesContainerRef}>
  {showLoadMoreButton && hasMoreMessages && (
    <div className="sticky top-0 bg-white z-10 p-2 text-center">
      <Button 
        variant="outline"
        onClick={handleLoadMore}
        disabled={isLoadingMore}
      >
        {isLoadingMore ? 'Loading...' : 'Load Earlier Messages'}
      </Button>
    </div>
  )}

  {conversation.length > 0 ? (
  conversation.map((message) => (
    <TooltipProvider key={message.id}>
      <Tooltip>
        <TooltipTrigger asChild>
          <div 
            className={`cb-message ${message.sender === 'user' ? 'cb-user-message' : 'cb-bot-message'}`} 
            data-message-id={message.id}
          > 
            {(() => { 
              if (typeof message.text === 'string') { 
                if (message.text.trim().startsWith('{') || message.text.trim().startsWith('[')) { 
                  try { 
                    const fixedMessage = fixJsonString(message.text); 
                    const parsedMessage = JSON.parse(fixedMessage); 
                    return renderInteractiveMessage(parsedMessage); 
                  } catch (e) { 
                  //  console.error('Failed to parse message', e); 
                    return <div className="error">Failed to parse message</div>; 
                  } 
                } 
                return renderMessageWithNewLines(message.text); 
              } 
              if (typeof message.text === 'object' && message.text !== null) { 
                return renderMessageContent(message); 
              } 
              return null; 
            })()} 
          </div>
        </TooltipTrigger>
        <TooltipContent 
          className="bg-gray-800 text-white px-3 py-1.5 rounded shadow-lg"
          sideOffset={5}
        >
          {(() => {
            try {
              return format(new Date(message.time), 'MMM d, yyyy h:mm a');
            } catch (e) {
            //  console.error('Failed to parse time:', message.time);
              return 'Invalid date';
            }
          })()}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ))
  ) : (
    <div className="no-messages-placeholder">
      {isLoading ? (
        <div className="loading-messages">
          Loading messages...
        </div>
      ) : selectedContact ? (
        'No messages found'
      ) : (
        'Please select a contact'
      )}
    </div>
  )}
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
    onKeyDown={(e) => {
      if (e.key === 'Enter' && !e.shiftKey) { // Send on Enter, ignore if Shift+Enter
        e.preventDefault(); // Prevent new line from being added
        handleSend();
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
    <Card className="w-[350px]">
      <Tabs defaultValue="contact">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="contact">Contact</TabsTrigger>
          <TabsTrigger value="ai-actions">AI Actions</TabsTrigger>
        </TabsList>
        
        {/* Contact Details Tab */}
        <TabsContent value="contact">
          <CardContent className="space-y-4">
            {selectedContact && (
              <>
                <div className="flex flex-col items-center">
                  {profileImage && typeof profileImage === 'string' ? (
                    <img 
                      src={profileImage} 
                      alt="Profile" 
                      className="w-24 h-24 rounded-full mb-4"
                    />
                  ) : (
                    <div className="w-24 h-24 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-3xl mb-4">
                      {getInitials(selectedContact.name, selectedContact.last_name)}
                    </div>
                  )}
                  <h2 className="text-xl font-semibold">
                    {selectedContact.name} {selectedContact.last_name}
                  </h2>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Phone className="text-gray-500" size={20} />
                    <span>{selectedContact.phone}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Mail className="text-gray-500" size={20} />
                    <span>{selectedContact.email}</span>
                  </div>
                </div>
              </>
            )}

            {/* Flow Selection */}
            <div className="space-y-2">
              <Select 
                value={selectedFlow} 
                onValueChange={setSelectedFlow}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a flow" />
                </SelectTrigger>
                <SelectContent>
                  {flows.map(flow => (
                    <SelectItem key={flow.id} value={flow.id}>
                      {flow.name || flow.id}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button 
                className="w-full" 
                onClick={handleSendFlowData} 
                disabled={isSending}
              >
                {isSending ? "Sending..." : "Send Flow Data"}
              </Button>
            </div>
          </CardContent>
        </TabsContent>

        {/* AI Actions Tab */}
        <TabsContent value="ai-actions">
          <CardContent className="space-y-4">
            <Input 
              type="file" 
              onChange={handleFileChange}
              className="mb-4"
            />
            
            <div className="space-y-2">
              {inputFields.map((field, index) => (
                <div key={index} className="flex space-x-2">
                  <Input 
                    value={field.value}
                    onChange={(e) => handleInputChange(index, e)}
                    placeholder="Enter content description" 
                    className="flex-1"
                  />
                  <Button 
                    variant="destructive" 
                    size="icon"
                    onClick={() => deleteInputField(index)}
                  >
                    <X />
                  </Button>
                </div>
              ))}
              
              <Button 
                variant="secondary" 
                className="w-full"
                onClick={addInputField}
              >
                <Plus className="mr-2" /> Add Description
              </Button>
              
              <Button 
                className="w-full" 
                onClick={handleUpload}
                disabled={isUploading}
              >
                {isUploading ? 'Uploading...' : 'Upload'}
              </Button>
              
              {uploadStatus && (
                <p className={uploadStatus.includes('Error') ? 'text-red-500' : 'text-green-500'}>
                  {uploadStatus}
                </p>
              )}
            </div>
          </CardContent>
        </TabsContent>
      </Tabs>
    </Card>
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
  </div>
  );
};

export default Chatbot;