import { Height } from '@mui/icons-material';
import { ShoppingBag, Bot } from 'lucide-react';
import React from 'react';

const Sidebar = () => {
  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  const sidebarStyle = {
    width: '240px',
    padding: '15px',
    backgroundColor: 'white',
   
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

  const smallNodeStyle = {
    ...nodeStyle,
    fontSize: '15px',
    marginBottom: '5px',
    width:'8rem',
    height:'3rem',
    display:'flex',
    alignItems:'center',
    justifyContent:'center'
  };

  const iconStyle = {
    marginRight: '10px',
    fontSize: '20px',
  };

  const smallIconStyle = {
    ...iconStyle,
    fontSize: '16px',
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
      
      <div style={{display:'flex', alignItems:'center', gap:'1rem'}}>

      <div 
        style={{
          ...smallNodeStyle, 
          backgroundColor: 'blueviolet', 
          padding: '12px',      // Add padding inside the div
          display: 'flex',      // Align items horizontally
          alignItems: 'center', // Center-aligns the Bot icon vertically
          gap: '8px'            // Adds spacing between <Bot /> and "AI" text
        }} 
        onDragStart={(event) => onDragStart(event, 'ai')} 
        draggable
      >
        <Bot />
        <span>AI</span>
      </div>

      
      <div 
        style={{...smallNodeStyle, backgroundColor: 'yellowgreen',           padding: '12px',      // Add padding inside the div
          display: 'flex',      // Align items horizontally
          alignItems: 'center', // Center-aligns the Bot icon vertically
          gap: '8px'    }}
        onDragStart={(event) => onDragStart(event, 'product')} 
        draggable
        >
          <ShoppingBag />    
        <span>Product</span>
      </div>
    </div>
    </aside>
  );
};

export default Sidebar;