import {
  createBrowserRouter,
  createRoutesFromChildren,
  RouterProvider,
  Route,
  Outlet,
} from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEffect } from 'react';
import { apiClient } from '@/api/client';
import { authApi } from '@/api/auth.api';
import { useAuthStore } from '@/store/authStore';
import { AuthLayout } from '@/layouts/AuthLayout';
import { ProtectedRoute } from '@/routes/ProtectedRoute';
import { Register } from '@/pages/auth/Register';
import { VerifyOtp } from '@/pages/auth/VerifyOtp';
import { Login } from '@/pages/auth/Login';
import { ForgotPassword } from '@/pages/auth/ForgotPassword';
import { ResetPassword } from '@/pages/auth/ResetPassword';
import { PetsList } from './pages/owner/PetList';
import { DashboardLayout } from './layouts/DashboardLayout';
import { AddEditPet } from './pages/owner/AddEditPet';
import { PetDetail } from './pages/owner/PetDetail';
import { BookAppointment } from './pages/owner/BookAppointment';
import { AppointmentsList } from './pages/owner/AppointmentsList';
import { WishlistPage } from './pages/owner/Wishlist';
import { PetStore } from './pages/owner/PetStore';
import { BlogDetail } from './pages/owner/BlogDetail';
import { BlogList } from './pages/owner/BlogList';
import { BookmarksPage } from './pages/owner/BookmarksPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function RootLayout() {
  const setUser = useAuthStore((state) => state.setUser);
  const setLoading = useAuthStore((state) => state.setLoading);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data } = await apiClient.get('/auth/me');
        setUser(data.user);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, [setUser, setLoading]);

  return <Outlet />;
}

function DashboardPlaceholder({ label }: { label: string }) {
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);

  const handleLogout = async () => {
    await authApi.logout();
    logout();
    window.location.href = '/auth/login';
  };

  return (
    <div className="p-8">
      <p className="text-ink/60">
        Logged in as {user?.name} ({user?.role})
      </p>
      <h1 className="mt-2 text-2xl font-bold">{label} — coming soon</h1>
      <button onClick={handleLogout} className="btn-secondary mt-4">
        Log out
      </button>
    </div>
  );
}

const router = createBrowserRouter(
  createRoutesFromChildren(
    <Route path="/" element={<RootLayout />}>
      <Route index element={<div className="p-8">PawfectCare — coming soon</div>} />

      <Route path="auth" element={<AuthLayout />}>
        <Route
          path="register"
          element={<Register />}
          handle={{
            panelTitle: 'Every pet deserves a pawfect home',
            panelSubtitle:
              'Track health records, book vet visits, and find your new best friend — all in one place.',
          }}
        />
        <Route
          path="verify-otp"
          element={<VerifyOtp />}
          handle={{
            panelTitle: 'Almost there!',
            panelSubtitle:
              "Just one more step and you'll be set up to give your pets the best care.",
          }}
        />
        <Route
          path="login"
          element={<Login />}
          handle={{
            panelTitle: 'Good to see you again',
            panelSubtitle: "Your pets have been waiting — let's pick up where you left off.",
          }}
        />
        <Route
          path="forgot-password"
          element={<ForgotPassword />}
          handle={{
            panelTitle: 'It happens to the best of us',
            panelSubtitle: "We'll help you get back in — no judgment here.",
          }}
        />
        <Route
          path="reset-password"
          element={<ResetPassword />}
          handle={{
            panelTitle: 'Fresh start',
            panelSubtitle: "A new password, and you're right back to caring for your pets.",
          }}
        />
      </Route>

      {/* Pet Owner section — guarded to pet_owner role only */}
      <Route element={<ProtectedRoute allowedRoles={['pet_owner']} />}>
        <Route path="owner" element={<DashboardLayout />}>
          <Route index element={<PetsList />} />
          <Route path="pets/new" element={<AddEditPet />} />
          <Route path="pets/:id/edit" element={<AddEditPet />} />
          <Route path="pets/:id" element={<PetDetail />} />
          <Route path="appointments" element={<AppointmentsList />} />
          <Route path="appointments/new" element={<BookAppointment />} />
          <Route path="store" element={<PetStore />} />
          <Route path="wishlist" element={<WishlistPage />} />
          <Route path="blog" element={<BlogList />} />
          <Route path="blog/:id" element={<BlogDetail />} />
          <Route path="bookmarks" element={<BookmarksPage />} />
          <Route path="notifications" element={<DashboardPlaceholder label="Notifications" />} />
          <Route path="profile" element={<DashboardPlaceholder label="Profile" />} />
        </Route>
      </Route>

      {/* Veterinarian section — guarded to veterinarian role only */}
      <Route element={<ProtectedRoute allowedRoles={['veterinarian']} />}>
        <Route path="vet/dashboard" element={<DashboardPlaceholder label="Vet Dashboard" />} />
      </Route>

      {/* Shelter Admin section — guarded to shelter_admin role only */}
      <Route element={<ProtectedRoute allowedRoles={['shelter_admin']} />}>
        <Route path="shelter/dashboard" element={<DashboardPlaceholder label="Shelter Dashboard" />} />
      </Route>
    </Route>
  )
);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}

export default App;