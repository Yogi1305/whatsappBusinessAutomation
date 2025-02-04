import React from 'react';
import Picker from 'emoji-picker-react';
import { AttachFile, Send, EmojiEmotions } from '@mui/icons-material';

const MessageInput = ({ value, onChange, onSend, onFileUpload, showEmojiPicker, toggleEmojiPicker }) => {
  const fileInputRef = React.useRef(null);

  return (
    <div className="message-input-container">
      <div className="input-actions">
        <EmojiEmotions onClick={toggleEmojiPicker} className="action-icon" />
        <input
          type="file"
          ref={fileInputRef}
          onChange={onFileUpload}
          style={{ display: 'none' }}
        />
        <AttachFile 
          onClick={() => fileInputRef.current.click()}
          className="action-icon"
        />
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Type a message..."
          onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && onSend()}
        />
        <Send onClick={onSend} className="send-icon" />
      </div>
      
      {showEmojiPicker && (
        <div className="emoji-picker-container">
          <Picker onEmojiClick={(emoji) => onChange(value + emoji.emoji)} />
        </div>
      )}
    </div>
  );
};

export default MessageInput;