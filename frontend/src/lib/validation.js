import { z } from "zod";
import { LEAD_STAGES, LEAD_PRIORITIES, LEAD_SOURCES, TASK_STATUSES, TASK_PRIORITIES } from "./constants";

/**
 * Centralized Validation Rules & Edge Case Handlers for Forms
 */

// Name Regex: Only allows uppercase/lowercase letters, spaces, hyphens, and apostrophes (2-50 chars).
export const NAME_REGEX = /^[a-zA-Z\s'-]{2,50}$/;

// Phone Regex: Allows optional leading +, digits, spaces, hyphens, and parentheses
export const PHONE_REGEX = /^\+?[0-9\s\-().]{10,20}$/;

// Email Regex for standard validation
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Sanitizes name input in real-time by stripping non-allowed characters */
export const sanitizeNameInput = (value = "") => {
  return value.replace(/[^a-zA-Z\s'-]/g, "").slice(0, 50);
};

/** Sanitizes phone input in real-time by allowing only digits, +, -, (, ), ., and spaces */
export const sanitizePhoneInput = (value = "") => {
  return value.replace(/[^0-9+\s\-().]/g, "").slice(0, 20);
};

/** Common phone validation rule (10 to 15 digits) */
export const phoneValidation = z
  .string()
  .optional()
  .refine(
    (val) => {
      if (!val || val.trim() === "") return true;
      const digits = val.replace(/\D/g, "");
      return digits.length >= 10 && digits.length <= 15 && PHONE_REGEX.test(val);
    },
    {
      message: "Please enter a valid phone number (10–15 digits, e.g. +1 (555) 234-5678)",
    }
  );

/** Common email validation rule (optional or valid format up to 100 chars) */
export const emailValidation = z
  .string()
  .optional()
  .refine(
    (val) => {
      if (!val || val.trim() === "") return true;
      const trimmed = val.trim();
      return EMAIL_REGEX.test(trimmed) && trimmed.length <= 100;
    },
    {
      message: "Please enter a valid email address",
    }
  );

// Legacy rules for compatibility
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
    value: EMAIL_REGEX,
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

/* ── Zod Schemas for React Hook Form + zodResolver ─────────────────── */

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address")
    .max(100, "Email cannot exceed 100 characters"),
  password: z.string().min(1, "Password is required"),
});

export const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Full name is required")
    .min(2, "Name must be at least 2 characters long")
    .max(50, "Name cannot exceed 50 characters")
    .regex(
      NAME_REGEX,
      "Name can only contain letters, spaces, hyphens, and apostrophes"
    ),
  company: z.string().max(100, "Company name cannot exceed 100 characters").optional().default(""),
  email: z
    .string()
    .trim()
    .min(1, "Email address is required")
    .email("Please enter a valid email address")
    .max(100, "Email cannot exceed 100 characters"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters long")
    .max(100, "Password cannot exceed 100 characters"),
});

export const leadSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Full name is required")
    .min(2, "Name must be at least 2 characters long")
    .max(50, "Name cannot exceed 50 characters")
    .regex(
      NAME_REGEX,
      "Name can only contain letters, spaces, hyphens, and apostrophes"
    ),
  company: z.string().max(100, "Company cannot exceed 100 characters").optional().default(""),
  email: emailValidation.default(""),
  phone: phoneValidation.default(""),
  value: z.coerce
    .number({ invalid_type_error: "Deal value must be a number" })
    .min(0, "Deal value cannot be negative")
    .max(1000000000, "Deal value cannot exceed $1,000,000,000")
    .optional()
    .default(0),
  status: z.enum(LEAD_STAGES).default("New"),
  priority: z.enum(LEAD_PRIORITIES).default("Medium"),
  source: z.enum(LEAD_SOURCES).default("Website"),
  notes: z.string().max(2000, "Notes cannot exceed 2000 characters").optional().default(""),
  tags: z.array(z.string().max(30, "Tag cannot exceed 30 characters")).optional().default([]),
  additionalContacts: z
    .array(
      z.object({
        name: z.string().max(50, "Name cannot exceed 50 characters").optional().default(""),
        email: emailValidation.default(""),
        role: z.string().max(50, "Role cannot exceed 50 characters").optional().default(""),
      })
    )
    .optional()
    .default([]),
});

export const taskSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required")
    .min(2, "Title must be at least 2 characters long")
    .max(100, "Title cannot exceed 100 characters"),
  description: z.string().max(1000, "Description cannot exceed 1000 characters").optional().default(""),
  dueDate: z.string().optional().default(""),
  status: z.enum(TASK_STATUSES).default("Pending"),
  priority: z.enum(TASK_PRIORITIES).default("Medium"),
  relatedLead: z.string().optional().default(""),
});

export const noteSchema = z.object({
  content: z
    .string()
    .trim()
    .min(1, "Note content is required.")
    .max(5000, "Note cannot exceed 5000 characters"),
  lead: z.string().optional().default(""),
  pinned: z.boolean().optional().default(false),
});

export const profileSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .min(2, "Name must be at least 2 characters long")
    .max(50, "Name cannot exceed 50 characters")
    .regex(
      NAME_REGEX,
      "Name can only contain letters, spaces, hyphens, and apostrophes"
    ),
  company: z.string().max(100, "Company cannot exceed 100 characters").optional().default(""),
  avatar: z.string().max(5000000, "Avatar data too large").optional().default(""),
});

export const passwordSchema = z
  .object({
    password: z
      .string()
      .min(6, "Password must be at least 6 characters long")
      .max(100, "Password cannot exceed 100 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .min(2, "Name must be at least 2 characters long")
    .max(50, "Name cannot exceed 50 characters")
    .regex(
      NAME_REGEX,
      "Name can only contain letters, spaces, hyphens, and apostrophes"
    ),
  email: emailValidation.default(""),
  phone: phoneValidation.default(""),
  company: z.string().max(100, "Company cannot exceed 100 characters").optional().default(""),
  title: z.string().max(100, "Job title cannot exceed 100 characters").optional().default(""),
  role: z.string().max(100, "Role cannot exceed 100 characters").optional().default(""),
  tags: z.array(z.string().max(30, "Tag cannot exceed 30 characters")).optional().default([]),
});
