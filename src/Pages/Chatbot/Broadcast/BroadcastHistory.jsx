import React from 'react';
import { Card } from "@/components/ui/card";
import { toast } from "sonner"; 
const BroadcastHistory = ({
  broadcastHistory,
  filteredBroadcastHistory,
  handleBroadcastMessage,
  handleGroup,
  showBroadcastPopup,
  templates,
  selectedTemplate,
  contacts,
  broadcastGroup,
  selectedPhones,
  selectedBCGroups,
  isSendingBroadcast,
  handleTemplateClick,
  setShowTemplatePopup,
  handlePhoneSelection,
  handleBCGroupSelection,
  handleSendBroadcast,
  handleCloseBroadcastPopup,
  showGroupPopup,
setIsSendingBroadcast,
  groupName,
  setGroupName,
  handleCreateGroup,
  handleCloseGroupPopup,
  BroadcastPopup,
  GroupPopup,
  businessPhoneNumberId
}) => {
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
        setIsSendingBroadcast={setIsSendingBroadcast}
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