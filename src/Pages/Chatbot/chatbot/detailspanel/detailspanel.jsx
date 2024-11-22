import React from 'react';
import ContactDetails from './contactdetails';
import FlowManager from './flowmanager';


const DetailsPanel = ({
  contact,
  profileImage,
  selectedFlow,
  flows,
  handleFlowChange,
  handleSendFlowData,
  isSending,
  handleUpload,
  inputFields,
  addInputField,
  deleteInputField,
  handleInputChange,
  handleFileChange,
  uploadStatus
}) => {
  return (
    <div className="w-1/3 bg-white shadow-md p-4 overflow-y-auto">
      <ContactDetails contact={contact} profileImage={profileImage} />
      <FlowManager
        selectedFlow={selectedFlow}
        flows={flows}
        handleFlowChange={handleFlowChange}
        handleSendFlowData={handleSendFlowData}
        isSending={isSending}
      />
      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-2">AI Content</h2>
        <div className="flex flex-col space-y-4">
          <input
            type="file"
            onChange={handleFileChange}
            className="w-full p-2 border rounded"
          />
          {inputFields.map((field, index) => (
            <div key={index} className="flex items-center space-x-2">
              <input
                type="text"
                value={field.value}
                onChange={(e) => handleInputChange(index, e)}
                placeholder="Enter content description"
                className="flex-grow p-2 border rounded"
              />
              <Button
                variant="danger"
                onClick={() => deleteInputField(index)}
              >
                &times;
              </Button>
            </div>
          ))}
          <Button variant="secondary" onClick={addInputField}>
            Add Description
          </Button>
          <Button
            variant="primary"
            onClick={handleUpload}
            disabled={isUploading}
          >
            {isUploading ? 'Uploading...' : 'Upload'}
          </Button>
          {uploadStatus && (
            <p className={`text-sm ${uploadStatus.includes('Error') ? 'text-red-500' : 'text-green-500'}`}>
              {uploadStatus}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DetailsPanel;