import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate, NavLink, Outlet, useLocation } from "react-router-dom";
import {
  Building2,
  Mail,
  ArrowLeft,
  Pencil,
  Trash2,
  Sparkles,
  CheckCircle2,
  FileText,
  Activity,
  Layers,
} from "lucide-react";
import { Breadcrumbs } from "../../components/common/Breadcrumbs";
import { ConfirmDialog } from "../../components/common/ConfirmDialog";
import { LeadFormDialog } from "../../components/leads/LeadFormDialog";
import { Card, Button, Badge, Avatar, Spinner } from "../../components/ui";
import { leadsApi } from "../../lib/services";
import { currency, relative } from "../../lib/format";
import { STAGE_STYLES, PRIORITY_STYLES } from "../../lib/constants";
import { toast } from "sonner";

export default function LeadDetailPage() {
  const { leadId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [lead, setLead] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const refetchLead = useCallback(() => setRefreshKey((k) => k + 1), []);

  useEffect(() => {
    let ignore = false;
    if (!leadId) return;

    async function fetchLead() {
      try {
        const res = await leadsApi.get(leadId);
        if (!ignore) {
          if (res.success && res.lead) {
            setLead(res.lead);
          } else {
            setLead(null);
          }
        }
      } catch {
        if (!ignore) {
          toast.error("Failed to load lead details");
          setLead(null);
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    fetchLead();

    return () => {
      ignore = true;
    };
  }, [leadId, refreshKey]);

  const handleUpdate = async (data) => {
    const res = await leadsApi.update(leadId, data);
    if (res.success) {
      toast.success("Lead updated");
      setLead(res.lead);
      setEditOpen(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await leadsApi.remove(leadId);
      toast.success("Lead deleted");
      navigate("/leads");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (!lead) {
    return (
      <Card className="p-8 text-center">
        <h2 className="text-xl font-bold text-ink">Lead Not Found</h2>
        <p className="mt-2 text-sm text-ink-soft">The lead requested could not be found.</p>
        <Button className="mt-4" onClick={() => navigate("/leads")}>
          <ArrowLeft className="h-4 w-4" /> Back to Leads
        </Button>
      </Card>
    );
  }

  const stage = STAGE_STYLES[lead.status] || STAGE_STYLES.New;
  const priority = PRIORITY_STYLES[lead.priority] || PRIORITY_STYLES.Medium;

  const tabs = [
    { key: "overview", label: "Overview", icon: Layers, path: `/leads/${leadId}` },
    { key: "activity", label: "Activity Timeline", icon: Activity, path: `/leads/${leadId}/activity` },
    { key: "notes", label: "Notes", icon: FileText, path: `/leads/${leadId}/notes` },
    { key: "tasks", label: "Tasks", icon: CheckCircle2, path: `/leads/${leadId}/tasks` },
    { key: "ai", label: "AI Insights", icon: Sparkles, path: `/leads/${leadId}/ai` },
  ];

  return (
    <div className="space-y-6">
      <Breadcrumbs />

      {/* Header Banner */}
      <Card className="p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" onClick={() => navigate("/leads")}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <Avatar name={lead.name} size="lg" />
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-ink">{lead.name}</h1>
                <Badge variant={stage.variant || "neutral"} className="gap-1">
                  {stage.dot && <span className={`h-1.5 w-1.5 rounded-full ${stage.dot}`} />}
                  {lead.status}
                </Badge>
                <Badge variant={priority.variant}>{lead.priority}</Badge>
              </div>
              <p className="mt-1 flex items-center gap-2 text-sm text-ink-soft">
                <Building2 className="h-4 w-4 text-ink-soft/70" />
                <span className="font-semibold text-ink">{lead.company}</span>
                <span>·</span>
                <Mail className="h-4 w-4 text-ink-soft/70" />
                <span>{lead.email}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => setEditOpen(true)}>
              <Pencil className="h-4 w-4" /> Edit
            </Button>
            <Button variant="danger" onClick={() => setDeleteOpen(true)}>
              <Trash2 className="h-4 w-4" /> Delete
            </Button>
          </div>
        </div>

        {/* Info Strip */}
        <div className="mt-6 grid grid-cols-2 gap-4 border-t border-line/60 pt-4 sm:grid-cols-4">
          <div>
            <span className="text-xs text-ink-soft">Deal Value</span>
            <p className="text-lg font-bold text-ink">{currency(lead.value || 0)}</p>
          </div>
          <div>
            <span className="text-xs text-ink-soft">Source</span>
            <p className="text-sm font-semibold text-ink">{lead.source || "Direct"}</p>
          </div>
          <div>
            <span className="text-xs text-ink-soft">Phone</span>
            <p className="text-sm font-semibold text-ink">{lead.phone || "—"}</p>
          </div>
          <div>
            <span className="text-xs text-ink-soft">Last Updated</span>
            <p className="text-sm font-semibold text-ink">{relative(lead.updatedAt)}</p>
          </div>
        </div>
      </Card>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-line pb-2 overflow-x-auto no-scrollbar">
        {tabs.map((t) => {
          const Icon = t.icon;
          const isActive =
            t.key === "overview"
              ? location.pathname === `/leads/${leadId}` || location.pathname === `/leads/${leadId}/`
              : location.pathname.includes(t.key);

          return (
            <NavLink
              key={t.key}
              to={t.path}
              className={`flex shrink-0 whitespace-nowrap items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition ${
                isActive
                  ? "bg-brand-500 text-white shadow-sm"
                  : "text-ink-soft hover:bg-surface-dark/5 hover:text-ink"
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{t.label}</span>
            </NavLink>
          );
        })}
      </div>

      {/* Child Route Context Output */}
      <div className="mt-4">
        <Outlet context={{ lead, refetchLead }} />
      </div>

      {editOpen && (
        <LeadFormDialog
          open={editOpen}
          onClose={() => setEditOpen(false)}
          onSubmit={handleUpdate}
          initialData={lead}
        />
      )}

      {deleteOpen && (
        <ConfirmDialog
          open={deleteOpen}
          title="Delete Lead"
          description={`Are you sure you want to delete ${lead.name}?`}
          confirmLabel="Delete Lead"
          variant="danger"
          loading={deleting}
          onConfirm={handleDelete}
          onClose={() => setDeleteOpen(false)}
        />
      )}
    </div>
  );
}
