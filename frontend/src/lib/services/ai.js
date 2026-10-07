import api from "../api";
import {
  mockAiStatus,
  mockAiSummary,
  mockAiEmail,
  mockAiInsights,
} from "../mockData";
import { USE_MOCK } from "./config";
import { reply } from "./mockStore";

export const aiApi = {
  status: () => {
    if (!USE_MOCK) return api.get("/ai/status");
    return reply(mockAiStatus);
  },

  leadSummary: (data) => {
    if (!USE_MOCK) return api.post("/ai/lead-summary", data);
    return reply(mockAiSummary, 800);
  },

  generateEmail: (data) => {
    if (!USE_MOCK) return api.post("/ai/generate-email", data);
    return reply(mockAiEmail, 900);
  },

  salesInsights: (data) => {
    if (!USE_MOCK) return api.post("/ai/sales-insights", data);
    return reply(mockAiInsights, 900);
  },

  chat: (data) => {
    if (!USE_MOCK) return api.post("/ai/chat", data);
    return reply(
      {
        success: true,
        message: `[AI Copilot] Analysis for prompt "${data?.prompt || ""}": Lead pipeline health is strong. Recommend following up with key leads.`,
      },
      800
    );
  },
};
