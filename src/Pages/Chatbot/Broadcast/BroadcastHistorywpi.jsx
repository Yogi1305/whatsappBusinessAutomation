import React from 'react';
import { Card } from "@/components/ui/card";
import { useCallback, useEffect, useRef, useState } from 'react';
import GroupPopup from './GroupPopup';
import { axiosInstance, fastURL } from '../../../api';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { whatsappURL } from '../../../Navbar';
import { MentionTextArea, convertMentionsForFrontend } from '../../NewFlow/MentionTextArea';
import { s } from 'framer-motion/client';
const getTenantIdFromUrl = () => {
    const pathArray = window.location.pathname.split('/');
    if (pathArray.length >= 2) {
      return pathArray[1];
    }
    return null;
  };
const BroadcastHistory = ({
    handleTemplateClick,
    setShowTemplatePopup,
    broadcastHistory,
    BroadcastPopup,
    GroupPopup,
    filteredBroadcastHistory
   
}) => {
    
    
    const [templates, setTemplates] = useState([]); 
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const [contacts, setContacts] = useState([]);
    const [broadcastGroup, setBroadcastGroup] = useState([]);
    const [selectedPhones, setSelectedPhones] = useState([]);
    const [selectedBCGroups, setSelectedBCGroups] = useState([]);
    const [showBroadcastPopup, setShowBroadcastPopup] = useState(false);
    const [isSendingBroadcast, setIsSendingBroadcast] = useState(false);
    const [showGroupPopup, setShowGroupPopup] = useState(false);
    const [groupName, setGroupName] = useState('');
    const [accessToken, setaccessToken] = useState('');
    const [accountId, setAccountId] = useState('');
    const tenantId = getTenantIdFromUrl();
    const [businessPhoneNumberId, setBusinessPhoneNumberId] = useState('');
    const fetchTemplates = useCallback(async () => {
        if (!accessToken || !accountId) return;
        try {
          const url = `https://graph.facebook.com/v20.0/${accountId}/message_templates?fields=name,status,components,language,category`;
          const response = await axios.get(url, {
            headers: {
              'Authorization': `Bearer ${accessToken}`
            }
          });
          const formattedTemplates = response.data.data.map(template => ({
            ...template,
            components: template.components.map(component => {
              if (component.type === "BODY") {
                return {
                  ...component,
                  text: convertMentionsForFrontend(component.text)
                };
              }
              return component;
            })
          }));
          setTemplates(formattedTemplates);
        } catch (error) {
          console.error('Error fetching templates:', error);
        }
      }, [accessToken, accountId]);
    
      useEffect(() => {
        if (accessToken && accountId) {
          fetchTemplates();
          
        }
      }, [accessToken, accountId, fetchTemplates]);
    
      useEffect(() => {
        const fetchBusinessPhoneId = async () => {
          try {
            const response = await axiosInstance.get(`${fastURL}/whatsapp_tenant/`, {
              headers: {
                'X-Tenant-ID': tenantId
              }
            });
            setBusinessPhoneNumberId(response.data.whatsapp_data[0].business_phone_number_id);
            setAccountId(response.data.whatsapp_data[0].business_account_id);
            setaccessToken(response.data.whatsapp_data[0].access_token);
            return response.data.whatsapp_data;
          } catch (error) {
            console.error('Error fetching business phone ID:', error);
          }
        };
    
        fetchBusinessPhoneId();
      }, [tenantId]);
    
  const fetchContacts = async () => {
    try {
      const broadcastGroupPromise = axiosInstance.get(`${fastURL}/broadcast-groups/`)
      const response = await axiosInstance.get(`${fastURL}/contacts/`, {
        headers: {
          token: localStorage.getItem('token'),
        },
      });
      // Ensure all contacts have the necessary properties
      const processedContacts = response.data.map(contact => ({
        ...contact,
        first_name: contact.first_name || '',
        last_name: contact.last_name || '',
        lastMessageTime: contact.lastMessageTime || null,
        hasNewMessage: contact.hasNewMessage || false
      }));
      setContacts(sortContacts(processedContacts));

      const broadcastGroupResponse = await broadcastGroupPromise
      console.log("Broadcast Group Response: ", broadcastGroupResponse.data)
      const formattedGroups = await formatGroups(broadcastGroupResponse.data)
      console.log("Formatted groups: ", formattedGroups)
      setBroadcastGroup(formattedGroups)
    } catch (error) {
      console.error("Error fetching contacts data:", error);
    }
  };
  useEffect(() => {
    fetchContacts();
  }, []);
  const sortContacts = (contactsToSort) => {
    return contactsToSort.sort((a, b) => {
      if (a.hasNewMessage !== b.hasNewMessage) {
        return b.hasNewMessage ? 1 : -1;
      }
      if (a.lastMessageTime !== b.lastMessageTime) {
        return new Date(b.lastMessageTime || 0) - new Date(a.lastMessageTime || 0);
      }
      const nameA = `${a.first_name || ''} ${a.last_name || ''}`.trim();
      const nameB = `${b.first_name || ''} ${b.last_name || ''}`.trim();
      return nameA.localeCompare(nameB);
    });
  };  
    const formatGroups = async (data) => {
    const groups = {};
    let idCounter = 1;
  
    data.forEach(group => {
      const groupName = group.name
  
      // Initialize the group if it doesn't exist
      // console.log("DOING GROUP: ", groupName)
      if (!groups[groupName]) {
        groups[groupName] = {
          id: group.id, // Increment ID for each new group
          name: groupName,
          contacts: group.members
        };
      }
    });
  
    // Convert the groups object into an array and join contact names with commas
    return Object.values(groups).map(group => ({
      id: group.id,
      name: group.name || null,
      members: group.contacts
    }));
  };

  
  const handlePhoneSelection = (contact) => {
    setSelectedPhones(prevSelected => 
      prevSelected.includes(contact)
        ? prevSelected.filter(id => id !== contact)
        : [...prevSelected, contact]
    );
  };

  const handleBCGroupSelection = (bgId) => {
    console.log("Broadcast::::::::", bgId)
    setSelectedBCGroups(prevSelected => 
      prevSelected.includes(bgId)
        ? prevSelected.filter(id => id !== bgId)
        : [...prevSelected, bgId]
    );
  };

  const handleSendBroadcast = async () => {
    if (selectedPhones.length === 0 && selectedBCGroups.length === 0) {
      alert("Please select at least one contact or group and enter a message.");
      return;
    }
  
    setIsSendingBroadcast(true);
    
    try {
      let bg_id;
      let bg_name;

      const phoneNumbers = [
        ...selectedPhones.map((contact) => parseInt(contact.phone)),
        ...selectedBCGroups.flatMap((bgId) => {
          const bcg = broadcastGroup.find((bg) => bg.id === bgId);
          bg_id = bcg.id;
          bg_name = bcg.name;
          return bcg.members.map(member => parseInt(member.phone));
        })
      ].filter(Boolean);
  
      const payload = {
        bg_id: bg_id,
        bg_name: bg_name,
        template: {
          id: selectedTemplate.id,
          name: selectedTemplate?.name || "under_name",
        },
        business_phone_number_id: businessPhoneNumberId,
        phoneNumbers: phoneNumbers,
      };

      const response = await axios.post(`${whatsappURL}/send-template/`, payload, {
        headers: {
          'X-Tenant-ID': tenantId
        }
      });
  
      if (response.status === 200) {
        alert("Broadcast message sent successfully!");
        handleCloseBroadcastPopup();
      } else {
        throw new Error("Failed to send broadcast");
      }
    } catch (error) {
      console.error("Error sending broadcast:", error);
      alert("Failed to send broadcast message. Please try again.");
    } finally {
      setIsSendingBroadcast(false);
    }
  };
  const handleCloseBroadcastPopup = () => {
    setShowBroadcastPopup(false);
    setSelectedPhones([]);
    setSelectedBCGroups([]);
    setGroupName('');
    setIsSendingBroadcast(false);
  };

  
  const handleCloseGroupPopup = () => {
    setShowGroupPopup(false);
    setSelectedPhones([]);
    setSelectedBCGroups([]);
    setGroupName('');
  };
  
  const handleBroadcastMessage = () => {
    setShowBroadcastPopup(true);
  };

  const handleGroup = () => {
    setShowGroupPopup(true);
  };
  const handleCreateGroup = async () => {
    console.log(selectedPhones,"lookhere");
    try {
      const members = selectedPhones.map(contact => ({
        phone: contact.phone,
        name: contact.name
      }));
      
      const payload = {
        members: members,
        id: uuidv4(),
        name: groupName
      };
      
      const response = await axiosInstance.post(`${fastURL}/broadcast-groups/`, payload, {
        headers: {
          'X-Tenant-ID': tenantId
        }
      });

      if (response.status === 200) {
        alert("Contacts added to group successfully!");
        setBroadcastGroup((prevGroups) => [...prevGroups, payload]);
        setSelectedPhones([]);
      } else {
        throw new Error("Failed to create broadcast group");
      }
    } catch (error) {
      console.error("Error creating broadcast group:", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-semibold">Broadcast History</h1>
        <div className="space-x-4">
          <button 
            onClick={handleBroadcastMessage}
            className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90"
          >
            New Broadcast
          </button>
          <button 
            onClick={handleGroup}
            className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90"
          >
            New Group
          </button>
        </div>
      </div>

      <BroadcastPopup
        showBroadcastPopup={showBroadcastPopup}
        templates={templates}
        selectedTemplate={selectedTemplate}
        contacts={contacts}
        broadcastGroup={broadcastGroup}
        selectedPhones={selectedPhones}
        selectedBCGroups={selectedBCGroups}
        isSendingBroadcast={isSendingBroadcast}
        onTemplateSelect={handleTemplateClick}
        onCreateTemplate={() => setShowTemplatePopup(true)}
        onPhoneSelection={handlePhoneSelection}
        onBCGroupSelection={handleBCGroupSelection}
        onSendBroadcast={handleSendBroadcast}
        onClose={handleCloseBroadcastPopup}
      />

      <GroupPopup
        showGroupPopup={showGroupPopup}
        groupName={groupName}
        contacts={contacts}
        broadcastGroup={broadcastGroup}
        selectedPhones={selectedPhones}
        onGroupNameChange={setGroupName}
        onPhoneSelection={handlePhoneSelection}
        onCreateGroup={handleCreateGroup}
        onClose={handleCloseGroupPopup}
      />

      <div className="grid grid-cols-5 gap-4">
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold">
            {broadcastHistory.reduce((sum, b) => sum + b.sent, 0)}
          </div>
          <div className="text-sm text-gray-500">Sent</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold">
            {broadcastHistory.reduce((sum, b) => sum + b.delivered, 0)}
          </div>
          <div className="text-sm text-gray-500">Delivered</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold">
            {broadcastHistory.reduce((sum, b) => sum + b.read, 0)}
          </div>
          <div className="text-sm text-gray-500">Read</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold">
            {broadcastHistory.reduce((sum, b) => sum + b.replied, 0)}
          </div>
          <div className="text-sm text-gray-500">Replied</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold">
            {broadcastHistory.reduce((sum, b) => sum + b.failed, 0)}
          </div>
          <div className="text-sm text-gray-500">Failed</div>
        </Card>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left p-4">Name</th>
              <th className="text-left p-4">Sent</th>
              <th className="text-left p-4">Delivered</th>
              <th className="text-left p-4">Read</th>
              <th className="text-left p-4">Replied</th>
              <th className="text-left p-4">Failed</th>
              <th className="text-left p-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredBroadcastHistory.map(broadcast => (
              <tr key={broadcast.id} className="border-b">
                <td className="p-4">{broadcast.name}</td>
                <td className="p-4">{broadcast.sent}</td>
                <td className="p-4">{broadcast.delivered}</td>
                <td className="p-4">{broadcast.read}</td>
                <td className="p-4">{broadcast.replied}</td>
                <td className="p-4">{broadcast.failed}</td>
                <td className="p-4">
                  <span className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold
                    ${broadcast.status.toLowerCase() === 'completed' ? 'bg-green-100 text-green-800' :
                      broadcast.status.toLowerCase() === 'in progress' ? 'bg-blue-100 text-blue-800' :
                      'bg-red-100 text-red-800'}`}>
                    {broadcast.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BroadcastHistory;