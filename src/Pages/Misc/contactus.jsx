import React, { useState, useEffect } from "react";
import { MapPin, Phone, Mail, Clock, Send, ArrowRight, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const ContactUs = () => {
  const [showAnimation, setShowAnimation] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  useEffect(() => {
    // Trigger animations after component mounts
    setShowAnimation(true);
    
    // Scroll to top on component mount
    window.scrollTo(0, 0);
  }, []);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setName("");
      setEmail("");
      setMessage("");
      
      // Reset success message after 5 seconds
      setTimeout(() => {
        setIsSubmitted(false);
      }, 5000);
    }, 1500);
  };

  const fadeInUpVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6 }
    }
  };
  
  // Common card styling
  const cardBaseStyle = "bg-card/80 backdrop-blur-sm rounded-2xl shadow-md overflow-hidden transition-all duration-300 group border border-border/40 hover:border-emerald-500/30 hover:bg-emerald-500/5";
  
  // Contact info items with consistent structure
  const contactItems = [
    {
      icon: <MapPin className="w-5 h-5 text-emerald-500" />,
      title: "Address",
      content: "44 Backary Portion, 2nd Floor, Regal Building, New Delhi - 110 001",
      action: {
        text: "View on larger map",
        href: "https://maps.google.com/?q=Regal+Building+New+Delhi",
        external: true
      }
    },
    {
      icon: <Phone className="w-5 h-5 text-emerald-500" />,
      title: "Phone",
      content: "+1 (619) 456-0588",
      action: {
        text: "Call now",
        href: "tel:+16194560588",
        external: false
      }
    },
    {
      icon: <Mail className="w-5 h-5 text-emerald-500" />,
      title: "Email",
      content: "founder@nuren.ai",
      action: {
        text: "Send email",
        href: "mailto:founder@nuren.ai",
        external: false
      }
    },
    {
      icon: <Clock className="w-5 h-5 text-emerald-500" />,
      title: "Working Hours",
      content: "Mon - Saturday: 9 AM - 9 PM (IST)",
      subtext: "GMT+5:30"
    }
  ];
  
  return (
    <div className="min-h-screen bg-black">
      {/* Background pattern */}
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
              Get in touch with us
            </Badge>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent">
            Contact Us
          </h1>
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
            Have questions or need assistance? We're here to help you get the most out of our WhatsApp automation solutions.
          </p>
        </motion.div>

        <div className="max-w-6xl mx-auto">
          {/* Top row with form and contact info */}
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={showAnimation ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className={cn(cardBaseStyle, "p-6 md:p-8")}
            >
              <div className="flex items-center mb-6">
                <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                  <Send className="w-6 h-6 text-emerald-500" />
                </div>
                <h3 className="text-xl font-bold ml-4 text-foreground">Send Us a Message</h3>
              </div>
              
              {isSubmitted ? (
                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-6 text-center">
                  <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h4 className="text-xl font-bold text-emerald-500 mb-2">Message Sent!</h4>
                  <p className="text-muted-foreground">Thank you for reaching out. We'll get back to you as soon as possible.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-muted-foreground mb-2">
                      Your Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg bg-card/50 border border-border/40 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/30 transition-colors"
                      placeholder="John Doe"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-muted-foreground mb-2">
                      Your Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg bg-card/50 border border-border/40 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/30 transition-colors"
                      placeholder="john@example.com"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-muted-foreground mb-2">
                      Your Message
                    </label>
                    <textarea
                      id="message"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg bg-card/50 border border-border/40 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/30 transition-colors min-h-[150px] resize-none"
                      placeholder="How can we help you?"
                      required
                    />
                  </div>
                  
                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 rounded-lg bg-gradient-to-r from-emerald-500/80 to-emerald-500 text-white font-semibold hover:opacity-90 transition-all duration-300 group shadow-lg hover:shadow-emerald-500/30 flex items-center justify-center"
                  >
                    {isSubmitting ? (
                      <>
                        <span>Sending...</span>
                        <div className="ml-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      </>
                    ) : (
                      <>
                        <span>Send Message</span>
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </motion.div>
            
            {/* Contact Info Card */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={showAnimation ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className={cn(cardBaseStyle, "p-6 md:p-8")}
            >
              <div className="grid gap-6">
                {contactItems.map((item, index) => (
                  <div key={index} className="flex items-start">
                    <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 mr-4 flex-shrink-0">
                      {item.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-bold mb-1">{item.title}</h3>
                      <p className="text-muted-foreground text-sm break-words">{item.content}</p>
                      
                      {item.subtext && (
                        <p className="text-xs text-muted-foreground/70 mt-1">{item.subtext}</p>
                      )}
                      
                      {item.action && (
                        <a 
                          href={item.action.href} 
                          target={item.action.external ? "_blank" : undefined} 
                          rel={item.action.external ? "noopener noreferrer" : undefined}
                          className="inline-flex items-center text-sm text-emerald-500 hover:text-emerald-400 mt-2 group"
                        >
                          <span>{item.action.text}</span>
                          {item.action.external ? (
                            <ExternalLink className="ml-1 h-3 w-3 transition-transform duration-300 group-hover:translate-x-1" />
                          ) : (
                            <ArrowRight className="ml-1 h-3 w-3 transition-transform duration-300 group-hover:translate-x-1" />
                          )}
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
          
          {/* Map Card - Full width below */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={showAnimation ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className={cn(cardBaseStyle, "overflow-hidden")}
          >
            <div className="relative aspect-[21/9] w-full">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3501.6743788066396!2d77.21662841508096!3d28.63997098241636!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cfd37b741d057%3A0xcdee88e47393c3f1!2sRegal%20Building%2C%20Connaught%20Place%2C%20New%20Delhi%2C%20Delhi%20110001!5e0!3m2!1sen!2sin!4v1625123456789!5m2!1sen!2sin" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen="" 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                title="Office Location"
                className="absolute inset-0"
              ></iframe>
            </div>
            <div className="p-5 bg-card/90 backdrop-blur-sm">
              <div className="flex items-center">
                <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 mr-4">
                  <MapPin className="w-5 h-5 text-emerald-500" />
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-1">Our Location</h3>
                  <p className="text-sm text-muted-foreground">Centrally located in Connaught Place, New Delhi</p>
                </div>
                <a 
                  href="https://maps.google.com/?q=Regal+Building+New+Delhi" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="ml-auto inline-flex items-center text-sm text-emerald-500 hover:text-emerald-400 group px-3 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20"
                >
                  <span>Open in Google Maps</span>
                  <ExternalLink className="ml-1 h-3 w-3 transition-transform duration-300 group-hover:translate-x-1" />
                </a>
              </div>
            </div>
          </motion.div>
        </div>
        
        <motion.div 
          className="mt-16 text-center"
          initial={{ opacity: 0 }}
          animate={showAnimation ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
        >
          <div className="mt-12 pt-8 border-t border-border/30 flex flex-wrap justify-center gap-4">
            <Badge variant="outline" className="text-xs text-muted-foreground px-3 py-1 hover:bg-emerald-500/5 hover:text-emerald-500 hover:border-emerald-500/30 transition-colors duration-300">
              24/7 Customer Support
            </Badge>
            <Badge variant="outline" className="text-xs text-muted-foreground px-3 py-1 hover:bg-emerald-500/5 hover:text-emerald-500 hover:border-emerald-500/30 transition-colors duration-300">
              Dedicated Account Manager
            </Badge>
            <Badge variant="outline" className="text-xs text-muted-foreground px-3 py-1 hover:bg-emerald-500/5 hover:text-emerald-500 hover:border-emerald-500/30 transition-colors duration-300">
              Fast Response Time
            </Badge>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ContactUs;