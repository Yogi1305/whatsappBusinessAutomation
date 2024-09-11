import React, { useState } from 'react';
import { User, Edit2, Save, X } from 'lucide-react';

const ProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    phoneNumber: '+14798024855',
    about: 'NurenAI - WhatsApp Official API Partner',
    businessAddress: 'New Delhi',
    businessDescription: 'NurenAI PlayArea',
    email: 'support@nuren.ai',
    businessIndustry: 'Professional Services',
    businessWebsite1: 'https://nuren.ai',
    businessWebsite2: 'https://crm.nuren.ai'
  });

  const handleEdit = () => {
    setIsEditing(!isEditing);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prevProfile => ({
      ...prevProfile,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsEditing(false);
    // Here you would typically send the updated profile to your backend
  };

  const renderField = (key, value) => (
    <div key={key} className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor={key}>
        {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
      </label>
      {isEditing ? (
        <input
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          id={key}
          type="text"
          name={key}
          value={value}
          onChange={handleChange}
        />
      ) : (
        <p className="bg-gray-50 rounded-md px-3 py-2 text-gray-800">{value}</p>
      )}
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8 " >
      <div className="bg-white shadow-lg rounded-lg overflow-hidden" style={{width:'90vw', display:'flex', justifyContent:"center", flexDirection:'column'}}>
        <div className="p-6 bg-gray-50 border-b border-gray-200">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">Profile</h1>
            <button
              onClick={handleEdit}
              className={`flex items-center px-4 py-2 rounded-full ${
                isEditing ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'
              } text-white transition duration-300 ease-in-out`}
            >
              {isEditing ? (
                <>
                  <X className="mr-2" size={18} /> Cancel
                </>
              ) : (
                <>
                  <Edit2 className="mr-2" size={18} /> Edit Profile
                </>
              )}
            </button>
          </div>
          <div className="flex items-center">
            <User className="text-gray-500 mr-4" size={48} />
            <div>
              <h2 className="text-2xl font-semibold text-gray-800">{profile.businessDescription}</h2>
              <p className="text-gray-600">{profile.businessIndustry}</p>
            </div>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              {renderField('phoneNumber', profile.phoneNumber)}
              {renderField('email', profile.email)}
              {renderField('businessAddress', profile.businessAddress)}
              {renderField('businessDescription', profile.businessDescription)}
            </div>
            <div>
              {renderField('about', profile.about)}
              {renderField('businessIndustry', profile.businessIndustry)}
              {renderField('businessWebsite1', profile.businessWebsite1)}
              {renderField('businessWebsite2', profile.businessWebsite2)}
            </div>
          </div>
          {isEditing && (
            <div className="mt-6 text-right">
              <button
                type="submit"
                className="inline-flex items-center px-4 py-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition duration-300 ease-in-out"
              >
                <Save className="mr-2" size={18} /> Save Changes
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;