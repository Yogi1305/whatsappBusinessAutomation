export const validateTemplateName = (value) => {
    // Conditions:
    // 1. No uppercase letters
    // 2. No spaces
    // 3. No numbers
    // 4. Only letters allowed
    if (!value) return '';
    
    if (value.toLowerCase() !== value) {
      return 'Template name must be in lowercase';
    }
  
    if (value.includes(' ')) {
      return 'Template name cannot contain spaces';
    }
  
    if (!/^[a-z]+$/.test(value)) {
      return 'Template name can only contain lowercase letters';
    }
  
    return '';
  };