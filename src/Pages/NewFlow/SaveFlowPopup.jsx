// import React, { useState } from 'react';
// import "./FlowBuilder.css"
// import axiosInstance from '../../api';
// import { useFlow } from './FlowContext';
// import GreenTickAnimation  from './GreenTickAnimation'
// import { useNavigate } from 'react-router-dom';
// // import { useNavigate } from 'react-router-dom';


// const getTenantIdFromUrl = () => {
//   const pathArray = window.location.pathname.split('/');
//   if (pathArray.length >= 2) {
//     return pathArray[1]; // Assumes tenant_id is the first part of the path
//   }
//   return null; 
// };

// const SaveFlowPopup = ({ onSave, onCancel, fallbackMessage, fallbackCount }) => {
//   const [flowName, setFlowName] = useState('');
//   const [description, setDescription] = useState('');
//   const [error, setError] = useState('');
//   const [successMessage, setSuccessMessage] = useState('');
//   const [showSuccessPopup, setShowSuccessPopup] = useState(false);
//   const { nodes, edges } = useFlow();
//   const navigate = useNavigate();
//   const tenantId=getTenantIdFromUrl();

//   const handleSave = async () => {
//     if (!flowName.trim()) {
//       setError("Flow name is required");
//       return;
//     }

//     setError('');
//     setSuccessMessage('');
    
//     async function processNodes(nodesToProcess) {
//       // Create a deep copy of the nodes array
//       const processedNodes = JSON.parse(JSON.stringify(nodesToProcess));
      
//       // Iterate over each node in the processedNodes array
//       processedNodes.forEach(node => {
//         // Check if node.data has an 'id' and delete it
//         if (node.data && node.data.id) {
//           delete node.data.id;
//         }
//       });
    
//       return processedNodes;
//     }
    
//     const processedNodes = await processNodes(nodes);
//     console.log('Nodes before saving:', processedNodes);
//     console.log('Edges before saving:', edges);

//     const flow = {
//       name: flowName.trim(),
//       description: description.trim(),
//       category: "default",
//       node_data: {
//         fallback_message: fallbackMessage,
//         fallback_count: fallbackCount,
//         nodes: processedNodes.map(({ id, type, position, data }) => {
//           const { updateNodeData, ...cleanData } = data;
//           return { id, type, position, data: cleanData };
//         }),
//         edges
//       }
//     };

//     console.log('Flow to be saved:', flow);

//     try {
//       const response = await axiosInstance.post('https://hx587qc4-8000.inc1.devtunnels.ms/node-templates/', flow);
//       console.log('Flow saved successfully:', response.data);
//       setSuccessMessage('Flow saved successfully!');
//       setShowSuccessPopup(true);
//       setTimeout(() => {
//         onSave(flowName, description);
//         navigate(`/${tenantId}/chatbot`);
//         onCancel();
//       }, 2000); // Close the popup after 2 seconds
//     } catch (error) {
//       console.error('Error saving flow:', error);
//       if (error.response && error.response.data) {
//         setError(error.response.data.name || "Error saving flow. Please try again.");
//       } else {
//         setError("Error saving flow. Please try again.");
//       }
//     }
//   };

//   const SuccessPopup = ({ message }) => (
//     <div className="success-popup-flw">
//       <div className="success-popup-content">
//         <GreenTickAnimation />
//         <p>{message}</p>
//       </div>
//     </div>
//   );

//   return (
//     <>
//       {!showSuccessPopup && (
//         <div className="save-flow-popup">
//           <h2>Save Flow</h2>
//           {error && <div className="error-message">{error}</div>}
//           <input
//             type="text"
//             placeholder="Flow Name"
//             value={flowName}
//             onChange={(e) => setFlowName(e.target.value)}
//             required
//           />
//           <textarea
//             placeholder="Description (optional)"
//             value={description}
//             onChange={(e) => setDescription(e.target.value)}
//           />
//           <div>
//             <button onClick={handleSave}>Save</button>
//             <button onClick={onCancel}>Cancel</button>
//           </div>
//         </div>
//       )}
//       {showSuccessPopup && <SuccessPopup message={successMessage} />}
//     </>
//   );
// };

// export default SaveFlowPopup;



