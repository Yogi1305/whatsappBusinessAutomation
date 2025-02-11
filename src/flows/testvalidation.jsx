// src/components/whatsapp-flow/utils/validation.js
export function validateComponent(component) {
  const config = COMPONENT_CONFIGS[component.type];
  if (!config) return true;

  const errors = [];

  if (component.type.includes('Text')) {
    if (component.text?.length > config.maxChars) {
      errors.push(`Text exceeds maximum length of ${config.maxChars} characters`);
    }
  }

  if (component.type === 'TextInput' || component.type === 'TextArea') {
    if (component.helperText?.length > config.helperTextMaxChars) {
      errors.push(`Helper text exceeds maximum length of ${config.helperTextMaxChars} characters`);
    }
    if (component.label?.length > config.labelMaxChars) {
      errors.push(`Label exceeds maximum length of ${config.labelMaxChars} characters`);
    }
  }

  return errors;
} 