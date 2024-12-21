import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  MessageSquare,
  Sparkles, 
  Send,
  Bot,
  MessageCircle,
  Phone,
  Loader2
} from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
// Full Screen Loader Component
const DEFAULT_PROMPTS = [
  {
    name: "Customer Support",
    prompt: "Create a WhatsApp chatbot for handling customer support inquiries",
    icon: MessageCircle
  },
  {
    name: "Lead Generation",
    prompt: "Design a WhatsApp chatbot for collecting and qualifying leads",
    icon: Phone
  }
];



const FullScreenLoader = () => {
  const glowVariants = {
    animate: {
      scale: [1, 1.2, 1],
      opacity: [0.5, 0.8, 0.5],
    },
  };

  const particleVariants = {
    animate: {
      y: [0, -10, 0],
      opacity: [0, 1, 0],
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Background gradient effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-green-900/20 to-emerald-900/20" />
      
      {/* Animated particles */}
      <div className="absolute inset-0">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            variants={particleVariants}
            animate="animate"
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.4,
              ease: "easeInOut",
            }}
            className="absolute w-2 h-2 bg-[#25D366] rounded-full"
            style={{
              left: `${20 + i * 12}%`,
              top: `${30 + (i % 3) * 10}%`,
            }}
          />
        ))}
      </div>

      {/* Main loader container */}
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        className="relative"
      >
        {/* Outer rotating ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          className="w-32 h-32 rounded-full border-4 border-[#25D366]/30 border-t-[#25D366]"
        />
        
        {/* Middle rotating ring */}
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 w-32 h-32 rounded-full border-4 border-emerald-400/30 border-t-emerald-400"
        />

        {/* Glowing center */}
        <motion.div
          variants={glowVariants}
          animate="animate"
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-gradient-to-br from-[#25D366] to-emerald-400 rounded-full blur-md"
        />

        {/* Center icon */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
          <MessageCircle className="w-12 h-12 text-white" />
        </div>
      </motion.div>

      {/* Text content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-12 text-center"
      >
        <h2 className="text-2xl font-bold bg-gradient-to-r from-[#25D366] to-emerald-400 bg-clip-text text-transparent">
          Building Your WhatsApp Bot
        </h2>
        <div className="flex items-center justify-center mt-4 space-x-2">
          <motion.div
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-sm text-[#25D366]"
          >
            Configuring WhatsApp Integration
          </motion.div>
          <Sparkles className="w-4 h-4 text-emerald-400" />
        </div>
      </motion.div>

      {/* Progress indicator */}
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: "60%" }}
        transition={{ duration: 3, ease: "easeInOut" }}
        className="absolute bottom-20 left-1/2 transform -translate-x-1/2 h-1 bg-gradient-to-r from-[#25D366] to-emerald-400 rounded-full"
      />
    </motion.div>
  );
};



