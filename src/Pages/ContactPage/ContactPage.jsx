import React, { useState, useEffect, useMemo } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import axiosInstance, { fastURL, djangoURL } from "../../api";
import { 
  Upload, 
  Search, 
  Filter, 
  SortAsc, 
  SortDesc, 
  MessageCircle, 
  Clock, 
  Users, 
  FileSpreadsheet, 
  List, 
  TrendingUp,
  Grid 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover";
import { toast, ToastContainer } from 'react-toastify';

const getTenantIdFromUrl = () => {
  const pathArray = window.location.pathname.split('/');
  return pathArray.length >= 2 ? pathArray[1] : null;
};

const ContactPage = () => {
  // State Management
  const [contacts, setContacts] = useState([]);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState("tile");
  const [filterConfig, setFilterConfig] = useState({
    sortBy: 'recent_interaction',
    sortOrder: 'desc',
  });
  const [isLoading, setIsLoading] = useState(true);
  const tenantId = getTenantIdFromUrl();
  const navigate = useNavigate();

  // Advanced Filtering and Sorting Function
  const applyFilters = useMemo(() => {
    return (contacts) => {
      let result = [...contacts];

      // Text Search Filter
      if (searchTerm) {
        const searchTermLower = searchTerm.toLowerCase();
        result = result.filter(contact => 
          Object.values(contact).some(value => 
            String(value).toLowerCase().includes(searchTermLower)
          )
        );
      }

      // Sorting Logic
      result.sort((a, b) => {
        let compareValue = 0;
        switch(filterConfig.sortBy) {
          case 'recent_interaction':
            compareValue = new Date(b.last_interaction_timestamp || 0).getTime() - 
                           new Date(a.last_interaction_timestamp || 0).getTime();
            break;
          case 'interaction_count':
            compareValue = (b.interaction_count || 0) - (a.interaction_count || 0);
            break;
          case 'name':
            compareValue = (a.name + a.last_name).localeCompare(b.name + b.last_name);
            break;
          case 'engagement':
            compareValue = (b.broadcast_engagement_rate || 0) - (a.broadcast_engagement_rate || 0);
            break;
        }

        return filterConfig.sortOrder === 'asc' ? compareValue : -compareValue;
      });

      return result;
    };
  }, [searchTerm, filterConfig]);

  useEffect(() => {
    fetchContacts();
  }, []);

  useEffect(() => {
    const filteredAndSortedContacts = applyFilters(contacts);
    setFilteredContacts(filteredAndSortedContacts);
  }, [contacts, searchTerm, filterConfig]);

  const fetchContacts = async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get(`${fastURL}/contacts/`);
      setContacts(response.data);
    } catch (error) {
      console.error("Error fetching contacts:", error);
      toast.error("Failed to fetch contacts. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  // Advanced Filter Popover Component
  const AdvancedFilterPopover = () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Filter className="w-4 h-4" />
          Advanced Filters
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid gap-4">
          <div>
            <h4 className="font-medium mb-2">Sort By</h4>
            <Select 
              value={filterConfig.sortBy} 
              onValueChange={(value) => setFilterConfig(prev => ({
                ...prev, 
                sortBy: value
              }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent_interaction">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" /> Recent Interaction
                  </div>
                </SelectItem>
                <SelectItem value="interaction_count">
                  <div className="flex items-center gap-2">
                    <MessageCircle className="w-4 h-4" /> Interaction Count
                  </div>
                </SelectItem>
               {/*<SelectItem value="name">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" /> Name
                  </div>
                </SelectItem> */}
               <SelectItem value="engagement">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" /> Engagement Rate
                </div>
              </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <h4 className="font-medium mb-2">Sort Order</h4>
            <Select 
              value={filterConfig.sortOrder} 
              onValueChange={(value) => setFilterConfig(prev => ({
                ...prev, 
                sortOrder: value
              }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sort Order" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="desc">
                  <div className="flex items-center gap-2">
                    <SortDesc className="w-4 h-4" /> Descending
                  </div>
                </SelectItem>
                <SelectItem value="asc">
                  <div className="flex items-center gap-2">
                    <SortAsc className="w-4 h-4" /> Ascending
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );

  const handleContactClick = (contactId) => {
    navigate(`/${tenantId}/chatbot/?id=${contactId}`);
  };

  const getInitials = (firstName, lastName) => {
    const firstInitial = firstName && firstName.charAt(0) ? firstName.charAt(0).toUpperCase() : '';
    const lastInitial = lastName && lastName.charAt(0) ? lastName.charAt(0).toUpperCase() : '';
    return firstInitial + lastInitial || '??';
  };

  const getAvatarColor = (initials) => {
    const colors = [
      'bg-blue-500',
      'bg-green-500',
      'bg-yellow-500',
      'bg-purple-500',
      'bg-pink-500',
      'bg-indigo-500',
      'bg-red-500',
      'bg-teal-500',
      'bg-orange-500',
      'bg-cyan-500'
    ];
    const charCode = (initials.charCodeAt(0) || 0) + (initials.charCodeAt(1) || 0);
    return colors[charCode % colors.length];
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <ToastContainer position="top-right" autoClose={5000} />
      
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Contacts</h1>
          
          <div className="flex items-center gap-4">
            {/* Existing upload buttons */}
            <AdvancedFilterPopover />
            <Select value={viewMode} onValueChange={setViewMode}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="View" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tile">
                  <div className="flex items-center gap-2">
                    <Grid className="w-4 h-4" />
                    Tile View
                  </div>
                </SelectItem>
                <SelectItem value="table">
                  <div className="flex items-center gap-2">
                    <List className="w-4 h-4" />
                    Table View
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            type="text"
            placeholder="Search contacts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-full"
          />
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          </div>
        ) : viewMode === "tile" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredContacts.map(contact => {
              const initials = getInitials(contact.name, contact.last_name);
              const avatarColorClass = getAvatarColor(initials);
              return (
                <Card 
                  key={contact.id}
                  className="hover:shadow-lg transition-shadow duration-200 cursor-pointer"
                  onClick={() => handleContactClick(contact.id)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className={`flex items-center justify-center w-12 h-12 rounded-full ${avatarColorClass} text-white font-semibold text-lg`}>
                        {initials}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h2 className="text-lg font-semibold text-gray-900 truncate">
                          {contact.name} {contact.last_name}
                        </h2>
                        <p className="text-sm text-gray-500 truncate">{contact.email}</p>
                        {contact.phone && (
                          <p className="text-sm text-gray-500 truncate">{contact.phone}</p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-4 font-semibold text-gray-900">Name</th>
                    <th className="text-left p-4 font-semibold text-gray-900">Email</th>
                    <th className="text-left p-4 font-semibold text-gray-900">Phone</th>
                    <th className="text-left p-4 font-semibold text-gray-900">Address</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredContacts.map((contact) => (
                    <tr 
                      key={contact.id} 
                      onClick={() => handleContactClick(contact.id)}
                      className="hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
                    >
                      <td className="p-4">{contact.name} {contact.last_name}</td>
                      <td className="p-4 text-gray-600">{contact.email}</td>
                      <td className="p-4 text-gray-600">{contact.phone}</td>
                      <td className="p-4 text-gray-600">{contact.address}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ContactPage;