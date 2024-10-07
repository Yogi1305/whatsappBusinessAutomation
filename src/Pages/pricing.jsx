import React, { useState } from "react";

const pricingData = {
  Growth: {
    INR: { price: "₹1,999", perUser: "₹699" },
    USD: { price: "$25", perUser: "$9" },
    EUR: { price: "€23", perUser: "€8" },
  },
  Pro: {
    INR: { price: "₹4,499", perUser: "₹1,299" },
    USD: { price: "$55", perUser: "$16" },
    EUR: { price: "€50", perUser: "€15" },
  },
  Business: {
    INR: { price: "₹13,499", perUser: "₹3,999" },
    USD: { price: "$160", perUser: "$50" },
    EUR: { price: "€145", perUser: "€45" },
  },
};

const PricingPage = () => {
  const [currency, setCurrency] = useState("INR");

  const handleCurrencyChange = (e) => {
    setCurrency(e.target.value);
  };

  return (
    <section className="pricing-page bg-gradient-to-r from-purple-600 to-blue-500 text-white py-20">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-5xl font-extrabold mb-6">
          Get Great Features at a Price That Makes Sense
        </h2>
        <p className="text-xl font-light mb-16">
          Affordable pricing with zero setup fees
        </p>

        {/* Currency Toggle */}
        <div className="mb-10">
          <label className="mr-4 text-lg">Choose Currency:</label>
          <select
            value={currency}
            onChange={handleCurrencyChange}
            className="p-3 border border-white text-gray-700 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-purple-300"
          >
            <option value="INR">INR</option>
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
          </select>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {Object.entries(pricingData).map(([planName, prices]) => (
            <div
              key={planName}
              className="p-8 bg-white rounded-xl shadow-lg transform transition duration-500 hover:scale-105"
            >
              <h3 className="text-2xl font-bold text-gray-800 mb-4">{planName}</h3>
              <p className="text-4xl font-extrabold text-purple-600 mb-2">
                {prices[currency].price}/month
              </p>
              <p className="text-lg text-gray-600 mb-6">
                Additional Users @ {prices[currency].perUser}/Month/User
              </p>
              <ul className="text-left mb-8 space-y-3 text-gray-700">
                <li>WhatsApp API</li>
                <li>Blue Tick Verification & Assistance</li>
                <li>Broadcast multi-media messages</li>
                <li>1,000 Free Chatbot Sessions/month</li>
                {/* Add more plan features */}
              </ul>
              <button className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition duration-300">
                Select Plan
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="container mx-auto px-4 mt-16 text-center">
        <h3 className="text-4xl font-bold mb-8">Frequently Asked Questions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* FAQ Items */}
          <div className="text-left bg-white text-gray-800 p-6 rounded-lg shadow-lg">
            <h4 className="text-xl font-semibold mb-4">Can I use my existing WhatsApp number?</h4>
            <p>Yes, we will re-register your phone number as a new Whatsapp Business Number. You can alternatively purchase a new number.</p>
          </div>
          <div className="text-left bg-white text-gray-800 p-6 rounded-lg shadow-lg">
            <h4 className="text-xl font-semibold mb-4">
                What does WhatsApp conversational-based pricing mean?
            </h4>
            <p>
                WhatsApp conversation pricing depends on your customer's country code. Check out the official Facebook pricing..
                <a 
                href="https://developers.facebook.com/docs/whatsapp/pricing/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 underline hover:text-blue-800 transition-colors duration-300"
                >
                here
                </a>.
            </p>
            </div>

          <div className="text-left bg-white text-gray-800 p-6 rounded-lg shadow-lg">
            <h4 className="text-xl font-semibold mb-4">How can I upgrade or downgrade my plan?</h4>
            <p>You can upgrade or downgrade your plan anytime from the 'Switch Plan' section...</p>
          </div>
          <div className="text-left bg-white text-gray-800 p-6 rounded-lg shadow-lg">
            <h4 className="text-xl font-semibold mb-4">Do you have any cancellation fees?</h4>
            <p>No, we do not have any cancellation fees. You can cancel your plan at any time...</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingPage;
