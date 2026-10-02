import { Link } from "react-router-dom";
import { Compass, Home, ArrowLeft } from "lucide-react";
import { Button, Card } from "../components/ui";

export default function NotFoundPage() {
  return (
    <div className="flex min-h-[500px] flex-col items-center justify-center p-6 text-center">
      <Card className="max-w-lg p-8">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
          <Compass className="h-8 w-8 animate-spin-slow" />
        </div>
        <span className="text-sm font-semibold tracking-wider text-brand-600 uppercase">404 Error</span>
        <h1 className="mt-1 text-3xl font-bold text-ink">Page Not Found</h1>
        <p className="mt-3 text-sm text-ink-soft">
          The page or lead detail record you are looking for does not exist or has been moved to another location.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Button variant="outline" onClick={() => window.history.back()}>
            <ArrowLeft className="h-4 w-4" /> Go Back
          </Button>
          <Link to="/">
            <Button>
              <Home className="h-4 w-4" /> Return to Dashboard
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
