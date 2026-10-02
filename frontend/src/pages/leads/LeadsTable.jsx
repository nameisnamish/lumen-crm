import { Link } from "react-router-dom";
import { MoreHorizontal, Pencil, Trash2, ChevronUp, ChevronDown, ExternalLink } from "lucide-react";
import { Badge, Avatar, Dropdown, DropdownItem } from "../../components/ui";
import { STAGE_STYLES, PRIORITY_STYLES } from "../../lib/constants";
import { currency, relative } from "../../lib/format";

export function LeadsTable({
  leads,
  selected,
  onToggleRow,
  onToggleAll,
  allSelected,
  sort,
  onSort,
  onEdit,
  onDelete,
}) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-line bg-surface shadow-sm">
      <table className="w-full text-sm">
        <thead className="border-b border-line bg-surface-muted/40">
          <tr className="text-left text-xs uppercase tracking-wide text-ink-soft">
            <th className="w-12 pl-6 py-3.5">
              <input
                type="checkbox"
                checked={allSelected}
                onChange={onToggleAll}
                className="h-4 w-4 rounded border-line accent-brand-600"
              />
            </th>
            <th
              className="cursor-pointer px-6 py-3.5 font-medium transition hover:text-ink"
              onClick={() => onSort("name")}
            >
              <div className="flex items-center gap-1">
                Lead
                {sort.key === "name" && (sort.dir === "asc" ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />)}
              </div>
            </th>
            <th className="px-6 py-3.5 font-medium">Stage</th>
            <th className="px-6 py-3.5 font-medium">Priority</th>
            <th className="px-6 py-3.5 font-medium">Source</th>
            <th
              className="cursor-pointer px-6 py-3.5 text-right font-medium transition hover:text-ink"
              onClick={() => onSort("value")}
            >
              <div className="flex items-center justify-end gap-1">
                Value
                {sort.key === "value" && (sort.dir === "asc" ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />)}
              </div>
            </th>
            <th
              className="cursor-pointer px-6 py-3.5 font-medium transition hover:text-ink"
              onClick={() => onSort("updatedAt")}
            >
              <div className="flex items-center gap-1">
                Updated
                {sort.key === "updatedAt" && (sort.dir === "asc" ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />)}
              </div>
            </th>
            <th className="px-6 py-3.5" />
          </tr>
        </thead>
        <tbody className="divide-y divide-line/60">
          {leads.map((l) => {
            const stage = STAGE_STYLES[l.status] || STAGE_STYLES.New;
            const priority = PRIORITY_STYLES[l.priority] || PRIORITY_STYLES.Medium;
            const isSel = selected.has(l._id);

            return (
              <tr key={l._id} className={`group transition hover:bg-surface-muted/30 ${isSel ? "bg-brand-500/5" : ""}`}>
                <td className="pl-6 py-4">
                  <input
                    type="checkbox"
                    checked={isSel}
                    onChange={() => onToggleRow(l._id)}
                    className="h-4 w-4 rounded border-line accent-brand-600"
                  />
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <Avatar name={l.name} />
                    <div className="min-w-0">
                      <Link
                        to={`/leads/${l._id}`}
                        className="font-semibold text-ink hover:text-brand-600 flex items-center gap-1.5 group-hover:underline"
                      >
                        {l.name}
                        <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </Link>
                      <p className="text-xs text-ink-soft truncate">{l.company} · {l.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <Badge variant={stage.variant || "neutral"} className="gap-1.5">
                    {stage.dot && <span className={`h-1.5 w-1.5 rounded-full ${stage.dot}`} />}
                    {l.status}
                  </Badge>
                </td>
                <td className="px-6 py-4">
                  <Badge variant={priority.variant}>{l.priority}</Badge>
                </td>
                <td className="px-6 py-4 text-xs font-medium text-ink-soft">{l.source}</td>
                <td className="px-6 py-4 text-right font-semibold text-ink">
                  {currency(l.value || 0)}
                </td>
                <td className="px-6 py-4 text-xs text-ink-soft">{relative(l.updatedAt)}</td>
                <td className="px-6 py-4 text-right">
                  <Dropdown
                    trigger={
                      <button className="rounded-lg p-1 text-ink-soft hover:bg-surface-dark/5 hover:text-ink">
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                    }
                  >
                    <DropdownItem onClick={() => onEdit(l)}>
                      <Pencil className="h-4 w-4 text-ink-soft" /> Edit lead
                    </DropdownItem>
                    <DropdownItem onClick={() => onDelete(l)} className="text-rose-600">
                      <Trash2 className="h-4 w-4" /> Delete lead
                    </DropdownItem>
                  </Dropdown>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
