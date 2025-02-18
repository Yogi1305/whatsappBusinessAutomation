import { ShoppingBag, Bot, Network, Clock, ChevronDown, ChevronUp } from 'lucide-react';
import React, { useState } from 'react';

const Sidebar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

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
    color: '#333',
  };

  const nodeStyle = {
    padding: '10px',
    borderRadius: '5px',
    marginBottom: '10px',
    cursor: 'move',
    color: '#333',
    fontWeight: 'bold',
    boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
    transition: 'all 0.3s cubic-bezier(.25,.8,.25,1)',
  };

  const smallNodeStyle = {
    ...nodeStyle,
    fontSize: '15px',
    marginBottom: '5px',
    width: '8rem',
    height: '3rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const dropdownHeaderStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '8px',
    cursor: 'pointer',
    borderRadius: '4px',
    backgroundColor: '#f3f4f6',
    marginTop: '16px',
    marginBottom: '8px',
    border: '1px solid #e2e8f0',
  };

  return (
    <aside style={sidebarStyle}>    
      <div style={headerStyle}>Add Nodes</div>
      <div 
        style={{
          ...nodeStyle, 
          backgroundColor: '#FFEFD5',
          border: '2px solid #FFD700'
        }}
        onDragStart={(event) => onDragStart(event, 'sendMessage')} 
        draggable
      >
        <span style={{marginRight: '10px', color: '#333'}}>&gt;</span>
        Send a Message
        <div style={{fontSize: '12px', fontWeight: 'normal', color: '#666'}}>With no response required from visitor</div>
      </div>
      
      <div 
        style={{
          ...nodeStyle, 
          backgroundColor: '#FFE4E1',
          border: '2px solid #FFB4A8'
        }}
        onDragStart={(event) => onDragStart(event, 'askQuestion')} 
        draggable
      >
        <span style={{marginRight: '10px', color: '#333'}}>?</span>
        Ask a Question
        <div style={{fontSize: '12px', fontWeight: 'normal', color: '#666'}}>Ask question and store user input in variable</div>
      </div>

      <div 
        style={{
          ...nodeStyle, 
          backgroundColor: '#E6E6FA',
          border: '2px solid #B8A8FF'
        }}
        onDragStart={(event) => onDragStart(event, 'setCondition')} 
        draggable
      >
        <span style={{marginRight: '10px', color: '#333'}}>&#9781;</span>
        Set a Condition
        <div style={{fontSize: '12px', fontWeight: 'normal', color: '#666'}}>Send message(s) based on logical condition(s)</div>
      </div>

      <div 
        style={dropdownHeaderStyle}
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
      >
        <h3 className="font-semibold">Additional Nodes</h3>
        {isDropdownOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </div>
      
      {isDropdownOpen && (
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div 
              style={{
                ...smallNodeStyle, 
                backgroundColor: '#F0F0F0',
                border: '2px solid #D3D3D3',
                padding: '12px',
                gap: '8px'
              }} 
              onDragStart={(event) => onDragStart(event, 'ai')} 
              draggable
            >
              <Bot size={18} color="#333" />
              <span>AI</span>
            </div>

            <div 
              style={{
                ...smallNodeStyle, 
                backgroundColor: '#FFF8DC',
                border: '2px solid #EEE8AA',
                padding: '12px',
                gap: '8px'
              }}
              onDragStart={(event) => onDragStart(event, 'product')} 
              draggable
            >
              <ShoppingBag size={18} color="#333" />    
              <span>Product</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div 
              style={{
                ...smallNodeStyle, 
                backgroundColor: '#E0FFFF',
                border: '2px solid #AFEEEE',
                padding: '12px',
                gap: '8px'
              }}
              onDragStart={(event) => onDragStart(event, 'api')} 
              draggable
            >
              <Network size={18} color="#333" />
              <span>API</span>
            </div>
            
           {/* <div 
              style={{
                ...smallNodeStyle, 
                backgroundColor: '#FAFAD2',
                border: '2px solid #EEE8AA',
                padding: '12px',
                gap: '8px'
              }}
              onDragStart={(event) => onDragStart(event, 'delay')} 
              draggable
            >
              <Clock size={18} color="#333" />
              <span>Delay</span>
            </div>*/}
          </div>
        </div>
      )}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
  <div className="bg-white bg-opacity-80 text-black text-sm px-4 py-2 pointer-events-auto rounded shadow">
 Backspace for Node Deletion
  </div>
</div>

    </aside>
  );
};

export default Sidebar;