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


export const validateBodyLength = (bodyText) => {
  const MAX_BODY_LENGTH = 1024;
  if (bodyText.length > MAX_BODY_LENGTH) {
    return `Body text cannot exceed ${MAX_BODY_LENGTH} characters. Current length: ${bodyText.length}`;
  }
  return '';
};

export const validateButtonEmojis = (buttons) => {
  const emojiRegex = /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}]/u;
  
  return buttons.reduce((errors, button, index) => {
    if (emojiRegex.test(button.text)) {
      errors.push(`Button ${index + 1} contains emojis, which are not allowed.`);
    }
    return errors;
  }, []);
};