import React, { useState, useCallback } from 'react';
import "./FlowBuilder.css"
import axiosInstance, { djangoURL, fastURL } from '../../api';
import { useFlow } from './FlowContext';
import GreenTickAnimation from './GreenTickAnimation'
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const getTenantIdFromUrl = () => {
  const pathArray = window.location.pathname.split('/');
  if (pathArray.length >= 2) {
    return pathArray[1]; // Assumes tenant_id is the first part of the path
  }
  return null; 
};

const SaveFlowPopup = ({ onSave, onCancel, fallbackMessage, fallbackCount }) => {
  const [flowName, setFlowName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const { nodes, edges } = useFlow();
  const navigate = useNavigate();
  const tenantId = getTenantIdFromUrl();

  const validateNodes = useCallback(() => {
    let isValid = true;
    let errorMessages = [];

    // Check if start node is connected
    const startNodeConnected = edges.some(edge => edge.source === 'start');
    if (!startNodeConnected) {
      isValid = false;
      errorMessages.push("Please connect the Start node to another node");
    }

    nodes.forEach(node => {
      if (node.type === 'askQuestion') {
        if (!node.data.question || !node.data.question.trim()) {
          isValid = false;
          errorMessages.push(`Empty question in node ${node.id}`);
        }
        if (Array.isArray(node.data.options)) {
          node.data.options.forEach((option, index) => {
            if (!option || !option.trim()) {
              isValid = false;
              errorMessages.push(`Empty option ${index + 1} in node ${node.id}`);
            } else if (option.length > 24) {
              isValid = false;
              errorMessages.push(`Option ${index + 1} in node ${node.id} exceeds 24 characters`);
            }
          });
        }
      } else if (node.type === 'sendMessage') {
        if (node.data.fields && typeof node.data.fields === 'object') {
          const { type, content } = node.data.fields;
          switch (type) {
            case 'text':
              if (!content.text || !content.text.trim()) {
                isValid = false;
                errorMessages.push(`Empty message content in node ${node.id}`);
              }
              break;
            case 'Image':
            case 'Video':
            case 'Document':
              if (!content.med_id) {
                isValid = false;
                errorMessages.push(`No ${type.toLowerCase()} uploaded in node ${node.id}`);
              }
              break;
            default:
              isValid = false;
              errorMessages.push(`Invalid message type in Send Message node ${node.id}`);
          }
        } else {
          isValid = false;
          errorMessages.push(`Invalid fields structure in Send Message node ${node.id}`);
        }
      } else if (node.type === 'setCondition') {
        if (!node.data.condition || !node.data.condition.trim()) {
          isValid = false;
          errorMessages.push(`Empty condition in node ${node.id}`);
        }
      }
    });

    return { isValid, errorMessages };
  }, [nodes, edges]);

  const handleSave = async () => {
    if (!flowName.trim()) {
      setError("Flow name is required");
      return;
    }

    setError('');
    setSuccessMessage('');

    const { isValid, errorMessages } = validateNodes();
    if (!isValid) {
      setError(errorMessages.join('. '));
      return;
    }
    
    async function processNodes(nodesToProcess) {
      const processedNodes = JSON.parse(JSON.stringify(nodesToProcess));
      processedNodes.forEach(node => {
        if (node.data && node.data.id) {
          delete node.data.id;
        }
      });
      return processedNodes;
    }
    
    const processedNodes = await processNodes(nodes);

    const flow = {
      name: flowName.trim(),
      description: description.trim(),
      category: "default",
      node_data: {
        nodes: processedNodes.map(({ id, type, position, data }) => {
          const { updateNodeData, ...cleanData } = data;
          return { id, type, position, data: cleanData };
        }),
        edges
      },
      fallback_msg: fallbackMessage,
      fallback_count: fallbackCount,
    };

    try {
      const response = await axiosInstance.post(`${djangoURL}/node-templates/`, flow);
      console.log('Flow saved successfully:', response.data);
      setSuccessMessage('Flow saved successfully!');
      setShowSuccessPopup(true);
      setTimeout(() => {
        onSave(flowName, description);
        navigate(`/${tenantId}/chatbot`);
        onCancel();
      }, 2000);
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