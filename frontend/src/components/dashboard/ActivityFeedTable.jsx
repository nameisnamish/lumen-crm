import { Activity } from "lucide-react";
import { Card, SectionHeading, Avatar } from "../ui";
import { currency, shortDate, timeOf } from "../../lib/format";
import { STAGE_STYLES } from "../../lib/constants";
import { cn } from "../../lib/utils";

export function ActivityFeedTable({ leads = [] }) {
  return (
    <Card className="p-6">
      <SectionHeading
        icon={Activity}
        title="Recent Lead Activity"
        subtitle="Live movement across opportunities"
        to="/leads"
      />

      {leads.length === 0 ? (
        <p className="py-10 text-center text-sm text-ink-soft">No recent activity yet.</p>
      ) : (
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-line text-left text-xs uppercase tracking-wider text-ink-soft">
                <th className="pb-3 font-semibold">Lead Contact</th>
                <th className="pb-3 font-semibold">Date</th>
                <th className="hidden pb-3 font-semibold sm:table-cell">Time</th>
                <th className="pb-3 font-semibold">Pipeline Stage</th>
                <th className="pb-3 text-right font-semibold">Value</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line/60">
              {leads.map((l) => {
                const style = STAGE_STYLES[l.status] || STAGE_STYLES.New;
                return (
                  <tr
                    key={l.id || l._id}
                    className="group transition hover:bg-surface-muted/50"
                  >
                    <td className="py-3.5">
                      <div className="flex items-center gap-3">
                        <Avatar name={l.name} size="sm" />
                        <div className="min-w-0">
                          <p className="font-semibold text-ink group-hover:text-brand-700 transition">
                            {l.name}
                          </p>
                          <p className="truncate text-xs text-ink-soft">{l.company || "—"}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 text-xs text-ink-soft">{shortDate(l.updatedAt)}</td>
                    <td className="hidden py-3.5 text-xs text-ink-soft sm:table-cell">
                      {timeOf(l.updatedAt)}
                    </td>
                    <td className="py-3.5">
                      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-ink">
                        <span className={cn("h-2 w-2 rounded-full", style.dot)} />
                        {l.status}
                      </span>
                    </td>
                    <td className="py-3.5 text-right font-bold text-ink">
                      {currency(l.value)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
}
