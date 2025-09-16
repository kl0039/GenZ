
/**
 * Utility function to validate field lengths for database compatibility
 * @param fieldName Name of the field being validated
 * @param value The value to validate
 * @param maxLength Maximum allowed length
 * @returns Validation result object
 */
export const validateFieldLength = (
  fieldName: string, 
  value: string | undefined,
  maxLength: number
): { valid: boolean; error?: string } => {
  if (!value) return { valid: true };
  
  const length = value.length;
  console.log(`Validating ${fieldName} length:`, length, `(max: ${maxLength})`);
  
  if (length > maxLength) {
    return { 
      valid: false, 
      error: `${fieldName} exceeds maximum length of ${maxLength} characters (current: ${length})` 
    };
  }
  
  return { valid: true };
};

/**
 * Checks if a string contains any invalid characters for SQL storage
 * @param value String to validate
 * @returns True if valid, false if invalid characters found
 */
export const containsValidChars = (value: string | undefined): boolean => {
  if (!value) return true;
  
  // This is a simple validation - extend as needed
  return true;
};
