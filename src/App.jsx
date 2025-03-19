import React from 'react';
import { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, Link } from 'react-router-dom';
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
import ContactDetails from './Pages/ContactPage/ContactDetails.jsx';
import GPayUPIPayment from './payment.jsx';
import CancellationRefundPolicy from './Pages/Misc/RefundCancel.jsx';
import WhatsAppDripMarketing from './Pages/Blogs/dripmarketing.jsx';
import { Toaster } from 'sonner';
import WhatsAppSuperApp from './Pages/Blogs/superapp.jsx';
import { Button } from "@/components/ui/button";

const ProtectedRoute = ({ children }) => {
  const { authenticated } = useAuth();
  return authenticated ? children : <Navigate to="/login" replace />;
};

const TierProtectedRoute = ({ children, requiredTier }) => {
  const { tenant, tenantId } = useAuth();
  
  // Handle loading state
  if (!tenant) return <div className="container text-center p-8">Loading plan details...</div>;
  
  const currentTier = tenant.tier?.toLowerCase() || 'free';
  const required = requiredTier.toLowerCase();

  if (currentTier === required || 
      (required === 'premium' && currentTier === 'enterprise') || 
      (required === 'premium' && currentTier === 'enterprise')) {
    return children;
  }

  return (
    <div className="fixed inset-0 h-screen w-full bg-background/95 backdrop-blur-sm">
      <div className="flex h-full w-full items-center justify-center">
        <div className="mx-auto max-w-md space-y-4 p-6 text-center">
          <Rocket className="h-12 w-12 text-primary mx-auto" />
          <h1 className="text-2xl font-bold">Feature Locked</h1>
          <p className="text-muted-foreground">
            This feature requires {requiredTier.charAt(0).toUpperCase() + requiredTier.slice(1)} plan
          </p>
          <Button asChild className="mt-4">
            <Link to={`/${tenantId}/payment`}>
              Upgrade to {requiredTier.charAt(0).toUpperCase() + requiredTier.slice(1)}
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
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
  const { authenticated, logout, tenantId, tenant } = useAuth();
  
  const shouldShowBanner = () => {
    return !authenticated && window.location.pathname === '/';
  };

  return (
    <Router>
      <Toaster position="top-center" duration={3000} style={{ border: 'none' }} />
      <div className="flex flex-col min-h-screen">
        {shouldShowBanner() && (
          <div className="w-full bg-primary text-primary-foreground">
            <MarketingBanner />
          </div>
        )}

        <div className={`w-full z-40 ${!authenticated ? 'sticky top-0' : ''} ${
          authenticated 
            ? 'bg-background border-b border-border/40 shadow-sm' 
            : 'bg-black backdrop-blur-sm border-b border-gray-900/50 shadow-lg'}`}>
          <Navbar isAuthenticated={authenticated} onLogout={logout} />
        </div>

          <Routes>
            <Route path="/" element={authenticated ? <Navigate to={`/${tenantId}/broadcast`} replace /> : <HomePage />} />
            <Route path="/login" element={authenticated ? <Navigate to={`/${tenantId}/broadcast`} replace /> : <Login />} />
            <Route path="/register" element={authenticated ? <Navigate to={`/${tenantId}/broadcast`} replace /> : <Register />} />
            <Route path="/change-password" element={authenticated ? <Navigate to={`/${tenantId}/broadcast`} replace /> : <PasswordReset />} />
            <Route path="/chatbotredirect" element={<Chatbotredirect />} />

            {/* Demo routes */}
            <Route path="/demo/chatbot" element={<Chatbot demo={true} />} />
            <Route path="/demo/flow-builder" element={<FlowBuilder demo={true} />} />

            {/* Tenant-scoped routes */}
            <Route path="/:tenant_id/*" element={
              <Routes>
                {/* Free tier accessible routes */}
                <Route path="broadcast" element={<ProtectedRoute><BroadcastPage /></ProtectedRoute>} />
                <Route path="contact" element={<ProtectedRoute><TierProtectedRoute requiredTier="premium"><ContactPage /></TierProtectedRoute></ProtectedRoute>} />
                <Route path="contactDetails" element={<ProtectedRoute><ContactDetails /></ProtectedRoute>} />
                <Route path="payment" element={<ProtectedRoute><GPayUPIPayment /></ProtectedRoute>} />
                <Route path="profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
                <Route path="chatbot" element={<ProtectedRoute><Chatbot /></ProtectedRoute>} />
                <Route path="assign" element={<ProtectedRoute><AssignContact /></ProtectedRoute>} />

                {/* Premium+ features */}
                <Route path="flow-builder" element={
                  <ProtectedRoute>
                    <TierProtectedRoute requiredTier="premium">
                      <FlowBuilder />
                    </TierProtectedRoute>
                  </ProtectedRoute>
                } />

                <Route path="models" element={
                  <ProtectedRoute>
                    <TierProtectedRoute requiredTier="premium">
                      <Models />
                    </TierProtectedRoute>
                  </ProtectedRoute>
                } />

                {/* Enterprise-only features */}
                <Route path="scheduled-events" element={
                  <ProtectedRoute>
                    <TierProtectedRoute requiredTier="enterprise">
                      <ScheduledEventsPage />
                    </TierProtectedRoute>
                  </ProtectedRoute>
                } />

                <Route path="catalog" element={
                  <ProtectedRoute>
                    <TierProtectedRoute requiredTier="premium">
                      <Catalog />
                    </TierProtectedRoute>
                  </ProtectedRoute>
                } />

                {/* Fallback routes */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            } />

            {/* Public routes */}
            <Route path="contactus" element={<ContactUs />} />
            <Route path="privacypolicy" element={<PrivacyPolicy />} />
            <Route path="termsandconditions" element={<TermsAndConditions />} />
            <Route path="refundandcancellation" element={<CancellationRefundPolicy />} />
            <Route path="pricing" element={<PricingPage />} />
            <Route path="blogs" element={<Blogs />} />
            <Route path="blogs/learn-more" element={<Learn />} />
            <Route path="blogs/chatbot" element={<AIChatbotsPage />} />
            <Route path="blogs/business-outreach" element={<BusinessOutreachBlog />} />
            <Route path="blogs/segmentation" element={<UserExperienceSegmentation />} />
            <Route path="blogs/whatsapp-engagement" element={<MaximizingCustomerEngagement />} />
            <Route path="blogs/marketing-strategy" element={<WhatsAppMarketingStrategies />} />
            <Route path="blogs/customer-feedback" element={<HandleCustomerFeedback />} />
            <Route path="blogs/super-app" element={<WhatsAppSuperApp />} />
            <Route path="blogs/drip-marketing" element={<WhatsAppDripMarketing />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
      </div>
    </Router>
  );
};

export default App;