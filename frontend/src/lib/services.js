/* ─────────────────────────────────────────────────────────────────────────
   API service layer — UI-ONLY BOILERPLATE (mock mode).

   Every method currently resolves MOCK data from lib/mockData.js so the whole
   app runs without a backend. The real axios calls are kept commented right
   above each mock so that, once your backend is live, you:

     1. Enable the axios client in lib/api.js (uncomment it there).
     2. Uncomment the `import api` line below.
     3. In each method, swap the mock line for the commented real line.

   The shapes returned here match the real API exactly, so no page/component
   needs to change.
   ───────────────────────────────────────────────────────────────────────── */

import api from "./api";
import {
  mockUser,
  makeLeads,
  makeContacts,
  makeNotes,
  makeTasks,
  makeNotifications,
  mockAiStatus,
  mockAiSummary,
  mockAiEmail,
  mockAiInsights,
} from "./mockData";

export const USE_MOCK = import.meta.env.VITE_USE_MOCK !== "false";


/* In-memory stores so create / edit / delete feel real during the UI phase.
   They reset on page refresh — that's expected for a mock. */
let leads = makeLeads();
let contacts = makeContacts();
let notes = makeNotes();
let tasks = makeTasks();
let notificationsList = makeNotifications();

const uid = () => "id_" + Math.random().toString(36).slice(2, 10);
const clone = (d) => JSON.parse(JSON.stringify(d));
// Resolve like a network call would: a short delay + a fresh copy of the data.
const reply = (data, ms = 250) =>
  new Promise((resolve) => setTimeout(() => resolve(clone(data)), ms));

const leadLite = (id) => {
  const l = leads.find((x) => x._id === id);
  return l ? { _id: l._id, name: l.name, company: l.company } : null;
};

const getStoredProfile = () => {
  try {
    const s = localStorage.getItem("lumen_crm_user_profile");
    return s ? JSON.parse(s) : null;
  } catch {
    return null;
  }
};

const saveProfile = (user) => {
  try {
    localStorage.setItem("lumen_crm_user_profile", JSON.stringify(user));
  } catch {
    // ignore storage errors
  }
};

const defaultAvatar = (name) =>
  `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0284c7&color=fff&bold=true`;

