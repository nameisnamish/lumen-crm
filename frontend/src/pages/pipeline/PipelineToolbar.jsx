import { Search, ChevronLeft, ChevronRight, Columns, Maximize2 } from "lucide-react";
import { PIPELINE_STAGES, STAGE_STYLES } from "../../lib/constants";
import { cn } from "../../lib/utils";

export function PipelineToolbar({
  searchQuery,
  onSearchChange,
  filteredBoard,
  onJumpToStage,
  density,
  onDensityChange,
  canScrollLeft,
  canScrollRight,
  onScrollByDirection,
}) {
  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
      {/* Search bar */}
      <div className="relative w-full max-w-xs">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-soft" />
        <input
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Filter pipeline by name or company…"
          className="h-10 w-full rounded-full border border-line bg-surface pl-10 pr-4 text-xs font-medium focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 shadow-xs"
        />
      </div>

      {/* Stage quick-jump pills */}
      <div className="hidden items-center gap-1.5 overflow-x-auto py-1 md:flex">
        {PIPELINE_STAGES.map((s) => {
          const style = STAGE_STYLES[s] || STAGE_STYLES.New;
          const count = (filteredBoard[s] || []).length;
          return (
            <button
              key={s}
              onClick={() => onJumpToStage(s)}
              className="inline-flex items-center gap-1.5 rounded-full bg-surface border border-line px-3 py-1.5 text-xs font-medium text-ink-soft hover:text-ink hover:border-brand-300 transition cursor-pointer shadow-xs"
            >
              <span className={cn("h-2 w-2 rounded-full", style.dot)} />
              <span>{s}</span>
              <span className="text-[10px] text-ink-soft/80 font-bold">({count})</span>
            </button>
          );
        })}
      </div>

      {/* Navigation Arrows + Fit View Density Toggle */}
      <div className="flex items-center gap-2 self-end lg:self-auto">
        {/* View density toggle */}
        <div className="flex items-center rounded-full bg-surface p-1 border border-line shadow-xs">
          <button
            onClick={() => onDensityChange("standard")}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold transition cursor-pointer",
              density === "standard"
                ? "bg-brand-500 text-white shadow-xs"
                : "text-ink-soft hover:text-ink hover:bg-surface-muted"
            )}
            title="Wide Expanded View with Smooth Scroll"
          >
            <Columns className="h-3.5 w-3.5" /> Wide
          </button>
          <button
            onClick={() => onDensityChange("fit")}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold transition cursor-pointer",
              density === "fit"
                ? "bg-brand-500 text-white shadow-xs"
                : "text-ink-soft hover:text-ink hover:bg-surface-muted"
            )}
            title="Fit all columns on screen simultaneously"
          >
            <Maximize2 className="h-3.5 w-3.5" /> Fit Screen
          </button>
        </div>

        {/* Left / Right scroll navigation arrows */}
        {density === "standard" && (
          <div className="flex items-center gap-1">
            <button
              onClick={() => onScrollByDirection(-1)}
              disabled={!canScrollLeft}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-line bg-surface text-ink shadow-xs transition hover:bg-surface-muted disabled:opacity-30 cursor-pointer"
              title="Scroll left"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => onScrollByDirection(1)}
              disabled={!canScrollRight}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-line bg-surface text-ink shadow-xs transition hover:bg-surface-muted disabled:opacity-30 cursor-pointer"
              title="Scroll right"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
