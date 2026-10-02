import { useState, useMemo } from "react";
import { Plus, Download, Users, TrendingUp, Trophy, Coins } from "lucide-react";
import { PageHeader } from "../../components/common/PageHeader";
import { EmptyState } from "../../components/common/EmptyState";
import { ConfirmDialog } from "../../components/common/ConfirmDialog";
import { LeadFormDialog } from "../../components/leads/LeadFormDialog";
import { Card, Button, Spinner } from "../../components/ui";
import { useLeads } from "../../hooks/useLeads";
import { currency } from "../../lib/format";
import { LEAD_STAGES } from "../../lib/constants";
import { LeadsToolbar } from "./LeadsToolbar";
import { LeadsTable } from "./LeadsTable";
import { LeadsCardGrid } from "./LeadsCardGrid";
import { toast } from "sonner";

export default function LeadsPage() {
  const {
    leads,
    filteredLeads,
    loading,
    filters,
    sort,
    updateFilters,
    createLead,
    updateLead,
    deleteLead,
    refetch,
  } = useLeads();

  const [selected, setSelected] = useState(() => new Set());
  const [view, setView] = useState("table");

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [toDelete, setToDelete] = useState(null);
  const [bulkOpen, setBulkOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const stageCounts = useMemo(() => {
    const c = { All: leads?.length || 0 };
    LEAD_STAGES.forEach((s) => (c[s] = 0));
    (leads || []).forEach((l) => (c[l.status] = (c[l.status] || 0) + 1));
    return c;
  }, [leads]);

  const kpis = useMemo(() => {
    const list = leads || [];
    const open = list.filter((l) => l.status !== "Won" && l.status !== "Lost");
    const openValue = open.reduce((s, l) => s + (l.value || 0), 0);
    const wonValue = list
      .filter((l) => l.status === "Won")
      .reduce((s, l) => s + (l.value || 0), 0);
    const total = list.reduce((s, l) => s + (l.value || 0), 0);
    return {
      count: list.length,
      openValue,
      wonValue,
      avg: list.length ? Math.round(total / list.length) : 0,
    };
  }, [leads]);

  const toggleSort = (key) => {
    const nextDir = sort.key === key && sort.dir === "asc" ? "desc" : "asc";
    updateFilters({ sort: key, dir: nextDir });
  };

  const toggleRow = (id) =>
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const allSelected =
    filteredLeads.length > 0 && filteredLeads.every((l) => selected.has(l._id));
  const toggleAll = () =>
    setSelected(allSelected ? new Set() : new Set(filteredLeads.map((l) => l._id)));

  const handleSaveLead = async (data) => {
    if (editing) {
      await updateLead(editing._id, data);
    } else {
      await createLead(data);
    }
    setFormOpen(false);
    setEditing(null);
  };

  const confirmDelete = async () => {
    if (!toDelete) return;
    setDeleting(true);
    try {
      await deleteLead(toDelete._id);
      setToDelete(null);
    } finally {
      setDeleting(false);
    }
  };

  const exportCSV = () => {
    const rows = selected.size > 0 ? filteredLeads.filter((l) => selected.has(l._id)) : filteredLeads;
    if (!rows.length) {
      toast.error("Nothing to export");
      return;
    }
    const headers = [
      "Name", "Company", "Email", "Phone", "Stage",
      "Priority", "Source", "Value", "Created", "Updated",
    ];
    const esc = (v) => {
      const s = String(v ?? "");
      return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
    };
    const day = (d) => (d ? new Date(d).toISOString().slice(0, 10) : "");
    const lines = [headers.join(",")];
    rows.forEach((l) =>
      lines.push(
        [
          l.name, l.company, l.email, l.phone, l.status,
          l.priority, l.source, l.value, day(l.createdAt), day(l.updatedAt),
        ]
          .map(esc)
          .join(",")
      )
    );
    const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `leads-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    toast.success(`Exported ${rows.length} leads`);
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Leads" subtitle="Track and qualify every opportunity.">
        <Button variant="outline" onClick={exportCSV}>
          <Download className="h-4 w-4" /> Export
        </Button>
        <Button onClick={() => { setEditing(null); setFormOpen(true); }}>
          <Plus className="h-4 w-4" /> Add lead
        </Button>
      </PageHeader>

      {/* KPI strip */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatTile icon={Users} tint="bg-brand-50 text-brand-600" label="Total leads" value={kpis.count} />
        <StatTile
          icon={TrendingUp}
          tint="bg-sky-50 text-sky-600"
          label="Open pipeline"
          value={currency(kpis.openValue, { compact: true })}
        />
        <StatTile
          icon={Trophy}
          tint="bg-emerald-50 text-emerald-600"
          label="Won value"
          value={currency(kpis.wonValue, { compact: true })}
        />
        <StatTile
          icon={Coins}
          tint="bg-violet-50 text-violet-600"
          label="Avg deal size"
          value={currency(kpis.avg, { compact: true })}
        />
      </div>

      <LeadsToolbar
        filters={filters}
        onFilterChange={updateFilters}
        stageCounts={stageCounts}
        view={view}
        onViewChange={setView}
        totalCount={leads?.length || 0}
        filteredCount={filteredLeads.length}
      />

      {loading ? (
        <Card className="flex items-center justify-center p-12">
          <Spinner />
        </Card>
      ) : filteredLeads.length === 0 ? (
        <Card className="p-8">
          <EmptyState
            icon={Users}
            title="No leads found"
            description="Try adjusting your filters or add your first lead."
            action={
              <Button onClick={() => { setEditing(null); setFormOpen(true); }}>
                <Plus className="h-4 w-4" /> Add lead
              </Button>
            }
          />
        </Card>
      ) : view === "grid" ? (
        <LeadsCardGrid
          leads={filteredLeads}
          selected={selected}
          onToggleRow={toggleRow}
          onEdit={(lead) => { setEditing(lead); setFormOpen(true); }}
          onDelete={setToDelete}
        />
      ) : (
        <LeadsTable
          leads={filteredLeads}
          selected={selected}
          onToggleRow={toggleRow}
          onToggleAll={toggleAll}
          allSelected={allSelected}
          sort={sort}
          onSort={toggleSort}
          onEdit={(lead) => { setEditing(lead); setFormOpen(true); }}
          onDelete={setToDelete}
        />
      )}

      {formOpen && (
        <LeadFormDialog
          open={formOpen}
          onClose={() => setFormOpen(false)}
          onSubmit={handleSaveLead}
          initialData={editing}
        />
      )}

      {toDelete && (
        <ConfirmDialog
          open={Boolean(toDelete)}
          title="Delete Lead"
          description={`Are you sure you want to delete ${toDelete.name}? This action cannot be undone.`}
          confirmLabel="Delete Lead"
          variant="danger"
          loading={deleting}
          onConfirm={confirmDelete}
          onClose={() => setToDelete(null)}
        />
      )}
    </div>
  );
}

function StatTile({ icon: Icon, tint, label, value }) {
  return (
    <Card className="flex items-center gap-4 p-5">
      <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${tint}`}>
        <Icon className="h-6 w-6" />
      </div>
      <div>
        <p className="text-xs font-medium text-ink-soft">{label}</p>
        <p className="text-2xl font-bold text-ink mt-0.5">{value}</p>
      </div>
    </Card>
  );
}
