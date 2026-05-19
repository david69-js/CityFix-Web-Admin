import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './store/authStore';
import Layout from './components/Layout';
import Login from './pages/Login';
import Issues from './pages/Issues';
import IssueDetails from './pages/IssueDetails';
import Reports from './pages/Reports';
import AdminPage from './pages/AdminPage';
import AdminUsers from './pages/AdminUsers';
import AdminCategories from './pages/AdminCategories';
import AdminInvitations from './pages/AdminInvitations';
import AdminCampaign from './pages/AdminCampaign';
import AdminArchived from './pages/AdminArchived';

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, staleTime: 30000 } },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route element={<Layout />}>
              <Route path="/" element={<Navigate to="/reports" replace />} />
              <Route path="/issues" element={<Issues />} />
              <Route path="/issues/:id" element={<IssueDetails />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="/admin/users" element={<AdminUsers />} />
              <Route path="/admin/categories" element={<AdminCategories />} />
              <Route path="/admin/invitations" element={<AdminInvitations />} />
              <Route path="/admin/campaign" element={<AdminCampaign />} />
              <Route path="/admin/archived" element={<AdminArchived />} />
            </Route>
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
