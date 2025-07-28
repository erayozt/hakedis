import { NavLink, Outlet } from 'react-router-dom';
import { Home, BarChart2, FileText, Wallet, CreditCard, Calendar, LogOut } from 'lucide-react';

const menuItems = [
  {
    section: 'Ana Menü',
    items: [
      { to: '/merchant/dashboard', icon: Home, label: 'Kontrol Paneli' },
      { to: '/merchant/reports', icon: BarChart2, label: 'Ödeme Raporları' },
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
  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-gray-200 flex flex-col flex-shrink-0">
        <div className="h-16 flex items-center justify-center bg-gray-900 border-b border-gray-800">
          <h1 className="text-xl font-bold text-white tracking-wider">Hepsipay</h1>
        </div>
        <nav className="flex-grow px-2 py-4 space-y-4">
          {menuItems.map((menu) => (
            <div key={menu.section}>
              <h2 className="px-4 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">{menu.section}</h2>
              {menu.items.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center px-4 py-2.5 rounded-md text-sm font-medium transition-colors ${
                      isActive ? 'bg-gray-700 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                    }`
                  }
                >
                  <item.icon className="h-5 w-5 mr-3" />
                  {item.label}
                </NavLink>
              ))}
            </div>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-800">
          <button className="flex items-center w-full px-4 py-2.5 rounded-md text-sm font-medium text-gray-400 hover:bg-gray-800 hover:text-white">
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