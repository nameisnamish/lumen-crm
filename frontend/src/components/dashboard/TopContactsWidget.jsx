import { Link } from "react-router-dom";
import { Users } from "lucide-react";
import { Card, SectionHeading, Avatar } from "../ui";

export function TopContactsWidget({ contacts = [] }) {
  const top = contacts.slice(0, 5);
  const overflow = Math.max(contacts.length - top.length, 0);

  return (
    <Card className="p-6">
      <SectionHeading
        icon={Users}
        title="Key Relationships"
        subtitle="Recent active contacts"
        to="/contacts"
      />
      {contacts.length === 0 ? (
        <p className="mt-4 text-sm text-ink-soft">No contacts recorded yet.</p>
      ) : (
        <div className="mt-4 flex items-center justify-between">
          <div className="flex -space-x-2.5">
            {top.map((c) => (
              <Avatar
                key={c._id || c.id}
                name={c.name}
                src={c.avatar}
                size="md"
                className="ring-2 ring-surface shadow-xs transition hover:scale-105 hover:z-10"
              />
            ))}
            {overflow > 0 && (
              <div className="brand-gradient flex h-10 w-10 items-center justify-center rounded-full text-xs font-bold text-white ring-2 ring-surface shadow-xs">
                +{overflow}
              </div>
            )}
          </div>
          <Link
            to="/contacts"
            className="text-xs font-semibold text-brand-700 hover:text-brand-800 hover:underline"
          >
            View all ({contacts.length})
          </Link>
        </div>
      )}
    </Card>
  );
}
