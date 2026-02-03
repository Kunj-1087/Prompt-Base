import { Routes, Route } from "react-router-dom";
import { Home } from "./pages/Home";
import { Login } from "./pages/Login";
import { Signup } from "./pages/Signup";
import { ForgotPassword } from "./pages/ForgotPassword";
import { ResetPassword } from "./pages/ResetPassword";
import { ProfilePage } from "./pages/ProfilePage";
import { DashboardPage } from "./pages/DashboardPage";
import { SettingsPage } from "./pages/SettingsPage";
import { VerifyEmailPage } from "./pages/VerifyEmailPage";
import { CreatePromptPage } from "./pages/CreatePromptPage";
import { PromptsListPage } from "./pages/PromptsListPage";
import { PromptDetailPage } from "./pages/PromptDetailPage";
import { EditPromptPage } from "./pages/EditPromptPage";
import { AdminDashboard } from "./pages/admin/AdminDashboard";
import { RoleRoute } from "./components/auth/RoleRoute";
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <>
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
        <Route path="/prompts/new" element={<CreatePromptPage />} />
        <Route path="/prompts/:id" element={<PromptDetailPage />} />
        <Route path="/prompts/:id/edit" element={<EditPromptPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        
        {/* Protected Admin Routes */}
        <Route element={<RoleRoute roles={['admin']} />}>
          <Route path="/admin" element={<AdminDashboard />} />
        </Route>
      </Routes>
      <Toaster position="top-right" />
    </>
  );
}

export default App;
