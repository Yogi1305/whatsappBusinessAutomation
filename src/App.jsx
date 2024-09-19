import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { useAuth } from './authContext';
import Navbar from './Navbar';
import Login from './Pages/Login';
import Register from './Pages/Register';
import BroadcastPage from "./Pages/Chatbot/Broadcast/BroadcastPage";
import Chatbot from './Pages/Chatbot/chatbot';
import FlowBuilder from "./Pages/NewFlow/FlowBuilder";
import ContactPage from './Pages/ContactPage/ContactPage';
import ProfilePage from './Pages/ProfilePage/ProfilePage';
import HomePage from './Pages/HomePage/Homepage';
import Chatbotredirect from './Pages/Chatbot/Chatbotredirect';
import Models from './Pages/Model/ModelTable';

import AssignContact from './Pages/assignContact/assignContact';
import { NotFound } from './Pages/NotFound/NotFound';
const ProtectedRoute = ({ children }) => {
  const { authenticated } = useAuth();
  return authenticated ? children : <Navigate to="/login" replace />;
};

const App = () => {
  const { authenticated, logout, tenantId } = useAuth();

  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar isAuthenticated={authenticated} onLogout={logout} />
        <main className="flex-grow container">
          <Routes>
            <Route path="/" element={authenticated ? <Navigate to={`/${tenantId}/broadcast`} replace /> : <HomePage />} />
            <Route path="/login" element={authenticated ? <Navigate to={`/${tenantId}/broadcast`} replace /> : <Login />} />
            <Route path="/register" element={authenticated ? <Navigate to={`/${tenantId}/broadcast`} replace /> : <Register />} />
            <Route path="/chatbotredirect" element={<Chatbotredirect />} />

            {/* Demo routes accessible without authentication */}
            <Route path="/demo/chatbot" element={<Chatbot demo={true} />} />
            <Route path="/demo/flow-builder" element={<FlowBuilder demo={true} />} />

            <Route path="/:tenant_id/*" element={
              <Routes>
                <Route path="broadcast" element={
                  <ProtectedRoute>
                    <BroadcastPage />
                  </ProtectedRoute>
                } />
                <Route path="contact" element={
                  <ProtectedRoute>
                    <ContactPage />
                  </ProtectedRoute>
                } />
                <Route path="chatbot" element={<Chatbot />} />
                <Route path="assign" element={<AssignContact />} />
                <Route path="flow-builder" element={<FlowBuilder />} />
                <Route path="models" element={<ProtectedRoute><Models /></ProtectedRoute>} />
                <Route path="/profile" element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                } />
                 <Route path="*" element={<NotFound />} />
              </Routes>
            } />
              <Route path="*" element={<NotFound />} />
          </Routes>

        </main>
      </div>
    </Router>
  );
};

export default App;