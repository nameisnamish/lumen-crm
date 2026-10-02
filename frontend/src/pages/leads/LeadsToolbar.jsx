import { Search, X, LayoutGrid, Table2 } from "lucide-react";
import { LEAD_STAGES, LEAD_PRIORITIES, LEAD_SOURCES, STAGE_STYLES } from "../../lib/constants";

export function LeadsToolbar({
  filters,
  onFilterChange,
  stageCounts,
  view,
  onViewChange,
  totalCount,
  filteredCount,
}) {
  const isFiltered = filters.status || filters.priority || filters.source || filters.search;

  return (
    <div className="space-y-4 rounded-2xl border border-line bg-surface p-4 shadow-sm">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-soft" />
          <input
            value={filters.search}
            onChange={(e) => onFilterChange({ search: e.target.value })}
            placeholder="Search by name, company or email…"
            className="h-10 w-full rounded-xl border border-line bg-surface pl-10 pr-4 text-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
          />
        </div>
        <div className="grid grid-cols-2 gap-2 lg:flex">
          <select
            value={filters.priority}
            onChange={(e) => onFilterChange({ priority: e.target.value })}
            className="h-10 rounded-xl border border-line bg-surface px-3 text-xs font-medium text-ink focus:outline-none"
          >
            <option value="">All priority</option>
            {LEAD_PRIORITIES.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
          <select
            value={filters.source}
            onChange={(e) => onFilterChange({ source: e.target.value })}
            className="h-10 rounded-xl border border-line bg-surface px-3 text-xs font-medium text-ink focus:outline-none"
          >
            <option value="">All sources</option>
            {LEAD_SOURCES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-line/60">
        <button
          onClick={() => onFilterChange({ status: "" })}
          className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
            !filters.status
              ? "bg-brand-500 text-white shadow-sm"
              : "bg-surface-muted text-ink-soft hover:bg-surface-dark/5"
          }`}
        >
          All ({stageCounts.All || 0})
        </button>
        {LEAD_STAGES.map((s) => (
          <button
            key={s}
            onClick={() => onFilterChange({ status: s })}
            className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition ${
              filters.status === s
                ? "bg-brand-500 text-white shadow-sm"
                : "bg-surface-muted text-ink-soft hover:bg-surface-dark/5"
            }`}
          >
            {STAGE_STYLES[s]?.dot && (
              <span className={`h-2 w-2 rounded-full ${STAGE_STYLES[s].dot}`} />
            )}
            {s} ({stageCounts[s] || 0})
          </button>
        ))}

        <div className="ml-auto flex items-center gap-3">
          {isFiltered && (
            <button
              onClick={() => onFilterChange({ status: "", priority: "", source: "", search: "" })}
              className="inline-flex items-center gap-1 text-xs font-medium text-ink-soft transition hover:text-ink"
            >
              <X className="h-3.5 w-3.5" /> Clear
            </button>
          )}
          <span className="text-xs text-ink-soft">
            <span className="font-semibold text-ink">{filteredCount}</span> of {totalCount}
          </span>
          <div className="flex items-center gap-1 rounded-xl border border-line p-0.5 bg-surface-muted/50">
            <button
              onClick={() => onViewChange("table")}
              className={`rounded-lg p-1.5 transition ${view === "table" ? "bg-surface shadow-xs text-ink" : "text-ink-soft"}`}
              title="Table view"
            >
              <Table2 className="h-4 w-4" />
            </button>
            <button
              onClick={() => onViewChange("grid")}
              className={`rounded-lg p-1.5 transition ${view === "grid" ? "bg-surface shadow-xs text-ink" : "text-ink-soft"}`}
              title="Grid view"
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
