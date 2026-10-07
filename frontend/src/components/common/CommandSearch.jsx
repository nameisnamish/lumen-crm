import { useState, useEffect, useRef, useDeferredValue, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  X,
  LayoutDashboard,
  Users,
  Contact2,
  Layers,
  FileText,
  CheckSquare,
  Settings,
  Plus,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { searchApi } from "../../lib/services";
import { useKeyboardShortcut } from "../../hooks/useKeyboardShortcut";

const NAV_ITEMS = [
  { label: "Dashboard", path: "/", icon: LayoutDashboard, group: "Navigate" },
  { label: "Leads", path: "/leads", icon: Users, group: "Navigate" },
  { label: "Contacts", path: "/contacts", icon: Contact2, group: "Navigate" },
  { label: "Pipeline", path: "/pipeline", icon: Layers, group: "Navigate" },
  { label: "Notes", path: "/notes", icon: FileText, group: "Navigate" },
  { label: "Tasks", path: "/tasks", icon: CheckSquare, group: "Navigate" },
  { label: "Settings", path: "/settings", icon: Settings, group: "Navigate" },
];

const QUICK_ACTIONS = [
  { label: "New Lead", path: "/leads?action=new", icon: Plus, group: "Quick Actions" },
  { label: "AI Copilot", path: "/settings", icon: Sparkles, group: "Quick Actions" },
];

export function CommandSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);
  const [results, setResults] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  // Open with Ctrl+K / Cmd+K
  useKeyboardShortcut("Ctrl+k", useCallback(() => setOpen(true), []));

  // Focus input when opened
  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
        setQuery("");
        setResults(null);
        setSelectedIndex(0);
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [open]);

  // Search when deferred query changes
  useEffect(() => {
    const q = deferredQuery.trim();
    if (!q) {
      const timer = setTimeout(() => setResults(null), 0);
      return () => clearTimeout(timer);
    }
    let active = true;
    searchApi.query(q).then((res) => {
      if (active) setResults(res.results || {});
    });
    return () => {
      active = false;
    };
  }, [deferredQuery]);

  // Build flat list of all selectable items
  const items = useMemo(() => {
    const list = [];
    const q = query.toLowerCase();

    // Nav items matching query
    const navMatches = q
      ? NAV_ITEMS.filter((i) => i.label.toLowerCase().includes(q))
      : NAV_ITEMS;
    navMatches.forEach((i) => list.push({ ...i, type: "nav" }));

    // Quick actions
    const actionMatches = q
      ? QUICK_ACTIONS.filter((i) => i.label.toLowerCase().includes(q))
      : QUICK_ACTIONS;
    actionMatches.forEach((i) => list.push({ ...i, type: "action" }));

    // Search results
    if (results) {
      (results.leads || []).forEach((l) =>
        list.push({
          label: l.name,
          sublabel: l.company,
          path: `/leads/${l._id}`,
          icon: Users,
          group: "Leads",
          type: "result",
        })
      );
      (results.contacts || []).forEach((c) =>
        list.push({
          label: c.name,
          sublabel: c.company,
          path: `/contacts`,
          icon: Contact2,
          group: "Contacts",
          type: "result",
        })
      );
      (results.tasks || []).forEach((t) =>
        list.push({
          label: t.title,
          sublabel: t.status,
          path: `/tasks`,
          icon: CheckSquare,
          group: "Tasks",
          type: "result",
        })
      );
    }

    return list;
  }, [query, results]);

  // Keyboard navigation
  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => Math.min(prev + 1, items.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === "Enter" && items[selectedIndex]) {
      e.preventDefault();
      navigate(items[selectedIndex].path);
      setOpen(false);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  const selectItem = (item) => {
    navigate(item.path);
    setOpen(false);
  };

  if (!open) return null;

  // Group items
  const groups = {};
  items.forEach((item) => {
    const g = item.group || "Results";
    if (!groups[g]) groups[g] = [];
    groups[g].push(item);
  });

  let flatIndex = 0;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-ink/30 backdrop-blur-sm"
        onClick={() => setOpen(false)}
      />

      {/* Modal */}
      <div className="fixed left-1/2 top-[20%] z-50 w-full max-w-lg -translate-x-1/2">
        <div className="overflow-hidden rounded-2xl border border-line bg-surface shadow-2xl">
          {/* Input */}
          <div className="flex items-center gap-3 border-b border-line px-4 py-3">
            <Search className="h-5 w-5 text-ink-soft" />
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => { setQuery(e.target.value); setSelectedIndex(0); }}
              onKeyDown={handleKeyDown}
              placeholder="Search leads, contacts, or jump to a page…"
              className="flex-1 bg-transparent text-sm text-ink outline-none placeholder:text-ink-soft/60"
            />
            <kbd className="hidden rounded-md border border-line bg-surface-muted px-1.5 py-0.5 text-[10px] font-semibold text-ink-soft sm:inline">
              ESC
            </kbd>
            <button onClick={() => setOpen(false)} className="text-ink-soft hover:text-ink">
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Results */}
          <div className="max-h-80 overflow-y-auto p-2">
            {Object.entries(groups).map(([group, groupItems]) => (
              <div key={group}>
                <p className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-ink-soft/60">
                  {group}
                </p>
                {groupItems.map((item) => {
                  const idx = flatIndex++;
                  const Icon = item.icon;
                  return (
                    <button
                      key={`${item.path}-${item.label}-${idx}`}
                      onClick={() => selectItem(item)}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition ${
                        selectedIndex === idx
                          ? "bg-brand-50 text-brand-700"
                          : "text-ink hover:bg-surface-muted/50"
                      }`}
                    >
                      <Icon className="h-4 w-4 shrink-0 opacity-60" />
                      <div className="min-w-0 flex-1">
                        <span className="font-medium">{item.label}</span>
                        {item.sublabel && (
                          <span className="ml-2 text-xs text-ink-soft">{item.sublabel}</span>
                        )}
                      </div>
                      <ArrowRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100" />
                    </button>
                  );
                })}
              </div>
            ))}
            {items.length === 0 && query && (
              <p className="py-8 text-center text-sm text-ink-soft">
                No results for "{query}"
              </p>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between border-t border-line/60 px-4 py-2 text-[10px] text-ink-soft/60">
            <span>
              <kbd className="rounded border border-line bg-surface-muted px-1 font-mono">↑↓</kbd> navigate ·{" "}
              <kbd className="rounded border border-line bg-surface-muted px-1 font-mono">↵</kbd> select ·{" "}
              <kbd className="rounded border border-line bg-surface-muted px-1 font-mono">esc</kbd> close
            </span>
            <span>Lumen CRM</span>
          </div>
        </div>
      </div>
    </>
  );
}
