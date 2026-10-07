import { Trophy, Building2 } from "lucide-react";
import { Card, SectionHeading } from "../ui";
import { currency } from "../../lib/format";
import { STAGE_STYLES } from "../../lib/constants";
import { cn } from "../../lib/utils";

export function TopDealsCard({ leads = [] }) {
  const deals = [...leads]
    .filter((l) => l.status !== "Won" && l.status !== "Lost")
    .sort((a, b) => (b.value || 0) - (a.value || 0))
    .slice(0, 4);

  return (
    <Card className="flex flex-col p-6">
      <SectionHeading
        icon={Trophy}
        title="Top Open Deals"
        subtitle="Highest-value pipeline opportunities"
        to="/leads"
      />
      {deals.length === 0 ? (
        <p className="py-8 text-center text-sm text-ink-soft">No active open deals yet.</p>
      ) : (
        <ul className="mt-4 space-y-2.5">
          {deals.map((l, i) => {
            const style = STAGE_STYLES[l.status] || STAGE_STYLES.New;
            return (
              <li
                key={l._id || l.id}
                className="group flex items-center gap-3 rounded-xl border border-line/40 p-2.5 transition hover:border-line hover:bg-surface-muted/30"
              >
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-50 text-xs font-bold text-brand-700">
                  {i + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-ink group-hover:text-brand-700 transition">
                    {l.name}
                  </p>
                  <p className="flex items-center gap-1 truncate text-xs text-ink-soft">
                    <Building2 className="h-3 w-3" /> {l.company || "—"}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-ink">
                    {currency(l.value, { compact: true })}
                  </p>
                  <span
                    className={cn(
                      "inline-flex items-center text-[10px] font-semibold uppercase tracking-wider",
                      style.badge,
                      "bg-transparent px-0"
                    )}
                  >
                    {l.status}
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </Card>
  );
}
