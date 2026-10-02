import { MoreHorizontal, Pencil, Trash2, Pin, PinOff, Link2 } from "lucide-react";
import { Badge, Dropdown, DropdownItem } from "../../components/ui";
import { relative } from "../../lib/format";
import { cn } from "../../lib/utils";

export function NoteCard({ note, onEdit, onDelete, onTogglePin }) {
  // Prefer lead over contact for the linked-entity chip
  const entity = note.lead ?? note.contact ?? null;

  return (
    <div
      className={cn(
        "break-inside-avoid relative flex flex-col gap-3 rounded-2xl bg-surface p-5",
        "border border-line shadow-(--shadow-card) transition hover:shadow-(--shadow-pop)",
        note.pinned
          ? "ring-1 ring-brand-200 shadow-[inset_0_3px_0_0_var(--color-brand-500)]"
          : ""
      )}
    >
      {/* Pinned icon badge */}
      {note.pinned && (
        <span className="absolute right-4 top-3 flex h-6 w-6 items-center justify-center rounded-full bg-brand-50 text-brand-500">
          <Pin className="h-3.5 w-3.5" aria-label="Pinned" />
        </span>
      )}

      {/* Note content */}
      <p className="whitespace-pre-wrap text-sm leading-relaxed text-ink pr-6">
        {note.content}
      </p>

      {/* Footer: linked chip + timestamp + actions */}
      <div className="flex items-center justify-between gap-2 pt-1">
        <div className="flex min-w-0 flex-wrap items-center gap-2">
          {entity && (
            <Badge className="inline-flex items-center gap-1 bg-brand-50 text-brand-700 border-brand-100 text-xs font-medium max-w-[160px] truncate">
              <Link2 className="h-3 w-3 shrink-0" />
              <span className="truncate">{entity.name}</span>
            </Badge>
          )}
          <span className="text-xs text-ink-soft">{relative(note.createdAt)}</span>
        </div>

        {/* Overflow menu */}
        <div onClick={(e) => e.stopPropagation()} className="shrink-0">
          <Dropdown
            trigger={
              <button
                className="rounded-lg p-1.5 text-ink-soft transition hover:bg-surface-muted cursor-pointer"
                aria-label="Note options"
              >
                <MoreHorizontal className="h-4 w-4" />
              </button>
            }
          >
            <DropdownItem onClick={() => onTogglePin(note)}>
              {note.pinned ? (
                <>
                  <PinOff className="h-4 w-4" /> Unpin
                </>
              ) : (
                <>
                  <Pin className="h-4 w-4" /> Pin
                </>
              )}
            </DropdownItem>
            <DropdownItem onClick={() => onEdit(note)}>
              <Pencil className="h-4 w-4" /> Edit
            </DropdownItem>
            <DropdownItem danger onClick={() => onDelete(note)}>
              <Trash2 className="h-4 w-4" /> Delete
            </DropdownItem>
          </Dropdown>
        </div>
      </div>
    </div>
  );
}
