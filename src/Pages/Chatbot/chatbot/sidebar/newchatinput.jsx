import React from 'react';


const NewChatInput = ({ newPhoneNumber, setNewPhoneNumber, onSubmit }) => {
  const handleInputChange = (e) => {
    setNewPhoneNumber(e.target.value);
  };

  return (
    <div className="p-4 border-b">
      <Input
        type="text"
        value={newPhoneNumber}
        onChange={handleInputChange}
        placeholder="Enter phone number"
        className="w-full p-2 border rounded"
      />
      <Button
        onClick={onSubmit}
        className="mt-2 w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
      >
        Start New Chat
      </Button>
    </div>
  );
};

export default NewChatInput;