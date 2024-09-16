import React, { useState, useEffect } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { Dropdown } from "react-bootstrap";
import axiosInstance from "../../api";
import { FaFileExcel, FaFilePdf, FaSearch, FaPlus } from 'react-icons/fa';
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
import './ContactPage.css';
import { Button } from '@mui/material';
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

  const handleFileUpload = (event) => {
    // Implement file upload logic here
    console.log('File uploaded:', event.target.files[0]);
    setIsImportModalOpen(false);
  };

  const handleDownloadExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filteredContacts);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Contacts");
    XLSX.writeFile(wb, "contacts.xlsx");
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [["First Name", "Last Name", "Email", "Phone", "Address"]],
      body: filteredContacts.map((contact) => [
        contact.first_name,
        contact.last_name,
        contact.email,
        contact.phone,
        contact.address,
      ]),
    });
    doc.save("contacts.pdf");
  };

  const handleUploadClick = () => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.xlsx, .xls';
    fileInput.style.display = 'none';
    

    fileInput.addEventListener('change', async (event) => {
      const file = event.target.files[0];
      if (file) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('model_name', "Contact");

        try {
          const response = await axiosInstance.post('https://backenreal-hgg2d7a0d9fzctgj.eastus-01.azurewebsites.net/upload/', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
          toast.success("File uploaded successfully!");
          console.log('File uploaded successfully:', response.data);
          fetchContacts();
        } catch (error) {
          console.error('Error uploading file:', error);
          toast.error("Failed to upload file. Please try again.");
        }
      }
    });

    document.body.appendChild(fileInput);
    fileInput.click();
    document.body.removeChild(fileInput);
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

  return (
    <div className="contact-page">
      <ToastContainer position="top-right" autoClose={5000} />
      <header className="contact-page__header">
        <h1 className='contact-head'>Contacts</h1>
        <div className="contact-page__actions">
        <Button onClick={handleUploadClick}>
      <FaFileExcel className="mr-2" /> Upload Excel File
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

     

      {viewMode === "tile" && (
        <div className="contact-page__list">
          {filteredContacts.map(contact => {
            const initials = getInitials(contact.name, contact.last_name);
            const avatarColorClass = getAvatarColor(initials);
            return (
              <div key={contact.id} className="contact-page__item">
                <div className={`contact-page__avatar ${avatarColorClass}`}>
                  {initials}
                </div>
                <div className="contact-page__details">
                  <h2>
                    <Link>
                      {contact.name} {contact.last_name}
                    </Link>
                  </h2>
                  <p>{contact.email}</p>
                  <p>{contact.phone}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {viewMode === "table" && (
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
              <tr key={contact.id}>
                <td>
                  <Link to={`/${tenantId}/contactinfo/${contact.id}`}>
                    {contact.name} {contact.last_name}
                  </Link>
                </td>
                <td>{contact.email}</td>
                <td>{contact.phone}</td>
                <td>{contact.address}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {isImportModalOpen && (
        <div className="contact-page__modal">
          <div className="contact-page__modal-content">
            <h2>Import Contacts</h2>
            <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />
            <button onClick={() => setIsImportModalOpen(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactPage;