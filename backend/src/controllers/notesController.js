import { notes } from "../data/store.js";

const uid = () => "nt_" + Math.random().toString(36).slice(2, 9);

export const getNotes = async (req, res) => {
  const sorted = [...notes].sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0));
  res.json({ success: true, count: sorted.length, notes: sorted });
};

export const createNote = async (req, res) => {
  const newNote = {
    _id: uid(),
    content: req.body.content || "",
    lead: req.body.lead || null,
    pinned: Boolean(req.body.pinned),
    createdAt: new Date().toISOString(),
  };
  notes.unshift(newNote);
  res.status(201).json({ success: true, note: newNote });
};

export const updateNote = async (req, res) => {
  const index = notes.findIndex((n) => n._id === req.params.id);
  if (index === -1) return res.status(404).json({ success: false, message: "Note not found" });

  notes[index] = { ...notes[index], ...req.body };
  res.json({ success: true, note: notes[index] });
};

export const deleteNote = async (req, res) => {
  const index = notes.findIndex((n) => n._id === req.params.id);
  if (index === -1) return res.status(404).json({ success: false, message: "Note not found" });

  notes.splice(index, 1);
  res.json({ success: true, message: "Note deleted successfully" });
};
