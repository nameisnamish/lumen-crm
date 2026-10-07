# ⚡ Lumen CRM: 1-Page Viva Quick Reference Cheatsheet
**University CIE-2 Capstone Viva • Student:** Namish M S • **Stack:** React 19 + Express API

---

### 🗺️ 1. Demo Navigation Order & Key Routes
1. **`/login`** ➔ Demo account button, Zod validation, JWT storage in `localStorage`, `ProtectedRoute` guard.
2. **`/` (Dashboard)** ➔ Live KPI ribbon, Recharts line/bar/donut charts, Adaptive Cadence (30D ➔ 1Y).
3. **`/leads`** ➔ Table/Grid toggle, `useSearchParams` URL filter sync, multi-field filter, column sorting, pagination.
4. **`+ New Lead` (Modal)** ➔ 4-Step Wizard, `trigger()` per-step validation, `useFieldArray` dynamic tags, async email check.
5. **`/leads/:leadId`** ➔ Nested tab sub-routes (`overview`, `activity`, `notes`, `tasks`, `ai`) via `<Outlet context />`.
6. **`/pipeline`** ➔ `@dnd-kit` Kanban, `usePipelineReducer`, optimistic updates, snapshot rollback on API error.
7. **`/tasks` & `/notes`** ➔ Date-fns overdue detection, dynamic progress bar, note tagging & pinning.
8. **`Ctrl+K` (Spotlight)** ➔ Command palette, `useKeyboardShortcut`, `useDeferredValue` non-blocking search.
9. **`/nonexistent`** ➔ 404 fallback route, class-based `ErrorBoundary` crash recovery.

---

### 📁 2. Top 10 Files to Open in Code Review
1. [ProtectedRoute.jsx:6](file:///d:/NAMISH%20M%20S/VS%20Code/AI%20CRM%20Dashboard/frontend/src/components/layout/ProtectedRoute.jsx#L6) — Guards private routes, redirects unauthenticated users preserving `from` path.
2. [usePipelineReducer.js:26](file:///d:/NAMISH%20M%20S/VS%20Code/AI%20CRM%20Dashboard/frontend/src/hooks/usePipelineReducer.js#L26) — Kanban reducer handling column transfers and snapshot rollback.
3. [LeadWizardDialog.jsx:93](file:///d:/NAMISH%20M%20S/VS%20Code/AI%20CRM%20Dashboard/frontend/src/components/leads/LeadWizardDialog.jsx#L93) — 4-step wizard with `trigger()`, `useFieldArray`, and async duplicate check.
4. [validation.js:48](file:///d:/NAMISH%20M%20S/VS%20Code/AI%20CRM%20Dashboard/frontend/src/lib/validation.js#L48) — Zod schemas (`loginSchema`, `leadSchema`) and regex name sanitization.
5. [useLeads.js:12](file:///d:/NAMISH%20M%20S/VS%20Code/AI%20CRM%20Dashboard/frontend/src/hooks/useLeads.js#L12) — Synchronizes table filters, sorting, and pagination with URL search params.
6. [NotificationsContext.jsx:58](file:///d:/NAMISH%20M%20S/VS%20Code/AI%20CRM%20Dashboard/frontend/src/context/NotificationsContext.jsx#L58) — 30-second interval polling with `useRef` timer ID and cleanup.
7. [App.jsx:53](file:///d:/NAMISH%20M%20S/VS%20Code/AI%20CRM%20Dashboard/frontend/src/App.jsx#L53) — Route tree, code splitting via `React.lazy()`, nested tabs, and `<Outlet />`.
8. [api.js:11](file:///d:/NAMISH%20M%20S/VS%20Code/AI%20CRM%20Dashboard/frontend/src/lib/api.js#L11) — Axios request token injection and 401 response auto-logout interceptor.
9. [server.js:1](file:///d:/NAMISH%20M%20S/VS%20Code/AI%20CRM%20Dashboard/backend/server.js#L1) — Express REST backend, 34 endpoints, JWT fail-fast verification.
10. [config.js:1](file:///d:/NAMISH%20M%20S/VS%20Code/AI%20CRM%20Dashboard/frontend/src/lib/services/config.js#L1) — Architectural switch (`VITE_USE_MOCK`) toggling real Axios API vs mock store.

---

### ⚠️ 3. Six Honest Architectural Limitations to State Upfront
1. **Simulated AI Engine:** AI features use a deterministic heuristic service adapter rather than live paid LLM API calls.
2. **In-Memory Backend Store:** Express server stores records in memory fixtures ([store.js](file:///d:/NAMISH%20M%20S/VS%20Code/AI%20CRM%20Dashboard/backend/src/data/store.js)) which resets on restart (MongoDB planned for Phase 4).
3. **localStorage Token Storage:** JWT is kept in `localStorage` for SPA convenience rather than `httpOnly` secure cookies.
4. **Client-Side Pagination:** Leads table paginates in-memory data; server-side SQL/Mongo pagination planned for high scale.
5. **Polling over WebSockets:** Notifications use clean 30-second interval polling rather than a persistent WebSocket server.
6. **Uncontrolled Form Inputs:** React Hook Form leverages DOM refs rather than controlled state to prevent keystroke re-renders.

---

### 💡 4. Ten Essential React Definitions (Say Aloud)
1. **Component:** A reusable, self-contained JavaScript function returning JSX that manages its own lifecycle.
2. **JSX:** A syntax extension allowing HTML-like markup inside JavaScript, transpiled to `_jsxRuntime` calls.
3. **Virtual DOM:** A lightweight in-memory tree of JS objects that React diffs to minimize real DOM mutations.
4. **Reconciliation:** The diffing algorithm React uses to compute changes between old and new Virtual DOM trees.
5. **Controlled vs Uncontrolled:** Controlled inputs store values in React state; Uncontrolled inputs let the DOM hold values via refs.
6. **`useReducer`:** A hook for complex state transitions managed by pure functions and dispatched action objects.
7. **`useMemo` vs `useCallback`:** `useMemo` caches a calculated value; `useCallback` caches a function definition.
8. **`useDeferredValue`:** A concurrent hook that defers non-urgent state recalculations to maintain 60fps UI responsiveness.
9. **Code Splitting (`React.lazy`):** Dynamically imports route bundles on-demand to minimize initial load times.
10. **Error Boundary:** A class component implementing `getDerivedStateFromError` to catch rendering exceptions and prevent white screens.

---

### 📊 5. Verified Project Metrics (Quote Confidently)
- **Lint Status:** **0 Errors** (`npm run lint` / ESLint passes cleanly).
- **Automated Tests:** **33 Passed across 11 Test Files** (`npm test` / Vitest runs in ~1.5s).
- **Vite Build Chunks:** **46 Assets** generated in `dist/assets/` (~700ms build time).
- **Frontend Routes:** **16 Route Definitions** in `App.jsx` (2 public + 1 layout + 6 private pages + 6 nested tabs + 1 404).
- **Backend Endpoints:** **34 Total REST Endpoints** across 9 resource controllers in Express.
