import React, { useRef, useEffect } from 'react';
import MessageItem from './messageitem';

const MessageList = ({ conversation }) => {
  const messageEndRef = useRef(null);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation]);

  return (
    <div className="flex-1 overflow-y-auto p-4">
      {conversation.map((message, index) => (
        <MessageItem key={index} message={message} />
      ))}
      <div ref={messageEndRef} />
    </div>
  );
};

export default MessageList;