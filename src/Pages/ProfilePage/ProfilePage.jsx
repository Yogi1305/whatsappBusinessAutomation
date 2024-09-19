// import React, { useEffect, useState } from 'react';
// import { User, Edit2, Save, X, Upload } from 'lucide-react';
// import axios from 'axios';
// import axiosInstance from '../../api';

// const ProfilePage = () => {
//   const [isEditing, setIsEditing] = useState(false);
//   const [profile, setProfile] = useState({
//     phoneNumber: '+14798024855',
//     about: 'NurenAI - WhatsApp Official API Partner',
//     businessAddress: 'New Delhi',
//     businessDescription: 'NurenAI PlayArea',
//     email: 'support@nuren.ai',
//     businessIndustry: 'Professional Services',
//     businessWebsite1: 'https://nuren.ai',
//     businessWebsite2: 'https://crm.nuren.ai'
//   });
//   const [profileImage, setProfileImage] = useState(null);
//   const [profileImagePreview, setProfileImagePreview] = useState(null);
//   const [uploadProgress, setUploadProgress] = useState(0);
//   const [profileImageId, setProfileImageId] = useState(null);
//   const [accessToken, setAccessToken] = useState('');
//   const [businessPhoneNumberId, setBusinessPhoneNumberId] = useState('');


//   useEffect(() => {
//     const fetchTenantData = async () => {
//       try {
//         const business_phone_number_id = 241683569037594;
//         const response = await axiosInstance.get(`/whatsapp_tenant/?business_phone_id=${business_phone_number_id}`);
//         setAccessToken(response.data.access_token);
//         setBusinessPhoneNumberId(response.data.business_phone_number_id);
//       } catch (error) {
//         console.error('Error fetching tenant data:', error);
//       }
//     };
    
//     fetchTenantData();
//   }, []);

