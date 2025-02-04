import React from 'react';
import { getInitials } from '../../utils/helpers';

const ContactItem = ({ contact, isSelected, onSelect }) => {
  const hasUnread = contact.unreadCount > 0;
  
  return (
    <div 
      className={`contact-item ${isSelected ? 'selected' : ''}`}
      onClick={() => onSelect(contact)}
    >
      <div className="avatar-container">
        {contact.profileImage ? (
          <img src={contact.profileImage} alt="Profile" className="contact-avatar" />
        ) : (
          <div className={`default-avatar ${getInitials(contact.name, contact.lastName)}`}>
            {getInitials(contact.name, contact.lastName)}
          </div>
        )}
      </div>
      
      <div className="contact-info">
        <span className="contact-name">
          {contact.name} {contact.lastName}
        </span>
        <span className="contact-phone">{contact.phone}</span>
      </div>
      
      {hasUnread && (
        <div className="unread-badge">
          {contact.unreadCount}
        </div>
      )}
    </div>
  );
};

export default React.memo(ContactItem);