const AIFlowGenerator = ({ onGenerateFlow, isOpen, onClose }) => {
  const [selectedPrompt, setSelectedPrompt] = useState(DEFAULT_PROMPTS[0]);
  const [customPrompt, setCustomPrompt] = useState("");
  const [nodeCount, setNodeCount] = useState(5);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState("templates");
  const [companyContext, setCompanyContext] = useState({
    name: "",
    additionalContext: ""
  });

  const handleGenerate = async () => {
    setIsGenerating(true);
    
    // Format data according to specified structure
    const formattedData = {
      prompt: activeTab === "custom" ? customPrompt : selectedPrompt.prompt,
      nodes: nodeCount,
      industry: "",
      company_name: companyContext.name,
      data: {
        additionalContext: companyContext.additionalContext,
        templateType: activeTab === "custom" ? null : selectedPrompt.name,
        customPrompt: activeTab === "custom" ? customPrompt : null
      }
    };
    
    try {
    await onGenerateFlow(formattedData);
    } finally {
      setIsGenerating(false);
      onClose();
    }
  };

  return (
    <>
       {isGenerating?
      <AnimatePresence>
    <FullScreenLoader />
      </AnimatePresence>    
:
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-lg bg-gradient-to-b from-[#DCF8C6]/20 to-background max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2 text-xl">
              <MessageSquare className="w-5 h-5 text-[#25D366]" />
              <span>WhatsApp Chatbot Builder</span>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="flex space-x-4">
              <div className="flex-1">
                <Label className="text-sm mb-2">Company Name</Label>
                <Input
                  placeholder="Enter company name"
                  value={companyContext.name}
                  onChange={(e) => setCompanyContext(prev => ({
                    ...prev,
                    name: e.target.value
                  }))}
                  className="border-[#25D366]/20 focus-visible:ring-[#25D366]"
                />
              </div>
              <div className="w-32">
                <Label className="text-sm mb-2">Steps</Label>
                <div className="flex items-center space-x-2">
                  <Slider
                    value={[nodeCount]}
                    onValueChange={([value]) => setNodeCount(value)}
                    max={20}
                    min={3}
                    step={1}
                    className="[&>span]:bg-[#25D366]"
                  />
                  <Badge variant="outline" className="bg-[#25D366]/5 text-[#075E54] w-12 justify-center">
                    {nodeCount}
                  </Badge>
                </div>
              </div>
            </div>

            <Tabs defaultValue="templates" className="w-full" onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2 h-9 mb-3">
                <TabsTrigger value="templates" className="data-[state=active]:bg-[#25D366]/10">
                  Templates
                </TabsTrigger>
                <TabsTrigger value="custom" className="data-[state=active]:bg-[#25D366]/10">
                  Custom
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="templates" className="mt-0">
                <div className="grid grid-cols-2 gap-2">
                  {DEFAULT_PROMPTS.map((template) => (
                    <motion.div
                      key={template.name}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      className={`
                        p-3 rounded-lg cursor-pointer border transition-all
                        ${selectedPrompt.name === template.name 
                          ? 'border-[#25D366] bg-[#25D366]/5' 
                          : 'hover:border-[#25D366]/50'}
                      `}
                      onClick={() => setSelectedPrompt(template)}
                    >
                      <div className="flex items-center space-x-2">
                        <template.icon className="w-4 h-4 text-[#25D366] shrink-0" />
                        <div>
                          <h3 className="font-medium text-sm">{template.name}</h3>
                          <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                            {template.prompt}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="custom" className="mt-0">
                <Textarea
                  placeholder="Describe how your WhatsApp chatbot should behave..."
                  className="h-20 resize-none border-[#25D366]/20 focus-visible:ring-[#25D366]"
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                />
              </TabsContent>
            </Tabs>

            <Textarea
              placeholder="Additional context or specific requirements..."
              value={companyContext.additionalContext}
              onChange={(e) => setCompanyContext(prev => ({
                ...prev,
                additionalContext: e.target.value
              }))}
              className="h-20 resize-none border-[#25D366]/20 focus-visible:ring-[#25D366]"
            />

            <Button 
              className="w-full bg-[#25D366] hover:bg-[#25D366]/90 text-white h-9"
              onClick={handleGenerate}
              disabled={isGenerating}
            >
              {isGenerating ? (
                <>
                  <Sparkles className="mr-2 h-4 w-4 animate-pulse" />
                  Building Chatbot...
                </>
              ) : (
                <>
                  Create WhatsApp Bot <Send className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      }
    </>
  );
};

const AIFlowGeneratorTrigger = ({ onClick }) => {
    // Combined button variants with floating animation
    const buttonVariants = {
      initial: { 
        scale: 0, 
        rotate: -180,
        y: 0 
      },
      animate: { 
        scale: 1, 
        rotate: 0,
        y: [0, -8, 0],
        transition: {
          scale: {
            type: "spring",
            stiffness: 260,
            damping: 20,
            duration: 1
          },
          y: {
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }
        }
      },
      hover: {
        scale: 1.05,
        boxShadow: "0 0 25px #25D366",
      },
      tap: { 
        scale: 0.95 
      }
    };
  
    // Sparkle animations
    const sparkleVariants = {
      initial: { scale: 0, opacity: 0 },
      animate: (i) => ({
        scale: [0, 1, 0],
        opacity: [0, 1, 0],
        transition: {
          duration: 2,
          repeat: Infinity,
          delay: i * 0.3,
          ease: "easeInOut"
        }
      })
    };
  
    // Ring pulse animation
    const pulseRingVariants = {
      initial: { scale: 0.8, opacity: 0 },
      animate: {
        scale: [1, 1.5],
        opacity: [0.5, 0],
        transition: {
          duration: 2,
          repeat: Infinity,
          ease: "easeOut"
        }
      }
    };
  
    return (
      <div className="fixed bottom-8 right-8 z-50">
        {/* Pulsing rings */}
        <motion.div
          variants={pulseRingVariants}
          initial="initial"
          animate="animate"
          className="absolute inset-0 rounded-full bg-[#25D366]/30"
        />
        
        {/* Sparkles */}
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={i}
            custom={i}
            variants={sparkleVariants}
            initial="initial"
            animate="animate"
            className="absolute"
            style={{
              top: `${-20 + (i * 15)}%`,
              left: `${-20 + (i * 40)}%`
            }}
          >
            <Sparkles className="w-4 h-4 text-[#25D366]" />
          </motion.div>
        ))}
  
        {/* Main button with combined animations */}
        <motion.div
          variants={buttonVariants}
          initial="initial"
          animate="animate"
          whileHover="hover"
          whileTap="tap"
          onClick={onClick}
          className="bg-[#25D366] text-white rounded-full p-4 shadow-lg cursor-pointer 
            flex items-center justify-center relative overflow-hidden group"
        >
          {/* Inner glow effect */}
          <motion.div
            animate={{
              opacity: [0.5, 0.8, 0.5],
              scale: [0.8, 1.2, 0.8],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute inset-0 bg-gradient-to-r from-[#25D366] to-emerald-400 opacity-50 blur-md"
          />
          
          {/* Bot icon with rotation */}
          <motion.div
            animate={{
              rotate: [0, 10, -10, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="relative z-10"
          >
            <Bot className="w-6 h-6" />
          </motion.div>
          
          <span className="sr-only">Create WhatsApp Bot</span>
        </motion.div>
      </div>
    );
  };

export { AIFlowGenerator, AIFlowGeneratorTrigger };