import { useEffect, useState } from "react";
import { Sparkles, CheckCircle2, AlertCircle } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Badge,
  Spinner,
} from "../../components/ui";
import { aiApi } from "../../lib/services";

export function AiIntegrationCard() {
  const [status, setStatus] = useState(null);

  useEffect(() => {
    aiApi
      .status()
      .then((res) => setStatus(res))
      .catch(() => setStatus({ success: false, configured: false, model: null }));
  }, []);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-brand-50">
            <Sparkles className="h-4 w-4 text-brand-600" />
          </div>
          <div>
            <CardTitle>AI Integration</CardTitle>
            <CardDescription>
              Google Gemini powers summaries, email drafts and insights.
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-5">
        {status === null ? (
          <div className="flex items-center gap-3 py-2">
            <Spinner className="p-0" />
            <span className="text-sm text-ink-soft">Checking status…</span>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Status + model row */}
            <div className="flex flex-wrap items-center gap-3">
              {status.configured ? (
                <Badge className="bg-brand-50 text-brand-700 border border-brand-200/60">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Connected
                </Badge>
              ) : (
                <Badge className="bg-amber-50 text-amber-700 border border-amber-200/60">
                  <AlertCircle className="h-3.5 w-3.5" />
                  Not configured
                </Badge>
              )}

              {status.model && (
                <span className="rounded-lg border border-line bg-surface-muted px-2.5 py-1 font-mono text-xs text-ink-soft">
                  {status.model}
                </span>
              )}
            </div>

            {/* Setup note */}
            {!status.configured && (
              <div className="rounded-2xl border border-amber-200/60 bg-amber-50/60 px-4 py-3.5 text-sm text-amber-800">
                <p className="font-medium mb-1">Connect your Gemini key</p>
                <p className="text-amber-700/80 leading-relaxed">
                  Add{" "}
                  <code className="rounded bg-amber-100 px-1.5 py-0.5 font-mono text-xs text-amber-900">
                    GEMINI_API_KEY=your_key_here
                  </code>{" "}
                  to the backend <code className="font-mono text-xs">.env</code>{" "}
                  file and restart the server to enable AI features.
                </p>
              </div>
            )}

            {status.configured && (
              <p className="text-sm text-ink-soft">
                AI features are active. Summaries, email drafts, and pipeline
                insights are all powered by{" "}
                <span className="font-medium text-ink">{status.model}</span>.
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
