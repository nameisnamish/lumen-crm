import { leads, contacts, tasks, notes } from "../data/store.js";

export const globalSearch = async (req, res) => {
  const query = (req.query.q || "").trim().toLowerCase();
  if (!query) {
    return res.json({ success: true, results: { leads: [], contacts: [], tasks: [], notes: [] } });
  }

  const matchedLeads = leads.filter(
    (l) =>
      l.name?.toLowerCase().includes(query) ||
      l.company?.toLowerCase().includes(query) ||
      l.email?.toLowerCase().includes(query)
  ).slice(0, 5);

  const matchedContacts = contacts.filter(
    (c) =>
      c.name?.toLowerCase().includes(query) ||
      c.company?.toLowerCase().includes(query) ||
      c.email?.toLowerCase().includes(query)
  ).slice(0, 5);

  const matchedTasks = tasks.filter(
    (t) =>
      t.title?.toLowerCase().includes(query) ||
      t.description?.toLowerCase().includes(query)
  ).slice(0, 5);

  const matchedNotes = notes.filter((n) =>
    n.content?.toLowerCase().includes(query)
  ).slice(0, 5);

  res.json({
    success: true,
    results: {
      leads: matchedLeads,
      contacts: matchedContacts,
      tasks: matchedTasks,
      notes: matchedNotes,
    },
  });
};
