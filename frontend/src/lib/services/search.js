import api from "../api";
import { USE_MOCK } from "./config";
import { leads, contacts, tasks, notes, reply } from "./mockStore";

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
