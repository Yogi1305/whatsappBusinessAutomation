import React from 'react';
import { Input } from "@/components/ui/input"; // Adjust path based on your setup
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";

const Sidebar = ({
  contacts,
  selectedContact,
  onSelectContact,
  searchText,
  setSearchText,
  showNewChatInput,
  toggleNewChatInput,
  handleNewChat,
  newPhoneNumber,
}) => {
  return (
    <div className="flex flex-col h-full bg-white shadow-md">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h1 className="text-lg font-semibold">Contacts</h1>
        <Button variant="default" size="icon" onClick={toggleNewChatInput}>
          <PlusIcon className="w-5 h-5" />
        </Button>
      </div>

      {/* New Chat Input */}
      {showNewChatInput && (
        <div className="p-4 border-b border-gray-200">
          <Input
            placeholder="Enter phone number"
            value={newPhoneNumber}
            onChange={(e) => handleNewChat(e.target.value)}
          />
          <Button
            variant="primary"
            className="mt-2 w-full"
            onClick={() => handleNewChat(newPhoneNumber)}
          >
            Start New Chat
          </Button>
        </div>
      )}

      {/* Search Bar */}
      <div className="p-4 border-b border-gray-200">
        <Input
          placeholder="Search contacts"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
      </div>

      {/* Contact List */}
      <div className="flex-1 overflow-y-auto">
        {contacts.map((contact) => (
          <div
            key={contact.id}
            className={`p-4 cursor-pointer ${
              selectedContact === contact.id
                ? "bg-gray-100"
                : "hover:bg-gray-50"
            }`}
            onClick={() => onSelectContact(contact.id)}
          >
            <p className="text-sm font-medium">{contact.name}</p>
            <p className="text-xs text-gray-500">{contact.phone}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
