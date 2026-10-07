import api from "../api";
import { mockUser } from "../mockData";
import { USE_MOCK } from "./config";
import {
  mockUsers,
  getStoredProfile,
  saveProfile,
  defaultAvatar,
  reply,
} from "./mockStore";

export const authApi = {
  login: (data) => {
    if (!USE_MOCK) return api.post("/auth/login", data);
    const email = (data?.email || "").toLowerCase().trim();
    const password = data?.password || "";
    const stored = getStoredProfile();

    const userMatch =
      mockUsers.find((u) => u.email.toLowerCase() === email) ||
      (stored && stored.email?.toLowerCase() === email ? stored : null);

    if (!userMatch || (userMatch.password && userMatch.password !== password)) {
      return Promise.reject({ status: 401, message: "Invalid email or password" });
    }

    const user = { ...userMatch };
    delete user.password;
    saveProfile(user);
    return reply({ success: true, token: "mock-token", user });
  },

  register: (data) => {
    if (!USE_MOCK) return api.post("/auth/register", data);
    const email = (data?.email || "").toLowerCase().trim();
    if (mockUsers.some((u) => u.email.toLowerCase() === email)) {
      return Promise.reject({ status: 400, message: "An account with this email already exists" });
    }
    const user = {
      id: "usr_" + Math.random().toString(36).slice(2, 9),
      name: data.name || "New User",
      email: email,
      password: data.password || "",
      company: data.company || "Lumen CRM Systems",
      role: "Sales Lead",
      avatar: defaultAvatar(data.name || "New User"),
    };
    mockUsers.push(user);
    const safeUser = { ...user };
    delete safeUser.password;
    saveProfile(safeUser);
    return reply({ success: true, token: "mock-token", user: safeUser });
  },

  me: () => {
    if (!USE_MOCK) return api.get("/auth/me");
    const stored = getStoredProfile() || mockUser;
    return reply({ success: true, user: stored });
  },

  updateProfile: (data) => {
    if (!USE_MOCK) return api.put("/auth/profile", data);
    const current = getStoredProfile() || mockUser;
    const next = { ...current, ...data };
    saveProfile(next);
    return reply({ success: true, user: next });
  },
};