/* ── Auth ───────────────────────────────────────────────────────────── */
export const authApi = {
  login: (data) => {
    if (!USE_MOCK) return api.post("/auth/login", data);
    const stored = getStoredProfile();
    const email = data?.email || "user@company.com";
    const derivedName = email.split("@")[0].replace(/[._]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
    
    const user = stored && stored.email === email ? stored : {
      id: "usr_" + Math.random().toString(36).slice(2, 9),
      name: derivedName || "Sales User",
      email: email,
      company: "Lumen CRM Workspace",
      role: "Sales Executive",
      avatar: defaultAvatar(derivedName || "Sales User"),
    };

    saveProfile(user);
    return reply({ success: true, token: "mock-token", user });
  },

  register: (data) => {
    if (!USE_MOCK) return api.post("/auth/register", data);
    const user = {
      id: "usr_" + Math.random().toString(36).slice(2, 9),
      name: data.name || "New User",
      email: data.email || "you@company.com",
      company: data.company || "Lumen Workspace",
      role: "Sales Lead",
      avatar: defaultAvatar(data.name || "New User"),
    };
    saveProfile(user);
    return reply({ success: true, token: "mock-token", user });
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

/* ── Leads ──────────────────────────────────────────────────────────── */
export const leadsApi = {
  list: (params) => {
    if (!USE_MOCK) return api.get("/leads", { params });
    return reply({ success: true, count: leads.length, leads });
  },

  get: (id) => {
    if (!USE_MOCK) return api.get(`/leads/${id}`);
    return reply({ success: true, lead: leads.find((l) => l._id === id) });
  },

  create: (data) => {
    if (!USE_MOCK) return api.post("/leads", data);
    const lead = {
      _id: uid(),
      order: 0,
      tags: [],
      aiSummary: "",
      aiRiskScore: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...data,
    };
    leads = [lead, ...leads];
    return reply({ success: true, lead });
  },

  update: (id, data) => {
    if (!USE_MOCK) return api.put(`/leads/${id}`, data);
    leads = leads.map((l) =>
      l._id === id ? { ...l, ...data, updatedAt: new Date().toISOString() } : l
    );
    return reply({ success: true, lead: leads.find((l) => l._id === id) });
  },

  remove: (id) => {
    if (!USE_MOCK) return api.delete(`/leads/${id}`);
    leads = leads.filter((l) => l._id !== id);
    return reply({ success: true, message: "Lead deleted" });
  },

  reorder: (updates) => {
    if (!USE_MOCK) return api.patch("/leads/reorder", { updates });
    updates.forEach((u) => {
      leads = leads.map((l) =>
        l._id === u.id ? { ...l, status: u.status, order: u.order } : l
      );
    });
    return reply({ success: true, message: "Pipeline updated" });
  },
};

/* ── Contacts ───────────────────────────────────────────────────────── */
export const contactsApi = {
  list: (params) => {
    if (!USE_MOCK) return api.get("/contacts", { params });
    return reply({ success: true, count: contacts.length, contacts });
  },

  get: (id) => {
    if (!USE_MOCK) return api.get(`/contacts/${id}`);
    return reply({ success: true, contact: contacts.find((c) => c._id === id) });
  },

  create: (data) => {
    if (!USE_MOCK) return api.post("/contacts", data);
    const contact = {
      _id: uid(),
      tags: [],
      favorite: false,
      createdAt: new Date().toISOString(),
      ...data,
    };
    contacts = [contact, ...contacts];
    return reply({ success: true, contact });
  },

  update: (id, data) => {
    if (!USE_MOCK) return api.put(`/contacts/${id}`, data);
    contacts = contacts.map((c) => (c._id === id ? { ...c, ...data } : c));
    return reply({ success: true, contact: contacts.find((c) => c._id === id) });
  },

  remove: (id) => {
    if (!USE_MOCK) return api.delete(`/contacts/${id}`);
    contacts = contacts.filter((c) => c._id !== id);
    return reply({ success: true, message: "Contact deleted" });
  },
};

/* ── Notes ──────────────────────────────────────────────────────────── */
export const notesApi = {
  list: (params) => {
    if (!USE_MOCK) return api.get("/notes", { params });
    const sorted = [...notes].sort(
      (a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0)
    );
    return reply({ success: true, count: sorted.length, notes: sorted });
  },

  create: (data) => {
    if (!USE_MOCK) return api.post("/notes", data);
    const note = {
      _id: uid(),
      content: data.content,
      lead: data.lead ? leadLite(data.lead) : null,
      contact: null,
      pinned: Boolean(data.pinned),
      createdAt: new Date().toISOString(),
    };
    notes = [note, ...notes];
    return reply({ success: true, note });
  },

  update: (id, data) => {
    if (!USE_MOCK) return api.put(`/notes/${id}`, data);
    notes = notes.map((n) => {
      if (n._id !== id) return n;
      const next = { ...n, ...data };
      if ("lead" in data) next.lead = data.lead ? leadLite(data.lead) : null;
      return next;
    });
    return reply({ success: true, note: notes.find((n) => n._id === id) });
  },

  remove: (id) => {
    if (!USE_MOCK) return api.delete(`/notes/${id}`);
    notes = notes.filter((n) => n._id !== id);
    return reply({ success: true, message: "Note deleted" });
  },
};

/* ── Tasks ──────────────────────────────────────────────────────────── */
export const tasksApi = {
  list: (params) => {
    if (!USE_MOCK) return api.get("/tasks", { params });
    return reply({ success: true, count: tasks.length, tasks });
  },

  create: (data) => {
    if (!USE_MOCK) return api.post("/tasks", data);
    const task = {
      _id: uid(),
      description: "",
      relatedContact: null,
      createdAt: new Date().toISOString(),
      ...data,
      relatedLead: data.relatedLead ? leadLite(data.relatedLead) : null,
      completedAt: data.status === "Completed" ? new Date().toISOString() : null,
    };
    tasks = [task, ...tasks];
    return reply({ success: true, task });
  },

  update: (id, data) => {
    if (!USE_MOCK) return api.put(`/tasks/${id}`, data);
    tasks = tasks.map((t) => {
      if (t._id !== id) return t;
      const next = { ...t, ...data };
      if ("relatedLead" in data)
        next.relatedLead = data.relatedLead ? leadLite(data.relatedLead) : null;
      if (data.status === "Completed" && !next.completedAt)
        next.completedAt = new Date().toISOString();
      if (data.status && data.status !== "Completed") next.completedAt = null;
      return next;
    });
    return reply({ success: true, task: tasks.find((t) => t._id === id) });
  },

  remove: (id) => {
    if (!USE_MOCK) return api.delete(`/tasks/${id}`);
    tasks = tasks.filter((t) => t._id !== id);
    return reply({ success: true, message: "Task deleted" });
  },
};

/* ── Notifications ─────────────────────────────────────────────────── */
export const notificationsApi = {
  list: () => {
    if (!USE_MOCK) return api.get("/notifications");
    const unreadCount = notificationsList.filter((n) => !n.read).length;
    return reply({
      success: true,
      count: notificationsList.length,
      unreadCount,
      notifications: notificationsList,
    });
  },

  markAsRead: (id) => {
    if (!USE_MOCK) return api.patch(`/notifications/${id}/read`);
    if (id === "all") {
      notificationsList.forEach((n) => (n.read = true));
    } else {
      const item = notificationsList.find((n) => n._id === id);
      if (item) item.read = true;
    }
    const unreadCount = notificationsList.filter((n) => !n.read).length;
    return reply({
      success: true,
      unreadCount,
      notifications: notificationsList,
    });
  },
};

/* ── Global Search ──────────────────────────────────────────────────── */
export const searchApi = {
  query: (q) => {
    if (!USE_MOCK) return api.get("/search", { params: { q } });
    const term = (q || "").trim().toLowerCase();
    if (!term)
      return reply({
        success: true,
        results: { leads: [], contacts: [], tasks: [], notes: [] },
      });

    const matchedLeads = leads
      .filter(
        (l) =>
          l.name?.toLowerCase().includes(term) ||
          l.company?.toLowerCase().includes(term) ||
          l.email?.toLowerCase().includes(term)
      )
      .slice(0, 4);

    const matchedContacts = contacts
      .filter(
        (c) =>
          c.name?.toLowerCase().includes(term) ||
          c.company?.toLowerCase().includes(term) ||
          c.email?.toLowerCase().includes(term)
      )
      .slice(0, 4);

    const matchedTasks = tasks
      .filter(
        (t) =>
          t.title?.toLowerCase().includes(term) ||
          t.description?.toLowerCase().includes(term)
      )
      .slice(0, 4);

    const matchedNotes = notes
      .filter((n) => n.content?.toLowerCase().includes(term))
      .slice(0, 4);

    return reply({
      success: true,
      results: {
        leads: matchedLeads,
        contacts: matchedContacts,
        tasks: matchedTasks,
        notes: matchedNotes,
      },
    });
  },
};

/* ── AI (canned mock responses or real backend call) ─────────────────── */
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
    return reply({
      success: true,
      message: `[AI Copilot] Analysis for prompt "${data?.prompt || ''}": Lead pipeline health is strong. Recommend following up with key leads.`,
    }, 800);
  },
};

/* ── Analytics ─────────────────────────────────────────────────────── */
export const analyticsApi = {
  overview: (params) => {
    if (!USE_MOCK) return api.get("/analytics/overview", { params });
    return reply(buildOverview(params));
  },
};

function buildOverview(params = {}) {
  const { range = "6m", interval = "monthly" } = params;
  const stages = ["New", "Qualified", "Proposal", "Won", "Lost"];
  const rangeMonths = { "1m": 1, "3m": 3, "6m": 6, "12m": 12 }[range] || 6;
  const rangeDays = rangeMonths * 30;
  const cutoffTime = Date.now() - rangeDays * 86400000;

  // Filter leads within the selected date window
  const filteredLeads = leads.filter((l) => {
    if (!l.createdAt) return true;
    return new Date(l.createdAt).getTime() >= cutoffTime;
  });

  // If filtered is empty for short windows, fallback to a subset so UI always looks vibrant
  const activeLeads = filteredLeads.length > 0 
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
  // 1m -> Weekly (Week 1, Week 2, Week 3, Week 4)
  // 3m -> 3 Months
  // 6m -> 6 Months
  // 12m -> Quarterly (Q1, Q2, Q3, Q4)
  const labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const now = new Date();
  let trend = [];
  let cadenceLabel = "Monthly";

  if (range === "1m") {
    cadenceLabel = "Weekly";
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
    cadenceLabel = "Quarterly";
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
    cadenceLabel = "Monthly";
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
