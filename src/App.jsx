import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { useAuth } from './authContext';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useSpring, animated } from 'react-spring';
import { MessageCircle, Users, Zap, BarChart2, Send, Star, Shield, Rocket, Check, ChevronDown } from 'lucide-react';
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
import ScheduledEventsPage from './ScheduleEvent.jsx';
import ContactDetails from './Pages/ContactPage/contactDetails.jsx';
import { Toaster } from 'sonner';
const ProtectedRoute = ({ children }) => {
  const { authenticated } = useAuth();
  return authenticated ? children : <Navigate to="/login" replace />;
};

const MarketingBanner = () => (
  <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-emerald-950 h-7 overflow-hidden relative border-b border-emerald-500/30 backdrop-blur-sm">
    <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.05)_1px,transparent_1px)] bg-[size:32px_32px] opacity-20" />
    
    <motion.div
      className="flex items-center absolute whitespace-nowrap h-full"
      animate={{
        x: ["100%", "-100%"],
      }}
      transition={{
        x: {
          duration: 25,
          repeat: Infinity,
          ease: "linear"
        }
      }}
    >
      <div className="flex items-center space-x-12 px-4">
        <span className="text-emerald-50 text-sm font-medium flex items-center bg-gradient-to-r from-emerald-500/10 to-transparent px-3 py-0.5 rounded-full">
          <Zap className="w-3.5 h-3.5 mr-1.5 text-emerald-400" />
          FLASH SALE: Flat 20% OFF on all Annual Plans
        </span>
        
        <span className="text-emerald-50 text-sm font-medium flex items-center">
          <span className="text-base mr-1.5">🎁</span>
          Limited Time: Get 3 Months FREE with Enterprise Plan
        </span>
        
        <span className="text-emerald-50 text-sm font-medium flex items-center bg-gradient-to-r from-emerald-500/10 to-transparent px-3 py-0.5 rounded-full">
          <Zap className="w-3.5 h-3.5 mr-1.5 text-emerald-400" />
          Early Bird Offer: First 100 Signups Get Premium Features FREE
        </span>
      </div>
    </motion.div>
    
    {/* Gradient overlays for smooth edges */}
    <div className="absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-emerald-950 to-transparent" />
    <div className="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-emerald-950 to-transparent" />
  </div>
);
const App = () => {
  const { authenticated, logout, tenantId } = useAuth();
  const shouldShowBanner = () => {
    return !authenticated && location.pathname === '/';
  };
  return (
    <Router>
      <Toaster position="top-center" duration={3000} style={{border:'none'}}/>
        <div className="flex flex-col min-h-screen">
      {shouldShowBanner() && (
        <div className="w-full bg-primary text-primary-foreground">
          <MarketingBanner />
        </div>
      )}
      
      <div className={`w-full z-40 ${!authenticated && 'sticky top-0'} ${
      authenticated 
        ? 'bg-background border-b border-border/40 shadow-sm' 
        : 'bg-black backdrop-blur-sm border-b border-gray-900/50 shadow-lg'}`}>
      <Navbar isAuthenticated={authenticated} onLogout={logout} />
    </div>
   
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
                <Route path="scheduled-events/" element={
                  <ProtectedRoute>
                    <ScheduledEventsPage />
                  </ProtectedRoute>
                } />
                <Route path="contactDetails/" element={
                  <ProtectedRoute>
                    <ContactDetails />
                  </ProtectedRoute>
                } />
                <Route path="catalog" element={
                  <ProtectedRoute>
                  <Catalog/>
                  </ProtectedRoute>
                }/>

                <Route path="models" element={
                  <ProtectedRoute>
                  <Models />
                  </ProtectedRoute>
                } />

                <Route path="/profile" element={
                  <ProtectedRoute>
                  <ProfilePage />
                  </ProtectedRoute>
                } />

                <Route path="chatbot" element={
                  <ProtectedRoute>
                    <Chatbot />
                  </ProtectedRoute>
                } />

                <Route path="assign" element={
                  <ProtectedRoute>
                    <AssignContact />
                  </ProtectedRoute>
                } />
                <Route path="flow-builder" element={
                  <ProtectedRoute>
                    <FlowBuilder />
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