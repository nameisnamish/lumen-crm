# 📘 CIE-2 Capstone Project Documentation: AI-Powered CRM Dashboard

**Course / Subject**: CIE-2 Capstone Project  
**Total Marks**: 25 Marks (Implementation: 20 | Documentation: 2 | Viva: 3)  
**Project Title**: AI-Powered Customer Relationship Management (CRM) Dashboard  
**Framework / Stack**: React 19, React Router 7, Tailwind CSS v4, Lucide Icons, Recharts, `@dnd-kit`, Google Gemini AI Integration.

---

## 1. Executive Summary
The **AI-Powered CRM Dashboard** is a modern, responsive single-page web application (SPA) built using **React 19** and **Tailwind CSS v4**. It empowers sales teams to manage leads, visualize deal pipelines on an interactive Kanban board, track contacts, organize notes, manage follow-up tasks, and leverage **Google Gemini AI** for automated lead scoring, risk analysis, sales insights, and outreach email generation.

---

## 2. Key Features & Functionality

1. **User Authentication & Session Security**:
   - Secure login & registration flow.
   - JWT-based authentication context with persistent session state on refresh.
   - Protected Route architecture preventing unauthorized page access.

2. **Dashboard Analytics & KPIs**:
   - Live KPI summary cards (Total Leads, Active Pipeline Value, Revenue Won, Conversion Rate).
   - Interactive charts built with `recharts`: Revenue Trend Line Chart, Pipeline Engagement Bar Chart, and Leads by Source Donut Chart.
   - Recent activity feed and top open deals tracker.

3. **Leads Management & Detail Drawer**:
   - Comprehensive Leads table and card grid views.
   - Real-time search, multi-field filtering (Stage, Priority, Source), and sortable columns.
   - One-click CSV export and bulk delete.
   - Slide-over **Lead Detail Drawer** with inline AI lead scoring and instant contact actions.

4. **Sales Pipeline (Kanban Board)**:
   - Drag-and-Drop pipeline stages powered by `@dnd-kit` (New → Qualified → Proposal → Won → Lost).
   - Per-stage total value indicators and automated deal position updates.

5. **Contacts Management**:
   - Searchable, taggable contact grid with favorite pinning.
   - Contact detail side panel and full CRUD support.

6. **Notes & Knowledge Base**:
   - Dynamic Masonry layout with note pinning, color tags, and keyword content search.

7. **Follow-Up Tasks Engine**:
   - Smart due date detection (Overdue, Due Today, Upcoming).
   - Priority indicators and dynamic progress tracking bar.

8. **AI Assistant Suite (Powered by Google Gemini AI)**:
   - **AI Lead Scoring & Risk Summary**: Computes a 0–100 lead health score and suggests next best actions.
   - **AI Outreach Email Generator**: Produces tailored sales email subjects and copy based on purpose and tone.
   - **AI Sales Insights**: Analyzes pipeline health and returns prioritized strategic recommendations.

---

## 3. Technical Architecture & Component Tree

```
src/
├── App.jsx                     # Central Route Controller & Protected Route wrapper
├── main.jsx                    # Application entry point with BrowserRouter & AuthProvider
├── index.css                   # Global Tailwind CSS v4 styling & custom theme variables
├── context/
│   └── AuthContext.jsx         # React Context for global auth state & JWT token lifecycle
├── components/
│   ├── layout/
│   │   ├── AppLayout.jsx       # Main layout wrapper (Sidebar + Header + Main Content)
│   │   ├── Sidebar.jsx         # Responsive sidebar navigation bar
│   │   ├── Navbar.jsx          # Top header with search bar, notifications, and profile
│   │   └── ProtectedRoute.jsx  # Route guard checking authentication state
│   ├── dashboard/              # KPI cards, charts, and activity components
│   ├── leads/                  # Lead tables, forms, filters, and detail drawer
│   ├── ai/                     # AI Email generator and lead scoring modal components
│   └── ui/                     # Reusable UI component kit (Button, Input, Badge, Card, Modal)
└── pages/
    ├── auth/
    │   ├── Login.jsx           # User login screen
    │   └── Register.jsx        # User registration screen
    ├── Dashboard.jsx           # Main analytics dashboard view
    ├── Leads.jsx               # Lead management interface
    ├── Contacts.jsx            # Contacts management page
    ├── Pipeline.jsx            # Kanban sales pipeline view
    ├── Notes.jsx               # Notes & organization page
    ├── Tasks.jsx               # Tasks & follow-up management
    └── Settings.jsx            # User profile & application settings
```

---

## 4. React Fundamentals & Concepts Demonstrated

| React Concept | Implementation in Project |
| :--- | :--- |
| **JSX & Components** | Modular, reusable UI components (`Card`, `Badge`, `Modal`, `LeadTable`, `KanbanColumn`). |
| **Props & Composition** | Unidirectional data flow passing configuration props, callbacks, and `children`. |
| **`useState`** | Managing local UI states (search inputs, active tabs, modal visibility, form data). |
| **`useEffect`** | Data fetching, event listening, auto-login state synchronization. |
| **`useContext`** | Global state management for User Authentication (`AuthContext`). |
| **`useMemo` & `useCallback`** | Performance optimization for filtering leads, calculating totals, and memoizing chart data. |
| **Custom Hooks** | Encapsulated business logic for lead state, pipeline drag-and-drop, and AI API calls. |
| **React Router v7** | Client-side SPA routing (`<Routes>`, `<Route>`, `<Navigate>`, `<Outlet>`). |
| **Form & Event Handling** | Controlled inputs, submit handlers, validation, and dynamic form fields. |

---

## 5. Installation & Local Setup Instructions

### Prerequisites
- **Node.js**: `v18.0.0` or higher (Tested on `v24.13.0`)
- **npm**: `v9.0.0` or higher (Tested on `v11.11.0`)

### Step-by-Step Run Guide
```bash
# 1. Open terminal in project folder
cd "d:\NAMISH M S\VS Code\AI CRM Dashboard"

# 2. Install dependencies (if not already installed)
npm install

# 3. Start the development server
npm run dev
```

The application will be live at: **`http://localhost:5173/`**
