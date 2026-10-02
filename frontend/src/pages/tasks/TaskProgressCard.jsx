import { Card } from "../../components/ui";

export function TaskProgressCard({ completed, total }) {
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
  return (
    <Card className="px-5 py-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-ink">
          {completed} of {total} tasks done
        </span>
        <span className="text-sm font-semibold text-brand-700">{pct}%</span>
      </div>
      {/* Track */}
      <div className="h-2 w-full rounded-full bg-surface-muted overflow-hidden">
        {/* Fill */}
        <div
          className="h-full rounded-full bg-linear-to-r from-brand-400 to-brand-600 transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
    </Card>
  );
}
