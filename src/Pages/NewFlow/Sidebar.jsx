import React from 'react';

const Sidebar = () => {
  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  const sidebarStyle = {
    width: '240px',
    padding: '15px',
    backgroundColor: '#f0f0f0',
    borderRight: '1px solid #ccc',
  };

  const headerStyle = {
    fontSize: '20px',
    fontWeight: 'bold',
    marginBottom: '15px',
  };

  const nodeStyle = {
    padding: '10px',
    borderRadius: '5px',
    marginBottom: '10px',
    cursor: 'move',
    color: 'white',
    fontWeight: 'bold',
  };

  const iconStyle = {
    marginRight: '10px',
    fontSize: '20px',
  };

  return (
    <aside style={sidebarStyle}>
      <div style={headerStyle}>Add Nodes</div>
      <div 
        style={{...nodeStyle, backgroundColor: '#FF7F50'}}
        onDragStart={(event) => onDragStart(event, 'sendMessage')} 
        draggable
      >
        <span style={iconStyle}>&gt;</span>
        Send a Message
        <div style={{fontSize: '12px', fontWeight: 'normal'}}>With no response required from visitor</div>
      </div>
      <div 
        style={{...nodeStyle, backgroundColor: '#FFA500'}}
        onDragStart={(event) => onDragStart(event, 'askQuestion')} 
        draggable
      >
        <span style={iconStyle}>?</span>
        Ask a Question
        <div style={{fontSize: '12px', fontWeight: 'normal'}}>Ask question and store user input in variable</div>
      </div>
      <div 
        style={{...nodeStyle, backgroundColor: '#4169E1'}}
        onDragStart={(event) => onDragStart(event, 'setCondition')} 
        draggable
      >
        <span style={iconStyle}>&#9781;</span>
        Set a Condition
        <div style={{fontSize: '12px', fontWeight: 'normal'}}>Send message(s) based on logical condition(s)</div>
      </div>
    </aside>
  );
};

export default Sidebar;