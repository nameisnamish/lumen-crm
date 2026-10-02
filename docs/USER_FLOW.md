# 🗺️ User Flow & Page Transitions

## 1. Authentication Journey
```text
Unauthenticated User ──► [/login] ──► Successful Auth ──► Store JWT ──► Redirect [/]
                            │
                            └──► [/register] ──► Create Account ──► Redirect [/login]
```

## 2. Authenticated Application Navigation
- **Dashboard (`/`)**: High-level KPIs, activity feeds, and charts.
- **Leads (`/leads`)**: Tabular list of leads, search bar, filters, CSV export, Lead Drawer.
- **Sales Pipeline (`/pipeline`)**: Drag-and-drop Kanban deal board.
- **Contacts (`/contacts`)**: Grid of business contacts, tag filters, favorite pinning.
- **Notes (`/notes`)**: Masonry grid of pinned & tagged notes.
- **Tasks (`/tasks`)**: Follow-up tasks grouped by due date with progress bar.
- **Settings (`/settings`)**: Profile & preferences.
