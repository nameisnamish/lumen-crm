import { tasks } from "../data/store.js";
import { validateTaskPayload } from "../middleware/validate.js";

const uid = () => "tsk_" + Math.random().toString(36).slice(2, 9);

export const getTasks = async (req, res) => {
  res.json({ success: true, count: tasks.length, tasks });
};

export const createTask = async (req, res) => {
  const errors = validateTaskPayload(req.body, false);
  if (errors.length > 0) {
    return res.status(400).json({ success: false, message: errors.join(". ") });
  }

  const newTask = {
    _id: uid(),
    description: "",
    relatedContact: null,
    createdAt: new Date().toISOString(),
    completedAt: req.body.status === "Completed" ? new Date().toISOString() : null,
    ...req.body,
  };
  tasks.unshift(newTask);
  res.status(201).json({ success: true, task: newTask });
};

export const updateTask = async (req, res) => {
  const index = tasks.findIndex((t) => t._id === req.params.id);
  if (index === -1) return res.status(404).json({ success: false, message: "Task not found" });

  const errors = validateTaskPayload(req.body, true);
  if (errors.length > 0) {
    return res.status(400).json({ success: false, message: errors.join(". ") });
  }

  const current = tasks[index];
  const updated = { ...current, ...req.body };
  if (req.body.status === "Completed" && !current.completedAt) {
    updated.completedAt = new Date().toISOString();
  }
  if (req.body.status && req.body.status !== "Completed") {
    updated.completedAt = null;
  }

  tasks[index] = updated;
  res.json({ success: true, task: tasks[index] });
};

export const deleteTask = async (req, res) => {
  const index = tasks.findIndex((t) => t._id === req.params.id);
  if (index === -1) return res.status(404).json({ success: false, message: "Task not found" });

  tasks.splice(index, 1);
  res.json({ success: true, message: "Task deleted successfully" });
};
