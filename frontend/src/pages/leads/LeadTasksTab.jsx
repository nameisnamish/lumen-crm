import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { Plus, CheckCircle2, Circle } from "lucide-react";
import { Card, Button, Badge } from "../../components/ui";
import { tasksApi } from "../../lib/services";
import { relative } from "../../lib/format";
import { toast } from "sonner";

export default function LeadTasksTab() {
  const { lead } = useOutletContext();
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    tasksApi.list().then((res) => {
      if (res.tasks) {
        setTasks(res.tasks.filter((t) => t.relatedLead?._id === lead._id || t.relatedLead === lead._id));
      }
    });
  }, [lead._id]);

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    setSubmitting(true);
    try {
      const res = await tasksApi.create({
        title,
        priority: "High",
        status: "Pending",
        relatedLead: lead._id,
      });
      if (res.success) {
        toast.success("Task added");
        setTitle("");
        setTasks([res.task, ...tasks]);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const toggleTask = async (task) => {
    const nextStatus = task.status === "Completed" ? "Pending" : "Completed";
    const res = await tasksApi.update(task._id, { status: nextStatus });
    if (res.success) {
      setTasks(tasks.map((t) => (t._id === task._id ? res.task : t)));
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-4">
        <form onSubmit={handleAddTask} className="flex gap-2">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={`New action item for ${lead.name}…`}
            className="flex-1 rounded-xl border border-line px-3.5 py-2 text-sm focus:border-brand-400 focus:outline-none"
          />
          <Button type="submit" disabled={submitting || !title.trim()}>
            <Plus className="h-4 w-4" /> Add Task
          </Button>
        </form>
      </Card>

      <div className="space-y-2">
        {tasks.length === 0 ? (
          <Card className="p-8 text-center text-sm text-ink-soft">No pending tasks for this lead.</Card>
        ) : (
          tasks.map((t) => (
            <Card key={t._id} className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button onClick={() => toggleTask(t)} className="text-brand-600">
                  {t.status === "Completed" ? (
                    <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                  ) : (
                    <Circle className="h-5 w-5 text-ink-soft" />
                  )}
                </button>
                <span className={`text-sm ${t.status === "Completed" ? "line-through text-ink-soft" : "font-medium text-ink"}`}>
                  {t.title}
                </span>
              </div>
              <Badge variant={t.status === "Completed" ? "success" : "warning"}>{t.status}</Badge>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
