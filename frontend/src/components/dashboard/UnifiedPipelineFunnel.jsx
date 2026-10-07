import { ArrowUpRight, ArrowDownRight, Layers } from "lucide-react";
import { Card, SectionHeading } from "../ui";
import { currency } from "../../lib/format";
import { STAGE_STYLES } from "../../lib/constants";
import { cn } from "../../lib/utils";

export function UnifiedPipelineFunnel({ leads = [], pipeline = [] }) {
  const stages = ["New", "Qualified", "Proposal", "Won"];

  // Pipeline map for total value per stage
  const stageValueMap = pipeline.reduce((acc, item) => {
    acc[item.stage] = item.value || 0;
    return acc;
  }, {});

  // Lead count per stage
  const counts = {};
  stages.forEach((s) => (counts[s] = 0));
  leads.forEach((l) => {
    if (counts[l.status] !== undefined) counts[l.status]++;
  });

  const maxCount = Math.max(...stages.map((s) => counts[s]), 1);
  const totalPipelineVal = Object.values(stageValueMap).reduce((a, b) => a + b, 0);

  return (
    <Card className="p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-2">
        <SectionHeading
          icon={Layers}
          title="Pipeline Funnel & Conversion"
          subtitle="Stage progression and deal value volume"
          to="/pipeline"
        />
        <div className="text-right">
          <span className="text-xs text-ink-soft">Active Volume: </span>
          <span className="text-sm font-bold text-ink">
            {currency(totalPipelineVal, { compact: true })}
          </span>
        </div>
      </div>

      <div className="mt-5 space-y-4">
        {stages.map((stage, i) => {
          const style = STAGE_STYLES[stage] || STAGE_STYLES.New;
          const count = counts[stage];
          const val = stageValueMap[stage] || 0;
          const prevCount = i > 0 ? counts[stages[i - 1]] : null;
          const convPct =
            prevCount && prevCount > 0
              ? Math.round((count / prevCount) * 100)
              : null;
          const widthPct = Math.max((count / maxCount) * 100, 6);

          return (
            <div
              key={stage}
              className="group rounded-xl border border-line/60 bg-surface-muted/30 p-3.5 transition hover:border-line hover:bg-surface-muted/60"
            >
              <div className="mb-2 flex items-center justify-between text-sm">
                {/* Stage Name & Count */}
                <div className="flex items-center gap-2.5">
                  <span className={cn("h-3 w-3 rounded-full shadow-sm", style.dot)} />
                  <span className="font-semibold text-ink">{stage}</span>
                  <span className="rounded-full bg-surface px-2 py-0.5 text-xs font-medium text-ink-soft shadow-xs">
                    {count} {count === 1 ? "lead" : "leads"}
                  </span>
                </div>

                {/* Stage Value & Conversion % */}
                <div className="flex items-center gap-4 text-xs">
                  {convPct !== null ? (
                    <span
                      className={cn(
                        "inline-flex items-center font-medium",
                        convPct >= 50 ? "text-emerald-600" : "text-amber-600"
                      )}
                    >
                      {convPct >= 50 ? (
                        <ArrowUpRight className="h-3.5 w-3.5 mr-0.5" />
                      ) : (
                        <ArrowDownRight className="h-3.5 w-3.5 mr-0.5" />
                      )}
                      {convPct}% conv.
                    </span>
                  ) : (
                    <span className="text-ink-soft">Funnel Entry</span>
                  )}

                  <span className="font-bold text-ink text-sm">
                    {currency(val, { compact: true })}
                  </span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="h-2.5 overflow-hidden rounded-full bg-surface shadow-inner">
                <div
                  className={cn("h-full rounded-full transition-all duration-700", style.bar)}
                  style={{ width: `${widthPct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
