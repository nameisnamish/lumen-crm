/**
 * Centralized Validation Rules & Edge Case Handlers for Forms
 */

// Name Regex: Only allows uppercase/lowercase letters, spaces, hyphens, and apostrophes.
export const NAME_REGEX = /^[a-zA-Z\s'-]{2,50}$/;

export const NAME_VALIDATION_RULE = {
  required: "Full name is required",
  pattern: {
    value: NAME_REGEX,
    message: "Name can only contain letters, spaces, hyphens, and apostrophes (min 2 characters)",
  },
  minLength: {
    value: 2,
    message: "Name must be at least 2 characters long",
  },
  maxLength: {
    value: 50,
    message: "Name cannot exceed 50 characters",
  },
};

export const EMAIL_VALIDATION_RULE = {
  required: "Email address is required",
  pattern: {
    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: "Please enter a valid email address",
  },
};

export const PASSWORD_VALIDATION_RULE = {
  required: "Password is required",
  minLength: {
    value: 6,
    message: "Password must be at least 6 characters long",
  },
};

/** Sanitizes name input in real-time by stripping non-allowed characters */
export const sanitizeNameInput = (value = "") => {
  return value.replace(/[^a-zA-Z\s'-]/g, "");
};
