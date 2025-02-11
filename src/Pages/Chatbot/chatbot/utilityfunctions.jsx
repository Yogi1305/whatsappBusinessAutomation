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
      // Trim the string and log for debugging
      jsonString = jsonString.trim();
      //console.log("Original JSON String: ", jsonString);
  
      // Early return if it's already valid JSON
      try {
        JSON.parse(jsonString);
        return jsonString;
      } catch {}
  
      // Handle common JSON formatting issues
      let fixedString = jsonString
        // Replace single quotes with double quotes, preserving quotes within strings
        .replace(/(?<!\\)'([^']*?)(?<!\\)'/g, '"$1"')
        
        // Ensure keys are properly quoted
        .replace(/([{,]\s*)([a-zA-Z0-9_]+)(\s*:)/g, '$1"$2"$3')
        
        // Remove trailing commas
        .replace(/,\s*}/g, '}')
        .replace(/,\s*\]/g, ']')
        
        // Handle escaped characters
        .replace(/\\'/g, "'")
        .replace(/\\"/g, '"');
  
     //console.log("Processed JSON String: ", fixedString);
  
      // Attempt to parse the fixed string
      JSON.parse(fixedString);
      
      return fixedString;
    } catch (e) {
      console.error('Error fixing JSON string:', e, 'Original string:', jsonString);
      
      // Fallback strategies
      try {
        // Last resort: try to create a valid JSON object
        return JSON.stringify(eval('(' + jsonString + ')'));
      } catch {
        console.error('Could not parse JSON string at all');
        return '{}'; // Return an empty object as absolute fallback
      }
    }
  };