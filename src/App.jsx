import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import BroadcastPage from "./Pages/Chatbot/Broadcast/BroadcastPage";
import Chatbot from './Pages/Chatbot/chatbot';
import FlowBuilder from "./Pages/NewFlow/FlowBuilder";
import { Menu, X } from 'lucide-react';
import Homepage from './Pages/HomePage/Homepage';
import ContactPage from './Pages/ContactPage/ContactPage';

const Navbar = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-white text-2xl font-bold">NurenAI</Link>
        <div className="hidden md:flex space-x-4">
          <NavLinks />
        </div>
        <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-white">
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>
      {isOpen && (
        <div className="md:hidden">
          <NavLinks />
        </div>
      )}
    </nav>
  );
};

const NavLinks = () => (
  <>
    <Link to="ll/contact" className="text-white hover:text-gray-300 block py-2 md:inline-block">Contact</Link>
    <Link to="ll/broadcast" className="text-white hover:text-gray-300 block py-2 md:inline-block">Broadcast</Link>
    <Link to="ll/chatbot" className="text-white hover:text-gray-300 block py-2 md:inline-block">Chatbot</Link>
    <Link to="ll/flow-builder" className="text-white hover:text-gray-300 block py-2 md:inline-block">Flow Builder</Link>
  </>
);

const App = () => {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow container">
          <Routes>
            <Route path="ll/broadcast" element={<BroadcastPage />} />
            <Route path="ll/chatbot" element={<Chatbot />} />
            <Route path="ll/flow-builder" element={<FlowBuilder />} />
            <Route path="ll/contact" element={<ContactPage />} />
            <Route path="/" element={<Homepage/>} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;