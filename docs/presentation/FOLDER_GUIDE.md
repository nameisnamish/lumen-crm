# 📂 Lumen CRM: Comprehensive Folder & File Guide
**University CIE-2 Capstone Project Architecture Map**  
**Author / Presenter:** Namish M S (First Person Viva Ready)

---

## 📑 Table of Contents
1. [Full Repository Directory Tree](#1-full-repository-directory-tree)
2. [Folder-by-Folder Architectural Reference](#2-folder-by-folder-architectural-reference)
3. ["Where is X?" (48 Verified Code Locations)](#3-where-is-x-verified-code-locations)
4. ["If Sir Says: Show Me..." (20 Quick Navigation Prompts)](#4-if-sir-says-show-me-quick-navigation-prompts)

---

## 1. Full Repository Directory Tree

```
AI CRM Dashboard/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── aiController.js            # Heuristic AI endpoints (summary, email, insights)
│   │   │   ├── analyticsController.js     # Live KPI aggregates & stage metrics
│   │   │   ├── authController.js          # Login, registration, me, & profile
│   │   │   ├── contactsController.js      # Contact CRUD operations
│   │   │   ├── leadsController.js         # Leads CRUD, check-email & reorder
│   │   │   ├── notesController.js         # Notes CRUD & pin management
│   │   │   ├── notificationsController.js # Notifications list & mark-read
│   │   │   ├── searchController.js        # Global search cross-entity handler
│   │   │   └── tasksController.js         # Tasks CRUD & status updates
│   │   ├── data/
│   │   │   └── store.js                   # In-memory data store fixtures & seed state
│   │   ├── middleware/
│   │   │   ├── authMiddleware.js          # JWT Bearer token protection guard
│   │   │   └── errorHandler.js            # Central error normalization middleware
│   │   ├── routes/
│   │   │   ├── aiRoutes.js                # /api/ai endpoints
│   │   │   ├── analyticsRoutes.js         # /api/analytics endpoints
│   │   │   ├── authRoutes.js              # /api/auth endpoints
│   │   │   ├── contactsRoutes.js          # /api/contacts endpoints
│   │   │   ├── leadsRoutes.js             # /api/leads endpoints
│   │   │   ├── notesRoutes.js             # /api/notes endpoints
│   │   │   ├── notificationsRoutes.js     # /api/notifications endpoints
│   │   │   ├── searchRoutes.js            # /api/search endpoints
│   │   │   └── tasksRoutes.js             # /api/tasks endpoints
│   │   └── services/
│   │       └── geminiService.js           # Simulated AI analysis & drafting logic
│   ├── package.json                       # Backend dependencies (Express, JWT, bcryptjs)
│   └── server.js                          # Express app entry, routes mount & startup guard
│
├── frontend/
│   ├── src/
│   │   ├── assets/                        # Static logos, icons, and hero illustrations
│   │   ├── components/
│   │   │   ├── ai/                        # AI Copilot drawer, email dialog, insights card
│   │   │   ├── common/                    # Breadcrumbs, CommandSearch, ConfirmDialog, ErrorBoundary
│   │   │   ├── dashboard/                 # KPI ribbon, charts, activity feed, upcoming tasks
│   │   │   ├── layout/                    # AppLayout, Sidebar, TopNav, ProtectedRoute
│   │   │   ├── leads/                     # LeadDrawer, LeadFormDialog, LeadWizardDialog
│   │   │   └── ui/                        # Reusable primitives (Button, Card, Dialog, Badge, Tabs)
│   │   ├── context/
│   │   │   ├── AuthContext.jsx            # User session & JWT persistence
│   │   │   ├── NotificationsContext.jsx   # Notification state & 30s background polling
│   │   │   └── SettingsContext.jsx        # App preferences with localStorage sync
│   │   ├── hooks/
│   │   │   ├── useClickOutside.js         # Modal & dropdown dismiss handler
│   │   │   ├── useCopilot.js              # AI chat state manager
│   │   │   ├── useDebounce.js             # Value delay hook for search/validation
│   │   │   ├── useKeyboardShortcut.js     # Global key listener (Ctrl+K)
│   │   │   ├── useLeads.js                # URL search params sync, filter & pagination
│   │   │   ├── useLocalStorage.js         # Persistent localStorage state hook
│   │   │   └── usePipelineReducer.js      # Kanban reducer with rollback & drag handling
│   │   ├── lib/
│   │   │   ├── services/                  # Modular API clients with mock fallbacks
│   │   │   ├── api.js                     # Central Axios instance & interceptors
│   │   │   ├── buttonVariants.js          # CVA button style definitions
│   │   │   ├── constants.js               # Enums, pipeline stages, priority styles
│   │   │   ├── format.js                  # Currency, relative date & human formatters
│   │   │   ├── mockData.js                # Seeded mock fixtures for UI mode
│   │   │   └── validation.js              # Zod schemas & regex input sanitization
│   │   ├── pages/
│   │   │   ├── auth/                      # Login & Register views
│   │   │   ├── contacts/                  # Contacts directory, cards & tag filters
│   │   │   ├── dashboard/                 # Executive dashboard analytics view
│   │   │   ├── leads/                     # Leads list & nested tab detail pages
│   │   │   ├── notes/                     # Notes board & creation dialog
│   │   │   ├── pipeline/                  # Kanban board, deal cards & stage stats
│   │   │   ├── settings/                  # User profile & preferences view
│   │   │   ├── tasks/                     # Task manager, progress card & status rows
│   │   │   └── NotFoundPage.jsx           # Catch-all 404 error page
│   │   ├── App.jsx                        # Route controller & lazy page definitions
│   │   ├── index.css                      # Tailwind v4 theme tokens & CSS variables
│   │   └── main.jsx                       # Entry point with BrowserRouter & AuthProvider
│   ├── tests/
│   │   ├── unit/                          # 11 Vitest test files (33 passing tests)
│   │   └── setup.js                       # Test environment initialization
│   ├── package.json                       # Frontend dependencies (React 19, Vite, Tailwind v4)
│   └── vite.config.js                     # Vite build & test configuration
│
└── docs/presentation/                     # Comprehensive presentation & viva guides
```

---

## 2. Folder-by-Folder Architectural Reference

### `frontend/src/components/ui/`
- **Purpose:** Centralized Atomic UI Component Kit.
- **Architectural Reason:** Strict DRY (Don't Repeat Yourself) principle. Every visual primitive (buttons, badges, modals, form inputs) is defined once with unified accessibility, dark-mode tokens, and keyboard focus rings.
- **Imports / Imported by:** Imports `cva`, `clsx`, `lucide-react`. Imported by all feature components and page views.
- **React Concepts:** Prop composition, `children`, forwarded refs, accessibility attributes.

### `frontend/src/components/layout/`
- **Purpose:** Application skeleton, navigation bars, and route protection.
- **Architectural Reason:** Separation of layout structure from domain page logic. Contains [AppLayout.jsx](file:///d:/NAMISH%20M%20S/VS%20Code/AI%20CRM%20Dashboard/frontend/src/components/layout/AppLayout.jsx) which wraps nested routes via `<Outlet />`.
- **React Concepts:** Layout composition, Route guards ([ProtectedRoute.jsx](file:///d:/NAMISH%20M%20S/VS%20Code/AI%20CRM%20Dashboard/frontend/src/components/layout/ProtectedRoute.jsx)), Context consumption.

### `frontend/src/context/`
- **Purpose:** Global application state that transcends individual routes.
- **Architectural Reason:** Avoids multi-level prop drilling for user authentication, global notifications, and theme settings.
- **React Concepts:** React `createContext`, `useContext`, state synchronization, polling lifecycle with cleanup.

### `frontend/src/hooks/`
- **Purpose:** Custom React Hooks encapsulating reusable business and browser logic.
- **Architectural Reason:** Separation of business logic from UI rendering. Components remain pure visual presenters while complex operations (state machines, URL params, keyboard events) live in testable custom hooks.
- **React Concepts:** Custom hook composition, `useReducer`, `useMemo`, `useCallback`, `useDeferredValue`, `useRef`.

### `frontend/src/lib/services/`
- **Purpose:** API Service Layer and mock data proxy.
- **Architectural Reason:** Decouples UI components from HTTP networking details. Components call `leadsApi.list()` without caring whether data comes from Axios REST endpoints or in-memory mock fixtures.
- **React Concepts:** Service layer abstraction, environment configuration switching (`USE_MOCK`).

### `frontend/src/pages/`
- **Purpose:** Top-level route views organized into feature domains (`auth`, `dashboard`, `leads`, `pipeline`, `contacts`, `notes`, `tasks`, `settings`).
- **Architectural Reason:** Supports Code Splitting via `React.lazy()`. Each page folder contains its sub-components, modals, and toolbars.
- **React Concepts:** Lazy loading, Suspense, Nested routing, URL parameters.

### `backend/src/controllers/`
- **Purpose:** Express HTTP request handlers.
- **Architectural Reason:** Pure controller pattern. Extracts params from `req`, executes business logic on the data store, and formats clean JSON responses `{ success: true, data }`.
- **Backend Concepts:** REST API standards, status codes, async/await error handling.

---

## 3. "Where is X?" (Verified Code Locations)

| # | Item to Find | Verified File & Line | One-Sentence Technical Explanation |
| :---: | :--- | :--- | :--- |
| **1** | **Protected Route** | [ProtectedRoute.jsx:6-23](file:///d:/NAMISH%20M%20S/VS%20Code/AI%20CRM%20Dashboard/frontend/src/components/layout/ProtectedRoute.jsx#L6-L23) | Checks `useAuth()`, redirects unauthenticated users to `/login` preserving location state. |
| **2** | **Login Form** | [Login.jsx:18-39](file:///d:/NAMISH%20M%20S/VS%20Code/AI%20CRM%20Dashboard/frontend/src/pages/auth/Login.jsx#L18-L39) | Handles sign-in using `react-hook-form` and `zodResolver` with demo credentials filler. |
| **3** | **Zod Schemas** | [validation.js:48-85](file:///d:/NAMISH%20M%20S/VS%20Code/AI%20CRM%20Dashboard/frontend/src/lib/validation.js#L48-L85) | Declares `loginSchema`, `registerSchema`, and `leadSchema` with strict bounds and error messages. |
| **4** | **Axios Interceptor** | [api.js:11-32](file:///d:/NAMISH%20M%20S/VS%20Code/AI%20CRM%20Dashboard/frontend/src/lib/api.js#L11-L32) | Attaches Bearer JWT on requests and strips token on 401 Unauthorized responses. |
| **5** | **Mock vs Real Switch** | [config.js:1](file:///d:/NAMISH%20M%20S/VS%20Code/AI%20CRM%20Dashboard/frontend/src/lib/services/config.js#L1) | Evaluates `import.meta.env.VITE_USE_MOCK !== "false"` to toggle between mock store and Axios. |
| **6** | **Auth Context** | [AuthContext.jsx:11-45](file:///d:/NAMISH%20M%20S/VS%20Code/AI%20CRM%20Dashboard/frontend/src/context/AuthContext.jsx#L11-L45) | Restores session on mount via `/auth/me` and manages login/logout token lifecycle. |
| **7** | **Notifications Polling** | [NotificationsContext.jsx:58-81](file:///d:/NAMISH%20M%20S/VS%20Code/AI%20CRM%20Dashboard/frontend/src/context/NotificationsContext.jsx#L58-L81) | Runs 30-second `setInterval` with `active` boolean guard and `clearInterval` on unmount. |
| **8** | **Settings Context** | [SettingsContext.jsx:19-42](file:///d:/NAMISH%20M%20S/VS%20Code/AI%20CRM%20Dashboard/frontend/src/context/SettingsContext.jsx#L19-L42) | Synchronizes user theme, view mode, and currency preferences with `localStorage`. |
| **9** | **Pipeline Reducer** | [usePipelineReducer.js:26-102](file:///d:/NAMISH%20M%20S/VS%20Code/AI%20CRM%20Dashboard/frontend/src/hooks/usePipelineReducer.js#L26-L102) | Pure reducer managing multi-stage board dictionary, optimistic moves, and rollback snapshot. |
| **10** | **Rollback Dispatcher** | [usePipelineReducer.js:145-149](file:///d:/NAMISH%20M%20S/VS%20Code/AI%20CRM%20Dashboard/frontend/src/hooks/usePipelineReducer.js#L145-L149) | Dispatches `ACTIONS.ROLLBACK` to restore previous board state if backend reorder fails. |
| **11** | **Dnd-Kit Drag Handler** | [PipelinePage.jsx:85-115](file:///d:/NAMISH%20M%20S/VS%20Code/AI%20CRM%20Dashboard/frontend/src/pages/pipeline/PipelinePage.jsx#L85-L115) | Handles `onDragStart`, `onDragOver`, and `onDragEnd` using `PointerSensor` with 6px constraint. |
| **12** | **URL-Synced Filters** | [useLeads.js:12-22](file:///d:/NAMISH%20M%20S/VS%20Code/AI%20CRM%20Dashboard/frontend/src/hooks/useLeads.js#L12-L22) | Reads status, priority, source, search, and sort parameters directly from `useSearchParams`. |
| **13** | **Client Pagination** | [useLeads.js:110-115](file:///d:/NAMISH%20M%20S/VS%20Code/AI%20CRM%20Dashboard/frontend/src/hooks/useLeads.js#L110-L115) | Slices filtered leads array based on current `page` and `pageSize` (10, 25, 50). |
| **14** | **Command Palette** | [CommandSearch.jsx:35-85](file:///d:/NAMISH%20M%20S/VS%20Code/AI%20CRM%20Dashboard/frontend/src/components/common/CommandSearch.jsx#L35-L85) | Modal search listening for `Ctrl+K` with keyboard arrows and enter selection. |
| **15** | **Keyboard Shortcut Hook** | [useKeyboardShortcut.js:1-25](file:///d:/NAMISH%20M%20S/VS%20Code/AI%20CRM%20Dashboard/frontend/src/hooks/useKeyboardShortcut.js#L1-L25) | Custom hook binding `keydown` event listeners to `window` with automatic cleanup. |
| **16** | **Debounce Hook** | [useDebounce.js:1-18](file:///d:/NAMISH%20M%20S/VS%20Code/AI%20CRM%20Dashboard/frontend/src/hooks/useDebounce.js#L1-L18) | Delays updating debounced value by configured millisecond delay using `setTimeout`. |
| **17** | **useDeferredValue Usage** | [PipelinePage.jsx:39](file:///d:/NAMISH%20M%20S/VS%20Code/AI%20CRM%20Dashboard/frontend/src/pages/pipeline/PipelinePage.jsx#L39) | Defers pipeline card filtering during fast typing to preserve responsive 60fps input. |
| **18** | **React.memo Optimization** | [DealCard.jsx:11](file:///d:/NAMISH%20M%20S/VS%20Code/AI%20CRM%20Dashboard/frontend/src/pages/pipeline/DealCard.jsx#L11) | Wraps Kanban card in `React.memo()` to prevent re-rendering unaffected cards during drag. |
| **19** | **Lazy Loading & Suspense** | [App.jsx:8-30](file:///d:/NAMISH%20M%20S/VS%20Code/AI%20CRM%20Dashboard/frontend/src/App.jsx#L8-L30) | Splits 16 page routes with `React.lazy()` wrapped in `<Suspense fallback={<PageLoader />}>`. |
| **20** | **404 Catch-All Route** | [App.jsx:71](file:///d:/NAMISH%20M%20S/VS%20Code/AI%20CRM%20Dashboard/frontend/src/App.jsx#L71) | Maps `<Route path="*" element={<NotFoundPage />} />` for unhandled URLs. |
| **21** | **Error Boundary** | [ErrorBoundary.jsx:5-42](file:///d:/NAMISH%20M%20S/VS%20Code/AI%20CRM%20Dashboard/frontend/src/components/common/ErrorBoundary.jsx#L5-L42) | Class component using `getDerivedStateFromError` to catch rendering crashes and render reset UI. |
| **22** | **Nested Routes & Outlet** | [App.jsx:53-61](file:///d:/NAMISH%20M%20S/VS%20Code/AI%20CRM%20Dashboard/frontend/src/App.jsx#L53-L61) | Renders nested child tabs (`overview`, `activity`, `notes`, `tasks`, `ai`) under `/leads/:leadId`. |
| **23** | **Outlet Context Passing** | [LeadDetailPage.jsx:213](file:///d:/NAMISH%20M%20S/VS%20Code/AI%20CRM%20Dashboard/frontend/src/pages/leads/LeadDetailPage.jsx#L213) | Passes `<Outlet context={{ lead, refetchLead }} />` to provide lead data to active sub-tab. |
| **24** | **useOutletContext Consumption** | [LeadOverviewTab.jsx:7](file:///d:/NAMISH%20M%20S/VS%20Code/AI%20CRM%20Dashboard/frontend/src/pages/leads/LeadOverviewTab.jsx#L7) | Reads `const { lead } = useOutletContext()` inside nested lead overview tab. |
| **25** | **useParams Dynamic ID** | [LeadDetailPage.jsx:25](file:///d:/NAMISH%20M%20S/VS%20Code/AI%20CRM%20Dashboard/frontend/src/pages/leads/LeadDetailPage.jsx#L25) | Extracts `const { leadId } = useParams()` to load opportunity details from API. |
| **26** | **CVA Button Variants** | [buttonVariants.js:4-29](file:///d:/NAMISH%20M%20S/VS%20Code/AI%20CRM%20Dashboard/frontend/src/lib/buttonVariants.js#L4-L29) | Declares variant classes (`primary`, `secondary`, `outline`, `ghost`, `danger`) and sizes. |
| **27** | **Dialog & Modal Primitive** | [Dialog.jsx:1-65](file:///d:/NAMISH%20M%20S/VS%20Code/AI%20CRM%20Dashboard/frontend/src/components/ui/Dialog.jsx#L1-L65) | Reusable modal overlay and slide-over Drawer with ESC key listening and backdrop dismiss. |
| **28** | **Toast Notifications** | [main.jsx:24](file:///d:/NAMISH%20M%20S/VS%20Code/AI%20CRM%20Dashboard/frontend/src/main.jsx#L24) | Configures Sonner `<Toaster position="top-right" richColors />` root instance. |
| **29** | **Recharts Line & Bar Charts** | [PipelineEngagementSection.jsx](file:///d:/NAMISH%20M%20S/VS%20Code/AI%20CRM%20Dashboard/frontend/src/components/dashboard/PipelineEngagementSection.jsx) | Renders responsive `AreaChart`, `BarChart`, and `PieChart` with custom SVG tooltips. |
| **30** | **Wizard useFieldArray** | [LeadWizardDialog.jsx:75](file:///d:/NAMISH%20M%20S/VS%20Code/AI%20CRM%20Dashboard/frontend/src/components/leads/LeadWizardDialog.jsx#L75) | Connects `useFieldArray` for dynamic immutable lead tag insertion and deletion. |
| **31** | **Wizard Per-Step Trigger** | [LeadWizardDialog.jsx:99](file:///d:/NAMISH%20M%20S/VS%20Code/AI%20CRM%20Dashboard/frontend/src/components/leads/LeadWizardDialog.jsx#L99) | Calls `await trigger(fieldsToValidate)` to validate only current step inputs. |
| **32** | **Async Email Check** | [LeadWizardDialog.jsx:107](file:///d:/NAMISH%20M%20S/VS%20Code/AI%20CRM%20Dashboard/frontend/src/components/leads/LeadWizardDialog.jsx#L107) | Queries backend `/leads/check-email` to flag duplicate leads before Step 3. |
| **33** | **Check-Email Endpoint** | [leadsController.js:5-12](file:///d:/NAMISH%20M%20S/VS%20Code/AI%20CRM%20Dashboard/backend/src/controllers/leadsController.js#L5-L12) | Express handler performing case-insensitive lead email collision check. |
| **34** | **Backend Server Setup** | [server.js:1-63](file:///d:/NAMISH%20M%20S/VS%20Code/AI%20CRM%20Dashboard/backend/server.js#L1-L63) | Configures Express app, mounts 9 route groups, and sets up centralized error handling. |
| **35** | **JWT Secret Fail-Fast** | [server.js:16-19](file:///d:/NAMISH%20M%20S/VS%20Code/AI%20CRM%20Dashboard/backend/server.js#L16-L19) | Checks `process.env.JWT_SECRET` and halts execution if missing with fatal console log. |
| **36** | **JWT Auth Middleware** | [authMiddleware.js:3-27](file:///d:/NAMISH%20M%20S/VS%20Code/AI%20CRM%20Dashboard/backend/src/middleware/authMiddleware.js#L3-L27) | Verifies Bearer token with `jwt.verify()` and injects user payload into `req.user`. |
| **37** | **Bcrypt Password Hash** | [authController.js:34](file:///d:/NAMISH%20M%20S/VS%20Code/AI%20CRM%20Dashboard/backend/src/controllers/authController.js#L34) | Compares user plaintext password with hashed secret via `bcrypt.compare()`. |
| **38** | **CORS Configuration** | [server.js:25](file:///d:/NAMISH%20M%20S/VS%20Code/AI%20CRM%20Dashboard/backend/server.js#L25) | Applies `cors()` middleware to enable secure cross-origin API calls from Vite dev server. |
| **39** | **AI Heuristic Service** | [geminiService.js:1-35](file:///d:/NAMISH%20M%20S/VS%20Code/AI%20CRM%20Dashboard/backend/src/services/geminiService.js#L1-L35) | Heuristic algorithm calculating lead risk scores, next best actions, and email drafts. |
| **40** | **Pipeline Reducer Test** | [pipelineReducer.test.js](file:///d:/NAMISH%20M%20S/VS%20Code/AI%20CRM%20Dashboard/frontend/tests/unit/pipelineReducer.test.js) | 6 unit tests verifying `SET_BOARD`, `MOVE_DEAL`, and `ROLLBACK` actions. |
| **41** | **Lead Wizard Test** | [leadWizard.test.jsx](file:///d:/NAMISH%20M%20S/VS%20Code/AI%20CRM%20Dashboard/frontend/tests/unit/leadWizard.test.jsx) | 3 component tests asserting step transitions, validation blocks, and duplicate email error. |
| **42** | **Login Form Test** | [loginForm.test.jsx](file:///d:/NAMISH%20M%20S/VS%20Code/AI%20CRM%20Dashboard/frontend/tests/unit/loginForm.test.jsx) | 2 component tests asserting required field errors and valid credential submission. |
| **43** | **Protected Route Test** | [protectedRoute.test.jsx](file:///d:/NAMISH%20M%20S/VS%20Code/AI%20CRM%20Dashboard/frontend/tests/unit/protectedRoute.test.jsx) | 3 tests verifying redirect on null user, child rendering, and spinner state. |
| **44** | **Name Regex & Sanitization** | [validation.js:7-13](file:///d:/NAMISH%20M%20S/VS%20Code/AI%20CRM%20Dashboard/frontend/src/lib/validation.js#L7-L13) | `NAME_REGEX` pattern and `sanitizeNameInput` function stripping illegal symbols. |
| **45** | **Currency & Date Formatters** | [format.js:1-45](file:///d:/NAMISH%20M%20S/VS%20Code/AI%20CRM%20Dashboard/frontend/src/lib/format.js#L1-L45) | Utility helpers for USD currency formatting, compact numbers ($120k), and relative dates. |
| **46** | **Global Search Handler** | [searchController.js:4-28](file:///d:/NAMISH%20M%20S/VS%20Code/AI%20CRM%20Dashboard/backend/src/controllers/searchController.js#L4-L28) | Multi-entity search querying leads, contacts, and tasks with regex matching. |
| **47** | **In-Memory Seed Store** | [store.js:1-120](file:///d:/NAMISH%20M%20S/VS%20Code/AI%20CRM%20Dashboard/backend/src/data/store.js#L1-L120) | Relational fixtures for mock users, leads, contacts, tasks, notes, and notifications. |
| **48** | **Environment Configuration** | `frontend/.env` & `backend/.env` | Configures `PORT=8000`, `JWT_SECRET`, `VITE_API_URL`, and `VITE_USE_MOCK`. |

---

## 4. "If Sir Says: Show Me..." (Quick Navigation Prompts)

If the examiner asks to inspect specific code during the viva, immediately open these exact files:

1. **"Show me where you protect private routes"** ➔ Open [frontend/src/components/layout/ProtectedRoute.jsx](file:///d:/NAMISH%20M%20S/VS%20Code/AI%20CRM%20Dashboard/frontend/src/components/layout/ProtectedRoute.jsx#L6)
2. **"Show me your Kanban drag-and-drop reducer"** ➔ Open [frontend/src/hooks/usePipelineReducer.js](file:///d:/NAMISH%20M%20S/VS%20Code/AI%20CRM%20Dashboard/frontend/src/hooks/usePipelineReducer.js#L26)
3. **"Show me where you handle optimistic rollback on API failure"** ➔ Open [frontend/src/hooks/usePipelineReducer.js](file:///d:/NAMISH%20M%20S/VS%20Code/AI%20CRM%20Dashboard/frontend/src/hooks/usePipelineReducer.js#L140)
4. **"Show me your multi-step form and step validation"** ➔ Open [frontend/src/components/leads/LeadWizardDialog.jsx](file:///d:/NAMISH%20M%20S/VS%20Code/AI%20CRM%20Dashboard/frontend/src/components/leads/LeadWizardDialog.jsx#L93)
5. **"Show me your Zod schemas"** ➔ Open [frontend/src/lib/validation.js](file:///d:/NAMISH%20M%20S/VS%20Code/AI%20CRM%20Dashboard/frontend/src/lib/validation.js#L48)
6. **"Show me where you use `useFieldArray`"** ➔ Open [frontend/src/components/leads/LeadWizardDialog.jsx](file:///d:/NAMISH%20M%20S/VS%20Code/AI%20CRM%20Dashboard/frontend/src/components/leads/LeadWizardDialog.jsx#L75)
7. **"Show me your Axios interceptor and token injection"** ➔ Open [frontend/src/lib/api.js](file:///d:/NAMISH%20M%20S/VS%20Code/AI%20CRM%20Dashboard/frontend/src/lib/api.js#L11)
8. **"Show me your background polling effect and cleanup"** ➔ Open [frontend/src/context/NotificationsContext.jsx](file:///d:/NAMISH%20M%20S/VS%20Code/AI%20CRM%20Dashboard/frontend/src/context/NotificationsContext.jsx#L58)
9. **"Show me where you use `useDeferredValue`"** ➔ Open [frontend/src/pages/pipeline/PipelinePage.jsx](file:///d:/NAMISH%20M%20S/VS%20Code/AI%20CRM%20Dashboard/frontend/src/pages/pipeline/PipelinePage.jsx#L39)
10. **"Show me where you use `React.memo`"** ➔ Open [frontend/src/pages/pipeline/DealCard.jsx](file:///d:/NAMISH%20M%20S/VS%20Code/AI%20CRM%20Dashboard/frontend/src/pages/pipeline/DealCard.jsx#L11)
11. **"Show me your nested routes and `<Outlet />`"** ➔ Open [frontend/src/App.jsx](file:///d:/NAMISH%20M%20S/VS%20Code/AI%20CRM%20Dashboard/frontend/src/App.jsx#L53) and [LeadDetailPage.jsx](file:///d:/NAMISH%20M%20S/VS%20Code/AI%20CRM%20Dashboard/frontend/src/pages/leads/LeadDetailPage.jsx#L213)
12. **"Show me where you sync filters to URL parameters"** ➔ Open [frontend/src/hooks/useLeads.js](file:///d:/NAMISH%20M%20S/VS%20Code/AI%20CRM%20Dashboard/frontend/src/hooks/useLeads.js#L12)
13. **"Show me your backend JWT verification middleware"** ➔ Open [backend/src/middleware/authMiddleware.js](file:///d:/NAMISH%20M%20S/VS%20Code/AI%20CRM%20Dashboard/backend/src/middleware/authMiddleware.js#L3)
14. **"Show me your backend password comparison with bcrypt"** ➔ Open [backend/src/controllers/authController.js](file:///d:/NAMISH%20M%20S/VS%20Code/AI%20CRM%20Dashboard/backend/src/controllers/authController.js#L34)
15. **"Show me your backend check-email endpoint"** ➔ Open [backend/src/controllers/leadsController.js](file:///d:/NAMISH%20M%20S/VS%20Code/AI%20CRM%20Dashboard/backend/src/controllers/leadsController.js#L5)
16. **"Show me your Vitest unit tests"** ➔ Open [frontend/tests/unit/pipelineReducer.test.js](file:///d:/NAMISH%20M%20S/VS%20Code/AI%20CRM%20Dashboard/frontend/tests/unit/pipelineReducer.test.js) and [leadWizard.test.jsx](file:///d:/NAMISH%20M%20S/VS%20Code/AI%20CRM%20Dashboard/frontend/tests/unit/leadWizard.test.jsx)
17. **"Show me your mock vs real backend toggle"** ➔ Open [frontend/src/lib/services/config.js](file:///d:/NAMISH%20M%20S/VS%20Code/AI%20CRM%20Dashboard/frontend/src/lib/services/config.js#L1) and [leads.js](file:///d:/NAMISH%20M%20S/VS%20Code/AI%20CRM%20Dashboard/frontend/src/lib/services/leads.js#L5)
18. **"Show me your Command Palette keyboard listener"** ➔ Open [frontend/src/components/common/CommandSearch.jsx](file:///d:/NAMISH%20M%20S/VS%20Code/AI%20CRM%20Dashboard/frontend/src/components/common/CommandSearch.jsx#L45)
19. **"Show me your Error Boundary"** ➔ Open [frontend/src/components/common/ErrorBoundary.jsx](file:///d:/NAMISH%20M%20S/VS%20Code/AI%20CRM%20Dashboard/frontend/src/components/common/ErrorBoundary.jsx#L5)
20. **"Show me your CVA Button variants definition"** ➔ Open [frontend/src/lib/buttonVariants.js](file:///d:/NAMISH%20M%20S/VS%20Code/AI%20CRM%20Dashboard/frontend/src/lib/buttonVariants.js#L4)
