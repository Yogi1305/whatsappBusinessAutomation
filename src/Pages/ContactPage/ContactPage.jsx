import React, { useState, useEffect } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { Dropdown } from "react-bootstrap";
import axiosInstance from "../../api";
import { FaFileExcel, FaFilePdf, FaSearch, FaPlus } from 'react-icons/fa';
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
import './ContactPage.css';
import { Button, CircularProgress } from '@mui/material';
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

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get('/contacts/');
      setContacts(response.data);
      setFilteredContacts(response.data);
    } catch (error) {
      console.error("Error fetching contacts:", error);
      toast.error("Failed to fetch contacts. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (event) => {
    const term = event.target.value;
    setSearchTerm(term);
    setFilteredContacts(
      contacts.filter((contact) =>
        contact.first_name.toLowerCase().includes(term.toLowerCase()) ||
        contact.last_name.toLowerCase().includes(term.toLowerCase()) ||
        contact.email.toLowerCase().includes(term.toLowerCase())
      )
    );
  };

  const handleImportClick = () => {
    setIsImportModalOpen(true);
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
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
      const response = await axiosInstance.post('https://backeng4whatsapp-dxbmgpakhzf9bped.centralindia-01.azurewebsites.net/upload/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      toast.success("File uploaded successfully!");
      console.log('File uploaded successfully:', response.data);
      fetchContacts();
      setSelectedFile(null);
    } catch (error) {
      console.error('Error uploading file:', error);
      toast.error("Failed to upload file. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleViewModeChange = (mode) => {
    setViewMode(mode);
  };

  const getInitials = (firstName, lastName) => {
    const firstInitial = firstName && firstName.charAt(0) ? firstName.charAt(0).toUpperCase() : '';
    const lastInitial = lastName && lastName.charAt(0) ? lastName.charAt(0).toUpperCase() : '';
    return firstInitial + lastInitial || '??';
  };

  const getAvatarColor = (initials) => {
    const charCode = (initials.charCodeAt(0) || 0) + (initials.charCodeAt(1) || 0);
    return `avatar-bg-${(charCode % 10) + 1}`;
  };

  const handleContactClick = (contactId) => {
    // const contact = filteredContacts.get()
    // console.log("HHFUEHKDF: ", contact)
    
    navigate(`/${tenantId}/chatbot/?id=${contactId}`);
    
  };

  return (
    <div className="contact-page">
      <ToastContainer position="top-right" autoClose={5000} />
      <header className="contact-page__header">
        <h1 className='contact-head'>Contacts</h1>
        <div className="contact-page__actions">
          <input
            type="file"
            accept=".xlsx, .xls"
            onChange={handleFileSelect}
            style={{ display: 'none' }}
            id="file-upload"
          />
          <label htmlFor="file-upload">
            <Button component="span" disabled={isUploading}>
              {isUploading ? <CircularProgress size={24} /> : <FaFileExcel className="mr-2" />}
              {selectedFile ? selectedFile.name : "Select Excel File"}
            </Button>
          </label>
          <Button onClick={handleUploadClick} disabled={!selectedFile || isUploading}>
            {isUploading ? <CircularProgress size={24} /> : "Upload"}
          </Button>
          <div className="contact-page__view-controls">
            <select
              value={viewMode}
              onChange={(e) => handleViewModeChange(e.target.value)}
              className="contact-page__view-select"
            >
              <option value="tile">Tile View</option>
              <option value="table">Table View</option>
            </select>
          </div>
        </div>
      </header>

      <div className="contact-page__search">
        <FaSearch className="contact-page__search-icon" />
        <input
          type="text"
          placeholder="Search contacts..."
          value={searchTerm}
          onChange={handleSearch}
          className="contact-page__search-input"
        />
      </div>

      {isLoading ? (
        <div className="contact-page__loading">
          <CircularProgress />
        </div>
      ) : viewMode === "tile" ? (
        <div className="contact-page__list">
          {filteredContacts.map(contact => {
            const initials = getInitials(contact.name, contact.last_name);
            const avatarColorClass = getAvatarColor(initials);
            return (
              <div key={contact.id} className="contact-page__item" onClick={() => handleContactClick(contact.id)}>
                <div className={`contact-page__avatar ${avatarColorClass}`}>
                  {initials}
                </div>
                <div className="contact-page__details">
                  <h2>{contact.name} {contact.last_name}</h2>
                  <p>{contact.email}</p>
                  <p>{contact.phone}</p>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <table className="contact-page__table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Address</th>
            </tr>
          </thead>
          <tbody>
            {filteredContacts.map((contact) => (
              <tr key={contact.id} onClick={() => handleContactClick(contact.id)}>
                <td>{contact.name} {contact.last_name}</td>
                <td>{contact.email}</td>
                <td>{contact.phone}</td>
                <td>{contact.address}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ContactPage;