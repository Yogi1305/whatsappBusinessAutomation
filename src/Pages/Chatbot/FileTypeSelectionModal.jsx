// FileTypeSelectionModal.jsx
import React from 'react';
import { X, Image, FileText, Music, Video, File, Camera } from 'lucide-react';

const FileTypeSelectionModal = ({ isOpen, onClose, onSelectType }) => {
  if (!isOpen) return null;

  const fileTypes = [
    { 
      name: "Image", 
      icon: "🖼️", 
      acceptTypes: "image/*", 
      type: "image" 
    },
    { 
      name: "Document", 
      icon: "📄", 
      acceptTypes: "application/pdf,.doc,.docx,.txt,.xls,.xlsx,.ppt,.pptx", 
      type: "document" 
    },
    { 
      name: "Video", 
      icon: "🎥", 
      acceptTypes: "video/*", 
      type: "video" 
    },
    { 
      name: "Audio", 
      icon: "🎵", 
      acceptTypes: "audio/*", 
      type: "audio" 
    }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-80 max-w-md">
        <h3 className="text-lg font-medium mb-4">Select File Type</h3>
        <div className="grid grid-cols-2 gap-4">
          {fileTypes.map((type) => (
            <button
              key={type.name}
              className="p-4 border rounded-lg hover:bg-gray-100 flex flex-col items-center"
              onClick={() => onSelectType(type.type, type.acceptTypes)}
            >
              <span className="text-2xl mb-2">{type.icon}</span>
              <span>{type.name}</span>
            </button>
          ))}
        </div>
        <div className="mt-4 flex justify-end">
          <button
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default FileTypeSelectionModal;