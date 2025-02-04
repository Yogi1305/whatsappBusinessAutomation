import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getInitials } from '../../utils/helpers';

const ContactDetails = ({ contact, flows, selectedFlow, onFlowChange, onFlowSend }) => {
  return (
    <div className="contact-details">
      <div className="contact-header">
        <div className="avatar-container">
          {contact.profileImage ? (
            <img src={contact.profileImage} alt="Profile" className="contact-avatar-lg" />
          ) : (
            <div className={`default-avatar-lg ${getInitials(contact.name)}`}>
              {getInitials(contact.name, contact.lastName)}
            </div>
          )}
        </div>
        <h2 className="contact-title">{contact.name} {contact.lastName}</h2>
        <p className="contact-subtitle">{contact.phone}</p>
      </div>

      <div className="flow-section">
        <h3 className="section-title">Automation Flows</h3>
        <Select value={selectedFlow} onValueChange={onFlowChange}>
          <SelectTrigger className="flow-selector">
            <SelectValue placeholder="Select a flow" />
          </SelectTrigger>
          <SelectContent>
            {flows.map(flow => (
              <SelectItem key={flow.id} value={flow.id}>
                {flow.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <button 
          className="send-flow-button"
          onClick={onFlowSend}
        >
          Activate Flow
        </button>
      </div>
    </div>
  );
};

export default ContactDetails;