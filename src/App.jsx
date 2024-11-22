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
import HomePage from './Pages/HomePage/Homepage.jsx';
import PasswordReset from './Pages/PasswordReset/index.jsx';
import AIChatbotsPage from './Pages/Blogs/AIChatbot.jsx';
import Chatbotredirect from './Pages/Chatbot/Chatbotredirect';
import Models from './Pages/Model/ModelTable';
import Learn from './Pages/Blogs/Learn';
import AssignContact from './Pages/assignContact/assignContact';
import { NotFound } from './Pages/NotFound/NotFound';
import BusinessOutreachBlog from './Pages/Blogs/BusinessOutreach.jsx';
import UserExperienceSegmentation from './Pages/Blogs/userSegment.jsx';
import MaximizingCustomerEngagement from './Pages/Blogs/CustomerEngagement.jsx';
import WhatsAppMarketingStrategies from './Pages/Blogs/marketingstrategy.jsx';
import HandleCustomerFeedback from './Pages/Blogs/customerfeedback.jsx';
import Blogs from './Pages/Blogs/Blogs.jsx';
import PricingPage from './Pages/Misc/pricing.jsx';
import PrivacyPolicy from './Pages/Misc/privacypolicy.jsx';
import TermsAndConditions from './Pages/Misc/terms&conditions.jsx';
import ContactUs from './Pages/Misc/contactus.jsx';
import Catalog from './Pages/Catalog/catalog.jsx';
import { Toaster } from 'sonner';
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
            
            <Route path="/change-password" element={authenticated ? <Navigate to={`/${tenantId}/broadcast`} replace /> : <PasswordReset />} />
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
                <Route path="catalog" element={<Catalog/>}/>
                <Route path="chatbot" element={<Chatbot />} />
                <Route path="catalog" element={<Catalog/>}/>
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
              <Route path="contactus" element={<ContactUs/>} />
              <Route path="privacypolicy" element={<PrivacyPolicy />} />
              <Route path="termsandconditions" element={<TermsAndConditions />} />
              <Route path="pricing" element={<PricingPage />} />
              <Route path="blogs" element={<Blogs/>} />
              <Route path="blogs/learn-more" element={<Learn />} />
              <Route path="blogs/chatbot" element={<AIChatbotsPage/>} />
              <Route path="blogs/business-outreach" element={<BusinessOutreachBlog/>} />
              <Route path="blogs/segmentation" element={<UserExperienceSegmentation/>} />
              <Route path="blogs/whatsapp-engagement" element={<MaximizingCustomerEngagement/>} />
              <Route path="blogs/marketing-strategy" element={<WhatsAppMarketingStrategies/>} />
              <Route path="blogs/customer-feedback" element={<HandleCustomerFeedback/>} />
          </Routes>

        </main>
      </div>
    </Router>
  );
};

export default App;