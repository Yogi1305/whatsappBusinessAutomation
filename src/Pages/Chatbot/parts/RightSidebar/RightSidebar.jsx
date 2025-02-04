import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ContactDetails from './ContactDetails';
import AIActions from './AIActions';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Phone, Mail, Plus, Upload } from 'lucide-react';

const RightSidebar = ({ 
  selectedContact,
  flows,
  selectedFlow,
  onFlowChange,
  onFlowSend,
  onFileUpload,
  inputFields,
  onAddField,
  onInputChange,
  onRemoveField,
  uploadStatus
}) => {
  return (
    <Card className="right-sidebar w-[350px] border-l">
      <Tabs defaultValue="contact">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="contact">Contact</TabsTrigger>
          <TabsTrigger value="ai-actions">AI Actions</TabsTrigger>
        </TabsList>

        {/* Contact Details Tab */}
        <TabsContent value="contact">
          <CardContent className="space-y-4">
            {selectedContact ? (
              <>
                <div className="flex flex-col items-center">
                  {/* Contact Avatar */}
                  {selectedContact.profileImage ? (
                    <img 
                      src={selectedContact.profileImage} 
                      alt="Profile" 
                      className="w-24 h-24 rounded-full mb-4"
                    />
                  ) : (
                    <div className="w-24 h-24 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-3xl mb-4">
                      {getInitials(selectedContact.name, selectedContact.lastName)}
                    </div>
                  )}
                  
                  {/* Contact Info */}
                  <h2 className="text-xl font-semibold">
                    {selectedContact.name} {selectedContact.lastName}
                  </h2>
                  <div className="space-y-2 mt-4">
                    <div className="flex items-center space-x-2">
                      <Phone className="text-gray-500" size={20} />
                      <span>{selectedContact.phone}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Mail className="text-gray-500" size={20} />
                      <span>{selectedContact.email || 'No email'}</span>
                    </div>
                  </div>
                </div>

                {/* Flow Selection */}
                <div className="space-y-2">
                  <Select value={selectedFlow} onValueChange={onFlowChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a flow" />
                    </SelectTrigger>
                    <SelectContent>
                      {flows.map(flow => (
                        <SelectItem key={flow.id} value={flow.id}>
                          {flow.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button 
                    className="w-full" 
                    onClick={onFlowSend}
                  >
                    Activate Flow
                  </Button>
                </div>
              </>
            ) : (
              <div className="text-center text-gray-500">
                Select a contact to view details
              </div>
            )}
          </CardContent>
        </TabsContent>

        {/* AI Actions Tab */}
        <TabsContent value="ai-actions">
          <CardContent className="space-y-4">
            <AIActions 
              onFileUpload={onFileUpload}
              inputFields={inputFields}
              onAddField={onAddField}
              onInputChange={onInputChange}
              onRemoveField={onRemoveField}
              uploadStatus={uploadStatus}
            />
          </CardContent>
        </TabsContent>
      </Tabs>
    </Card>
  );
};

// Helper function for initials
const getInitials = (firstName, lastName) => {
  return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase() || '??';
};

export default RightSidebar;