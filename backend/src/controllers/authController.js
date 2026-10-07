import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { users } from "../data/store.js";
import { isValidEmail, isValidName } from "../middleware/validate.js";

const generateToken = (userId) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("FATAL ERROR: JWT_SECRET environment variable is missing.");
  }
  return jwt.sign({ id: userId }, secret, { expiresIn: "7d" });
};

const defaultAvatar = (name) =>
  `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0284c7&color=fff&bold=true`;

const sanitizeUser = (user) => {
  if (!user) return null;
  const { password, passwordHash, ...safeUser } = user;
  return safeUser;
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ success: false, message: "Email and password are required" });
  }

  // Find user by email (case-insensitive)
  const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (!user || !user.passwordHash) {
    return res.status(401).json({ success: false, message: "Invalid email or password" });
  }

  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) {
    return res.status(401).json({ success: false, message: "Invalid email or password" });
  }

  const token = generateToken(user.id);
  res.json({
    success: true,
    token,
    user: sanitizeUser(user),
  });
};

export const register = async (req, res) => {
  const { email, password, name, company } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Email and password are required",
    });
  }

  if (!isValidEmail(email)) {
    return res.status(400).json({
      success: false,
      message: "Please enter a valid email address (max 100 characters)",
    });
  }

  if (password.length < 6 || password.length > 100) {
    return res.status(400).json({
      success: false,
      message: "Password must be between 6 and 100 characters long",
    });
  }

  if (name && !isValidName(name)) {
    return res.status(400).json({
      success: false,
      message: "Name can only contain letters, spaces, hyphens, and apostrophes (min 2, max 50 characters)",
    });
  }

  if (company && typeof company === "string" && company.length > 100) {
    return res.status(400).json({
      success: false,
      message: "Company name cannot exceed 100 characters",
    });
  }

  const existing = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    return res.status(400).json({
      success: false,
      message: "An account with this email already exists",
    });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = {
    id: "usr_" + Math.random().toString(36).slice(2, 9),
    name: name || "New User",
    email: email.toLowerCase(),
    company: company || "Lumen CRM Workspace",
    role: "Sales Lead",
    avatar: defaultAvatar(name || "New User"),
    passwordHash,
  };
  users.push(user);

  const token = generateToken(user.id);
  res.status(201).json({
    success: true,
    token,
    user: sanitizeUser(user),
  });
};

export const getMe = async (req, res) => {
  const user = users.find((u) => u.id === req.user?.id);
  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }
  res.json({
    success: true,
    user: sanitizeUser(user),
  });
};

export const updateProfile = async (req, res) => {
  const user = users.find((u) => u.id === req.user?.id);
  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  const { name, company, avatar, password } = req.body;
  if (name !== undefined) {
    if (!isValidName(name)) {
      return res.status(400).json({
        success: false,
        message: "Name must be 2–50 characters and contain only letters, spaces, hyphens, and apostrophes",
      });
    }
    user.name = name.trim();
  }

  if (company !== undefined) {
    if (typeof company === "string" && company.length > 100) {
      return res.status(400).json({
        success: false,
        message: "Company name cannot exceed 100 characters",
      });
    }
    user.company = company.trim();
  }

  if (avatar !== undefined) user.avatar = avatar;

  if (password) {
    if (password.length < 6 || password.length > 100) {
      return res.status(400).json({
        success: false,
        message: "Password must be between 6 and 100 characters long",
      });
    }
    user.passwordHash = await bcrypt.hash(password, 10);
  }

  res.json({
    success: true,
    user: sanitizeUser(user),
  });
};
