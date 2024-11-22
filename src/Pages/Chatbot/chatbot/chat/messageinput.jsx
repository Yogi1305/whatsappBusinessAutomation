import React, { useState, useRef } from 'react';

import { Button } from '../../../../components/ui/button';
import Picker from 'emoji-picker-react';

const MessageInput = ({
  messageTemplates,
  setMessageTemplates,
  handleSend,
  showSmileys,
  toggleSmileys,
  handleSelectSmiley,
  fileInputRef,
  handleFileSelect
}) => {
  return (
    <div className="p-4 border-t flex items-center space-x-2">
      <Button variant="icon" onClick={toggleSmileys}>
        <EmojiEmotionsIcon />
      </Button>
      <input
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleFileSelect}
        ref={fileInputRef}
      />
      <Button variant="icon" onClick={() => fileInputRef.current.click()}>
        <AttachFileIcon />
      </Button>
      <Textarea
        value={messageTemplates || ''}
        onChange={(e) => setMessageTemplates(e.target.value)}
        placeholder="Type a message"
        className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <Button variant="primary" onClick={handleSend}>
        <SendIcon />
      </Button>
      {showSmileys && <EmojiPicker onSelect={handleSelectSmiley} />}
    </div>
  );
};

const EmojiPicker = ({ onSelect }) => {
  return (
    <div className="absolute bottom-20 left-4">
      <Picker onEmojiClick={onSelect} />
    </div>
  );
};

export default MessageInput;