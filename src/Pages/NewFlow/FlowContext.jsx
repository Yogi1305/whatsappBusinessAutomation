import React, { createContext, useContext, useState, useCallback } from 'react';

const FlowContext = createContext();

export const FlowProvider = ({ children }) => {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [flowName, setFlowName] = useState('');
  const [flowDescription, setFlowDescription] = useState('');
  const [isExistingFlow, setIsExistingFlow] = useState(false);
  const [selectedFlowId, setSelectedFlowId] = useState(null);

  const updateNodeData = useCallback((nodeId, newData) => {
    setNodes((prevNodes) =>
      prevNodes.map((node) =>
        node.id === nodeId ? { ...node, data: { ...node.data, ...newData } } : node
      )
    );
  }, []);

  const resetFlow = useCallback(() => {
    setNodes([]);
    setEdges([]);
    setFlowName('');
    setFlowDescription('');
    setIsExistingFlow(false);
    setSelectedFlowId(null);
  }, []);

  const value = {
    nodes,
    setNodes,
    edges,
    setEdges,
    updateNodeData,
    flowName,
    setFlowName,
    flowDescription,
    setFlowDescription,
    isExistingFlow,
    setIsExistingFlow,
    selectedFlowId,
    setSelectedFlowId,
    resetFlow
  };

  return (
    <FlowContext.Provider value={value}>
      {children}
    </FlowContext.Provider>
  );
};

export const useFlow = () => useContext(FlowContext);