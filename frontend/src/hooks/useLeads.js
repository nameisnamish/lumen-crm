import { useState, useEffect, useMemo, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { leadsApi } from "../lib/services";
import { toast } from "sonner";

export function useLeads() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [leads, setLeads] = useState(null);
  const [loading, setLoading] = useState(true);

  // Sync state with URL params
  const statusFilter = searchParams.get("status") || "";
  const priorityFilter = searchParams.get("priority") || "";
  const sourceFilter = searchParams.get("source") || "";
  const searchQuery = searchParams.get("search") || "";
  const sortKey = searchParams.get("sort") || "updatedAt";
  const sortDir = searchParams.get("dir") || "desc";

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    try {
      const res = await leadsApi.list();
      setLeads(res.leads || []);
    } catch (err) {
      toast.error("Failed to fetch leads");
      setLeads([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  const updateFilters = useCallback(
    (updates) => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        Object.entries(updates).forEach(([k, v]) => {
          if (v) {
            next.set(k, v);
          } else {
            next.delete(k);
          }
        });
        return next;
      });
    },
    [setSearchParams]
  );

  const filteredLeads = useMemo(() => {
    if (!leads) return [];
    return leads
      .filter((l) => {
        if (statusFilter && l.status !== statusFilter) return false;
        if (priorityFilter && l.priority !== priorityFilter) return false;
        if (sourceFilter && l.source !== sourceFilter) return false;
        if (searchQuery) {
          const q = searchQuery.toLowerCase();
          const matchName = l.name?.toLowerCase().includes(q);
          const matchCompany = l.company?.toLowerCase().includes(q);
          const matchEmail = l.email?.toLowerCase().includes(q);
          if (!matchName && !matchCompany && !matchEmail) return false;
        }
        return true;
      })
      .sort((a, b) => {
        let va = a[sortKey];
        let vb = b[sortKey];
        if (sortKey === "updatedAt" || sortKey === "createdAt") {
          va = new Date(va).getTime();
          vb = new Date(vb).getTime();
        }
        if (va < vb) return sortDir === "asc" ? -1 : 1;
        if (va > vb) return sortDir === "asc" ? 1 : -1;
        return 0;
      });
  }, [leads, statusFilter, priorityFilter, sourceFilter, searchQuery, sortKey, sortDir]);

  const createLead = async (data) => {
    const res = await leadsApi.create(data);
    if (res.success) {
      toast.success("Lead created");
      fetchLeads();
    }
    return res;
  };

  const updateLead = async (id, data) => {
    const res = await leadsApi.update(id, data);
    if (res.success) {
      toast.success("Lead updated");
      fetchLeads();
    }
    return res;
  };

  const deleteLead = async (id) => {
    const res = await leadsApi.remove(id);
    if (res.success) {
      toast.success("Lead deleted");
      fetchLeads();
    }
    return res;
  };

  return {
    leads,
    filteredLeads,
    loading,
    filters: {
      status: statusFilter,
      priority: priorityFilter,
      source: sourceFilter,
      search: searchQuery,
    },
    sort: { key: sortKey, dir: sortDir },
    updateFilters,
    refetch: fetchLeads,
    createLead,
    updateLead,
    deleteLead,
  };
}
