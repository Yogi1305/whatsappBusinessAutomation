import React, { createContext, useContext, useState, useCallback } from 'react';

const FlowContext = createContext();

export const FlowProvider = ({ children }) => {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);

  const updateNodeData = useCallback((nodeId, newData) => {
    setNodes(prevNodes => {
      const updatedNodes = prevNodes.map(node => 
        node.id === nodeId ? { ...node, data: { ...node.data, ...newData } } : node
      );
      console.log('Updated nodes:', updatedNodes);
      return updatedNodes;
    });
  }, []);

  const value = {
    nodes,
    setNodes,
    edges,
    setEdges,
    updateNodeData
  };

  return (
    <FlowContext.Provider value={value}>
      {children}
    </FlowContext.Provider>
  );
};

export const useFlow = () => useContext(FlowContext);