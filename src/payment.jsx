import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { Check, Calendar, Shield, Clock, CreditCard, AlertCircle } from 'lucide-react';
import axiosInstance, { djangoURL } from './api.jsx';
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";


const dialogVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { type: "spring", duration: 0.3 }
  },
  exit: { 
    opacity: 0, 
    scale: 0.95,
    transition: { duration: 0.2 }
  }
};

const buttonVariants = {
  tap: { scale: 0.98 },
  hover: { scale: 1.02 }
};


const PaymentDialog = ({ isOpen, onClose, selectedPlan, planDetails }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog open={isOpen} onOpenChange={onClose}>
          <motion.div
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={dialogVariants}
          >
            <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Confirm Subscription</DialogTitle>
              <DialogDescription>
                Review your plan details before proceeding with the payment
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              {/* Plan Details */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium">Plan</span>
                  <span className="font-bold text-blue-600">{planDetails?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Amount</span>
                  <span className="font-bold">₹{planDetails?.price}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Duration</span>
                  <span>for one {planDetails?.billingCycle.slice(0,-2)}</span>
                </div>
              </div>

              {/* Features */}
              <div className="border-t pt-4 pb-4">
                <h4 className="font-medium mb-2">Plan Features:</h4>
                <ul className="space-y-2">
                  {planDetails?.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-green-500" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

                <RazorpayButton 
                  selectedPlan={selectedPlan}
                  isCurrentPlan={false}
                  onPaymentInitiated={onClose} // Pass the close handler here

                  onPaymentSuccess={(paymentResponse) => {
                    console.log('Payment Successful:', paymentResponse);
                  }}

                  onPaymentFailure={(paymentResponse) => {
                    console.log('Payment Failed:', paymentResponse);
                  }}
                />
            </div>
            </DialogContent>
          </motion.div>
        </Dialog>
      )}
    </AnimatePresence>
  );
};

const RAZORPAY_BUTTON_IDS = {
  'plan_Pon6Uno5uktIC4': 'pl_Pwn75lx0zWzkuX', // Basic Plan
  'plan_Pon6DdCSMahsu7': 'pl_PxA3pUu4eJiGZh', // Premium Plan
  'plan_Pon5wTJRvRQ0uC': 'pl_PxA64Vu3OJ6ySj'  // Enterprise Plan
};

