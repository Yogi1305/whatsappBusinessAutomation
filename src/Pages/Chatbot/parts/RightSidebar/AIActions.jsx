import React, { useState } from 'react';
import { Upload, X, Plus } from 'lucide-react';

const AIActions = ({ onFileUpload }) => {
  const [inputFields, setInputFields] = useState([{ value: '' }]);

  const addInputField = () => {
    setInputFields([...inputFields, { value: '' }]);
  };

  const removeInputField = (index) => {
    const newFields = inputFields.filter((_, i) => i !== index);
    setInputFields(newFields);
  };

  return (
    <div className="ai-actions">
      <div className="file-upload-section">
        <label className="upload-label">
          <Upload size={18} />
          <span>Upload Document</span>
          <input 
            type="file" 
            onChange={(e) => onFileUpload(e.target.files[0])}
            className="hidden"
          />
        </label>
      </div>

      <div className="input-fields-section">
        {inputFields.map((field, index) => (
          <div key={index} className="input-field-group">
            <input
              value={field.value}
              onChange={(e) => {
                const newFields = [...inputFields];
                newFields[index].value = e.target.value;
                setInputFields(newFields);
              }}
              placeholder="Description"
              className="description-input"
            />
            <button 
              className="remove-button"
              onClick={() => removeInputField(index)}
            >
              <X size={16} />
            </button>
          </div>
        ))}
        <button className="add-field-button" onClick={addInputField}>
          <Plus size={16} />
          Add Description
        </button>
      </div>
    </div>
  );
};

export default AIActions;