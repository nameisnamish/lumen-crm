import { DollarSign, Layers, Target, TrendingUp } from "lucide-react";
import { Card } from "../../components/ui";
import { currency } from "../../lib/format";
import { cn } from "../../lib/utils";

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

export function PipelineStats({ totalValue, openDealsCount, wonValue, forecast }) {
  return (
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
        value={openDealsCount}
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
  );
}
