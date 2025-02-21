import React, { useState, useEffect, useCallback } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  Clock, 
  Plus, 
  Trash2, 
  Edit,
  MoreHorizontal
} from 'lucide-react';
import axios from 'axios';
import { format } from 'date-fns';
import { fastURL, axiosInstance } from './api.jsx';

const getTenantIdFromUrl = () => {
  const pathArray = window.location.pathname.split('/');
  return pathArray.length >= 2 ? pathArray[1] : null;
};

const ScheduledEventsPage = () => {
  const [events, setEvents] = useState([]);
  const [isCreateEventOpen, setIsCreateEventOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [templates, setTemplates] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [broadcastGroups, setBroadcastGroups] = useState([]);
  const [accountId, setAccountId] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const tenantId = getTenantIdFromUrl();
  const [businessPhoneNumberId,setBusinessPhoneNumberId]=useState('');

  // New event form state
  const [newEvent, setNewEvent] = useState({
    template: null,
    date: '',
    time: '',
    recipients: []
  });

  // Fetch business phone details
  useEffect(() => {
    const fetchBusinessPhoneId = async () => {
      try {
        const response = await axiosInstance.get(`${fastURL}/whatsapp_tenant/`, {
          headers: {
            'X-Tenant-ID': tenantId
          }
        });
        const whatsappData = response.data.whatsapp_data[0];
        setAccountId(whatsappData.business_account_id);
        setBusinessPhoneNumberId(whatsappData.business_phone_number_id);
        setAccessToken(whatsappData.access_token);
      } catch (error) {
       // console.error('Error fetching business phone ID:', error);
      }
    };

    fetchBusinessPhoneId();
  }, [tenantId]);

  // Fetch scheduled events
  const fetchScheduledEvents = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${fastURL}/scheduled-events/`, {
        headers: { 
          'X-Tenant-Id': tenantId,
          'Authorization': `Bearer ${token}`
        }
      });
      //console.log('Fetched scheduled events - Raw Data:', response.data);
      
      // If the events are nested, you might need to adjust this
      const eventsData = Array.isArray(response.data) 
        ? response.data 
        : response.data.results || response.data.data || [];
      
      //console.log('Processed events:', eventsData);
      setEvents(eventsData);
    } catch (error) {
    //  console.error('Failed to fetch scheduled events', error.response ? error.response.data : error);
    }
  }, [tenantId, fastURL]);
  // Fetch event details when a card is clicked
  const fetchEventDetails = async (eventId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${fastURL}/scheduled-events/${eventId}/`, {
        headers: { 
          'X-Tenant-Id': tenantId,
          'Authorization': `Bearer ${token}`
        }
      });
      setSelectedEvent(response.data);
    } catch (error) {
    //  console.error('Failed to fetch event details', error);
    }
  };
  // Fetch templates and contacts
  const fetchTemplates = useCallback(async () => {
    if (!accessToken || !accountId) return;
  
    try {
      const url = `https://graph.facebook.com/v20.0/${accountId}/message_templates`;
      const response = await axios.get(url, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        },
        params: {
          fields: 'name,status,components,language,category'
        }
      });
      
      const formattedTemplates = response.data.data.map(template => ({
        ...template,
        displayName: template.name
      }));
      
      setTemplates(formattedTemplates);
    } catch (error) {
    //  console.error('Failed to fetch templates', error.response ? error.response.data : error.message);
    }
  }, [accessToken, accountId]);
  
  const fetchContacts = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
    
      const [contactsResponse, broadcastGroupResponse] = await Promise.all([
        axios.get(`${fastURL}/contacts`, {
          headers: { 
            'X-Tenant-Id': tenantId,
            'Authorization': `Bearer ${token}`
          }
        }),
        axios.get(`${fastURL}/broadcast-groups/`, {
          headers: { 
            'X-Tenant-Id': tenantId,
          }
        })
      ]);
    
      const processedContacts = contactsResponse.data
        .filter(contact => contact.phone_number)
        .map(contact => ({
          ...contact,
          displayName: `${contact.first_name || ''} ${contact.last_name || ''}`.trim()
        }));
      
      const processedGroups = broadcastGroupResponse.data.map(group => ({
        ...group,
        displayName: group.name
      }));
      //console.log("Processed Contacts: ", processedContacts)
      setContacts(processedContacts);
      setBroadcastGroups(processedGroups);
      //console.log("Broadcast Groups: ", broadcastGroups)
    
    } catch (error) {
   //   console.error('Failed to fetch contacts or groups', error.response ? error.response.data : error.message);
    }
  }, [fastURL, tenantId]);

  // Fetch data on component mount
  useEffect(() => {
    fetchTemplates();
    fetchContacts();
    fetchScheduledEvents();
  }, [fetchTemplates, fetchContacts, fetchScheduledEvents]);

  // Handle creating a new event
  const handleCreateEvent = async () => {
    //console.log("raw_recipient",newEvent.recipients)
    try {
      const token = localStorage.getItem('token');
      // Construct payload for creating a scheduled event
    
      const payload = {
        type: "Template",
        date: newEvent.date,
        time: newEvent.time,
        value: {
          bg_id: null,
          template: { name: newEvent.template },
          business_phone_number_id: parseInt(businessPhoneNumberId), // Consider making this dynamic
          phoneNumbers: newEvent.recipients
        }
      };

      // POST request to create scheduled event
      const response = await axios.post(`${fastURL}/scheduled-events/`, payload, {
        headers: { 
          'X-Tenant-Id': tenantId,
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      // Refresh events list
      fetchScheduledEvents();
      
      // Close dialog and reset form
      setIsCreateEventOpen(false);
      setNewEvent({
        template: null,
        date: '',
        time: '',
        recipients: []
      });
    } catch (error) {
    //  console.error('Failed to create event', error.response ? error.response.data : error);
      // Optionally add error handling UI
    }
  };

  // Delete an event
  const handleDeleteEvent = async (eventId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${fastURL}/scheduled-events/${eventId}/`, {
        headers: { 
          'X-Tenant-Id': tenantId,
          'Authorization': `Bearer ${token}`
        }
      });
      // Refresh events list
      fetchScheduledEvents();
    } catch (error) {
   //   console.error('Failed to delete event', error);
    }
  };

  return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 space-y-4 sm:space-y-0">
  <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 flex items-center">
    <Calendar className="mr-3 text-primary" />
    Scheduled Messages
  </h1>
  <Button 
    onClick={() => setIsCreateEventOpen(true)}
    className="group hover:bg-primary hover:text-white transition-colors 
               px-4 py-3 sm:px-6 sm:py-3 text-sm sm:text-base 
               w-full sm:w-auto rounded-md"
  >
    <Plus className="mr-2 group-hover:rotate-90 transition-transform" /> 
    Schedule New Message
  </Button>
</div>

  
          {/* Events Grid */}
          {/* Events Grid */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {events.map((event) => (
    <Card 
      key={event.id} 
      className="hover:shadow-lg transition-shadow cursor-pointer"
      onClick={() => fetchEventDetails(event.id)}
    >
      <CardHeader className="pb-2">
        <CardTitle className="flex justify-between items-center">
          <span>
            {event.value?.template?.name || 'Unnamed Template'}
          </span>
          <Badge variant="secondary">
            {event.type}
          </Badge>
        </CardTitle>
        <CardDescription className="flex items-center space-x-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span>{event.date}</span>
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span>{event.time}</span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">
            {event.value?.phoneNumbers ? 
              `${event.value.phoneNumbers.length} Recipients` : 
              'No Recipients'}
          </span>
          <div className="flex items-center space-x-2">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={(e) => {
                e.stopPropagation();
                // Implement edit functionality
              }}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-destructive hover:text-destructive"
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteEvent(event.id);
              }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  ))}
</div>

        {/* Create Event Dialog */}
        <Dialog open={isCreateEventOpen} onOpenChange={setIsCreateEventOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Schedule New Message</DialogTitle>
              <DialogDescription>
                Create a new scheduled message with your preferred template and recipients.
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              {/* Template Selection */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="template" className="text-right">
                  Template
                </Label>
                <Select 
                  value={newEvent.template}
                  onValueChange={(value) => setNewEvent({...newEvent, template: value})}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select a template" />
                  </SelectTrigger>
                  <SelectContent>
                    {templates.map((template) => (
                      <SelectItem key={template.name} value={template.name}>
                        {template.displayName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Date Selection */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="date" className="text-right">
                  Date
                </Label>
                <Input 
                  id="date" 
                  type="date" 
                  value={newEvent.date}
                  onChange={(e) => setNewEvent({...newEvent, date: e.target.value})}
                  className="col-span-3" 
                />
              </div>

              {/* Time Selection */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="time" className="text-right">
                  Time
                </Label>
                <Input 
                  id="time" 
                  type="time" 
                  value={newEvent.time}
                  onChange={(e) => setNewEvent({...newEvent, time: e.target.value})}
                  className="col-span-3" 
                />
              </div>

              {/* Recipients Selection */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">
                  Recipients
                </Label>
                <div className="col-span-3 space-y-2">
                  <Select 
                    multiple
                    value={newEvent.recipients}
                    onValueChange={(values) => setNewEvent({...newEvent, recipients: values})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select recipients" />
                    </SelectTrigger>
                    <SelectContent>
                      <div className="max-h-[300px] overflow-y-auto">
                        {/* Individual Contacts */}
                        <div className="font-semibold px-2 py-1 text-sm text-muted-foreground">
                          Contacts
                        </div>
                        {contacts.map((contact) => (
                          contact.phone_number && (
                            <SelectItem 
                              key={contact.id} 
                              value={contact.phone_number.toString()}
                            >
                              {contact.displayName} ({contact.phone_number})
                            </SelectItem>
                          )
                        ))}
                                                
                        {/* Broadcast Groups */}
                        {broadcastGroups.length > 0 && (
                          <>
                            <div className="font-semibold px-2 py-1 text-sm text-muted-foreground mt-2">
                              Broadcast Groups
                            </div>
                            {broadcastGroups.map((group) => (
                              <SelectItem 
                                key={group.id}
                                value={group.members.map(member => member.phone)}
                              >
                                {group.displayName}
                              </SelectItem>
                            ))}
                          </>
                        )}
                      </div>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button 
                type="submit" 
                onClick={handleCreateEvent}
                disabled={!newEvent.template || !newEvent.date || !newEvent.time || newEvent.recipients.length === 0}
              >
                Schedule Message
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Event Details Dialog */}
      {/* Event Details Dialog */}
<Dialog open={!!selectedEvent} onOpenChange={() => setSelectedEvent(null)}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Event Details</DialogTitle>
    </DialogHeader>
    {selectedEvent && (
      <div className="space-y-4">
        <div>
          <strong>Type:</strong> {selectedEvent.type}
        </div>
        <div>
          <strong>Template:</strong> {selectedEvent.value?.template?.name || 'N/A'}
        </div>
        <div>
          <strong>Date:</strong> {selectedEvent.date}
        </div>
        <div>
          <strong>Time:</strong> {selectedEvent.time}
        </div>
        <div>
          <strong>Recipients:</strong>
          <ul className="list-disc pl-5 mt-2">
            {Array.isArray(selectedEvent.value?.phoneNumbers) 
              ? selectedEvent.value.phoneNumbers.map((number, index) => (
                  <li key={index}>{number}</li>
                ))
              : <li>No recipients found</li>
            }
          </ul>
        </div>
      </div>
    )}
  </DialogContent>
</Dialog>
      </div>
    </div>
  );
};

export default ScheduledEventsPage;