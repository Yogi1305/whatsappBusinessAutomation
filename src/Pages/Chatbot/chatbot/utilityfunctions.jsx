export const getTenantIdFromUrl = () => {
    const pathArray = window.location.pathname.split('/');
    if (pathArray.length >= 2) {
      var tenant_id = pathArray[1]
      if(tenant_id == "demo") tenant_id = 'ai'
      return tenant_id;
    }
    return null; 
  };
  
  export const getContactIDfromURL = () => {
    const url = window.location.href;
    const params = new URLSearchParams(new URL(url).search);
    return params.get('id');
  };
  
  export const setCSSVariable = (variable, value) => {
    let root = document.documentElement;
    root.style.setProperty(variable, value);
  };
  
  export const fixJsonString = (jsonString) => {
    try {
      // Replace single quotes with double quotes
      const regex = /("(?:[^"\\]|\\.)*")|'/g;
  
      // Replace single quotes with double quotes outside of double-quoted segments
      let fixedString = jsonString.replace(regex, (match) => {
        if (match.startsWith('"') && match.endsWith('"')) {
          // If the segment is within double quotes, return it as is
          return match;
        }
        // Replace single quotes with double quotes
        return match.replace(/'(?![^"]*")/g, '"');
      });
  
      // Ensure proper escape sequences
      fixedString = fixedString.replace(/\\"/g, '\\\\"');
      return fixedString;
    } catch (e) {
      console.error('Error fixing JSON string:', e);
      return jsonString; // Return as-is if fixing fails
    }
  };