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
    <div className="space-y-6 p-4 sm:p-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
        <h1 className="text-2xl sm:text-4xl font-semibold text-center sm:text-left w-full">
          Broadcast History
        </h1>
        <div className="flex space-x-4 w-full sm:w-auto justify-center sm:justify-end">
          <button 
            onClick={handleBroadcastMessage}
            className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 w-full sm:w-auto"
          >
            New Broadcast
          </button>
          <button 
            onClick={handleGroup}
            className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 w-full sm:w-auto"
          >
            New Group
          </button>
        </div>
      </div>

      {/* Popups */}
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

      {/* Desktop Statistics Cards */}
      <div className="hidden sm:grid grid-cols-5 gap-4">
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

      {/* Mobile Statistics Cards */}
      <div className="grid grid-cols-3 sm:hidden gap-2">
        {[
          { label: 'Sent', value: broadcastHistory.reduce((sum, b) => sum + b.sent, 0) },
          { label: 'Delivered', value: broadcastHistory.reduce((sum, b) => sum + b.delivered, 0) },
          { label: 'Read', value: broadcastHistory.reduce((sum, b) => sum + b.read, 0) },
          { label: 'Replied', value: broadcastHistory.reduce((sum, b) => sum + b.replied, 0) },
          { label: 'Failed', value: broadcastHistory.reduce((sum, b) => sum + b.failed, 0) }
        ].map((stat, index) => (
          <Card key={index} className="p-2 text-center">
            <div className="text-lg font-bold">{stat.value}</div>
            <div className="text-xs text-gray-500">{stat.label}</div>
          </Card>
        ))}
      </div>

      {/* Desktop Table */}
      <div className="hidden sm:block overflow-x-auto">
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

      {/* Mobile Table */}
      <div className="sm:hidden space-y-4">
        {filteredBroadcastHistory.map(broadcast => (
          <Card key={broadcast.id} className="p-4 space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-semibold">{broadcast.name}</span>
              <span className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold
                ${broadcast.status.toLowerCase() === 'completed' ? 'bg-green-100 text-green-800' :
                  broadcast.status.toLowerCase() === 'in progress' ? 'bg-blue-100 text-blue-800' :
                  'bg-red-100 text-red-800'}`}>
                {broadcast.status}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div>
                <div className="text-sm font-medium">Sent</div>
                <div className="text-xs text-gray-600">{broadcast.sent}</div>
              </div>
              <div>
                <div className="text-sm font-medium">Delivered</div>
                <div className="text-xs text-gray-600">{broadcast.delivered}</div>
              </div>
              <div>
                <div className="text-sm font-medium">Read</div>
                <div className="text-xs text-gray-600">{broadcast.read}</div>
              </div>
              <div>
                <div className="text-sm font-medium">Replied</div>
                <div className="text-xs text-gray-600">{broadcast.replied}</div>
              </div>
              <div>
                <div className="text-sm font-medium">Failed</div>
                <div className="text-xs text-gray-600">{broadcast.failed}</div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default BroadcastHistory;