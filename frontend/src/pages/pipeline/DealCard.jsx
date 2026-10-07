import { useState, useRef, memo } from "react";
import { Link } from "react-router-dom";
import { Sparkles, GripVertical, Building2 } from "lucide-react";
import { toast } from "sonner";
import { Avatar, Badge } from "../../components/ui";
import { aiApi } from "../../lib/services";
import { currency } from "../../lib/format";
import { PRIORITY_STYLES } from "../../lib/constants";
import { cn } from "../../lib/utils";

export const DealCard = memo(function DealCard({ lead, dragHandle, overlay }) {
  const [suggesting, setSuggesting] = useState(false);
  const cardRef = useRef(null);

  const suggest = async (e) => {
    e.stopPropagation();
    setSuggesting(true);
    try {
      const res = await aiApi.leadSummary({ leadId: lead._id });
      toast(`AI suggestion for ${lead.name}`, {
        description: `${res.nextBestAction} (suggested priority: ${res.suggestedPriority})`,
        duration: 7000,
      });
    } catch (err) {
      toast.error(err.message || "AI unavailable");
    } finally {
      setSuggesting(false);
      cardRef.current?.focus();
    }
  };

  return (
    <div
      ref={cardRef}
      tabIndex={0}
      className={cn(
        "group rounded-2xl bg-surface p-3 shadow-[var(--shadow-soft)] transition border border-line/60 outline-none focus:ring-2 focus:ring-brand-500/30",
        overlay ? "shadow-[var(--shadow-pop)] rotate-2" : "hover:shadow-[var(--shadow-card)]"
      )}
    >
      {/* Name / company row + drag handle */}
      <div className="flex items-start justify-between gap-1.5">
        <div className="flex items-center gap-2 min-w-0">
          <Avatar name={lead.name} size="sm" />
          <div className="min-w-0">
            <Link
              to={`/leads/${lead._id}`}
              className="truncate block text-xs font-bold text-ink hover:text-brand-600 transition"
              onClick={(e) => e.stopPropagation()}
            >
              {lead.name}
            </Link>
            <p className="flex items-center gap-1 truncate text-[11px] text-ink-soft">
              <Building2 className="h-3 w-3 shrink-0" />
              <span className="truncate">{lead.company || "—"}</span>
            </p>
          </div>
        </div>
        {dragHandle && (
          <button
            {...dragHandle.attributes}
            {...dragHandle.listeners}
            className="cursor-grab text-ink-soft/40 transition hover:text-ink-soft active:cursor-grabbing p-0.5 shrink-0"
            aria-label="Drag"
          >
            <GripVertical className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Value + priority */}
      <div className="mt-2.5 flex items-center justify-between">
        <span className="text-xs font-extrabold text-ink">{currency(lead.value)}</span>
        <Badge className={cn("text-[10px] px-1.5 py-0.5", PRIORITY_STYLES[lead.priority])}>
          {lead.priority}
        </Badge>
      </div>

      {/* Days in stage indicator */}
      {lead.updatedAt && (
        <div className="mt-1.5 text-[10px] text-ink-soft/60">
          {Math.max(0, Math.floor((Date.now() - new Date(lead.updatedAt)) / 86400000))}d in stage
        </div>
      )}

      {/* AI suggest button — appears on hover */}
      {!overlay && (
        <button
          onClick={suggest}
          disabled={suggesting}
          className="mt-2.5 flex w-full items-center justify-center gap-1 rounded-xl bg-brand-50 py-1 text-[11px] font-semibold text-brand-700 opacity-0 transition group-hover:opacity-100 hover:bg-brand-100 disabled:opacity-60 cursor-pointer"
        >
          <Sparkles className={cn("h-3 w-3", suggesting && "animate-pulse")} />
          {suggesting ? "Thinking…" : "AI Suggestion"}
        </button>
      )}
    </div>
  );
});
