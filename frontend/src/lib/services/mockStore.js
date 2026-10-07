import {
  makeLeads,
  makeContacts,
  makeNotes,
  makeTasks,
  makeNotifications,
} from "../mockData";

/* In-memory stores so create / edit / delete feel real during the UI phase.
   They reset on page refresh — that's expected for a mock. */
export let leads = makeLeads();
export let contacts = makeContacts();
export let notes = makeNotes();
export let tasks = makeTasks();
export let notificationsList = makeNotifications();

export const setLeads = (newLeads) => {
  leads = newLeads;
};

export const setContacts = (newContacts) => {
  contacts = newContacts;
};

export const setNotes = (newNotes) => {
  notes = newNotes;
};

export const setTasks = (newTasks) => {
  tasks = newTasks;
};

export const setNotificationsList = (newList) => {
  notificationsList = newList;
};

export const uid = () => "id_" + Math.random().toString(36).slice(2, 10);
export const clone = (d) => JSON.parse(JSON.stringify(d));

// Resolve like a network call would: a short delay + a fresh copy of the data.
export const reply = (data, ms = 250) =>
  new Promise((resolve) => setTimeout(() => resolve(clone(data)), ms));

export const leadLite = (id) => {
  const l = leads.find((x) => x._id === id);
  return l ? { _id: l._id, name: l.name, company: l.company } : null;
};

export const getStoredProfile = () => {
  try {
    const s = localStorage.getItem("lumen_crm_user_profile");
    return s ? JSON.parse(s) : null;
  } catch {
    return null;
  }
};

export const saveProfile = (user) => {
  try {
    localStorage.setItem("lumen_crm_user_profile", JSON.stringify(user));
  } catch {
    // ignore storage errors
  }
};

export const defaultAvatar = (name) =>
  `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0284c7&color=fff&bold=true`;

export let mockUsers = [
  {
    id: "u1",
    name: "Alex Carter",
    email: "demo@lumencrm.com",
    password: "demo1234",
    role: "owner",
    company: "Lumen CRM Systems",
    avatar: "",
  },
];
