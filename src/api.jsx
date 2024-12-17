import axios from 'axios';

// export const djangoURL = "https://backeng4whatsapp-dxbmgpakhzf9bped.centralindia-01.azurewebsites.net"
export const fastURL = "http://localhost:8000"
// export const fastURL = "https://fastapione-gue2c5ecc9c4b8hy.centralindia-01.azurewebsites.net"
export const djangoURL = "http://localhost:8001"

export const axiosInstance = axios.create({
  baseURL: `${djangoURL}/`,  // Adjust this to your Django backend URL
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const tenantId = getTenantIdFromUrl();  // Get tenantId from the URL
    console.log("tenant id is: ",tenantId);
    if (tenantId) {
      config.headers['X-Tenant-Id'] = tenantId;
     
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Function to extract tenantId from the current URL
const getTenantIdFromUrl = () => {
  // Example: Extract tenant_id from "/3/home"
  const pathArray = window.location.pathname.split('/');
  if (pathArray.length >= 2) {
    return pathArray[1]; // Assumes tenant_id is the first part of the path
  }
  return null; // Return null if tenant ID is not found or not in the expected place
};

export default axiosInstance;
