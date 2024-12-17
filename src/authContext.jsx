import React, { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

const getTenantIdFromUrl = () => {
  const pathArray = window.location.pathname.split('/').filter(segment => segment.trim() !== '');
  
  // Exclude common non-tenant paths
  const excludedPaths = ['login', 'signup', 'forgot-password', 'reset-password', ''];
  
  // Check if the first segment is not in excluded paths
  if (pathArray.length > 0 && !excludedPaths.includes(pathArray[0])) {
    return pathArray[0];
  }
  
  return null;
};

export const AuthProvider = ({ children }) => {

  const [tenantId, setTenantId] = useState(() => {
    const storedTenantId = localStorage.getItem("tenant_id");
    return storedTenantId ? JSON.parse(storedTenantId) : null;
  });

  const [authenticated, setAuthenticated] = useState(() => {
    const tenant_id = getTenantIdFromUrl()
    if (tenant_id == tenantId||tenant_id == null){
      const storedAuth = localStorage.getItem("authenticated");
      return storedAuth ? JSON.parse(storedAuth) : false;
    }
    else{
      return false
    }
  });

  const [userId, setUserId] = useState(() => {
    const storedUserId = localStorage.getItem("user_id");
    return storedUserId ? JSON.parse(storedUserId) : null;
  });



  const [userRole, setUserRole] = useState(() => {
    const storedUserRole = localStorage.getItem("user_role");
    try {
      return storedUserRole ? JSON.parse(storedUserRole) : null;
    } catch (error) {
      console.error("Error parsing 'user_role' from localStorage:", error);
      return null; // Provide a default value or handle the error as needed
    }
  });

  const [model, setModel] = useState(() => {
    try {
      const storedModel = localStorage.getItem("model");
      return storedModel ? JSON.parse(storedModel) : null;
    } catch (error) {
      console.error("Error parsing JSON from localStorage:", error);
      return null; // or provide a default value
    }
  });
  

  useEffect(() => {
    try {
      localStorage.setItem("authenticated", JSON.stringify(authenticated));
    } catch (error) {
      console.error("Error saving 'authenticated' to localStorage:", error);
    }
  }, [authenticated]);

  useEffect(() => {
    try {
      localStorage.setItem("user_id", JSON.stringify(userId));
    } catch (error) {
      console.error("Error saving 'user_id' to localStorage:", error);
    }
  }, [userId]);

  useEffect(() => {
    try {
      localStorage.setItem("tenant_id", JSON.stringify(tenantId));
    } catch (error) {
      console.error("Error saving 'tenant_id' to localStorage:", error);
    }
  }, [tenantId]);

  useEffect(() => {
    try {
      localStorage.setItem("user_role", JSON.stringify(userRole));
    } catch (error) {
      console.error("Error saving 'user_role' to localStorage:", error);
    }
  }, [userRole]);

  useEffect(() => {
    try {
      localStorage.setItem("model", JSON.stringify(model));
    } catch (error) {
      console.error("Error saving 'model' to localStorage:", error);
    }
  }, [model]);

  const login = (userId, tenantId, role, model) => { // Add model parameter
    setAuthenticated(true);
    setUserId(userId);
    setTenantId(tenantId);
    setUserRole(role);
    setModel(model); // Set model
  };

  const logout = () => {
    try {
      localStorage.removeItem("authenticated");
      localStorage.removeItem("user_id");
      localStorage.removeItem("tenant_id");
      localStorage.removeItem("user_role");
      localStorage.removeItem("model");
      setAuthenticated(false);
      setUserId(null);
      setTenantId(null);
      setUserRole(null);
      setModel(null); // Clear model
    } catch (error) {
      console.error("Error clearing localStorage:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ authenticated, userId, tenantId, userRole, model, login, logout, setAuthenticated, setModel }}>
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