import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { Sparkles, Mail, Lightbulb, RefreshCw } from "lucide-react";
import { Card, Button, Spinner } from "../../components/ui";
import { aiApi } from "../../lib/services";
import { toast } from "sonner";

export default function LeadAiTab() {
  const { lead } = useOutletContext();
  const [summary, setSummary] = useState("");
  const [emailDraft, setEmailDraft] = useState("");
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [loadingEmail, setLoadingEmail] = useState(false);

  const handleGenerateSummary = async () => {
    setLoadingSummary(true);
    try {
      const res = await aiApi.leadSummary({ leadId: lead._id, company: lead.company });
      setSummary(res.summary || res.message || "Summary generated successfully.");
    } catch {
      toast.error("AI summary failed");
    } finally {
      setLoadingSummary(false);
    }
  };

  const handleGenerateEmail = async () => {
    setLoadingEmail(true);
    try {
      const res = await aiApi.generateEmail({ leadName: lead.name, company: lead.company });
      setEmailDraft(res.email || res.body || "Email draft generated successfully.");
    } catch {
      toast.error("Email generation failed");
    } finally {
      setLoadingEmail(false);
    }
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      {/* AI Lead Summary */}
      <Card className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-brand-600 font-bold">
            <Sparkles className="h-5 w-5" />
            <span>AI Executive Briefing</span>
          </div>
          <Button variant="outline" size="sm" onClick={handleGenerateSummary} disabled={loadingSummary}>
            {loadingSummary ? <Spinner size="sm" /> : <RefreshCw className="h-3.5 w-3.5" />}
            Generate Brief
          </Button>
        </div>

        {summary ? (
          <div className="rounded-xl border border-line bg-surface-muted/30 p-4 text-sm text-ink leading-relaxed">
            {summary}
          </div>
        ) : (
          <p className="text-xs text-ink-soft italic">
            Click "Generate Brief" to create an AI overview of deal health, objections, and recommended next steps for {lead.name}.
          </p>
        )}
      </Card>

      {/* AI Email Composer */}
      <Card className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sky-600 font-bold">
            <Mail className="h-5 w-5" />
            <span>AI Outreach Drafter</span>
          </div>
          <Button variant="outline" size="sm" onClick={handleGenerateEmail} disabled={loadingEmail}>
            {loadingEmail ? <Spinner size="sm" /> : <Sparkles className="h-3.5 w-3.5" />}
            Draft Email
          </Button>
        </div>

        {emailDraft ? (
          <div className="rounded-xl border border-line bg-surface-muted/30 p-4 text-xs font-mono text-ink leading-relaxed whitespace-pre-wrap">
            {emailDraft}
          </div>
        ) : (
          <p className="text-xs text-ink-soft italic">
            Click "Draft Email" to auto-generate a personalized follow-up email tailored to {lead.company}.
          </p>
        )}
      </Card>
    </div>
  );
}
