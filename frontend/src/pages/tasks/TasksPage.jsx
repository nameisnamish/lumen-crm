import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { isToday, isPast } from "date-fns";
import {
  Plus,
  CalendarCheck,
  CheckCircle2,
  Circle,
  AlertTriangle,
} from "lucide-react";

import { PageHeader } from "../../components/common/PageHeader";
import { EmptyState } from "../../components/common/EmptyState";
import { ConfirmDialog } from "../../components/common/ConfirmDialog";
import { StatCard } from "../../components/common/StatCard";
import { Button, Card, Tabs, Spinner } from "../../components/ui";

import { tasksApi, leadsApi } from "../../lib/services";
import { cn } from "../../lib/utils";
import { TaskRow, isTaskOverdue } from "./TaskRow";
import { TaskFormDialog } from "./TaskFormDialog";
import { TaskProgressCard } from "./TaskProgressCard";

// Group definitions (in display order)
const GROUPS = [
  { key: "overdue",   label: "Overdue",      labelClass: "text-rose-700",   countClass: "bg-rose-50 text-rose-700" },
  { key: "today",     label: "Due today",    labelClass: "text-amber-700",  countClass: "bg-amber-50 text-amber-700" },
  { key: "upcoming",  label: "Upcoming",     labelClass: "text-ink",        countClass: "bg-surface-muted text-ink-soft" },
  { key: "nodate",    label: "No due date",  labelClass: "text-ink-soft",   countClass: "bg-surface-muted text-ink-soft" },
  { key: "completed", label: "Completed",    labelClass: "text-brand-700",  countClass: "bg-brand-50 text-brand-700" },
];

const STATUS_TABS = [
  { value: "all",         label: "All" },
  { value: "Pending",     label: "Pending" },
  { value: "In Progress", label: "In Progress" },
  { value: "Completed",   label: "Completed" },
];

function groupKey(task) {
  if (task.status === "Completed") return "completed";
  if (!task.dueDate) return "nodate";
  const d = new Date(task.dueDate);
  if (isToday(d)) return "today";
  if (isPast(d)) return "overdue";
  return "upcoming";
}

function GroupHeader({ label, count, labelClass, countClass }) {
  return (
    <div className="flex items-center gap-2 border-b border-line bg-surface-muted/30 px-5 py-2">
      <span className={cn("text-xs font-semibold uppercase tracking-wide", labelClass)}>
        {label}
      </span>
      <span className={cn("rounded-full px-2 py-0.5 text-xs font-semibold", countClass)}>
        {count}
      </span>
    </div>
  );
}

export default function TasksPage() {
  // Raw data
  const [tasks, setTasks] = useState(null);
  const [leads, setLeads] = useState([]);

  // UI state
  const [tab, setTab] = useState("all");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [toDelete, setToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // ── Data loading ─────────────────────────────────────────────────────────
  const load = () => {
    setTasks(null);
    tasksApi.list().then((res) => setTasks(res.tasks)).catch(() => setTasks([]));
  };

  useEffect(() => {
    load();
    leadsApi.list().then((res) => setLeads(res.leads)).catch(() => {});
  }, []);

  // ── KPI counts ───────────────────────────────────────────────────────────
  const stats = useMemo(() => {
    if (!tasks) return { total: 0, pending: 0, overdue: 0, completed: 0 };
    return {
      total: tasks.length,
      pending: tasks.filter((t) => t.status === "Pending").length,
      overdue: tasks.filter(isTaskOverdue).length,
      completed: tasks.filter((t) => t.status === "Completed").length,
    };
  }, [tasks]);

  // ── Tab-filtered list ─────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    if (!tasks) return [];
    if (tab === "all") return tasks;
    return tasks.filter((t) => t.status === tab);
  }, [tasks, tab]);

  // ── Group the filtered tasks into timeline buckets ────────────────────────
  const groupedSections = useMemo(() => {
    const map = {};
    GROUPS.forEach((g) => (map[g.key] = []));
    filtered.forEach((t) => {
      const key = groupKey(t);
      map[key].push(t);
    });
    return GROUPS.filter((g) => map[g.key].length > 0).map((g) => ({
      ...g,
      tasks: map[g.key],
    }));
  }, [filtered]);

  // ── Actions ───────────────────────────────────────────────────────────────
  const openNew = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const openEdit = (task) => {
    setEditing(task);
    setFormOpen(true);
  };

  const handleToggle = async (task) => {
    const next = task.status === "Completed" ? "Pending" : "Completed";
    try {
      await tasksApi.update(task._id, { status: next });
      load();
    } catch (err) {
      toast.error(err?.message ?? "Could not update task");
    }
  };

  const confirmDelete = async () => {
    setDeleting(true);
    try {
      await tasksApi.remove(toDelete._id);
      toast.success("Task deleted");
      setToDelete(null);
      load();
    } catch (err) {
      toast.error(err?.message ?? "Could not delete task");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page header */}
      <PageHeader title="Follow-ups" subtitle="Stay on top of every commitment.">
        <Button onClick={openNew}>
          <Plus className="h-4 w-4" /> Add task
        </Button>
      </PageHeader>

      {/* KPI stat cards */}
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <StatCard label="Total tasks" value={stats.total} icon={CalendarCheck} />
        <StatCard label="Pending" value={stats.pending} icon={Circle} />
        <StatCard label="Overdue" value={stats.overdue} icon={AlertTriangle} />
        <StatCard label="Completed" value={stats.completed} icon={CheckCircle2} accent />
      </div>

      {/* Completion progress bar */}
      {tasks !== null && (
        <TaskProgressCard completed={stats.completed} total={stats.total} />
      )}

      {/* Status filter tabs + grouped task list */}
      <Card className="overflow-hidden">
        {/* Tabs toolbar */}
        <div className="border-b border-line px-5 py-3">
          <Tabs value={tab} onChange={setTab} tabs={STATUS_TABS} />
        </div>

        {/* Body */}
        {tasks === null ? (
          <div className="flex items-center justify-center py-16">
            <Spinner />
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={CalendarCheck}
            title="No tasks here"
            description={
              tab === "all"
                ? "Add your first follow-up to get started."
                : `No tasks with status "${tab}".`
            }
            action={
              tab === "all" ? (
                <Button onClick={openNew}>
                  <Plus className="h-4 w-4" /> Add task
                </Button>
              ) : null
            }
          />
        ) : (
          <div>
            {groupedSections.map((group) => (
              <div key={group.key}>
                <GroupHeader
                  label={group.label}
                  count={group.tasks.length}
                  labelClass={group.labelClass}
                  countClass={group.countClass}
                />
                <div className="divide-y divide-line">
                  {group.tasks.map((task) => (
                    <TaskRow
                      key={task._id}
                      task={task}
                      onToggle={handleToggle}
                      onEdit={openEdit}
                      onDelete={setToDelete}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Add / Edit dialog */}
      <TaskFormDialog
        open={formOpen}
        onClose={() => setFormOpen(false)}
        task={editing}
        leads={leads}
        onSaved={load}
      />

      {/* Delete confirmation */}
      <ConfirmDialog
        open={Boolean(toDelete)}
        onClose={() => setToDelete(null)}
        onConfirm={confirmDelete}
        loading={deleting}
        title="Delete this task?"
        description={`"${toDelete?.title}" will be permanently removed.`}
        confirmLabel="Delete task"
      />
    </div>
  );
}