//   const handleEdit = () => {
//     setIsEditing(!isEditing);
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setProfile(prevProfile => ({
//       ...prevProfile,
//       [name]: value
//     }));
//   };

//   const handleImageUpload = async (e) => {
//     const selectedFile = e.target.files[0];
//     if (selectedFile) {
//       setProfileImage(selectedFile);
//       setProfileImagePreview(URL.createObjectURL(selectedFile));

//       try {
//         console.log('Uploading file to WhatsApp Media API...');

//         const formData = new FormData();
//         formData.append('file', selectedFile);
//         formData.append('type', 'image');
//         formData.append('messaging_product', 'whatsapp');

//         const response = await axios.post(
//           'https://my-template-whatsapp.vercel.app/uploadMedia',
//           formData,
//           {
//             headers: {
//               'Authorization': `Bearer ${accessToken}`,
//               'Content-Type': 'multipart/form-data',
//             },
//             onUploadProgress: (progressEvent) => {
//               const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
//               setUploadProgress(progress);
//             },
//           }
//         );

//         console.log('File uploaded to WhatsApp, ID:', response.data.body.h);
//         setProfileImageId(response.data.body.h);
//         setUploadProgress(100);
//       } catch (error) {
//         console.error('Error uploading file:', error);
//         setUploadProgress(0);
//       }
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsEditing(false);

//     if (profileImageId) {
//       try {
//         const response = await axios.post(
//           `https://graph.facebook.com/v20.0/${businessPhoneNumberId}/whatsapp_business_profile`,
//           {
//             messaging_product: "whatsapp",
//             profile_picture_handle: profileImageId
//           },
//           {
//             headers: {
//               'Authorization': `Bearer ${accessToken}`,
//               'Content-Type': 'application/json',
//             },
//           }
//         );
//         console.log('Profile picture updated:', response.data);
//       } catch (error) {
//         console.error('Error updating profile picture:', error);
//       }
//     }

//     // Here you would typically send the updated profile to your backend
//   };

//   const renderField = (key, value) => (
//     <div key={key} className="mb-4">
//       <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor={key}>
//         {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
//       </label>
//       {isEditing ? (
//         <input
//           className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//           id={key}
//           type="text"
//           name={key}
//           value={value}
//           onChange={handleChange}
//         />
//       ) : (
//         <p className="bg-gray-50 rounded-md px-3 py-2 text-gray-800">{value}</p>
//       )}
//     </div>
//   );

//   return (
//     <div className="container mx-auto px-4 py-8 ">
//       <div className="bg-white shadow-lg rounded-lg overflow-hidden" style={{width:'90vw', display:'flex', justifyContent:"center", flexDirection:'column'}}>
//         <div className="p-6 bg-gray-50 border-b border-gray-200">
//           <div className="flex justify-between items-center mb-6">
//             <h1 className="text-3xl font-bold text-gray-800">Profile</h1>
//             <button
//               onClick={handleEdit}
//               className={`flex items-center px-4 py-2 rounded-full ${
//                 isEditing ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'
//               } text-white transition duration-300 ease-in-out`}
//             >
//               {isEditing ? (
//                 <>
//                   <X className="mr-2" size={18} /> Cancel
//                 </>
//               ) : (
//                 <>
//                   <Edit2 className="mr-2" size={18} /> Edit Profile
//                 </>
//               )}
//             </button>
//           </div>
//           <div className="flex items-center">
//             <div className="relative mr-4">
//               {profileImagePreview ? (
//                 <img src={profileImagePreview} alt="Profile" className="w-24 h-24 rounded-full object-cover" />
//               ) : (
//                 <User className="text-gray-500" size={96} />
//               )}
//               {isEditing && (
//                 <label htmlFor="profile-image-upload" className="absolute bottom-0 right-0 bg-blue-500 text-white rounded-full p-2 cursor-pointer">
//                   <Upload size={18} />
//                   <input
//                     id="profile-image-upload"
//                     type="file"
//                     accept="image/*"
//                     onChange={handleImageUpload}
//                     className="hidden"
//                   />
//                 </label>
//               )}
//             </div>
//             <div>
//               <h2 className="text-2xl font-semibold text-gray-800">{profile.businessDescription}</h2>
//               <p className="text-gray-600">{profile.businessIndustry}</p>
//             </div>
//           </div>
//           {uploadProgress > 0 && uploadProgress < 100 && (
//             <div className="mt-2">
//               <div className="bg-blue-100 rounded-full h-2">
//                 <div
//                   className="bg-blue-500 rounded-full h-2 transition-all duration-300"
//                   style={{ width: `${uploadProgress}%` }}
//                 ></div>
//               </div>
//             </div>
//           )}
//         </div>
//         <form onSubmit={handleSubmit} className="p-6">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div>
//               {renderField('phoneNumber', profile.phoneNumber)}
//               {renderField('email', profile.email)}
//               {renderField('businessAddress', profile.businessAddress)}
//               {renderField('businessDescription', profile.businessDescription)}
//             </div>
//             <div>
//               {renderField('about', profile.about)}
//               {renderField('businessIndustry', profile.businessIndustry)}
//               {renderField('businessWebsite1', profile.businessWebsite1)}
//               {renderField('businessWebsite2', profile.businessWebsite2)}
//             </div>
//           </div>
//           {isEditing && (
//             <div className="mt-6 text-right">
//               <button
//                 type="submit"
//                 className="inline-flex items-center px-4 py-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition duration-300 ease-in-out"
//               >
//                 <Save className="mr-2" size={18} /> Save Changes
//               </button>
//             </div>
//           )}
//         </form>
//       </div>
//     </div>
//   );
// };

// export default ProfilePage;



import React, { useEffect, useState } from 'react';
import { User, Edit2, Save, X, Upload } from 'lucide-react';
import axios from 'axios';
import axiosInstance from '../../api';



const getTenantIdFromUrl = () => {
  // Example: Extract tenant_id from "/3/home"
  const pathArray = window.location.pathname.split('/');
  if (pathArray.length >= 2) {
    return pathArray[1]; // Assumes tenant_id is the first part of the path
  }
  return null; // Return null if tenant ID is not found or not in the expected place
};

const ProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    id: null,
    username: '',
    email: '',
    role: '',
    name: '',
    phone_number: '',
    address: '',
    about: '',
    businessDescription: '',
    businessIndustry: '',
    businessWebsite1: '',
    businessWebsite2: '',
  });
  const [profileImage, setProfileImage] = useState(null);
  const [profileImagePreview, setProfileImagePreview] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [profileImageId, setProfileImageId] = useState(null);
  const [accessToken, setAccessToken] = useState('');
  const [businessPhoneNumberId, setBusinessPhoneNumberId] = useState('');
  const tenantId=getTenantIdFromUrl();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // First, fetch the business phone ID
        const bpidResponse = await axiosInstance.get('https://backenreal-hgg2d7a0d9fzctgj.eastus-01.azurewebsites.net/get-bpid/', {
          headers: {
            'X-Tenant-ID': tenantId
          }
        });
        const businessPhoneNumberId = bpidResponse.data.business_phone_number_id;
        setBusinessPhoneNumberId(businessPhoneNumberId);
  
        // Then, fetch the tenant data using the obtained business phone ID
        const tenantResponse = await axiosInstance.get(`/whatsapp_tenant/?business_phone_id=${businessPhoneNumberId}`);
        setAccessToken(tenantResponse.data.access_token);
  
        // Fetch user profile
        const profileResponse = await axiosInstance.get(`/get-user/${tenantId}`);
        setProfile(prevProfile => ({
          ...prevProfile,
          ...profileResponse.data,
        }));
  
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
  
    fetchData();
  }, [tenantId]);

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

  const handleImageUpload = async (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setProfileImage(selectedFile);
      setProfileImagePreview(URL.createObjectURL(selectedFile));

      try {
        console.log('Uploading file to WhatsApp Media API...');

        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('type', 'image');
        formData.append('messaging_product', 'whatsapp');

        const response = await axios.post(
          'https://my-template-whatsapp.vercel.app/uploadMedia',
          formData,
          {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'multipart/form-data',
            },
            onUploadProgress: (progressEvent) => {
              const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
              setUploadProgress(progress);
            },
          }
        );

        console.log('File uploaded to WhatsApp, ID:', response.data.body.h);
        setProfileImageId(response.data.body.h);
        setUploadProgress(100);
      } catch (error) {
        console.error('Error uploading file:', error);
        setUploadProgress(0);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsEditing(false);

    try {
      // Update profile on backend
      await axiosInstance.put(`/get-user/${tenantId}/`, profile);
      console.log('Profile updated successfully');

      // Update profile picture if changed
      if (profileImageId) {
        const response = await axios.post(
          `https://graph.facebook.com/v20.0/${businessPhoneNumberId}/whatsapp_business_profile`,
          {
            messaging_product: "whatsapp",
            profile_picture_handle: profileImageId
          },
          {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
          }
        );
        console.log('Profile picture updated:', response.data);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    }
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
          value={value || ''}
          onChange={handleChange}
        />
      ) : (
        <p className="bg-gray-50 rounded-md px-3 py-2 text-gray-800">{value || 'N/A'}</p>
      )}
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8 ">
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
            <div className="relative mr-4">
              {profileImagePreview ? (
                <img src={profileImagePreview} alt="Profile" className="w-24 h-24 rounded-full object-cover" />
              ) : (
                <User className="text-gray-500" size={96} />
              )}
              {isEditing && (
                <label htmlFor="profile-image-upload" className="absolute bottom-0 right-0 bg-blue-500 text-white rounded-full p-2 cursor-pointer">
                  <Upload size={18} />
                  <input
                    id="profile-image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-gray-800">{profile.name}</h2>
              <p className="text-gray-600">{profile.role}</p>
            </div>
          </div>
          {uploadProgress > 0 && uploadProgress < 100 && (
            <div className="mt-2">
              <div className="bg-blue-100 rounded-full h-2">
                <div
                  className="bg-blue-500 rounded-full h-2 transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              {renderField('username', profile.username)}
              {renderField('email', profile.email)}
              {renderField('phone_number', profile.phone_number)}
              {renderField('address', profile.address)}
            </div>
            <div>
              {renderField('about', profile.about)}
              {renderField('businessDescription', profile.businessDescription)}
              {renderField('businessIndustry', profile.businessIndustry)}
              {renderField('businessWebsite', profile.businessWebsite)}
              {/* {renderField('businessWebsite2', profile.businessWebsite2)} */}
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