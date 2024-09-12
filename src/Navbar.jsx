import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Bell, User } from 'lucide-react';
import { useAuth } from './authContext'; // Assuming you have this hook
import logo from "./assets/logo.png";
import io from 'socket.io-client';

const socket = io('https://whatsappbotserver.azurewebsites.net/');

const Navbar = () => {
  const { authenticated, logout, tenantId } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();

  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  useEffect(() => {
    socket.on('new-message', handleNewMessage);
    return () => {
      socket.off('new-message', handleNewMessage);
    };
  }, []);

  const handleNewMessage = (message) => {
    const newNotification = {
      id: Date.now(),
      text: `New message from ${message.contactPhone.wa_id}: ${message.message}`,
      read: false,
    };
    setNotifications(prev => [newNotification, ...prev]);
    setUnreadCount(prev => prev + 1);
  };

  const handleNotificationClick = () => {
    setShowNotifications(!showNotifications);
    if (showNotifications) {
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
    }
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const getPath = (path) => {
    if (authenticated) {
      return `/${tenantId}${path}`;
    } else {
      return path.startsWith('/demo') ? path : `/demo${path}`;
    }
  };

  if (isAuthPage) {
    return null;
  }

  return (
    <nav className="bg-gray-800 p-4 transition-colors duration-300">
      <div className="container mx-auto flex justify-between items-center">
        <Link style={{display:'flex', alignItems:'center'}} className="text-white text-2xl font-bold" to="/">
          <img style={{height:'2.5rem', marginRight:'2px'}} src={logo} alt="" />
          NurenAI
        </Link>
        <div className="hidden md:flex space-x-4 items-center">
          {authenticated && (
            <>
              <Link to={getPath('/contact')} className="text-white hover:text-gray-300">Contact</Link>
              <Link to={getPath('/broadcast')} className="text-white hover:text-gray-300">Broadcast</Link>
            </>
          )}
          <Link to={getPath('/chatbot')} className="text-white hover:text-gray-300">Chatbot</Link>
          <Link to={getPath('/flow-builder')} className="text-white hover:text-gray-300">Flow Builder</Link>
          {authenticated ? (
            <>
              <div className="relative">
                <Bell
                  className="text-white cursor-pointer"
                  onClick={handleNotificationClick}
                />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs">
                    {unreadCount}
                  </span>
                )}
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg py-1 z-10 max-h-96 overflow-y-auto">
                    {notifications.length > 0 ? (
                      notifications.map(notification => (
                        <div key={notification.id} className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex justify-between items-center">
                          <span className={notification.read ? 'text-gray-500' : 'font-semibold'}>{notification.text}</span>
                          <button onClick={() => removeNotification(notification.id)} className="text-red-500 hover:text-red-700">
                            &times;
                          </button>
                        </div>
                      ))
                    ) : (
                      <div className="px-4 py-2 text-sm text-gray-700">No new notifications</div>
                    )}
                  </div>
                )}
              </div>
              <User
                className="text-white cursor-pointer"
                onClick={() => navigate('/profile')}
              />
              <button onClick={logout} className="text-white hover:text-gray-300">Logout</button>
            </>
          ) : (
            <Link to="/login" className="text-white hover:text-gray-300">Login</Link>
          )}
        </div>
        <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-white">
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>
      {isOpen && (
        <div className="md:hidden">
          {authenticated && (
            <>
              <Link to={getPath('/contact')} className="text-white hover:text-gray-300 block py-2">Contact</Link>
              <Link to={getPath('/broadcast')} className="text-white hover:text-gray-300 block py-2">Broadcast</Link>
            </>
          )}
          <Link to={getPath('/chatbot')} className="text-white hover:text-gray-300 block py-2">Chatbot</Link>
          <Link to={getPath('/flow-builder')} className="text-white hover:text-gray-300 block py-2">Flow Builder</Link>
          {authenticated ? (
            <button onClick={logout} className="text-white hover:text-gray-300 block py-2">Logout</button>
          ) : (
            <Link to="/login" className="text-white hover:text-gray-300 block py-2">Login</Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;