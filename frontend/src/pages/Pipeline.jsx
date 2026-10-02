import { useState, useMemo, useRef, useDeferredValue, useCallback, useEffect, memo } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
  useDroppable,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  Sparkles,
  GripVertical,
  Building2,
  TrendingUp,
  Layers,
  Target,
  DollarSign,
  Plus,
  Search,
} from "lucide-react";
import { Link } from "react-router-dom";
import { PageHeader } from "../components/common/PageHeader";
import { Spinner, Avatar, Badge, Card, Button } from "../components/ui";
import { leadsApi, aiApi } from "../lib/services";
import { currency } from "../lib/format";
import { PIPELINE_STAGES, STAGE_STYLES, PRIORITY_STYLES } from "../lib/constants";
import { cn } from "../lib/utils";
import { toast } from "sonner";
import { usePipelineReducer } from "../hooks/usePipelineReducer";

export default function Pipeline() {
  const {
    board,
    moveDeal,
    reorderInColumn,
    persistBoard,
  } = usePipelineReducer();

  const [activeId, setActiveId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const deferredSearch = useDeferredValue(searchQuery);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } })
  );

  /* ── Filter board by deferred search (unconditional hook) ─────────── */
  const filteredBoard = useMemo(() => {
    if (!board) return null;
    if (!deferredSearch.trim()) return board;
    const q = deferredSearch.toLowerCase();
    const result = {};
    PIPELINE_STAGES.forEach((s) => {
      result[s] = (board[s] || []).filter(
        (l) =>
          l.name?.toLowerCase().includes(q) ||
          l.company?.toLowerCase().includes(q)
      );
    });
    return result;
  }, [board, deferredSearch]);

  if (!board || !filteredBoard) return <Spinner />;

  const findContainer = (id) => {
    if (id in board) return id;
    return PIPELINE_STAGES.find((s) => board[s].some((l) => l._id === id));
  };

  const activeLead = activeId
    ? Object.values(board).flat().find((l) => l._id === activeId)
    : null;

  /* Move cards between columns live as the user drags over them — optimistic. */
  const handleDragOver = ({ active, over }) => {
    if (!over) return;
    const from = findContainer(active.id);
    const to = findContainer(over.id);
    if (!from || !to || from === to) return;

    const overIdx = board[to].findIndex((l) => l._id === over.id);
    moveDeal(active.id, from, to, overIdx);
  };

  /* Persist the final ordering + stage to the backend (with rollback on fail). */
  const handleDragEnd = ({ active, over }) => {
    setActiveId(null);
    if (!over) return;
    const container = findContainer(over.id);
    if (!container) return;

    const items = board[container];
    const oldIdx = items.findIndex((l) => l._id === active.id);
    const newIdx = items.findIndex((l) => l._id === over.id);
    if (oldIdx !== -1 && newIdx !== -1 && oldIdx !== newIdx) {
      reorderInColumn(container, oldIdx, newIdx);
    }

    // Persist to backend (uses current board state snapshot for rollback)
    persistBoard(board);
  };

  /* ── KPI computations ─────────────────────────────────────────────── */
  const allLeads = Object.values(board).flat();
  const totalValue = allLeads.reduce((s, l) => s + (l.value || 0), 0);
  const openDeals = allLeads.filter((l) => l.status !== "Won" && l.status !== "Lost");
  const wonLeads = allLeads.filter((l) => l.status === "Won");
  const wonValue = wonLeads.reduce((s, l) => s + (l.value || 0), 0);
  const closedCount = wonLeads.length + (board.Lost?.length || 0);
  const winRate = closedCount > 0 ? Math.round((wonLeads.length / closedCount) * 100) : 0;

  /* Weighted forecast: value × stage probability */
  const STAGE_PROB = { New: 0.1, Qualified: 0.3, Proposal: 0.6, Won: 1.0, Lost: 0.0 };
  const forecast = allLeads.reduce(
    (s, l) => s + (l.value || 0) * (STAGE_PROB[l.status] ?? 0),
    0
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Pipeline"
        subtitle={`${allLeads.length} leads · ${currency(totalValue, { compact: true })} in play`}
      />

      {/* KPI summary strip */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatTile
          icon={DollarSign}
          tint="bg-brand-50 text-brand-600"
          label="Total pipeline"
          value={currency(totalValue, { compact: true })}
        />
        <StatTile
          icon={Layers}
          tint="bg-sky-50 text-sky-600"
          label="Open deals"
          value={openDeals.length}
        />
        <StatTile
          icon={Target}
          tint="bg-emerald-50 text-emerald-600"
          label="Won value"
          value={currency(wonValue, { compact: true })}
        />
        <StatTile
          icon={TrendingUp}
          tint="bg-violet-50 text-violet-600"
          label="Weighted forecast"
          value={currency(forecast, { compact: true })}
        />
      </div>

      {/* Search bar */}
      <div className="relative max-w-sm">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-soft" />
        <input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Filter pipeline by name or company…"
          className="h-10 w-full rounded-xl border border-line bg-surface pl-10 pr-4 text-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
        />
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={({ active }) => setActiveId(active.id)}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
        onDragCancel={() => setActiveId(null)}
      >
        <div className="flex gap-4 overflow-x-auto pb-4">
          {PIPELINE_STAGES.map((stage) => (
            <Column key={stage} stage={stage} leads={filteredBoard[stage]} />
          ))}
        </div>

        <DragOverlay>
          {activeLead ? <DealCard lead={activeLead} overlay /> : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}

/* ── KPI stat tile ──────────────────────────────────────────────────── */
function StatTile({ icon: Icon, label, value, tint }) {
  return (
    <Card className="p-4">
      <div className="flex items-center gap-3">
        <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl", tint)}>
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <p className="truncate text-xs text-ink-soft">{label}</p>
          <p className="font-display text-lg font-bold text-ink">{value}</p>
        </div>
      </div>
    </Card>
  );
}

/* ── Column with inline quick-add ──────────────────────────────────── */
function Column({ stage, leads }) {
  const { setNodeRef, isOver } = useDroppable({ id: stage });
  const style = STAGE_STYLES[stage];
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

  // Auto-focus the quick-add input when it appears
  useEffect(() => {
    if (adding && quickAddRef.current) {
      quickAddRef.current.focus();
    }
  }, [adding]);

  return (
    <div className="flex w-80 shrink-0 flex-col">
      {/* Colored top accent bar */}
      <div className={cn("mb-2 h-1 w-full rounded-full", style.bar)} />

      {/* Column header */}
      <div className="mb-3 flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <span className={cn("h-2.5 w-2.5 rounded-full", style.dot)} />
          <h3 className="text-sm font-semibold text-ink">{stage}</h3>
          <span className="rounded-full bg-surface px-2 py-0.5 text-xs font-medium text-ink-soft shadow-sm border border-line">
            {leads.length}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-ink-soft">
            {currency(value, { compact: true })}
          </span>
          <button
            onClick={() => setAdding((p) => !p)}
            className="flex h-6 w-6 items-center justify-center rounded-lg text-ink-soft hover:bg-surface hover:text-brand-600 transition"
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
          "flex min-h-[60vh] flex-1 flex-col gap-3 rounded-3xl border-2 border-dashed border-transparent bg-surface-muted/60 p-3 transition",
          isOver && "border-brand-300 bg-brand-50/60"
        )}
      >
        {/* Inline quick-add form */}
        {adding && (
          <form onSubmit={handleQuickAdd} className="flex gap-2">
            <input
              ref={quickAddRef}
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Lead name…"
              className="flex-1 rounded-xl border border-line bg-surface px-3 py-2 text-xs focus:border-brand-400 focus:outline-none"
              onKeyDown={(e) => e.key === "Escape" && setAdding(false)}
            />
            <button
              type="submit"
              disabled={!newName.trim()}
              className="rounded-xl bg-brand-500 px-2.5 py-2 text-xs font-semibold text-white hover:bg-brand-600 disabled:opacity-40 transition"
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
            <SortableCard key={lead._id} lead={lead} />
          ))}
        </SortableContext>
        {leads.length === 0 && !adding && (
          <p className="mt-6 text-center text-xs text-ink-soft">Drop leads here</p>
        )}
      </div>
    </div>
  );
}

