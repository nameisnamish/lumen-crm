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

  // Pagination params (default 10, page 1)
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
  const rawPageSize = parseInt(searchParams.get("pageSize") || "10", 10);
  const pageSize = [10, 25, 50].includes(rawPageSize) ? rawPageSize : 10;

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    try {
      const res = await leadsApi.list();
      setLeads(res.leads || []);
    } catch {
      toast.error("Failed to fetch leads");
      setLeads([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    (async () => {
      setLoading(true);
      try {
        const res = await leadsApi.list();
        if (active) setLeads(res.leads || []);
      } catch {
        if (active) {
          toast.error("Failed to fetch leads");
          setLeads([]);
        }
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const updateFilters = useCallback(
    (updates) => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        const isFilterChange = Object.keys(updates).some(
          (k) => k !== "page" && k !== "pageSize"
        );

        Object.entries(updates).forEach(([k, v]) => {
          if (v) {
            next.set(k, v);
          } else {
            next.delete(k);
          }
        });

        // Reset to page 1 whenever filters change, unless page was explicitly provided in updates
        if (isFilterChange && !("page" in updates)) {
          next.set("page", "1");
        }

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

  // Client-side pagination slicing
  const totalFiltered = filteredLeads.length;
  const totalPages = Math.max(1, Math.ceil(totalFiltered / pageSize));
  const paginatedLeads = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredLeads.slice(start, start + pageSize);
  }, [filteredLeads, page, pageSize]);

  const setPage = useCallback(
    (newPage) => {
      updateFilters({ page: String(newPage) });
    },
    [updateFilters]
  );

  const setPageSize = useCallback(
    (newSize) => {
      updateFilters({ pageSize: String(newSize), page: "1" });
    },
    [updateFilters]
  );

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
    paginatedLeads,
    totalFiltered,
    page,
    pageSize,
    totalPages,
    setPage,
    setPageSize,
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
