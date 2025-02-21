import React, { createContext, useContext, useEffect, useState } from "react";
import axiosInstance from "./api";
const AuthContext = createContext();
import { djangoURL } from "./api";
const getTenantIdFromUrl = () => {
  try {
    const pathArray = window.location.pathname.split('/').filter(segment => segment.trim() !== '');

    // Exclude common non-tenant paths
    const excludedPaths = ['login', 'signup', 'forgot-password', 'reset-password', ''];

    // Check if the first segment is not in excluded paths
    if (pathArray.length > 0 && !excludedPaths.includes(pathArray[0])) {
      return pathArray[0];
    }

    return null;
  } catch (error) {
   // console.error("Error parsing tenant ID from URL:", error);
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [tenantId, setTenantId] = useState(() => {
    try {
      const storedTenantId = localStorage.getItem("tenant_id");
      return storedTenantId ? JSON.parse(storedTenantId) : null;
    } catch (error) {
   //   console.error("Error parsing 'tenant_id' from localStorage:", error);
      return null;
    }
  });

  const [authenticated, setAuthenticated] = useState(() => {
    try {
      const tenant_id = getTenantIdFromUrl();
      if (tenant_id === tenantId || tenant_id === null) {
        const storedAuth = localStorage.getItem("authenticated");
        return storedAuth ? JSON.parse(storedAuth) : false;
      } else {
        return false;
      }
    } catch (error) {
    //  console.error("Error initializing 'authenticated' state:", error);
      return false;
    }
  });

  const [userId, setUserId] = useState(() => {
    try {
      const storedUserId = localStorage.getItem("user_id");
      return storedUserId ? JSON.parse(storedUserId) : null;
    } catch (error) {
    //  console.error("Error parsing 'user_id' from localStorage:", error);
      return null;
    }
  });

  const [userRole, setUserRole] = useState(() => {
    try {
      const storedUserRole = localStorage.getItem("user_role");
      return storedUserRole ? JSON.parse(storedUserRole) : null;
    } catch (error) {
    //  console.error("Error parsing 'user_role' from localStorage:", error);
      return null;
    }
  });

  const [model, setModel] = useState(() => {
    try {
      const storedModel = localStorage.getItem("model");
      return storedModel ? JSON.parse(storedModel) : null;
    } catch (error) {
    //  console.error("Error parsing 'model' from localStorage:", error);
      return null;
    }
  });

  const [tenant, setTenant] = useState(() => {
    try {
      const storedTenant = localStorage.getItem("tenant");
      return storedTenant ? JSON.parse(storedTenant) : { tier: 'Free' }; // Default to 'Free' tier
    } catch (error) {
    //  console.error("Error parsing 'tenant' from localStorage:", error);
      return { tier: 'Free' }; // Default to 'Free' tier
    }
  });

  // Fetch tenant details when tenantId changes
  useEffect(() => {
    const fetchTenantDetails = async () => {
      if (tenantId) {
        try {
          const response = await axiosInstance.get(`${djangoURL}/get-tenant-details/`);
          setTenant(response.data); // Update tenant state with fetched data
        } catch (error) {
      //    console.error("Error fetching tenant details:", error);
        }
      }
    };

    fetchTenantDetails();
  }, [tenantId]);

  // Save all states to localStorage in a single useEffect
  useEffect(() => {
    try {
      localStorage.setItem("authenticated", JSON.stringify(authenticated));
      localStorage.setItem("user_id", JSON.stringify(userId));
      localStorage.setItem("tenant_id", JSON.stringify(tenantId));
      localStorage.setItem("user_role", JSON.stringify(userRole));
      localStorage.setItem("model", JSON.stringify(model));
      localStorage.setItem("tenant", JSON.stringify(tenant));
    } catch (error) {
    //  console.error("Error saving state to localStorage:", error);
    }
  }, [authenticated, userId, tenantId, userRole, model, tenant]);

  const login = (userId, tenantId, role, model, tenantData) => {
    setAuthenticated(true);
    setUserId(userId);
    setTenantId(tenantId);
    setUserRole(role);
    setModel(model);
    setTenant(tenantData); // Set tenant data
  };

  const logout = () => {
    try {
      localStorage.removeItem("authenticated");
      localStorage.removeItem("user_id");
      localStorage.removeItem("tenant_id");
      localStorage.removeItem("user_role");
      localStorage.removeItem("model");
      localStorage.removeItem("tenant");
      setAuthenticated(false);
      setUserId(null);
      setTenantId(null);
      setUserRole(null);
      setModel(null);
      setTenant({ tier: 'Free' }); // Reset tenant state to default
    } catch (error) {
    //  console.error("Error during logout:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        authenticated,
        userId,
        tenantId,
        userRole,
        model,
        tenant,
        login,
        logout,
        setAuthenticated,
        setModel,
        setTenant,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};