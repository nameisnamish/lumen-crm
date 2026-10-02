import { StickyNote, Pin, Link2, FileText } from "lucide-react";
import { Card } from "../../components/ui";
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

export function NotesStats({ kpis }) {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      <StatTile
        icon={StickyNote}
        tint="bg-brand-50 text-brand-600"
        label="Total notes"
        value={kpis.total}
      />
      <StatTile
        icon={Pin}
        tint="bg-amber-50 text-amber-600"
        label="Pinned"
        value={kpis.pinned}
      />
      <StatTile
        icon={Link2}
        tint="bg-sky-50 text-sky-600"
        label="Linked"
        value={kpis.linked}
      />
      <StatTile
        icon={FileText}
        tint="bg-slate-50 text-slate-500"
        label="Unlinked"
        value={kpis.unlinked}
      />
    </div>
  );
}
