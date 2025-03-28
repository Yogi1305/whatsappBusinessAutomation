import React, { useState, useEffect } from "react";
import { Shield, ChevronDown, ChevronUp, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const PrivacyPolicy = () => {
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
      content: [
        "This privacy policy Policy explains how NURENAISSANCE FABRICA PRIVATE LIMITED we us our collects, uses, handles, and processes the data you provide us while using our products or services. By using this website or availing of the goods or services offered by us, you agree to the terms and conditions of this Policy and consent to our use, storage, disclosure, and transfer of your information or data as described herein. We are committed to protecting your privacy in accordance with applicable laws and regulations. We urge you to read this Policy to familiarize yourself with how we handle your data.",
        "NURENAISSANCE FABRICA PRIVATE LIMITED may change this Policy periodically. Please check this page for the latest version to keep yourself updated."
      ]
    },
    {
      id: "data-collection",
      title: "What Data Is Being Collected",
      content: [
        "We may collect the following information from you:"
      ],
      list: [
        "Name",
        "Contact information, including address and email address",
        "Demographic information, preferences, or interests",
        "Personal Data or other information required for providing goods or services"
      ],
      additionalContent: [
        "The meaning of Personal Data will be as defined under relevant Indian laws.",
        "Note: We will not store any credit card, debit card, or similar card data. All information collected from you will be strictly in accordance with applicable laws and guidelines."
      ]
    },
    {
      id: "data-usage",
      title: "What We Do With The Data We Gather",
      content: [
        "We require this data to provide you with our goods or services, including but not limited to:"
      ],
      list: [
        "Internal record keeping",
        "Improving our products or services",
        "Providing updates regarding our products or services, including special offers",
        "Communicating information to you",
        "Internal training and quality assurance purposes"
      ]
    },
    {
      id: "data-sharing",
      title: "Who Do We Share Your Data With",
      content: [
        "We may share your information with:"
      ],
      list: [
        "Third parties, including our service providers, to facilitate goods or services",
        "Our group companies (to the extent relevant)",
        "Our auditors or advisors, as required for their services",
        "Governmental bodies and regulatory authorities, as required by law"
      ]
    },
    {
      id: "cookies",
      title: "How We Use Cookies",
      content: [
        "We use cookies to collect information and understand customer behavior. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to avail our goods or services fully. We do not control the use of cookies by third parties, which have their own privacy policies."
      ]
    },
    {
      id: "rights",
      title: "Your Rights Relating to Your Data",
      content: [
        "You have the following rights regarding your data:"
      ],
      list: [
        "Right to Review: You can review the data you provided and request us to correct or amend it. However, we will not be responsible for the authenticity of the information you provide.",
        "Withdrawal of Your Consent: You can choose not to provide your data or withdraw your consent at any time. Please note that if you choose not to provide or later withdraw your consent, we may not be able to provide our services or goods."
      ],
      additionalContent: [
        "These rights are subject to our compliance with applicable laws."
      ]
    },
    {
      id: "retention",
      title: "How Long Will We Retain Your Information?",
      content: [
        "We may retain your information as long as we are providing goods and services to you and as permitted under applicable law. We may also retain your data even after the termination of the business relationship with us, processing it in accordance with applicable laws and this Policy."
      ]
    },
    {
      id: "security",
      title: "Data Security",
      content: [
        "We will use commercially reasonable and legally required precautions to preserve the integrity and security of your information."
      ]
    },
    {
      id: "contact",
      title: "Queries / Grievance Officer",
      content: [
        "For any queries, questions, or grievances about this Policy, please contact us using the contact information provided on this website."
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
            Privacy Policy
          </h1>
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
            How we collect, use, and protect your personal information
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
                    <Shield className="w-5 h-5 text-emerald-500" />
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
                    {section.content.map((paragraph, i) => (
                      <p key={i} className="text-muted-foreground text-sm leading-relaxed">
                        {paragraph}
                      </p>
                    ))}
                    
                    {section.list && (
                      <ul className="space-y-2 pl-5 mt-4">
                        {section.list.map((item, i) => (
                          <li key={i} className="text-muted-foreground text-sm flex items-start">
                            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 mr-2 flex-shrink-0"></span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                    
                    {section.additionalContent && section.additionalContent.map((paragraph, i) => (
                      <p key={i} className="text-muted-foreground text-sm leading-relaxed">
                        {paragraph}
                      </p>
                    ))}
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
            If you have any questions about our Privacy Policy, please <a href="/contactus" className="text-emerald-500 hover:text-emerald-400 transition-colors">contact us</a>.
          </p>
          
          <div className="mt-8 pt-8 border-t border-border/30 flex flex-wrap justify-center gap-4">
            <Badge variant="outline" className="text-xs text-muted-foreground px-3 py-1 hover:bg-emerald-500/5 hover:text-emerald-500 hover:border-emerald-500/30 transition-colors duration-300">
              Data Protection
            </Badge>
            <Badge variant="outline" className="text-xs text-muted-foreground px-3 py-1 hover:bg-emerald-500/5 hover:text-emerald-500 hover:border-emerald-500/30 transition-colors duration-300">
              GDPR Compliant
            </Badge>
            <Badge variant="outline" className="text-xs text-muted-foreground px-3 py-1 hover:bg-emerald-500/5 hover:text-emerald-500 hover:border-emerald-500/30 transition-colors duration-300">
              Secure Processing
            </Badge>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;