import { Link } from "react-router-dom";
import { CalendarRange, Plus } from "lucide-react";
import { cn } from "../../lib/utils";

export function DashboardHeader({ user, dateRange, onDateRangeChange, rangeLabel }) {
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div>
        <h1 className="font-display text-3xl font-extrabold tracking-tight text-ink sm:text-[2.25rem]">
          Welcome Back,{" "}
          <span className="text-brand-600">
            {user?.name?.split(" ")[0] || "Leader"}
          </span>
        </h1>
        <p className="mt-1 text-sm text-ink-soft">
          Here's what's happening across your pipeline, deals, and AI insights today.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {/* Global Date Range Selector: 1M / 3M / 6M / 1Y / ALL */}
        <div className="flex items-center gap-1 rounded-full bg-surface p-1 shadow-[var(--shadow-soft)] border border-line">
          {["1m", "3m", "6m", "12m", "all"].map((r) => (
            <button
              key={r}
              onClick={() => onDateRangeChange(r)}
              className={cn(
                "rounded-full px-3 py-1 text-xs font-semibold transition cursor-pointer",
                dateRange === r
                  ? "bg-brand-500 text-white shadow-xs"
                  : "text-ink-soft hover:text-ink hover:bg-surface-muted"
              )}
            >
              {r === "12m" ? "1Y" : r.toUpperCase()}
            </button>
          ))}
        </div>

        <div className="hidden items-center gap-2 rounded-full bg-surface px-3.5 py-1.5 text-xs font-medium text-ink-soft shadow-[var(--shadow-soft)] border border-line sm:flex">
          <CalendarRange className="h-3.5 w-3.5 text-brand-600" />
          {rangeLabel}
        </div>

        <Link
          to="/leads"
          className="brand-gradient brand-gradient-hover inline-flex h-10 items-center gap-2 rounded-full px-4 text-xs font-bold text-white shadow-sm transition hover:shadow-md"
        >
          <Plus className="h-4 w-4" /> Add Lead
        </Link>
      </div>
    </div>
  );
}
