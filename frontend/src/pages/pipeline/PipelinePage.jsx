import { useState, useMemo, useRef, useDeferredValue, useEffect } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from "@dnd-kit/core";
import { PageHeader } from "../../components/common/PageHeader";
import { Spinner } from "../../components/ui";
import { currency } from "../../lib/format";
import { PIPELINE_STAGES } from "../../lib/constants";
import { cn } from "../../lib/utils";
import { usePipelineReducer } from "../../hooks/usePipelineReducer";
import { DealCard } from "./DealCard";
import { PipelineStats } from "./PipelineStats";
import { PipelineToolbar } from "./PipelineToolbar";
import { PipelineColumn } from "./PipelineColumn";

export default function PipelinePage() {
  const {
    board,
    moveDeal,
    reorderInColumn,
    persistBoard,
  } = usePipelineReducer();

  const [activeId, setActiveId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [density, setDensity] = useState("standard"); // "standard" | "fit"
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const deferredSearch = useDeferredValue(searchQuery);
  const scrollContainerRef = useRef(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } })
  );

  /* ── Check scroll boundaries ─────────────────────────────────────── */
  const checkScroll = () => {
    const el = scrollContainerRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  };

  useEffect(() => {
    checkScroll();
    const el = scrollContainerRef.current;
    if (el) {
      el.addEventListener("scroll", checkScroll, { passive: true });
      window.addEventListener("resize", checkScroll);
      return () => {
        el.removeEventListener("scroll", checkScroll);
        window.removeEventListener("resize", checkScroll);
      };
    }
  }, [board, density]);

  /* ── Smooth Horizontal Mouse-Wheel Scrolling ─────────────────────── */
  const handleWheel = (e) => {
    if (density === "fit") return;
    if (Math.abs(e.deltaY) > Math.abs(e.deltaX) && scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft += e.deltaY * 0.9;
    }
  };

  /* ── Smooth Column Navigation (Scroll buttons) ──────────────────── */
  const scrollByDirection = (dir) => {
    if (!scrollContainerRef.current) return;
    scrollContainerRef.current.scrollBy({ left: dir * 330, behavior: "smooth" });
  };

  /* ── Quick-Jump to Stage ─────────────────────────────────────────── */
  const jumpToStage = (stage) => {
    const col = document.getElementById(`kanban-col-${stage}`);
    if (col) {
      col.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    }
  };

  /* ── Filter board by deferred search ─────────────────────────────── */
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

  /* Move cards between columns live as the user drags over them */
  const handleDragOver = ({ active, over }) => {
    if (!over) return;
    const from = findContainer(active.id);
    const to = findContainer(over.id);
    if (!from || !to || from === to) return;

    const overIdx = board[to].findIndex((l) => l._id === over.id);
    moveDeal(active.id, from, to, overIdx);
  };

  /* Persist the final ordering + stage to the backend */
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
    persistBoard(board);
  };

  /* ── KPI computations ─────────────────────────────────────────────── */
  const allLeads = Object.values(board).flat();
  const totalValue = allLeads.reduce((s, l) => s + (l.value || 0), 0);
  const openDeals = allLeads.filter((l) => l.status !== "Won" && l.status !== "Lost");
  const wonLeads = allLeads.filter((l) => l.status === "Won");
  const wonValue = wonLeads.reduce((s, l) => s + (l.value || 0), 0);

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
      <PipelineStats
        totalValue={totalValue}
        openDealsCount={openDeals.length}
        wonValue={wonValue}
        forecast={forecast}
      />

      {/* Toolbar: Search, Stage Quick-Jump, Density & Scroll Buttons */}
      <PipelineToolbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        filteredBoard={filteredBoard}
        onJumpToStage={jumpToStage}
        density={density}
        onDensityChange={setDensity}
        canScrollLeft={canScrollLeft}
        canScrollRight={canScrollRight}
        onScrollByDirection={scrollByDirection}
      />

      {/* Kanban Board */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={({ active }) => setActiveId(active.id)}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
        onDragCancel={() => setActiveId(null)}
      >
        <div
          ref={scrollContainerRef}
          onWheel={handleWheel}
          className={cn(
            "pb-6 pt-1 transition-all duration-300",
            density === "fit"
              ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5 items-start"
              : "flex gap-4 overflow-x-auto scroll-smooth no-scrollbar"
          )}
        >
          {PIPELINE_STAGES.map((stage) => (
            <PipelineColumn
              key={stage}
              stage={stage}
              leads={filteredBoard[stage]}
              density={density}
            />
          ))}
        </div>

        <DragOverlay>
          {activeLead ? <DealCard lead={activeLead} overlay /> : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
