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
import { Bell, Plus } from 'lucide-react';

const ProtectedRoute = ({ children }) => {
  const { authenticated } = useAuth();
  return authenticated ? children : <Navigate to="/login" replace />;
};

const MainLayout = ({ children, isAuthenticated, onLogout }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <nav className="bg-white dark:bg-gray-800 shadow-lg fixed w-full z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <img
                  className="h-8 w-auto"
                  src="/api/placeholder/32/32"
                  alt="Logo"
                />
                <span className="ml-2 text-xl font-bold text-gray-800 dark:text-white">
                  Your Brand
                </span>
              </div>
              
              {isAuthenticated && (
                <div className="hidden md:ml-6 md:flex md:space-x-8">
                  <NavLink active>Broadcast</NavLink>
                  <NavLink>Contacts</NavLink>
                  <NavLink>Chatbot</NavLink>
                  <NavLink>Models</NavLink>
                </div>
              )}
            </div>

            <div className="flex items-center">
              {isAuthenticated ? (
                <div className="flex items-center space-x-4">
                  <button className="relative p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full flex items-center justify-center text-xs text-white">
                      3
                    </span>
                    <Bell className="h-6 w-6" />
                  </button>
                  
                  <div className="relative">
                    <button
                      className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={onLogout}
                    >
                      <img
                        className="h-8 w-8 rounded-full"
                        src="/api/placeholder/32/32"
                        alt="Profile"
                      />
                      <span className="hidden md:block text-sm font-medium text-gray-700 dark:text-gray-200">
                        Profile
                      </span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <button className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900">
                    Log in
                  </button>
                  <button className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700">
                    Sign up
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page Header Component */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Dashboard
              </h1>
              <div className="flex space-x-3">
                <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">
                  <Plus className="h-4 w-4 mr-2" />
                  New Campaign
                </button>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            {children}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 shadow-lg mt-auto">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              © 2024 Your Company. All rights reserved.
            </div>
            <div className="flex space-x-6">
              <a href="/privacy" className="text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                Privacy Policy
              </a>
              <a href="/terms" className="text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                Terms of Service
              </a>
              <a href="/contact" className="text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

const NavLink = ({ children, active }) => (
  <a
    href="#"
    className={`inline-flex items-center px-1 pt-1 text-sm font-medium border-b-2 ${
      active
        ? 'border-indigo-500 text-gray-900 dark:text-white'
        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white'
    }`}
  >
    {children}
  </a>
);

const App = () => {
  const { authenticated, logout, tenantId } = useAuth();

  return (
    <Router>
      <MainLayout isAuthenticated={authenticated} onLogout={logout}>
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

      </MainLayout>
    </Router>
  );
};

export default App;