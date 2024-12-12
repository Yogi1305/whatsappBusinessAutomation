import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronDown, ChevronRight, ChevronLeft, ChevronRightIcon, Trash2 } from "lucide-react";
import { toast } from "sonner";
import axiosInstance from '../../../api';

// Utility function to get tenant ID from URL
const getTenantIdFromUrl = () => {
  const pathArray = window.location.pathname.split('/');
  return pathArray.length >= 2 ? pathArray[1] : null;
};

// Date formatting utility
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
  onGroupNameChange = () => {},
  onClose = () => {},
}) => {
  const [groupName, setGroupName] = useState('');
  const [contacts, setContacts] = useState([]);
  const [selectedPhones, setSelectedPhones] = useState(new Map());
  const [broadcastGroup, setBroadcastGroup] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState([]);
  const [hoveredGroup, setHoveredGroup] = useState(null);
  const [deletingGroupId, setDeletingGroupId] = useState(null);
  const [pageInputVisible, setPageInputVisible] = useState(false);
  const [pageInput, setPageInput] = useState(1);

  const tenantID = getTenantIdFromUrl();
  const fastURL = 'https://fastapione-gue2c5ecc9c4b8hy.centralindia-01.azurewebsites.net';



  const formatGroups = async (data) => {
    const groups = {};
  
    data.forEach(group => {
      const groupName = group.name;
  
      if (!groups[groupName]) {
        groups[groupName] = {
          id: group.id,
          name: groupName,
          members: group.members
        };
      }
    });
  
    return Object.values(groups).map(group => ({
      id: group.id,
      name: group.name || null,
      members: group.members
    }));
  };

  const fetchContacts = async (page = 1) => {
    try {
      setIsLoading(true);
      
      if (page === 1) {
        const broadcastGroupResponse = await axiosInstance.get(`${fastURL}/broadcast-groups/`);
        const formattedGroups = await formatGroups(broadcastGroupResponse.data);
        setBroadcastGroup(formattedGroups);
      }
      
      const response = await axiosInstance.get(`${fastURL}/contacts/${page}`);
      setTotalPages(response.data.total_pages);
      const processedContacts = response.data.contacts.map(contact => ({
        ...contact,
        name: `${contact.first_name || ''} ${contact.last_name || ''}`.trim() || contact.phone,
      }));
      
      // Preserve previously selected contacts for this contact
      const updatedContacts = processedContacts.map(contact => ({
        ...contact,
        isSelected: [...selectedPhones.values()].some(selected => selected.id === contact.id)
      }));
      
      setContacts(updatedContacts);
      setCurrentPage(page);
      setPageInputVisible(false);
    } catch (error) {
      console.error("Error fetching contacts data:", error);
      toast.error("Failed to fetch contacts");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteGroup = async (groupId) => {
    try {
      setDeletingGroupId(groupId);

      const response = await axiosInstance.delete(
        `${fastURL}/broadcast-groups/${groupId}/`,
        {
          headers: {
            'X-Tenant-Id': tenantID,
            'Content-Type': 'application/json'
          }
        }
      );

      toast.success(response.data.message || 'Group deleted successfully');
      
      // Refresh broadcast groups
      const updatedGroupsResponse = await axiosInstance.get(`${fastURL}/broadcast-groups/`);
      const formattedGroups = await formatGroups(updatedGroupsResponse.data);
      setBroadcastGroup(formattedGroups);
    
    } catch (error) {
      console.error('Error deleting group:', error);
      
      const errorMessage = error.response?.data?.detail || 'Failed to delete group';
      switch (error.response?.status) {
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
    } finally {
      setDeletingGroupId(null);
    }
  };

  const handleSelectAll = () => {
    const newSelectedPhones = new Map(selectedPhones);
    contacts.forEach(contact => {
      if (!newSelectedPhones.has(contact.id)) {
        newSelectedPhones.set(contact.id, contact);
      }
    });
    setSelectedPhones(newSelectedPhones);

    // Update contacts state
    setContacts(prevContacts => 
      prevContacts.map(contact => ({...contact, isSelected: true}))
    );
  };

  const handleDeselectAll = () => {
    const newSelectedPhones = new Map(selectedPhones);
    contacts.forEach(contact => {
      newSelectedPhones.delete(contact.id);
    });
    setSelectedPhones(newSelectedPhones);

    // Update contacts state
    setContacts(prevContacts => 
      prevContacts.map(contact => ({...contact, isSelected: false}))
    );
  };

  const onPhoneSelection = (contact) => {
    const newSelectedPhones = new Map(selectedPhones);
    
    if (newSelectedPhones.has(contact.id)) {
      newSelectedPhones.delete(contact.id);
    } else {
      newSelectedPhones.set(contact.id, contact);
    }
    
    setSelectedPhones(newSelectedPhones);

    // Update contacts state to reflect selection
    setContacts(prevContacts => 
      prevContacts.map(c => 
        c.id === contact.id 
          ? {...c, isSelected: !c.isSelected} 
          : c
      )
    );
  };

  const handleCreateGroup = async () => {
    try {
      if (!groupName || groupName.trim() === '') {
        toast.error("Group name cannot be empty!", {
            position: "top-center",
            duration: 3000
        });
        return; // Exit the function early
    }
      const members = Array.from(selectedPhones.values()).map(contact => ({
        phone: contact.phone,
        name: contact.name
      }));
      
      const payload = {
        members: members,
        id: crypto.randomUUID(),
        name: groupName
      };
      
      const response = await axiosInstance.post(`${fastURL}/broadcast-groups/`, payload, {
        headers: {
          'X-Tenant-Id': tenantID
        }
      });
  
      if (response.status === 200) {
        toast.success("Contacts added to group successfully!", {
          position: "top-center",
          duration: 3000
        });
        
        setBroadcastGroup((prevGroups) => [...prevGroups, payload]);
        
        setSelectedPhones(new Map());
        setGroupName('');
        
        onClose();
      } else {
        throw new Error("Failed to create broadcast group");
      }
    } catch (error) {
      console.error("Error creating broadcast group:", error);
      toast.error("Failed to create broadcast group");
    }
  };

  const toggleGroupExpansion = (groupId) => {
    setExpandedGroups(prev => 
      prev.includes(groupId) 
        ? prev.filter(id => id !== groupId)
        : [...prev, groupId]
    );
  };

  const handlePageInputChange = (e) => {
    const value = parseInt(e.target.value);
    setPageInput(value);
  };

  const handlePageInputSubmit = () => {
    if (pageInput > 0 && pageInput <= totalPages) {
      fetchContacts(pageInput);
    } else {
      toast.error(`Please enter a page number between 1 and ${totalPages}`);
    }
  };

  const handlePageInputBlur = () => {
    setPageInputVisible(false);
  };

  useEffect(() => {
    if (showGroupPopup) {
      fetchContacts(1);
    }
  }, [showGroupPopup]);
  return (
    <Dialog 
      open={showGroupPopup} 
      onOpenChange={onClose} 
      className="fixed inset-0 flex items-center justify-center p-4"
    >
      <DialogContent className="max-w-2xl max-h-[90vh] w-full bg-white overflow-y-auto rounded-lg shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Create New Group</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          {/* Group Name Input */}
          <Input
            type="text"
            value={groupName}
            onChange={(e) => {
              setGroupName(e.target.value);
              onGroupNameChange(e.target.value);
            }}
            placeholder="Enter group name"
            className="w-full"
          />

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">
                Select Contacts: 
                <span className="ml-2 text-sm text-gray-500">
                  ({selectedPhones.size} selected)
                </span>
              </h3>
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleSelectAll}
                  disabled={contacts.length === 0}
                >
                  Select All
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleDeselectAll}
                  disabled={selectedPhones.size === 0}
                >
                  Deselect All
                </Button>
              </div>
            </div>
            <ScrollArea className="h-64 rounded-md border">
              <div className="p-4 space-y-4">
                {contacts.map(contact => (
                  <label
                    key={contact.id}
                    className="flex items-center space-x-3 hover:bg-gray-50 p-2 rounded cursor-pointer"
                  >
                    <Checkbox
                      checked={selectedPhones.has(contact.id)}
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


          {/* Pagination */}
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">Page</span>
              {pageInputVisible ? (
                <Input
                  type="number"
                  value={pageInput}
                  onChange={handlePageInputChange}
                  onBlur={handlePageInputBlur}
                  onKeyDown={(e) => e.key === 'Enter' && handlePageInputSubmit()}
                  min="1"
                  max={totalPages}
                  className="w-16 h-8"
                />
              ) : (
                <span 
                  className="cursor-pointer hover:bg-gray-100 px-2 rounded"
                  onDoubleClick={() => setPageInputVisible(true)}
                >
                  {currentPage}
                </span>
              )}
              <span className="text-sm text-gray-500">of {totalPages}</span>
            </div>
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => fetchContacts(currentPage - 1)} 
                disabled={currentPage === 1}
                className="h-8 w-8 p-0"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => fetchContacts(currentPage + 1)} 
                disabled={currentPage === totalPages}
                className="h-8 w-8 p-0"
              >
                <ChevronRightIcon className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Existing Groups */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Existing Groups:</h3>
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
              onClick={handleCreateGroup}
              disabled={selectedPhones.size === 0 || !groupName}
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