import { Link, useLocation } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";

export function Breadcrumbs() {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  if (pathnames.length === 0) return null;

  return (
    <nav className="flex items-center gap-1.5 text-xs text-ink-soft mb-4">
      <Link to="/" className="flex items-center gap-1 hover:text-ink transition">
        <Home className="h-3.5 w-3.5" />
        <span>Dashboard</span>
      </Link>
      {pathnames.map((value, index) => {
        const to = `/${pathnames.slice(0, index + 1).join("/")}`;
        const isLast = index === pathnames.length - 1;
        const formatted = value.charAt(0).toUpperCase() + value.slice(1);

        return (
          <div key={to} className="flex items-center gap-1.5">
            <ChevronRight className="h-3 w-3 text-ink-soft/60" />
            {isLast ? (
              <span className="font-semibold text-ink">{formatted}</span>
            ) : (
              <Link to={to} className="hover:text-ink transition">
                {formatted}
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
}
