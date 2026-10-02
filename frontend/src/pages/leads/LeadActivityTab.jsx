import { useOutletContext } from "react-router-dom";
import { Activity, CheckCircle, Mail, Phone, Sparkles } from "lucide-react";
import { Card } from "../../components/ui";
import { relative } from "../../lib/format";

export default function LeadActivityTab() {
  const { lead } = useOutletContext();
  if (!lead) return null;

  const activities = [
    {
      id: 1,
      type: "created",
      title: "Lead Created",
      description: `Opportunity added to pipeline with initial stage "${lead.status}".`,
      timestamp: lead.createdAt,
      icon: Activity,
      tint: "bg-brand-50 text-brand-600",
    },
    {
      id: 2,
      type: "email",
      title: "Outreach Email Sent",
      description: `Sent introduction email regarding enterprise partnership to ${lead.email}.`,
      timestamp: lead.updatedAt,
      icon: Mail,
      tint: "bg-sky-50 text-sky-600",
    },
    {
      id: 3,
      type: "stage",
      title: `Stage set to ${lead.status}`,
      description: `Priority updated to ${lead.priority}.`,
      timestamp: lead.updatedAt,
      icon: CheckCircle,
      tint: "bg-emerald-50 text-emerald-600",
    },
  ];

  return (
    <Card className="p-6">
      <h3 className="text-lg font-bold text-ink mb-6">Activity Timeline</h3>
      <div className="relative pl-6 border-l-2 border-line/80 space-y-6">
        {activities.map((act) => {
          const Icon = act.icon;
          return (
            <div key={act.id} className="relative group">
              <div className={`absolute -left-[35px] top-0 flex h-8 w-8 items-center justify-center rounded-full border-2 border-surface ${act.tint}`}>
                <Icon className="h-4 w-4" />
              </div>
              <div className="rounded-xl border border-line bg-surface p-4 shadow-xs">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-ink text-sm">{act.title}</h4>
                  <span className="text-xs text-ink-soft">{relative(act.timestamp)}</span>
                </div>
                <p className="mt-1 text-xs text-ink-soft">{act.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
