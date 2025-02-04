export const getInitials = (name = '', lastName = '') => {
    return `${name[0] || ''}${lastName[0] || ''}`.toUpperCase() || '??';
  };
  
  export const fixJsonString = (str) => {
    try {
      return str
        .replace(/'/g, '"')
        .replace(/\\"/g, '"')
        .replace(/\\n/g, '\\\\n');
    } catch {
      return str;
    }
  };
  
  export const getContactIDfromURL = () => {
    const params = new URLSearchParams(window.location.search);
    return params.get('contactId');
  };