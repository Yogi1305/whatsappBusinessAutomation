import React, { useState, useRef, useCallback, useEffect, useMemo } from "react";
import { useParams, useNavigate, Navigate } from "react-router-dom";
import ReactFlow, {
  ReactFlowProvider,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  MiniMap,
  Background,
  applyNodeChanges,
  applyEdgeChanges,
  Handle,
  Position
} from "reactflow";
import "reactflow/dist/style.css";
import { AskQuestionNode, SendMessageNode, SetConditionNode, AINode } from './NodeTypes';
import { DelayNode } from './DelayNode';
import Sidebar from "./Sidebar";
import "./FlowBuilder.css";
import SaveFlowPopup from "./SaveFlowPopup";
import axiosInstance from "../../api";
import { FlowProvider, useFlow } from './FlowContext';
import { useAuth } from "../../authContext";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import defaultFlow from "./DefaultFlow";

let id = 0;
const getId = () => `${id++}`;

const nodeTypes = {
  askQuestion: AskQuestionNode,
  sendMessage: SendMessageNode,
  setCondition: SetConditionNode,
  delay: DelayNode,
  ai: AINode,
  start: ({ data }) => (
    <div style={{ padding: '10px', border: '2px solid #4CAF50', borderRadius: '5px', background: '#E8F5E9' }}>
      <strong>{data.label}</strong>
      <Handle type="source" position={Position.Right} id="a" />
    </div>
  ),
};

