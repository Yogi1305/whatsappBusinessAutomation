import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { PopupButton } from 'react-calendly';
import { motion } from 'framer-motion';
import { 
  NavigationMenu, 
  NavigationMenuItem, 
  NavigationMenuLink, 
  NavigationMenuList,
  navigationMenuTriggerStyle 
} from "@/components/ui/navigation-menu";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger,
  SheetClose 
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { 
  Workflow,
  MessageSquare, 
  LayoutGrid, 
  Contact, 
  Megaphone, 
  Bell, 
  UserCircle2, 
  LogOut, 
  MenuIcon,
  Loader2,
  Calendar,
  X,
  CreditCard,
  AlertCircle,
  Check
} from "lucide-react";
import { useAuth } from './authContext';
import logo from "./assets/logo.webp";
import io from 'socket.io-client';
import axiosInstance from './api';
import { fastURL } from './api.jsx';
import { clearChatCache, updateContactUnreadCount, getAllContactUnreadCounts } from './indexedDBUtils.js';
import debounce from 'lodash/debounce'; // New import for debouncing

export const whatsappURL = 'https://whatsappbotserver.azurewebsites.net';
//export const whatsappURL = 'http://localhost:8080';

const socket = io(whatsappURL);

// WhatsApp Setup Marquee Component
const WhatsAppSetupMarquee = ({ businessPhoneNumberId, handleRedirect, authenticated }) => {
  const [showBanner, setShowBanner] = useState(false);
  
  useEffect(() => {
    // Only start the timer if authenticated and no businessPhoneNumberId
    if (authenticated && !businessPhoneNumberId) {
      const timer = setTimeout(() => {
        setShowBanner(true);
      }, 3000); // 2 second delay
      
      // Clean up the timer on unmount or when dependencies change
      return () => clearTimeout(timer);
    } else {
      // Reset the banner state if conditions are no longer met
      setShowBanner(false);
    }
  }, [authenticated, businessPhoneNumberId]);

  // Only render the banner if showBanner is true
  if (!showBanner) {
    return null;
  }

  return (
    <div className="bg-red-500 text-black h-12 text-center relative overflow-hidden border-b z-50 cursor-pointer" onClick={handleRedirect}>
      <div className="absolute inset-0 bg-[linear-gradient(rgba(245,158,11,0.1)_1px,transparent_1px)] bg-[size:32px_32px] opacity-20" />
      
      <motion.div
        className="flex items-center absolute whitespace-nowrap h-full"
        animate={{
          x: ["100%", "-100%"],
        }}
        transition={{
          x: {
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }
        }}
      >
        <div className="flex items-center space-x-12 px-4">
          <span className="text-amber-950 text-sm font-medium flex items-center">
            <AlertCircle className="w-4 h-4 mr-2 text-amber-800" />
            Important: Your WhatsApp Business account is not set up. Set up now to start messaging!
          </span>
          
          <Button 
            onClick={handleRedirect}
            className="bg-red-900 hover:bg-amber-800 text-white px-3 py-1 rounded-full text-sm font-medium transition-colors"
          >
            Set Up WhatsApp
          </Button>
          
          <span className="text-amber-950 text-sm font-medium flex items-center">
            <AlertCircle className="w-4 h-4 mr-2 text-amber-800" />
            Important: Your WhatsApp Business account is not set up. Set up now to start messaging!
          </span>
        </div>
      </motion.div>
    </div>
  );
};

