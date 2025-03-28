import React, { useState, useEffect } from "react";
import { FileText, ChevronDown, ChevronUp, Shield, CreditCard, AlertTriangle, Link, Globe, Mail } from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const TermsAndConditions = () => {
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
      icon: <FileText className="w-5 h-5 text-emerald-500" />,
      content: [
        "These Terms and Conditions, along with our privacy policy or other terms (\"Terms\"), constitute a binding agreement between NURENAISSANCE FABRICA PRIVATE LIMITED (\"Website Owner\", \"we\", \"us\", \"our\") and you (\"you\" or \"your\") regarding your use of our website and services (collectively, \"Services\").",
        "By using our website and availing of the Services, you agree that you have read and accepted these Terms (including the Privacy Policy). We reserve the right to modify these Terms at any time without assigning any reason. It is your responsibility to periodically review these Terms to stay informed of updates."
      ]
    },
    {
      id: "use-of-services",
      title: "Use of Services",
      icon: <Shield className="w-5 h-5 text-emerald-500" />,
      content: [
        "To access and use the Services, you agree to provide true, accurate, and complete information during and after registration. You shall be responsible for all acts done through your registered account.",
        "Neither we nor any third parties provide any warranty or guarantee regarding the accuracy, timeliness, performance, completeness, or suitability of the information and materials offered on this website or through the Services for any specific purpose. You acknowledge that such information may contain inaccuracies or errors, and we expressly exclude liability for any such inaccuracies or errors to the fullest extent permitted by law."
      ]
    },
    {
      id: "proprietary-rights",
      title: "Proprietary Rights",
      icon: <Shield className="w-5 h-5 text-emerald-500" />,
      content: [
        "The contents of the website and the Services are proprietary to us. You will not have any authority to claim any intellectual property rights, title, or interest in its contents. Unauthorized use of the website or the Services may lead to action against you as per these Terms or applicable laws."
      ]
    },
    {
      id: "payment-refunds",
      title: "Payment and Refunds",
      icon: <CreditCard className="w-5 h-5 text-emerald-500" />,
      content: [
        "You agree to pay us the charges associated with availing the Services. If you do not raise a refund claim within the stipulated time, you will be ineligible for a refund. You are entitled to claim a refund if we are unable to provide the Service, and the timelines for such return and refund will be according to the specific Service you have availed or within the time period provided in our policies (as applicable)."
      ]
    },
    {
      id: "prohibited-use",
      title: "Prohibited Use",
      icon: <AlertTriangle className="w-5 h-5 text-emerald-500" />,
      content: [
        "You agree not to use the website and/or Services for any unlawful, illegal, or forbidden purpose by these Terms or applicable laws."
      ]
    },
    {
      id: "third-party-links",
      title: "Third Party Links",
      icon: <Link className="w-5 h-5 text-emerald-500" />,
      content: [
        "The website and Services may contain links to third-party websites. Upon accessing these links, you will be governed by the terms of use and privacy policy of such third-party websites."
      ]
    },
    {
      id: "governing-law",
      title: "Governing Law",
      icon: <Globe className="w-5 h-5 text-emerald-500" />,
      content: [
        "These Terms and any dispute or claim relating to them, or their enforceability, shall be governed by and construed in accordance with the laws of India. All disputes arising out of or in connection with these Terms shall be subject to the exclusive jurisdiction of the courts in New Delhi, Delhi."
      ],
      highlights: ["New Delhi, Delhi"]
    },
    {
      id: "contact",
      title: "Contact Information",
      icon: <Mail className="w-5 h-5 text-emerald-500" />,
      content: [
        "All concerns or communications relating to these Terms must be communicated to us using the contact information provided on this website."
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
              Last updated on 30-09-2024
            </Badge>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent">
            Terms & Conditions
          </h1>
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
            The rules and guidelines governing the use of our services
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
                    {section.content.map((paragraph, i) => {
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
                      <ul className="space-y-3 pl-5 mt-4">
                        {section.list.map((item, i) => (
                          <li key={i} className="text-muted-foreground text-sm flex items-start">
                            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 mr-2 flex-shrink-0"></span>
                            <span>{item}</span>
                          </li>
                        ))}
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
            By using our services, you agree to these Terms & Conditions. If you have any questions, please <a href="/contactus" className="text-emerald-500 hover:text-emerald-400 transition-colors">contact us</a>.
          </p>
          
          <div className="mt-8 pt-8 border-t border-border/30 flex flex-wrap justify-center gap-4">
            <Badge variant="outline" className="text-xs text-muted-foreground px-3 py-1 hover:bg-emerald-500/5 hover:text-emerald-500 hover:border-emerald-500/30 transition-colors duration-300">
              Legal Compliance
            </Badge>
            <Badge variant="outline" className="text-xs text-muted-foreground px-3 py-1 hover:bg-emerald-500/5 hover:text-emerald-500 hover:border-emerald-500/30 transition-colors duration-300">
              User Protection
            </Badge>
            <Badge variant="outline" className="text-xs text-muted-foreground px-3 py-1 hover:bg-emerald-500/5 hover:text-emerald-500 hover:border-emerald-500/30 transition-colors duration-300">
              Fair Usage
            </Badge>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default TermsAndConditions;