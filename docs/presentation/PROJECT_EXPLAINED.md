# 📖 Lumen CRM: Complete Project Explanation
**University CIE-2 Capstone Project Write-Up & Viva Guide**  
**Author / Presenter:** Namish M S (First Person Viva Ready)

---

## 📑 Table of Contents
1. [What is a CRM? (Plain Language & Real-World Context)](#1-what-is-a-crm)
2. [Project Provenance & Authorship Breakdown](#2-project-provenance--authorship-breakdown)
3. [Frontend Feature Suite & Architecture](#3-frontend-feature-suite--architecture)
4. [Backend API Architecture & Security](#4-backend-api-architecture--security)
5. [Mock Data Layer vs Real Backend Execution](#5-mock-data-layer-vs-real-backend-execution)
6. [Technology Stack & Architectural Trade-offs](#6-technology-stack--architectural-trade-offs)

---

## 1. What is a CRM?

### What it is & The Problem it Solves
**CRM** stands for **Customer Relationship Management**. In simple terms, a CRM is a centralized software system that helps businesses keep track of every potential customer (a "lead"), every ongoing sales negotiation (a "deal"), and every active customer contact from the very first hello to a closed contract.

Without a CRM, businesses suffer from:
- **Lost Opportunities:** Inquiries buried in personal WhatsApp chats or sticky notes get forgotten.
- **Lack of Visibility:** Managers cannot see how many deals are close to closing or which sales reps need help.
- **Disorganized Data:** Customer phone numbers, emails, and conversation history are scattered across Excel sheets.
- **Missed Follow-Ups:** No alerts when a promised callback or proposal deadline is overdue.

### Who Uses It?
- **Sales Representatives / SDRs:** Log daily calls, schedule follow-ups, update deal values, and track progress.
- **Sales Managers & Founders:** Monitor the sales pipeline, forecast monthly revenue, and evaluate conversion rates.
- **Customer Success & Support:** Reference historical client requirements and contact records.

### Industries That Depend on CRMs
- **SaaS & Tech Companies:** Manage inbound free trials and enterprise software subscriptions.
- **Real Estate & Property Developers:** Track property inquiries, site visits, and booking negotiations.
- **Education & Admissions:** Track prospective student inquiries, counseling sessions, and enrollments.
- **Marketing & Creative Agencies:** Manage client pitches, retainers, and proposal sign-offs.
- **Wholesale & B2B Distribution:** Track recurring dealer orders and credit terms.

### 3 Small Indian Business Examples
1. **Bangalore Digital Marketing Agency:** Inbound inquiries from Instagram ads are logged as leads. The team moves them across stages (*Inquiry ➔ Discovery Call ➔ Proposal Sent ➔ Retainer Won*) and assigns follow-up tasks to account managers.
2. **Pune Industrial Component Distributor:** Tracks wholesale inquiries for CNC machine parts from auto ancillaries, tracking deal amounts ($20,000–$150,000), delivery lead times in notes, and customer purchase manager contacts.
3. **Kota / Delhi EdTech & Coaching Center:** Manages student counseling leads, tracking student test streams, parent contact numbers, scholarship interview dates, and admission fee payment follow-ups.

### A Typical Sales Rep's Day with a CRM
1. **9:00 AM (Morning Review):** Opens the **Dashboard** to review overdue follow-up tasks and high-priority deals closing this week.
2. **10:30 AM (Inbound Intake):** Receives a new inquiry, opens the **4-Step Lead Wizard**, creates a lead record, and attaches relevant tags.
3. **1:30 PM (Pipeline Progression):** After a successful demo call, drags the deal on the **Kanban Pipeline** from *Qualified* to *Proposal*.
4. **3:00 PM (Outreach):** Generates a personalized follow-up email draft using the **AI Assistant** and logs the action in the lead timeline.
5. **5:30 PM (End of Day):** Adds interaction notes on the **Contact Record** and schedules tomorrow's reminders on the **Tasks Board**.

### Spreadsheets / WhatsApp vs Lumen CRM

| Dimension | Excel Spreadsheets / WhatsApp | Lumen CRM Dashboard |
| :--- | :--- | :--- |
| **Pipeline Visualization** | Static flat rows; hard to see deal stage health | Interactive drag-and-drop Kanban board with stage totals |
| **Follow-Up Discipline** | Manual reminders; easy to forget | Automated priority-based task engine with Overdue / Due Today alerts |
| **Data Integrity** | Prone to typos, accidental overwrites, duplicate entries | Zod schema validation, regex name sanitization, async duplicate email checks |
| **Insights & Intelligence** | Manual formulas and pivot tables | Automated KPI ribbons, dynamic intake cadence charts, heuristic AI lead health scoring |
| **Security & Access** | Unrestricted file sharing or local files | JWT-authenticated sessions with protected route authorization |

---

## 2. Project Provenance & Authorship Breakdown

### Provenance Table

| Feature / Area | Origin | Code Evidence & Files | What I Changed / Built |
| :--- | :--- | :--- | :--- |
| **Backend Express API** | **100% MINE** | [backend/server.js](file:///d:/NAMISH%20M%20S/VS%20Code/AI%20CRM%20Dashboard/backend/server.js), 9 controllers, 9 routes in `backend/src/` | Created the entire Node.js Express REST API, 34 endpoints, JWT middleware with fail-fast check, bcrypt password hashing, and in-memory relational store. |
| **Vitest Test Suite** | **100% MINE** | [frontend/tests/unit/](file:///d:/NAMISH%20M%20S/VS%20Code/AI%20CRM%20Dashboard/frontend/tests/unit/) (11 test files, 33 tests) | Wrote unit tests for pipeline reducer, lead wizard, login form, protected route, debouncing, localStorage, formatters, and Zod validation. |
| **Lead Creation Wizard** | **100% MINE** | [LeadWizardDialog.jsx](file:///d:/NAMISH%20M%20S/VS%20Code/AI%20CRM%20Dashboard/frontend/src/components/leads/LeadWizardDialog.jsx) | Built 4-step wizard with Zod resolver, per-step `trigger()` validation, `useFieldArray` for dynamic tags, and async duplicate email check against backend. |
| **Pipeline State Engine** | **100% MINE** | [usePipelineReducer.js](file:///d:/NAMISH%20M%20S/VS%20Code/AI%20CRM%20Dashboard/frontend/src/hooks/usePipelineReducer.js) | Implemented `useReducer` managing multi-column state with optimistic drag updates and automatic rollback snapshot on API network failure. |
| **URL-Synced Filter Hook** | **100% MINE** | [useLeads.js](file:///d:/NAMISH%20M%20S/VS%20Code/AI%20CRM%20Dashboard/frontend/src/hooks/useLeads.js) | Built `useSearchParams` hook supporting multi-field filtering (status, priority, source), debounced search, sorting, and pagination. |
| **Command Palette (`Ctrl+K`)** | **100% MINE** | [CommandSearch.jsx](file:///d:/NAMISH%20M%20S/VS%20Code/AI%20CRM%20Dashboard/frontend/src/components/common/CommandSearch.jsx) | Built global search modal with keyboard shortcuts and `useDeferredValue` for fast navigation. |
| **Context Providers** | **100% MINE** | [AuthContext.jsx](file:///d:/NAMISH%20M%20S/VS%20Code/AI%20CRM%20Dashboard/frontend/src/context/AuthContext.jsx), [NotificationsContext.jsx](file:///d:/NAMISH%20M%20S/VS%20Code/AI%20CRM%20Dashboard/frontend/src/context/NotificationsContext.jsx), [SettingsContext.jsx](file:///d:/NAMISH%20M%20S/VS%20Code/AI%20CRM%20Dashboard/frontend/src/context/SettingsContext.jsx) | Implemented token persistence, 30s background notification polling with cleanup, and localStorage settings. |
| **Lead Detail Nested Tabs** | **100% MINE** | [LeadDetailPage.jsx](file:///d:/NAMISH%20M%20S/VS%20Code/AI%20CRM%20Dashboard/frontend/src/pages/leads/LeadDetailPage.jsx), 5 tab components in `pages/leads/` | Built nested tab sub-routing using React Router v7 `<Outlet context />` and `useOutletContext()`. |
| **UI Shell & Mock Layout** | **ADAPTED** | `components/layout/`, `components/dashboard/`, `mockData.js` | Started from tutorial layout boilerplate; restructured into modular feature folders, upgraded to Tailwind v4, added CVA button variants and dark theme tokens. |

### How to Say This Honestly in 30 Seconds (Viva Script)
> *"Sir, I started this project using a YouTube UI boilerplate by time-to-program to get the initial layout styling and mock dataset. On top of that foundation, I built the entire Node.js/Express REST API backend from scratch with JWT authentication, implemented state-driven features like the Kanban reducer with optimistic rollback, built a 4-step lead wizard with Zod validation, created custom hooks for URL-synced filtering, and wrote an automated suite of 33 unit tests with Vitest."*

### Items Requiring Confirmation
- **Original YouTube Boilerplate Clone:** The folder `../ai-crm-boilerplate` was not present in the parent directory during analysis, so comparisons are based directly on Git commit history (`.git/logs/HEAD`), showing the initial clone from `github.com/time-to-program/ai-crm-dashboard-ui-boilerplate-code.git` and subsequent feature commits.

---

## 3. Frontend Feature Suite & Architecture

### 1. Authentication (`/login`, `/register`)
- **What the user sees:** Sleek dark-mode login card with one-click demo credentials, input validation feedback, and password toggles.
- **Business Purpose:** Restricts CRM access to verified team members and binds created deals to user accounts.
- **Components & Hooks:** [Login.jsx](file:///d:/NAMISH%20M%20S/VS%20Code/AI%20CRM%20Dashboard/frontend/src/pages/auth/Login.jsx), [AuthShell.jsx](file:///d:/NAMISH%20M%20S/VS%20Code/AI%20CRM%20Dashboard/frontend/src/pages/auth/AuthShell.jsx), `useForm`, `zodResolver(loginSchema)`, `useAuth()`.

### 2. Executive Dashboard (`/`)
- **What the user sees:** Top KPI ribbon (Pipeline Value, Won Revenue, Conversion Win Rate, Active Leads), adaptive intake cadence charts (1M, 3M, 6M, 1Y), channel acquisition donut chart, and recent activity feed.
- **Business Purpose:** Gives sales leaders an instant pulse on revenue performance, velocity pacing, and lead source ROI.
- **Components & Hooks:** [DashboardPage.jsx](file:///d:/NAMISH%20M%20S/VS%20Code/AI%20CRM%20Dashboard/frontend/src/pages/dashboard/DashboardPage.jsx), [KpiRibbon.jsx](file:///d:/NAMISH%20M%20S/VS%20Code/AI%20CRM%20Dashboard/frontend/src/components/dashboard/KpiRibbon.jsx), [PipelineEngagementSection.jsx](file:///d:/NAMISH%20M%20S/VS%20Code/AI%20CRM%20Dashboard/frontend/src/components/dashboard/PipelineEngagementSection.jsx), Recharts library.

### 3. Leads Management (`/leads`)
- **What the user sees:** Toggleable Table and Card Grid views, real-time search, multi-field filters (Status, Priority, Source), column header sorting, pagination controls, CSV export, and bulk deletion.
- **Business Purpose:** Central database for sales reps to manage all inbound and outbound customer accounts.
- **Components & Hooks:** [LeadsPage.jsx](file:///d:/NAMISH%20M%20S/VS%20Code/AI%20CRM%20Dashboard/frontend/src/pages/leads/LeadsPage.jsx), [LeadsTable.jsx](file:///d:/NAMISH%20M%20S/VS%20Code/AI%20CRM%20Dashboard/frontend/src/pages/leads/LeadsTable.jsx), [useLeads.js](file:///d:/NAMISH%20M%20S/VS%20Code/AI%20CRM%20Dashboard/frontend/src/hooks/useLeads.js), `useSearchParams`, `useMemo`.

### 4. 4-Step Lead Creation Wizard
- **What the user sees:** Modal wizard with step progress indicator: Step 1 (Company & Source), Step 2 (Contact & Async Email Verification), Step 3 (Deal Value & Priority), Step 4 (Summary Review & Submit).
- **Business Purpose:** Enforces complete and clean data entry without overwhelming the sales rep on a single massive form.
- **Components & Hooks:** [LeadWizardDialog.jsx](file:///d:/NAMISH%20M%20S/VS%20Code/AI%20CRM%20Dashboard/frontend/src/components/leads/LeadWizardDialog.jsx), `useForm`, `useFieldArray`, `trigger()`, `zodResolver(leadSchema)`.

### 5. Lead Detail Page with Nested Tabs (`/leads/:leadId`)
- **What the user sees:** Header with lead metrics, breadcrumb navigation, quick action buttons (Edit, Delete, AI Score), and sub-tabs for Overview, Activity Timeline, Notes, Tasks, and AI Analysis.
- **Business Purpose:** 360-degree view of an opportunity to prepare for customer calls.
- **Components & Hooks:** [LeadDetailPage.jsx](file:///d:/NAMISH%20M%20S/VS%20Code/AI%20CRM%20Dashboard/frontend/src/pages/leads/LeadDetailPage.jsx), [LeadOverviewTab.jsx](file:///d:/NAMISH%20M%20S/VS%20Code/AI%20CRM%20Dashboard/frontend/src/pages/leads/LeadOverviewTab.jsx), React Router `<Outlet context={{ lead, refetchLead }} />` and `useOutletContext()`.

### 6. Sales Pipeline Kanban Board (`/pipeline`)
- **What the user sees:** 5 draggable stage columns (New, Qualified, Proposal, Won, Lost), stage total values, search filter, fit-to-screen toggle, horizontal scroll controls, and live drag overlay.
- **Business Purpose:** Visual deal velocity management and funnel progression tracking.
- **Components & Hooks:** [PipelinePage.jsx](file:///d:/NAMISH%20M%20S/VS%20Code/AI%20CRM%20Dashboard/frontend/src/pages/pipeline/PipelinePage.jsx), [DealCard.jsx](file:///d:/NAMISH%20M%20S/VS%20Code/AI%20CRM%20Dashboard/frontend/src/pages/pipeline/DealCard.jsx), [usePipelineReducer.js](file:///d:/NAMISH%20M%20S/VS%20Code/AI%20CRM%20Dashboard/frontend/src/hooks/usePipelineReducer.js), `@dnd-kit/core`, `useDeferredValue`, `React.memo`.

### 7. Contacts Directory (`/contacts`)
- **What the user sees:** Searchable contact cards with tag badges, phone/email contact buttons, tag filter drawer, and new contact modal.
- **Business Purpose:** Centralized address book for client stakeholders and decision-makers.
- **Components & Hooks:** [ContactsPage.jsx](file:///d:/NAMISH%20M%20S/VS%20Code/AI%20CRM%20Dashboard/frontend/src/pages/contacts/ContactsPage.jsx), [ContactCard.jsx](file:///d:/NAMISH%20M%20S/VS%20Code/AI%20CRM%20Dashboard/frontend/src/pages/contacts/ContactCard.jsx).

### 8. Tasks & Reminders (`/tasks`)
- **What the user sees:** Categorized task lists (Overdue, Due Today, Upcoming), completion checkboxes, dynamic progress bar, and priority badges.
- **Business Purpose:** Prevents customer commitments and follow-up promises from slipping through cracks.
- **Components & Hooks:** [TasksPage.jsx](file:///d:/NAMISH%20M%20S/VS%20Code/AI%20CRM%20Dashboard/frontend/src/pages/tasks/TasksPage.jsx), [TaskRow.jsx](file:///d:/NAMISH%20M%20S/VS%20Code/AI%20CRM%20Dashboard/frontend/src/pages/tasks/TaskRow.jsx), `date-fns` date helpers.

### 9. Notes & Knowledge Base (`/notes`)
- **What the user sees:** Tagged note cards, pin-to-top functionality, search bar, and note creation dialog.
- **Business Purpose:** Captures meeting minutes, discovery call transcripts, and customer objection notes.
- **Components & Hooks:** [NotesPage.jsx](file:///d:/NAMISH%20M%20S/VS%20Code/AI%20CRM%20Dashboard/frontend/src/pages/notes/NotesPage.jsx), [NoteCard.jsx](file:///d:/NAMISH%20M%20S/VS%20Code/AI%20CRM%20Dashboard/frontend/src/pages/notes/NoteCard.jsx).

### 10. Command Palette (`Ctrl+K`)
- **What the user sees:** Spotlight-style popup to search pages, quick-create leads, or search across contacts and deals.
- **Business Purpose:** Power-user productivity tool for rapid keyboard-driven navigation.
- **Components & Hooks:** [CommandSearch.jsx](file:///d:/NAMISH%20M%20S/VS%20Code/AI%20CRM%20Dashboard/frontend/src/components/common/CommandSearch.jsx), `useKeyboardShortcut`, `useDeferredValue`.

### 11. Real-Time Notification Polling
- **What the user sees:** Bell icon in top nav with live unread badge, dropdown list of recent alerts, and "Mark all as read".
- **Business Purpose:** Keeps reps updated on newly assigned deals and deadline reminders.
- **Components & Hooks:** [NotificationDropdown.jsx](file:///d:/NAMISH%20M%20S/VS%20Code/AI%20CRM%20Dashboard/frontend/src/components/layout/NotificationDropdown.jsx), [NotificationsContext.jsx](file:///d:/NAMISH%20M%20S/VS%20Code/AI%20CRM%20Dashboard/frontend/src/context/NotificationsContext.jsx).

### 12. Settings & Preferences (`/settings`)
- **What the user sees:** Profile settings, display preferences (compact view, table vs grid default), currency selection, and AI integration status card.
- **Business Purpose:** Personalizes the workspace for individual sales rep workflows.
- **Components & Hooks:** [SettingsPage.jsx](file:///d:/NAMISH%20M%20S/VS%20Code/AI%20CRM%20Dashboard/frontend/src/pages/settings/SettingsPage.jsx), [SettingsContext.jsx](file:///d:/NAMISH%20M%20S/VS%20Code/AI%20CRM%20Dashboard/frontend/src/context/SettingsContext.jsx).

### 13. Error Boundary & 404 Handler
- **What the user sees:** Friendly recovery UI if a rendering error occurs, and a dedicated 404 page for unknown URLs.
- **Business Purpose:** Prevents white-screen application crashes and guides users back to safety.
- **Components & Hooks:** [ErrorBoundary.jsx](file:///d:/NAMISH%20M%20S/VS%20Code/AI%20CRM%20Dashboard/frontend/src/components/common/ErrorBoundary.jsx), [NotFoundPage.jsx](file:///d:/NAMISH%20M%20S/VS%20Code/AI%20CRM%20Dashboard/frontend/src/pages/NotFoundPage.jsx).

---

## 4. Backend API Architecture & Security

### Backend Server & Route Architecture
- **Framework:** Express.js 4 on Node.js ([backend/server.js](file:///d:/NAMISH%20M%20S/VS%20Code/AI%20CRM%20Dashboard/backend/server.js))
- **Entry Port:** `8000` (`http://localhost:8000/api`)
- **Middleware:** `cors()`, `express.json()`, centralized `errorHandler.js`, `authMiddleware.js`.

### Route Groups & Endpoints Table

| Group | Method & Endpoint | Handler & Location | Purpose & Business Value |
| :--- | :--- | :--- | :--- |
| **System** | `GET /` & `GET /api` | [server.js:37](file:///d:/NAMISH%20M%20S/VS%20Code/AI%20CRM%20Dashboard/backend/server.js#L37) | API discovery & route directory documentation |
| **System** | `GET /api/health` | [server.js:54](file:///d:/NAMISH%20M%20S/VS%20Code/AI%20CRM%20Dashboard/backend/server.js#L54) | Server health check for monitoring |
| **Auth** | `POST /api/auth/login` | [authController.js:22](file:///d:/NAMISH%20M%20S/VS%20Code/AI%20CRM%20Dashboard/backend/src/controllers/authController.js#L22) | Verify credentials with bcrypt & issue 7-day JWT |
| **Auth** | `POST /api/auth/register` | [authController.js:47](file:///d:/NAMISH%20M%20S/VS%20Code/AI%20CRM%20Dashboard/backend/src/controllers/authController.js#L47) | Hash password & create user record |
| **Auth** | `GET /api/auth/me` | [authController.js:69](file:///d:/NAMISH%20M%20S/VS%20Code/AI%20CRM%20Dashboard/backend/src/controllers/authController.js#L69) | Restore session on page refresh via JWT |
| **Auth** | `PUT /api/auth/profile` | [authController.js:77](file:///d:/NAMISH%20M%20S/VS%20Code/AI%20CRM%20Dashboard/backend/src/controllers/authController.js#L77) | Update user profile details |
| **Leads** | `GET /api/leads/check-email` | [leadsController.js:5](file:///d:/NAMISH%20M%20S/VS%20Code/AI%20CRM%20Dashboard/backend/src/controllers/leadsController.js#L5) | Async check for duplicate lead email |
| **Leads** | `GET /api/leads` | [leadsController.js:14](file:///d:/NAMISH%20M%20S/VS%20Code/AI%20CRM%20Dashboard/backend/src/controllers/leadsController.js#L14) | Retrieve all leads |
| **Leads** | `POST /api/leads` | [leadsController.js:24](file:///d:/NAMISH%20M%20S/VS%20Code/AI%20CRM%20Dashboard/backend/src/controllers/leadsController.js#L24) | Create new lead with default order |
| **Leads** | `PATCH /api/leads/reorder` | [leadsController.js:57](file:///d:/NAMISH%20M%20S/VS%20Code/AI%20CRM%20Dashboard/backend/src/controllers/leadsController.js#L57) | Bulk update deal stage & order on drag-and-drop |
| **Leads** | `GET /api/leads/:id` | [leadsController.js:18](file:///d:/NAMISH%20M%20S/VS%20Code/AI%20CRM%20Dashboard/backend/src/controllers/leadsController.js#L18) | Get single lead by ID |
| **Leads** | `PUT /api/leads/:id` | [leadsController.js:39](file:///d:/NAMISH%20M%20S/VS%20Code/AI%20CRM%20Dashboard/backend/src/controllers/leadsController.js#L39) | Update lead details |
| **Leads** | `DELETE /api/leads/:id` | [leadsController.js:47](file:///d:/NAMISH%20M%20S/VS%20Code/AI%20CRM%20Dashboard/backend/src/controllers/leadsController.js#L47) | Delete lead record |
| **Contacts** | `GET /api/contacts` | [contactsController.js:4](file:///d:/NAMISH%20M%20S/VS%20Code/AI%20CRM%20Dashboard/backend/src/controllers/contactsController.js#L4) | List all client contacts |
| **Contacts** | `POST /api/contacts` | [contactsController.js:14](file:///d:/NAMISH%20M%20S/VS%20Code/AI%20CRM%20Dashboard/backend/src/controllers/contactsController.js#L14) | Create new contact |
| **Contacts** | `PUT /api/contacts/:id` | [contactsController.js:24](file:///d:/NAMISH%20M%20S/VS%20Code/AI%20CRM%20Dashboard/backend/src/controllers/contactsController.js#L24) | Update contact details |
| **Contacts** | `DELETE /api/contacts/:id` | [contactsController.js:32](file:///d:/NAMISH%20M%20S/VS%20Code/AI%20CRM%20Dashboard/backend/src/controllers/contactsController.js#L32) | Remove contact |
| **Tasks** | `GET /api/tasks` | [tasksController.js:4](file:///d:/NAMISH%20M%20S/VS%20Code/AI%20CRM%20Dashboard/backend/src/controllers/tasksController.js#L4) | List all tasks |
| **Tasks** | `POST /api/tasks` | [tasksController.js:14](file:///d:/NAMISH%20M%20S/VS%20Code/AI%20CRM%20Dashboard/backend/src/controllers/tasksController.js#L14) | Create follow-up task |
| **Tasks** | `PUT /api/tasks/:id` | [tasksController.js:23](file:///d:/NAMISH%20M%20S/VS%20Code/AI%20CRM%20Dashboard/backend/src/controllers/tasksController.js#L23) | Update task status or due date |
| **Tasks** | `DELETE /api/tasks/:id` | [tasksController.js:31](file:///d:/NAMISH%20M%20S/VS%20Code/AI%20CRM%20Dashboard/backend/src/controllers/tasksController.js#L31) | Remove task |
| **Notes** | `GET /api/notes` | [notesController.js:4](file:///d:/NAMISH%20M%20S/VS%20Code/AI%20CRM%20Dashboard/backend/src/controllers/notesController.js#L4) | List all notes |
| **Notes** | `POST /api/notes` | [notesController.js:13](file:///d:/NAMISH%20M%20S/VS%20Code/AI%20CRM%20Dashboard/backend/src/controllers/notesController.js#L13) | Create tagged note |
| **Notes** | `PUT /api/notes/:id` | [notesController.js:22](file:///d:/NAMISH%20M%20S/VS%20Code/AI%20CRM%20Dashboard/backend/src/controllers/notesController.js#L22) | Update note content or pinned status |
| **Notes** | `DELETE /api/notes/:id` | [notesController.js:30](file:///d:/NAMISH%20M%20S/VS%20Code/AI%20CRM%20Dashboard/backend/src/controllers/notesController.js#L30) | Delete note |
| **AI** | `GET /api/ai/status` | [aiController.js:5](file:///d:/NAMISH%20M%20S/VS%20Code/AI%20CRM%20Dashboard/backend/src/controllers/aiController.js#L5) | Check AI engine service status |
| **AI** | `POST /api/ai/lead-summary` | [aiController.js:10](file:///d:/NAMISH%20M%20S/VS%20Code/AI%20CRM%20Dashboard/backend/src/controllers/aiController.js#L10) | Generate deal score & action recommendation |
| **AI** | `POST /api/ai/generate-email` | [aiController.js:16](file:///d:/NAMISH%20M%20S/VS%20Code/AI%20CRM%20Dashboard/backend/src/controllers/aiController.js#L16) | Draft tailored sales outreach email |
| **AI** | `POST /api/ai/sales-insights` | [aiController.js:22](file:///d:/NAMISH%20M%20S/VS%20Code/AI%20CRM%20Dashboard/backend/src/controllers/aiController.js#L22) | Return strategic pipeline recommendations |
| **Analytics** | `GET /api/analytics/overview` | [analyticsController.js:4](file:///d:/NAMISH%20M%20S/VS%20Code/AI%20CRM%20Dashboard/backend/src/controllers/analyticsController.js#L4) | Calculate live pipeline KPI aggregates |
| **Search** | `GET /api/search?q=...` | [searchController.js:4](file:///d:/NAMISH%20M%20S/VS%20Code/AI%20CRM%20Dashboard/backend/src/controllers/searchController.js#L4) | Global search across leads, contacts & tasks |
| **Notifications** | `GET /api/notifications` | [notificationsController.js:4](file:///d:/NAMISH%20M%20S/VS%20Code/AI%20CRM%20Dashboard/backend/src/controllers/notificationsController.js#L4) | Fetch recent notifications & unread count |
| **Notifications** | `PATCH /api/notifications/:id/read` | [notificationsController.js:13](file:///d:/NAMISH%20M%20S/VS%20Code/AI%20CRM%20Dashboard/backend/src/controllers/notificationsController.js#L13) | Mark notification(s) as read |

### Backend Security Mechanisms
1. **JWT Authentication Guard ([authMiddleware.js](file:///d:/NAMISH%20M%20S/VS%20Code/AI%20CRM%20Dashboard/backend/src/middleware/authMiddleware.js)):** Validates the Bearer token signature on all private routes.
2. **Password Hashing with Salt Rounds:** Uses `bcryptjs` to hash passwords before storing them.
3. **Fail-Fast Secret Verification ([server.js:16](file:///d:/NAMISH%20M%20S/VS%20Code/AI%20CRM%20Dashboard/backend/server.js#L16)):** Automatically terminates server boot if `JWT_SECRET` is missing.
4. **User Enumeration Defense ([authController.js:31](file:///d:/NAMISH%20M%20S/VS%20Code/AI%20CRM%20Dashboard/backend/src/controllers/authController.js#L31)):** Returns generic error message for incorrect email and password.
5. **Payload Sanitization ([authController.js:16](file:///d:/NAMISH%20M%20S/VS%20Code/AI%20CRM%20Dashboard/backend/src/controllers/authController.js#L16)):** Strips `passwordHash` from user response payloads.

---

## 5. Mock Data Layer vs Real Backend Execution

### What Mock Data Is & Why It Exists
The mock data layer ([mockStore.js](file:///d:/NAMISH%20M%20S/VS%20Code/AI%20CRM%20Dashboard/frontend/src/lib/services/mockStore.js) and [mockData.js](file:///d:/NAMISH%20M%20S/VS%20Code/AI%20CRM%20Dashboard/frontend/src/lib/mockData.js)) allows the full React application to run completely independently in the browser without requiring a Node.js server.
- **Why I Kept It:**
  1. **Zero Network Risk:** During the viva presentation, if the backend server crashes or ports are blocked, the demo remains 100% functional.
  2. **Deterministic State:** Resetting or refreshing the browser returns the demo data to a pristine state.
  3. **Simulated Latency:** The `reply(data, ms)` helper simulates realistic network latency (250–800ms), demonstrating loading spinners and disabled button states during testing.

### The Switch Mechanism (`VITE_USE_MOCK`)
In [config.js:1](file:///d:/NAMISH%20M%20S/VS%20Code/AI%20CRM%20Dashboard/frontend/src/lib/services/config.js#L1):
```javascript
export const USE_MOCK = import.meta.env.VITE_USE_MOCK !== "false";
```
- When `VITE_USE_MOCK=false` is set in `.env`, all frontend services route through Axios to `http://localhost:8000/api`.
- When unset or set to `true`, frontend services serve in-memory data via `mockStore.js`.

### Seeded Demo Data
- **Demo Account:** `demo@lumencrm.com` / `demo1234`
- **Seeded Leads:** 16 realistic B2B sales opportunities across tech companies (Dribbble Design, Google Pay, Amazon Shopping, Stripe, Notion, Figma, Linear, Slack, Vercel, Airtable).
- **Seeded Contacts, Notes & Tasks:** Pre-populated follow-up tasks with various due date states (Overdue, Due Today, Upcoming).

---

## 6. Technology Stack & Architectural Trade-offs

### 1. React 19 (`^19.2.6`)
- **What it does:** Core UI library for component rendering and state updates.
- **Why chosen over alternatives (Vue/Angular):** React's declarative component model, rich ecosystem, and React 19's enhanced automatic state batching provide the best foundation for a high-performance single-page app.

### 2. Vite (`^8.0.12`)
- **What it does:** Next-generation frontend build tool and local dev server.
- **Why chosen over Create-React-App (CRA) / Webpack:** Instant Hot Module Replacement (HMR) powered by native ES modules, and sub-second production builds (~700ms).

### 3. React Router v7 (`^7.18.0`)
- **What it does:** Handles client-side SPA routing, nested tabs, and URL search param state.
- **Why chosen over traditional multi-page navigation:** Zero page reloads, preserving client-side cache and providing seamless transitions between views.

### 4. Tailwind CSS v4 (`^4.3.1`)
- **What it does:** Utility-first CSS engine with modern `@theme` design tokens.
- **Why chosen over Bootstrap / Material UI:** Full control over design aesthetics (custom dark modes, modern glassmorphism) without fighting heavy opinionated component styles.

### 5. React Hook Form (`^7.79.0`) + Zod (`^4.6.5`)
- **What it does:** Uncontrolled form state management with type-safe schema validation.
- **Why chosen over manual `useState` form handling:** Eliminates unnecessary re-renders on keystrokes and encapsulates validation rules cleanly away from JSX.

### 6. `@dnd-kit/core` & `@dnd-kit/sortable`
- **What it does:** Powers the drag-and-drop Kanban pipeline.
- **Why chosen over `react-beautiful-dnd`:** Modern, lightweight, modular, and works seamlessly with React 19 and mobile pointer touch events.

### 7. Recharts (`^3.8.1`)
- **What it does:** Declarative SVG charting library for KPI line, bar, and donut charts.
- **Why chosen over Chart.js:** Native React component composition that responds dynamically to CSS theme changes.

### 8. Vitest (`^5.0.3`) + React Testing Library
- **What it does:** Fast unit and component test runner.
- **Why chosen over Jest:** Uses Vite's native transform pipeline, executing 33 tests in under 2 seconds without Babel configuration overhead.
