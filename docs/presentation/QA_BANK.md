# 🎓 Viva Q&A Question Bank: Lumen CRM
**University CIE-2 Capstone Project Examination**  
**Subject:** Full Stack Development (React 19 Focus)  
**Author / Presenter:** Namish M S (First Person Viva Ready)

---

## 📑 Table of Contents
1. [Core React Fundamentals (JSX, Components, Props, Virtual DOM)](#1-core-react-fundamentals)
2. [Hooks Mastery (useState, useEffect, useReducer, useMemo, useCallback, useRef, useDeferredValue)](#2-hooks-mastery)
3. [Forms & Validation (Controlled vs Uncontrolled, React Hook Form, Zod)](#3-forms--validation)
4. [Routing & Navigation (React Router v7, Nested Routes, Protected Routes, SearchParams)](#4-routing--navigation)
5. [State Management Architecture (Context API vs useReducer vs Redux/Zustand)](#5-state-management-architecture)
6. [Performance Optimization (React.memo, useDeferredValue, Code Splitting)](#6-performance-optimization)
7. [UI, CSS & Responsive Design (Tailwind CSS v4, Breakpoints, CVA)](#7-ui-css--responsive-design)
8. [Backend Architecture, REST APIs & Security (Node.js/Express, JWT, bcrypt)](#8-backend-architecture-rest-apis--security)
9. [Testing & Quality Assurance (Vitest, React Testing Library)](#9-testing--quality-assurance)
10. [Project Architecture & Provenance (Folder Structure, Tutorial vs Custom Code)](#10-project-architecture--provenance)
11. [Tough Questions & Project Weaknesses (Honest Architectural Answers)](#11-tough-questions--project-weaknesses)
12. [Code Reading & Deep-Dive Explanations (10 Verified Snippets)](#12-code-reading--deep-dive-explanations)

---

## 1. Core React Fundamentals

### Q1: What is a React component and how did you structure them in Lumen CRM?
**Answer:** A component is a self-contained, reusable piece of UI that manages its own rendering and state. In my project, I built functional components using standard JavaScript functions that return JSX. I separated them into reusable UI primitives (like [Button.jsx](file:///d:/NAMISH%20M%20S/VS%20Code/AI%20CRM%20Dashboard/frontend/src/components/ui/Button.jsx) and [Dialog.jsx](file:///d:/NAMISH%20M%20S/VS%20Code/AI%20CRM%20Dashboard/frontend/src/components/ui/Dialog.jsx)), layout wrappers ([AppLayout.jsx](file:///d:/NAMISH%20M%20S/VS%20Code/AI%20CRM%20Dashboard/frontend/src/components/layout/AppLayout.jsx)), and domain-specific feature pages ([LeadsPage.jsx](file:///d:/NAMISH%20M%20S/VS%20Code/AI%20CRM%20Dashboard/frontend/src/pages/leads/LeadsPage.jsx)).
- **Follow-up Q1.1:** *Why did you prefer functional components over class components?*  
  **Answer:** Functional components are simpler, work with modern React Hooks, avoid `this` binding issues, and have less boilerplate. The only class component I have is [ErrorBoundary.jsx](file:///d:/NAMISH%20M%20S/VS%20Code/AI%20CRM%20Dashboard/frontend/src/components/common/ErrorBoundary.jsx), which requires `componentDidCatch` lifecycle methods.
- **Follow-up Q1.2:** *What is component composition?*  
  **Answer:** It is building complex UIs by nesting smaller components inside container components using the `children` prop, like how [Card.jsx](file:///d:/NAMISH%20M%20S/VS%20Code/AI%20CRM%20Dashboard/frontend/src/components/ui/Card.jsx) renders `CardHeader`, `CardContent`, and dynamic children.

### Q2: What is JSX and how does React render it?
**Answer:** JSX is a JavaScript syntax extension that lets us write HTML-like markup inside JavaScript. Vite and the React compiler transpile JSX into standard `_jsxRuntime` function calls that generate lightweight Virtual DOM JavaScript objects.
- **Follow-up Q2.1:** *Can browsers run JSX directly?*  
  **Answer:** No. Browsers only execute pure JavaScript. Vite transpiles JSX into standard JavaScript modules during development and build time.
- **Follow-up Q2.2:** *Why must JSX elements have a single root element or Fragment?*  
  **Answer:** Because a JavaScript function can only return a single value or object. `<>...</>` (Fragment) allows grouping multiple nodes without adding extra DOM wrapper elements.

### Q3: What is the difference between Props and State?
**Answer:** Props are read-only inputs passed from a parent component to a child to configure it. State is internal, mutable memory managed inside the component itself using hooks like `useState` or `useReducer`. When state changes, React schedules a re-render.
- **Follow-up Q3.1:** *Can a child component directly modify its props?*  
  **Answer:** No, React follows a strict one-way (unidirectional) data flow. A child can only notify the parent to change state by calling a callback function passed down as a prop.
- **Follow-up Q3.2:** *Where do you pass callback functions as props in your code?*  
  **Answer:** In [LeadsTable.jsx](file:///d:/NAMISH%20M%20S/VS%20Code/AI%20CRM%20Dashboard/frontend/src/pages/leads/LeadsTable.jsx), I pass `onSort`, `onSelectLead`, and `onDelete` callbacks from the parent [LeadsPage.jsx](file:///d:/NAMISH%20M%20S/VS%20Code/AI%20CRM%20Dashboard/frontend/src/pages/leads/LeadsPage.jsx).

### Q4: What is the Virtual DOM and how does React reconciliation work?
**Answer:** The Virtual DOM is an in-memory lightweight representation of the real DOM tree. When state changes, React creates a new Virtual DOM tree, compares (diffs) it against the previous one using its reconciliation algorithm, and computes the minimal set of actual DOM changes to apply efficiently.
- **Follow-up Q4.1:** *Why is updating the real DOM slow compared to the Virtual DOM?*  
  **Answer:** Real DOM operations trigger browser layout recalculations, style cascading, and repainting. The Virtual DOM is just JavaScript objects in memory, which is thousands of times faster to compute.
- **Follow-up Q4.2:** *What is the Fiber engine in React?*  
  **Answer:** Fiber is React's reconciliation engine that breaks rendering work into incremental units, allowing React to pause, prioritize, or abort non-urgent updates (which powers `useDeferredValue` and concurrent features).

### Q5: Why are `key` props necessary when rendering lists in React?
**Answer:** Keys provide a stable identity to list elements across renders. React uses keys during reconciliation to identify which items were added, removed, reordered, or edited. Without unique keys, React re-renders or mutates the wrong DOM nodes.
- **Follow-up Q5.1:** *Why should we avoid using array index as a key?*  
  **Answer:** If items are inserted, deleted, or sorted, their array indices shift. This confuses React's diffing algorithm and causes UI state bugs (like inputs retaining values of shifted siblings).
- **Follow-up Q5.2:** *What do you use as keys in your list renderings?*  
  **Answer:** I always use unique database IDs, such as `lead._id` in [LeadsTable.jsx](file:///d:/NAMISH%20M%20S/VS%20Code/AI%20CRM%20Dashboard/frontend/src/pages/leads/LeadsTable.jsx#L90) and `task._id` in [TasksPage.jsx](file:///d:/NAMISH%20M%20S/VS%20Code/AI%20CRM%20Dashboard/frontend/src/pages/tasks/TasksPage.jsx).

---

## 2. Hooks Mastery

### Q6: How do you use `useState` and when does state update take effect?
**Answer:** `useState` declares a state variable and a setter function. Setting state does not immediately mutate the variable in the current execution cycle; it schedules a re-render. To update state based on prior state, I use the functional updater pattern: `setCount(prev => prev + 1)`.
- **Follow-up Q6.1:** *What is state batching in React 19?*  
  **Answer:** React automatically batches multiple state setter calls inside event handlers, promises, or async functions into a single re-render to avoid unnecessary repaints.
- **Follow-up Q6.2:** *Give an example of functional state updates in your app.*  
  **Answer:** In [SettingsContext.jsx:24](file:///d:/NAMISH%20M%20S/VS%20Code/AI%20CRM%20Dashboard/frontend/src/context/SettingsContext.jsx#L24), I use `setSettings((prev) => ({ ...prev, [key]: value }))` to safely preserve existing settings while modifying one key.

### Q7: How does `useEffect` work, and why is the cleanup function critical?
**Answer:** `useEffect` executes side effects (like data fetching, event listeners, or timers) after the DOM has rendered. The cleanup function returned by `useEffect` runs before the effect re-runs or when the component unmounts to prevent memory leaks.
- **Follow-up Q7.1:** *Show where you implemented a cleanup function in Lumen CRM.*  
  **Answer:** In [NotificationsContext.jsx:74-79](file:///d:/NAMISH%20M%20S/VS%20Code/AI%20CRM%20Dashboard/frontend/src/context/NotificationsContext.jsx#L74-L79), the cleanup function clears the 30-second `setInterval` with `clearInterval(intervalRef.current)` and sets an `active = false` flag to prevent stale setState calls.
- **Follow-up Q7.2:** *What happens if the dependency array `[]` is omitted versus empty?*  
  **Answer:** Omitted: the effect runs after *every single* render. Empty array `[]`: it runs only once after the initial mount. Array with variables `[leadId]`: it runs on mount and whenever any specified dependency changes.

### Q8: What is `useReducer` and why did you use it for the Kanban Pipeline?
**Answer:** `useReducer` manages complex state logic through pure reducer functions driven by dispatched action objects `{ type, payload }`. In [usePipelineReducer.js:26-102](file:///d:/NAMISH%20M%20S/VS%20Code/AI%20CRM%20Dashboard/frontend/src/hooks/usePipelineReducer.js#L26-L102), the board state is a multi-column object. Moving deals between stages, reordering within columns, and rolling back state on network errors involves intricate array splices that are cleaner and easier to unit-test in a reducer than multiple `useState` setters.
- **Follow-up Q8.1:** *Why must reducer functions be pure?*  
  **Answer:** A pure reducer produces the same output for given inputs and causes no side effects. This ensures state transitions are predictable and enables time-travel debugging and snapshot rollbacks.
- **Follow-up Q8.2:** *How did you test your pipeline reducer?*  
  **Answer:** In [pipelineReducer.test.js](file:///d:/NAMISH%20M%20S/VS%20Code/AI%20CRM%20Dashboard/frontend/tests/unit/pipelineReducer.test.js), I wrote 6 unit tests that directly feed actions (`SET_BOARD`, `MOVE_DEAL`, `ROLLBACK`) into `pipelineReducer` and assert the resulting board structure.

### Q9: What is the difference between `useMemo` and `useCallback`?
**Answer:** `useMemo` caches the *result* of an expensive calculation, recalculating only when its dependencies change. `useCallback` caches the *function definition itself* between renders to prevent unnecessary re-renders of child components that receive the function as a prop.
- **Follow-up Q9.1:** *Where did you use `useMemo` in your project?*  
  **Answer:** In [useLeads.js:85-115](file:///d:/NAMISH%20M%20S/VS%20Code/AI%20CRM%20Dashboard/frontend/src/hooks/useLeads.js#L85-L115), `filteredLeads` is memoized so that multi-field filtering and column sorting calculations only execute when `leads`, `statusFilter`, `priorityFilter`, or `sortKey` change.
- **Follow-up Q9.2:** *Where did you use `useCallback`?*  
  **Answer:** In [SettingsContext.jsx:22](file:///d:/NAMISH%20M%20S/VS%20Code/AI%20CRM%20Dashboard/frontend/src/context/SettingsContext.jsx#L22), `updateSetting` and `resetSettings` are wrapped in `useCallback` so consumer components subscribing to context don't re-render unnecessarily due to new function references.

### Q10: How does `useRef` differ from `useState`?
**Answer:** `useRef` returns a mutable object with a `.current` property that persists across renders. Changing `.current` **does NOT** trigger a component re-render. `useState` changes **do** trigger re-renders. `useRef` is used for storing timer IDs, previous values, or holding direct DOM element references.
- **Follow-up Q10.1:** *Where did you use `useRef` for DOM access?*  
  **Answer:** In [CommandSearch.jsx:41](file:///d:/NAMISH%20M%20S/VS%20Code/AI%20CRM%20Dashboard/frontend/src/components/common/CommandSearch.jsx#L41) to programmatically call `.focus()` on the search input when the user presses `Ctrl+K`.
- **Follow-up Q10.2:** *Where did you use `useRef` for non-DOM mutable state?*  
  **Answer:** In [NotificationsContext.jsx:16](file:///d:/NAMISH%20M%20S/VS%20Code/AI%20CRM%20Dashboard/frontend/src/context/NotificationsContext.jsx#L16) (`intervalRef`) to store the polling timer interval ID across renders.

### Q11: What is `useDeferredValue` and where did you use it?
**Answer:** `useDeferredValue` is a React concurrent hook that defers updating a non-urgent value until urgent UI updates (like typing in an input field) have finished rendering. It prevents keyboard lag when filtering large lists.
- **Follow-up Q11.1:** *Where is this implemented in Lumen CRM?*  
  **Answer:** In [PipelinePage.jsx:39](file:///d:/NAMISH%20M%20S/VS%20Code/AI%20CRM%20Dashboard/frontend/src/pages/pipeline/PipelinePage.jsx#L39) (`const deferredSearch = useDeferredValue(searchQuery)`) and in [CommandSearch.jsx:38](file:///d:/NAMISH%20M%20S/VS%20Code/AI%20CRM%20Dashboard/frontend/src/components/common/CommandSearch.jsx#L38) (`deferredQuery`).
- **Follow-up Q11.2:** *How is `useDeferredValue` different from `useDebounce`?*  
  **Answer:** Debouncing delays execution by a fixed time window (e.g., 300ms) using `setTimeout`. `useDeferredValue` adapts dynamically to the user's hardware speed without arbitrary fixed delays.

### Q12: What custom hooks did you write in this project?
**Answer:** I wrote 7 custom hooks located in [frontend/src/hooks/](file:///d:/NAMISH%20M%20S/VS%20Code/AI%20CRM%20Dashboard/frontend/src/hooks/):
1. `useLeads`: Syncs leads filtering, sorting, and pagination with URL search params.
2. `usePipelineReducer`: Encapsulates Kanban board state, drag handling, and optimistic rollbacks.
3. `useDebounce`: Generic value debouncing hook for delayed search/validation.
4. `useLocalStorage`: State hook backed by persistent browser localStorage.
5. `useKeyboardShortcut`: Listens for key combos like `Ctrl+K` with automatic unbind.
6. `useClickOutside`: Detects outside clicks to close dropdowns and modals.
7. `useCopilot`: Manages chat message streams with the AI Copilot assistant.

---

## 3. Forms & Validation

### Q13: What is the difference between Controlled and Uncontrolled inputs in React?
**Answer:** In a **Controlled input**, React state holds the input's current value via `value={state}` and an `onChange` handler that calls `setState` on every keystroke, causing a component re-render on every letter typed. In an **Uncontrolled input**, the real browser DOM maintains the input value, and React accesses it on-demand via DOM refs.
- **Follow-up Q13.1:** *Are your React Hook Form inputs controlled or uncontrolled?*  
  **Answer:** They are **uncontrolled**. The `register()` function attaches a ref to the DOM node. Form state is queried directly upon validation or submission, which avoids re-rendering the whole form dialog on every keystroke.
- **Follow-up Q13.2:** *When would you be forced to use a controlled input?*  
  **Answer:** When using custom third-party UI widgets (like custom rich-text editors or specialized date pickers) that do not expose a native input ref, requiring `Controller` from React Hook Form.

### Q14: Why did you choose React Hook Form + Zod over manual form state?
**Answer:** Manual form state requires multiple `useState` variables, repetitive `onChange` handlers, manual error tracking, and custom regex validation logic. React Hook Form minimizes re-renders and handles dirty/touched states. **Zod** provides a declarative, type-safe schema definition with built-in validation messages, separating validation rules from UI components.
- **Follow-up Q14.1:** *How do you connect Zod to React Hook Form?*  
  **Answer:** Using `@hookform/resolvers/zod`. In [Login.jsx:24](file:///d:/NAMISH%20M%20S/VS%20Code/AI%20CRM%20Dashboard/frontend/src/pages/auth/Login.jsx#L24), I pass `resolver: zodResolver(loginSchema)` into `useForm()`.
- **Follow-up Q14.2:** *What validation rules exist in `leadSchema`?*  
  **Answer:** In [validation.js:63-75](file:///d:/NAMISH%20M%20S/VS%20Code/AI%20CRM%20Dashboard/frontend/src/lib/validation.js#L63-L75), `leadSchema` validates name (min 2 chars, regex sanitized), email (valid email syntax), company (non-empty), value (non-negative number), stage enum, priority enum, and source enum.

### Q15: How does the 4-step Lead Creation Wizard perform per-step validation?
**Answer:** In [LeadWizardDialog.jsx:93-108](file:///d:/NAMISH%20M%20S/VS%20Code/AI%20CRM%20Dashboard/frontend/src/components/leads/LeadWizardDialog.jsx#L93-L108), when the user clicks "Next", instead of validating the whole form, I call `trigger(["name", "company", "source"])` passing only the field names for that specific step. If validation passes, the wizard advances to `step + 1` while preserving all accumulated form state in memory.
- **Follow-up Q15.1:** *How does the wizard check for duplicate emails before proceeding?*  
  **Answer:** In [LeadWizardDialog.jsx:100-117](file:///d:/NAMISH%20M%20S/VS%20Code/AI%20CRM%20Dashboard/frontend/src/components/leads/LeadWizardDialog.jsx#L100-L117), when leaving the Contact step, it calls `leadsApi.checkEmail(email)`. If the backend reports `exists: true`, it sets a custom field error via `setError("email", { message: "This email is already registered to an active lead" })` and halts progression.
- **Follow-up Q15.2:** *How did you implement dynamic tags in the wizard?*  
  **Answer:** I used `useFieldArray({ control, name: "tags" })` from React Hook Form ([LeadWizardDialog.jsx:75](file:///d:/NAMISH%20M%20S/VS%20Code/AI%20CRM%20Dashboard/frontend/src/components/leads/LeadWizardDialog.jsx#L75)), which provides immutable `append()` and `remove()` methods.

---

## 4. Routing & Navigation

### Q16: How is routing structured in Lumen CRM using React Router v7?
**Answer:** In [App.jsx:36-74](file:///d:/NAMISH%20M%20S/VS%20Code/AI%20CRM%20Dashboard/frontend/src/App.jsx#L36-L74), I defined client-side routing using `<Routes>` and `<Route>`. Public routes (`/login`, `/register`) are unauthenticated. All private routes are grouped under a single parent `<Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>` containing nested child routes for `/`, `/leads`, `/pipeline`, `/contacts`, `/notes`, `/tasks`, and `/settings`.
- **Follow-up Q16.1:** *What is the role of `<Outlet />` in `AppLayout`?*  
  **Answer:** `<Outlet />` inside [AppLayout.jsx:62](file:///d:/NAMISH%20M%20S/VS%20Code/AI%20CRM%20Dashboard/frontend/src/components/layout/AppLayout.jsx#L62) acts as a placeholder where the active matched child route component (e.g., `DashboardPage` or `LeadsPage`) is mounted.
- **Follow-up Q16.2:** *How do nested tab routes work on `/leads/:leadId`?*  
  **Answer:** In [App.jsx:53-61](file:///d:/NAMISH%20M%20S/VS%20Code/AI%20CRM%20Dashboard/frontend/src/App.jsx#L53-L61), `/leads/:leadId` renders [LeadDetailPage.jsx](file:///d:/NAMISH%20M%20S/VS%20Code/AI%20CRM%20Dashboard/frontend/src/pages/leads/LeadDetailPage.jsx), which contains child routes for `overview`, `activity`, `notes`, `tasks`, and `ai`. It renders `<Outlet context={{ lead, refetchLead }} />` so child tabs receive lead data via `useOutletContext()`.

### Q17: How does your `ProtectedRoute` component prevent unauthorized access?
**Answer:** In [ProtectedRoute.jsx:6-23](file:///d:/NAMISH%20M%20S/VS%20Code/AI%20CRM%20Dashboard/frontend/src/components/layout/ProtectedRoute.jsx#L6-L23), it checks `const { user, loading } = useAuth()`. If `loading` is true, it displays a full-screen `Spinner`. If `!user`, it renders `<Navigate to="/login" state={{ from: location }} replace />`. If authenticated, it renders `children`.
- **Follow-up Q17.1:** *Why do you pass `state={{ from: location }}` in the redirect?*  
  **Answer:** So that after the user enters their credentials on the login screen, [Login.jsx:33](file:///d:/NAMISH%20M%20S/VS%20Code/AI%20CRM%20Dashboard/frontend/src/pages/auth/Login.jsx#L33) can navigate them back to the exact protected page they initially tried to open.
- **Follow-up Q17.2:** *Why do you include `replace` on the Navigate component?*  
  **Answer:** `replace` replaces the `/login` entry in the browser's history stack instead of pushing a new entry, preventing an infinite back-button redirect loop.

### Q18: What is the difference between `useParams` and `useSearchParams`?
**Answer:** `useParams` extracts dynamic route path segments (e.g., `/leads/:leadId` extracts `{ leadId: "l1" }`). `useSearchParams` reads and updates query string parameters (e.g., `/leads?status=Won&sort=value&page=2`).
- **Follow-up Q18.1:** *Why did you sync table filters to URL search parameters instead of local state?*  
  **Answer:** It makes the dashboard URL shareable and bookmarkable, and ensures filters survive browser page refreshes and backward/forward browser navigation.
- **Follow-up Q18.2:** *Where did you implement this URL synchronization?*  
  **Answer:** In [useLeads.js:12-22](file:///d:/NAMISH%20M%20S/VS%20Code/AI%20CRM%20Dashboard/frontend/src/hooks/useLeads.js#L12-L22) using `useSearchParams`.

---

## 5. State Management Architecture

### Q19: What is the Context API and where did you use it?
**Answer:** The Context API allows sharing global state across the entire component tree without prop drilling. In my app, I created three specialized contexts in [frontend/src/context/](file:///d:/NAMISH%20M%20S/VS%20Code/AI%20CRM%20Dashboard/frontend/src/context/):
1. [AuthContext.jsx](file:///d:/NAMISH%20M%20S/VS%20Code/AI%20CRM%20Dashboard/frontend/src/context/AuthContext.jsx): Stores the active authenticated user, JWT token lifecycle, login/logout functions, and session restoration.
2. [NotificationsContext.jsx](file:///d:/NAMISH%20M%20S/VS%20Code/AI%20CRM%20Dashboard/frontend/src/context/NotificationsContext.jsx): Manages unread alert counts and 30-second background polling.
3. [SettingsContext.jsx](file:///d:/NAMISH%20M%20S/VS%20Code/AI%20CRM%20Dashboard/frontend/src/context/SettingsContext.jsx): Manages theme preferences, display density, and default views with `localStorage` sync.
- **Follow-up Q19.1:** *Why didn't you put Leads and Tasks into global Context?*  
  **Answer:** Because leads and tasks are page-specific domain data. Keeping them localized inside hooks ([useLeads.js](file:///d:/NAMISH%20M%20S/VS%20Code/AI%20CRM%20Dashboard/frontend/src/hooks/useLeads.js)) prevents the entire app from re-rendering whenever a single lead is edited.
- **Follow-up Q19.2:** *Why not use Redux or Zustand?*  
  **Answer:** For a medium-scale single-page CRM application, React 19's native `useContext`, `useReducer`, and URL search params provide clean state isolation without adding 20–50KB of external boilerplate libraries.

---

## 6. Performance Optimization

### Q20: How did you implement Code Splitting in Lumen CRM?
**Answer:** In [App.jsx:8-23](file:///d:/NAMISH%20M%20S/VS%20Code/AI%20CRM%20Dashboard/frontend/src/App.jsx#L8-L23), every page is imported using `React.lazy(() => import("./pages/..."))` wrapped in a `<Suspense fallback={<PageLoader />}>` boundary.
- **Follow-up Q20.1:** *What performance benefit does this provide?*  
  **Answer:** Vite splits each page into separate JavaScript bundles (e.g., `PipelinePage.js`, `DashboardPage.js`). The browser only downloads the code for the page the user is currently viewing, reducing the initial bundle load time by over 60%.
- **Follow-up Q20.2:** *How many build chunks does Vite generate for your project?*  
  **Answer:** Vite outputs 46 chunk files in `dist/assets/`, cleanly separating vendor UI components, validation schemas, and individual page views.

### Q21: Where did you use `React.memo` and why?
**Answer:** In [DealCard.jsx:11](file:///d:/NAMISH%20M%20S/VS%20Code/AI%20CRM%20Dashboard/frontend/src/pages/pipeline/DealCard.jsx#L11), I wrapped `DealCard` in `React.memo()`.
- **Follow-up Q21.1:** *Why is `React.memo` critical on the Kanban board?*  
  **Answer:** The pipeline may have dozens of deal cards. When a user drags one deal from "New" to "Qualified", only the source and destination columns need to update. `React.memo` performs a shallow prop comparison and skips re-rendering all other unaffected deal cards.
- **Follow-up Q21.2:** *What is shallow comparison in React.memo?*  
  **Answer:** It compares primitive props by value (`===`) and object/function props by reference address. If the references haven't changed, rendering is skipped.

---

## 7. UI, CSS & Responsive Design

### Q22: What CSS framework did you use and how does Tailwind CSS v4 work?
**Answer:** I used **Tailwind CSS v4** configured with modern CSS design tokens in [index.css](file:///d:/NAMISH%20M%20S/VS%20Code/AI%20CRM%20Dashboard/frontend/src/index.css). Tailwind v4 uses a lightning-fast Rust-based engine (`@tailwindcss/vite`) and defines theme variables using native `@theme` CSS custom properties for surfaces, borders, text inks, and brand gradients.
- **Follow-up Q22.1:** *What breakpoints did you use for responsive design?*  
  **Answer:** Standard Tailwind breakpoints: `sm` (640px), `md` (768px), `lg` (1024px), and `xl` (1280px).
- **Follow-up Q22.2:** *Show an example of responsive design in your layout.*  
  **Answer:** In [AppLayout.jsx](file:///d:/NAMISH%20M%20S/VS%20Code/AI%20CRM%20Dashboard/frontend/src/components/layout/AppLayout.jsx), the desktop sidebar is hidden on small screens (`hidden lg:flex`), while mobile displays a top navigation bar with a collapsible drawer.

### Q23: What is CVA (Class Variance Authority) and how is it used in your UI kit?
**Answer:** CVA provides a structured way to define component style variants. In [buttonVariants.js:4-29](file:///d:/NAMISH%20M%20S/VS%20Code/AI%20CRM%20Dashboard/frontend/src/lib/buttonVariants.js#L4-L29), I used `cva()` to define base styles, visual variants (`primary`, `secondary`, `outline`, `ghost`, `danger`), sizes (`sm`, `md`, `lg`, `icon`), and default variants, combined with `clsx` and `tailwind-merge` in [utils.js](file:///d:/NAMISH%20M%20S/VS%20Code/AI%20CRM%20Dashboard/frontend/src/lib/utils.js).

---

## 8. Backend Architecture, REST APIs & Security

### Q24: What is the backend architecture of Lumen CRM?
**Answer:** The backend is built with **Node.js** and **Express.js** ([server.js](file:///d:/NAMISH%20M%20S/VS%20Code/AI%20CRM%20Dashboard/backend/server.js)). It provides 34 REST API endpoints organized into 9 resource modules: `auth`, `leads`, `contacts`, `notes`, `tasks`, `ai`, `analytics`, `search`, and `notifications`.
- **Follow-up Q24.1:** *Where is the data stored in the backend?*  
  **Answer:** For this capstone prototype, data is stored in memory in [store.js](file:///d:/NAMISH%20M%20S/VS%20Code/AI%20CRM%20Dashboard/backend/src/data/store.js) using pre-seeded fixtures.
- **Follow-up Q24.2:** *What happens when the backend server restarts?*  
  **Answer:** Because data is in memory, it resets to the initial seeded state upon server restart. (In future Phase 4, this will be connected to MongoDB).

### Q25: How does authentication and JWT security work in the backend?
**Answer:** 
1. Upon registration or login ([authController.js:22-45](file:///d:/NAMISH%20M%20S/VS%20Code/AI%20CRM%20Dashboard/backend/src/controllers/authController.js#L22-L45)), passwords are verified using `bcrypt.compare()`.
2. A signed JSON Web Token (JWT) is generated with `jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "7d" })`.
3. Protected routes pass through [authMiddleware.js](file:///d:/NAMISH%20M%20S/VS%20Code/AI%20CRM%20Dashboard/backend/src/middleware/authMiddleware.js), which extracts the `Bearer <token>` from the `Authorization` header, verifies it with `jwt.verify()`, and attaches the decoded user to `req.user`.
- **Follow-up Q25.1:** *What happens if `process.env.JWT_SECRET` is missing?*  
  **Answer:** In [server.js:16-19](file:///d:/NAMISH%20M%20S/VS%20Code/AI%20CRM%20Dashboard/backend/server.js#L16-L19), the server implements a fail-fast startup guard: `if (!process.env.JWT_SECRET) process.exit(1)`.
- **Follow-up Q25.2:** *Why does your login controller return a generic "Invalid email or password" error?*  
  **Answer:** To prevent user enumeration attacks. It does not disclose whether the email exists or if only the password was wrong.

### Q26: How does Axios handle tokens and 401 unauthorized errors?
**Answer:** In [api.js:11-32](file:///d:/NAMISH%20M%20S/VS%20Code/AI%20CRM%20Dashboard/frontend/src/lib/api.js#L11-L32), I configured Axios request and response interceptors:
- **Request Interceptor:** Automatically reads `localStorage.getItem("lumen_crm_token")` and attaches `Authorization: Bearer <token>` to every outgoing request.
- **Response Interceptor:** Catches 401 Unauthorized responses and automatically deletes the token with `localStorage.removeItem()` to log out stale sessions.

---

## 9. Testing & Quality Assurance

### Q27: What testing framework did you use and what tests did you write?
**Answer:** I used **Vitest** with **React Testing Library** and `@testing-library/jest-dom`. I wrote **33 automated unit and component tests** across 11 test files in [frontend/tests/unit/](file:///d:/NAMISH%20M%20S/VS%20Code/AI%20CRM%20Dashboard/frontend/tests/unit/).
- **Follow-up Q27.1:** *What do your tests cover?*  
  **Answer:** 
  1. `pipelineReducer.test.js`: 6 tests for board initialization, column moves, and rollback.
  2. `leadWizard.test.jsx`: 3 tests for multi-step navigation, field validation, and duplicate email checking.
  3. `loginForm.test.jsx`: 2 tests for empty field errors and successful login submission.
  4. `protectedRoute.test.jsx`: 3 tests for unauthenticated redirect, authenticated render, and loading spinner.
  5. `leadsFiltering.test.js`: 3 tests for status/priority multi-facet filtering.
  6. `validation.test.js`: 4 tests for `NAME_REGEX` sanitization and bounds.
  7. `useDebounce.test.js` & `useLocalStorage.test.js`: 5 tests for custom hook behavior.
  8. `formatters.test.js` & `analytics.test.js`: 5 tests for currency, relative dates, and conversion maths.
  9. `leadsTable.test.jsx`: 2 tests for table rendering and column header sort events.
- **Follow-up Q27.2:** *What is the result of running `npm test`?*  
  **Answer:** All 11 test files pass cleanly (33/33 tests passing, 0 failures).

---

## 10. Project Architecture & Provenance

### Q28: How did you divide the work between the tutorial boilerplate and your own code?
**Answer (Honest Provenance Statement):**
- **Tutorial Starting Point:** I began from a YouTube UI boilerplate (time-to-program) that provided the initial dark theme visual shell, mock data generators, and layout mockups.
- **My Custom Work (Self-Built):**
  1. **Complete Backend REST API:** Wrote the entire Node.js/Express server ([server.js](file:///d:/NAMISH%20M%20S/VS%20Code/AI%20CRM%20Dashboard/backend/server.js)), 9 route modules, 9 controller files, JWT authentication middleware, and bcrypt password hashing.
  2. **Automated Test Suite:** Built 11 test files and 33 Vitest unit/component tests from scratch.
  3. **Multi-Step Lead Creation Wizard:** Built [LeadWizardDialog.jsx](file:///d:/NAMISH%20M%20S/VS%20Code/AI%20CRM%20Dashboard/frontend/src/components/leads/LeadWizardDialog.jsx) with 4 steps, Zod schema validation, per-step `trigger()`, `useFieldArray` dynamic tags, and live async duplicate email verification.
  4. **Kanban Pipeline Reducer & Optimistic Updates:** Wrote [usePipelineReducer.js](file:///d:/NAMISH%20M%20S/VS%20Code/AI%20CRM%20Dashboard/frontend/src/hooks/usePipelineReducer.js) with `@dnd-kit` collision detection, snapshot rollbacks, and keyboard/mouse horizontal scrolling.
  5. **URL-Synchronized Filter Engine:** Built [useLeads.js](file:///d:/NAMISH%20M%20S/VS%20Code/AI%20CRM%20Dashboard/frontend/src/hooks/useLeads.js) using `useSearchParams`.
  6. **Command Palette (`Ctrl+K`):** Built [CommandSearch.jsx](file:///d:/NAMISH%20M%20S/VS%20Code/AI%20CRM%20Dashboard/frontend/src/components/common/CommandSearch.jsx) with `useDeferredValue`.
  7. **Context & Polling Layer:** Implemented [AuthContext.jsx](file:///d:/NAMISH%20M%20S/VS%20Code/AI%20CRM%20Dashboard/frontend/src/context/AuthContext.jsx), [NotificationsContext.jsx](file:///d:/NAMISH%20M%20S/VS%20Code/AI%20CRM%20Dashboard/frontend/src/context/NotificationsContext.jsx), and [SettingsContext.jsx](file:///d:/NAMISH%20M%20S/VS%20Code/AI%20CRM%20Dashboard/frontend/src/context/SettingsContext.jsx).
  8. **Nested Lead Detail Tabs:** Built [LeadDetailPage.jsx](file:///d:/NAMISH%20M%20S/VS%20Code/AI%20CRM%20Dashboard/frontend/src/pages/leads/LeadDetailPage.jsx) using React Router v7 `<Outlet context />`.

---

## 11. Tough Questions & Project Weaknesses

### Q29: "Is your AI Copilot actually calling OpenAI or Google Gemini in real time?"
**Answer:** "No, sir. In this current implementation, the AI service ([geminiService.js](file:///d:/NAMISH%20M%20S/VS%20Code/AI%20CRM%20Dashboard/backend/src/services/geminiService.js) and [ai.js](file:///d:/NAMISH%20M%20S/VS%20Code/AI%20CRM%20Dashboard/frontend/src/lib/services/ai.js)) is a simulated heuristic service that computes lead health scores, risk assessments, and draft emails based on structured rules and mock payloads. It is intentionally architected with a swappable API interface so that adding a live Google Gemini API key requires only updating the service adapter function without changing any UI components."

### Q30: "Why is your backend data stored in memory instead of MongoDB/PostgreSQL?"
**Answer:** "I designed the backend with an in-memory data store ([store.js](file:///d:/NAMISH%20M%20S/VS%20Code/AI%20CRM%20Dashboard/backend/src/data/store.js)) for this Phase 1 & 2 capstone demonstration. This makes the project completely zero-configuration and deterministic during examination without needing external database servers. The controller layer is written with async handler signatures so migrating to Mongoose or Prisma will only require replacing array operations with database queries."

### Q31: "Is storing JWT tokens in localStorage secure?"
**Answer:** "Storing JWTs in `localStorage` makes the token accessible to JavaScript, which creates a vulnerability if the application suffers from a Cross-Site Scripting (XSS) exploit. In an enterprise production deployment, I would store tokens inside `httpOnly`, `SameSite=Strict`, `Secure` cookies. For this SPA capstone, `localStorage` was chosen for straightforward token management across page refreshes and ease of demonstration."

### Q32: "Does your Leads table use server-side pagination or client-side pagination?"
**Answer:** "Currently, it uses client-side pagination over the loaded dataset in [useLeads.js](file:///d:/NAMISH%20M%20S/VS%20Code/AI%20CRM%20Dashboard/frontend/src/hooks/useLeads.js#L110-L115). For thousands of records, I would implement server-side pagination by passing `?page=1&limit=10` to the Express backend and returning `{ data, totalPages, totalCount }` to minimize payload sizes."

### Q33: "Why did you use 30-second polling for notifications instead of WebSockets?"
**Answer:** "In [NotificationsContext.jsx](file:///d:/NAMISH%20M%20S/VS%20Code/AI%20CRM%20Dashboard/frontend/src/context/NotificationsContext.jsx), I used 30-second interval polling via `useEffect` with cleanup. For low-frequency CRM notifications (like deal updates), polling avoids the server overhead and connection state complexity of persistent WebSocket / Socket.io server connections while keeping the implementation clean."

---

## 12. Code Reading & Deep-Dive Explanations

Here are 10 exact snippets from the codebase that demonstrate key React, architectural, and full-stack concepts:

---

### Snippet 1: Pipeline Reducer & Optimistic Snapshot
**File:** [frontend/src/hooks/usePipelineReducer.js:26-47](file:///d:/NAMISH%20M%20S/VS%20Code/AI%20CRM%20Dashboard/frontend/src/hooks/usePipelineReducer.js#L26-L47)

```javascript
export function pipelineReducer(state, action) {
  switch (action.type) {
    case ACTIONS.SET_BOARD:
      return { ...state, board: toBoard(action.payload), snapshot: null };

    case ACTIONS.MOVE_DEAL: {
      const { activeId, from, to, overIndex } = action.payload;
      const fromItems = [...state.board[from]];
      const toItems = from === to ? fromItems : [...state.board[to]];
      const idx = fromItems.findIndex((l) => l._id === activeId);
      if (idx === -1) return state;
      const [moved] = fromItems.splice(idx, 1);
      const updatedMoved = { ...moved, status: to };
      toItems.splice(overIndex === -1 ? toItems.length : overIndex, 0, updatedMoved);

      const nextBoard =
        from === to
          ? { ...state.board, [from]: toItems }
          : { ...state.board, [from]: fromItems, [to]: toItems };

      return { ...state, board: nextBoard, snapshot: state.board };
    }
```
- **Line-by-Line Explanation:**
  - Line 26: Pure reducer function taking previous `state` and dispatched `action`.
  - Line 32-34: Clones the item arrays of the source column `from` and target column `to` to maintain immutability.
  - Line 35-37: Finds the dragged deal in the source column and removes it via `splice`.
  - Line 38-39: Updates the deal's `status` to the target stage and inserts it at `overIndex`.
  - Line 41-44: Reconstructs the board object with updated stage columns.
  - Line 46: Returns the new board state while saving the previous `state.board` in `snapshot` for rollback.
- **Concept Shown:** Immutability, pure functions, state normalization, optimistic UI updates.

---

### Snippet 2: Optimistic Drag Persistence with Rollback
**File:** [frontend/src/hooks/usePipelineReducer.js:140-160](file:///d:/NAMISH%20M%20S/VS%20Code/AI%20CRM%20Dashboard/frontend/src/hooks/usePipelineReducer.js#L140-L160)

```javascript
  const persistBoard = useCallback(
    async (boardToPersist) => {
      try {
        const flatLeads = Object.values(boardToPersist).flat();
        await leadsApi.reorder(flatLeads);
      } catch (err) {
        dispatch({ type: ACTIONS.ROLLBACK });
        toast.error("Failed to save pipeline changes — rolling back", {
          description: err.message,
        });
      }
    },
    []
  );
```
- **Line-by-Line Explanation:**
  - Line 140: Creates a memoized callback function `persistBoard`.
  - Line 143: Flattens the multi-column board object into an ordered array of leads.
  - Line 144: Calls the backend API `leadsApi.reorder()`.
  - Line 145-149: If the network request fails, catches the error and dispatches `ACTIONS.ROLLBACK` to restore the snapshot, alerting the user via a Sonner toast.
- **Concept Shown:** Optimistic updates, error recovery/rollback, `useCallback`, asynchronous API handling.

---

### Snippet 3: Protected Route Guard
**File:** [frontend/src/components/layout/ProtectedRoute.jsx:6-23](file:///d:/NAMISH%20M%20S/VS%20Code/AI%20CRM%20Dashboard/frontend/src/components/layout/ProtectedRoute.jsx#L6-L23)

```javascript
export function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="grid min-h-screen place-items-center">
        <Spinner />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
```
- **Line-by-Line Explanation:**
  - Line 7: Accesses current authentication state and session loading flag from `AuthContext`.
  - Line 8: Captures the current URL path using `useLocation()`.
  - Line 10-16: If session verification is in-flight, renders a centered loading spinner.
  - Line 18-20: If no authenticated user exists, redirects to `/login`, preserving previous path in `state.from`.
  - Line 22: Renders child components if authenticated.
- **Concept Shown:** Higher-Order Component / Route Guards, Declarative Navigation, Context consumption.

---

### Snippet 4: Axios Interceptor & Auto-Logout
**File:** [frontend/src/lib/api.js:10-32](file:///d:/NAMISH%20M%20S/VS%20Code/AI%20CRM%20Dashboard/frontend/src/lib/api.js#L10-L32)

```javascript
// Attach the JWT to every request if we have one.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Normalise responses & errors so callers get clean data / messages.
api.interceptors.response.use(
  (res) => res.data,
  (error) => {
    const status = error.response?.status;
    const message =
      error.response?.data?.message || error.message || "Something went wrong";

    // Auto-logout on an expired/invalid token (but not on the login screen).
    if (status === 401 && !window.location.pathname.startsWith("/login")) {
      localStorage.removeItem(TOKEN_KEY);
    }

    return Promise.reject({ status, message });
  }
);
```
- **Line-by-Line Explanation:**
  - Line 11-15: Request interceptor injects the Bearer JWT token from `localStorage` into the HTTP header.
  - Line 19: Response interceptor unboxes `res.data` so calling services receive payload directly.
  - Line 26-28: Detects HTTP 401 Unauthorized errors and clears the invalid token from `localStorage`.
- **Concept Shown:** HTTP middleware, centralized authentication handling, interceptor pattern.

---

### Snippet 5: Zod Schema & Form Resolver
**File:** [frontend/src/lib/validation.js:50-60](file:///d:/NAMISH%20M%20S/VS%20Code/AI%20CRM%20Dashboard/frontend/src/lib/validation.js#L50-L60) and [Login.jsx:23-26](file:///d:/NAMISH%20M%20S/VS%20Code/AI%20CRM%20Dashboard/frontend/src/pages/auth/Login.jsx#L23-L26)

```javascript
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters"),
});
```
```javascript
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });
```
- **Line-by-Line Explanation:**
  - Defines a declarative Zod schema enforcing string type, presence, email format, and min length.
  - Passes `zodResolver(loginSchema)` to `useForm()`, binding client-side schema validation directly to form submission events.
- **Concept Shown:** Schema-based validation, runtime validation, React Hook Form integration.

---

### Snippet 6: Wizard Per-Step Validation Trigger
**File:** [frontend/src/components/leads/LeadWizardDialog.jsx:93-118](file:///d:/NAMISH%20M%20S/VS%20Code/AI%20CRM%20Dashboard/frontend/src/components/leads/LeadWizardDialog.jsx#L93-L118)

```javascript
  const handleNext = async () => {
    let fieldsToValidate = [];
    if (step === 1) fieldsToValidate = ["name", "company", "source"];
    if (step === 2) fieldsToValidate = ["email", "phone"];
    if (step === 3) fieldsToValidate = ["value", "status", "priority"];

    const stepValid = await trigger(fieldsToValidate);
    if (!stepValid) return;

    if (step === 2) {
      const email = getValues("email");
      if (email) {
        setEmailChecking(true);
        try {
          const res = await leadsApi.checkEmail(email);
          if (res.exists) {
            setError("email", { message: "This email is already registered to an active lead" });
            return;
          }
        } finally {
          setEmailChecking(false);
        }
      }
    }
    setStep((s) => Math.min(s + 1, 4));
  };
```
- **Line-by-Line Explanation:**
  - Line 95-97: Defines the subset of fields belonging to the current step.
  - Line 99: Calls React Hook Form's `trigger()` to validate only that subset against the schema.
  - Line 102-116: On Step 2, performs an asynchronous duplicate email check against the backend.
  - Line 117: Increments step count only if both schema and async checks pass.
- **Concept Shown:** Partial/stepped validation, asynchronous validation, state-preserving multi-step wizards.

---

### Snippet 7: Dynamic Tag Arrays with `useFieldArray`
**File:** [frontend/src/components/leads/LeadWizardDialog.jsx:75-87](file:///d:/NAMISH%20M%20S/VS%20Code/AI%20CRM%20Dashboard/frontend/src/components/leads/LeadWizardDialog.jsx#L75-L87)

```javascript
  const { fields: tagFields, append: appendTag, remove: removeTag } = useFieldArray({
    control,
    name: "tags",
  });

  const handleAddTag = () => {
    const val = tagInput.trim();
    if (!val) return;
    if (tagFields.some((t) => t.value.toLowerCase() === val.toLowerCase())) {
      toast.error("Tag already added");
      return;
    }
    appendTag({ value: val });
    setTagInput("");
  };
```
- **Line-by-Line Explanation:**
  - Line 75: Connects `useFieldArray` to the `tags` array field inside the RHF `control`.
  - Line 81-84: Checks for duplicates in the dynamic list.
  - Line 85: Calls `appendTag({ value: val })` which adds the item immutably and tracks array dirty state.
- **Concept Shown:** Dynamic nested array state in forms, immutable field manipulation.

---

### Snippet 8: Polling with useEffect and Cleanup
**File:** [frontend/src/context/NotificationsContext.jsx:58-81](file:///d:/NAMISH%20M%20S/VS%20Code/AI%20CRM%20Dashboard/frontend/src/context/NotificationsContext.jsx#L58-L81)

```javascript
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await notificationsApi.list();
        if (active && res.success) {
          setNotifications(res.notifications || []);
          setUnreadCount(res.unreadCount || 0);
        }
      } catch {
        // silently fail on polling errors
      }
    })();

    intervalRef.current = setInterval(fetchNotifications, POLL_INTERVAL);

    return () => {
      active = false;
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [fetchNotifications]);
```
- **Line-by-Line Explanation:**
  - Line 59: `active` boolean flag prevents memory leak if component unmounts during asynchronous fetch.
  - Line 72: Starts a 30,000ms recurring timer stored in `intervalRef.current`.
  - Line 74-80: Cleanup function clears the interval when the provider unmounts.
- **Concept Shown:** Side effects lifecycle, interval management, memory leak prevention via cleanup.

---

### Snippet 9: Mock vs Real API Switch Architecture
**File:** [frontend/src/lib/services/config.js:1](file:///d:/NAMISH%20M%20S/VS%20Code/AI%20CRM%20Dashboard/frontend/src/lib/services/config.js#L1) and [frontend/src/lib/services/leads.js:5-9](file:///d:/NAMISH%20M%20S/VS%20Code/AI%20CRM%20Dashboard/frontend/src/lib/services/leads.js#L5-L9)

```javascript
// config.js
export const USE_MOCK = import.meta.env.VITE_USE_MOCK !== "false";

// leads.js
export const leadsApi = {
  list: (params) => {
    if (!USE_MOCK) return api.get("/leads", { params });
    return reply({ success: true, count: leads.length, leads });
  },
```
- **Line-by-Line Explanation:**
  - Evaluates the environment variable `VITE_USE_MOCK`.
  - Service methods inspect `USE_MOCK`: if `false`, they make real HTTP network calls via Axios (`api.get`); if `true`, they return simulated promises with small network latency using `reply()`.
- **Concept Shown:** Service Layer Abstraction, Environment-driven feature toggling.

---

### Snippet 10: URL-Synchronized Filtering with useMemo
**File:** [frontend/src/hooks/useLeads.js:85-104](file:///d:/NAMISH%20M%20S/VS%20Code/AI%20CRM%20Dashboard/frontend/src/hooks/useLeads.js#L85-L104)

```javascript
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
        // ... sort direction logic
      });
  }, [leads, statusFilter, priorityFilter, sourceFilter, searchQuery, sortKey, sortDir]);
```
- **Line-by-Line Explanation:**
  - Wraps multi-field filtering and sorting in `useMemo`.
  - Reads filters derived from `useSearchParams()`.
  - Recalculates only when filter parameters or source dataset changes.
- **Concept Shown:** Performance memoization, multi-facet filtering, URL state derivation.
