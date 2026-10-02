import { Search, X } from "lucide-react";
import { Card } from "../../components/ui";
import { cn } from "../../lib/utils";

function FilterChip({ label, count, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-sm font-medium transition cursor-pointer",
        active
          ? "border-transparent bg-brand-600 text-white shadow-sm"
          : "border-line bg-surface text-ink-soft hover:bg-surface-muted hover:text-ink"
      )}
    >
      {label}
      <span
        className={cn(
          "rounded-full px-1.5 text-xs font-semibold",
          active ? "bg-white/20 text-white" : "bg-surface-muted text-ink-soft"
        )}
      >
        {count}
      </span>
    </button>
  );
}

export function NotesToolbar({
  search,
  onSearchChange,
  filter,
  onFilterChange,
  chipCounts,
  filteredCount,
  totalCount,
  onClearAll,
  isActive,
}) {
  return (
    <Card className="space-y-4 p-4">
      {/* Search row */}
      <div className="relative">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-soft" />
        <input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search notes…"
          className="h-10 w-full rounded-xl border border-line bg-surface pl-10 pr-4 text-sm text-ink placeholder:text-ink-soft/60 transition focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
        />
      </div>

      {/* Quick-filter chips + result count */}
      <div className="flex flex-wrap items-center gap-2">
        <FilterChip
          label="All"
          count={chipCounts.all}
          active={filter === "all"}
          onClick={() => onFilterChange("all")}
        />
        <FilterChip
          label="Pinned"
          count={chipCounts.pinned}
          active={filter === "pinned"}
          onClick={() => onFilterChange("pinned")}
        />
        <FilterChip
          label="Linked"
          count={chipCounts.linked}
          active={filter === "linked"}
          onClick={() => onFilterChange("linked")}
        />
        <FilterChip
          label="Unlinked"
          count={chipCounts.unlinked}
          active={filter === "unlinked"}
          onClick={() => onFilterChange("unlinked")}
        />

        <div className="ml-auto flex items-center gap-3">
          {isActive && (
            <button
              onClick={onClearAll}
              className="inline-flex items-center gap-1 text-sm font-medium text-ink-soft transition hover:text-ink cursor-pointer"
            >
              <X className="h-3.5 w-3.5" /> Clear
            </button>
          )}
          <span className="text-sm text-ink-soft">
            <span className="font-semibold text-ink">{filteredCount}</span> of{" "}
            {totalCount}
          </span>
        </div>
      </div>
    </Card>
  );
}
