// import React, { useState, useEffect } from 'react';
// import { NavLink, useNavigate } from 'react-router-dom';
// import logo from '../../assets/logo.png';

// const PopupCard = ({ message, onClose }) => (
//   <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//     <div className="bg-white rounded-lg p-8 max-w-sm w-full">
//       <h2 className="text-xl font-bold mb-4">{message}</h2>
//       <button
//         onClick={onClose}
//         className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-300"
//       >
//         OK
//       </button>
//     </div>
//   </div>
// );

// const Register = () => {
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     username: '',
//     email: '',
//     password: '',
//     role: '',
//     organisation: '',
//   });
//   const [organisations, setOrganisations] = useState([]);
//   const [showNewOrgForm, setShowNewOrgForm] = useState(false);
//   const [newOrg, setNewOrg] = useState({
//     name: '',
//     tenantId: '',
//     password: '',
//   });
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [showPopup, setShowPopup] = useState(false);
//   const [errors, setErrors] = useState({});

//   useEffect(() => {
//     fetch('https://backenreal-hgg2d7a0d9fzctgj.eastus-01.azurewebsites.net/createTenant')
//       .then((res) => res.json())
//       .then((data) => {
//         const orgNames = data.map((org) => ({
//           id: org.id,
//           name: org.organization,
//           tenantId: org.id,
//         }));
//         setOrganisations(orgNames);
//       })
//       .catch((error) => console.error('Error fetching organisations:', error));
//   }, []);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleNewOrgInputChange = (e) => {
//     const { name, value } = e.target;
//     setNewOrg((prev) => ({ ...prev, [name]: value }));
//   };

//   const validateForm = () => {
//     const newErrors = {};
//     if (!formData.username.trim()) newErrors.username = 'Username is required';
//     if (!formData.email.trim()) newErrors.email = 'Email is required';
//     else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
//     if (!formData.password.trim()) newErrors.password = 'Password is required';
//     else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
//     if (!formData.role) newErrors.role = 'Role is required';
//     if (!formData.organisation) newErrors.organisation = 'Organisation is required';

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!validateForm()) return;
//     setIsSubmitting(true);

//     const selectedOrg = organisations.find((org) => org.name === formData.organisation);
//     const selectedTenantId = selectedOrg ? selectedOrg.tenantId : '';

//     try {
//       const response = await fetch('https://backenreal-hgg2d7a0d9fzctgj.eastus-01.azurewebsites.net/register/', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'X-Tenant-ID': 3,
//         },
//         body: JSON.stringify({
//           ...formData,
//           tenant: selectedTenantId,
//         }),
//       });

//       if (!response.ok) {
//         throw new Error(`HTTP error! Status: ${response.status}`);
//       }

//       await response.json();
//       setShowPopup(true);
//     } catch (error) {
//       console.error('Registration failed:', error);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleCreateNewOrg = async () => {
//     try {
//       const response = await fetch('https://backenreal-hgg2d7a0d9fzctgj.eastus-01.azurewebsites.net/createTenant/', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           tenant_id: newOrg.tenantId,
//           organization: newOrg.name,
//           password: newOrg.password,
//         }),
//       });

//       if (!response.ok) {
//         throw new Error(`HTTP error! Status: ${response.status}`);
//       }

//       const data = await response.json();
//       setOrganisations([...organisations, { id: data.id, name: newOrg.name, tenantId: newOrg.tenantId }]);
//       setShowNewOrgForm(false);
//       setNewOrg({ name: '', tenantId: '', password: '' });
//       alert('New organisation created successfully!');
//     } catch (error) {
//       console.error('Error creating new organisation:', error);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
//       <div className="sm:mx-auto sm:w-full sm:max-w-md">
//         <img className="mx-auto h-12 w-auto" src={logo} alt="Nuren AI" />
//         <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Register your account</h2>
//       </div>

//       <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
//         <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
//           <form className="space-y-6" onSubmit={handleSubmit}>
//             {['username', 'email', 'password'].map((field) => (
//               <div key={field}>
//                 <label htmlFor={field} className="block text-sm font-medium text-gray-700">
//                   {field.charAt(0).toUpperCase() + field.slice(1)}
//                 </label>
//                 <div className="mt-1">
//                   <input
//                     id={field}
//                     name={field}
//                     type={field === 'password' ? 'password' : 'text'}
//                     required
//                     className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//                     value={formData[field]}
//                     onChange={handleInputChange}
//                   />
//                 </div>
//                 {errors[field] && <p className="mt-2 text-sm text-red-600">{errors[field]}</p>}
//               </div>
//             ))}

//             <div>
//               <label htmlFor="role" className="block text-sm font-medium text-gray-700">
//                 Role
//               </label>
//               <select
//                 id="role"
//                 name="role"
//                 className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
//                 value={formData.role}
//                 onChange={handleInputChange}
//               >
//                 <option value="">Select a role</option>
//                 <option value="Admin">Admin</option>
//                 <option value="employee">Employee</option>
//                 <option value="manager">Manager</option>
//               </select>
//               {errors.role && <p className="mt-2 text-sm text-red-600">{errors.role}</p>}
//             </div>

