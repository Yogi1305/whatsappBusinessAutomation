import React from 'react';
import Avatar from '../Reusable/Avatar';



const ChatHeader = ({ contact, profileImage }) => {
  return (
    <div className="flex items-center justify-between p-4 border-b">
      <div className="flex items-center">
        {profileImage ? (
          <img src={profileImage} alt="Profile" className="w-10 h-10 rounded-full" />
        ) : (
          <Avatar initials={`${contact.name?.charAt(0) || ''}${contact.last_name?.charAt(0) || ''}`} />
        )}
        <div className="ml-4">
          <div className="font-medium">{contact.name} {contact.last_name}</div>
          <div className="text-sm text-gray-500">{contact.phone}</div>
        </div>
      </div>
      <div className="flex space-x-2">
        <Button variant="icon">
          <CallRoundedIcon />
        </Button>
        <Button variant="icon">
          <MailIcon />
        </Button>
      </div>
    </div>
  );
};

export default ChatHeader;