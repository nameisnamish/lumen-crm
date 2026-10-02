import React from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button, Card } from "../ui";

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-[400px] items-center justify-center p-6">
          <Card className="max-w-md p-6 text-center shadow-lg">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
              <AlertTriangle className="h-7 w-7" />
            </div>
            <h2 className="text-xl font-bold text-ink">Something went wrong</h2>
            <p className="mt-2 text-sm text-ink-soft">
              {this.state.error?.message || "An unexpected error occurred in the application."}
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <Button onClick={this.handleReset}>
                <RefreshCw className="h-4 w-4" /> Reload Page
              </Button>
            </div>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}
