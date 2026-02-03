import { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
// Lazy load pages
const Home = lazy(() => import("./pages/Home").then(module => ({ default: module.Home })));
const Login = lazy(() => import("./pages/Login").then(module => ({ default: module.Login })));
const Signup = lazy(() => import("./pages/Signup").then(module => ({ default: module.Signup })));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword").then(module => ({ default: module.ForgotPassword })));
const ResetPassword = lazy(() => import("./pages/ResetPassword").then(module => ({ default: module.ResetPassword })));
const ProfilePage = lazy(() => import("./pages/ProfilePage").then(module => ({ default: module.ProfilePage })));
const DashboardPage = lazy(() => import("./pages/DashboardPage").then(module => ({ default: module.DashboardPage })));
const SettingsPage = lazy(() => import("./pages/SettingsPage").then(module => ({ default: module.SettingsPage })));
const VerifyEmailPage = lazy(() => import("./pages/VerifyEmailPage").then(module => ({ default: module.VerifyEmailPage })));
const CreatePromptPage = lazy(() => import("./pages/CreatePromptPage").then(module => ({ default: module.CreatePromptPage })));
const PromptsListPage = lazy(() => import("./pages/PromptsListPage").then(module => ({ default: module.PromptsListPage })));
const PromptDetailPage = lazy(() => import("./pages/PromptDetailPage").then(module => ({ default: module.PromptDetailPage })));
const EditPromptPage = lazy(() => import("./pages/EditPromptPage").then(module => ({ default: module.EditPromptPage })));
const AdvancedSearch = lazy(() => import("./pages/AdvancedSearch").then(module => ({ default: module.AdvancedSearch })));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard").then(module => ({ default: module.AdminDashboard })));
const TestLoading = lazy(() => import("./pages/TestLoading").then(module => ({ default: module.TestLoading })));
import { RoleRoute } from "./components/auth/RoleRoute";
import { Toaster } from 'react-hot-toast';
import { LoadingOverlay } from "@/components/common/LoadingOverlay";

import { ErrorBoundary } from '@/components/common/ErrorBoundary';

import { SkipLink } from "@/components/common/SkipLink";

function App() {
  return (
    <ErrorBoundary>
      <SkipLink />
      <Suspense fallback={<LoadingOverlay isLoading={true} fullScreen={true} message="Loading..." />}>
        <main id="main-content" className="min-h-screen outline-none" tabIndex={-1}>
          <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/verify-email/:token" element={<VerifyEmailPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/prompts" element={<PromptsListPage />} />
          <Route path="/search" element={<AdvancedSearch />} />
          <Route path="/prompts/new" element={<CreatePromptPage />} />
          <Route path="/prompts/:id" element={<PromptDetailPage />} />
          <Route path="/prompts/:id/edit" element={<EditPromptPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/test-loading" element={<TestLoading />} />
          
          {/* Protected Admin Routes */}
          <Route element={<RoleRoute roles={['admin']} />}>
            <Route path="/admin" element={<AdminDashboard />} />
          </Route>
          </Routes>
        </main>
      </Suspense>
      <Toaster position="top-right" />
    </ErrorBoundary>
  );
}

export default App;
