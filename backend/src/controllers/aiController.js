import { generateLeadSummaryService, generateEmailService, generateSalesInsightsService } from "../services/geminiService.js";

export const getAiStatus = async (req, res) => {
  res.json({
    success: true,
    status: "active",
    model: "gemini-2.5-flash-structured",
    message: "Google Gemini AI Integration Ready",
  });
};

export const getLeadSummary = async (req, res) => {
  const result = await generateLeadSummaryService(req.body);
  res.json(result);
};

export const generateEmail = async (req, res) => {
  const result = await generateEmailService(req.body);
  res.json(result);
};

export const getSalesInsights = async (req, res) => {
  const result = await generateSalesInsightsService();
  res.json(result);
};
