import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./src/routes/authRoutes.js";
import leadsRoutes from "./src/routes/leadsRoutes.js";
import contactsRoutes from "./src/routes/contactsRoutes.js";
import notesRoutes from "./src/routes/notesRoutes.js";
import tasksRoutes from "./src/routes/tasksRoutes.js";
import aiRoutes from "./src/routes/aiRoutes.js";
import analyticsRoutes from "./src/routes/analyticsRoutes.js";
import searchRoutes from "./src/routes/searchRoutes.js";
import notificationsRoutes from "./src/routes/notificationsRoutes.js";
import { errorHandler } from "./src/middleware/errorHandler.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/leads", leadsRoutes);
app.use("/api/contacts", contactsRoutes);
app.use("/api/notes", notesRoutes);
app.use("/api/tasks", tasksRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/notifications", notificationsRoutes);

// Root & API Info Endpoints
app.get(["/", "/api"], (req, res) => {
  res.json({
    status: "OK",
    message: "🚀 AI CRM Dashboard Express REST API is running live!",
    endpoints: {
      health: "/api/health",
      auth: "/api/auth (login, register, me, profile)",
      leads: "/api/leads",
      contacts: "/api/contacts",
      notes: "/api/notes",
      tasks: "/api/tasks",
      ai: "/api/ai (status, lead-summary, generate-email, sales-insights)",
      analytics: "/api/analytics/overview",
      search: "/api/search?q=query",
      notifications: "/api/notifications"
    }
  });
});

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", server: "AI CRM Dashboard Express API", port: PORT });
});

// Central Error Middleware
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 AI CRM Backend Server running live on http://localhost:${PORT}/api`);
});
