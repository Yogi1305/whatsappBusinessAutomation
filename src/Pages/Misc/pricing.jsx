import React, { useState } from "react";
import { Zap, CheckCircle, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
const pricingData = {
  Basic: {
    INR: { price: "₹1,499" },
    USD: { price: "$19" },
    EUR: { price: "€17" },
    features: [
      "Scheduling messages",
      "No-code chatbot builder",
      "Cataloging",
      "Template creation",
      "Direct reply to individual chats",
      "Analytics and Dashboard (basic metrics)",
      "Vernacular language support (2-3 languages)"
    ],
    description: "Perfect for small businesses and startups exploring WhatsApp automation",
    accent: "from-blue-500 to-blue-600"
  },
  Professional: {
    INR: { price: "₹4,999" },
    USD: { price: "$59" },
    EUR: { price: "€54" },
    features: [
      "Everything in Basic, plus:",
      "Flows [RPA]",
      "AI-based document retrieval & QA",
      "Phone number verification",
      "Carousel creation",
      "Multi-template personalized campaigns",
      "Advanced analytics with exports",
      "Full vernacular language support"
    ],
    description: "Ideal for growing businesses seeking advanced automation",
    accent: "from-purple-500 to-purple-600"
  },
  Enterprise: {
    INR: { price: "₹9,999" },
    USD: { price: "$119" },
    EUR: { price: "€109" },
    features: [
      "Everything in Professional, plus:",
      "AI prompt to chatbot builder",
      "Accept payments on WhatsApp",
      "Advanced multi-user team support",
      "API access for CRM integration",
      "24/7 priority support",
      "Custom onboarding and training",
      "Advanced campaign analytics"
    ],
    description: "For enterprises requiring end-to-end automation",
    accent: "from-indigo-500 to-indigo-600"
  }
};

const PlanIcon = ({ plan }) => {
  switch (plan) {
    case "Basic":
      return <Zap className="w-12 h-12 mb-4" />;
    case "Professional":
      return <Star className="w-12 h-12 mb-4" />;
    case "Enterprise":
      return <CheckCircle className="w-12 h-12 mb-4" />;
    default:
      return null;
  }
};

const PricingPage = () => {
  const [currency, setCurrency] = useState("INR");
   const navigate = useNavigate();
  
    const handleGetStarted = () => {
      navigate('/register');
  
    };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-20">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Choose Your Perfect Plan
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Powerful WhatsApp automation solutions for businesses of all sizes
          </p>
          
          <div className="inline-flex items-center bg-white rounded-lg p-2 shadow-md">
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="px-4 py-2 rounded-md focus:outline-none text-gray-700 bg-transparent"
            >
              <option value="INR">INR</option>
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
            </select>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {Object.entries(pricingData).map(([plan, data]) => (
            <div
              key={plan}
              className="relative bg-white rounded-2xl shadow-xl overflow-hidden transform hover:scale-105 transition-transform duration-300"
            >
              <div className={`absolute inset-x-0 h-2 bg-gradient-to-r ${data.accent}`} />
              <div className="p-8">
                <PlanIcon plan={plan} />
                <h3 className="text-2xl font-bold mb-2">{plan}</h3>
                <p className="text-gray-600 mb-4">{data.description}</p>
                <div className="mb-6">
                  <span className="text-4xl font-bold">{data[currency].price}</span>
                  <span className="text-gray-600">/month</span>
                </div>
                <button onClick={handleGetStarted} className={`w-full py-3 px-6 rounded-lg bg-gradient-to-r ${data.accent} text-white font-semibold hover:opacity-90 transition-opacity duration-300`}>
                  Get Started
                </button>
                <ul className="mt-8 space-y-4">
                  {data.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <svg className="w-5 h-5 text-green-500 mr-3 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-20 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-10">Frequently Asked Questions</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h3 className="text-xl font-semibold mb-4">How do I get started?</h3>
              <p className="text-gray-600">Choose your preferred plan and complete the registration process. Our team will help you set up your WhatsApp Business account and guide you through the features.</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h3 className="text-xl font-semibold mb-4">Can I upgrade my plan later?</h3>
              <p className="text-gray-600">Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle.</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h3 className="text-xl font-semibold mb-4">What kind of support do you offer?</h3>
              <p className="text-gray-600">All plans include standard support. Enterprise plans come with 24/7 priority support and dedicated account management.</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h3 className="text-xl font-semibold mb-4">Is there a setup fee?</h3>
              <p className="text-gray-600">No, there are no hidden fees or setup charges. You only pay the monthly subscription fee for your chosen plan.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;