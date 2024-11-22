import React from 'react';
import Avatar from '../Reusable/Avatar';

const ContactList = ({ contacts, selectedContact, onSelectContact }) => {
  return (
    <div className="flex-1 overflow-y-auto">
      {contacts.map((contact) => (
        <div
          key={contact.id || contact.phone}
          className={`flex items-center p-4 cursor-pointer hover:bg-gray-100 ${
            selectedContact?.phone === contact.phone ? 'bg-gray-200' : ''
          }`}
          onClick={() => onSelectContact(contact)}
        >
          <Avatar
            initials={`${contact.name?.charAt(0) || ''}${contact.last_name?.charAt(0) || ''}`}
            color={getAvatarColor(contact.name, contact.last_name)}
          />
          <div className="ml-4 flex-1">
            <div className="font-medium">{contact.name || 'Unknown Name'}</div>
            <div className="text-sm text-gray-500">{contact.phone || 'No Phone'}</div>
          </div>
          {contact.unreadCount > 0 && (
            <span className="text-xs bg-red-500 text-white rounded-full px-2 py-1">
              {contact.unreadCount}
            </span>
          )}
        </div>
      ))}
    </div>
  );
};

// Utility function to get avatar color based on name initials
const getAvatarColor = (firstName, lastName) => {
  const initials = `${firstName?.charCodeAt(0) || 0}${lastName?.charCodeAt(0) || 0}`;
  const colorIndex = (initials % 10) + 1;
  return `avatar-bg-${colorIndex}`; // Ensure these classes are defined in your CSS
};

export default ContactList;