import React, { useState, useMemo, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Plus, Search, ChevronDown, ChevronRight, CheckCircle2, XCircle, Filter, X } from "lucide-react";

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
  const [activeFilters, setActiveFilters] = useState([]);

  // Enhanced filter strategies with more granular options
  const filterStrategies = [
    {
      category: 'Engagement',
      filters: [
        {
          label: 'High Engagement',
          description: 'Replied in last 7 days, delivered in last 3 days',
          filter: c => {
            const now = Date.now();
            return c.last_replied && (now - new Date(c.last_replied).getTime()) < 7 * 24 * 60 * 60 * 1000 &&
                   c.last_delivered && (now - new Date(c.last_delivered).getTime()) < 3 * 24 * 60 * 60 * 1000;
          }
        },
        {
          label: 'Medium Engagement',
          description: 'Seen in last 30 days, delivered in last 14 days',
          filter: c => {
            const now = Date.now();
            return c.last_seen && (now - new Date(c.last_seen).getTime()) < 30 * 24 * 60 * 60 * 1000 &&
                   c.last_delivered && (now - new Date(c.last_delivered).getTime()) < 14 * 24 * 60 * 60 * 1000;
          }
        },
        {
          label: 'Low Engagement',
          description: 'Created in last 90 days, not seen in last 60 days',
          filter: c => {
            const now = Date.now();
            return c.createdOn && (now - new Date(c.createdOn).getTime()) < 90 * 24 * 60 * 60 * 1000 &&
                   (!c.last_seen || (now - new Date(c.last_seen).getTime()) < 60 * 24 * 60 * 60 * 1000);
          }
        }
      ]
    },
    {
      category: 'Contact Type',
      filters: [
        {
          label: 'Fresh Leads',
          description: 'Created in last 14 days, not recently delivered',
          filter: c => {
            const now = Date.now();
            return c.createdOn && 
                   (now - new Date(c.createdOn).getTime()) < 14 * 24 * 60 * 60 * 1000 &&
                   (!c.last_delivered || (now - new Date(c.last_delivered).getTime()) > 7 * 24 * 60 * 60 * 1000);
          }
        },
        {
          label: 'Dormant Contacts',
          description: 'Created over 90 days ago, not seen in 60 days',
          filter: c => {
            const now = Date.now();
            return c.createdOn && 
                   (now - new Date(c.createdOn).getTime()) > 90 * 24 * 60 * 60 * 1000 &&
                   (!c.last_seen || (now - new Date(c.last_seen).getTime()) > 60 * 24 * 60 * 60 * 1000);
          }
        }
      ]
    }
  ];

  // Apply active filters to contacts
  const filteredContacts = useMemo(() => {
    return contacts.filter(contact => {
      // If no active filters, return all contacts
      if (activeFilters.length === 0) {
        return contact?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
               contact?.phone?.includes(searchQuery);
      }
      
      // Check if contact matches ALL active filters
      return activeFilters.every(filterLabel => 
        filterStrategies.some(strategy => 
          strategy.filters.some(f => 
            f.label === filterLabel && f.filter(contact)
          )
        )
      ) && (
        contact?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contact?.phone?.includes(searchQuery)
      );
    });
  }, [contacts, searchQuery, activeFilters]);

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

  // Toggle filter
  const toggleFilter = (filterLabel) => {
    setActiveFilters(prev => 
      prev.includes(filterLabel)
        ? prev.filter(label => label !== filterLabel)
        : [...prev, filterLabel]
    );
  };

  // Remove all filters
  const clearAllFilters = () => {
    setActiveFilters([]);
  };

  return (
    <Dialog open={showBroadcastPopup} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
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
                <DropdownMenuContent className="w-96">
                  {filterStrategies.map((strategy, strategyIndex) => (
                    <div key={strategyIndex} className="p-2">
                      <div className="text-sm font-semibold text-gray-600 mb-2">
                        {strategy.category}
                      </div>
                      {strategy.filters.map((filter, filterIndex) => (
                        <DropdownMenuItem 
                          key={filterIndex}
                          onSelect={() => toggleFilter(filter.label)}
                          className="flex justify-between items-center"
                        >
                          <div>
                            <span className={`${activeFilters.includes(filter.label) ? 'font-bold' : ''}`}>
                              {filter.label}
                            </span>
                            <p className="text-xs text-gray-500">{filter.description}</p>
                          </div>
                          {activeFilters.includes(filter.label) && (
                            <CheckCircle2 className="w-4 h-4 text-green-500" />
                          )}
                        </DropdownMenuItem>
                      ))}
                    </div>
                  ))}
                  {activeFilters.length > 0 && (
                    <div className="p-2 border-t">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={clearAllFilters}
                        className="w-full"
                      >
                        Clear All Filters
                      </Button>
                    </div>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Active Filters Display */}
          {activeFilters.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm text-gray-600">Active Filters:</span>
              {activeFilters.map(filter => (
                <div 
                  key={filter} 
                  className="flex items-center bg-gray-100 rounded-full px-3 py-1 text-sm"
                >
                  {filter}
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="ml-2 h-4 w-4"
                    onClick={() => toggleFilter(filter)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          )}
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
                    <div className="grid gap-1 flex-grow">
                      <div className="flex justify-between">
                        <span className="font-medium">{contact.name}</span>
                        <div className="text-xs text-gray-500 space-x-2">
                          {contact.last_replied && (
                            <span>Last Reply: {new Date(contact.last_replied).toLocaleDateString()}</span>
                          )}
                          {contact.last_seen && (
                            <span>Last Seen: {new Date(contact.last_seen).toLocaleDateString()}</span>
                          )}
                        </div>
                      </div>
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