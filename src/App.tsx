import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import HomePage from './pages/HomePage';
import Architecture from './docs/Architecture';

// Admin Panel Bileşenleri
import AdminLayout from './layouts/AdminLayout';
import AdminDashboard from './pages/admin/Dashboard';
import WalletSettlementTable from './pages/admin/WalletSettlementTable';
import WalletDailyTable from './pages/admin/WalletDailyTable';
import StoredCardSettlementTable from './pages/admin/StoredCardSettlementTable';
import StoredCardMonthlyTable from './pages/admin/StoredCardMonthlyTable';
import CommunicationTemplates from './pages/admin/CommunicationTemplates';
import UserManagement from './pages/admin/UserManagement';
import MerchantUserManagement from './pages/admin/MerchantUserManagement';
import RoleManagement from './pages/admin/RoleManagement';
import AuditLogs from './pages/admin/AuditLogs';
import POSErrorManagement from './pages/admin/POSErrorManagement';

import ParameterDefinitions from "./pages/admin/ParameterDefinitions"; // Parametre tanımları sayfası
import RuleBuilder from "./pages/admin/RuleBuilder"; // Kural oluşturucu sayfası
import RuleTemplates from "./pages/admin/RuleTemplates"; // Kural şablonları sayfası
import { isFraudFeaturesEnabled } from "./utils/environment";
import ProtectedRoute from "./components/ProtectedRoute";

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
          <Route path="wallet-settlement" element={<WalletSettlementTable />} />
          <Route path="wallet-daily" element={<WalletDailyTable />} />
          <Route path="stored-card-settlement" element={<StoredCardSettlementTable />} />
          <Route path="stored-card-monthly" element={<StoredCardMonthlyTable />} />
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
          <Route path="parameter-definitions" element={
            <ProtectedRoute requireFraudFeature={true}>
              <ParameterDefinitions />
            </ProtectedRoute>
          } />
          <Route path="rule-builder" element={
            <ProtectedRoute requireFraudFeature={true}>
              <RuleBuilder />
            </ProtectedRoute>
          } />
          <Route path="rule-templates" element={
            <ProtectedRoute requireFraudFeature={true}>
              <RuleTemplates />
            </ProtectedRoute>
          } />

          <Route index element={<Navigate to="/admin/dashboard" replace />} />
        </Route>
        
        {/* Merchant Panel Routes */}
        <Route path="/merchant" element={<MerchantLayout />}>
          <Route path="dashboard" element={<MerchantDashboard />} />
          <Route path="reports" element={<PaymentReports />} />
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