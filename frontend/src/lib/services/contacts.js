import api from "../api";
import { USE_MOCK } from "./config";
import { contacts, setContacts, uid, reply } from "./mockStore";

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
    setContacts([contact, ...contacts]);
    return reply({ success: true, contact });
  },

  update: (id, data) => {
    if (!USE_MOCK) return api.put(`/contacts/${id}`, data);
    const updatedContacts = contacts.map((c) => (c._id === id ? { ...c, ...data } : c));
    setContacts(updatedContacts);
    return reply({ success: true, contact: updatedContacts.find((c) => c._id === id) });
  },

  remove: (id) => {
    if (!USE_MOCK) return api.delete(`/contacts/${id}`);
    setContacts(contacts.filter((c) => c._id !== id));
    return reply({ success: true, message: "Contact deleted" });
  },
};
