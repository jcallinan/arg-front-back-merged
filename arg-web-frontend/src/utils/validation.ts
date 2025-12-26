interface ValidationResult {
  value: string;
  hasError: boolean;
  errorMessage?: string;
}

export const validateEmail = (e: React.ChangeEvent<HTMLInputElement>): ValidationResult => {
  const value = e.target.value;
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const isValid = emailRegex.test(value);

  return {
    value,
    hasError: value.length > 0 && !isValid,
    errorMessage: value.length > 0 && !isValid ? 'Please enter a valid email address' : undefined
  };
};

export const validateNumericInput = (e: React.ChangeEvent<HTMLInputElement>): ValidationResult => {
  const originalValue = e.target.value;
  // Check if input contains any non-numeric characters except decimal point
  const hasInvalidChars = /[^0-9.]/.test(originalValue);
  
  // Remove any non-numeric characters except decimal point
  const value = originalValue.replace(/[^0-9.]/g, '');
  
  // Ensure only one decimal point
  const parts = value.split('.');
  const finalValue = parts.length > 2 ? parts[0] + '.' + parts.slice(1).join('') : value;
  
  return {
    value: finalValue,
    hasError: hasInvalidChars,
    errorMessage: hasInvalidChars ? 'Please enter numbers only' : undefined
  };
};

export const validateInvoiceAmount = (e: React.ChangeEvent<HTMLInputElement>): ValidationResult => {
  const originalValue = e.target.value;
  // Check if input contains any non-numeric characters except decimal point and minus sign
  const hasInvalidChars = /[^0-9.-]/.test(originalValue);
  
  // Remove any non-numeric characters except decimal point and minus sign
  let value = originalValue.replace(/[^0-9.-]/g, '');
  
  // Handle minus sign: only allow at the beginning
  const minusCount = (value.match(/-/g) || []).length;
  if (minusCount > 1) {
    // Remove extra minus signs, keep only the first one if it's at the beginning
    const firstMinusIndex = value.indexOf('-');
    if (firstMinusIndex === 0) {
      value = '-' + value.substring(1).replace(/-/g, '');
    } else {
      value = value.replace(/-/g, '');
    }
  } else if (minusCount === 1 && value.indexOf('-') !== 0) {
    // If there's a minus sign but not at the beginning, remove it
    value = value.replace(/-/g, '');
  }
  
  // Ensure only one decimal point
  const parts = value.split('.');
  const finalValue = parts.length > 2 ? parts[0] + '.' + parts.slice(1).join('') : value;
  
  return {
    value: finalValue,
    hasError: hasInvalidChars,
    errorMessage: hasInvalidChars ? 'Please enter numbers only' : undefined
  };
};

export const formatInvoiceAmountOnBlur = (value: string): string => {
  if (!value || value === '' || value === '-') {
    return value;
  }
  
  // Parse the value to ensure it's a valid number
  const numValue = parseFloat(value);
  if (isNaN(numValue)) {
    return value;
  }
  
  // If the value doesn't contain a decimal point, add .00
  if (!value.includes('.')) {
    return value + '.00';
  }
  
  // If it has a decimal but only one digit after, add a zero
  const parts = value.split('.');
  if (parts[1] && parts[1].length === 1) {
    return value + '0';
  }
  
  return value;
};

export const validateIntegerInput = (e: React.ChangeEvent<HTMLInputElement>): ValidationResult => {
  const originalValue = e.target.value;
  // Check if input contains any non-numeric characters
  const hasInvalidChars = /[^0-9]/.test(originalValue);
  
  // Remove any non-numeric characters
  const value = originalValue.replace(/[^0-9]/g, '');
  
  return {
    value,
    hasError: hasInvalidChars,
    errorMessage: hasInvalidChars ? 'Please enter numbers only' : undefined
  };
};

export const validateInvoiceNo = (e: React.ChangeEvent<HTMLInputElement>): ValidationResult => {
  const originalValue = e.target.value;
  
  // Convert lowercase characters to uppercase automatically
  const value = originalValue.toUpperCase();
  
  return {
    value: value,
    hasError: false, // No error since we auto-convert
    errorMessage: undefined
  };
};
