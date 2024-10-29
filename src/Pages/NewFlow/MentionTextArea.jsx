import React, { useState, useEffect, useRef } from 'react';
import axiosInstance from "../../api";  // Assuming this is the correct path to your axiosInstance

const textAreaStyles = {
  width: '100%',
  padding: '10px',
  margin: '10px 0',
  borderRadius: '6px',
  border: '1px solid #ccc',
  fontSize: '14px',
  backgroundColor: '#f9f9f9',
  color: '#333',
  transition: 'border-color 0.3s, box-shadow 0.3s',
};

const mentionListStyles = {
  position: 'absolute',
  backgroundColor: '#fff',
  border: '1px solid #ccc',
  borderRadius: '4px',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  zIndex: 1000,
  maxHeight: '150px',
  overflowY: 'auto',
};

const mentionItemStyles = {
  padding: '8px 12px',
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: '#f0f0f0',
  },
};

export const MentionTextArea = ({ value, onChange, placeholder }) => {
  const [showMentionList, setShowMentionList] = useState(false);
  const [mentionListPosition, setMentionListPosition] = useState({ top: 0, left: 0 });
  const [mentionOptions, setMentionOptions] = useState([]);
  const textAreaRef = useRef(null);

  useEffect(() => {
    const fetchContactFields = async () => {
      try {
        const response = await axiosInstance.get('/contacts/');
        if (response.data && response.data.length > 0) {
          const sampleContact = response.data[0];
          const fields = Object.keys(sampleContact).filter(key => 
            typeof sampleContact[key] !== 'object' && 
            typeof sampleContact[key] !== 'function'
          );
          setMentionOptions(fields.map(field => ({ id: field, label: field })));
        }
      } catch (error) {
        console.error("Error fetching contact fields:", error);
      }
    };
    fetchContactFields();
  }, []);

  const handleTextAreaChange = (e) => {
    const { value, selectionStart } = e.target;
    onChange(e);
    const lastAtSymbolIndex = value.lastIndexOf('@', selectionStart - 1);
    if (lastAtSymbolIndex !== -1 && lastAtSymbolIndex === selectionStart - 1) {
      setShowMentionList(true);
      const { top, left } = getCaretCoordinates(e.target, selectionStart);
      setMentionListPosition({ top: top + 20, left });
    } else {
      setShowMentionList(false);
    }
  };

  const handleMentionSelect = (option) => {
    const lastAtSymbolIndex = value.lastIndexOf('@');
    const newValue = value.slice(0, lastAtSymbolIndex) + `@${option.label} ` + value.slice(lastAtSymbolIndex + 1);
    console.log(newValue,"THIS IS AN IMPORTANT VSLUE");
    onChange({ target: { value: newValue } });
    setShowMentionList(false);
  };

  const getCaretCoordinates = (element, position) => {
    const { offsetLeft: left, offsetTop: top } = element;
    return { left, top };
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (textAreaRef.current && !textAreaRef.current.contains(event.target)) {
        setShowMentionList(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div style={{ position: 'relative' }} ref={textAreaRef}>
      <textarea
        value={value}
        onChange={handleTextAreaChange}
        placeholder={placeholder}
        style={textAreaStyles}
      />
      {showMentionList && (
        <div style={{ ...mentionListStyles, top: mentionListPosition.top, left: mentionListPosition.left }}>
          {mentionOptions.map((option) => (
            <div
              key={option.id}
              style={mentionItemStyles}
              onClick={() => handleMentionSelect(option)}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Function to convert @mentions to {{mentions}} for backend
export const convertMentionsForBackend = (text) => {
  return text.replace(/@(\w+)/g, '{{$1}}');
};

// Function to convert {{mentions}} back to @mentions for frontend display
export const convertMentionsForFrontend = (text) => {
  return text.replace(/{{(\w+)}}/g, '@$1');
};

export const ShowProducts = ({ productIds, selectedProductId, onSelect }) => {
  return (
    <div style={{ position: 'relative' }}>
      <select
        value={selectedProductId}
        onChange={(e) => onSelect(e.target.value)}
        style={{ width: '100%', padding: '8px', borderRadius: '4px' }}
      >
        <option value="" disabled>Select a product ID</option>
        {productIds.map((id) => (
          <option key={id} value={id}>
            {id}
          </option>
        ))}
      </select>
    </div>
  );
};

export default {MentionTextArea, ShowProducts};