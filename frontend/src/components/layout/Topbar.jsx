import { Menu, ChevronDown, User, LogOut } from "lucide-react";
import {
  Avatar,
  Dropdown,
  DropdownItem,
  DropdownLabel,
  DropdownSeparator,
} from "../ui";
import { GlobalSearch } from "./GlobalSearch";
import { NotificationDropdown } from "./NotificationDropdown";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

/* Sticky top navbar: mobile menu toggle, global search, notifications, profile. */
export function Topbar({ onMenuClick }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-line bg-canvas/80 px-4 backdrop-blur md:px-8">
      <button
        onClick={onMenuClick}
        className="rounded-xl p-2 text-ink-soft hover:bg-surface-muted md:hidden"
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Global Search */}
      <GlobalSearch />

      <div className="ml-auto flex items-center gap-2">
        <NotificationDropdown />

        <Dropdown
          trigger={
            <button className="flex items-center gap-2 rounded-full border border-line bg-surface py-1 pl-1 pr-2.5 transition hover:bg-surface-muted">
              <Avatar name={user?.name} src={user?.avatar} size="sm" />
              <ChevronDown className="h-4 w-4 text-ink-soft" />
            </button>
          }
        >
          <DropdownLabel>{user?.email}</DropdownLabel>
          <DropdownSeparator />
          <DropdownItem onClick={() => navigate("/settings")}>
            <User className="h-4 w-4" /> Profile & settings
          </DropdownItem>
          <DropdownItem danger onClick={logout}>
            <LogOut className="h-4 w-4" /> Log out
          </DropdownItem>
        </Dropdown>
      </div>
    </header>
  );
}
