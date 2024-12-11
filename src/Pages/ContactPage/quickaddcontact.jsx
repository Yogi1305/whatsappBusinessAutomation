import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Users } from 'lucide-react';
import { toast } from 'react-toastify';
import axiosInstance, { djangoURL } from "../../api";

const QuickAddContact = ({ tenantId, onContactAdded }) => {
  const [phoneNumber, setPhoneNumber] = useState('');

  const handleQuickAdd = async () => {
    if (!phoneNumber.trim()) return;

    try {
      const response = await axiosInstance.post(`${djangoURL}/contacts/`, {
        phone: phoneNumber,
        tenant: tenantId
      });

      onContactAdded(response.data);
      setPhoneNumber('');
      toast.success("Contact added successfully");
    } catch (error) {
      console.error("Error creating contact:", error);
      toast.error("Failed to add contact");
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Input 
        placeholder="Phone number" 
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
        className="w-40"
        onKeyDown={(e) => e.key === 'Enter' && handleQuickAdd()}
      />
      <Button 
        size="icon" 
        variant="outline" 
        onClick={handleQuickAdd}
        disabled={!phoneNumber.trim()}
      >
        <Users className="w-4 h-4" />
      </Button>
    </div>
  );
};

export default QuickAddContact;