const RazorpayButton = React.memo(({ selectedPlan, isCurrentPlan, onPaymentInitiated, onPaymentSuccess, onPaymentFailure }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);
  const formRef = useRef(null);
  const previousScriptRef = useRef(null);

  const getTenantIdFromUrl = () => {
    const pathArray = window.location.pathname.split('/');
    if (pathArray.length >= 2) {
      return pathArray[1]; 
    }
    return null; 
  };

  useEffect(() => {
    if (!selectedPlan) return;

    const paymentButtonId = RAZORPAY_BUTTON_IDS[selectedPlan];
    if (!paymentButtonId) {
      setError('Invalid plan selection');
      return;
    }

    
    const tenantId = getTenantIdFromUrl()

    const loadRazorpayScript = () => {
      if (previousScriptRef.current) {
        previousScriptRef.current.remove();
        previousScriptRef.current = null;
      }

      if (formRef.current) {
        formRef.current.innerHTML = `<div id="razorpay-payment-button"></div>`;
      }

      console.log("tenant id: ", tenantId)
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/payment-button.js';
      script.async = true;
      script.dataset.payment_button_id = paymentButtonId;
    
      script.onload = () => {
        setIsLoaded(true);
        setError(null);

        const razorpayBtn = document.querySelector('.razorpay-payment-button');
        if (razorpayBtn) {
          razorpayBtn.addEventListener('click', () => {
            setTimeout(() => {
              if (onPaymentInitiated) onPaymentInitiated();
            }, 100);
          });
        }
      };
      
      script.onerror = () => {
        setError('Payment system temporarily unavailable');
        setIsLoaded(false);
      };

      if (formRef.current) {
        formRef.current.appendChild(script);
        previousScriptRef.current = script;
      }
    };

    console.log("tenant id again complete: ", tenantId)
    setIsLoaded(false);
    loadRazorpayScript();

    // Cleanup function
    return () => {
      if (previousScriptRef.current) {
        previousScriptRef.current.remove();
        previousScriptRef.current = null;
      }
    };
  }, [selectedPlan]);

  if (isCurrentPlan) {
    return (
      <div className="w-full py-2 px-4 text-center bg-gray-100 rounded-md text-gray-600 font-medium">
        Current Active Plan
      </div>
    );
  }

  return (
    <div className="relative w-full min-h-[40px] flex justify-center">
      <form ref={formRef}>
        <div id="razorpay-payment-button" />
      </form>
      
      
      {error && (
        <div className="text-red-500 text-sm mt-2 flex items-center justify-center gap-2">
          <AlertCircle className="h-4 w-4" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
});

const SubscriptionPage = () => {
  const [state, setState] = useState({
    selectedPlan: null,
    error: '',
    plans: [],
    currentSubscription: null,
    isLoading: true,
    isPaymentDialogOpen: false
  });

  const { selectedPlan, error, plans, currentSubscription, isLoading, isPaymentDialogOpen } = state;
  

  const handlePayNowClick = useCallback(() => {
    if (!selectedPlan) {
      setState(prev => ({ ...prev, error: 'Please select a plan first' }));
      return;
    }
    setState(prev => ({ ...prev, isPaymentDialogOpen: true }));
  }, [selectedPlan]);

  const getSelectedPlanDetails = useCallback(() => {
    return plans.find(plan => plan.id === selectedPlan);
  }, [plans, selectedPlan]);
  
  const handleDialogClose = useCallback(() => {
    setState(prev => ({ ...prev, isPaymentDialogOpen: false }));
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [plansResponse, subscriptionResponse] = await Promise.all([
          axiosInstance.get(`${djangoURL}/plan/`),
          axiosInstance.get(`${djangoURL}/get-subscription/`)
        ]);

        const formattedPlans = plansResponse.data
          .slice()
          .reverse()
          .map(plan => ({
            id: plan.id,
            name: plan.name,
            price: plan.amount,
            description: plan.description,
            features: plan.features || [],
            razorpayButtonId: plan.razorpay_button_id,
            popular: false,
            billingCycle: "Monthly"
          }));

        setState(prev => ({
          ...prev,
          plans: formattedPlans,
          currentSubscription: subscriptionResponse.data,
          isLoading: false
        }));
      } catch (err) {
        setState(prev => ({
          ...prev,
          error: 'Failed to load subscription data',
          isLoading: false
        }));
        console.error('Error fetching data:', err);
      }
    };

    fetchData();
  }, []);

  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="rounded-full h-8 w-8 border-b-2 border-blue-600"
        />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-gray-50 p-4"
    >
      <Card className="w-full max-w-4xl mx-auto shadow-lg">
        {/* Header Section */}
        <CardHeader className="text-center border-b bg-white rounded-t-lg">
          <CardTitle className="text-2xl font-bold">Your Subscription Status</CardTitle>
          <p className="text-gray-600 mt-2">Manage your plan and payments</p>
        </CardHeader>
  
        {/* Subscription Status Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="border-b bg-blue-50 p-6"
        >
          <div className="grid md:grid-cols-3 gap-4">
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="flex items-center gap-3"
            >
              <Clock className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Days Remaining</p>
                <p className="text-lg font-bold">
                  {currentSubscription?.daysRemaining ?? '0'} days
                </p>
              </div>
            </motion.div>
  
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="flex items-center gap-3"
            >
              <Calendar className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Next Billing Date</p>
                <p className="text-lg font-bold">
                  {currentSubscription?.nextBillingDate ? 
                    new Date(currentSubscription.nextBillingDate).toLocaleDateString() : 
                    'Not available'}
                </p>
              </div>
            </motion.div>
  
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="flex items-center gap-3"
            >
              <CreditCard className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Current Plan</p>
                <p className="text-lg font-bold capitalize">
                  {currentSubscription?.currentPlan?.planName ?? 'No active plan'}
                </p>
              </div>
            </motion.div>
          </div>
        </motion.div>
  
        <CardContent className="p-6">
          <div className="space-y-6">
            {/* Security Badge */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex items-center justify-center gap-2 bg-blue-50 p-3 rounded-lg"
            >
              <Shield className="h-5 w-5 text-blue-600" />
              <span className="text-sm text-blue-700">Secure Payment</span>
            </motion.div>
  
            {/* Plans Grid */}
            <RadioGroup
              value={selectedPlan}
              onValueChange={(value) => setState(prev => ({ ...prev, selectedPlan: value }))}
              className="grid md:grid-cols-3 gap-4"
            >
              {plans.map((plan, index) => (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  whileHover={{ scale: 1.02 }}
                  className={cn(
                    "relative flex flex-col border-2 rounded-xl p-6 transition-all",
                    selectedPlan === plan.id ? "border-blue-500 bg-blue-50" : "border-gray-200",
                    currentSubscription?.currentPlan?.planId === plan.id ? "ring-2 ring-blue-200" : "",
                    "hover:border-blue-500"
                  )}
                >
                  {plan.popular && (
                    <Badge className="absolute -top-3 right-4 bg-blue-500">
                      Most Popular
                    </Badge>
                  )}
  
                  {currentSubscription?.currentPlan?.planId === plan.id && (
                    <Badge className="absolute -top-3 left-4 bg-green-500">
                      Current Plan
                    </Badge>
                  )}
  
                  <RadioGroupItem 
                    value={plan.id} 
                    id={plan.id} 
                    className="absolute right-4 top-4" 
                  />
  
                  <div>
                    <div>
                      <h3 className="text-xl font-bold">{plan.name}</h3>
                      <p className="text-gray-600 text-sm mt-1">{plan.description}</p>
                    </div>
  
                    <div className="mt-4">
                      <div className="text-3xl font-bold text-blue-600">
                        ₹{plan.price.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-600">
                        per {plan.billingCycle.toLowerCase().slice(0,-2)}
                      </div>
                    </div>
  
                    <ul className="space-y-2 mt-4">
                      {plan.features.map((feature, index) => (
                        <motion.li 
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1 * index }}
                          className="flex items-center gap-2"
                        >
                          <Check className="h-5 w-5 text-green-500" />
                          <span className="text-gray-600">{feature}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              ))}
            </RadioGroup>
  
            {/* Payment Button Section */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex justify-center w-full mt-6"
            >
              <div className="w-full max-w-md mx-auto">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  variants={buttonVariants}
                >
                  <Button
                    onClick={handlePayNowClick}
                    disabled={!selectedPlan || currentSubscription?.currentPlan?.planId === selectedPlan}
                    className="w-full py-6 text-lg"
                    variant="default"
                  >
                    {currentSubscription?.currentPlan?.planId === selectedPlan
                      ? "Current Active Plan"
                      : "Pay Now"}
                  </Button>
                </motion.div>
              </div>
            </motion.div>
  
            {/* Error Display */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <Alert variant="destructive" className="mt-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </CardContent>
      </Card>
  
      {/* Payment Dialog */}
      <PaymentDialog
        isOpen={isPaymentDialogOpen}
        onClose={handleDialogClose}
        selectedPlan={selectedPlan}
        planDetails={getSelectedPlanDetails()}
      />
    </motion.div>
  );
};

export default React.memo(SubscriptionPage);