import React from 'react';
import { renderMessageContent, renderInteractiveMessage, renderTemplateMessage } from '../../messageRenderers';

const MessageItem = ({ message }) => {
  const isUser = message.sender === 'user';

  const messageClass = isUser ? 'bg-blue-100 text-right' : 'bg-gray-200 text-left';
  
  return (
    <div className={`mb-4 flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`p-3 rounded-lg max-w-md ${messageClass}`}>
        {typeof message.text === 'string' && (
          message.text.trim().startsWith('{') || message.text.trim().startsWith('[')
            ? tryParseAndRenderInteractive(message.text)
            : message.text
        )}
        {typeof message.text === 'object' && renderMessageContent(message)}
      </div>
    </div>
  );
};

const tryParseAndRenderInteractive = (text) => {
  try {
    const fixedMessage = fixJsonString(text);
    const parsedMessage = JSON.parse(fixedMessage);
    return renderInteractiveMessage(parsedMessage);
  } catch (e) {
    console.error(`Failed to parse message: ${text}`, e);
    return <div className="text-red-500">Failed to parse message</div>;
  }
};

export default MessageItem;