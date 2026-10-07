import api from "../api";
import { USE_MOCK } from "./config";
import { leads, setLeads, uid, reply } from "./mockStore";

export const leadsApi = {
  list: (params) => {
    if (!USE_MOCK) return api.get("/leads", { params });
    return reply({ success: true, count: leads.length, leads });
  },

  checkEmail: (email) => {
    if (!USE_MOCK) return api.get("/leads/check-email", { params: { email } });
    const term = (email || "").trim().toLowerCase();
    const exists = leads.some((l) => l.email && l.email.toLowerCase() === term);
    return reply({ success: true, exists });
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
    setLeads([lead, ...leads]);
    return reply({ success: true, lead });
  },

  update: (id, data) => {
    if (!USE_MOCK) return api.put(`/leads/${id}`, data);
    const updatedLeads = leads.map((l) =>
      l._id === id ? { ...l, ...data, updatedAt: new Date().toISOString() } : l
    );
    setLeads(updatedLeads);
    return reply({ success: true, lead: updatedLeads.find((l) => l._id === id) });
  },

  remove: (id) => {
    if (!USE_MOCK) return api.delete(`/leads/${id}`);
    setLeads(leads.filter((l) => l._id !== id));
    return reply({ success: true, message: "Lead deleted" });
  },

  reorder: (updates) => {
    if (!USE_MOCK) return api.patch("/leads/reorder", { updates });
    let updatedLeads = [...leads];
    updates.forEach((u) => {
      updatedLeads = updatedLeads.map((l) =>
        l._id === u.id ? { ...l, status: u.status, order: u.order } : l
      );
    });
    setLeads(updatedLeads);
    return reply({ success: true, message: "Pipeline updated" });
  },
};
