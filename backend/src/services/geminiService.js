export const generateLeadSummaryService = async (leadData) => {
  const { name = "Lead", company = "Company", budget = 50000, status = "Qualified" } = leadData;
  return {
    success: true,
    summary: `${name} from ${company} is evaluating AI CRM solutions with a $${budget.toLocaleString()} budget. High likelihood of conversion in the ${status} stage.`,
    riskScore: Math.floor(Math.random() * 30) + 15,
    priority: "High",
    nextAction: `Schedule technical architecture review call with ${name} before contract finalization.`,
  };
};

export const generateEmailService = async ({ leadName = "Valued Lead", company = "Company", purpose = "Introduction", tone = "Professional" }) => {
  return {
    success: true,
    subject: `Transforming ${company}'s Sales Pipeline with Quixotic AI CRM`,
    body: `Hi ${leadName},\n\nI hope this email finds you well. Given your leadership at ${company}, I wanted to reach out regarding our AI-driven CRM platform designed to streamline lead scoring, sales forecasting, and outreach automation.\n\nWould you have 15 minutes this week for a brief demo?\n\nBest regards,\nAlex Morgan\nQuixotic CRM Team`,
  };
};

export const generateSalesInsightsService = async () => {
  return {
    success: true,
    healthScore: 88,
    observations: [
      "Pipeline deal velocity increased by 24% month-over-month.",
      "Conversion rate in the 'Qualified' to 'Proposal' transition is at an all-time high of 78%.",
      "Average enterprise deal cycle shortened by 6 days.",
    ],
    recommendations: [
      "Focus sales outreach on High-Priority leads in the Proposal stage to close Q4 targets.",
      "Assign additional follow-up tasks to unassigned inbound leads.",
    ],
  };
};