/* ── Sortable card wrapper ──────────────────────────────────────────── */
function SortableCard({ lead }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: lead._id });

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={cn(isDragging && "opacity-40")}
    >
      <DealCard lead={lead} dragHandle={{ attributes, listeners }} />
    </div>
  );
}

/* ── DealCard — React.memo to prevent unnecessary re-renders ────────── */
const DealCard = memo(function DealCard({ lead, dragHandle, overlay }) {
  const [suggesting, setSuggesting] = useState(false);
  const cardRef = useRef(null);

  // AI: suggest the next best action / priority for this lead.
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
      // useRef: re-focus the card after AI toast
      cardRef.current?.focus();
    }
  };

  return (
    <div
      ref={cardRef}
      tabIndex={0}
      className={cn(
        "group rounded-2xl bg-surface p-3.5 shadow-[var(--shadow-soft)] transition border border-line/60 outline-none focus:ring-2 focus:ring-brand-500/30",
        overlay ? "shadow-[var(--shadow-pop)] rotate-2" : "hover:shadow-[var(--shadow-card)]"
      )}
    >
      {/* Name / company row + drag handle */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <Avatar name={lead.name} size="sm" />
          <div className="min-w-0">
            <Link
              to={`/leads/${lead._id}`}
              className="truncate text-sm font-semibold text-ink hover:text-brand-600 transition"
              onClick={(e) => e.stopPropagation()}
            >
              {lead.name}
            </Link>
            <p className="flex items-center gap-1 truncate text-xs text-ink-soft">
              <Building2 className="h-3 w-3 shrink-0" />
              {lead.company || "—"}
            </p>
          </div>
        </div>
        {dragHandle && (
          <button
            {...dragHandle.attributes}
            {...dragHandle.listeners}
            className="cursor-grab text-ink-soft/50 transition hover:text-ink-soft active:cursor-grabbing"
            aria-label="Drag"
          >
            <GripVertical className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Value + priority */}
      <div className="mt-3 flex items-center justify-between">
        <span className="text-sm font-bold text-ink">{currency(lead.value)}</span>
        <Badge className={PRIORITY_STYLES[lead.priority]}>{lead.priority}</Badge>
      </div>

      {/* Days in stage indicator */}
      {lead.updatedAt && (
        <div className="mt-2 text-[10px] text-ink-soft/70">
          {Math.max(0, Math.floor((Date.now() - new Date(lead.updatedAt)) / 86400000))}d in stage
        </div>
      )}

      {/* AI suggest button — appears on hover, hidden in DragOverlay */}
      {!overlay && (
        <button
          onClick={suggest}
          disabled={suggesting}
          className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-xl bg-brand-50 py-1.5 text-xs font-medium text-brand-700 opacity-0 transition group-hover:opacity-100 hover:bg-brand-100 disabled:opacity-60"
        >
          <Sparkles className={cn("h-3.5 w-3.5", suggesting && "animate-pulse")} />
          {suggesting ? "Thinking…" : "AI suggest next step"}
        </button>
      )}
    </div>
  );
});
