import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";

const GroupPopup = ({
  showGroupPopup = false,
  groupName = '',
  contacts = [],
  broadcastGroup = [],
  selectedPhones = [],
  onGroupNameChange = () => {},
  onPhoneSelection = () => {},
  onCreateGroup = () => {},
  onClose = () => {},
}) => {
  return (
    <Dialog open={showGroupPopup} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Create New Group</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Group Name Input */}
          <Input
            type="text"
            value={groupName}
            onChange={(e) => onGroupNameChange(e.target.value)}
            placeholder="Enter group name"
            className="w-full"
          />

          {/* Contact Selection */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Select Contacts:</h3>
            <ScrollArea className="h-64 rounded-md border">
              <div className="p-4 space-y-4">
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
              </div>
            </ScrollArea>
          </div>

          {/* Existing Groups */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Groups:</h3>
            <ScrollArea className="h-40 rounded-md border">
              <div className="p-4 space-y-4">
                {broadcastGroup?.map(bg => (
                  <div 
                    key={bg.id} 
                    className="p-2 rounded hover:bg-gray-50"
                  >
                    <div className="grid gap-1">
                      <span className="font-medium">{bg.name}</span>
                      <span className="text-sm text-gray-500">
                        {bg.members?.map(contact => contact.name).join(', ')}
                      </span>
                    </div>
                  </div>
                ))}
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
              onClick={onCreateGroup}
              disabled={selectedPhones.length === 0}
            >
              Create Group
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GroupPopup;