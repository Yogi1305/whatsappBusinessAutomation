import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../authContext';
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

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [role, setRole] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch('https://backenreal-hgg2d7a0d9fzctgj.eastus-01.azurewebsites.net/login/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) throw new Error('Login failed');

      const data = await response.json();
      setRole(data.role);
      setShowPopup(true);
      login(data.user_id, data.tenant_id, data.role,data.model);
    } catch (error) {
      setError('Login failed. Please check your credentials and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (showPopup) {
      // Set a timeout to close the popup and navigate after 2 seconds
      const timer = setTimeout(() => {
        setShowPopup(false);
        onLogin();
        navigate('/profile');
      }, 2000);

      // Clear the timer if the component unmounts
      return () => clearTimeout(timer);
    }
  }, [showPopup, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-200 flex flex-col justify-center items-center p-4" style={{width:"100vw"}}>
      <div className="bg-white shadow-2xl rounded-2xl w-full max-w-md overflow-hidden">
        <div className="p-8">
          <div className="flex items-center justify-center mb-8">
            <img src={logo} alt="Logo" className="h-12 w-auto mr-2" />
            <span className="text-2xl font-bold text-gray-800">Nuren AI</span>
          </div>
          <h2 className="text-3xl font-extrabold text-center text-gray-900 mb-6">Login</h2>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="username" className="sr-only">Username</label>
              <input
                id="username"
                name="username"
                type="text"
                required
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isSubmitting ? 'Logging in...' : 'Login'}
              </button>
            </div>
          </form>
          <div className="mt-6 text-center">
            <Link to="/register" className="font-medium text-indigo-600 hover:text-indigo-500">
              Don't have an account? Register
            </Link>
          </div>
        </div>
      </div>
      {showPopup && <PopupCard message={`Login successful as ${role}`} onClose={() => setShowPopup(false)} />}
            </div>
  );
};

export default Login;