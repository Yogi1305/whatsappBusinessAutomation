import React, { useState, useMemo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Plus, Search, ChevronDown, ChevronRight, CheckCircle2, XCircle, Filter } from "lucide-react";
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
  const [expandedGroups, setExpandedGroups] = useState([]);
  const [selectionMode, setSelectionMode] = useState('default');

  // Filter contacts based on search query
  const filteredContacts = useMemo(() => {
    return contacts.filter(contact => 
      contact?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact?.phone?.includes(searchQuery)
    );
  }, [contacts, searchQuery]);

  // Filter groups based on search query
  const filteredGroups = broadcastGroup.filter(group => 
    group?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Toggle group expansion
  const toggleGroupExpansion = (groupId) => {
    setExpandedGroups(prev => 
      prev.includes(groupId) 
        ? prev.filter(id => id !== groupId)
        : [...prev, groupId]
    );
  };
    // Mass selection strategies
    const selectAllContacts = () => {
      const allContactsNotSelected = filteredContacts.filter(
        contact => !selectedPhones.some(selected => selected.id === contact.id)
      );
      allContactsNotSelected.forEach(onPhoneSelection);
    };
  
    const deselectAllContacts = () => {
      selectedPhones.filter(contact => 
        filteredContacts.some(filtered => filtered.id === contact.id)
      ).forEach(onPhoneSelection);
    };
  
    const selectContactsByFilter = () => {
      setSelectionMode('filter');
    };
   // Filter strategies
   const filterStrategies = [
    { 
      label: 'Select by Domain', 
      action: () => {
        const domains = [...new Set(filteredContacts.map(c => c.email?.split('@')[1]).filter(Boolean))];
        domains.forEach(domain => {
          const domainContacts = filteredContacts.filter(c => c.email?.endsWith(domain));
          domainContacts.forEach(onPhoneSelection);
        });
      }
    },
    { 
      label: 'Select by Area Code', 
      action: () => {
        const areaCodes = [...new Set(filteredContacts.map(c => c.phone?.slice(0,3)).filter(Boolean))];
        areaCodes.forEach(areaCode => {
          const areaCodeContacts = filteredContacts.filter(c => c.phone?.startsWith(areaCode));
          areaCodeContacts.forEach(onPhoneSelection);
        });
      }
    },
    { 
      label: 'Select Active Contacts', 
      action: () => {
        const activeContacts = filteredContacts.filter(c => c.lastActive && 
          (Date.now() - new Date(c.lastActive).getTime()) < 30 * 24 * 60 * 60 * 1000);
        activeContacts.forEach(onPhoneSelection);
      }
    }
  ];

  return (
    <Dialog open={showBroadcastPopup} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center justify-between">
            Broadcast Message
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={selectAllContacts}
                className="flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                Select All
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={deselectAllContacts}
                className="flex items-center gap-2"
              >
                <XCircle className="w-4 h-4" />
                Deselect All
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex items-center gap-2"
                  >
                    <Filter className="w-4 h-4" />
                    Smart Select
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {filterStrategies.map((strategy, index) => (
                    <DropdownMenuItem 
                      key={index}
                      onSelect={strategy.action}
                    >
                      {strategy.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </DialogTitle>
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
              <div className="text-sm text-gray-500 mb-2">
                {selectedPhones.length} of {filteredContacts.length} contacts selected
              </div>
              {filteredContacts.map(contact => (
                <label
                  key={contact.id}
                  className="flex items-center space-x-3 hover:bg-gray-50 p-2 rounded cursor-pointer"
                >
                  <Checkbox
                    checked={selectedPhones.some(selected => selected.id === contact.id)}
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
                  {filteredGroups.map(bg => (
                    <div key={bg.id} className="space-y-2">
                      <label
                        className="flex items-center space-x-3 hover:bg-gray-50 p-2 rounded cursor-pointer"
                      >
                        <Checkbox
                          checked={selectedBCGroups.includes(bg.id)}
                          onCheckedChange={() => onBCGroupSelection(bg.id)}
                          id={`broadcast-group-${bg.id}`}
                        />
                        <div className="flex items-center gap-2 w-full">
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
                        </div>
                      </label>
                      
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