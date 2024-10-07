import React from 'react';
import { Helmet } from 'react-helmet';
import { motion, useScroll, useTransform } from 'framer-motion';
import "./new.css";
const Learn = () => {
  const FloatingElement = ({ children, yOffset = 20, duration = 3 }) => {
    const { scrollYProgress } = useScroll();
    const y = useTransform(scrollYProgress, [0, 1], [0, yOffset]);
  
    return (
      <motion.div
        style={{ y }}
        animate={{ y: [0, yOffset, 0] }}
        transition={{ repeat: Infinity, duration, ease: "easeInOut" }}
      >
        {children}
      </motion.div>
    );
  };
  return (
    <div className="ai-chatbots-page"> {/* Updated class name */}
      {/* SEO Meta Tags */}
      <Helmet>
        <title>WhatsApp Automation & Marketing | Boost Engagement & Sales</title>
        <meta name="description" content="Learn how to leverage WhatsApp automation to skyrocket your business growth. Use our WhatsApp marketing solution to engage customers and increase conversions." />
        <meta name="keywords" content="WhatsApp automation, WhatsApp marketing, chatbot marketing, customer engagement, increase sales, marketing automation" />
        <meta name="robots" content="index, follow" />
      </Helmet>

      {/* Main Content */}
      <section className="ai-chatbots-page__hero-section"> {/* Updated class name */}
        <div className="ai-chatbots-page__container"> {/* Updated class name */}
          <h1 className="learn-page__title text-5xl font-bold mb-4">WhatsApp Automation & Marketing</h1>
          <p className="learn-page__description text-xl">
            Revolutionize your customer engagement with our powerful WhatsApp automation solution. Automate conversations, drive more leads, and skyrocket your sales with ease!
          </p>
        </div>
      </section>

      <section className="ai-chatbots-page__section bg-gray-100"> {/* Updated class name */}
        <div className="ai-chatbots-page__container"> {/* Updated class name */}
          {/* Section 1: Introduction to WhatsApp Automation */}
          <h2 className="learn-page__subtitle text-3xl font-bold mb-6">What is WhatsApp Automation?</h2>
          <p className="learn-page__text mb-6 text-lg">
            WhatsApp Automation allows businesses to automate communication with customers through WhatsApp. With tools like chatbots, you can automatically respond to customer queries, send notifications, and even initiate marketing campaigns. This not only saves time but also enhances the customer experience, making it easier for businesses to convert leads into paying customers.
          </p>
          
          {/* Section 2: Benefits */}
          <h2 className="learn-page__subtitle text-3xl font-bold mb-6">Why Use WhatsApp Automation for Marketing?</h2>
          <ul className="learn-page__list list-disc ml-8 text-lg mb-6">
            <li><strong>Instant Response:</strong> Keep your customers engaged with real-time automated responses.</li>
            <li><strong>Personalized Marketing:</strong> Send personalized messages to improve your marketing efforts.</li>
            <li><strong>Increased Efficiency:</strong> Save time by automating repetitive tasks, allowing your team to focus on more important activities.</li>
            <li><strong>Enhanced Customer Experience:</strong> Provide 24/7 customer support, reducing response time and improving satisfaction.</li>
            <li><strong>Boost Conversion Rates:</strong> WhatsApp marketing campaigns have higher open rates and better engagement than traditional methods.</li>
          </ul>
          
          {/* Section 3: Features */}
          <h2 className="learn-page__subtitle text-3xl font-bold mb-6">Features of Our WhatsApp Marketing Product</h2>
          <p className="learn-page__text mb-6 text-lg">
            Our WhatsApp automation platform is designed to give your business the tools it needs to succeed in the modern marketing landscape:
          </p>
          <ul className="learn-page__list list-disc ml-8 text-lg mb-6">
            <li><strong>Chatbot Integration:</strong> Automate customer service with intelligent chatbots.</li>
            <li><strong>Broadcast Messaging:</strong> Send promotional messages to your entire customer base in a few clicks.</li>
            <li><strong>Interactive Campaigns:</strong> Engage your customers with rich media like images, videos, and buttons directly in WhatsApp.</li>
            <li><strong>Real-Time Analytics:</strong> Track the performance of your campaigns and optimize them for better results.</li>
          </ul>
        </div>
      </section>

      {/* CTA Section */}
      <section className="ai-chatbots-page__cta-section bg-green-600 text-white py-12"> {/* Updated class name */}
        <div className="ai-chatbots-page__container text-center"> {/* Updated class name */}
          <h2 className="learn-page__cta-title text-4xl font-bold mb-6">Ready to Automate Your Marketing?</h2>
          <p className="learn-page__cta-description text-xl mb-6">
            Join the hundreds of businesses using our WhatsApp automation to grow their revenue. Start your free trial today and see the results for yourself.
          </p>
          <a href="/signup" className="ai-chatbots-page__cta-button"> {/* Updated class name */}
            Get Started
          </a>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="ai-chatbots-page__section py-12 bg-gray-100"> {/* Updated class name */}
        <div className="ai-chatbots-page__container"> {/* Updated class name */}
          <h2 className="learn-page__subtitle text-3xl font-bold mb-6">Frequently Asked Questions (FAQs)</h2>
          <div className="learn-page__faq-list">
            <h3 className="learn-page__faq-title text-2xl font-semibold mb-4">1. What is WhatsApp Automation?</h3>
            <p className="learn-page__faq-text text-lg mb-6">WhatsApp automation involves using bots and other tools to manage customer interactions on WhatsApp automatically.</p>

            <h3 className="learn-page__faq-title text-2xl font-semibold mb-4">2. How can WhatsApp Marketing benefit my business?</h3>
            <p className="learn-page__faq-text text-lg mb-6">It can significantly boost customer engagement, reduce manual work, and improve your conversion rates through personalized marketing.</p>

            <h3 className="learn-page__faq-title text-2xl font-semibold mb-4">3. How can I start using WhatsApp Automation?</h3>
            <p className="learn-page__faq-text text-lg mb-6">You can sign up for a free trial with us and get started in minutes.</p>
          </div>
        </div>
      </section>

      {/* Internal Linking */}
      <section className="ai-chatbots-page__section py-12 bg-white"> {/* Updated class name */}
        <div className="ai-chatbots-page__container"> {/* Updated class name */}
          <h2 className="learn-page__subtitle text-3xl font-bold mb-6">Explore More</h2>
          <ul className="learn-page__list list-disc ml-8 text-lg">
            <li><a href="/features" className="text-green-600 underline">WhatsApp Automation Features</a></li>
            <li><a href="/pricing" className="text-green-600 underline">Pricing</a></li>
            <li><a href="/blog" className="text-green-600 underline">Latest Blog on WhatsApp Marketing</a></li>
            <li><a href="/signup" className="text-green-600 underline">Sign Up for Free Trial</a></li>
          </ul>
        </div>
      </section>
    </div>
  );
};

export default Learn;
