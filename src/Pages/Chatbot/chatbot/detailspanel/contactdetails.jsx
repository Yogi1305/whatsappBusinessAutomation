import React from 'react';
import Avatar from '../reusable/avatar';
const ContactDetails = ({ contact, profileImage }) => {
  return (
    <div className="mb-6">
      <div className="flex items-center">
        {profileImage ? (
          <img src={profileImage} alt="Profile" className="w-16 h-16 rounded-full" />
        ) : (
          <Avatar initials={`${contact.name?.charAt(0) || ''}${contact.last_name?.charAt(0) || ''}`} size="large" />
        )}
        <div className="ml-4">
          <h2 className="text-xl font-semibold">{contact.name} {contact.last_name}</h2>
          <p className="text-gray-500">{contact.phone}</p>
          <p className="text-gray-500">{contact.email}</p>
        </div>
      </div>
      <div className="mt-4 flex space-x-4">
        <CallRoundedIcon />
        <MailIcon />
      </div>
    </div>
  );
};

export default ContactDetails;