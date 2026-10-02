import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Search, UserCheck, Users, CheckSquare, FileText, Loader2, X, Command } from "lucide-react";
import { searchApi } from "../../lib/services";
import { useKeyboardShortcut } from "../../hooks/useKeyboardShortcut";
import { cn } from "../../lib/utils";

export function GlobalSearch({ className, placeholder = "Search leads, contacts, tasks, notes…" }) {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [results, setResults] = useState({ leads: [], contacts: [], tasks: [], notes: [] });
  const containerRef = useRef(null);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  const handleShortcut = useCallback(() => {
    inputRef.current?.focus();
    inputRef.current?.select();
  }, []);

  useKeyboardShortcut("Ctrl+k", handleShortcut);

  // Handle outside click to close popover
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Search API fetch on query change
  useEffect(() => {
    const q = query.trim();
    if (!q) {
      setResults({ leads: [], contacts: [], tasks: [], notes: [] });
      setOpen(false);
      return;
    }

    setLoading(true);
    setOpen(true);

    const timer = setTimeout(() => {
      searchApi
        .query(q)
        .then((res) => {
          if (res.success) setResults(res.results);
        })
        .finally(() => setLoading(false));
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  const hasResults =
    results.leads.length > 0 ||
    results.contacts.length > 0 ||
    results.tasks.length > 0 ||
    results.notes.length > 0;

  const handleSelect = (path) => {
    setOpen(false);
    setQuery("");
    navigate(path);
  };

  return (
    <div ref={containerRef} className={cn("relative flex-1 max-w-md", className)}>
      <div className="relative flex items-center">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-soft" />
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.trim() && setOpen(true)}
          placeholder={placeholder}
          className="h-10 w-full rounded-full border border-line bg-surface pl-10 pr-16 text-sm text-ink placeholder:text-ink-soft/70 transition focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
        />
        <div className="absolute right-3 flex items-center gap-1.5 pointer-events-none">
          {query ? (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setQuery("");
                setOpen(false);
              }}
              className="pointer-events-auto text-ink-soft hover:text-ink"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          ) : (
            <kbd className="hidden sm:inline-flex items-center gap-0.5 rounded border border-line/80 bg-surface-muted px-1.5 py-0.5 text-[10px] font-semibold text-ink-soft shadow-xs">
              <span className="text-xs">⌘</span>K
            </kbd>
          )}
        </div>
      </div>

      {/* Results Dropdown */}
      {open && (
        <div className="absolute left-0 right-0 top-12 z-50 max-h-[28rem] overflow-y-auto rounded-2xl border border-line bg-surface p-2 shadow-[var(--shadow-pop)] animate-fade-up">
          {loading ? (
            <div className="flex items-center justify-center p-6 text-sm text-ink-soft">
              <Loader2 className="h-4 w-4 animate-spin mr-2 text-brand-600" />
              Searching CRM...
            </div>
          ) : !hasResults ? (
            <div className="p-6 text-center text-sm text-ink-soft">
              No results found for "<span className="font-semibold text-ink">{query}</span>"
            </div>
          ) : (
            <div className="space-y-3">
              {/* Leads */}
              {results.leads.length > 0 && (
                <div>
                  <div className="flex items-center gap-1.5 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-ink-soft/80">
                    <UserCheck className="h-3.5 w-3.5 text-brand-600" /> Leads
                  </div>
                  {results.leads.map((item) => (
                    <button
                      key={item._id}
                      onClick={() => handleSelect(`/leads/${item._id}`)}
                      className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm transition hover:bg-surface-muted"
                    >
                      <div className="min-w-0">
                        <p className="font-medium text-ink truncate">{item.name}</p>
                        <p className="text-xs text-ink-soft truncate">{item.company || item.email}</p>
                      </div>
                      <span className="shrink-0 text-xs px-2 py-0.5 rounded-md bg-brand-50 text-brand-700 font-medium">
                        {item.status}
                      </span>
                    </button>
                  ))}
                </div>
              )}

              {/* Contacts */}
              {results.contacts.length > 0 && (
                <div>
                  <div className="flex items-center gap-1.5 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-ink-soft/80">
                    <Users className="h-3.5 w-3.5 text-sky-600" /> Contacts
                  </div>
                  {results.contacts.map((item) => (
                    <button
                      key={item._id}
                      onClick={() => handleSelect(`/contacts`)}
                      className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm transition hover:bg-surface-muted"
                    >
                      <div className="min-w-0">
                        <p className="font-medium text-ink truncate">{item.name}</p>
                        <p className="text-xs text-ink-soft truncate">{item.title} — {item.company}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* Tasks */}
              {results.tasks.length > 0 && (
                <div>
                  <div className="flex items-center gap-1.5 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-ink-soft/80">
                    <CheckSquare className="h-3.5 w-3.5 text-emerald-600" /> Tasks
                  </div>
                  {results.tasks.map((item) => (
                    <button
                      key={item._id}
                      onClick={() => handleSelect(`/tasks`)}
                      className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm transition hover:bg-surface-muted"
                    >
                      <div className="min-w-0">
                        <p className="font-medium text-ink truncate">{item.title}</p>
                        <p className="text-xs text-ink-soft truncate">{item.status} • {item.priority} priority</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* Notes */}
              {results.notes.length > 0 && (
                <div>
                  <div className="flex items-center gap-1.5 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-ink-soft/80">
                    <FileText className="h-3.5 w-3.5 text-amber-600" /> Notes
                  </div>
                  {results.notes.map((item) => (
                    <button
                      key={item._id}
                      onClick={() => handleSelect(`/notes`)}
                      className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm transition hover:bg-surface-muted"
                    >
                      <p className="font-medium text-ink truncate text-xs">{item.content}</p>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
