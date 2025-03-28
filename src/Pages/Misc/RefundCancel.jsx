import React, { useState, useEffect } from "react";
import { RefreshCw, ChevronDown, ChevronUp, AlertCircle, Clock, CreditCard, HelpCircle } from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const CancellationRefundPolicy = () => {
  const [showAnimation, setShowAnimation] = useState(false);
  const [expandedSections, setExpandedSections] = useState({});
  
  useEffect(() => {
    // Trigger animations after component mounts
    setShowAnimation(true);
    
    // Scroll to top on component mount
    window.scrollTo(0, 0);
    
    // Initialize all sections as expanded
    const sections = {};
    policyData.forEach(section => {
      sections[section.id] = true;
    });
    setExpandedSections(sections);
  }, []);
  
  const toggleSection = (sectionId) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
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
        staggerChildren: 0.15
      }
    }
  };
  
  const policyData = [
    {
      id: "introduction",
      title: "Introduction",
      icon: <RefreshCw className="w-5 h-5 text-emerald-500" />,
      content: [
        "NURENAISSANCE FABRICA PRIVATE LIMITED believes in helping its customers as far as possible, and has therefore a liberal cancellation policy. Under this policy:"
      ]
    },
    {
      id: "cancellation",
      title: "Cancellation Policy",
      icon: <AlertCircle className="w-5 h-5 text-emerald-500" />,
      list: [
        "Cancellations will be considered only if the request is made immediately after placing the order. However, the cancellation request may not be entertained if the orders have been communicated to the vendors/merchants and they have initiated the process of shipping them.",
        "NURENAISSANCE FABRICA PRIVATE LIMITED does not accept cancellation requests for perishable items like flowers, eatables, etc. However, refund/replacement can be made if the customer establishes that the quality of the product delivered is not good."
      ]
    },
    {
      id: "damaged",
      title: "Damaged or Defective Items",
      icon: <AlertCircle className="w-5 h-5 text-emerald-500" />,
      list: [
        "In case of receipt of damaged or defective items, please report the same to our Customer Service team. The request will, however, be entertained once the merchant has checked and determined the same at their own end. This should be reported within 2 Days of receipt of the products.",
        "In case you feel that the product received is not as shown on the site or as per your expectations, you must bring it to the notice of our customer service within 2 Days of receiving the product. The Customer Service Team, after looking into your complaint, will take an appropriate decision."
      ],
      highlights: ["2 Days", "2 Days"]
    },
    {
      id: "warranty",
      title: "Warranty Claims",
      icon: <Clock className="w-5 h-5 text-emerald-500" />,
      content: [
        "In case of complaints regarding products that come with a warranty from manufacturers, please refer the issue to them."
      ]
    },
    {
      id: "refund",
      title: "Refund Policy",
      icon: <CreditCard className="w-5 h-5 text-emerald-500" />,
      content: [
        "In case of any refunds approved by NURENAISSANCE FABRICA PRIVATE LIMITED, it'll take 9-15 Days for the refund to be processed to the end customer."
      ],
      highlights: ["9-15 Days"]
    },
    {
      id: "contact",
      title: "Contact Us",
      icon: <HelpCircle className="w-5 h-5 text-emerald-500" />,
      content: [
        "For any queries or concerns regarding cancellations or refunds, please contact our Customer Service team using the contact information provided on this website."
      ]
    }
  ];
  
  // Common card styling
  const cardBaseStyle = "relative bg-card/80 backdrop-blur-sm rounded-2xl shadow-md overflow-hidden transition-all duration-300 group border border-border/40 hover:border-emerald-500/30 hover:bg-emerald-500/5";
  
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
              Last updated on 24-01-2025
            </Badge>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent">
            Cancellation & Refund Policy
          </h1>
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
            Our policies regarding order cancellations, returns, and refunds
          </p>
        </motion.div>

        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          animate={showAnimation ? "visible" : "hidden"}
          className="max-w-4xl mx-auto space-y-6"
        >
          {policyData.map((section, index) => (
            <motion.div
              key={section.id}
              variants={fadeInUpVariants}
              className={cn(cardBaseStyle, "overflow-hidden")}
            >
              <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-emerald-500/80 to-emerald-500" />
              
              <button 
                onClick={() => toggleSection(section.id)}
                className="w-full p-6 flex items-center justify-between text-left"
              >
                <div className="flex items-center">
                  <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 mr-4">
                    {section.icon}
                  </div>
                  <h2 className="text-xl font-bold text-foreground group-hover:text-emerald-500 transition-colors">
                    {section.title}
                  </h2>
                </div>
                {expandedSections[section.id] ? (
                  <ChevronUp className="w-5 h-5 text-muted-foreground" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-muted-foreground" />
                )}
              </button>
              
              {expandedSections[section.id] && (
                <div className="px-6 pb-6 pt-0">
                  <div className="border-t border-border/30 pt-4 mt-2 space-y-4">
                    {section.content && section.content.map((paragraph, i) => {
                      if (section.highlights) {
                        // Process paragraph to highlight specific text
                        let parts = [paragraph];
                        section.highlights.forEach(highlight => {
                          const newParts = [];
                          parts.forEach(part => {
                            if (typeof part === 'string') {
                              const splitPart = part.split(highlight);
                              for (let j = 0; j < splitPart.length; j++) {
                                newParts.push(splitPart[j]);
                                if (j < splitPart.length - 1) {
                                  newParts.push(<strong key={`${i}-${j}`} className="text-emerald-500">{highlight}</strong>);
                                }
                              }
                            } else {
                              newParts.push(part);
                            }
                          });
                          parts = newParts;
                        });
                        
                        return (
                          <p key={i} className="text-muted-foreground text-sm leading-relaxed">
                            {parts}
                          </p>
                        );
                      }
                      
                      return (
                        <p key={i} className="text-muted-foreground text-sm leading-relaxed">
                          {paragraph}
                        </p>
                      );
                    })}
                    
                    {section.list && (
                      <ul className="space-y-4 pl-5 mt-4">
                        {section.list.map((item, i) => {
                          if (section.highlights) {
                            // Process list item to highlight specific text
                            let parts = [item];
                            section.highlights.forEach(highlight => {
                              const newParts = [];
                              parts.forEach(part => {
                                if (typeof part === 'string') {
                                  const splitPart = part.split(highlight);
                                  for (let j = 0; j < splitPart.length; j++) {
                                    newParts.push(splitPart[j]);
                                    if (j < splitPart.length - 1) {
                                      newParts.push(<strong key={`${i}-${j}`} className="text-emerald-500">{highlight}</strong>);
                                    }
                                  }
                                } else {
                                  newParts.push(part);
                                }
                              });
                              parts = newParts;
                            });
                            
                            return (
                              <li key={i} className="text-muted-foreground text-sm flex items-start">
                                <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 mr-2 flex-shrink-0"></span>
                                <span>{parts}</span>
                              </li>
                            );
                          }
                          
                          return (
                            <li key={i} className="text-muted-foreground text-sm flex items-start">
                              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 mr-2 flex-shrink-0"></span>
                              <span>{item}</span>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>
        
        <motion.div 
          className="mt-16 text-center max-w-3xl mx-auto"
          initial={{ opacity: 0 }}
          animate={showAnimation ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
        >
          <p className="text-muted-foreground text-sm mb-6">
            If you have any questions about our Cancellation & Refund Policy, please <a href="/contactus" className="text-emerald-500 hover:text-emerald-400 transition-colors">contact us</a>.
          </p>
          
          <div className="mt-8 pt-8 border-t border-border/30 flex flex-wrap justify-center gap-4">
            <Badge variant="outline" className="text-xs text-muted-foreground px-3 py-1 hover:bg-emerald-500/5 hover:text-emerald-500 hover:border-emerald-500/30 transition-colors duration-300">
              Easy Returns
            </Badge>
            <Badge variant="outline" className="text-xs text-muted-foreground px-3 py-1 hover:bg-emerald-500/5 hover:text-emerald-500 hover:border-emerald-500/30 transition-colors duration-300">
              Hassle-free Cancellation
            </Badge>
            <Badge variant="outline" className="text-xs text-muted-foreground px-3 py-1 hover:bg-emerald-500/5 hover:text-emerald-500 hover:border-emerald-500/30 transition-colors duration-300">
              Quick Refunds
            </Badge>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CancellationRefundPolicy;