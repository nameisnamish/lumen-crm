import { Link } from "react-router-dom";
import { MoreHorizontal, Pencil, Trash2, Building2, Mail, Phone, ExternalLink } from "lucide-react";
import { Card, Badge, Avatar, Dropdown, DropdownItem } from "../../components/ui";
import { STAGE_STYLES, PRIORITY_STYLES } from "../../lib/constants";
import { currency } from "../../lib/format";

export function LeadsCardGrid({ leads, selected, onToggleRow, onEdit, onDelete }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {leads.map((l) => {
        const stage = STAGE_STYLES[l.status] || STAGE_STYLES.New;
        const priority = PRIORITY_STYLES[l.priority] || PRIORITY_STYLES.Medium;
        const isSel = selected.has(l._id);

        return (
          <Card
            key={l._id}
            className={`group relative flex flex-col justify-between p-5 transition hover:shadow-md ${
              isSel ? "border-brand-500 ring-2 ring-brand-500/20" : ""
            }`}
          >
            <div>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={isSel}
                    onChange={() => onToggleRow(l._id)}
                    className="h-4 w-4 rounded border-line accent-brand-600"
                  />
                  <Avatar name={l.name} size="md" />
                  <div>
                    <Link
                      to={`/leads/${l._id}`}
                      className="font-bold text-ink hover:text-brand-600 flex items-center gap-1 group-hover:underline"
                    >
                      {l.name}
                      <ExternalLink className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                    <div className="flex items-center gap-1 text-xs text-ink-soft">
                      <Building2 className="h-3 w-3" />
                      <span>{l.company}</span>
                    </div>
                  </div>
                </div>

                <Dropdown
                  trigger={
                    <button className="rounded-lg p-1 text-ink-soft hover:bg-surface-dark/5 hover:text-ink">
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                  }
                >
                  <DropdownItem onClick={() => onEdit(l)}>
                    <Pencil className="h-4 w-4 text-ink-soft" /> Edit
                  </DropdownItem>
                  <DropdownItem onClick={() => onDelete(l)} className="text-rose-600">
                    <Trash2 className="h-4 w-4" /> Delete
                  </DropdownItem>
                </Dropdown>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <Badge variant={stage.variant || "neutral"} className="gap-1">
                  {stage.dot && <span className={`h-1.5 w-1.5 rounded-full ${stage.dot}`} />}
                  {l.status}
                </Badge>
                <Badge variant={priority.variant}>{l.priority}</Badge>
              </div>

              <div className="mt-4 space-y-1.5 text-xs text-ink-soft">
                {l.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="h-3.5 w-3.5 text-ink-soft/70" />
                    <span className="truncate">{l.email}</span>
                  </div>
                )}
                {l.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-3.5 w-3.5 text-ink-soft/70" />
                    <span>{l.phone}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-5 flex items-center justify-between border-t border-line/60 pt-3 text-xs">
              <span className="text-ink-soft font-medium">Value</span>
              <span className="text-base font-bold text-ink">{currency(l.value || 0)}</span>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
