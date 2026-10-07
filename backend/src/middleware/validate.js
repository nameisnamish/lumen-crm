/**
 * Backend Data Entry Validation Utilities & Middleware
 */

export const NAME_REGEX = /^[a-zA-Z\s'-]{2,50}$/;
export const PHONE_REGEX = /^\+?[0-9\s\-().]{10,20}$/;
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const isValidEmail = (email) => {
  if (!email || typeof email !== "string") return false;
  const trimmed = email.trim();
  return trimmed.length <= 100 && EMAIL_REGEX.test(trimmed);
};

export const isValidPhone = (phone) => {
  if (!phone || typeof phone !== "string") return false;
  const digits = phone.replace(/\D/g, "");
  return digits.length >= 10 && digits.length <= 15 && PHONE_REGEX.test(phone);
};

export const isValidName = (name) => {
  if (!name || typeof name !== "string") return false;
  return NAME_REGEX.test(name.trim());
};

export const validateLeadPayload = (data, isUpdate = false) => {
  const errors = [];

  if (!isUpdate || data.name !== undefined) {
    if (!data.name || !isValidName(data.name)) {
      errors.push("Name must be 2–50 characters and contain only letters, spaces, hyphens, and apostrophes");
    }
  }

  if (data.email && !isValidEmail(data.email)) {
    errors.push("Email is invalid or exceeds 100 characters");
  }

  if (data.phone && !isValidPhone(data.phone)) {
    errors.push("Phone number must contain between 10 and 15 digits (e.g. +1 (555) 234-5678)");
  }

  if (data.value !== undefined && data.value !== null) {
    const num = Number(data.value);
    if (isNaN(num) || num < 0 || num > 1000000000) {
      errors.push("Deal value must be a valid number between $0 and $1,000,000,000");
    }
  }

  if (data.company && typeof data.company === "string" && data.company.length > 100) {
    errors.push("Company name cannot exceed 100 characters");
  }

  if (data.notes && typeof data.notes === "string" && data.notes.length > 2000) {
    errors.push("Notes cannot exceed 2000 characters");
  }

  return errors;
};

export const validateContactPayload = (data, isUpdate = false) => {
  const errors = [];

  if (!isUpdate || data.name !== undefined) {
    if (!data.name || !isValidName(data.name)) {
      errors.push("Contact name must be 2–50 characters and contain only letters, spaces, hyphens, and apostrophes");
    }
  }

  if (data.email && !isValidEmail(data.email)) {
    errors.push("Email is invalid or exceeds 100 characters");
  }

  if (data.phone && !isValidPhone(data.phone)) {
    errors.push("Phone number must contain between 10 and 15 digits");
  }

  if (data.company && typeof data.company === "string" && data.company.length > 100) {
    errors.push("Company cannot exceed 100 characters");
  }

  if (data.title && typeof data.title === "string" && data.title.length > 100) {
    errors.push("Job title cannot exceed 100 characters");
  }

  return errors;
};

export const validateTaskPayload = (data, isUpdate = false) => {
  const errors = [];

  if (!isUpdate || data.title !== undefined) {
    if (!data.title || typeof data.title !== "string" || data.title.trim().length < 2 || data.title.length > 100) {
      errors.push("Task title must be between 2 and 100 characters");
    }
  }

  if (data.description && typeof data.description === "string" && data.description.length > 1000) {
    errors.push("Description cannot exceed 1000 characters");
  }

  return errors;
};

export const validateNotePayload = (data, isUpdate = false) => {
  const errors = [];

  if (!isUpdate || data.content !== undefined) {
    if (!data.content || typeof data.content !== "string" || data.content.trim().length === 0 || data.content.length > 5000) {
      errors.push("Note content is required and cannot exceed 5000 characters");
    }
  }

  return errors;
};
