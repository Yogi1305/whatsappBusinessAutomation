import React, { useState, useMemo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronDown, ChevronRight, Trash2 } from "lucide-react";
import axios from 'axios';
import { toast } from "sonner";
const getTenantIdFromUrl = () => {
  // Example: Extract tenant_id from "/3/home"
  const pathArray = window.location.pathname.split('/');
  if (pathArray.length >= 2) {
    return pathArray[1]; // Assumes tenant_id is the first part of the path
  }
  return null; // Return null if tenant ID is not found or not in the expected place
};

const formatDate = (dateString) => {
  try {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  } catch (error) {
    console.error('Invalid date:', dateString);
    return 'Invalid Date';
  }
};

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
  // State to track expanded groups
  const [expandedGroups, setExpandedGroups] = useState([]);
  const [hoveredGroup, setHoveredGroup] = useState(null);
  const [deletingGroupId, setDeletingGroupId] = useState(null);
  const tenantID = getTenantIdFromUrl();

  // Delete group handler
  const handleDeleteGroup = async (groupId) => {
    // Confirmation dialog
    

    try {
      // Start deletion process
      setDeletingGroupId(groupId);

      // Perform delete request with tenant ID in headers
      const response = await axios.delete(
        `https://fastapione-gue2c5ecc9c4b8hy.centralindia-01.azurewebsites.net/broadcast-groups/${groupId}/`,
        {
          headers: {
            'X-Tenant-Id': tenantID,
            'Content-Type': 'application/json'
          }
        }
      );

      // Show success toast with server message
      toast.success(response.data.message || 'Group deleted successfully');

      // Trigger groups update callback
    
    } catch (error) {
      // Comprehensive error handling
      console.error('Error deleting group:', error);
      
      if (error.response) {
        // Server responded with an error
        const errorMessage = error.response.data.detail || 'Failed to delete group';
        
        // Different toast styles based on error type
        switch (error.response.status) {
          case 404:
            toast.error('Group not found');
            break;
          case 401:
            toast.error('Unauthorized: Please check your credentials');
            break;
          case 403:
            toast.error('Forbidden: You do not have permission to delete this group');
            break;
          default:
            toast.error(errorMessage);
        }
      } else if (error.request) {
        // Request made but no response received
        toast.error('No response from server. Please check your network connection.');
      } else {
        // Something else went wrong
        toast.error('An unexpected error occurred');
      }
    } finally {
      // Reset deleting state
      setDeletingGroupId(null);
    }
  };
  // Toggle group expansion
  const toggleGroupExpansion = (groupId) => {
    setExpandedGroups(prev => 
      prev.includes(groupId) 
        ? prev.filter(id => id !== groupId)
        : [...prev, groupId]
    );
  };

  // Sort contacts by createdOn date (most recent first)
  const sortedContacts = useMemo(() => {
    return [...contacts].sort((a, b) => {
      // Use the createdOn field from your contact object
      return new Date(b.createdOn) - new Date(a.createdOn);
    });
  }, [contacts]);

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
                {sortedContacts?.map(contact => (
                  <label
                    key={contact.id}
                    className="flex items-center space-x-3 hover:bg-gray-50 p-2 rounded cursor-pointer"
                  >
                    <Checkbox
                      checked={selectedPhones.includes(contact)}
                      onCheckedChange={() => onPhoneSelection(contact)}
                      id={`contact-${contact.id}`}
                    />
                    <div className="grid gap-1 flex-grow">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">
                          {contact.name || contact.phone}
                        </span>
                        <span className="text-xs text-gray-500">
                          {formatDate(contact.createdOn)}
                        </span>
                      </div>
                      {contact.name && (
                        <span className="text-sm text-gray-500">{contact.phone}</span>
                      )}
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
                    className="space-y-2 relative group"
                    onMouseEnter={() => setHoveredGroup(bg.id)}
                    onMouseLeave={() => setHoveredGroup(null)}
                  >
                    <div 
                      className="flex items-center justify-between p-2 rounded hover:bg-gray-50"
                    >
                      <div className="grid gap-1 flex-grow">
                        <span className="font-medium">{bg.name}</span>
                        <span className="text-sm text-gray-500">
                          {bg.members?.length > 5 
                            ? `${bg.members.length} contacts` 
                            : bg.members?.map(contact => contact.name).join(', ')
                          }
                        </span>
                      </div>
                      
                      {bg.members?.length > 5 && (
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => toggleGroupExpansion(bg.id)}
                          className="h-8 w-8 p-0"
                        >
                          {expandedGroups.includes(bg.id) 
                            ? <ChevronDown className="w-4 h-4" /> 
                            : <ChevronRight className="w-4 h-4" />}
                        </Button>
                      )}

                      {/* Delete Group Button */}
                      {hoveredGroup === bg.id && (
                         <Button
                         variant="destructive"
                         size="sm"
                         onClick={() => handleDeleteGroup(bg.id)}
                         disabled={deletingGroupId === bg.id}
                         className="h-8 w-8 p-0 opacity-80 hover:opacity-100"
                       >
                         {deletingGroupId === bg.id ? (
                           <span className="animate-spin">🔄</span>
                         ) : (
                           <Trash2 className="w-4 h-4" />
                         )}
                       </Button>
                      )}
                    </div>
                    
                    {/* Expanded Group Members */}
                    {expandedGroups.includes(bg.id) && bg.members?.length > 5 && (
                      <div className="ml-8 space-y-2 border-l pl-4">
                        {bg.members.map(contact => (
                          <div 
                            key={contact.id} 
                            className="flex items-center space-x-3"
                          >
                            <span className="font-medium">{contact.name}</span>
                            <span className="text-sm text-gray-500">{contact.phone}</span>
                          </div>
                        ))}
                      </div>
                    )}
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