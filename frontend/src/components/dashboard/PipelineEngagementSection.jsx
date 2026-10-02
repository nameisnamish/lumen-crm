import { CreditCard, PieChart as PieIcon, Activity } from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Card, SectionHeading, Badge } from "../ui";
import { SOURCE_COLORS } from "../../lib/constants";

const DEFAULT_SOURCE_COLORS = ["#0ea5e9", "#38bdf8", "#0369a1", "#7dd3fc", "#0284c7", "#bae6fd"];

export function PipelineEngagementSection({
  trend = [],
  leads = [],
  dateRange = "6m",
  cadence = "Monthly",
}) {
  // Group leads by source
  const grouped = leads.reduce((acc, l) => {
    const key = l.source || "Other";
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  const totalCount = leads.length || 1;
  const sourceDataset = Object.entries(grouped)
    .map(([name, value]) => ({
      name,
      value,
      pct: Math.round((value / totalCount) * 100),
    }))
    .sort((a, b) => b.value - a.value);

  // Peak calculation for engagement chart
  const counts = trend.map((t) => t.leads || 0);
  const max = Math.max(...counts, 1);
  const maxIndex = counts.indexOf(max);
  const prev = maxIndex > 0 ? counts[maxIndex - 1] : 0;
  const growth = prev > 0 ? Math.round(((max - prev) / prev) * 1000) / 10 : 18.5;

  const renderPeak = (props) => {
    const { x, y, width, index } = props;
    if (index !== maxIndex || max === 0) return null;
    const cx = x + width / 2;
    return (
      <g>
        <circle cx={cx} cy={y} r={5} fill="#0369a1" stroke="#fff" strokeWidth={2} />
        <rect x={cx - 26} y={y - 34} width={52} height={22} rx={11} fill="#0369a1" />
        <text x={cx} y={y - 19} textAnchor="middle" fontSize="11" fontWeight="700" fill="#fff">
          +{growth}%
        </text>
      </g>
    );
  };

  // Subtitle based on cadence
  const cadenceSubtitle = {
    "1m": "Weekly new lead velocity (Last 30 days)",
    "3m": "Monthly intake velocity (Last 3 months)",
    "6m": "Monthly intake velocity (Last 6 months)",
    "12m": "Quarterly intake pacing (Last 12 months)",
  }[dateRange] || "Lead intake velocity";

  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-12 items-stretch">
      {/* 1. Main Velocity Bar Chart (7 Cols) with Adaptive Cadence */}
      <Card className="flex flex-col justify-between p-6 lg:col-span-7">
        <SectionHeading
          icon={CreditCard}
          title="Pipeline Engagement"
          subtitle={cadenceSubtitle}
          action={
            <Badge className="bg-brand-50 text-brand-700 font-semibold px-2.5 py-1">
              <Activity className="h-3 w-3 mr-1 text-brand-600" />
              {dateRange === "1m"
                ? "Weekly cadence"
                : dateRange === "12m"
                ? "Quarterly cadence"
                : "Monthly cadence"}
            </Badge>
          }
        />
        <div className="mt-5 w-full">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart
              data={trend}
              barCategoryGap={dateRange === "12m" || dateRange === "1m" ? "32%" : "26%"}
              margin={{ top: 38, right: 10, left: -15, bottom: 0 }}
            >
              <CartesianGrid vertical={false} stroke="#e8eef3" strokeDasharray="4 4" />
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#64748b", fontSize: 12 }}
                dy={6}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#64748b", fontSize: 12 }}
                width={30}
                tickFormatter={(v) => (v >= 1000 ? `${v / 1000}k` : v)}
              />
              <Tooltip cursor={{ fill: "#f1f5f9" }} content={<ChartTooltip unit=" leads" />} />
              <Bar
                dataKey="leads"
                radius={[10, 10, 10, 10]}
                maxBarSize={dateRange === "12m" || dateRange === "1m" ? 52 : 38}
                label={renderPeak}
              >
                {trend.map((t, i) => (
                  <Cell key={i} fill={i === maxIndex ? "#0369a1" : "#bae6fd"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* 2. Leads by Source Donut (5 Cols) — Balanced and Centered */}
      <Card className="flex flex-col p-6 lg:col-span-5">
        <SectionHeading icon={PieIcon} title="Leads by Source" subtitle="Origin channels" />

        {sourceDataset.length === 0 ? (
          <div className="my-auto flex flex-col items-center justify-center py-10 text-center">
            <p className="text-sm text-ink-soft">No lead sources for this period.</p>
          </div>
        ) : (
          <div className="my-auto flex flex-1 flex-col justify-center pt-3 pb-1">
            <div className="flex items-center justify-between gap-4">
              {/* Center Donut */}
              <div className="relative h-36 w-36 shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={sourceDataset}
                      dataKey="value"
                      innerRadius={44}
                      outerRadius={66}
                      paddingAngle={3}
                      stroke="none"
                    >
                      {sourceDataset.map((_, i) => (
                        <Cell
                          key={i}
                          fill={DEFAULT_SOURCE_COLORS[i % DEFAULT_SOURCE_COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip content={<ChartTooltip unit=" leads" />} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                  <span className="font-display text-2xl font-bold text-ink">{leads.length}</span>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-ink-soft">
                    leads
                  </span>
                </div>
              </div>

              {/* Source Legend Breakdown */}
              <ul className="flex-1 space-y-2 min-w-0">
                {sourceDataset.slice(0, 5).map((d, i) => (
                  <li key={d.name} className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-2 text-ink-soft truncate max-w-[130px]">
                      <span
                        className="h-2.5 w-2.5 shrink-0 rounded-full shadow-xs"
                        style={{
                          background: DEFAULT_SOURCE_COLORS[i % DEFAULT_SOURCE_COLORS.length],
                        }}
                      />
                      <span className="truncate font-medium text-ink">{d.name}</span>
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-ink">{d.value}</span>
                      <span className="text-[11px] text-ink-soft w-7 text-right">
                        {d.pct}%
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}

function ChartTooltip({ active, payload, label, prefix = "", unit = "" }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-line bg-surface px-3 py-2 shadow-[var(--shadow-pop)]">
      <p className="text-xs font-medium text-ink-soft">{label}</p>
      <p className="text-sm font-semibold text-ink">
        {prefix}
        {Number(payload[0].value).toLocaleString()}
        {unit}
      </p>
    </div>
  );
}
