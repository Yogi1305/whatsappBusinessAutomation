import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Search } from "lucide-react";

const BroadcastPopup = ({
  showBroadcastPopup = false,
  templates = [],
  selectedTemplate = null,
  contacts = [],
  broadcastGroup = [],
  selectedPhones = [],
  selectedBCGroups = [],
  isSendingBroadcast = false,
  onTemplateSelect = () => {},
  onCreateTemplate = () => {},
  onPhoneSelection = () => {},
  onBCGroupSelection = () => {},
  onSendBroadcast = () => {},
  onClose = () => {},
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTab, setSelectedTab] = useState('contacts');

  // Filter contacts based on search query
  const filteredContacts = contacts.filter(contact => 
    contact?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact?.phone?.includes(searchQuery)
  );

  // Filter groups based on search query
  const filteredGroups = broadcastGroup.filter(group => 
    group?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Keep original logging functionality
  const logBroadcastGroup = (bg) => {
    console.log("Broadcast group:", bg);
    console.log("Contacts for group:", bg.members);
    return bg;
  };

  return (
    <Dialog open={showBroadcastPopup} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Broadcast Message</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Template Selection */}
          <div className="flex items-center gap-4">
            <Select
              value={selectedTemplate?.id || undefined}
              onValueChange={(value) => 
                onTemplateSelect(templates.find(t => t.id === value))
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Template" />
              </SelectTrigger>
              <SelectContent>
                {templates?.map(template => (
                  <SelectItem key={template.id} value={template.id}>
                    {template.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button 
              onClick={onCreateTemplate}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Create Template
            </Button>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
            <Input
              placeholder="Search contacts or groups..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Tabs for Contact/Group Selection */}
          <Tabs value={selectedTab} onValueChange={setSelectedTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="contacts">Contacts</TabsTrigger>
              <TabsTrigger value="groups">Groups</TabsTrigger>
            </TabsList>

            {/* Contacts Tab */}
            <TabsContent value="contacts">
              <ScrollArea className="h-64 rounded-md border">
                <div className="p-4 space-y-2">
                  {filteredContacts.map(contact => (
                    <label
                      key={contact.id}
                      className="flex items-center space-x-3 hover:bg-gray-50 p-2 rounded cursor-pointer"
                    >
                      <Checkbox
                        checked={selectedPhones.includes(contact)}
                        onCheckedChange={() => onPhoneSelection(contact)}
                        id={`contact-${contact.id}`}
                      />
                      <div className="grid gap-1">
                        <span className="font-medium">{contact.name}</span>
                        <span className="text-sm text-gray-500">{contact.phone}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>

            {/* Groups Tab */}
            <TabsContent value="groups">
              <ScrollArea className="h-64 rounded-md border">
                <div className="p-4 space-y-2">
                  {filteredGroups.map(bg => {
                    logBroadcastGroup(bg);
                    return (
                      <label
                        key={bg.id}
                        className="flex items-center space-x-3 hover:bg-gray-50 p-2 rounded cursor-pointer"
                      >
                        <Checkbox
                          checked={selectedBCGroups.includes(bg.id)}
                          onCheckedChange={() => onBCGroupSelection(bg.id)}
                          id={`broadcast-group-${bg.id}`}
                        />
                        <div className="grid gap-1">
                          <span className="font-medium">{bg.name}</span>
                          <span className="text-sm text-gray-500">
                            {bg.members?.map(contact => contact.name).join(', ')}
                          </span>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>

          {/* Actions */}
          <div className="flex justify-end gap-4">
            <Button
              variant="outline"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              onClick={onSendBroadcast}
              disabled={isSendingBroadcast || (selectedPhones.length === 0 && selectedBCGroups.length === 0) || !selectedTemplate}
            >
              {isSendingBroadcast ? "Sending..." : "Send Broadcast"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BroadcastPopup;