//             <div>
//               <label htmlFor="organisation" className="block text-sm font-medium text-gray-700">
//                 Organisation
//               </label>
//               <select
//                 id="organisation"
//                 name="organisation"
//                 className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
//                 value={formData.organisation}
//                 onChange={handleInputChange}
//               >
//                 <option value="">Select an organisation</option>
//                 {organisations.map((org) => (
//                   <option key={org.id} value={org.name}>
//                     {org.name}
//                   </option>
//                 ))}
//                 <option value="createNew">Create New Organization</option>
//               </select>
//               {errors.organisation && <p className="mt-2 text-sm text-red-600">{errors.organisation}</p>}
//             </div>

//             <div>
//               <button
//                 type="submit"
//                 className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//                 disabled={isSubmitting}
//               >
//                 {isSubmitting ? 'Registering...' : 'Register'}
//               </button>
//             </div>
//           </form>

//           <div className="mt-6">
//             <div className="relative">
//               <div className="absolute inset-0 flex items-center">
//                 <div className="w-full border-t border-gray-300" />
//               </div>
//               <div className="relative flex justify-center text-sm">
//                 <span className="px-2 bg-white text-gray-500">Or</span>
//               </div>
//             </div>

//             <div className="mt-6">
//               <NavLink
//                 to="/login"
//                 className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-blue-600 bg-white hover:bg-gray-50"
//               >
//                 Already have an account? Log in
//               </NavLink>
//             </div>
//           </div>
//         </div>
//       </div>

//       {showNewOrgForm && (
//         <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full" id="my-modal">
//           <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
//             <div className="mt-3 text-center">
//               <h3 className="text-lg leading-6 font-medium text-gray-900">Create New Organisation</h3>
//               <div className="mt-2 px-7 py-3">
//                 <input
//                   type="text"
//                   name="name"
//                   placeholder="Organisation Name"
//                   className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//                   value={newOrg.name}
//                   onChange={handleNewOrgInputChange}
//                 />
//                 <input
//                   type="text"
//                   name="tenantId"
//                   placeholder="Tenant ID"
//                   className="mt-3 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//                   value={newOrg.tenantId}
//                   onChange={handleNewOrgInputChange}
//                 />
//                 <input
//                   type="password"
//                   name="password"
//                   placeholder="Password"
//                   className="mt-3 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//                   value={newOrg.password}
//                   onChange={handleNewOrgInputChange}
//                 />
//               </div>
//               <div className="items-center px-4 py-3">
//                 <button
//                   id="ok-btn"
//                   className="px-4 py-2 bg-blue-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
//                   onClick={handleCreateNewOrg}
//                 >
//                   Create Organisation
//                 </button>
//               </div>
//               <div className="items-center px-4 py-3">
//                 <button
//                   id="cancel-btn"
//                   className="px-4 py-2 bg-gray-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-300"
//                   onClick={() => setShowNewOrgForm(false)}
//                 >
//                   Cancel
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {showPopup && (
//         <PopupCard
//           message={`Registration successful as ${formData.role}`}
//           onClose={() => {
//             setShowPopup(false);
//             navigate('/login');
//           }}
//         />
//       )}
//     </div>
//   );
// };

// export default Register;



import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.png';

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
  const [showPopup, setShowPopup] = useState(false);
  const [errors, setErrors] = useState({});
  const [step, setStep] = useState(1);

  useEffect(() => {
    fetch('https://backenreal-hgg2d7a0d9fzctgj.eastus-01.azurewebsites.net/createTenant')
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
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (!formData.role) newErrors.role = 'Role is required';
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
      const response = await fetch('https://backenreal-hgg2d7a0d9fzctgj.eastus-01.azurewebsites.net/register/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Tenant-ID': 3,
        },
        body: JSON.stringify({
          ...formData,
          tenant: selectedTenantId,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      await response.json();
      setShowPopup(true);
    } catch (error) {
      console.error('Registration failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateNewOrg = async () => {
    try {
      const response = await fetch('https://backenreal-hgg2d7a0d9fzctgj.eastus-01.azurewebsites.net/createTenant/', {
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
                  <label htmlFor="username" className="sr-only">Username</label>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    required
                    className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                    placeholder="Username"
                    value={formData.username}
                    onChange={handleInputChange}
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
                <div>
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Next
                  </button>
                </div>
              </>
            )}
            {step === 2 && (
              <>
                <div>
                  <label htmlFor="role" className="sr-only">Role</label>
                  <select
                    id="role"
                    name="role"
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                    value={formData.role}
                    onChange={handleInputChange}
                  >
                    <option value="">Select a role</option>
                    <option value="Admin">Admin</option>
                    <option value="employee">Employee</option>
                    <option value="manager">Manager</option>
                  </select>
                  {errors.role && <p className="mt-2 text-sm text-red-600">{errors.role}</p>}
                </div>
                <div>
                  <label htmlFor="organisation" className="sr-only">Organisation</label>
                  <select
                    id="organisation"
                    name="organisation"
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                    value={formData.organisation}
                    onChange={handleInputChange}
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
                  type="text"
                  name="tenantId"
                  placeholder="Tenant ID"
                  className="mt-3 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  value={newOrg.tenantId}
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
                  className="px-4 py-2 bg-indigo-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                  onClick={handleCreateNewOrg}
                >
                  Create Organisation
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
          message={`Registration successful as ${formData.role}`}
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