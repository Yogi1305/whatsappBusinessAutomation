import React from 'react';
import { ChevronRight, X } from 'lucide-react';
import { getInitials } from '../../utils/helpers';

const ChatHeader = ({ contact, onClose }) => {
  if (!contact) {
    return (
      <div className="chat-header placeholder">
        <div className="contact-meta">
          <h2 className="contact-name">No contact selected</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-header">
      <div className="contact-info">
        <div className="mobile-menu-button">
          <ChevronRight size={24} />
        </div>
        {contact.profileImage ? (
          <img src={contact.profileImage} alt="Profile" className="header-avatar" />
        ) : (
          <div className={`header-avatar-default ${getInitials(contact.name)}`}>
            {getInitials(contact.name, contact.lastName)}
          </div>
        )}
        <div className="contact-meta">
          <h2 className="contact-name">{contact.name} {contact.lastName}</h2>
          <p className="contact-status">Online</p>
        </div>
      </div>
      <button className="close-chat-button" onClick={onClose}>
        <X size={20} />
      </button>
    </div>
  );
};

export default ChatHeader;