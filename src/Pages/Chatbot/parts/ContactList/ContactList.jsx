import React from 'react';
import ContactItem from './ContactItem';
import PaginationControls from './PaginationControls';


const ContactList = ({ contacts, selectedContact, onSelect, searchTerm, onSearch, currentPage, totalPages, onPaginate }) => {
  return (
    <div className="contact-list">
     
      <div className="contacts-container">
        {contacts.map(contact => (
          <ContactItem
            key={contact.id}
            contact={contact}
            isSelected={selectedContact?.id === contact.id}
            onSelect={onSelect}
          />
        ))}
      </div>
      <PaginationControls
        currentPage={currentPage}
        totalPages={totalPages}
        onPrevious={() => onPaginate('prev')}
        onNext={() => onPaginate('next')}
        onPageSelect={(page) => onPaginate(page)}
      />
    </div>
  );
};

export default ContactList;