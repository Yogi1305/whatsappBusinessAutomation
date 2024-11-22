import React, { useState, useEffect } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { Dropdown } from "react-bootstrap";
import axiosInstance, { fastURL, djangoURL } from "../../api";
import { Upload, Search, Plus, FileSpreadsheet, List, Grid } from 'lucide-react';
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
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
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const getTenantIdFromUrl = () => {
  const pathArray = window.location.pathname.split('/');
  return pathArray.length >= 2 ? pathArray[1] : null;
};

const ContactPage = () => {
  const [contacts, setContacts] = useState([]);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState("tile");
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const tenantId = getTenantIdFromUrl();
  const navigate = useNavigate();
  
  // Create a reference for the file input
  const fileInputRef = React.useRef(null);

  useEffect(() => {
    fetchContacts();
  }, []);

  useEffect(() => {
    filterContacts(searchTerm);
  }, [searchTerm, contacts]);

  const fetchContacts = async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get(`${fastURL}/contacts/`);
      setContacts(response.data);
      setFilteredContacts(response.data);
    } catch (error) {
      console.error("Error fetching contacts:", error);
      toast.error("Failed to fetch contacts. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const filterContacts = (term) => {
    const searchTermLower = term.toLowerCase().trim();
    
    if (!searchTermLower) {
      setFilteredContacts(contacts);
      return;
    }

    const filtered = contacts.filter((contact) => {
      const searchFields = [
        contact.name,
        contact.last_name,
        contact.email,
        contact.phone,
        contact.address
      ].map(field => (field || '').toLowerCase());

      return searchFields.some(field => field.includes(searchTermLower));
    });

    setFilteredContacts(filtered);
  };

  const handleSearch = (event) => {
    const term = event.target.value;
    setSearchTerm(term);
  };

  // Modified file selection handler
  const handleFileSelect = () => {
    // Trigger the hidden file input
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Separate handler for file input change
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUploadClick = async () => {
    if (!selectedFile) {
      toast.error("Please select a file first.");
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('model_name', "Contact");

    try {
      const response = await axiosInstance.post(`${djangoURL}/upload/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      toast.success("File uploaded successfully!");
      fetchContacts();
      setSelectedFile(null);
      // Reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      toast.error("Failed to upload file. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleViewModeChange = (value) => {
    setViewMode(value);
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

  const handleContactClick = (contactId) => {
    navigate(`/${tenantId}/chatbot/?id=${contactId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <ToastContainer position="top-right" autoClose={5000} />
      
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Contacts</h1>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              {/* Hidden file input */}
              <input
                type="file"
                accept=".xlsx, .xls"
                onChange={handleFileChange}
                className="hidden"
                ref={fileInputRef}
              />
              {/* Button to trigger file selection */}
              <Button 
                variant="outline" 
                className="gap-2" 
                onClick={handleFileSelect}
                disabled={isUploading}
              >
                <FileSpreadsheet className="w-4 h-4" />
                {selectedFile ? selectedFile.name : "Select Excel File"}
              </Button>
              <Button 
                onClick={handleUploadClick} 
                disabled={!selectedFile || isUploading}
                className="gap-2"
              >
                <Upload className="w-4 h-4" />
                {isUploading ? "Uploading..." : "Upload"}
              </Button>
            </div>

            <Select value={viewMode} onValueChange={handleViewModeChange}>
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
            onChange={handleSearch}
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