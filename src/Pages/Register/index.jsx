import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.png';
import axiosInstance from '../../api';
import { header } from 'framer-motion/client';

const PopupCard = ({ message, onClose }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg p-8 max-w-sm w-full">
      <h2 className="text-xl font-bold mb-4">{message}</h2>
      <button
        onClick={onClose}
        className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-300"
      >
        OK
      </button>
    </div>
  </div>
);

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: '',
    organisation: '',
  });
  const [organisations, setOrganisations] = useState([]);
  const [showNewOrgForm, setShowNewOrgForm] = useState(false);
  const [newOrg, setNewOrg] = useState({
    name: '',
    tenantId: '',
    password: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [verifyingTenant, setVerifyingTenant] = useState(false);
  const [creatingOrg, setCreatingOrg] = useState(false)
  const [showPopup, setShowPopup] = useState(false);
  const [errors, setErrors] = useState({});
  const [step, setStep] = useState(1);

  useEffect(() => {
    fetch('https://backeng4whatsapp-dxbmgpakhzf9bped.centralindia-01.azurewebsites.net/createTenant')
      .then((res) => res.json())
      .then((data) => {
        const orgNames = data.map((org) => ({
          id: org.id,
          name: org.organization,
          tenantId: org.id,
        }));
        setOrganisations(orgNames);
      })
      .catch((error) => console.error('Error fetching organisations:', error));
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));
    if (e.target.value === "createNew") {
      setShowNewOrgForm(true);
    } else {
      setShowNewOrgForm(false);
    }
  };

  const handleNewOrgInputChange = (e) => {
    const { name, value } = e.target;
    setNewOrg((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.username.trim()) newErrors.username = 'Username is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.password.trim()) newErrors.password = 'Password is required';
    // else if (formData.password.length < ) newErrors.password = 'Password must be at least 6 characters';
    if (!formData.organisation) newErrors.organisation = 'Organisation is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);

    const selectedOrg = organisations.find((org) => org.name === formData.organisation);
    const selectedTenantId = selectedOrg ? selectedOrg.tenantId : '';

    try {
      const response = await fetch('https://backeng4whatsapp-dxbmgpakhzf9bped.centralindia-01.azurewebsites.net/register/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Tenant-Id': selectedTenantId,
        },
        body: JSON.stringify({
          ...formData,
          tenant: selectedTenantId,
        }),
      });
      const response_json = await response.json()
      if (!response.ok) {
        setErrors({username: response_json.msg})
        throw new Error(response_json.msg);
      }

      setShowPopup(true);

    } catch (error) {
      console.error('Registration failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const createTenantID = async () => {
    const generateUniqueID = (length) => {
      const characters = 'QWERTYUIOPASDFGHJKLZXCVBNMqwertyuiopasdfghjklzxcvbnm'
      let result =''
      for (let i=0;i<length;i++){
        result += characters.charAt(Math.floor(Math.random() * characters.length));
      }
      return result
    }

    const tenantID = generateUniqueID(7)
    return tenantID

  }

  const handleNext = async () => {
    const { organisation, password } = formData;
  
    if (!organisation || !password) {
      console.error("Both organisation and password are required");
      setErrors({ organisation: "Organisation is required", password: "Password is required" });
      return false; // return false if validation fails
    }
    setVerifyingTenant(true)
    try {

      const response = await axiosInstance.post('/verifyTenant/', {
        organisation,
        password,
      });
  
      if (response.status !== 200) {
        console.error("Error:", response.data);
        setErrors({ organisation: "Invalid organisation or password" });
        return false; // return false if the API returns an error
      } else {
        console.log("Success:", response.data);
        return true; // return true if successful
      }
    } catch (error) {
      console.error("Request Failed:", error);
      setErrors({ password: "Password is incorrect. Please provide correct password" });
      return false; // return false if the request fails
    } finally{
      setVerifyingTenant(false)
    }
  };
  

  const handleCreateNewOrg = async () => {
    setCreatingOrg(true)
    try {
      newOrg.tenantId = await createTenantID()
      const response = await fetch('https://backeng4whatsapp-dxbmgpakhzf9bped.centralindia-01.azurewebsites.net/createTenant/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tenant_id: newOrg.tenantId,
          organization: newOrg.name,
          password: newOrg.password,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setOrganisations([...organisations, { id: data.id, name: newOrg.name, tenantId: newOrg.tenantId }]);
      setShowNewOrgForm(false);
      setNewOrg({ name: '', tenantId: '', password: '' });
      alert('New organisation created successfully!');
    } catch (error) {
      console.error('Error creating new organisation:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-200 flex flex-col justify-center items-center p-4" style={{width:"100vw"}}>
      <div className="bg-white shadow-2xl rounded-2xl w-full max-w-md overflow-hidden">
        <div className="p-8">
          <div className="flex items-center justify-center mb-8">
            <img src={logo} alt="Logo" className="h-12 w-auto mr-2" />
            <span className="text-2xl font-bold text-gray-800">Nuren AI</span>
          </div>
          <h2 className="text-3xl font-extrabold text-center text-gray-900 mb-6">Register</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            {step === 1 && (
              <>
              <div>
                  <label htmlFor="organisation" className="sr-only">Organisation</label>
                  <select
                    id="organisation"
                    name="organisation"
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                    value={formData.organisation}
                    onChange={ (e) => {
                      setErrors({});
                      handleInputChange(e);
                    }
                  }
                  >
                    <option value="">Select an organisation</option>
                    {organisations.map((org) => (
                      <option key={org.id} value={org.name}>
                        {org.name}
                      </option>
                    ))}
                    <option value="createNew">Create New Organization</option>
                  </select>
                  {errors.organisation && <p className="mt-2 text-sm text-red-600">{errors.organisation}</p>}
                </div>
                <div>
                  <label htmlFor="password" className="sr-only">Password</label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                    placeholder="Password"
                    value={formData.password}
                    onChange={(e) => {
                      setErrors({});
                      handleInputChange(e);
                    }}
                  />
                  {errors.password && <p className="mt-2 text-sm text-red-600">{errors.password}</p>}
                </div>
                <div>
                  <button
                    type="button"
                    onClick={ async () => {
                    const response = await handleNext(formData.organisation, formData.password); 
                    console.log("response is : ", response)
                    if(response) setStep(2);
                    
                  }}
                    className= {`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${verifyingTenant ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {verifyingTenant ? 'Verifying Tenant...' : 'Next'}
                  </button>
                  
                </div>
              </>
            )}
            {step === 2 && (
              <>
              <div>
                  <label htmlFor="username" className="sr-only">Username</label>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    required
                    className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                    placeholder="Username"
                    value={formData.username}
                    onChange={(e) => {
                      handleInputChange(e)
                    }}
                  />
                  {errors.username && <p className="mt-2 text-sm text-red-600">{errors.username}</p>}
                </div>
                <div>
                  <label htmlFor="email" className="sr-only">Email</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                  {errors.email && <p className="mt-2 text-sm text-red-600">{errors.email}</p>}
                </div>
                <div>
                  <label htmlFor="phone" className="sr-only">Phone</label>
                  <input
                    id="phone"
                    name="phone"
                    type="text"
                    required
                    className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                    placeholder="Phone"
                    value={formData.phone}
                    onChange={(e) => {
                      handleInputChange(e)
                    }}
                  />
                  {errors.phone && <p className="mt-2 text-sm text-red-600">{errors.phone}</p>}
                </div>
                <div>
                  <label htmlFor="password" className="sr-only">Password</label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleInputChange}
                  />
                  {errors.password && <p className="mt-2 text-sm text-red-600">{errors.password}</p>}
                </div>
                <div className="flex justify-between">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {isSubmitting ? 'Registering...' : 'Register'}
                  </button>
                </div>
              </>
            )}
          </form>
          <div className="mt-6 text-center">
            <NavLink to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
              Already have an account? Login
            </NavLink>
          </div>
        </div>
      </div>

      {showNewOrgForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full" id="my-modal">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Create New Organisation</h3>
              <div className="mt-2 px-7 py-3">
                <input
                  type="text"
                  name="name"
                  placeholder="Organisation Name"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  value={newOrg.name}
                  onChange={handleNewOrgInputChange}
                />
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  className="mt-3 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  value={newOrg.password}
                  onChange={handleNewOrgInputChange}
                />
              </div>
              <div className="items-center px-4 py-3">
                <button
                  id="ok-btn"
                  className={`px-4 py-2 bg-indigo-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-300 ${creatingOrg ? 'opacity-50 cursor-not-allowed' : '' }`}
                  onClick={handleCreateNewOrg}
                >
                  {creatingOrg ? 'Creating Organization...': 'Create Organization'}
                </button>
              </div>
              <div className="items-center px-4 py-3">
                <button
                  id="cancel-btn"
                  className="px-4 py-2 bg-gray-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-300"
                  onClick={() => setShowNewOrgForm(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showPopup && (
        <PopupCard
          message={`Registration successful`}
          onClose={() => {
            setShowPopup(false);
            navigate('/login');
          }}
        />
      )}
    </div>
  );
};

export default Register;