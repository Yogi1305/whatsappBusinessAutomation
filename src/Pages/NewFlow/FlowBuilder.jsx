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
import { AskQuestionNode, SendMessageNode, SetConditionNode } from './NodeTypes';
import Sidebar from "./Sidebar";
import "./FlowBuilder.css";
import SaveFlowPopup from "./SaveFlowPopup";
import axiosInstance from "../../api";
import { FlowProvider, useFlow } from './FlowContext';
import { useAuth } from "../../authContext";

let id = 0;
const getId = () => `${id++}`;

const nodeTypes = {
  askQuestion: AskQuestionNode,
  sendMessage: SendMessageNode,
  setCondition: SetConditionNode,
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
  const { authenticated } = useAuth();



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
  }, [setNodes, setEdges]);

  useEffect(() => {
    resetFlow();
  }, [resetFlow]);

  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [setNodes]
  );

  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [setEdges]
  );

  const onConnect = useCallback(
    (connection) => setEdges((eds) => addEdge(connection, eds)),
    [setEdges]
  );



  const fetchExistingFlows = async () => {
    try {
      const response = await axiosInstance.get('/node-templates/');
      setExistingFlows(response.data);
    } catch (error) {
      console.error('Error fetching existing flows:', error);
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

  const saveFlow = useCallback(async () => {
    console.log('Current nodes:', nodes);
    console.log('Current edges:', edges);
    if (!authenticated) {
      alert("Please log in to save your flow.");
      navigate('/login');
      return;
    }
    const startEdge = edges.find(edge => edge.source === 'start');
    const flow = {
      name: flowName,
      description: flowDescription,
      category: "default",
      node_data: {
        nodes: nodes.filter(node => node.id !== 'start').map(({ id, type, position, data }) => {
          const { updateNodeData, ...cleanData } = data;
          if (type === 'askQuestion' && cleanData.optionType === 'Variables') {
            return { id, type, position, data: { ...cleanData, dataTypes: cleanData.dataTypes || [] } };
          }
          return { id, type, position, data: cleanData };
        }),
        edges: edges.filter(edge => edge.source !== 'start'),
        start: startEdge ? startEdge.target : null,
        fallback_message: fallbackMessage,
        fallback_count: fallbackCount
      }
    };
    console.log('Flow to be saved:', flow);
    
    try {
      const response = await axiosInstance.post('/node-templates/', flow);
      console.log('Flow saved successfully:', response.data);
      setShowSavePopup(false);
      setIsExistingFlow(true);
      setSelectedFlow(flowName);
      fetchExistingFlows();
      // navigate('/ll/chatbot');
    } catch (error) {
      console.error('Error saving flow:', error);
    }
  }, [authenticated, navigate, nodes, edges, flowName, flowDescription, fetchExistingFlows]);

  const handleSaveConfirm = (name, description) => {
    setFlowName(name);
    setFlowDescription(description);
    saveFlow();
  };

  useEffect(() => {
    fetchExistingFlows();
  }, []);

  useEffect(() => {
    // Reset the flow when the component mounts
    resetFlow();
  }, [resetFlow]);

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
        setIsExistingFlow(true);
      } catch (error) {
        console.error('Error fetching flow:', error);
        resetFlow();
      } finally {
        setIsLoading(false);
      }
    }
  }, [setNodes, setEdges, updateNodeData, resetFlow]);

  const handleSaveClick = () => {
    if (authenticated) {
      setShowSavePopup(true);
    } else {
      alert("Please log in to save your flow.");
      navigate('/login');
    }
  };


  return (
    <div className="flow-builder">
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
          onCancel={() => setShowSavePopup(false)}
          fallbackMessage={fallbackMessage}
          fallbackCount={fallbackCount}
        />
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