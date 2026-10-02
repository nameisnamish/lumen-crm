import { Shield } from "lucide-react";
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Badge,
} from "../../components/ui";
import { shortDate } from "../../lib/format";
import { cn } from "../../lib/utils";

function SectionIcon({ icon: Icon, className }) {
  return (
    <div
      className={cn(
        "flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-brand-50",
        className
      )}
    >
      <Icon className="h-4 w-4 text-brand-700" />
    </div>
  );
}

export function AccountCard({ user, logout }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <SectionIcon icon={Shield} />
          <div>
            <CardTitle>Account</CardTitle>
            <CardDescription>Your account details and session.</CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-5">
        <div className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Role */}
          <div className="rounded-2xl border border-line bg-surface-muted px-4 py-3">
            <p className="mb-1.5 text-xs font-medium uppercase tracking-wide text-ink-soft">
              Role
            </p>
            <Badge className="bg-brand-50 text-brand-700 border border-brand-200/60 capitalize">
              {user?.role || "Member"}
            </Badge>
          </div>

          {/* Member since */}
          <div className="rounded-2xl border border-line bg-surface-muted px-4 py-3">
            <p className="mb-1.5 text-xs font-medium uppercase tracking-wide text-ink-soft">
              Member since
            </p>
            <p className="text-sm font-semibold text-ink">
              {shortDate(user?.createdAt)}
            </p>
          </div>
        </div>

        <div className="flex justify-end">
          <Button variant="danger" onClick={logout}>
            Log out
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