const FlowBuilderContent = () => {
  const { nodes, setNodes, edges, setEdges, updateNodeData } = useFlow();
  const reactFlowWrapper = useRef(null);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const { templateId } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  // const navigate = useNavigate();
  const [showSavePopup, setShowSavePopup] = useState(false);
  const [isExistingFlow, setIsExistingFlow] = useState(false);
  const [existingFlows, setExistingFlows] = useState([]);
  const [selectedFlow, setSelectedFlow] = useState('');
  const [flowName, setFlowName] = useState('');
  const [flowDescription, setFlowDescription] = useState('');
  const [fallbackMessage, setFallbackMessage] = useState('');
  const [fallbackCount, setFallbackCount] = useState(1);
  const navigate = useNavigate();
  const [errorNodes,setErrorNodes]=useState();
  const { authenticated } = useAuth();
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [flowToDelete, setFlowToDelete] = useState(null);
  const [defaultFlowLoaded, setDefaultFlowLoaded] = useState(false);

  const handleDeleteClick = (flowId) => {
    setFlowToDelete(flowId);
    setShowDeleteConfirmation(true);
  };

  const confirmDelete = async () => {
    if (flowToDelete) {
      try {
        await axiosInstance.delete(`/node-templates/${flowToDelete}/`);
        toast.success("Flow deleted successfully");
        fetchExistingFlows();
        if (selectedFlow === flowToDelete) {
          resetFlow();
          setSelectedFlow('');
        }
      } catch (error) {
        console.error('Error deleting flow:', error);
        toast.error("Failed to delete flow");
      }
    }
    setShowDeleteConfirmation(false);
    setFlowToDelete(null);
  };

  const cancelDelete = () => {
    setShowDeleteConfirmation(false);
    setFlowToDelete(null);
  };


  const startNode = {
    id: 'start',
    type: 'start',
    position: { x: 0, y: 0 },
    data: { label: 'Start' },
  };

  const resetFlow = useCallback(() => {
    setNodes([startNode]);
    setEdges([]);
    setFlowName('');
    setFlowDescription('');
    setIsExistingFlow(false);
    setSelectedFlow('');
    toast.info("Flow reset successfully");
  }, [setNodes, setEdges]);

  // useEffect(() => {
  //   resetFlow();
  // }, [resetFlow]);

  const onNodesChange = useCallback(
    (changes) => {
      // Filter out any changes that would delete the start node
      const filteredChanges = changes.filter(change => 
        !(change.type === 'remove' && change.id === 'start')
      );
      setNodes((nds) => applyNodeChanges(filteredChanges, nds));
    },
    [setNodes]
  );

  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [setEdges]
  );

  const onConnect = useCallback(
    (params) => {
      // Check if the source node already has an outgoing connection
      const sourceHasConnection = edges.some(
        (edge) => edge.source === params.source && edge.sourceHandle === params.sourceHandle
      );
  
      if (!sourceHasConnection) {
        setEdges((eds) => addEdge(params, eds));
      } else {
        toast.warning("This output is already connected. Please remove the existing connection first.");
      }
    },
    [edges, setEdges]
  );



  const fetchDefaultFlow = useCallback(async () => {
    setIsLoading(true);
    try {
      const flow = defaultFlow;
      const lastNodeId = Math.max(
        ...flow.nodes
          .map(node => parseInt(node.id, 10))
          .filter(id => !isNaN(id))
      );
      id = parseInt(lastNodeId) + 1;
      
      const mappedNodes = flow.nodes.map(node => ({
        ...node,
        data: {
          ...node.data,
          updateNodeData: (newData) => updateNodeData(node.id, newData),
        },
      }));

      const mappedEdges = flow.edges;

      setNodes(mappedNodes);
      setEdges(mappedEdges);
      setFlowName("Default Flow");
      setFlowDescription("This is the default flow for unauthenticated users.");
      setIsExistingFlow(true);
      toast.info("Default flow loaded");
    } catch (error) {
      console.error('Error fetching default flow:', error);
      toast.error("Failed to load default flow");
      resetFlow();
    } finally {
      setIsLoading(false);
    }
  }, [setNodes, setEdges, updateNodeData, resetFlow]);

  useEffect(() => {
    if (!authenticated) {
      fetchDefaultFlow();
    } else {
      resetFlow();
      fetchExistingFlows();
    }
  }, [authenticated, fetchDefaultFlow, resetFlow]);



  const fetchExistingFlows = async () => {
    if (!authenticated) return;
    try {
      const response = await axiosInstance.get('/node-templates/');
      setExistingFlows(response.data);
      toast.success("Existing flows fetched successfully");
    } catch (error) {
      console.error('Error fetching existing flows:', error);
      toast.error("Failed to fetch existing flows");
    }
    setIsLoading(false);
  };

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();
      console.log(nodes,"sec 54");
      const type = event.dataTransfer.getData("application/reactflow");
  
      if (typeof type === "undefined" || !type || type === 'start') {
        return;
      }
  
      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });
  
      const newId = getId();
      let newNodeData = { id: newId, label: `${type} node` };
    
      if (type === 'askQuestion') {
        newNodeData = { id: newId, question: '', options: [] };
      } else if (type === 'sendMessage') {
        newNodeData = { id: newId, fields: [{ type: 'Message', content: '' }] };
      } else if (type === 'setCondition') {
        newNodeData = { id: newId, condition: '' };
      }
  
      const newNode = {
        id: newId,
        type,
        position,
        data: newNodeData,
      };
  
      setNodes((nds) => {
        const updatedNodes = nds.concat(newNode);
        console.log('Nodes after adding:', updatedNodes);
        return updatedNodes;
      });
    },
    [reactFlowInstance, setNodes]
  );
 


  const validateNodes = useCallback(() => {
    console.log('Starting node validation');
    let isValid = true;
    let newErrorNodes = [];
  
    const startNodeConnected = edges.some(edge => edge.source === 'start');
    if (!startNodeConnected) {
      console.log('Error: Start node is not connected');
      isValid = false;
      newErrorNodes.push('start');
      toast.error("Please connect the Start node to another node");
    }
  
    // Validate fallback message
    if (!fallbackMessage || !fallbackMessage.trim()) {
      console.log('Error: Fallback message is empty');
      isValid = false;
      toast.error("Please enter a fallback message");
    }
  
    const updatedNodes = nodes.map(node => {
      console.log(`Validating node: ${node.id}, Type: ${node.type}`);
      let hasError = false;
      
      if (node.type === 'askQuestion') {
        console.log('Ask Question node data:', node.data);
        if (!node.data.question || !node.data.question.trim()) {
          console.log(`Error: Empty question in node ${node.id}`);
          hasError = true;
          isValid = false;
          toast.error(`Please enter a question for node ${node.id}`);
        }
        if (Array.isArray(node.data.options)) {
          const optionTexts = new Set();
          node.data.options.forEach((option, index) => {
            console.log(`Validating option ${index}:`, option);
            if (!option || !option.trim()) {
              console.log(`Error: Empty option ${index} in node ${node.id}`);
              hasError = true;
              isValid = false;
              toast.error(`Please enter text for option ${index + 1} in node ${node.id}`);
            } else if (option.length > 24) {
              console.log(`Error: Option ${index} in node ${node.id} exceeds 24 characters`);
              hasError = true;
              isValid = false;
              toast.error(`Option ${index + 1} in node ${node.id} exceeds 24 characters`);
            } else if (optionTexts.has(option.toLowerCase())) {
              console.log(`Error: Duplicate option ${option} in node ${node.id}`);
              hasError = true;
              isValid = false;
              toast.error(`Duplicate option "${option}" in node ${node.id}`);
            } else {
              optionTexts.add(option.toLowerCase());
            }
          });
        } else {
          console.log(`Warning: options is not an array in node ${node.id}`);
        }
      } else if (node.type === 'sendMessage') {
        console.log('Send Message node data:', node.data);
        if (node.data.fields && typeof node.data.fields === 'object') {
          const { type, content } = node.data.fields;
          
          switch (type) {
            case 'text':
              if (!content.text || !content.text.trim()) {
                console.log(`Error: Empty message content in node ${node.id}`);
                hasError = true;
                isValid = false;
                toast.error(`Please enter a message for the Send Message node ${node.id}`);
              }
              break;
            case 'Image':
            case 'Video':
            case 'Document':
              if (!content.med_id) {
                console.log(`Error: No ${type.toLowerCase()} uploaded in node ${node.id}`);
                hasError = true;
                isValid = false;
                toast.error(`Please upload a ${type.toLowerCase()} for the Send Message node ${node.id}`);
              }
              break;
            default:
              console.log(`Error: Invalid message type "${type}" in node ${node.id}`);
              hasError = true;
              isValid = false;
              toast.error(`Invalid message type in Send Message node ${node.id}`);
          }
        } else {
          console.log(`Error: Invalid fields structure in Send Message node ${node.id}`);
          hasError = true;
          isValid = false;
        }
      } else if (node.type === 'setCondition') {
        console.log('Set Condition node data:', node.data);
        if (!node.data.condition || !node.data.condition.trim()) {
          console.log(`Error: Empty condition in node ${node.id}`);
          hasError = true;
          isValid = false;
          toast.error(`Please enter a condition for node ${node.id}`);
        }
      }
      
      if (hasError) {
        console.log(`Adding node ${node.id} to error nodes`);
        newErrorNodes.push(node.id);
      }
  
      return {
        ...node,
        style: {
          ...node.style,
          border: hasError ? '2px solid red' : undefined,
        },
      };
    });
  
    console.log('Updated nodes:', updatedNodes);
    console.log('Error nodes:', newErrorNodes);
    console.log('Is valid:', isValid);
  
    setNodes(updatedNodes);
    setErrorNodes(newErrorNodes);
    return isValid;
  }, [nodes, edges, setNodes, fallbackMessage]);


  const saveFlow = useCallback(async () => {
    if (!authenticated) {
      toast.error("Please log in to save your flow");
      navigate('/login');
      return;
    }
  
    if (!validateNodes()) {
      toast.error("Please fill in all required fields and check character limits");
      return;
    }
  
    const startEdge = edges.find(edge => edge.source === 'start');
    const flow = {
      name: flowName,
      description: flowDescription,
      category: "default",
      node_data: {
        nodes: nodes.filter(node => node).map(({ id, type, position, data }) => {
          const { updateNodeData, hasError, ...cleanData} = data;
          console.log(updateNodeData,"here is 1");
          console.log(data,"here is 2");
          if (type === 'askQuestion' && cleanData.optionType === 'Variables') {
            return { id, type, position, data: { ...cleanData, dataTypes: cleanData.dataTypes || [] } };
          }
          if (type === 'sendMessage') {
            return { id, type, position, data: { fields: cleanData.fields } };
          }
          return { id, type, position, data: cleanData };
        }),
        edges: edges.filter(edge => edge),
        start: startEdge ? startEdge.target : null,
        fallback_message: fallbackMessage,
        fallback_count: fallbackCount
      }
    };
    
    try {
      let response;
      if (isExistingFlow) {
        response = await axiosInstance.put(`/node-templates/${selectedFlow}/`, flow);
        toast.success("Flow updated successfully");
      } else {
        response = await axiosInstance.post('/node-templates/', flow);
        toast.success("New flow created successfully");
        setIsExistingFlow(true);
        setSelectedFlow(response.data.id);
      }
      console.log('Flow saved successfully:', response.data);
      setShowSavePopup(false);
      fetchExistingFlows();
    } catch (error) {
      console.error('Error saving flow:', error);
      toast.error("Failed to save flow");
    }
  }, [authenticated, navigate, nodes, edges, flowName, flowDescription, isExistingFlow, selectedFlow, fallbackMessage, fallbackCount, fetchExistingFlows, validateNodes]);
  



  const handleSaveConfirm = (name, description) => {
    setFlowName(name);
    setFlowDescription(description);
    saveFlow();
  };

  useEffect(() => {
    fetchExistingFlows();
  }, []);

  // useEffect(() => {
  //   // Reset the flow when the component mounts
  //   resetFlow();
  // }, [resetFlow]);

  const handleFlowSelect = useCallback(async (e) => {
    const flowId = e.target.value;
    setSelectedFlow(flowId);
   
    if (flowId === 'create_new') {
      resetFlow();
    } else if (flowId) {
      setIsLoading(true);
      try {
        const response = await axiosInstance.get(`/node-templates/${flowId}/`);
        const flow = response.data;
        const lastNodeId = Math.max(
          ...flow.node_data.nodes
            .map(node => parseInt(node.id, 10))  // Convert IDs to integers
            .filter(id => !isNaN(id))            // Filter out any NaN values
        );
        id=parseInt(lastNodeId)+1;
        const mappedNodes = [
          startNode,
          ...flow.node_data.nodes.map(node => ({
            ...node,
            data: {
              ...node.data,
              updateNodeData: (newData) => updateNodeData(node.id, newData),
            },
          }))
        ];

        const mappedEdges = [
          ...(flow.node_data.start ? [{ id: 'start-edge', source: 'start', target: flow.node_data.start }] : []),
          ...flow.node_data.edges
        ];

        setNodes(mappedNodes);
        setEdges(mappedEdges);
        setFlowName(flow.name);
        setFlowDescription(flow.description);
        setFallbackMessage(flow.node_data.fallback_message || '');
      setFallbackCount(flow.node_data.fallback_count || 1);
        setIsExistingFlow(true);
        toast.success("Flow loaded successfully");
      } catch (error) {
        console.error('Error fetching flow:', error);
        toast.error("Failed to load flow");
        resetFlow();
      } finally {
        setIsLoading(false);
      }
    }
  }, [setNodes, setEdges, updateNodeData, resetFlow]);

  const handleSaveClick = () => {
    console.log(JSON.stringify(reactFlowInstance.toObject()),"dekho yahan");
    if (authenticated) {
      if (isExistingFlow) {
        // If it's an existing flow, save directly without showing the popup
        saveFlow();
      } else {
        // If it's a new flow, show the save popup
        setShowSavePopup(true);
      }
    } else {
      toast.error("Please log in to save your flow");
      navigate('/login');
    }
  };


  return (
    <div className="flow-builder">
      <ToastContainer position="top-right" autoClose={2000} />
      <Sidebar />
      <ReactFlowProvider>
        <div className="reactflow-wrapper" ref={reactFlowWrapper}>
          {isLoading ? (
            <div>Loading...</div>
          ) : (
            <ReactFlow
              nodes={nodes}
              edges={edges}
              nodeTypes={nodeTypes}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onInit={setReactFlowInstance}
              onDrop={onDrop}
              onDragOver={(event) => event.preventDefault()}
              minZoom={0.001}
              connectionMode="loose"
              defaultEdgeOptions={{
                type: 'smoothstep',
                animated: true,
              }}
              connectOnClick={false}
            >
              <Controls />
              <MiniMap />
              <Background />
            </ReactFlow>
          )}
        </div>
      </ReactFlowProvider>
      <div className="sidebar">
      <button onClick={handleSaveClick}>
          {authenticated ? "Save Flow" : "Save Flow"}
        </button>
        {authenticated && (
          <>
            <select style={{marginBottom:'3rem'}} value={selectedFlow} onChange={handleFlowSelect}>
              <option value="">Select a flow</option>
              <option value="create_new">Create New Flow</option>
              {existingFlows.map(flow => (
                <option key={flow.id} value={flow.id}>{flow.name}</option>
              ))}
            </select>
            {selectedFlow && selectedFlow !== 'create_new' && (
              <button 
                onClick={() => handleDeleteClick(selectedFlow)}
                style={{
                  backgroundColor: '#ff4d4d',
                  color: 'white',
                  border: 'none',
                  padding: '5px 10px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  marginBottom: '1rem'
                }}
              >
                Delete Selected Flow
              </button>
            )}
            <div style={{marginBottom:'2rem'}}>
              <label htmlFor="fallbackMessage">Fallback Message:</label>
              <input
                id="fallbackMessage"
                style={{padding:'5px', borderRadius:'6px'}}
                type="text"
                value={fallbackMessage}
                onChange={(e) => setFallbackMessage(e.target.value)}
                placeholder="Enter fallback message"
              />
            </div>
            <div>
              <label htmlFor="fallbackCount">Fallback Count:</label>
              <select
                id="fallbackCount"
                value={fallbackCount}
                onChange={(e) => setFallbackCount(Number(e.target.value))}
              >
                {[1, 2, 3, 4, 5,6,7,8,9,10].map((num) => (
                  <option key={num} value={num}>
                    {num}
                  </option>
                ))}
              </select>
            </div>
          </>
        )}
      </div>
      {showSavePopup && authenticated && (
        <SaveFlowPopup
          onSave={handleSaveConfirm}
          onCancel={() => {setShowSavePopup(false);toast.info("Save cancelled");}}
          fallbackMessage={fallbackMessage}
          fallbackCount={fallbackCount}
        />
      )}
       {showDeleteConfirmation && (
        <div className="delete-confirmation-popup">
          <p>Are you sure you want to delete this flow?</p>
          <button onClick={confirmDelete}>Yes, delete</button>
          <button onClick={cancelDelete}>Cancel</button>
        </div>
      )}
    </div>
  );
};

const FlowBuilder = () => (
  <FlowProvider>
    <ReactFlowProvider>
      <FlowBuilderContent />
    </ReactFlowProvider>
  </FlowProvider>
);

export default FlowBuilder;