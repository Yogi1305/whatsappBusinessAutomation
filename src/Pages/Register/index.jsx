import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Check, ChevronLeft, ChevronRight, Building2, Lock, User, Mail, Phone } from 'lucide-react';
import logo from '../../assets/logo.png';
import axiosInstance, { fastURL, djangoURL } from '../../api';

const PopupCard = ({ message, onClose }) => (
  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
    <div className="bg-white rounded-xl p-8 max-w-sm w-full shadow-2xl transform animate-scaleIn">
      <div className="flex items-center justify-center mb-4">
        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
          <Check className="w-6 h-6 text-green-600" />
        </div>
      </div>
      <h2 className="text-xl font-bold text-center mb-4">{message}</h2>
      <button
        onClick={onClose}
        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition duration-300 font-medium"
      >
        Continue to Login
      </button>
    </div>
  </div>
);

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password:'',
        role: '',
        organisation: '',
        passwordo: '',
        phone: ''
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
        fetch(`${djangoURL}/createTenant`)
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
            const response = await fetch(`${djangoURL}/register/`, {
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
            const characters = 'qwertyuiopasdfghjklzxcvbnm'
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
        const { organisation, passwordo } = formData;
    
        if (!organisation || !passwordo) {
            console.error("Both organisation and password are required");
            setErrors({ organisation: "Organisation is required", password: "Password is required" });
            return false;
        }
        setVerifyingTenant(true)
        try {
            // Create a local variable specifically for the backend request
            const backendPayload = {
                organisation,
                password: passwordo  // Use the value of passwordo for 'password'
            };
    
            const response = await axiosInstance.post('/verifyTenant/', backendPayload);
    
            if (response.status !== 200) {
                console.error("Error:", response.data);
                setErrors({ organisation: "Invalid organisation or password" });
                return false;
            } else {
                console.log("Success:", response.data);
                return true;
            }
        } catch (error) {
            console.error("Request Failed:", error);
            setErrors({ password: "Password is incorrect. Please provide correct password" });
            return false;
        } finally {
            setVerifyingTenant(false)
        }
    };
    const handleCreateNewOrg = async () => {
        setCreatingOrg(true)
        try {
            newOrg.tenantId = await createTenantID()
            const response = await fetch(`${djangoURL}/createTenant/`, {
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

    const renderStepIndicator = () => (
        <div className="flex items-center justify-center mb-8">
            <div className={`w-3 h-3 rounded-full ${step === 1 ? 'bg-blue-600' : 'bg-gray-300'} transition-colors duration-300`} />
            <div className="w-12 h-0.5 bg-gray-300" />
            <div className={`w-3 h-3 rounded-full ${step === 2 ? 'bg-blue-600' : 'bg-gray-300'} transition-colors duration-300`} />
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex flex-col justify-center items-center p-4">
            <div className="bg-white/80 backdrop-blur-lg shadow-2xl rounded-2xl w-full max-w-md overflow-hidden border border-white/20">
                <div className="p-8">
                    <div className="flex items-center justify-center mb-6">
                        <div className="bg-white p-3 rounded-xl">
                            <img src={logo} alt="Logo" className="h-8 w-auto" />
                        </div>
                    </div>
                    
                    <h2 className="text-2xl font-bold text-center text-gray-900 mb-2">Create Account</h2>
                    <p className="text-center text-gray-600 mb-6">Join us to get started with your AI journey</p>
                    
                    {renderStepIndicator()}

                    <form 
                        onSubmit={handleSubmit} 
                        className="space-y-5"
                        autoComplete="off"
                    >
                        {step === 1 && (
                            <div className="space-y-4 animate-slideIn">
                                <div className="relative">
                                    <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                                    <select
                                        name="organisation"
                                        className="pl-10 w-full h-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                                        value={formData.organisation}
                                        onChange={handleInputChange}
                                        autoComplete="off"
                                    >
                                        <option value="">Select your organization</option>
                                        {organisations.map((org) => (
                                            <option key={org.id} value={org.name}>{org.name}</option>
                                        ))}
                                        <option value="createNew">➕ Create New Organization</option>
                                    </select>
                                    {errors.organisation && 
                                        <p className="mt-1 text-sm text-red-500 animate-shake">{errors.organisation}</p>
                                    }
                                </div>

                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                                    <input
                                        type="password"
                                        name="passwordo"
                                        placeholder="Organization Password"
                                        className="pl-10 w-full h-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                                        value={formData.passwordo}
                                        onChange={handleInputChange}
                                        autoComplete="new-password"
                                        autoCorrect="off"
                                        autoCapitalize="off"
                                        spellCheck="false"
                                    />
                                    {errors.passwordo && 
                                        <p className="mt-1 text-sm text-red-500 animate-shake">{errors.passwordo}</p>
                                    }
                                </div>

                                <button
                                    type="button"
                                    onClick={async () => {
                                        const response = await handleNext();
                                        if(response) setStep(2);
                                    }}
                                    className="group relative w-full h-12 flex items-center justify-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 disabled:opacity-50"
                                    disabled={verifyingTenant}
                                >
                                    {verifyingTenant ? (
                                        <div className="flex items-center">
                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                                            Verifying...
                                        </div>
                                    ) : (
                                        <div className="flex items-center">
                                            Continue
                                            <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    )}
                                </button>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="space-y-4 animate-slideIn">
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                                    <input
                                        type="text"
                                        name="username"
                                        placeholder="Username"
                                        className="pl-10 w-full h-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                                        value={formData.username}
                                        onChange={handleInputChange}
                                        autoComplete="off"
                                        autoCorrect="off"
                                        autoCapitalize="off"
                                        spellCheck="false"
                                    />
                                    {errors.username && 
                                        <p className="mt-1 text-sm text-red-500 animate-shake">{errors.username}</p>
                                    }
                                </div>

                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                                    <input
                                        type="email"
                                        name="email" // Use a static name
                                        placeholder="Email address"
                                        className="pl-10 w-full h-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                                        value={formData.email || ''} // Ensure it doesn't throw an error if formData.email is undefined
                                        onChange={(e) => handleInputChange(e)} // Ensure `handleInputChange` updates the correct field
                                        autoComplete="new-email"
                                        autoCorrect="off"
                                        autoCapitalize="off"
                                        spellCheck="false"
                                        x-autocompletetype="off"
                                    />
                                    {errors.email && 
                                        <p className="mt-1 text-sm text-red-500 animate-shake">{errors.email}</p>
                                    }
                                    </div>


                <div className="relative">
                                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                                    <input
                                        type="tel"
                                        name="phone"
                                        placeholder="Phone number"
                                        className="pl-10 w-full h-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        autoComplete="off"
                                        autoCorrect="off"
                                        autoCapitalize="off"
                                        spellCheck="false"
                                        pattern="[0-9]*"
                                        inputMode="numeric"
                                    />
                                </div>
                                <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <input
                            type="password"
                            name="password"
                            placeholder="Create Password"
                            className="pl-10 w-full h-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                            value={formData.password}
                            onChange={handleInputChange}
                            autoComplete="new-password"
                            autoCorrect="off"
                            autoCapitalize="off"
                            spellCheck="false"
                        />
                        {errors.password && 
                            <p className="mt-1 text-sm text-red-500 animate-shake">{errors.password}</p>
                        }
                    </div>

                                <div className="flex space-x-3">
                                    <button
                                        type="button"
                                        onClick={() => setStep(1)}
                                        className="flex-1 h-12 flex items-center justify-center border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-300"
                                    >
                                        <ChevronLeft className="mr-2 h-5 w-5" />
                                        Back
                                    </button>
                                    
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="flex-1 h-12 flex items-center justify-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 disabled:opacity-50"
                                    >
                                        {isSubmitting ? (
                                            <div className="flex items-center">
                                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                                                Creating...
                                            </div>
                                        ) : (
                                            'Create Account'
                                        )}
                                    </button>
                                </div>
                            </div>
                        )}
                    </form>

          <div className="mt-6 text-center">
            <NavLink 
              to="/login" 
              className="text-blue-600 hover:text-blue-700 font-medium transition-colors duration-300"
            >
              Already have an account? Sign in
            </NavLink>
          </div>
        </div>
      </div>

      {/* Create New Organization Modal */}
      {showNewOrgForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-2xl transform animate-scaleIn">
            <h3 className="text-xl font-bold mb-4">Create New Organization</h3>
            <div className="space-y-4">
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  name="name"
                  placeholder="Organization Name"
                  className="pl-10 w-full h-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={newOrg.name}
                  onChange={handleNewOrgInputChange}
                />
              </div>
              
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="password"
                  name="password"
                  placeholder="Organization Password"
                  className="pl-10 w-full h-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={newOrg.password}
                  onChange={handleNewOrgInputChange}
                />
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => setShowNewOrgForm(false)}
                  className="flex-1 h-12 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-300"
                >
                  Cancel
                </button>
                
                <button
                  onClick={handleCreateNewOrg}
                  disabled={creatingOrg}
                  className="flex-1 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 disabled:opacity-50"
                >
                  {creatingOrg ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                      Creating...
                    </div>
                  ) : (
                    'Create Organization'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showPopup && (
        <PopupCard
          message="Registration successful! Welcome aboard."
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