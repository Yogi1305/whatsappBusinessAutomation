import React from 'react';


const FlowManager = ({
  selectedFlow,
  flows,
  handleFlowChange,
  handleSendFlowData,
  isSending
}) => {
  return (
    <div>
      <h2 className="text-lg font-semibold mb-2">Flows</h2>
      <Select value={selectedFlow} onChange={handleFlowChange} className="w-full mb-2">
        <option value="" disabled>Select a flow</option>
        {flows.map(flow => (
          <option key={flow.id} value={flow.id}>
            {flow.name || `Flow ${flow.id}`}
          </option>
        ))}
      </Select>
      <Button
        onClick={handleSendFlowData}
        disabled={isSending}
        className="w-full bg-green-500 text-white"
      >
        {isSending ? 'Sending...' : 'Send Flow Data'}
      </Button>
    </div>
  );
};

export default FlowManager;