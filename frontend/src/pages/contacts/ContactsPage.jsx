import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { Plus, Search, Users, Star, Building2, Tag, LayoutGrid, Table2, X } from "lucide-react";
import { PageHeader } from "../../components/common/PageHeader";
import { EmptyState } from "../../components/common/EmptyState";
import { ConfirmDialog } from "../../components/common/ConfirmDialog";
import { Card, Button, Input, Dialog, Spinner } from "../../components/ui";
import { contactsApi } from "../../lib/services";
import { ContactCard } from "./ContactCard";
import { ContactPanel } from "./ContactPanel";
import { TagEditor } from "./TagEditor";
import { toast } from "sonner";

export default function ContactsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [contacts, setContacts] = useState(null);
  const [view, setView] = useState("grid");

  const [activeContact, setActiveContact] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [toDelete, setToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Form states
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", company: "", title: "", tags: [] });

  const searchQuery = searchParams.get("search") || "";
  const tagFilter = searchParams.get("tag") || "";

  const loadContacts = async () => {
    setContacts(null);
    try {
      const res = await contactsApi.list();
      setContacts(res.contacts || []);
    } catch {
      setContacts([]);
      toast.error("Failed to fetch contacts");
    }
  };

  useEffect(() => {
    loadContacts();
  }, []);

  const updateFilters = (updates) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      Object.entries(updates).forEach(([k, v]) => {
        if (v) next.set(k, v);
        else next.delete(k);
      });
      return next;
    });
  };

  const filtered = useMemo(() => {
    if (!contacts) return [];
    return contacts.filter((c) => {
      if (tagFilter && !c.tags?.includes(tagFilter)) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const mName = c.name?.toLowerCase().includes(q);
        const mCompany = c.company?.toLowerCase().includes(q);
        const mEmail = c.email?.toLowerCase().includes(q);
        if (!mName && !mCompany && !mEmail) return false;
      }
      return true;
    });
  }, [contacts, searchQuery, tagFilter]);

  const allTags = useMemo(() => {
    const set = new Set();
    (contacts || []).forEach((c) => c.tags?.forEach((t) => set.add(t)));
    return Array.from(set);
  }, [contacts]);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        const res = await contactsApi.update(editing._id, formData);
        if (res.success) {
          toast.success("Contact updated");
          loadContacts();
        }
      } else {
        const res = await contactsApi.create(formData);
        if (res.success) {
          toast.success("Contact created");
          loadContacts();
        }
      }
      setFormOpen(false);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleToggleFavorite = async (id) => {
    const target = contacts.find((c) => c._id === id);
    if (!target) return;
    const nextFav = !target.favorite;
    setContacts(contacts.map((c) => (c._id === id ? { ...c, favorite: nextFav } : c)));
    await contactsApi.update(id, { favorite: nextFav });
  };

  const confirmDelete = async () => {
    if (!toDelete) return;
    setDeleting(true);
    try {
      await contactsApi.remove(toDelete._id);
      toast.success("Contact deleted");
      setToDelete(null);
      loadContacts();
    } finally {
      setDeleting(false);
    }
  };

  const openNew = () => {
    setEditing(null);
    setFormData({ name: "", email: "", phone: "", company: "", title: "", tags: [] });
    setFormOpen(true);
  };

  const openEdit = (c) => {
    setEditing(c);
    setFormData({
      name: c.name || "",
      email: c.email || "",
      phone: c.phone || "",
      company: c.company || "",
      title: c.title || "",
      tags: c.tags || [],
    });
    setFormOpen(true);
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Contacts" subtitle="Manage external relationships and key accounts.">
        <Button onClick={openNew}>
          <Plus className="h-4 w-4" /> Add contact
        </Button>
      </PageHeader>

      {/* Toolbar */}
      <Card className="space-y-4 p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-soft" />
            <input
              value={searchQuery}
              onChange={(e) => updateFilters({ search: e.target.value })}
              placeholder="Search by name, company or email…"
              className="h-10 w-full rounded-xl border border-line bg-surface pl-10 pr-4 text-sm focus:border-brand-400 focus:outline-none"
            />
          </div>
        </div>

        {allTags.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-line/60">
            <button
              onClick={() => updateFilters({ tag: "" })}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                !tagFilter ? "bg-brand-500 text-white" : "bg-surface-muted text-ink-soft hover:bg-surface-dark/5"
              }`}
            >
              All Tags
            </button>
            {allTags.map((t) => (
              <button
                key={t}
                onClick={() => updateFilters({ tag: t })}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                  tagFilter === t ? "bg-brand-500 text-white" : "bg-surface-muted text-ink-soft hover:bg-surface-dark/5"
                }`}
              >
                {t}
              </button>
            ))}

            <div className="ml-auto flex items-center gap-3">
              {(searchQuery || tagFilter) && (
                <button
                  onClick={() => updateFilters({ search: "", tag: "" })}
                  className="inline-flex items-center gap-1 text-xs text-ink-soft hover:text-ink"
                >
                  <X className="h-3.5 w-3.5" /> Clear
                </button>
              )}
              <span className="text-xs text-ink-soft font-medium">
                {filtered.length} contacts
              </span>
            </div>
          </div>
        )}
      </Card>

      {/* Grid view */}
      {contacts === null ? (
        <Card className="flex justify-center p-12">
          <Spinner />
        </Card>
      ) : filtered.length === 0 ? (
        <Card className="p-8">
          <EmptyState
            icon={Users}
            title="No contacts found"
            description="Adjust your search or add your first contact."
            action={
              <Button onClick={openNew}>
                <Plus className="h-4 w-4" /> Add contact
              </Button>
            }
          />
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((c) => (
            <ContactCard
              key={c._id}
              contact={c}
              onOpen={setActiveContact}
              onEdit={openEdit}
              onDelete={setToDelete}
              onToggleFavorite={handleToggleFavorite}
            />
          ))}
        </div>
      )}

      {/* Detail drawer */}
      <ContactPanel
        contact={activeContact}
        open={Boolean(activeContact)}
        onClose={() => setActiveContact(null)}
        onEdit={openEdit}
        onDelete={setToDelete}
      />

      {/* Add / Edit Dialog */}
      {formOpen && (
        <Dialog open={formOpen} onClose={() => setFormOpen(false)} title={editing ? "Edit Contact" : "Add Contact"}>
          <form onSubmit={handleSave} className="space-y-4">
            <Input
              label="Full Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
              <Input
                label="Phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Company"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              />
              <Input
                label="Job Title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-ink-soft block mb-1.5">Tags</label>
              <TagEditor tags={formData.tags} onChange={(tags) => setFormData({ ...formData, tags })} />
            </div>
            <div className="flex justify-end gap-2 pt-4 border-t border-line">
              <Button variant="outline" type="button" onClick={() => setFormOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Save Contact</Button>
            </div>
          </form>
        </Dialog>
      )}

      {/* Delete confirmation */}
      {toDelete && (
        <ConfirmDialog
          open={Boolean(toDelete)}
          title="Delete Contact"
          description={`Are you sure you want to delete ${toDelete.name}?`}
          confirmLabel="Delete"
          variant="danger"
          loading={deleting}
          onConfirm={confirmDelete}
          onClose={() => setToDelete(null)}
        />
      )}
    </div>
  );
}
