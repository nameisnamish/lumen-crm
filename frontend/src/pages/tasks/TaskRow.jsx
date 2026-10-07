import { isToday } from "date-fns";
import {
  MoreHorizontal,
  Pencil,
  Trash2,
  CheckCircle2,
  Circle,
  CircleDot,
  Clock,
  AlertTriangle,
  Building2,
} from "lucide-react";
import { Badge, Dropdown, DropdownItem } from "../../components/ui";
import { shortDate } from "../../lib/format";
import { TASK_STATUS_STYLES, PRIORITY_STYLES } from "../../lib/constants";
import { cn } from "../../lib/utils";
import { PRIORITY_BAR, isTaskOverdue } from "../../lib/taskUtils";

export function TaskRow({ task, onToggle, onEdit, onDelete }) {
  const done = task.status === "Completed";
  const inProg = task.status === "In Progress";
  const overdue = isTaskOverdue(task);
  const dueToday = task.dueDate ? isToday(new Date(task.dueDate)) : false;

  return (
    <div className="group relative flex items-start gap-3 px-5 py-4 transition-colors hover:bg-surface-muted/50">
      {/* Priority accent bar */}
      <span
        aria-hidden
        className={cn(
          "absolute left-0 top-3 bottom-3 w-[3px] rounded-full",
          PRIORITY_BAR[task.priority] ?? "bg-slate-300"
        )}
      />

      {/* Status toggle */}
      <button
        onClick={() => onToggle(task)}
        aria-label={done ? "Mark as pending" : "Mark as completed"}
        className={cn(
          "mt-0.5 shrink-0 rounded-full p-0.5 transition-colors cursor-pointer",
          done
            ? "text-brand-600 hover:text-brand-400"
            : inProg
            ? "text-sky-500 hover:text-brand-500"
            : "text-ink-soft hover:text-brand-500"
        )}
      >
        {done ? (
          <CheckCircle2 className="h-5 w-5" />
        ) : inProg ? (
          <CircleDot className="h-5 w-5" />
        ) : (
          <Circle className="h-5 w-5" />
        )}
      </button>

      {/* Main content */}
      <div className="min-w-0 flex-1">
        {/* Title */}
        <p
          className={cn(
            "text-sm font-medium leading-snug",
            done ? "line-through text-ink-soft" : "text-ink"
          )}
        >
          {task.title}
        </p>

        {/* Description */}
        {task.description && (
          <p className="mt-0.5 truncate text-xs text-ink-soft">{task.description}</p>
        )}

        {/* Meta chips */}
        <div className="mt-2 flex flex-wrap items-center gap-1.5">
          {/* Due date chip */}
          {task.dueDate && (
            <span
              className={cn(
                "inline-flex items-center gap-1 rounded-lg px-2 py-0.5 text-xs font-medium",
                overdue
                  ? "bg-rose-50 text-rose-700"
                  : dueToday
                  ? "bg-amber-50 text-amber-700"
                  : "bg-surface-muted text-ink-soft"
              )}
            >
              {overdue ? (
                <AlertTriangle className="h-3 w-3" />
              ) : (
                <Clock className="h-3 w-3" />
              )}
              {overdue
                ? `Overdue · ${shortDate(task.dueDate)}`
                : dueToday
                ? `Today · ${shortDate(task.dueDate)}`
                : shortDate(task.dueDate)}
            </span>
          )}

          {/* Priority badge */}
          <Badge className={cn("text-xs", PRIORITY_STYLES[task.priority])}>
            {task.priority}
          </Badge>

          {/* Status badge */}
          <Badge className={cn("text-xs", TASK_STATUS_STYLES[task.status])}>
            {task.status}
          </Badge>

          {/* Linked lead chip */}
          {task.relatedLead && (
            <span className="inline-flex items-center gap-1 rounded-lg bg-brand-50 px-2 py-0.5 text-xs font-medium text-brand-700">
              <Building2 className="h-3 w-3" />
              {task.relatedLead.name}
            </span>
          )}
        </div>
      </div>

      {/* Row actions */}
      <div className="shrink-0 opacity-0 transition-opacity group-hover:opacity-100">
        <Dropdown
          trigger={
            <button className="rounded-lg p-1.5 text-ink-soft transition hover:bg-surface-muted hover:text-ink cursor-pointer">
              <MoreHorizontal className="h-4 w-4" />
            </button>
          }
        >
          <DropdownItem onClick={() => onEdit(task)}>
            <Pencil className="h-4 w-4" /> Edit
          </DropdownItem>
          <DropdownItem danger onClick={() => onDelete(task)}>
            <Trash2 className="h-4 w-4" /> Delete
          </DropdownItem>
        </Dropdown>
      </div>
    </div>
  );
}
