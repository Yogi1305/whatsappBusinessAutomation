import React from 'react';
import MessageBubble from './MessageBubble';

const MessageList = ({ messages, messageEndRef }) => {
  return (
    <div className="message-list">
      {messages.map((message, index) => (
        <MessageBubble
          key={`${message.timestamp}-${index}`}
          message={message}
        />
      ))}
      <div ref={messageEndRef} />
    </div>
  );
};

export default MessageList;