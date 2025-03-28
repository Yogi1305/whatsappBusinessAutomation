import React, { useState, useEffect } from "react";
import { Zap, CheckCircle, Star, ArrowRight, Shield } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

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
    accent: "from-emerald-500/80 to-emerald-500",
    iconColor: "text-emerald-500"
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
    accent: "from-emerald-500/80 to-emerald-500",
    iconColor: "text-emerald-500",
    recommended: true
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
    accent: "from-emerald-500/80 to-emerald-500",
    iconColor: "text-emerald-500"
  }
};

const PlanIcon = ({ plan, className }) => {
  const baseClasses = cn(
    className,
    "transition-transform duration-300 group-hover:scale-110",
    pricingData[plan]?.iconColor || "text-emerald-500"
  );
  
  switch (plan) {
    case "Basic":
      return <Zap className={baseClasses} />;
    case "Professional":
      return <Star className={baseClasses} />;
    case "Enterprise":
      return <Shield className={baseClasses} />;
    default:
      return null;
  }
};

const PricingPage = () => {
  const [currency, setCurrency] = useState("INR");
  const [showAnimation, setShowAnimation] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Trigger animations after component mounts
    setShowAnimation(true);
    
    // Get user's locale currency if available
    const userLocale = navigator.language || navigator.userLanguage;
    if (userLocale.includes('US')) setCurrency('USD');
    else if (userLocale.includes('EU')) setCurrency('EUR');
    
    // Scroll to top on component mount
    window.scrollTo(0, 0);
  }, []);
  
  const handleGetStarted = () => {
    navigate('/register');
  };

  const fadeInUpVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6 }
    }
  };
  
  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };
  
  // Common card styling for both pricing and FAQ cards
  const cardBaseStyle = "relative bg-card/80 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden transition-all duration-300 group border border-border/40 hover:border-emerald-500/30 hover:bg-emerald-500/5 hover:ring-1 hover:ring-emerald-500/30";
  
  return (
    <div className="min-h-screen bg-black">
      {/* Background pattern similar to App.js */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.05)_1px,transparent_1px)] bg-[size:32px_32px] opacity-20 pointer-events-none" />
      
      <div className="container mx-auto px-4 py-12 md:py-20 relative z-10">
        <motion.div 
          className="text-center max-w-3xl mx-auto mb-16"
          initial="hidden"
          animate={showAnimation ? "visible" : "hidden"}
          variants={fadeInUpVariants}
        >
          <div className="inline-flex items-center justify-center mb-6">
            <Badge variant="outline" className="px-3 py-1 border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs font-medium">
              Choose the plan that fits your business
            </Badge>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent">
            Choose Your Perfect Plan
          </h1>
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
            Powerful WhatsApp automation solutions for businesses of all sizes
          </p>
          
          <div className="inline-flex items-center bg-card/80 backdrop-blur-sm rounded-lg p-2 shadow-md border border-border/40">
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-foreground bg-transparent font-medium"
            >
              <option value="INR">₹ INR</option>
              <option value="USD">$ USD</option>
              <option value="EUR">€ EUR</option>
            </select>
          </div>
        </motion.div>

        <motion.div 
          className="grid md:grid-cols-3 gap-6 lg:gap-8 max-w-7xl mx-auto"
          variants={staggerContainer}
          initial="hidden"
          animate={showAnimation ? "visible" : "hidden"}
        >
          {Object.entries(pricingData).map(([plan, data]) => {
            // Determine if this is the recommended plan
            const isRecommended = data.recommended;
            
            return (
              <motion.div
                key={plan}
                variants={fadeInUpVariants}
                whileHover={{ y: -8, transition: { duration: 0.2 } }}
                className={cn(
                  cardBaseStyle,
                  "flex flex-col h-full",
                  isRecommended ? 'z-10' : ''
                )}
                style={isRecommended ? { transform: 'scale(1.05)' } : {}}
              >
                <div className={`absolute inset-x-0 h-1.5 bg-gradient-to-r ${data.accent}`} />
                
                {isRecommended && (
                  <div className="absolute -right-12 top-8 bg-emerald-500 text-white px-12 py-1 rotate-45 transform text-sm font-medium shadow-md">
                    Recommended
                  </div>
                )}
                
                <div className="p-6 md:p-8 flex-grow flex flex-col">
                  <div className="flex-grow">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                        <PlanIcon plan={plan} className="w-8 h-8" />
                      </div>
                      {isRecommended && (
                        <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">
                          Most Popular
                        </Badge>
                      )}
                    </div>
                    <h3 className="text-2xl font-bold mb-2 text-foreground group-hover:text-emerald-500 transition-colors">{plan}</h3>
                    <p className="text-muted-foreground mb-4 text-sm md:text-base opacity-100 group-hover:opacity-100">{data.description}</p>
                    <div className="mb-6">
                      <span className="text-3xl md:text-4xl font-bold text-foreground group-hover:text-emerald-500 transition-colors">
                        {data[currency].price}
                      </span>
                      <span className="text-muted-foreground ml-1 opacity-100 group-hover:opacity-100">/month</span>
                    </div>
                    
                    <button 
                      onClick={handleGetStarted} 
                      className={cn(
                        "w-full py-6 rounded-lg bg-gradient-to-r",
                        data.accent,
                        "text-white font-semibold hover:opacity-90 transition-all duration-300 group",
                        "shadow-lg hover:shadow-emerald-500/30 flex items-center justify-center"
                      )}
                    >
                      <span>Get Started</span>
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </button>
                    
                    <div className="mt-8 space-y-4">
                      <h4 className="font-medium text-sm text-foreground/80 uppercase tracking-wider opacity-100 group-hover:opacity-100">Features</h4>
                      <ul className="space-y-3">
                        {data.features.map((feature, index) => (
                          <li key={index} className="flex items-start">
                            <CheckCircle className="w-5 h-5 text-emerald-500 mr-3 mt-0.5 flex-shrink-0 group-hover:text-emerald-600" />
                            <span className="text-muted-foreground text-sm opacity-100 group-hover:opacity-100">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        <motion.div 
          className="mt-24 max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 40 }}
          animate={showAnimation ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          <h2 className="text-3xl font-bold text-center mb-10 bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent">
            Frequently Asked Questions
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                question: "How do I get started?",
                answer: "Choose your preferred plan and complete the registration process. Our team will help you set up your WhatsApp Business account and guide you through the features."
              },
              {
                question: "Can I upgrade my plan later?",
                answer: "Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle."
              },
              {
                question: "What kind of support do you offer?",
                answer: "All plans include standard support. Enterprise plans come with 24/7 priority support and dedicated account management."
              },
              {
                question: "Is there a setup fee?",
                answer: "No, there are no hidden fees or setup charges. You only pay the monthly subscription fee for your chosen plan."
              }
            ].map((faq, index) => (
              <motion.div 
                key={index} 
                className={cn(cardBaseStyle)}
                initial={{ opacity: 0, y: 20 }}
                animate={showAnimation ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ delay: 0.4 + (index * 0.1), duration: 0.5 }}
                whileHover={{ y: -8, transition: { duration: 0.2 } }}
              >
                <div className="absolute inset-x-0 h-1.5 bg-gradient-to-r from-emerald-500/80 to-emerald-500" />
                <div className="p-6 md:p-8">
                  <div className="flex items-center mb-4">
                    <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                      <CheckCircle className="w-6 h-6 text-emerald-500 group-hover:text-emerald-600 transition-colors" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-foreground group-hover:text-emerald-500 transition-colors">{faq.question}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed opacity-100 group-hover:opacity-100">{faq.answer}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
        
        <motion.div 
          className="mt-16 text-center"
          initial={{ opacity: 0 }}
          animate={showAnimation ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
        >
          <div className="mt-12 pt-8 border-t border-border/30 flex flex-wrap justify-center gap-4">
            <Badge variant="outline" className="text-xs text-muted-foreground px-3 py-1 hover:bg-emerald-500/5 hover:text-emerald-500 hover:border-emerald-500/30 transition-colors duration-300">
              30-day money-back guarantee
            </Badge>
            <Badge variant="outline" className="text-xs text-muted-foreground px-3 py-1 hover:bg-emerald-500/5 hover:text-emerald-500 hover:border-emerald-500/30 transition-colors duration-300">
              No credit card required for trial
            </Badge>
            <Badge variant="outline" className="text-xs text-muted-foreground px-3 py-1 hover:bg-emerald-500/5 hover:text-emerald-500 hover:border-emerald-500/30 transition-colors duration-300">
              Cancel anytime
            </Badge>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PricingPage;