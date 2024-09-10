import React, { useState } from 'react';
import axiosInstance from '../../api';
import { useAuth } from '../../authContext';


function CreateNewAccountForm() {
  const { userId } = useAuth(); // Get userId from your auth context
  const [accountData, setAccountData] = useState({
    Name: '',
    email: '',
    phone: '',
  });

  const handleChange = (event) => {
    setAccountData({
      ...accountData,
      [event.target.name]: event.target.value,
    });
  };

  const handleAccountSubmit = async (event) => {
    event.preventDefault();
    try {
      const tenantId = getTenantIdFromUrl(); // Get tenant ID from the URL
      const dataToSend = {
        ...accountData,
        createdBy: userId, // Pass userId as createdBy
        tenant: tenantId,
      };
  
      const response = await axiosInstance.post('/accounts/', dataToSend);
      console.log('Form submitted successfully:', response.data);
      setAccountData({
        Name: '',
        email: '',
        phone: '',
      });
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };
  // Function to extract tenantId from the current URL
  const getTenantIdFromUrl = () => {
    // Example: Extract tenant_id from "/3/home"
    const pathArray = window.location.pathname.split('/');
    if (pathArray.length >= 2) {
      return pathArray[1]; // Assumes tenant_id is the first part of the path
    }
    return null; // Return null if tenant ID is not found or not in the expected place
  };

  return (
   <div>
   
    <div>
     
      <h2>Create New Account</h2>
      <form onSubmit={handleAccountSubmit}>
        <div className="form-group">
          <label htmlFor="Name">Name</label>
          <input
            type="text"
            className="form-control"
            id="Name"
            name="Name"
            value={accountData.Name}
            onChange={handleChange}
            placeholder="Enter Name"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            className="form-control"
            id="email"
            name="email"
            value={accountData.email}
            onChange={handleChange}
            placeholder="Enter Email"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="phone">Phone</label>
          <input
            type="text"
            className="form-control"
            id="phone"
            name="phone"
            value={accountData.phone}
            onChange={handleChange}
            placeholder="Enter Phone"
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Create Account
        </button>
      </form>
    </div>
   </div>
  );
}

export default CreateNewAccountForm;
