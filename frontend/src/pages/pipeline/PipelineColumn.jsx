import { useState, useRef, useEffect } from "react";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { DealCard } from "./DealCard";
import { leadsApi } from "../../lib/services";
import { currency } from "../../lib/format";
import { STAGE_STYLES } from "../../lib/constants";
import { cn } from "../../lib/utils";

function SortableCard({ lead, density }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: lead._id });

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={cn(isDragging && "opacity-40")}
    >
      <DealCard lead={lead} dragHandle={{ attributes, listeners }} density={density} />
    </div>
  );
}

export function PipelineColumn({ stage, leads, density }) {
  const { setNodeRef, isOver } = useDroppable({ id: stage });
  const style = STAGE_STYLES[stage] || STAGE_STYLES.New;
  const value = leads.reduce((s, l) => s + (l.value || 0), 0);
  const [adding, setAdding] = useState(false);
  const [newName, setNewName] = useState("");
  const quickAddRef = useRef(null);

  const handleQuickAdd = async (e) => {
    e.preventDefault();
    if (!newName.trim()) return;
    try {
      await leadsApi.create({ name: newName.trim(), status: stage, value: 0, priority: "Medium" });
      toast.success(`Added "${newName.trim()}" to ${stage}`);
      setNewName("");
      setAdding(false);
    } catch {
      toast.error("Failed to create lead");
    }
  };

  useEffect(() => {
    if (adding && quickAddRef.current) {
      quickAddRef.current.focus();
    }
  }, [adding]);

  return (
    <div
      id={`kanban-col-${stage}`}
      className={cn(
        "flex flex-col transition-all duration-300",
        density === "fit" ? "w-full min-w-0" : "w-80 shrink-0"
      )}
    >
      {/* Colored top accent bar */}
      <div className={cn("mb-2 h-1 w-full rounded-full", style.bar)} />

      {/* Column header */}
      <div className="mb-3 flex items-center justify-between px-1">
        <div className="flex items-center gap-1.5 min-w-0">
          <span className={cn("h-2.5 w-2.5 shrink-0 rounded-full", style.dot)} />
          <h3 className="truncate text-sm font-semibold text-ink">{stage}</h3>
          <span className="rounded-full bg-surface px-1.5 py-0.5 text-[11px] font-semibold text-ink-soft shadow-xs border border-line">
            {leads.length}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-semibold text-ink-soft">
            {currency(value, { compact: true })}
          </span>
          <button
            onClick={() => setAdding((p) => !p)}
            className="flex h-6 w-6 items-center justify-center rounded-lg text-ink-soft hover:bg-surface hover:text-brand-600 transition cursor-pointer"
            title={`Add to ${stage}`}
          >
            <Plus className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Droppable column body */}
      <div
        ref={setNodeRef}
        className={cn(
          "flex min-h-[58vh] flex-1 flex-col gap-2.5 rounded-3xl border-2 border-dashed border-transparent bg-surface-muted/60 p-2.5 transition",
          isOver && "border-brand-300 bg-brand-50/60"
        )}
      >
        {/* Inline quick-add form */}
        {adding && (
          <form onSubmit={handleQuickAdd} className="flex gap-1.5">
            <input
              ref={quickAddRef}
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Lead name…"
              className="flex-1 rounded-xl border border-line bg-surface px-3 py-1.5 text-xs focus:border-brand-400 focus:outline-none"
              onKeyDown={(e) => e.key === "Escape" && setAdding(false)}
            />
            <button
              type="submit"
              disabled={!newName.trim()}
              className="rounded-xl bg-brand-500 px-2.5 py-1.5 text-xs font-semibold text-white hover:bg-brand-600 disabled:opacity-40 transition cursor-pointer"
            >
              Add
            </button>
          </form>
        )}

        <SortableContext
          items={leads.map((l) => l._id)}
          strategy={verticalListSortingStrategy}
        >
          {leads.map((lead) => (
            <SortableCard key={lead._id} lead={lead} density={density} />
          ))}
        </SortableContext>
        {leads.length === 0 && !adding && (
          <p className="mt-6 text-center text-xs text-ink-soft">Drop leads here</p>
        )}
      </div>
    </div>
  );
}
