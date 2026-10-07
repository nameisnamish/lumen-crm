import api from "../api";
import { USE_MOCK } from "./config";
import { notes, setNotes, leadLite, uid, reply } from "./mockStore";

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
    setNotes([note, ...notes]);
    return reply({ success: true, note });
  },

  update: (id, data) => {
    if (!USE_MOCK) return api.put(`/notes/${id}`, data);
    const updatedNotes = notes.map((n) => {
      if (n._id !== id) return n;
      const next = { ...n, ...data };
      if ("lead" in data) next.lead = data.lead ? leadLite(data.lead) : null;
      return next;
    });
    setNotes(updatedNotes);
    return reply({ success: true, note: updatedNotes.find((n) => n._id === id) });
  },

  remove: (id) => {
    if (!USE_MOCK) return api.delete(`/notes/${id}`);
    setNotes(notes.filter((n) => n._id !== id));
    return reply({ success: true, message: "Note deleted" });
  },
};
