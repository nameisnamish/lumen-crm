import { z } from "zod";

/**
 * Centralized Validation Rules & Edge Case Handlers for Forms
 */

// Name Regex: Only allows uppercase/lowercase letters, spaces, hyphens, and apostrophes.
export const NAME_REGEX = /^[a-zA-Z\s'-]{2,50}$/;

/** Sanitizes name input in real-time by stripping non-allowed characters */
export const sanitizeNameInput = (value = "") => {
  return value.replace(/[^a-zA-Z\s'-]/g, "");
};

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

/* ── Zod Schemas for React Hook Form + zodResolver ─────────────────── */

export const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

export const registerSchema = z.object({
  name: z
    .string()
    .min(1, "Full name is required")
    .min(2, "Name must be at least 2 characters long")
    .max(50, "Name cannot exceed 50 characters")
    .regex(
      NAME_REGEX,
      "Name can only contain letters, spaces, hyphens, and apostrophes (min 2 characters)"
    ),
  company: z.string().optional().default(""),
  email: z.string().min(1, "Email address is required").email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

export const leadSchema = z.object({
  name: z
    .string()
    .min(1, "Full name is required")
    .min(2, "Name must be at least 2 characters long")
    .max(50, "Name cannot exceed 50 characters")
    .regex(
      NAME_REGEX,
      "Name can only contain letters, spaces, hyphens, and apostrophes (min 2 characters)"
    ),
  company: z.string().optional().default(""),
  email: z
    .string()
    .optional()
    .refine((val) => !val || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val), {
      message: "Please enter a valid email address",
    }),
  phone: z.string().optional().default(""),
  value: z.union([z.number(), z.string()]).optional().default(0),
  status: z.string().default("New"),
  priority: z.string().default("Medium"),
  source: z.string().default("Website"),
  notes: z.string().optional().default(""),
  tags: z.array(z.string()).optional().default([]),
  additionalContacts: z
    .array(
      z.object({
        name: z.string().optional().default(""),
        email: z.string().optional().default(""),
        role: z.string().optional().default(""),
      })
    )
    .optional()
    .default([]),
});

export const taskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional().default(""),
  dueDate: z.string().optional().default(""),
  status: z.string().default("Pending"),
  priority: z.string().default("Medium"),
  relatedLead: z.string().optional().default(""),
});

export const noteSchema = z.object({
  content: z.string().min(1, "Note content is required."),
  lead: z.string().optional().default(""),
  pinned: z.boolean().optional().default(false),
});

export const profileSchema = z.object({
  name: z.string().min(1, "Name is required"),
  company: z.string().optional().default(""),
  avatar: z.string().optional().default(""),
});

export const passwordSchema = z
  .object({
    password: z
      .string()
      .min(1, "Password is required")
      .min(6, "Must be at least 6 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const contactSchema = z.object({
  name: z.string().min(1, "Name is required").min(2, "Name must be at least 2 characters long"),
  email: z
    .string()
    .optional()
    .refine((val) => !val || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val), {
      message: "Please enter a valid email address",
    }),
  phone: z.string().optional().default(""),
  company: z.string().optional().default(""),
  title: z.string().optional().default(""),
  role: z.string().optional().default(""),
  tags: z.array(z.string()).optional().default([]),
});
