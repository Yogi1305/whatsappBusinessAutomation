// import React, { useEffect, useState } from 'react';
// import { BrowserRouter as Router, Route, Routes, Link, useNavigate } from 'react-router-dom';
// import BroadcastPage from "./Pages/Chatbot/Broadcast/BroadcastPage";
// import Chatbot from './Pages/Chatbot/chatbot';
// import FlowBuilder from "./Pages/NewFlow/FlowBuilder";
// import { Menu, X, Bell, User } from 'lucide-react';
// import Homepage from './Pages/HomePage/Homepage';
// import ContactPage from './Pages/ContactPage/ContactPage';
// import ProfilePage from './Pages/ProfilePage/ProfilePage';
// import logo from "./assets/logo.png"

// import io from 'socket.io-client';
// import { Login } from './Pages/Login';
// import { Register } from './Pages/Register';

// const socket = io('https://whatsappbotserver.azurewebsites.net/');

// const Navbar = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [showNotifications, setShowNotifications] = useState(false);
//   const [notifications, setNotifications] = useState([]);
//   const [unreadCount, setUnreadCount] = useState(0);
//   const navigate = useNavigate();

//   useEffect(() => {
//     socket.on('new-message', handleNewMessage);

//     return () => {
//       socket.off('new-message', handleNewMessage);
//     };
//   }, []);

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

//   const removeNotification = (id) => {
//     setNotifications(prev => prev.filter(n => n.id !== id));
//     setUnreadCount(prev => Math.max(0, prev - 1));
//   };

//   return (
//     <nav className="bg-gray-800 p-4">
//       <div className="container mx-auto flex justify-between items-center">
//         <Link to="/" style={{display:'flex', alignItems:'center'}} className="text-white text-2xl font-bold">
//         <img style={{height:'2.5rem', marginRight:'2px'}} src={logo} alt="" />
//         NurenAI</Link>
//         <div className="hidden md:flex space-x-4 items-center">
//           <NavLinks />
//           <div className="relative">
//             <Bell
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
//                       </button>
//                     </div>
//                   ))
//                 ) : (
//                   <div className="px-4 py-2 text-sm text-gray-700">No new notifications</div>
//                 )}
//               </div>
//             )}
//           </div>
//           <User
//             className="text-white cursor-pointer"
//             onClick={() => navigate('/profile')}
//           />
//         </div>
//         <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-white">
//           {isOpen ? <X /> : <Menu />}
//         </button>
//       </div>
//       {isOpen && (
//         <div className="md:hidden">
//           <NavLinks />
//         </div>
//       )}
//     </nav>
//   );
// };

// const NavLinks = () => (
//   <>
//     <Link to="ll/contact" className="text-white hover:text-gray-300 block py-2 md:inline-block">Contact</Link>
//     <Link to="ll/broadcast" className="text-white hover:text-gray-300 block py-2 md:inline-block">Broadcast</Link>
//     <Link to="ll/chatbot" className="text-white hover:text-gray-300 block py-2 md:inline-block">Chatbot</Link>
//     <Link to="ll/flow-builder" className="text-white hover:text-gray-300 block py-2 md:inline-block">Flow Builder</Link>
//   </>
// );

// // export default Navbar;

// const App = () => {
//   return (
//     <Router>
//       <div className="flex flex-col min-h-screen">
//         <Navbar />
//         <main className="flex-grow container">
//           <Routes>
//             <Route path="ll/broadcast" element={<BroadcastPage />} />
//             <Route path="ll/chatbot" element={<Chatbot />} />
//             <Route path="ll/flow-builder" element={<FlowBuilder />} />
//             <Route path="ll/contact" element={<ContactPage />} />
//             <Route path="/profile" element={<ProfilePage />} />
//             <Route path="/home" element={<Homepage />} />
//             <Route path="/login" element={<Login/>} />
//             <Route path="/" element={<Register />} />
//           </Routes>
//         </main>
//       </div>
//     </Router>
//   );
// };

// export default App;


import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Navbar from './Navbar';
import Login from './Pages/Login';
import Register from './Pages/Register';
import BroadcastPage from "./Pages/Chatbot/Broadcast/BroadcastPage";
import Chatbot from './Pages/Chatbot/chatbot';
import FlowBuilder from "./Pages/NewFlow/FlowBuilder";
import ContactPage from './Pages/ContactPage/ContactPage';
import ProfilePage from './Pages/ProfilePage/ProfilePage';
import Homepage from './Pages/HomePage/HomePage';
import Chatbotredirect from './Pages/Chatbot/Chatbotredirect';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar isAuthenticated={isAuthenticated} onLogout={handleLogout} />
        <main className="flex-grow container">
          <Routes>
            <Route path="/" element={isAuthenticated ? <Navigate to="/ll/broadcast" replace /> : <Homepage />} />
            <Route path="/login" element={isAuthenticated ? <Navigate to="/ll/broadcast" replace /> : <Login onLogin={handleLogin} />} />
            <Route path="/register" element={isAuthenticated ? <Navigate to="/ll/broadcast" replace /> : <Register onRegister={handleLogin} />} />
            <Route path="/chatbotredirect" element={ <Chatbotredirect /> } />
            <Route
              path="/ll/*"
              element={
                isAuthenticated ? (
                  <Routes>
                    <Route path="broadcast" element={<BroadcastPage />} />
                    <Route path="chatbot" element={<Chatbot />} />
                    <Route path="flow-builder" element={<FlowBuilder />} />
                    <Route path="contact" element={<ContactPage />} />
                  </Routes>
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route
              path="/profile"
              element={isAuthenticated ? <ProfilePage /> : <Navigate to="/login" replace />}
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;