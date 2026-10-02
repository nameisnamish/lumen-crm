import { useOutletContext } from "react-router-dom";
import { Building2, Mail, Phone, Calendar, Tag, ShieldAlert } from "lucide-react";
import { Card, Badge } from "../../components/ui";
import { currency, date } from "../../lib/format";

export default function LeadOverviewTab() {
  const { lead } = useOutletContext();
  if (!lead) return null;

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      {/* Primary details */}
      <Card className="lg:col-span-2 space-y-6 p-6">
        <h3 className="text-lg font-bold text-ink">Opportunity Summary</h3>
        <p className="text-sm text-ink-soft leading-relaxed">
          {lead.notes || "No detailed overview provided for this opportunity. Add notes or generate AI insights to update key decision parameters."}
        </p>

        <div className="border-t border-line/60 pt-4 grid grid-cols-2 gap-4">
          <div>
            <span className="text-xs font-medium text-ink-soft">Target Company</span>
            <p className="text-sm font-semibold text-ink flex items-center gap-1.5 mt-1">
              <Building2 className="h-4 w-4 text-brand-600" /> {lead.company}
            </p>
          </div>
          <div>
            <span className="text-xs font-medium text-ink-soft">Primary Contact</span>
            <p className="text-sm font-semibold text-ink flex items-center gap-1.5 mt-1">
              <Mail className="h-4 w-4 text-brand-600" /> {lead.email}
            </p>
          </div>
          <div>
            <span className="text-xs font-medium text-ink-soft">Creation Date</span>
            <p className="text-sm font-semibold text-ink flex items-center gap-1.5 mt-1">
              <Calendar className="h-4 w-4 text-brand-600" /> {date(lead.createdAt)}
            </p>
          </div>
          <div>
            <span className="text-xs font-medium text-ink-soft">Pipeline Stage</span>
            <p className="text-sm font-semibold text-ink mt-1">{lead.status}</p>
          </div>
        </div>

        {lead.tags && lead.tags.length > 0 && (
          <div className="border-t border-line/60 pt-4">
            <span className="text-xs font-medium text-ink-soft block mb-2">Associated Tags</span>
            <div className="flex flex-wrap gap-1.5">
              {lead.tags.map((t) => (
                <Badge key={t} variant="neutral">
                  <Tag className="h-3 w-3 mr-1" /> {t}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </Card>

      {/* AI Risk & Insights side card */}
      <Card className="p-6 space-y-4 bg-gradient-to-br from-surface to-brand-50/20 border border-brand-100">
        <div className="flex items-center gap-2 text-brand-600 font-bold">
          <ShieldAlert className="h-5 w-5" />
          <span>AI Health & Risk Assessment</span>
        </div>

        <div className="rounded-xl bg-surface p-4 border border-line">
          <span className="text-xs font-medium text-ink-soft">Estimated Deal Velocity</span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-emerald-600">82%</span>
            <span className="text-xs text-emerald-600 font-medium">High Probability</span>
          </div>
        </div>

        <div className="space-y-2 text-xs text-ink-soft">
          <p>• Lead responded to initial proposal within 24 hours.</p>
          <p>• Value of {currency(lead.value || 0)} matches top-tier tier threshold.</p>
          <p>• Recommend scheduling executive review before contract sign-off.</p>
        </div>
      </Card>
    </div>
  );
}
