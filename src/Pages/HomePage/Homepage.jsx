import React from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, GitBranch, ArrowRight, Users, BarChart, Send, Workflow } from 'lucide-react';
import "./Homepage.css"
import hero_img from "../../assets/hero_img.png"
import hero2 from "../../assets/hero2.png"
 
const FeatureCard = ({ icon, title, description }) => (
  <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
    <div className="flex items-center justify-center w-12 h-12 bg-green-100 text-green-600 rounded-full mb-4">
      {icon}
    </div>
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

const Homepage = () => {
  return (
    <div className="flex flex-col min-h-screen main-homepage">
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-green-500 to-blue-500 text-white py-20">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-1/2 mb-8 md:mb-0">
                <h1 className="text-4xl md:text-5xl font-bold mb-4">Transform Your WhatsApp Business</h1>
                <p className="text-xl mb-6">NurenAI: The ultimate WhatsApp management system for broadcasting, flow creation, and AI-powered chatbots.</p>
                <Link to="/login" className="bg-white text-green-600 font-semibold py-2 px-6 rounded-full hover:bg-green-100 transition duration-300">
                  Get Started
                </Link>
              </div>
              <div className="md:w-1/2">
                <img src={hero_img} alt="WhatsApp Management Dashboard" className="rounded-lg hero-img" />
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-gray-100">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Powerful Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <FeatureCard
                icon={<Send size={24} />}
                title="Smart Broadcasting"
                description="Reach your audience efficiently with targeted WhatsApp broadcasts. Segment your contacts and send personalized messages at scale."
              />
              <FeatureCard
                icon={<Workflow size={24} />}
                title="Intuitive Flow Builder"
                description="Create complex conversation flows with our easy-to-use visual builder. Design interactive experiences for your customers without coding."
              />
              <FeatureCard
                icon={<MessageSquare size={24} />}
                title="AI-Powered Chatbot"
                description="Enhance customer support with our intelligent chatbot system. Automate responses and provide 24/7 assistance to your WhatsApp contacts."
              />
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">How NurenAI Works</h2>
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="md:w-1/2 mb-8 md:mb-0">
                <img src={hero2} alt="NurenAI Workflow" className="rounded-lg " />
              </div>
              <div className="md:w-1/2 md:pl-12">
                <ol className="space-y-4">
                  <li className="flex items-center">
                    <span className="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center mr-4">1</span>
                    <span>Connect your WhatsApp Business account to NurenAI</span>
                  </li>
                  <li className="flex items-center">
                    <span className="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center mr-4">2</span>
                    <span>Set up broadcast lists or design conversation flows</span>
                  </li>
                  <li className="flex items-center">
                    <span className="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center mr-4">3</span>
                    <span>Customize and train your AI chatbot</span>
                  </li>
                  <li className="flex items-center">
                    <span className="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center mr-4">4</span>
                    <span>Launch your automated WhatsApp communication system</span>
                  </li>
                  <li className="flex items-center">
                    <span className="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center mr-4">5</span>
                    <span>Monitor performance and optimize your strategies</span>
                  </li>
                </ol>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-16 bg-gray-100">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Why Choose NurenAI?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="flex items-start">
                <Users className="text-green-500 mr-4" size={24} />
                <div>
                  <h3 className="text-xl font-semibold mb-2">Improved Customer Engagement</h3>
                  <p className="text-gray-600">Interact with your customers on their preferred platform, providing quick and efficient support.</p>
                </div>
              </div>
              <div className="flex items-start">
                <BarChart className="text-green-500 mr-4" size={24} />
                <div>
                  <h3 className="text-xl font-semibold mb-2">Increased Efficiency</h3>
                  <p className="text-gray-600">Automate routine tasks and handle multiple conversations simultaneously, saving time and resources.</p>
                </div>
              </div>
              <div className="flex items-start">
                <GitBranch className="text-green-500 mr-4" size={24} />
                <div>
                  <h3 className="text-xl font-semibold mb-2">Scalable Solution</h3>
                  <p className="text-gray-600">Easily manage growing customer bases and adapt to changing business needs with our flexible platform.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-green-600 text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Revolutionize Your WhatsApp Management?</h2>
            <p className="text-xl mb-8">Join thousands of businesses already using NurenAI to streamline their communication and boost customer satisfaction.</p>
            <Link to="/ll/flow-builder" className="bg-white text-green-600 font-semibold py-3 px-8 rounded-full hover:bg-green-100 transition duration-300 inline-flex items-center">
              Start Your Free Trial <ArrowRight className="ml-2" size={20} />
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Homepage;