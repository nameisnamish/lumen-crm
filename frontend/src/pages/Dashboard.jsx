import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { CalendarRange, Plus } from "lucide-react";
import { format } from "date-fns";
import {
  KpiRibbon,
  PipelineEngagementSection,
  UnifiedPipelineFunnel,
  ActivityFeedTable,
  UpcomingTasksCard,
  TopDealsCard,
  TopContactsWidget,
} from "../components/dashboard";
import { AiInsightsCard } from "../components/ai/AiInsightsCard";
import { AiCopilotPanel } from "../components/ai/AiCopilotPanel";
import { Skeleton } from "../components/ui";
import { analyticsApi, contactsApi, leadsApi, tasksApi } from "../lib/services";
import { useAuth } from "../context/AuthContext";
import { cn } from "../lib/utils";

/* Stage probabilities for weighted forecast calculation */
const STAGE_PROB = { New: 0.1, Qualified: 0.3, Proposal: 0.6, Won: 1.0, Lost: 0.0 };

export default function Dashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [allLeads, setAllLeads] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [dateRange, setDateRange] = useState("6m"); // "1m" | "3m" | "6m" | "12m"

  useEffect(() => {
    analyticsApi
      .overview({ range: dateRange })
      .then(setData)
      .catch(() => setData(false));
  }, [dateRange]);

  useEffect(() => {
    contactsApi.list().then((res) => setContacts(res.contacts || [])).catch(() => {});
    leadsApi.list().then((res) => setAllLeads(res.leads || [])).catch(() => {});
    tasksApi.list().then((res) => setTasks(res.tasks || [])).catch(() => {});
  }, []);

  /* ── Filtered leads for the selected dateRange ─────────────────── */
  const activeLeads = useMemo(() => {
    if (data?.filteredLeads?.length) return data.filteredLeads;
    const rangeMonths = { "1m": 1, "3m": 3, "6m": 6, "12m": 12 }[dateRange] || 6;
    const cutoffTime = Date.now() - rangeMonths * 30 * 86400000;
    const filtered = allLeads.filter((l) => {
      if (!l.createdAt) return true;
      return new Date(l.createdAt).getTime() >= cutoffTime;
    });
    return filtered.length > 0
      ? filtered
      : allLeads.slice(0, Math.max(3, Math.floor(allLeads.length * (rangeMonths / 12))));
  }, [data, allLeads, dateRange]);

  /* ── Weighted forecast calculation ──────────────────────────────── */
  const forecast = useMemo(() => {
    return activeLeads.reduce(
      (s, l) => s + (l.value || 0) * (STAGE_PROB[l.status] ?? 0),
      0
    );
  }, [activeLeads]);

  if (data === null) return <DashboardSkeleton />;
  const stats = data?.stats || {};

  // Trailing date-range label for the header pill
  const rangeMonths = { "1m": 1, "3m": 3, "6m": 6, "12m": 12 }[dateRange] || 6;
  const today = new Date();
  const start = new Date(today.getFullYear(), today.getMonth() - (rangeMonths - 1), 1);
  const rangeLabel = `${format(start, "dd MMM")} – ${format(today, "dd MMM, yyyy")}`;

  return (
    <div className="space-y-6">
      {/* ── Header Row ────────────────────────────────────────────── */}
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
          {/* Global Date Range Selector: 1M / 3M / 6M / 1Y */}
          <div className="flex items-center gap-1 rounded-full bg-surface p-1 shadow-[var(--shadow-soft)] border border-line">
            {["1m", "3m", "6m", "12m"].map((r) => (
              <button
                key={r}
                onClick={() => setDateRange(r)}
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

      {/* ── 1. Top Executive KPI Strip ───────────────────────────── */}
      <KpiRibbon
        stats={stats}
        forecast={forecast}
        trend={data?.trend || []}
        leadsCount={activeLeads.length}
      />

      {/* ── 2. Primary 8 : 4 Grid Layout ─────────────────────────── */}
      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
        {/* ── Main Workspace: Analytics & Deal Flow (8 Cols) ──────── */}
        <div className="space-y-6 lg:col-span-8">
          {/* Velocity Trend + Source Breakdown with Adaptive Cadence */}
          <PipelineEngagementSection
            trend={data?.trend || []}
            leads={activeLeads}
            dateRange={dateRange}
            cadence={data?.cadence || "Monthly"}
          />

          {/* Consolidated Pipeline Funnel & Stage Values */}
          <UnifiedPipelineFunnel leads={activeLeads} pipeline={data?.pipeline || []} />

          {/* Live Recent Lead Activity Table */}
          <ActivityFeedTable leads={data?.recentLeads || activeLeads.slice(0, 6)} />
        </div>

        {/* ── Action & Intelligence Hub: Daily Co-pilot (4 Cols) ───── */}
        <div className="space-y-6 lg:col-span-4">
          {/* AI Copilot & Real-Time Deal Insights */}
          <div className="space-y-5">
            <AiCopilotPanel />
            <AiInsightsCard />
          </div>

          {/* Critical Next Tasks / Follow-ups */}
          <UpcomingTasksCard tasks={tasks} />

          {/* High-Value Deal Leaderboard */}
          <TopDealsCard leads={activeLeads} />

          {/* Key Relationships */}
          <TopContactsWidget contacts={contacts} />
        </div>
      </div>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-10 w-72" />
      {/* KPI Ribbon skeleton */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-28 rounded-2xl" />
        ))}
      </div>
      {/* 8 : 4 Grid skeleton */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="space-y-6 lg:col-span-8">
          <Skeleton className="h-80 rounded-2xl" />
          <Skeleton className="h-72 rounded-2xl" />
          <Skeleton className="h-80 rounded-2xl" />
        </div>
        <div className="space-y-6 lg:col-span-4">
          <Skeleton className="h-64 rounded-2xl" />
          <Skeleton className="h-48 rounded-2xl" />
          <Skeleton className="h-48 rounded-2xl" />
        </div>
      </div>
    </div>
  );
}
