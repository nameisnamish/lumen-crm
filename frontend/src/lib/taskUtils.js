import { isPast, isToday } from "date-fns";

export const PRIORITY_BAR = {
  High: "bg-rose-400",
  Medium: "bg-amber-400",
  Low: "bg-slate-300",
};

export function isTaskOverdue(task) {
  if (!task.dueDate || task.status === "Completed") return false;
  const d = new Date(task.dueDate);
  return isPast(d) && !isToday(d);
}
