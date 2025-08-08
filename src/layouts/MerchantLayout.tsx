import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Home, BarChart2, FileText, Wallet, CreditCard, Calendar, LogOut, Menu } from 'lucide-react';
import { useState } from 'react';
import hepsipayLogo from '../assets/hepsipay-logo.png';

const menuItems = [
  {
    section: 'Ana Menü',
    items: [
      { to: '/merchant/dashboard', icon: Home, label: 'Kontrol Paneli' },
      { to: '/merchant/payment-reports', icon: BarChart2, label: 'Ödeme Raporları' },
    ],
  },
  {
    section: 'Hakediş ve Mutabakat',
    items: [
      { to: '/merchant/wallet-settlement', icon: Wallet, label: 'Cüzdan Hakediş' },
      { to: '/merchant/wallet-daily', icon: Calendar, label: 'Cüzdan Günsonu' },
      { to: '/merchant/stored-card-settlement', icon: CreditCard, label: 'Saklı Kart Hakediş' },
      { to: '/merchant/stored-card-monthly', icon: Calendar, label: 'Saklı Kart Aysonu' },
    ],
  },
  {
    section: 'Finansal Yönetim',
    items: [
      { to: '/merchant/receipts', icon: FileText, label: 'Dekontlar' },
      { to: '/merchant/statements', icon: FileText, label: 'Ekstreler' },
    ],
  },
];

const MerchantLayout = () => {
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleLogout = () => {
    navigate('/');
  };

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`${isCollapsed ? 'w-16' : 'w-64'} bg-gradient-to-b from-blue-800 to-blue-900 text-white flex flex-col transition-all duration-300`}>
        {/* Logo and Toggle - Always visible */}
        <div className="flex items-center px-4 py-4 border-b border-blue-700 flex-shrink-0">
          {!isCollapsed ? (
            <>
              <div className="flex flex-col items-center flex-1">
                <img src={hepsipayLogo} alt="HepsiPay" className="h-8 w-auto" />
                <span className="mt-1 text-sm font-semibold">Üye İş Yeri Paneli</span>
              </div>
              <button
                onClick={toggleSidebar}
                className="p-1 rounded hover:bg-blue-700 transition-colors self-start"
              >
                <Menu className="h-5 w-5" />
              </button>
            </>
          ) : (
            <div className="w-full">
              <button
                onClick={toggleSidebar}
                className="p-1 rounded hover:bg-blue-700 transition-colors mb-2 w-full flex justify-center"
              >
                <Menu className="h-5 w-5" />
              </button>
              <div className="flex justify-center">
                <img src={hepsipayLogo} alt="HepsiPay" className="h-6 w-auto" />
              </div>
            </div>
          )}
        </div>

        {/* Navigation - Scrollable with max height */}
        <nav className="flex-1 py-2 overflow-y-auto max-h-[calc(100vh-140px)]">
          {menuItems.map((menu) => (
            <div key={menu.section}>
              {!isCollapsed && (
                <div className="px-4 mt-4 mb-1 text-xs font-medium text-blue-300 uppercase tracking-wide">
                  {menu.section}
                </div>
              )}
              {menu.items.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center px-4 py-1.5 text-sm transition-colors ${isActive ? 'bg-blue-900' : 'hover:bg-blue-700'} ${isCollapsed ? 'justify-center' : ''}`
                  }
                  title={isCollapsed ? item.label : ''}
                >
                  <item.icon className="h-4 w-4" />
                  {!isCollapsed && <span className="ml-3">{item.label}</span>}
                </NavLink>
              ))}
            </div>
          ))}
        </nav>

        {/* Logout - Always visible at bottom */}
        <div className="p-4 border-t border-blue-700 flex-shrink-0">
          <button
            onClick={handleLogout}
            className={`flex items-center w-full px-4 py-2 text-sm text-blue-200 hover:text-white hover:bg-blue-700 rounded transition-colors ${isCollapsed ? 'justify-center' : ''}`}
            title={isCollapsed ? 'Çıkış Yap' : ''}
          >
            <LogOut className="h-4 w-4" />
            {!isCollapsed && <span className="ml-3">Çıkış Yap</span>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default MerchantLayout;
