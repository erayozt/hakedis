import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import HomePage from './pages/HomePage';
import Architecture from './docs/Architecture';

// Admin Panel Bileşenleri
import AdminLayout from './layouts/AdminLayout';
import AdminDashboard from './pages/admin/Dashboard';
import WalletSettlementPage from './pages/admin/WalletSettlementTable';
import StoredCardSettlementTable from './pages/admin/StoredCardSettlementTable';
import CommunicationTemplates from './pages/admin/CommunicationTemplates';
import UserManagement from './pages/admin/UserManagement';
import MerchantUserManagement from './pages/admin/MerchantUserManagement';
import RoleManagement from './pages/admin/RoleManagement';
import AuditLogs from './pages/admin/AuditLogs';
import POSErrorManagement from './pages/admin/POSErrorManagement';
import FraudRuleManagement from './pages/admin/FraudRuleManagement';
import ProtectedRoute from "./components/ProtectedRoute";
import PasswordProtectedRoute from './components/PasswordProtectedRoute';

// Merchant Panel Bileşenleri
import MerchantLayout from './layouts/MerchantLayout';
import MerchantDashboard from './pages/merchant/Dashboard';
import PaymentReports from './pages/merchant/PaymentReports';
import MerchantWalletSettlementTable from './pages/merchant/WalletSettlementTable';
import MerchantWalletDailyTable from './pages/merchant/WalletDailyTable';
import MerchantStoredCardSettlementTable from './pages/merchant/StoredCardSettlementTable';
import MerchantStoredCardMonthlyTable from './pages/merchant/StoredCardMonthlyTable';
import MerchantStatements from './pages/merchant/Statements';
import Receipts from './pages/merchant/Receipts';

function App() {
  return (
    <Router>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/architecture" element={<Architecture />} />
        
        {/* Admin Panel Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="wallet-settlement" element={<WalletSettlementPage />} />
          <Route path="stored-card-settlement" element={<StoredCardSettlementTable />} />
          <Route path="communication-templates" element={<CommunicationTemplates />} />
          <Route path="users" element={
            <ProtectedRoute requireFraudFeature={true}>
              <UserManagement />
            </ProtectedRoute>
          } />
          <Route path="merchant-users" element={<MerchantUserManagement />} />
          <Route path="roles" element={
            <ProtectedRoute requireFraudFeature={true}>
              <RoleManagement />
            </ProtectedRoute>
          } />
          <Route path="audit-logs" element={<AuditLogs />} />
          <Route path="pos-error-management" element={<POSErrorManagement />} />
          
          <Route path="fraud-rule-management" element={
            <ProtectedRoute requireFraudFeature={false}>
              <FraudRuleManagement />
            </ProtectedRoute>
          } />

          <Route index element={<Navigate to="/admin/dashboard" replace />} />
        </Route>
        
        {/* Merchant Panel Routes */}
        <Route path="/merchant" element={<MerchantLayout />}>
          <Route index element={<Navigate to="dashboard" />} />
          <Route path="dashboard" element={
            <PasswordProtectedRoute password={import.meta.env.VITE_DASHBOARD_PASSWORD || '2605'}>
              <MerchantDashboard />
            </PasswordProtectedRoute>
          } />
          <Route path="reports" element={
            <PasswordProtectedRoute password={import.meta.env.VITE_DASHBOARD_PASSWORD || '2605'}>
              <PaymentReports />
            </PasswordProtectedRoute>
          } />
          <Route path="wallet-settlement" element={<MerchantWalletSettlementTable />} />
          <Route path="wallet-daily" element={<MerchantWalletDailyTable />} />
          <Route path="stored-card-settlement" element={<MerchantStoredCardSettlementTable />} />
          <Route path="stored-card-monthly" element={<MerchantStoredCardMonthlyTable />} />
          <Route path="statements" element={<MerchantStatements />} />
          <Route path="receipts" element={<Receipts />} />
          <Route index element={<Navigate to="/merchant/dashboard" replace />} />
        </Route>
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
