import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import { LoadingSpinner } from './components/LoadingSpinner';
import { MenuPage } from './pages/customer/MenuPage';
import { OrderConfirmPage } from './pages/customer/OrderConfirmPage';
import { OrderSuccessPage } from './pages/customer/OrderSuccessPage';
import { OrderHistoryPage } from './pages/customer/OrderHistoryPage';
import { TableSetupPage } from './pages/customer/TableSetupPage';
import { CartDrawer } from './pages/customer/components/CartDrawer';
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { DashboardPage } from './pages/admin/DashboardPage';
import { MenuManagePage } from './pages/admin/MenuManagePage';
import { TableManagePage } from './pages/admin/TableManagePage';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { state } = useAuth();

  // Mock 모드: 인증 체크 우회
  const USE_MOCK = true;
  if (USE_MOCK) return <>{children}</>;

  if (state.isLoading) return <LoadingSpinner />;
  if (!state.isAuthenticated) return <Navigate to="/setup" replace />;

  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Customer Routes */}
      <Route path="/setup" element={<TableSetupPage />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <MenuPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/order/confirm"
        element={
          <ProtectedRoute>
            <OrderConfirmPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/order/success"
        element={
          <ProtectedRoute>
            <OrderSuccessPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/orders"
        element={
          <ProtectedRoute>
            <OrderHistoryPage />
          </ProtectedRoute>
        }
      />
      {/* Admin Routes */}
      <Route path="/admin/login" element={<AdminLoginPage />} />
      <Route path="/admin/dashboard" element={<DashboardPage />} />
      <Route path="/admin/menu" element={<MenuManagePage />} />
      <Route path="/admin/tables" element={<TableManagePage />} />
    </Routes>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <CartProvider>
            <AppRoutes />
            <CartDrawer />
          </CartProvider>
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
