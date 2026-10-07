import { useEffect, useState, useMemo } from "react";
import { format } from "date-fns";
import {
  KpiRibbon,
  PipelineEngagementSection,
  UnifiedPipelineFunnel,
  ActivityFeedTable,
  UpcomingTasksCard,
  TopDealsCard,
  TopContactsWidget,
} from "../../components/dashboard";
import { AiInsightsCard } from "../../components/ai/AiInsightsCard";
import { AiCopilotPanel } from "../../components/ai/AiCopilotPanel";
import { analyticsApi, contactsApi, leadsApi, tasksApi } from "../../lib/services";
import { useAuth } from "../../context/AuthContext";
import { DashboardHeader } from "./DashboardHeader";
import { DashboardSkeleton } from "./DashboardSkeleton";

/* Stage probabilities for weighted forecast calculation */
const STAGE_PROB = { New: 0.1, Qualified: 0.3, Proposal: 0.6, Won: 1.0, Lost: 0.0 };

export default function DashboardPage() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [allLeads, setAllLeads] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [dateRange, setDateRange] = useState("6m"); // "1m" | "3m" | "6m" | "12m" | "all"

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

  const activeLeads = useMemo(() => {
    if (data?.filteredLeads?.length) {
      return data.filteredLeads;
    }
    return allLeads;
  }, [data, allLeads]);

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
  const rangeLabel =
    dateRange === "all"
      ? "All-Time Historical"
      : `${format(start, "dd MMM")} – ${format(today, "dd MMM, yyyy")}`;

  return (
    <div className="space-y-6">
      {/* Header Row */}
      <DashboardHeader
        user={user}
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
        rangeLabel={rangeLabel}
      />

      {/* 1. Top Executive KPI Strip */}
      <KpiRibbon
        stats={stats}
        forecast={forecast}
        trend={data?.trend || []}
        leadsCount={activeLeads.length}
      />

      {/* 2. Primary 8 : 4 Grid Layout */}
      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
        {/* Main Workspace: Analytics & Deal Flow (8 Cols) */}
        <div className="space-y-6 lg:col-span-8">
          <PipelineEngagementSection
            trend={data?.trend || []}
            leads={activeLeads}
            dateRange={dateRange}
            cadence={data?.cadence || "Monthly"}
          />

          <UnifiedPipelineFunnel leads={activeLeads} pipeline={data?.pipeline || []} />

          <ActivityFeedTable leads={data?.recentLeads || activeLeads.slice(0, 6)} />
        </div>

        {/* Action & Intelligence Hub: Daily Co-pilot (4 Cols) */}
        <div className="space-y-6 lg:col-span-4">
          <div className="space-y-5">
            <AiCopilotPanel />
            <AiInsightsCard />
          </div>

          <UpcomingTasksCard tasks={tasks} />

          <TopDealsCard leads={activeLeads} />

          <TopContactsWidget contacts={contacts} />
        </div>
      </div>
    </div>
  );
}
