import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus } from "lucide-react";
import { toast } from "sonner"; 
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
  // Add logging to match original functionality
  const logBroadcastGroup = (bg) => {
    console.log("Broadcast group:", bg);
    console.log("Contacts for group:", bg.members);
    return bg;
  };

  return (
    <Dialog open={showBroadcastPopup} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
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

          {/* Contact Selection */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Select Contacts:</h3>
            <ScrollArea className="h-64 rounded-md border">
              <div className="p-4 space-y-4">
                {/* Individual Contacts */}
                {contacts?.map(contact => (
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

                {/* Broadcast Groups */}
                {broadcastGroup?.map(bg => {
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
          </div>

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