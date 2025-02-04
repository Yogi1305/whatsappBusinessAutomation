import React from 'react';
import { renderInteractiveMessage } from '../../utils/messageRenderers';

const MessageBubble = ({ message }) => {
  const isBot = message.sender === 'bot';
  
  const renderContent = () => {
    if (message.imageId) {
      return <img src={message.imageUrl} alt="Sent" className="chat-image" />;
    }
    
    try {
      const parsed = JSON.parse(fixJsonString(message.text));
      return renderInteractiveMessage(parsed);
    } catch {
      return message.text.split('\n').map((line, i) => (
        <React.Fragment key={i}>
          {line}
          <br />
        </React.Fragment>
      ));
    }
  };

  return (
    <div className={`message-bubble ${isBot ? 'bot' : 'user'}`}>
      <div className="bubble-content">
        {renderContent()}
        <span className="message-time">
          {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
    </div>
  );
};

export default MessageBubble;