import React from 'react';
import ChatHeader from './ChatHeader';
import MessageList from './MessageList';
import MessageInput from './MessageInput';

const ChatInterface = ({ 
  selectedContact,
  messages,
  inputText,
  onInputChange,
  onSend,
  onFileUpload,
  emojiHandlers,
  showImagePreview,
  imageHandlers
}) => {
  return (
    <div className="chat-interface">
      <ChatHeader contact={selectedContact} />
      <MessageList messages={messages} />
      <MessageInput
        value={inputText}
        onChange={onInputChange}
        onSend={onSend}
        onFileUpload={onFileUpload}
        showEmojiPicker={emojiHandlers.show}
        toggleEmojiPicker={emojiHandlers.toggle}
      />
      {showImagePreview && (
        <ImagePreviewModal
          image={imageHandlers.image}
          caption={imageHandlers.caption}
          onClose={imageHandlers.close}
          onSend={imageHandlers.send}
        />
      )}
    </div>
  );
};

export default ChatInterface;