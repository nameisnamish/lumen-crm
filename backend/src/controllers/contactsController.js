import { contacts } from "../data/store.js";

const uid = () => "cnt_" + Math.random().toString(36).slice(2, 9);

export const getContacts = async (req, res) => {
  res.json({ success: true, count: contacts.length, contacts });
};

export const getContactById = async (req, res) => {
  const contact = contacts.find((c) => c._id === req.params.id);
  if (!contact) return res.status(404).json({ success: false, message: "Contact not found" });
  res.json({ success: true, contact });
};

export const createContact = async (req, res) => {
  const newContact = {
    _id: uid(),
    tags: [],
    favorite: false,
    createdAt: new Date().toISOString(),
    ...req.body,
  };
  contacts.unshift(newContact);
  res.status(201).json({ success: true, contact: newContact });
};

export const updateContact = async (req, res) => {
  const index = contacts.findIndex((c) => c._id === req.params.id);
  if (index === -1) return res.status(404).json({ success: false, message: "Contact not found" });

  contacts[index] = { ...contacts[index], ...req.body };
  res.json({ success: true, contact: contacts[index] });
};

export const deleteContact = async (req, res) => {
  const index = contacts.findIndex((c) => c._id === req.params.id);
  if (index === -1) return res.status(404).json({ success: false, message: "Contact not found" });

  contacts.splice(index, 1);
  res.json({ success: true, message: "Contact deleted successfully" });
};
