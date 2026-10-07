import { useEffect, useMemo, useState } from "react";
import { Plus, StickyNote } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "../../components/common/PageHeader";
import { EmptyState } from "../../components/common/EmptyState";
import { ConfirmDialog } from "../../components/common/ConfirmDialog";
import { Button, Spinner } from "../../components/ui";
import { notesApi, leadsApi } from "../../lib/services";
import { NoteCard } from "./NoteCard";
import { NoteFormDialog } from "./NoteFormDialog";
import { NotesToolbar } from "./NotesToolbar";
import { NotesStats } from "./NotesStats";

export default function NotesPage() {
  // ── Data ─────────────────────────────────────────────────────────────────
  const [notes, setNotes] = useState(null); // null = loading
  const [leads, setLeads] = useState([]); // lead picker options

  // ── UI state ──────────────────────────────────────────────────────────────
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all"); // "all" | "pinned" | "linked" | "unlinked"
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [toDelete, setToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // ── Fetch ─────────────────────────────────────────────────────────────────
  const load = () => {
    setNotes(null);
    notesApi.list().then((res) => setNotes(res.notes || [])).catch(() => setNotes([]));
  };

  useEffect(() => {
    let active = true;
    notesApi.list().then((res) => {
      if (active) setNotes(res.notes || []);
    }).catch(() => {
      if (active) setNotes([]);
    });
    leadsApi.list().then((res) => {
      if (active) setLeads(res.leads ?? []);
    }).catch(() => {});

    return () => {
      active = false;
    };
  }, []);

  // ── KPI counts (stable — independent of active filter) ───────────────────
  const kpis = useMemo(() => {
    const list = notes || [];
    return {
      total: list.length,
      pinned: list.filter((n) => n.pinned).length,
      linked: list.filter((n) => n.lead || n.contact).length,
      unlinked: list.filter((n) => !n.lead && !n.contact).length,
    };
  }, [notes]);

  // ── Quick-filter chip counts ──────────────────────────────────────────────
  const chipCounts = useMemo(
    () => ({
      all: kpis.total,
      pinned: kpis.pinned,
      linked: kpis.linked,
      unlinked: kpis.unlinked,
    }),
    [kpis]
  );

  // ── Client-side filtering (search + quick-filter chip) ───────────────────
  const filtered = useMemo(() => {
    if (!notes) return [];
    let list = notes;

    if (filter === "pinned") list = list.filter((n) => n.pinned);
    else if (filter === "linked") list = list.filter((n) => n.lead || n.contact);
    else if (filter === "unlinked") list = list.filter((n) => !n.lead && !n.contact);

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((n) => n.content?.toLowerCase().includes(q));
    }

    return list;
  }, [notes, filter, search]);

  const isActive = search.trim() || filter !== "all";

  // ── Handlers ──────────────────────────────────────────────────────────────
  const openNew = () => {
    setEditing(null);
    setFormOpen(true);
  };
  const openEdit = (note) => {
    setEditing(note);
    setFormOpen(true);
  };
  const handleSaved = () => {
    setFormOpen(false);
    load();
  };

  const handleTogglePin = async (note) => {
    try {
      await notesApi.update(note._id, { pinned: !note.pinned });
      toast.success(note.pinned ? "Note unpinned" : "Note pinned");
      load();
    } catch (err) {
      toast.error(err.message ?? "Could not update note");
    }
  };

  const confirmDelete = async () => {
    setDeleting(true);
    try {
      await notesApi.remove(toDelete._id);
      toast.success("Note deleted");
      setToDelete(null);
      load();
    } catch (err) {
      toast.error(err.message ?? "Could not delete note");
    } finally {
      setDeleting(false);
    }
  };

  const clearAll = () => {
    setSearch("");
    setFilter("all");
  };

  return (
    <div className="space-y-6">
      {/* Page header */}
      <PageHeader title="Notes" subtitle="Capture context across your deals and contacts.">
        <Button onClick={openNew}>
          <Plus className="h-4 w-4" /> New note
        </Button>
      </PageHeader>

      {/* KPI strip */}
      <NotesStats kpis={kpis} />

      {/* Toolbar */}
      <NotesToolbar
        search={search}
        onSearchChange={setSearch}
        filter={filter}
        onFilterChange={setFilter}
        chipCounts={chipCounts}
        filteredCount={filtered.length}
        totalCount={notes?.length ?? 0}
        onClearAll={clearAll}
        isActive={isActive}
      />

      {/* Masonry grid / loading / empty */}
      {notes === null ? (
        <div className="flex justify-center py-16">
          <Spinner />
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={StickyNote}
          title={isActive ? "No notes match" : "No notes yet"}
          description={
            isActive
              ? "Try adjusting your search or filters."
              : "Start capturing context for your leads and deals."
          }
          action={
            !isActive ? (
              <Button onClick={openNew}>
                <Plus className="h-4 w-4" /> New note
              </Button>
            ) : undefined
          }
        />
      ) : (
        <div className="columns-1 sm:columns-2 xl:columns-3 gap-4 *:mb-4">
          {filtered.map((note) => (
            <NoteCard
              key={note._id}
              note={note}
              onEdit={openEdit}
              onDelete={setToDelete}
              onTogglePin={handleTogglePin}
            />
          ))}
        </div>
      )}

      {/* New / Edit dialog */}
      <NoteFormDialog
        open={formOpen}
        onClose={() => setFormOpen(false)}
        note={editing}
        leads={leads}
        onSaved={handleSaved}
      />

      {/* Delete confirmation */}
      <ConfirmDialog
        open={Boolean(toDelete)}
        onClose={() => setToDelete(null)}
        onConfirm={confirmDelete}
        loading={deleting}
        title="Delete this note?"
        description="This note will be permanently removed and cannot be recovered."
        confirmLabel="Delete note"
      />
    </div>
  );
}
