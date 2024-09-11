// import React, { useState, useEffect } from 'react';
// import { Link, useLocation, useNavigate } from 'react-router-dom';
// import { Menu, X, Bell, User } from 'lucide-react';
// import logo from "./assets/logo.png";

// import io from 'socket.io-client';
// // import Login from './Pages/Login';
// // import { Register } from './Pages/Register/index';


// const socket = io('https://whatsappbotserver.azurewebsites.net/');

// const Navbar = ({ isAuthenticated, onLogout }) => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [showNotifications, setShowNotifications] = useState(false);
//   const [notifications, setNotifications] = useState([]);
//   const [unreadCount, setUnreadCount] = useState(0);
//   const location = useLocation();
//   const navigate = useNavigate();

//   const isHomePage = location.pathname === '/';
//   const isAuthPage = location.pathname === '/login' || location.pathname === '/register';


//   useEffect(() => {
//         socket.on('new-message', handleNewMessage);
    
//         return () => {
//           socket.off('new-message', handleNewMessage);
//         };
//       }, []);
    
//       const handleNewMessage = (message) => {
//         const newNotification = {
//           id: Date.now(),
//           text: `New message from ${message.contactPhone.wa_id}: ${message.message}`,
//           read: false,
//         };
//         setNotifications(prev => [newNotification, ...prev]);
//         setUnreadCount(prev => prev + 1);
//       };
    
//       const handleNotificationClick = () => {
//         setShowNotifications(!showNotifications);
//         if (showNotifications) {
//           setNotifications(prev => prev.map(n => ({ ...n, read: true })));
//           setUnreadCount(0);
//         }
//       };
    
//       const removeNotification = (id) => {
//         setNotifications(prev => prev.filter(n => n.id !== id));
//         setUnreadCount(prev => Math.max(0, prev - 1));
//       };


//   if (isAuthPage) {
//     return null; // Don't render navbar on login/register pages
//   }


//   return (
//     <nav className={`bg-gray-800 p-4 transition-colors duration-300`}>
//       <div className="container mx-auto flex justify-between items-center">
//         <Link style={{display:'flex', alignItems:'center'}} className="text-white text-2xl font-bold">
//           <img style={{height:'2.5rem', marginRight:'2px'}} src={logo} alt="" />
//           NurenAI
//         </Link>
//         {isAuthenticated ? (
//           <div className="hidden md:flex space-x-4 items-center">
//             <NavLinks />
//             <div className="relative">
//              <Bell
//               className="text-white cursor-pointer"
//               onClick={handleNotificationClick}
//             />
//             {unreadCount > 0 && (
//               <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs">
//                 {unreadCount}
//               </span>
//             )}
//             {showNotifications && (
//               <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg py-1 z-10 max-h-96 overflow-y-auto">
//                 {notifications.length > 0 ? (
//                   notifications.map(notification => (
//                     <div key={notification.id} className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex justify-between items-center">
//                       <span className={notification.read ? 'text-gray-500' : 'font-semibold'}>{notification.text}</span>
//                       <button onClick={() => removeNotification(notification.id)} className="text-red-500 hover:text-red-700">
//                         &times;
//                        </button>
//                      </div>
//                    ))
//                  ) : (
//                    <div className="px-4 py-2 text-sm text-gray-700">No new notifications</div>
//                  )}
//                </div>
//              )}
//            </div>
//             <User
//               className="text-white cursor-pointer"
//               onClick={() => navigate('/profile')}
//             />
//             <button onClick={onLogout} className="text-white hover:text-gray-300">Logout</button>
//           </div>
//         ) : (
//           <Link to="/login" className="text-white hover:text-gray-300">Login</Link>
//         )}
//         {isAuthenticated && (
//           <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-white">
//             {isOpen ? <X /> : <Menu />}
//           </button>
//         )}
//       </div>
//       {isAuthenticated && isOpen && (
//         <div className="md:hidden">
//           <NavLinks />
//           <button onClick={onLogout} className="text-white hover:text-gray-300 block py-2">Logout</button>
//         </div>
//       )}
//     </nav>
//   );
// };

// const NavLinks = () => (
//   <>
//     <Link to="/BMX/contact" className="text-white hover:text-gray-300 block py-2 md:inline-block">Contact</Link>
//     <Link to="/BMX/broadcast" className="text-white hover:text-gray-300 block py-2 md:inline-block">Broadcast</Link>
//     <Link to="/BMX/chatbot" className="text-white hover:text-gray-300 block py-2 md:inline-block">Chatbot</Link>
//     <Link to="/BMX/flow-builder" className="text-white hover:text-gray-300 block py-2 md:inline-block">Flow Builder</Link>
//   </>
// );

// const NotificationBell = ({ notifications, unreadCount, showNotifications, setShowNotifications, removeNotification }) => {
//   // ... (keep the existing NotificationBell component code)
//   const handleNewMessage = (message) => {
//     const newNotification = {
//       id: Date.now(),
//       text: `New message from ${message.contactPhone.wa_id}: ${message.message}`,
//       read: false,
//     };
//     setNotifications(prev => [newNotification, ...prev]);
//     setUnreadCount(prev => prev + 1);
//   };

//   const handleNotificationClick = () => {
//     setShowNotifications(!showNotifications);
//     if (showNotifications) {
//       setNotifications(prev => prev.map(n => ({ ...n, read: true })));
//       setUnreadCount(0);
//     }
//   };
// };

// export default Navbar;



import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Bell, User } from 'lucide-react';
import logo from "./assets/logo.png";

import io from 'socket.io-client';

const socket = io('https://whatsappbotserver.azurewebsites.net/');

const Navbar = ({ isAuthenticated, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();

  const isHomePage = location.pathname === '/';
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

  if (isAuthPage) {
    return null; // Don't render navbar on login/register pages
  }

  return (
    <nav className={`bg-gray-800 p-4 transition-colors duration-300`}>
      <div className="container mx-auto flex justify-between items-center">
        <Link style={{display:'flex', alignItems:'center'}} className="text-white text-2xl font-bold" to="/">
          <img style={{height:'2.5rem', marginRight:'2px'}} src={logo} alt="" />
          NurenAI
        </Link>
        <div className="hidden md:flex space-x-4 items-center">
          <NavLinks isAuthenticated={isAuthenticated} />
          {isAuthenticated ? (
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
              <button onClick={onLogout} className="text-white hover:text-gray-300">Logout</button>
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
          <NavLinks isAuthenticated={isAuthenticated} />
          {isAuthenticated ? (
            <button onClick={onLogout} className="text-white hover:text-gray-300 block py-2">Logout</button>
          ) : (
            <Link to="/login" className="text-white hover:text-gray-300 block py-2">Login</Link>
          )}
        </div>
      )}
    </nav>
  );
};

const NavLinks = ({ isAuthenticated }) => (
  <>
    {isAuthenticated && (
      <>
        <Link to="/BMX/contact" className="text-white hover:text-gray-300 block py-2 md:inline-block">Contact</Link>
        <Link to="/BMX/broadcast" className="text-white hover:text-gray-300 block py-2 md:inline-block">Broadcast</Link>
      </>
    )}
    <Link to="/BMX/chatbot" className="text-white hover:text-gray-300 block py-2 md:inline-block">Chatbot</Link>
    <Link to="/BMX/flow-builder" className="text-white hover:text-gray-300 block py-2 md:inline-block">Flow Builder</Link>
  </>
);

export default Navbar;