const Navbar = () => {
  const { authenticated, logout, tenantId } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLogouting, setIsLogouting] = useState(false);
  const location = useLocation();
  const [accountId, setAccountId] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [businessPhoneNumberId, setBusinessPhoneNumberId] = useState('');
  const navigate = useNavigate();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // New refs for improved notification handling
  const contactsCache = useRef({}); // phoneNumber -> contactId mapping
  const notificationQueue = useRef([]);
  const socketConnected = useRef(false);
  
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';
  
  // Create a debounced function for processing notifications
  const processNotificationQueue = useCallback(
    debounce(async () => {
      if (notificationQueue.current.length === 0) return;
      
      // console.log(`Processing ${notificationQueue.current.length} queued notifications`);
      
      // Group notifications by contact phone
      const phoneToNotifications = {};
      notificationQueue.current.forEach(notification => {
        if (!notification.contactPhone) return;
        
        if (!phoneToNotifications[notification.contactPhone]) {
          phoneToNotifications[notification.contactPhone] = [];
        }
        phoneToNotifications[notification.contactPhone].push(notification);
      });
      
      // Process each contact's notifications
      for (const [phone, phoneNotifications] of Object.entries(phoneToNotifications)) {
        try {
          // Get contact ID (from cache or API)
          let contactId = contactsCache.current[phone];
          
          if (!contactId) {
            // Find contact ID for this phone number
            try {
              const response = await axiosInstance.get(`${fastURL}/contacts/${0}?phone=${phone}`);
              if (response.data.contacts && response.data.contacts.length > 0) {
                contactId = response.data.contacts[0].id.toString();
                // Cache the contact ID for future use
                contactsCache.current[phone] = contactId;
              }
            } catch (error) {
              console.error(`Error finding contact ID for phone ${phone}:`, error);
              continue; // Skip to next phone
            }
          }
          
          if (contactId) {
            // Get current unread count
            const counts = await getAllContactUnreadCounts();
            const currentCount = counts[contactId] || 0;
            const newCount = currentCount + phoneNotifications.length;
            
            // Update IndexedDB
            await updateContactUnreadCount(contactId, newCount);
            console.log(`Updated unread count for contact ${contactId} (${phone}) from ${currentCount} to ${newCount}`);
          }
        } catch (error) {
          console.error(`Error processing notifications for phone ${phone}:`, error);
        }
      }
      
      // Clear the queue
      notificationQueue.current = [];
    }, 500), // 500ms debounce time
    []
  );

   // Enhanced fetchNotifications function
   const fetchNotifications = useCallback(async () => {
    if (!authenticated || !tenantId) return;
    
    try {
      const response = await axiosInstance.get(`${fastURL}/notifications`, {
        headers: {
          'X-Tenant-ID': tenantId
        }
      });
      
      const fetchedNotifications = response.data.notifications || [];
      
      // Group notifications by contact_id to avoid duplicates
      const contactNotifications = {};
      
      // First pass: organize notifications by contact ID
      fetchedNotifications.forEach(notification => {
        if (notification.contact_id) {
          const contactId = notification.contact_id.toString();
          if (!contactNotifications[contactId]) {
            contactNotifications[contactId] = [];
          }
          contactNotifications[contactId].push(notification);
        }
      });
      
      // Keep only the most recent notification per contact
      const uniqueNotifications = Object.values(contactNotifications)
        .map(notifications => {
          // Sort by created_on date and take the most recent
          return notifications.sort((a, b) => 
            new Date(b.created_on) - new Date(a.created_on)
          )[0];
        });
      
      console.log(`Processed ${fetchedNotifications.length} notifications into ${uniqueNotifications.length} unique contacts`);
      
      // Update state with unique notifications
      setNotifications(uniqueNotifications);
      setUnreadCount(uniqueNotifications.length);
      
      // Process each unique contact's notification to update IndexedDB
      for (const notification of uniqueNotifications) {
        if (!notification.contact_id) continue;
        
        const contactId = notification.contact_id.toString();
        
        // Get current unread count from IndexedDB
        const counts = await getAllContactUnreadCounts();
        const currentCount = counts[contactId] || 0;
        
        // Don't increment if we already have a count for this contact
        // Just ensure there's at least 1 unread message
        const newCount = Math.max(1, currentCount);
        
        // Update IndexedDB - set the count to at least 1, but don't increment
        await updateContactUnreadCount(contactId, newCount);
      }
      
      // Dispatch event to update UI in other components
      window.dispatchEvent(new CustomEvent('notificationsUpdated'));
      
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  }, [authenticated, tenantId]);
  
  // Add this useEffect to listen for the refreshNotifications event
useEffect(() => {
  const handleRefreshNotifications = () => {
    console.log("Refreshing notifications from event");
    fetchNotifications();
  };

  // Add event listener
  window.addEventListener('refreshNotifications', handleRefreshNotifications);

  // Clean up
  return () => {
    window.removeEventListener('refreshNotifications', handleRefreshNotifications);
  };
}, [fetchNotifications]);



  useEffect(() => {
    const fetchBusinessPhoneId = async () => {
      try {
        const response = await axiosInstance.get(`${fastURL}/whatsapp_tenant/`, {
          headers: {
            'X-Tenant-ID': tenantId
          }
        });
        const whatsappData = response.data.whatsapp_data[0];
        setAccountId(whatsappData.business_account_id);
        setBusinessPhoneNumberId(whatsappData.business_phone_number_id);
        setAccessToken(whatsappData.access_token);
      } catch (error) {
        console.error('Error fetching business phone ID:', error);
      } finally {
        setLoading(false);
      }
    };

    if (authenticated && tenantId) {
      fetchBusinessPhoneId();
    } else {
      setLoading(false);
    }
  }, [tenantId, authenticated]);
  
 



 
  // Enhanced socket event handlers
  useEffect(() => {
    // Create a set to track which messages we've already processed
    const processedMessageIds = new Set();
  
    const handleNewSocketMessage = (message) => {
      if (!message || !message.phone_number_id || !businessPhoneNumberId) return;
      
      // Generate a unique ID for the message
      const messageId = message.id || `${message.contactPhone}-${Date.now()}`;
      
      // Skip if we've already processed this message
      if (processedMessageIds.has(messageId)) {
        console.log(`Skipping already processed message: ${messageId}`);
        return;
      }
      
      // Check if the message is for this business phone
      if (message.phone_number_id == businessPhoneNumberId) {
        console.log('Received socket message:', message);
        
        // Mark as processed
        processedMessageIds.add(messageId);
        
        // If we have a contact ID, use that directly
        if (message.contact_id) {
          // Update unread count for this contact
          updateContactUnreadCount(message.contact_id.toString(), 1).then(() => {
            console.log(`Updated unread count for contact ${message.contact_id}`);
          });
        }
        // If we only have a phone number, need to find the contact ID
        else if (message.contactPhone) {
          const messageContent = message.message?.text?.body || 
                             (message.message?.type === 'image' ? 'Sent an image' : 'New message');
          
          // First check our cache
          let contactId = contactsCache.current[message.contactPhone];
          
          if (contactId) {
            // We have the contact ID in cache, update unread count
            updateContactUnreadCount(contactId, 1).then(() => {
              console.log(`Updated unread count for contact ${contactId} (from cache)`);
            });
          } else {
            // Need to find the contact ID
            axiosInstance.get(`${fastURL}/contacts/${0}?phone=${message.contactPhone}`)
              .then(response => {
                if (response.data.contacts && response.data.contacts.length > 0) {
                  contactId = response.data.contacts[0].id.toString();
                  contactsCache.current[message.contactPhone] = contactId;
                  
                  return updateContactUnreadCount(contactId, 1);
                }
              })
              .then(() => {
                if (contactId) {
                  console.log(`Updated unread count for contact ${contactId} (looked up)`);
                }
              })
              .catch(error => {
                console.error(`Error finding/updating contact for ${message.contactPhone}:`, error);
              });
          }
        }
        
        // Refresh notifications from server
        fetchNotifications();
      }
    };
  
    socket.on('new-message', handleNewSocketMessage);
    socket.on('node-message', handleNewSocketMessage);
    
    // Socket connection event
    socket.on('connect', () => {
      console.log('Connected to notification socket');
      socketConnected.current = true;
      fetchNotifications(); // Refresh notifications when socket connects
    });
    
    socket.on('disconnect', () => {
      console.log('Disconnected from notification socket');
      socketConnected.current = false;
    });
  
    return () => {
      socket.off('new-message', handleNewSocketMessage);
      socket.off('node-message', handleNewSocketMessage);
      socket.off('connect');
      socket.off('disconnect');
    };
  }, [businessPhoneNumberId, fetchNotifications]);
  
  // Initial notifications fetch
  useEffect(() => {
    if (authenticated && tenantId) {
      fetchNotifications();
    }
  }, [tenantId, authenticated, fetchNotifications]);
// Add this useEffect to check for notifications on login
useEffect(() => {
  const checkForNewNotificationsOnLogin = async () => {
    if (authenticated && tenantId) {
      try {
        console.log("Checking for new notifications after login...");
        
        // Fetch notifications from server
        const response = await axiosInstance.get(`${fastURL}/notifications`, {
          headers: {
            'X-Tenant-ID': tenantId
          }
        });
        
        const fetchedNotifications = response.data.notifications || [];
        
        if (fetchedNotifications.length > 0) {
          console.log(`Found ${fetchedNotifications.length} notifications after login`);
          
          // Get already processed notification IDs from localStorage
          const processedIds = JSON.parse(localStorage.getItem('processedNotificationIds') || '[]');
          
          // Group notifications by contact_id to avoid duplicates
          const contactToNotifications = {};
          
          // First pass: organize notifications by contact ID or phone
          for (const notification of fetchedNotifications) {
            if (!notification.content) continue;
            
            let contactKey;
            
            // If notification has contact_id, use it directly
            if (notification.contact_id) {
              contactKey = `contact_${notification.contact_id}`;
            } else {
              // Extract phone number from notification content
              const match = notification.content.match(/(\d+)\s+\|\s+New meessage from/);
              if (!match || !match[1]) continue;
              
              const phone = match[1];
              contactKey = `phone_${phone}`;
              
              // Store additional info for later processing
              notification._extractedPhone = phone;
            }
            
            // Skip if this notification has already been processed
            if (processedIds.includes(notification.id.toString())) {
              console.log(`Skipping already processed notification ${notification.id}`);
              continue;
            }
            
            // Add to the contact's notification list
            if (!contactToNotifications[contactKey]) {
              contactToNotifications[contactKey] = [];
            }
            contactToNotifications[contactKey].push(notification);
          }
          
          console.log(`Grouped notifications into ${Object.keys(contactToNotifications).length} unique contacts`);
          
          // Process each contact's notifications (only count each contact once)
          const newProcessedIds = [];
          
          for (const [contactKey, notifications] of Object.entries(contactToNotifications)) {
            try {
              let contactId;
              
              // Check if this is a contact_id key
              if (contactKey.startsWith('contact_')) {
                contactId = contactKey.replace('contact_', '');
              } 
              // Otherwise, it's a phone key - need to look up the contact ID
              else if (contactKey.startsWith('phone_')) {
                const phone = contactKey.replace('phone_', '');
                
                // Check cache first
                contactId = contactsCache.current[phone];
                
                if (!contactId) {
                  // Find contact ID for this phone number
                  try {
                    const response = await axiosInstance.get(`${fastURL}/contacts/${0}?phone=${phone}`);
                    if (response.data.contacts && response.data.contacts.length > 0) {
                      contactId = response.data.contacts[0].id.toString();
                      // Cache the contact ID for future use
                      contactsCache.current[phone] = contactId;
                    }
                  } catch (error) {
                    console.error(`Error finding contact ID for phone ${phone}:`, error);
                    continue; // Skip to next contact
                  }
                }
              }
              
              if (contactId) {
                // Get current unread count
                const counts = await getAllContactUnreadCounts();
                const currentCount = counts[contactId] || 0;
                
                // Set the unread count to current + 1 (only increment once per contact)
                const newCount = currentCount + 1;
                
                // Update IndexedDB
                await updateContactUnreadCount(contactId, newCount);
                console.log(`Updated unread count for contact ${contactId} to ${newCount}`);
                
                // Mark all notifications for this contact as processed
                notifications.forEach(notification => {
                  newProcessedIds.push(notification.id.toString());
                });
              }
            } catch (error) {
              console.error(`Error processing notifications for contact ${contactKey}:`, error);
            }
          }
          
          // Update processed notification IDs in localStorage
          localStorage.setItem('processedNotificationIds', 
            JSON.stringify([...processedIds, ...newProcessedIds]));
          
          // Update the UI with all fetched notifications
          // (we still show all in the UI, but only count unique contacts for unread counts)
          setNotifications(fetchedNotifications);
          
          // Set unread count to the number of unique contacts with notifications
          setUnreadCount(Object.keys(contactToNotifications).length);
          
          // Dispatch an event to notify other components about updated notifications
          window.dispatchEvent(new CustomEvent('notificationsUpdated'));
        } else {
          console.log("No new notifications found after login");
          setNotifications([]);
          setUnreadCount(0);
        }
      } catch (error) {
        console.error('Error checking for notifications after login:', error);
      }
    }
  };

  checkForNewNotificationsOnLogin();
}, [authenticated, tenantId]);

  // Enhanced handlefindid function
  const handlefindid = async (contactId, id) => {
    try {
      if (!contactId) {
        console.error("Contact ID is missing");
        return;
      }
      
      // Convert to string to ensure consistency
      contactId = contactId.toString();
      
      console.log(`Processing contact ID: ${contactId}, notification ID: ${id}`);
      
      // Reset unread count in IndexedDB
      await updateContactUnreadCount(contactId, 0);
      console.log(`Reset unread count for contact ${contactId}`);
      
      // Remove notification
      if (id) {
        await removeNotification(id);
        console.log(`Removed notification ${id}`);
        
        // Also remove all other notifications for this contact
        const otherNotifications = notifications.filter(n => 
          n.contact_id && n.contact_id.toString() === contactId && n.id !== id
        );
        
        if (otherNotifications.length > 0) {
          console.log(`Removing ${otherNotifications.length} other notifications for contact ${contactId}`);
          
          for (const notification of otherNotifications) {
            await removeNotification(notification.id);
          }
        }
      }
      
      // Navigate to the chatbot with the contact ID
      navigate(`/${tenantId}/chatbot?id=${contactId}`);
  
      // Dispatch event to update UI in other components
      window.dispatchEvent(new CustomEvent('notificationsUpdated'));
  
      setTimeout(() => {
        window.location.reload();
      }, 100);
      
    } catch (error) {
      console.error("Error in handlefindid:", error);
    }
  };


  const removeNotification = async (id) => {
    try {
      await axiosInstance.delete(`${fastURL}/notifications/${id}`, {
        headers: {
          'X-Tenant-ID': tenantId
        }
      });
  
      setNotifications(prev => prev.filter(n => n.id !== id));
      setUnreadCount(prev => Math.max(0, prev - 1));
      
      // Dispatch event to update UI in other components
      window.dispatchEvent(new CustomEvent('notificationsUpdated'));
    } catch (error) {
      console.error('Error removing notification:', error);
    }
  }; 

  const clearAllNotifications = async () => {
    try {
      // API call to clear all notifications
      await axiosInstance.delete(`${fastURL}/notification/all`, {
        headers: {
          'X-Tenant-ID': tenantId
        }
      });
      
      // Update local state
      setNotifications([]);
      setUnreadCount(0);
    } catch (error) {
      console.error('Error clearing notifications:', error);
    }
  };

  const getPath = (path) => {
    if (authenticated) {
      return `/${tenantId}${path}`;
    } else {
      return path.startsWith('/demo') ? path : `/demo${path}`;
    }
  };

  const handleLogout = async() => {
    setIsLogouting(true);
    try {
      await clearChatCache();
      await axiosInstance.post('logout/');
      logout();
      const isMobile = window.innerWidth <= 768;
      window.location.href = isMobile ? '/login' : '/';
    } catch (error) {
      console.error('Logout failed', error);
      setIsLogouting(false);
    }
  };
  
  const handleRedirect = () => {
    window.location.href = 'https://www.facebook.com/v18.0/dialog/oauth?client_id=1546607802575879&redirect_uri=https%3A%2F%2Fnuren.ai%2Fchatbotredirect%2F&response_type=code&config_id=1573657073196264&state=pass-through%20value';
  };
  
  // Logout Loader Component
  const LogoutLoader = () => (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="flex flex-col items-center space-y-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="text-xl text-white">Logging out...</p>
      </div>
    </div>
  );

  const handlePaymentClick = (e) => {
    e.preventDefault();
    if (!authenticated) {
      navigate(`/login`);
      return;
    }
    navigate(`${tenantId}/payment`);
  };

  const NavLinks = () => {
    const linkBaseClasses = authenticated 
      ? "group flex items-center gap-2 hover:bg-primary/10 transition-all duration-300 px-3 py-2 rounded-md relative"
      : "group flex items-center gap-2 hover:bg-gray-800 transition-all duration-300 px-3 py-2 rounded-md relative";
  
    const iconClasses = authenticated
      ? "w-5 h-5 text-primary group-hover:scale-110 transition-transform"
      : "w-5 h-5 text-gray-300 group-hover:text-white transition-transform";
  
    const textClasses = authenticated
      ? "text-foreground group-hover:text-primary"
      : "text-gray-300 group-hover:text-white";
  
    const isActive = (path) => location.pathname === getPath(path);
  
    const navigationItems = (
      <NavigationMenuList className="flex flex-col mt-20 md:mt-0 md:flex-row md:items-center md:space-x-2 gap-y-2">
        {authenticated && (
          <>
            <NavigationMenuItem>
              <Link to={getPath('/contact')}>
                <NavigationMenuLink className={`${linkBaseClasses} ${isActive('/contact') ? 'text-primary font-semibold' : ''}`}>
                  <Contact className={`${iconClasses} ${isActive('/contact') ? 'text-primary scale-110' : ''}`} />
                  <span className={textClasses}>Contact</span>
                  {isActive('/contact') && (
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary animate-underline"></span>
                  )}
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link to={getPath('/broadcast')}>
                <NavigationMenuLink className={`${linkBaseClasses} ${isActive('/broadcast') ? 'text-primary font-semibold' : ''}`}>
                  <Megaphone className={`${iconClasses} ${isActive('/broadcast') ? 'text-primary scale-110' : ''}`} />
                  <span className={textClasses}>Broadcast</span>
                  {isActive('/broadcast') && (
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary animate-underline"></span>
                  )}
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link to={getPath('/scheduled-events')}>
                <NavigationMenuLink className={`${linkBaseClasses} ${isActive('/scheduled-events') ? 'text-primary font-semibold' : ''}`}>
                  <Calendar className={`${iconClasses} ${isActive('/scheduled-events') ? 'text-primary scale-110' : ''}`} />
                  <span className={textClasses}>Scheduled Messages</span>
                  {isActive('/scheduled-events') && (
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary animate-underline"></span>
                  )}
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          </>
        )}
        <NavigationMenuItem>
          <Link to={getPath('/chatbot')}>
            <NavigationMenuLink className={`${linkBaseClasses} ${isActive('/chatbot') ? 'text-primary font-semibold' : ''}`}>
              <MessageSquare className={`${iconClasses} ${isActive('/chatbot') ? 'text-primary scale-110' : ''}`} />
              <span className={textClasses}>Direct Chat</span>
              {isActive('/chatbot') && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary animate-underline"></span>
              )}
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem className="hidden md:block">
          <Link to={getPath('/flow-builder')}>
            <NavigationMenuLink className={`${linkBaseClasses} ${isActive('/flow-builder') ? 'text-primary font-semibold' : ''}`}>
              <Workflow className={`${iconClasses} ${isActive('/flow-builder') ? 'text-primary scale-110' : ''}`} />
              <span className={textClasses}>Flow Builder</span>
              {isActive('/flow-builder') && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary animate-underline"></span>
              )}
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem className="hidden md:block">
          <Link to={getPath('/catalog')}>
            <NavigationMenuLink className={`${linkBaseClasses} ${isActive('/catalog') ? 'text-primary font-semibold' : ''}`}>
              <LayoutGrid className={`${iconClasses} ${isActive('/catalog') ? 'text-primary scale-110' : ''}`} />
              <span className={textClasses}>Catalog</span>
              {isActive('/catalog') && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary animate-underline"></span>
              )}
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
      </NavigationMenuList>
    );
  
    return (
      <NavigationMenu>
        {navigationItems}
      </NavigationMenu>
    );
  };
  
  return (
    <>
      {isLogouting && <LogoutLoader />}
      
      {/* WhatsApp Setup Marquee */}
      <WhatsAppSetupMarquee 
        businessPhoneNumberId={businessPhoneNumberId}
        handleRedirect={handleRedirect}
        authenticated={authenticated}
      />
      
      <div className={`w-full z-40 ${!authenticated && 'fixed'} ${
        authenticated 
          ? 'bg-background border-b border-border/40 shadow-sm' 
          : 'bg-black/80 border-b border-gray-900 shadow-lg'}`}>
        <div className="container mx-auto flex justify-between items-center py-3 px-4">
          <Link 
            to="/" 
            className="flex items-center space-x-2 group transition-all duration-300 hover:scale-105"
          >
            <img 
              src={logo} 
              alt="Nuren AI" 
              className="h-8 w-8 md:h-10 md:w-10 group-hover:rotate-6 transition-transform"
            />
            <span className={`hidden sm:inline text-xl md:text-2xl font-bold ${
              authenticated 
                ? 'text-primary group-hover:text-primary/80' 
                : 'bg-gradient-to-r from-emerald-300 via-green-200 to-emerald-300 bg-clip-text text-transparent group-hover:opacity-80 [text-shadow:0_2px_8px_rgba(0,255,128,0.1)]'
            }`}>
              Nuren AI
            </span>
          </Link>
        
          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <NavLinks />
          </div>
        
          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {authenticated ? (
              <>
                {/* Notifications Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="relative group hover:bg-primary/10 transition-all duration-300"
                    >
                      <Bell className="w-6 h-6 text-primary group-hover:scale-110 transition-transform" />
                      {unreadCount > 0 && (
                        <Badge 
                          variant="destructive" 
                          className="absolute -top-2 -right-2 px-1.5 py-0.5 text-xs animate-pulse"
                        >
                          {unreadCount}
                        </Badge>
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-72">
                    <div className="flex justify-between items-center px-2 py-1.5">
                      <DropdownMenuLabel className="py-0">Notifications</DropdownMenuLabel>
                      {notifications.length > 0 && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            clearAllNotifications();
                          }}
                          className="text-xs text-primary hover:bg-primary/10 flex items-center gap-1 h-7 px-2"
                        >
                          <Check className="h-3 w-3" />
                          Mark all as read
                        </Button>
                      )}
                    </div>
                    <DropdownMenuSeparator />
                    <div className={`${notifications.length > 3 ? 'max-h-64 overflow-y-auto' : ''}`} >
                      {notifications.length > 0 ? (
                        notifications.map(notification => {
                          const [sender, message] = notification.content.replace('New meessage from ', '').split(': ');
                          return (
                            <DropdownMenuItem 
                              key={notification.id} 
                              className="flex justify-between items-center hover:bg-primary/10 transition-colors space-x-2"  
                              onSelect={(e) => {
                                e.preventDefault();
                              }}
                              onClick={(e) => {
                                if (notification && notification.content) {
                                  handlefindid(notification.contact_id,notification.id);
                                  console.log(notification)
                                } else {
                                  console.log("Cannot process notification - content is missing");
                                }
                              }}
                            >
                              <div className="flex flex-col overflow-hidden">
                                <span className="font-semibold text-sm text-primary truncate max-w-[200px]">
                                  {sender}
                                </span>
                                <span className="text-xs text-muted-foreground truncate max-w-[250px]">
                                  {message}
                                </span>
                                <span className="text-xs text-muted-foreground opacity-70">
                                  {new Date(notification.created_on).toLocaleString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </span>
                              </div>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="text-destructive hover:bg-destructive/10 flex-shrink-0"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeNotification(notification.id);
                                }}
                              >
                                &times;
                              </Button>
                            </DropdownMenuItem>
                          );
                        })
                      ) : (
                        <div className="text-muted-foreground text-center py-4">
                          No new notifications
                        </div>
                      )}
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
        
                {/* User Profile Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="group hover:bg-primary/10 transition-all duration-300"
                    >
                      <UserCircle2 className="w-7 h-7 text-primary group-hover:scale-110 transition-transform" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onSelect={() => navigate(getPath('/profile'))}
                      className="hover:bg-primary/10 transition-colors"
                    >
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onSelect={() => navigate(getPath('/models'))}
                      className="hover:bg-primary/10 transition-colors"
                    >
                      Models
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onSelect={() => navigate(getPath('/assign'))}
                      className="hover:bg-primary/10 transition-colors"
                    >
                      Assign
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onSelect={() => navigate(getPath('/payment'))}
                      className="hover:bg-primary/10 transition-colors"
                    >
                      <CreditCard className="mr-2 h-4 w-4" />
                      Billing
                    </DropdownMenuItem>
                    
                    {!businessPhoneNumberId && (
                      <DropdownMenuItem 
                        onSelect={handleRedirect}
                        className="bg-primary/20 text-primary font-semibold hover:bg-primary/30 transition-colors border-l-4 border-primary focus:bg-primary/30 active:bg-primary/40"
                      >
                        Set Up WhatsApp
                      </DropdownMenuItem>
                    )}
        
                    {businessPhoneNumberId && (
                      <DropdownMenuItem 
                        disabled
                        className="text-muted-foreground opacity-50 cursor-default"
                      >
                        WhatsApp Registered
                      </DropdownMenuItem>
                    )}
        
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onSelect={handleLogout} 
                      className="text-destructive hover:bg-destructive/10 focus:bg-destructive/10"
                      disabled={isLogouting}
                    >
                      {isLogouting ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <LogOut className="mr-2" />
                      )}
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <Link to="/login">
                  <Button 
                    variant="ghost" 
                    className="text-gray-300 bg-transparent hover:bg-gray-800/50 hover:text-white transition-all duration-300"
                  >
                    Login
                  </Button>
                </Link>
                <PopupButton
                  url="https://calendly.com/adarsh1885/schedule-a-demo"
                  rootElement={document.getElementById("root")}
                  className="relative bg-gradient-to-r from-emerald-500 to-green-500 text-white 
                    hover:from-emerald-400 hover:to-green-400 
                    shadow-lg hover:shadow-emerald-500/40
                    transition-all duration-300
                    animate-pulse hover:animate-none
                    hover:scale-105 active:scale-95
                    before:absolute before:inset-0
                    before:bg-gradient-to-r before:from-white/20 before:to-transparent
                    before:opacity-0 hover:before:opacity-100
                    before:transition-opacity before:duration-300
                    overflow-hidden
                    ring-2 ring-emerald-500/50 hover:ring-emerald-400
                    group
                    px-4 py-2 rounded-md font-medium"
                  text={
                    <>
                      <span className="relative inline-flex items-center">
                        Book Demo
                      </span>
                      <span className="absolute inset-0 bg-gradient-to-r from-emerald-400/20 to-green-400/20 
                        blur-xl group-hover:blur-2xl transition-all duration-300"></span>
                    </>
                  }
                />
              </div>
            )}
        
            {/* Mobile Menu */}
            <Sheet 
              open={isSheetOpen} 
              onOpenChange={setIsSheetOpen}
              modal={false}
            >
              <SheetTrigger asChild className="md:hidden">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className={`${
                    authenticated 
                      ? "hover:bg-primary/10" 
                      : "text-gray-300 hover:bg-gray-800/50 bg-transparent"
                  } transition-all duration-300`}
                >
                  <MenuIcon className={
                    authenticated 
                      ? "w-6 h-6 text-primary group-hover:scale-110 transition-transform"
                      : "w-6 h-6 text-gray-300 group-hover:text-white group-hover:scale-110 transition-transform"
                  } />
                </Button>
              </SheetTrigger>
              <SheetContent 
                side="left" 
                className={`w-[300px] ${
                  authenticated ? "" : "bg-black/90 backdrop-blur-md border-r border-gray-900"
                }`}
                style={{ zIndex: 205 }}
              >
                <SheetHeader>
                  <SheetTitle className={`flex items-center space-x-2 ${
                    authenticated ? "" : "text-white"
                  }`}>
                    <img src={logo} alt="Nuren AI Logo" className="h-8 w-8" />
                    <span>Nuren AI</span>
                  </SheetTitle>
                </SheetHeader>
                <div className="grid gap-4 py-4">
                  <NavLinks />
                  {!authenticated && (
                    <div className="space-y-3">
                      <Link to="/login">
                        <Button className="w-full bg-gray-900/80 text-gray-300 hover:bg-gray-800 hover:text-white">
                          Login
                        </Button>
                      </Link>
                      <Link to="/signup">
                        <Button className="w-full bg-gradient-to-r from-emerald-500 to-green-500 text-white hover:from-emerald-600 hover:to-green-600">
                          Start Free Trial
                        </Button>
                      </Link>
                    </div>
                  )}
                  
                  {/* Close Button at the bottom */}
                  <SheetClose asChild>
                    <Button 
                      variant="destructive" 
                      className="w-full mt-4 flex items-center justify-center"
                    >
                      <X className="mr-2 h-5 w-5" />Close
                    </Button>
                  </SheetClose>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;