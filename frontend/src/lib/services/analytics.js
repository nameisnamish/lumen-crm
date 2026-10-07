import api from "../api";
import { USE_MOCK } from "./config";
import { leads, contacts, tasks, reply } from "./mockStore";

export const analyticsApi = {
  overview: (params) => {
    if (!USE_MOCK) return api.get("/analytics/overview", { params });
    return reply(buildOverview(params));
  },
};

export function buildOverview(params = {}) {
  const { range = "6m" } = params;
  const stages = ["New", "Qualified", "Proposal", "Won", "Lost"];
  const isAll = range === "all";
  const rangeMonths = { "1m": 1, "3m": 3, "6m": 6, "12m": 12 }[range] || 6;
  const rangeDays = rangeMonths * 30;
  const cutoffTime = Date.now() - rangeDays * 86400000;

  // Filter leads within the selected date window
  const filteredLeads = isAll
    ? leads
    : leads.filter((l) => {
        if (!l.createdAt) return true;
        return new Date(l.createdAt).getTime() >= cutoffTime;
      });

  // If filtered is empty for short windows, fallback to a subset so UI always looks vibrant
  const activeLeads =
    filteredLeads.length > 0
      ? filteredLeads
      : leads.slice(0, Math.max(3, Math.floor(leads.length * (rangeMonths / 12))));

  const byStage = Object.fromEntries(stages.map((s) => [s, { count: 0, value: 0 }]));
  let totalValue = 0;
  let wonValue = 0;

  for (const l of activeLeads) {
    const b = byStage[l.status] || (byStage[l.status] = { count: 0, value: 0 });
    b.count += 1;
    b.value += l.value || 0;
    totalValue += l.value || 0;
    if (l.status === "Won") wonValue += l.value || 0;
  }
  const won = byStage.Won.count;
  const lost = byStage.Lost.count;
  const closed = won + lost;
  const conversionRate = closed ? Math.round((won / closed) * 100) : 0;

  // Adaptive Cadence based on global date range:
  const labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const now = new Date();
  let trend;

  if (isAll) {
    const currentYear = now.getFullYear();
    const years = [currentYear - 2, currentYear - 1, currentYear];
    trend = years.map((yr, idx) => {
      const multiplier = idx === 0 ? 0.6 : idx === 1 ? 0.85 : 1.25;
      return {
        month: `${yr}`,
        leads: Math.round(leads.length * multiplier * 2),
        won: Math.round((wonValue || 120000) * multiplier * 1.8),
      };
    });
  } else if (range === "1m") {
    trend = [
      { month: "Week 1", leads: 0, won: 0 },
      { month: "Week 2", leads: 0, won: 0 },
      { month: "Week 3", leads: 0, won: 0 },
      { month: "Week 4", leads: 0, won: 0 },
    ];
    for (const l of activeLeads) {
      const created = new Date(l.createdAt || Date.now());
      const diffDays = Math.floor((now - created) / (1000 * 60 * 60 * 24));
      const weekIdx = Math.min(3, Math.max(0, 3 - Math.floor(diffDays / 7)));
      trend[weekIdx].leads += 1;
      if (l.status === "Won") trend[weekIdx].won += l.value || 0;
    }
    trend = trend.map((t, i) => ({
      ...t,
      leads: Math.max(t.leads, (i + 1) * 2 + 1),
      won: Math.max(t.won, (i + 1) * 14000),
    }));
  } else if (range === "12m") {
    trend = [
      { month: "Q1", leads: 0, won: 0 },
      { month: "Q2", leads: 0, won: 0 },
      { month: "Q3", leads: 0, won: 0 },
      { month: "Q4", leads: 0, won: 0 },
    ];
    for (const l of activeLeads) {
      const created = new Date(l.createdAt || Date.now());
      const quarterIdx = Math.min(3, Math.floor(created.getMonth() / 3));
      trend[quarterIdx].leads += 1;
      if (l.status === "Won") trend[quarterIdx].won += l.value || 0;
    }
    trend = trend.map((t, i) => ({
      ...t,
      leads: Math.max(t.leads, (i + 1) * 4 + 2),
      won: Math.max(t.won, (i + 1) * 35000 + 15000),
    }));
  } else {
    const months = [];
    for (let i = rangeMonths - 1; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push({ key: `${d.getFullYear()}-${d.getMonth()}`, label: labels[d.getMonth()] });
    }
    const idx = Object.fromEntries(months.map((m, i) => [m.key, i]));
    trend = months.map((m) => ({ month: m.label, leads: 0, won: 0 }));

    for (const l of activeLeads) {
      const d = new Date(l.createdAt);
      const key = `${d.getFullYear()}-${d.getMonth()}`;
      if (idx[key] !== undefined) {
        trend[idx[key]].leads += 1;
        if (l.status === "Won") trend[idx[key]].won += l.value || 0;
      }
    }
    trend = trend.map((t, i) => ({
      ...t,
      leads: Math.max(t.leads, (i + 1) * 2 + 1),
      won: Math.max(t.won, (i + 1) * 16000),
    }));
  }

  const recentLeads = [...activeLeads]
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    .slice(0, 6)
    .map((l) => ({
      id: l._id,
      name: l.name,
      company: l.company,
      status: l.status,
      value: l.value,
      updatedAt: l.updatedAt,
    }));

  return {
    success: true,
    stats: {
      revenueWon: wonValue,
      pipelineValue: totalValue,
      totalLeads: activeLeads.length,
      totalContacts: contacts.length,
      openTasks: tasks.filter((t) => t.status !== "Completed").length,
      conversionRate,
    },
    pipeline: stages.map((s) => ({ stage: s, count: byStage[s].count, value: byStage[s].value })),
    trend,
    recentLeads,
    filteredLeads: activeLeads,
  };
}
