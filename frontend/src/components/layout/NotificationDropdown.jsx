import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, Check, UserCheck, CheckSquare, Sparkles, AlertCircle } from "lucide-react";
import { notificationsApi } from "../../lib/services";
import { relative } from "../../lib/format";
import { cn } from "../../lib/utils";

export function NotificationDropdown({ className }) {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const containerRef = useRef(null);
  const navigate = useNavigate();

  const loadNotifications = () => {
    notificationsApi.list().then((res) => {
      if (res.success) {
        setNotifications(res.notifications);
        setUnreadCount(res.unreadCount);
      }
    });
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMarkAllRead = () => {
    notificationsApi.markAsRead("all").then((res) => {
      if (res.success) {
        setNotifications(res.notifications);
        setUnreadCount(0);
      }
    });
  };

  const handleItemClick = (item) => {
    if (!item.read) {
      notificationsApi.markAsRead(item._id).then((res) => {
        if (res.success) {
          setNotifications(res.notifications);
          setUnreadCount(res.unreadCount);
        }
      });
    }
    setOpen(false);
    if (item.link) navigate(item.link);
  };

  const getIcon = (type) => {
    switch (type) {
      case "lead":
        return <UserCheck className="h-4 w-4 text-brand-600" />;
      case "task":
        return <CheckSquare className="h-4 w-4 text-emerald-600" />;
      case "ai":
        return <Sparkles className="h-4 w-4 text-amber-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-sky-600" />;
    }
  };

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="relative rounded-full border border-line bg-surface p-2 text-ink-soft transition hover:text-ink hover:bg-surface-muted"
        aria-label="Notifications"
      >
        <Bell className="h-[18px] w-[18px]" />
        {unreadCount > 0 && (
          <span className="absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-brand-500 text-[10px] font-bold text-white ring-2 ring-surface">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-12 z-50 w-80 sm:w-96 rounded-2xl border border-line bg-surface p-3 shadow-[var(--shadow-pop)] animate-fade-up">
          {/* Header */}
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-line px-1">
            <div className="flex items-center gap-2">
              <h3 className="font-display font-semibold text-ink text-sm">Notifications</h3>
              {unreadCount > 0 && (
                <span className="rounded-full bg-brand-50 px-2 py-0.5 text-xs font-semibold text-brand-700">
                  {unreadCount} new
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="inline-flex items-center gap-1 text-xs font-medium text-brand-600 hover:text-brand-700 transition"
              >
                <Check className="h-3.5 w-3.5" /> Mark all read
              </button>
            )}
          </div>

          {/* List */}
          <div className="max-h-80 overflow-y-auto space-y-1">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-xs text-ink-soft">
                No notifications right now.
              </div>
            ) : (
              notifications.map((item) => (
                <button
                  key={item._id}
                  onClick={() => handleItemClick(item)}
                  className={cn(
                    "flex w-full items-start gap-3 rounded-xl p-2.5 text-left transition",
                    item.read
                      ? "hover:bg-surface-muted/60 opacity-80"
                      : "bg-brand-50/40 hover:bg-brand-50/80 font-medium"
                  )}
                >
                  <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-surface shadow-xs">
                    {getIcon(item.type)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-ink leading-tight">{item.title}</p>
                    <p className="mt-0.5 text-xs text-ink-soft leading-normal line-clamp-2">{item.message}</p>
                    <p className="mt-1 text-[10px] text-ink-soft/70">{relative(item.createdAt)}</p>
                  </div>
                  {!item.read && (
                    <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-brand-500" />
                  )}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
