import React from "react";
import "./new.css";
import { motion, useScroll, useTransform } from 'framer-motion';
const AIChatbotsPage = () => {
  
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
    <div className="ai-chatbots-page">
      {/* Meta tags for SEO */}
      <head>
        <title>AI Chatbots for WhatsApp | Nuren.ai - AI-Powered WhatsApp Chatbots</title>
        <meta
          name="description"
          content="Explore how AI chatbots are transforming customer engagement on WhatsApp with Nuren.ai. Learn how AI-powered chatbots on WhatsApp can improve your business's customer support and sales."
        />
        <meta
          name="keywords"
          content="AI chatbots, WhatsApp chatbots, WhatsApp AI bots, Nuren.ai, AI-powered WhatsApp, WhatsApp automation, customer support chatbot, WhatsApp business solutions"
        />
        <meta name="robots" content="index, follow" />
      </head>

      <main className="ai-chatbots-page__main">
        <section id="hero" className="ai-chatbots-page__hero-section">
          <div className="ai-chatbots-page__container">
            <h1>AI Chatbots: The Future of Customer Engagement on WhatsApp</h1>
            <p>
              AI chatbots are revolutionizing the way businesses communicate
              with their customers. Discover how Nuren.ai brings the power of AI
              chatbots to WhatsApp, the world’s most popular messaging platform,
              to streamline customer support and sales.
            </p>
            <a href="#contact" className="ai-chatbots-page__cta-button">
              Get Started with Nuren.ai
            </a>
          </div>
        </section>

        {/* Section: Why AI Chatbots */}
        <section id="why-chatbots" className="ai-chatbots-page__section">
          <div className="ai-chatbots-page__container">
            <h2>Why AI Chatbots are Essential for Modern Businesses</h2>
            <ul>
              <li>
                <strong>Instantaneous Responses:</strong> AI chatbots provide
                real-time responses to customer inquiries, eliminating wait
                times and enhancing customer satisfaction.
              </li>
              <li>
                <strong>24/7 Availability:</strong> With chatbots, your business
                can be available to customers around the clock, even outside of
                business hours.
              </li>
              <li>
                <strong>Cost Efficiency:</strong> Automating customer
                interactions reduces the need for large support teams, cutting
                operational costs while maintaining high levels of service.
              </li>
              <li>
                <strong>Personalization at Scale:</strong> AI chatbots can
                analyze customer data and offer personalized solutions,
                increasing engagement and conversion rates.
              </li>
            </ul>
          </div>
        </section>

        {/* Section: Why WhatsApp for AI Chatbots */}
        <section id="whatsapp-chatbots" className="ai-chatbots-page__section ai-chatbots-page__bg-light">
          <div className="ai-chatbots-page__container">
            <h2>Why WhatsApp is the Best Platform for AI Chatbots</h2>
            <p>
              With over <strong>2 billion users</strong> globally, WhatsApp has
              become a crucial communication tool for businesses. Here’s why
              it’s the ideal platform for AI chatbots:
            </p>
            <ul>
              <li>
                <strong>Global Reach:</strong> WhatsApp allows businesses to
                connect with customers in real time, no matter where they are
                located.
              </li>
              <li>
                <strong>High Engagement Rates:</strong> WhatsApp messages have a
                98% open rate, ensuring your AI-powered messages are seen by
                your audience.
              </li>
              <li>
                <strong>Rich Messaging Features:</strong> WhatsApp supports
                images, videos, voice messages, and interactive buttons,
                enabling dynamic and engaging conversations with your customers.
              </li>
              <li>
                <strong>Secure and Trusted Platform:</strong> WhatsApp offers
                end-to-end encryption, making it a safe and trusted medium for
                customer communication.
              </li>
            </ul>
            <a href="#contact" className="ai-chatbots-page__cta-button">
              Learn How to Get Started with WhatsApp Chatbots
            </a>
          </div>
        </section>

        {/* Section: How Nuren.ai Enhances AI Chatbots for WhatsApp */}
        <section id="nurenai-chatbots" className="ai-chatbots-page__section">
          <div className="ai-chatbots-page__container">
            <h2>How Nuren.ai Enhances AI Chatbots for WhatsApp</h2>
            <p>
              Nuren.ai takes AI chatbots to the next level by integrating
              seamlessly with WhatsApp and offering advanced automation features
              to help businesses scale customer engagement:
            </p>
            <ul>
              <li>
                <strong>Automated Responses:</strong> Pre-configure responses to
                FAQs, inquiries, and common support requests, saving time and
                improving efficiency.
              </li>
              <li>
                <strong>Personalized Interactions:</strong> Use AI-powered
                insights to tailor conversations to individual customers based
                on their behavior and preferences.
              </li>
              <li>
                <strong>Scalability:</strong> Handle multiple customer
                conversations simultaneously without losing the personal touch.
              </li>
              <li>
                <strong>Analytics & Insights:</strong> Gain valuable insights
                into customer satisfaction and behavior to continuously improve
                your strategy.
              </li>
            </ul>
          </div>
        </section>

        {/* Section: Getting Started */}
        <section id="get-started" className="ai-chatbots-page__section ai-chatbots-page__bg-light">
          <div className="ai-chatbots-page__container">
            <h2>How to Get Started with AI Chatbots on WhatsApp</h2>
            <p>
              Getting started with AI chatbots on WhatsApp is easier than ever
              with Nuren.ai. Our platform offers easy integration, whether
              you’re a small business or an enterprise. Automate customer
              interactions, enhance customer satisfaction, and scale your
              business efficiently.
            </p>
            <ol>
              <li>
                <strong>Step 1:</strong> Sign up for Nuren.ai and integrate it
                with your WhatsApp Business account.
              </li>
              <li>
                <strong>Step 2:</strong> Configure chatbot workflows tailored to
                your business needs.
              </li>
              <li>
                <strong>Step 3:</strong> Start automating customer conversations
                and improve response times immediately.
              </li>
            </ol>
            <a href="/register" className="ai-chatbots-page__cta-button">
              Get Started Today
            </a>
          </div>
        </section>

        {/* Section: Contact Us */}
        <section id="contact" className="ai-chatbots-page__section">
          <div className="ai-chatbots-page__container">
            <h2>Contact Us</h2>
            <p>
              Ready to transform your customer engagement with AI chatbots on
              WhatsApp? Contact our team today and learn how Nuren.ai can help
              your business succeed.
            </p>
            <a href="https://calendly.com/adarsh1885/schedule-a-demo" className="ai-chatbots-page__cta-button">
              Contact Us Now
            </a>
          </div>
        </section>
      </main>
      <footer className="py-20 bg-black text-white relative overflow-hidden">
  <FloatingElement yOffset={30} duration={5}>
    <div className="absolute top-10 left-10 w-24 h-24 bg-white rounded-full opacity-10" />
  </FloatingElement>
  <FloatingElement yOffset={-20} duration={4}>
    <div className="absolute bottom-10 right-10 w-16 h-16 bg-white rounded-full opacity-10" />
  </FloatingElement>
  <div className="container mx-auto px-4">
    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-green-500">
      <div>
        <h3 className="text-2xl font-gliker mb-4">Nuren AI</h3>
        <p className="text-white">Revolutionizing WhatsApp business communication with AI-powered solutions.</p>
      </div>
      {[
        { title: "Product", links: ["Features", "Pricing", "Case Studies"] },
        { title: "Company", links: ["About Us", "Careers", "Contact"] },
        { title: "Legal", links: ["Privacy Policy", "Terms of Service", "GDPR Compliance"] },
      ].map((column, index) => (
        <div key={index}>
          <h4 className="text-xl font-gliker mb-4 ">{column.title}</h4>
          <ul className="space-y-2 ">
            {column.links.map((link, linkIndex) => (
              <li key={linkIndex}>
                <a href="#" className="text-white hover:text-green-400 transition duration-300 ">{link}</a>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
    <div className="mt-12 pt-8 border-t border-gray-800 text-center text-white font-gliker">
      <p>&copy; 2024 Nu Renaissance Fabrica Pvt Ltd. All rights reserved.</p>
    </div>
  </div>
</footer>
    </div>
  );
};

export default AIChatbotsPage;
