import React, { useState } from 'react';
import "./FlowBuilder.css"
import axiosInstance from '../../api';
import { useFlow } from './FlowContext';
import GreenTickAnimation  from './GreenTickAnimation'
// import { useNavigate } from 'react-router-dom';

const SaveFlowPopup = ({ onSave, onCancel, fallbackMessage, fallbackCount }) => {
  const [flowName, setFlowName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const { nodes, edges } = useFlow();
  // const navigate = useNavigate();

  const handleSave = async () => {
    if (!flowName.trim()) {
      setError("Flow name is required");
      return;
    }

    setError('');
    setSuccessMessage('');
    
    async function processNodes(nodesToProcess) {
      // Create a deep copy of the nodes array
      const processedNodes = JSON.parse(JSON.stringify(nodesToProcess));
      
      // Iterate over each node in the processedNodes array
      processedNodes.forEach(node => {
        // Check if node.data has an 'id' and delete it
        if (node.data && node.data.id) {
          delete node.data.id;
        }
      });
    
      return processedNodes;
    }
    
    const processedNodes = await processNodes(nodes);
    console.log('Nodes before saving:', processedNodes);
    console.log('Edges before saving:', edges);

    const flow = {
      name: flowName.trim(),
      description: description.trim(),
      category: "default",
      node_data: {
        fallback_message: fallbackMessage,
        fallback_count: fallbackCount,
        nodes: processedNodes.map(({ id, type, position, data }) => {
          const { updateNodeData, ...cleanData } = data;
          return { id, type, position, data: cleanData };
        }),
        edges
      }
    };

    console.log('Flow to be saved:', flow);

    try {
      const response = await axiosInstance.post('/node-templates/', flow);
      console.log('Flow saved successfully:', response.data);
      setSuccessMessage('Flow saved successfully!');
      setShowSuccessPopup(true);
      setTimeout(() => {
        onSave(flowName, description);
        // navigate('/ll/chatbot');
        onCancel();
      }, 2000); // Close the popup after 2 seconds
    } catch (error) {
      console.error('Error saving flow:', error);
      if (error.response && error.response.data) {
        setError(error.response.data.name || "Error saving flow. Please try again.");
      } else {
        setError("Error saving flow. Please try again.");
      }
    }
  };

  const SuccessPopup = ({ message }) => (
    <div className="success-popup-flw">
      <div className="success-popup-content">
        <GreenTickAnimation />
        <p>{message}</p>
      </div>
    </div>
  );

  return (
    <>
      {!showSuccessPopup && (
        <div className="save-flow-popup">
          <h2>Save Flow</h2>
          {error && <div className="error-message">{error}</div>}
          <input
            type="text"
            placeholder="Flow Name"
            value={flowName}
            onChange={(e) => setFlowName(e.target.value)}
            required
          />
          <textarea
            placeholder="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <div>
            <button onClick={handleSave}>Save</button>
            <button onClick={onCancel}>Cancel</button>
          </div>
        </div>
      )}
      {showSuccessPopup && <SuccessPopup message={successMessage} />}
    </>
  );
};

export default SaveFlowPopup;