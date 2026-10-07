import {
  Target,
  DollarSign,
  ArrowUpRight,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { ResponsiveContainer, AreaChart, Area } from "recharts";
import { Card, Badge } from "../ui";
import { currency } from "../../lib/format";

export function KpiRibbon({ stats = {}, forecast = 0, trend = [], leadsCount = 0 }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {/* 1. Total Pipeline Value (Hero Card with Gradient) */}
      <div className="brand-gradient relative overflow-hidden rounded-2xl p-5 text-white shadow-[var(--shadow-card)] flex flex-col justify-between">
        <div className="absolute -right-8 -top-10 h-36 w-36 rounded-full bg-white/10 blur-xl pointer-events-none" />
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-white/80">
            Pipeline Value
          </span>
          <span className="rounded-full bg-white/20 p-1.5 backdrop-blur-sm">
            <DollarSign className="h-4 w-4 text-white" />
          </span>
        </div>
        <div className="mt-3">
          <p className="font-display text-3xl font-extrabold tracking-tight">
            {currency(stats.pipelineValue || 0)}
          </p>
          <div className="mt-2 flex items-center justify-between text-xs text-white/85">
            <span>{stats.totalLeads ?? leadsCount} active opportunities</span>
            <span className="inline-flex items-center font-semibold text-white">
              <ArrowUpRight className="h-3.5 w-3.5 mr-0.5" /> +12.4%
            </span>
          </div>
        </div>
      </div>

      {/* 2. Revenue Won (with mini sparkline) */}
      <Card className="p-5 flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-ink-soft">
            Revenue Closed
          </span>
          <Badge className="bg-emerald-50 text-emerald-700">
            <CheckCircle2 className="h-3 w-3 mr-1" /> Won
          </Badge>
        </div>
        <div className="mt-2">
          <p className="font-display text-2xl font-bold text-ink">
            {currency(stats.revenueWon || 0)}
          </p>
          <div className="h-10 w-full mt-1">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trend} margin={{ top: 2, right: 0, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="miniWon" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area
                  type="monotone"
                  dataKey="won"
                  stroke="#10b981"
                  strokeWidth={2}
                  fill="url(#miniWon)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </Card>

      {/* 3. Weighted Forecast */}
      <Card className="p-5 flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-ink-soft">
            Weighted Forecast
          </span>
          <Badge className="bg-brand-50 text-brand-700">
            <Sparkles className="h-3 w-3 mr-1" /> AI Prob.
          </Badge>
        </div>
        <div className="mt-3">
          <p className="font-display text-2xl font-bold text-ink">
            {currency(forecast, { compact: true })}
          </p>
          <p className="mt-2 text-xs text-ink-soft flex items-center justify-between">
            <span>Expected close total</span>
            <span className="font-medium text-brand-700">Stage adjusted</span>
          </p>
        </div>
      </Card>

      {/* 4. Win / Conversion Rate */}
      <Card className="p-5 flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-ink-soft">
            Conversion Rate
          </span>
          <Badge className="bg-sky-50 text-sky-700">
            <Target className="h-3 w-3 mr-1" /> Win Rate
          </Badge>
        </div>
        <div className="mt-3">
          <div className="flex items-baseline gap-2">
            <p className="font-display text-2xl font-bold text-ink">
              {stats.conversionRate ?? 0}%
            </p>
            <span className="text-xs font-semibold text-emerald-600 inline-flex items-center">
              <ArrowUpRight className="h-3 w-3" /> +4.1%
            </span>
          </div>
          <p className="mt-2 text-xs text-ink-soft">
            {stats.openTasks ?? 0} open follow-ups pending
          </p>
        </div>
      </Card>
    </div>
  );
}
