import { NavLink, Outlet } from 'react-router-dom';
import { Home, BarChart2, FileText, Settings, LogOut, ChevronRight, Building, Wallet, CreditCard, Gift, Shield } from 'lucide-react';

const MerchantLayout = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white flex flex-col">
        <div className="p-6 text-2xl font-bold border-b border-gray-700">
          Hepsipay Merchant
        </div>
        <nav className="flex-grow p-4 space-y-2">
          <NavLink to="/merchant/dashboard" className={({ isActive }) => `flex items-center px-4 py-2.5 rounded-lg transition-colors ${isActive ? 'bg-gray-700' : 'hover:bg-gray-700'}`}>
            <Home className="h-5 w-5 mr-3" />
            Kontrol Paneli
          </NavLink>
          <NavLink to="/merchant/reports" className={({ isActive }) => `flex items-center px-4 py-2.5 rounded-lg transition-colors ${isActive ? 'bg-gray-700' : 'hover:bg-gray-700'}`}>
            <BarChart2 className="h-5 w-5 mr-3" />
            Ödeme Raporları
          </NavLink>
          <NavLink to="/merchant/receipts" className={({ isActive }) => `flex items-center px-4 py-2.5 rounded-lg transition-colors ${isActive ? 'bg-gray-700' : 'hover:bg-gray-700'}`}>
            <FileText className="h-5 w-5 mr-3" />
            Dekontlar
          </NavLink>
           <NavLink to="/merchant/statements" className={({ isActive }) => `flex items-center px-4 py-2.5 rounded-lg transition-colors ${isActive ? 'bg-gray-700' : 'hover:bg-gray-700'}`}>
            <Wallet className="h-5 w-5 mr-3" />
            Ekstreler
          </NavLink>
        </nav>
        <div className="p-4 border-t border-gray-700">
          <button className="flex items-center w-full px-4 py-2.5 rounded-lg hover:bg-gray-700">
            <LogOut className="h-5 w-5 mr-3" />
            Çıkış Yap
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto relative">
        <Outlet />
      </main>
    </div>
  );
};

export default MerchantLayout;