import jwt from "jsonwebtoken";
import { users } from "../data/store.js";

const generateToken = (userId) => {
  const secret = process.env.JWT_SECRET || "ai_crm_dashboard_super_secret_jwt_key_2026";
  return jwt.sign({ id: userId }, secret, { expiresIn: "7d" });
};

const defaultAvatar = (name) =>
  `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0284c7&color=fff&bold=true`;

export const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ success: false, message: "Email and password are required" });
  }

  // Find existing user or dynamically create session for entered email
  let user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (!user) {
    const derivedName = email.split("@")[0].replace(/[._]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
    user = {
      id: "usr_" + Math.random().toString(36).slice(2, 9),
      name: derivedName || "Sales User",
      email: email,
      company: "Lumen CRM Workspace",
      role: "Sales Executive",
      avatar: defaultAvatar(derivedName || "Sales User"),
    };
    users.push(user);
  }

  const token = generateToken(user.id);
  res.json({
    success: true,
    token,
    user,
  });
};

export const register = async (req, res) => {
  const { email, password, name, company } = req.body;
  
  if (name && !/^[a-zA-Z\s'-]{2,50}$/.test(name)) {
    return res.status(400).json({
      success: false,
      message: "Validation Error: Name can only contain letters, spaces, hyphens, and apostrophes (min 2 characters)"
    });
  }

  const existing = users.find((u) => u.email.toLowerCase() === email?.toLowerCase());
  let user;
  if (existing) {
    existing.name = name || existing.name;
    existing.company = company || existing.company;
    user = existing;
  } else {
    user = {
      id: "usr_" + Math.random().toString(36).slice(2, 9),
      name: name || "New User",
      email: email || "user@company.com",
      company: company || "Lumen Workspace",
      role: "Sales Lead",
      avatar: defaultAvatar(name || "New User"),
    };
    users.push(user);
  }

  const token = generateToken(user.id);
  res.status(201).json({
    success: true,
    token,
    user,
  });
};

export const getMe = async (req, res) => {
  const user = users.find((u) => u.id === req.user?.id) || users[0];
  res.json({
    success: true,
    user,
  });
};

export const updateProfile = async (req, res) => {
  const user = users.find((u) => u.id === req.user?.id) || users[0];
  Object.assign(user, req.body);
  res.json({
    success: true,
    user,
  });
};
