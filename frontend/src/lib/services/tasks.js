import api from "../api";
import { USE_MOCK } from "./config";
import { tasks, setTasks, leadLite, uid, reply } from "./mockStore";

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
    setTasks([task, ...tasks]);
    return reply({ success: true, task });
  },

  update: (id, data) => {
    if (!USE_MOCK) return api.put(`/tasks/${id}`, data);
    const updatedTasks = tasks.map((t) => {
      if (t._id !== id) return t;
      const next = { ...t, ...data };
      if ("relatedLead" in data)
        next.relatedLead = data.relatedLead ? leadLite(data.relatedLead) : null;
      if (data.status === "Completed" && !next.completedAt)
        next.completedAt = new Date().toISOString();
      if (data.status && data.status !== "Completed") next.completedAt = null;
      return next;
    });
    setTasks(updatedTasks);
    return reply({ success: true, task: updatedTasks.find((t) => t._id === id) });
  },

  remove: (id) => {
    if (!USE_MOCK) return api.delete(`/tasks/${id}`);
    setTasks(tasks.filter((t) => t._id !== id));
    return reply({ success: true, message: "Task deleted" });
  },
};
