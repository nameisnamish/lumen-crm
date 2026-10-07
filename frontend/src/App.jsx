import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { AppLayout } from "./components/layout/AppLayout";
import { ProtectedRoute } from "./components/layout/ProtectedRoute";
import { ErrorBoundary } from "./components/common/ErrorBoundary";
import { Spinner } from "./components/ui";

// Code splitting with React.lazy
const Login = lazy(() => import("./pages/auth/Login"));
const Register = lazy(() => import("./pages/auth/Register"));
const Dashboard = lazy(() => import("./pages/dashboard/DashboardPage"));
const LeadsPage = lazy(() => import("./pages/leads/LeadsPage"));
const LeadDetailPage = lazy(() => import("./pages/leads/LeadDetailPage"));
const LeadOverviewTab = lazy(() => import("./pages/leads/LeadOverviewTab"));
const LeadActivityTab = lazy(() => import("./pages/leads/LeadActivityTab"));
const LeadNotesTab = lazy(() => import("./pages/leads/LeadNotesTab"));
const LeadTasksTab = lazy(() => import("./pages/leads/LeadTasksTab"));
const LeadAiTab = lazy(() => import("./pages/leads/LeadAiTab"));
const ContactsPage = lazy(() => import("./pages/contacts/ContactsPage"));
const Pipeline = lazy(() => import("./pages/pipeline/PipelinePage"));
const Notes = lazy(() => import("./pages/notes/NotesPage"));
const Tasks = lazy(() => import("./pages/tasks/TasksPage"));
const Settings = lazy(() => import("./pages/settings/SettingsPage"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));

function PageLoader() {
  return (
    <div className="flex min-h-[400px] w-full items-center justify-center p-8">
      <Spinner size="lg" />
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Public */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Private */}
          <Route
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/" element={<Dashboard />} />
            <Route path="/leads" element={<LeadsPage />} />
            <Route path="/leads/:leadId" element={<LeadDetailPage />}>
              <Route index element={<LeadOverviewTab />} />
              <Route path="overview" element={<LeadOverviewTab />} />
              <Route path="activity" element={<LeadActivityTab />} />
              <Route path="notes" element={<LeadNotesTab />} />
              <Route path="tasks" element={<LeadTasksTab />} />
              <Route path="ai" element={<LeadAiTab />} />
            </Route>
            <Route path="/contacts" element={<ContactsPage />} />
            <Route path="/pipeline" element={<Pipeline />} />
            <Route path="/notes" element={<Notes />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/settings" element={<Settings />} />
          </Route>

          {/* 404 Fallback */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
}
