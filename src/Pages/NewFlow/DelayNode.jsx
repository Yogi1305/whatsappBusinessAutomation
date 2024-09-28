import React from 'react';

export const DelayNode = ({ data }) => {
  return (
    <div style={{ 
      padding: '10px', 
      backgroundColor: '#FFB347', 
      borderRadius: '5px',
      marginTop: '10px'
    }}>
      <label>
        Delay (seconds):
        <input 
          type="number" 
          value={data.delay} 
          onChange={(e) => data.onDelayChange(parseInt(e.target.value))}
          min="0"
        />
      </label>
    </div>
  );
};