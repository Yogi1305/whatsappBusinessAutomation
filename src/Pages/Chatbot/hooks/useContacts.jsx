import { useState, useEffect } from 'react';
import { axiosInstance, fastURL } from '../../../api';
import { getContactIDfromURL } from '../utils/helpers';

export default function useContacts() {
  const [contacts, setContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchContacts = async (page = 1) => {
    try {
      const response = await axiosInstance.get(
        `${fastURL}/contacts/${page}?order_by=last_replied&sort_by=desc`
      );
      setContacts(response.data.contacts);
      setTotalPages(response.data.total_pages);
      setCurrentPage(page);
    } catch (error) {
      console.error("Error fetching contacts:", error);
    }
  };

  const handleContactSelect = (contact) => {
    setSelectedContact(contact);
    setContacts(prev => prev.map(c => 
      c.id === contact.id ? { ...c, unreadCount: 0 } : c
    ));
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    fetchContacts(1);
  };

  const handlePagination = (action) => {
    switch(action) {
      case 'prev':
        if(currentPage > 1) fetchContacts(currentPage - 1);
        break;
      case 'next':
        if(currentPage < totalPages) fetchContacts(currentPage + 1);
        break;
      default:
        fetchContacts(action);
    }
  };

  useEffect(() => {
    fetchContacts();
    const contactID = getContactIDfromURL();
    if(contactID) {
      const contact = contacts.find(c => c.id === parseInt(contactID));
      setSelectedContact(contact);
    }
  }, []);

  return {
    contacts,
    selectedContact,
    searchTerm,
    currentPage,
    totalPages,
    handleContactSelect,
    handleSearch,
    handlePagination
  };
}