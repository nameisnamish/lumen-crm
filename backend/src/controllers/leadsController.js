import { leads } from "../data/store.js";

const uid = () => "lead_" + Math.random().toString(36).slice(2, 9);

export const checkLeadEmail = async (req, res) => {
  const email = (req.query.email || "").trim().toLowerCase();
  if (!email) {
    return res.json({ success: true, exists: false });
  }
  const exists = leads.some((l) => l.email && l.email.toLowerCase() === email);
  res.json({ success: true, exists });
};

export const getLeads = async (req, res) => {
  res.json({ success: true, count: leads.length, leads });
};

export const getLeadById = async (req, res) => {
  const lead = leads.find((l) => l._id === req.params.id);
  if (!lead) return res.status(404).json({ success: false, message: "Lead not found" });
  res.json({ success: true, lead });
};

export const createLead = async (req, res) => {
  const newLead = {
    _id: uid(),
    order: 0,
    tags: [],
    aiSummary: "",
    aiRiskScore: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...req.body,
  };
  leads.unshift(newLead);
  res.status(201).json({ success: true, lead: newLead });
};

export const updateLead = async (req, res) => {
  const index = leads.findIndex((l) => l._id === req.params.id);
  if (index === -1) return res.status(404).json({ success: false, message: "Lead not found" });

  leads[index] = { ...leads[index], ...req.body, updatedAt: new Date().toISOString() };
  res.json({ success: true, lead: leads[index] });
};

export const deleteLead = async (req, res) => {
  const index = leads.findIndex((l) => l._id === req.params.id);
  if (index === -1) return res.status(404).json({ success: false, message: "Lead not found" });

  leads.splice(index, 1);
  res.json({ success: true, message: "Lead deleted successfully" });
};

export const reorderLeads = async (req, res) => {
  const { updates } = req.body;
  if (Array.isArray(updates)) {
    updates.forEach((u) => {
      const idx = leads.findIndex((l) => l._id === u.id);
      if (idx !== -1) {
        leads[idx].status = u.status;
        leads[idx].order = u.order;
      }
    });
  }
  res.json({ success: true, message: "Pipeline updated successfully" });
};
