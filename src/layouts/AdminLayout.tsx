import { Outlet, NavLink } from 'react-router-dom';
import { LogOut, CreditCard, Wallet, Calendar, BarChart3, Mail, Users, Building2, Shield, FileText, AlertTriangle, ShieldAlert, Settings, Zap, Star, Menu, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import hepsipayLogo from '../assets/hepsipay-logo.png';
import { isFraudFeaturesEnabled, isDevelopment } from '../utils/environment';

export default function AdminLayout() {
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
            // Expanded state - logo + text + hamburger
            <>
              <div className="flex flex-col items-center flex-1">
                <img src={hepsipayLogo} alt="HepsiPay" className="h-8 w-auto" />
                <span className="mt-1 text-sm font-semibold">Admin Panel</span>
              </div>
              <button
                onClick={toggleSidebar}
                className="p-1 rounded hover:bg-blue-700 transition-colors self-start"
              >
                <Menu className="h-5 w-5" />
              </button>
            </>
          ) : (
            // Collapsed state - only logo centered with hamburger on top
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
          {/* Dashboard */}
          <NavLink 
            to="/admin/dashboard" 
            className={({ isActive }) => 
              `flex items-center px-4 py-2 text-sm transition-colors ${isActive ? 'bg-blue-900' : 'hover:bg-blue-700'} ${isCollapsed ? 'justify-center' : ''}`
            }
            title={isCollapsed ? 'Dashboard' : ''}
          >
            <BarChart3 className="h-4 w-4" />
            {!isCollapsed && <span className="ml-3">Dashboard</span>}
          </NavLink>

          {/* Hakediş Yönetimi */}
          {!isCollapsed && (
            <div className="px-4 mt-4 mb-1 text-xs font-medium text-blue-300 uppercase tracking-wide">
              Hakediş Yönetimi
            </div>
          )}
          <NavLink 
            to="/admin/wallet-settlement" 
            className={({ isActive }) => 
              `flex items-center px-4 py-1.5 text-sm transition-colors ${isActive ? 'bg-blue-900' : 'hover:bg-blue-700'} ${isCollapsed ? 'justify-center' : ''}`
            }
            title={isCollapsed ? 'Cüzdan Hakediş' : ''}
          >
            <Wallet className="h-4 w-4" />
            {!isCollapsed && <span className="ml-3">Cüzdan Hakediş</span>}
          </NavLink>
          <NavLink 
            to="/admin/wallet-daily" 
            className={({ isActive }) => 
              `flex items-center px-4 py-1.5 text-sm transition-colors ${isActive ? 'bg-blue-900' : 'hover:bg-blue-700'} ${isCollapsed ? 'justify-center' : ''}`
            }
            title={isCollapsed ? 'Cüzdan Günlük' : ''}
          >
            <Calendar className="h-4 w-4" />
            {!isCollapsed && <span className="ml-3">Cüzdan Günlük</span>}
          </NavLink>
          <NavLink 
            to="/admin/stored-card-settlement" 
            className={({ isActive }) => 
              `flex items-center px-4 py-1.5 text-sm transition-colors ${isActive ? 'bg-blue-900' : 'hover:bg-blue-700'} ${isCollapsed ? 'justify-center' : ''}`
            }
            title={isCollapsed ? 'Saklı Kart Hakediş' : ''}
          >
            <CreditCard className="h-4 w-4" />
            {!isCollapsed && <span className="ml-3">Saklı Kart Hakediş</span>}
          </NavLink>
          <NavLink 
            to="/admin/stored-card-monthly" 
            className={({ isActive }) => 
              `flex items-center px-4 py-1.5 text-sm transition-colors ${isActive ? 'bg-blue-900' : 'hover:bg-blue-700'} ${isCollapsed ? 'justify-center' : ''}`
            }
            title={isCollapsed ? 'Saklı Kart Aylık' : ''}
          >
            <Calendar className="h-4 w-4" />
            {!isCollapsed && <span className="ml-3">Saklı Kart Aylık</span>}
          </NavLink>

          {/* Kullanıcı Yönetimi */}
          {!isCollapsed && (
            <div className="px-4 mt-4 mb-1 text-xs font-medium text-blue-300 uppercase tracking-wide flex items-center">
              Kullanıcı Yönetimi
              {!isFraudFeaturesEnabled() && (
                <span className="ml-2 text-xs bg-yellow-600 text-yellow-100 px-2 py-0.5 rounded-full">
                  Faz 3
                </span>
              )}
            </div>
          )}
          
          {isFraudFeaturesEnabled() ? (
            <>
              <NavLink 
                to="/admin/users" 
                className={({ isActive }) => 
                  `flex items-center px-4 py-1.5 text-sm transition-colors ${isActive ? 'bg-blue-900' : 'hover:bg-blue-700'} ${isCollapsed ? 'justify-center' : ''}`
                }
                title={isCollapsed ? 'Admin Kullanıcıları' : ''}
              >
                <Users className="h-4 w-4" />
                {!isCollapsed && <span className="ml-3">Admin Kullanıcıları</span>}
              </NavLink>
              <NavLink 
                to="/admin/roles" 
                className={({ isActive }) => 
                  `flex items-center px-4 py-1.5 text-sm transition-colors ${isActive ? 'bg-blue-900' : 'hover:bg-blue-700'} ${isCollapsed ? 'justify-center' : ''}`
                }
                title={isCollapsed ? 'Rol Yönetimi' : ''}
              >
                <Shield className="h-4 w-4" />
                {!isCollapsed && <span className="ml-3">Rol Yönetimi</span>}
              </NavLink>
            </>
          ) : (
            <>
              <div
                className={`flex items-center px-4 py-1.5 text-sm text-gray-400 cursor-not-allowed ${isCollapsed ? 'justify-center' : ''}`}
                title={isCollapsed ? 'Admin Kullanıcıları (Faz 3)' : ''}
              >
                <Users className="h-4 w-4" />
                {!isCollapsed && (
                  <span className="ml-3 flex items-center">
                    Admin Kullanıcıları
                    <Lock className="h-3 w-3 ml-2" />
                  </span>
                )}
              </div>
              <div
                className={`flex items-center px-4 py-1.5 text-sm text-gray-400 cursor-not-allowed ${isCollapsed ? 'justify-center' : ''}`}
                title={isCollapsed ? 'Rol Yönetimi (Faz 3)' : ''}
              >
                <Shield className="h-4 w-4" />
                {!isCollapsed && (
                  <span className="ml-3 flex items-center">
                    Rol Yönetimi
                    <Lock className="h-3 w-3 ml-2" />
                  </span>
                )}
              </div>
            </>
          )}
          
          <NavLink 
            to="/admin/merchant-users" 
            className={({ isActive }) => 
              `flex items-center px-4 py-1.5 text-sm transition-colors ${isActive ? 'bg-blue-900' : 'hover:bg-blue-700'} ${isCollapsed ? 'justify-center' : ''}`
            }
            title={isCollapsed ? 'Üye İşyerleri' : ''}
          >
            <Building2 className="h-4 w-4" />
            {!isCollapsed && <span className="ml-3">Üye İşyerleri</span>}
          </NavLink>
          <NavLink 
            to="/admin/audit-logs" 
            className={({ isActive }) => 
              `flex items-center px-4 py-1.5 text-sm transition-colors ${isActive ? 'bg-blue-900' : 'hover:bg-blue-700'} ${isCollapsed ? 'justify-center' : ''}`
            }
            title={isCollapsed ? 'Denetim Logları' : ''}
          >
            <FileText className="h-4 w-4" />
            {!isCollapsed && <span className="ml-3">Denetim Logları</span>}
          </NavLink>

          {/* Sistem Yönetimi */}
          {!isCollapsed && (
            <div className="px-4 mt-4 mb-1 text-xs font-medium text-blue-300 uppercase tracking-wide">
              Sistem
            </div>
          )}
          <NavLink 
            to="/admin/communication-templates" 
            className={({ isActive }) => 
              `flex items-center px-4 py-1.5 text-sm transition-colors ${isActive ? 'bg-blue-900' : 'hover:bg-blue-700'} ${isCollapsed ? 'justify-center' : ''}`
            }
            title={isCollapsed ? 'İletişim Senaryoları' : ''}
          >
            <Mail className="h-4 w-4" />
            {!isCollapsed && <span className="ml-3">İletişim Senaryoları</span>}
          </NavLink>
          <NavLink 
            to="/admin/pos-error-management" 
            className={({ isActive }) => 
              `flex items-center px-4 py-1.5 text-sm transition-colors ${isActive ? 'bg-blue-900' : 'hover:bg-blue-700'} ${isCollapsed ? 'justify-center' : ''}`
            }
            title={isCollapsed ? 'POS Hata Yönetimi' : ''}
          >
            <AlertTriangle className="h-4 w-4" />
            {!isCollapsed && <span className="ml-3">POS Hata Yönetimi</span>}
          </NavLink>

          {/* Güvenlik & Fraud */}
          {!isCollapsed && (
            <div className="px-4 mt-4 mb-1 text-xs font-medium text-blue-300 uppercase tracking-wide flex items-center">
              Güvenlik & Fraud
              {!isFraudFeaturesEnabled() && (
                <span className="ml-2 text-xs bg-yellow-600 text-yellow-100 px-2 py-0.5 rounded-full">
                  Yakında
                </span>
              )}
            </div>
          )}
          
          {isFraudFeaturesEnabled() ? (
            <>
              <NavLink
                  to="/admin/parameter-definitions"
                  className={({ isActive }) =>
                      `flex items-center px-4 py-1.5 text-sm transition-colors ${isActive ? 'bg-blue-900' : 'hover:bg-blue-700'} ${isCollapsed ? 'justify-center' : ''}`
                  }
                  title={isCollapsed ? 'Parametre Tanımları' : ''}
              >
                <Settings className="h-4 w-4" />
                {!isCollapsed && <span className="ml-3">Parametre Tanımları</span>}
              </NavLink>
              <NavLink
                  to="/admin/rule-builder"
                  className={({ isActive }) =>
                      `flex items-center px-4 py-1.5 text-sm transition-colors ${isActive ? 'bg-blue-900' : 'hover:bg-blue-700'} ${isCollapsed ? 'justify-center' : ''}`
                  }
                  title={isCollapsed ? 'Kurallar' : ''}
              >
                <Zap className="h-4 w-4" />
                {!isCollapsed && <span className="ml-3">Kurallar</span>}
              </NavLink>
              <NavLink
                  to="/admin/rule-templates"
                  className={({ isActive }) =>
                      `flex items-center px-4 py-1.5 text-sm transition-colors ${isActive ? 'bg-blue-900' : 'hover:bg-blue-700'} ${isCollapsed ? 'justify-center' : ''}`
                  }
                  title={isCollapsed ? 'Kural Şablonları' : ''}
              >
                <Star className="h-4 w-4" />
                {!isCollapsed && <span className="ml-3">Kural Şablonları</span>}
              </NavLink>
            </>
          ) : (
            <>
              <div
                className={`flex items-center px-4 py-1.5 text-sm text-gray-400 cursor-not-allowed ${isCollapsed ? 'justify-center' : ''}`}
                title={isCollapsed ? 'Parametre Tanımları (Yakında)' : ''}
              >
                <Settings className="h-4 w-4" />
                {!isCollapsed && (
                  <span className="ml-3 flex items-center">
                    Parametre Tanımları
                    <Lock className="h-3 w-3 ml-2" />
                  </span>
                )}
              </div>
              <div
                className={`flex items-center px-4 py-1.5 text-sm text-gray-400 cursor-not-allowed ${isCollapsed ? 'justify-center' : ''}`}
                title={isCollapsed ? 'Kurallar (Yakında)' : ''}
              >
                <Zap className="h-4 w-4" />
                {!isCollapsed && (
                  <span className="ml-3 flex items-center">
                    Kurallar
                    <Lock className="h-3 w-3 ml-2" />
                  </span>
                )}
              </div>
              <div
                className={`flex items-center px-4 py-1.5 text-sm text-gray-400 cursor-not-allowed ${isCollapsed ? 'justify-center' : ''}`}
                title={isCollapsed ? 'Kural Şablonları (Yakında)' : ''}
              >
                <Star className="h-4 w-4" />
                {!isCollapsed && (
                  <span className="ml-3 flex items-center">
                    Kural Şablonları
                    <Lock className="h-3 w-3 ml-2" />
                  </span>
                )}
              </div>
            </>
          )}

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
}