import { useState, useEffect } from 'react';
import { AuditLog } from '../../types';
import { userService } from '../../services/userService';
import { FileText, Calendar, User, Search, Filter } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AuditLogs() {
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterModule, setFilterModule] = useState('all');
  const [filterAction, setFilterAction] = useState('all');

  useEffect(() => {
    loadAuditLogs();
  }, []);

  const loadAuditLogs = async () => {
    setLoading(true);
    try {
      const logsData = await userService.getAuditLogs(100); // Son 100 log
      setAuditLogs(logsData);
    } catch (error) {
      toast.error('Denetim logları yüklenirken hata oluştu');
      console.error('Error loading audit logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const getActionDisplayName = (action: string) => {
    const actionNames: Record<string, string> = {
      'role_created': 'Rol Oluşturuldu',
      'role_updated': 'Rol Güncellendi',
      'role_deleted': 'Rol Silindi',
      'user_created': 'Kullanıcı Oluşturuldu',
      'user_updated': 'Kullanıcı Güncellendi',
      'user_deleted': 'Kullanıcı Silindi',
      'role_assigned': 'Rol Atandı',
      'permission_granted': 'Yetki Verildi',
      'permission_revoked': 'Yetki Alındı',
    };
    return actionNames[action] || action;
  };

  const getModuleDisplayName = (module: string) => {
    const moduleNames: Record<string, string> = {
      'users': 'Kullanıcı Yönetimi',
      'roles': 'Rol Yönetimi',
      'permissions': 'Yetki Yönetimi',
      'wallet-settlement': 'Cüzdan Hakediş',
      'stored-card': 'Saklı Kart',
      'communication': 'İletişim',
    };
    return moduleNames[module] || module;
  };

  const getActionBadgeColor = (action: string) => {
    if (action.includes('created')) return 'bg-green-100 text-green-800';
    if (action.includes('updated')) return 'bg-yellow-100 text-yellow-800';
    if (action.includes('deleted')) return 'bg-red-100 text-red-800';
    if (action.includes('assigned') || action.includes('granted')) return 'bg-blue-100 text-blue-800';
    if (action.includes('revoked')) return 'bg-purple-100 text-purple-800';
    return 'bg-gray-100 text-gray-800';
  };

  const filteredLogs = auditLogs.filter(log => {
    const matchesSearch = searchTerm === '' || 
      log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.userId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (log.targetUserId && log.targetUserId.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesModule = filterModule === 'all' || log.module === filterModule;
    const matchesAction = filterAction === 'all' || log.action === filterAction;
    
    return matchesSearch && matchesModule && matchesAction;
  });

  const uniqueModules = [...new Set(auditLogs.map(log => log.module))];
  const uniqueActions = [...new Set(auditLogs.map(log => log.action))];

  const getLogStats = () => {
    const today = new Date();
    const todayLogs = auditLogs.filter(log => {
      const logDate = new Date(log.timestamp);
      return logDate.toDateString() === today.toDateString();
    });

    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const weekLogs = auditLogs.filter(log => {
      const logDate = new Date(log.timestamp);
      return logDate >= weekAgo;
    });

    return {
      total: auditLogs.length,
      today: todayLogs.length,
      thisWeek: weekLogs.length,
    };
  };

  const stats = getLogStats();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Denetim Logları</h1>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <Filter className="w-4 h-4 mr-2" />
            Filtreler
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex items-center space-x-4 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Kullanıcı ID, hedef kullanıcı ID veya detaylarda ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-200">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Modül
              </label>
              <select
                value={filterModule}
                onChange={(e) => setFilterModule(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">Tüm Modüller</option>
                {uniqueModules.map(module => (
                  <option key={module} value={module}>
                    {getModuleDisplayName(module)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                İşlem Tipi
              </label>
              <select
                value={filterAction}
                onChange={(e) => setFilterAction(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">Tüm İşlemler</option>
                {uniqueActions.map(action => (
                  <option key={action} value={action}>
                    {getActionDisplayName(action)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
              <FileText className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Toplam Log</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              <Calendar className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Bugünkü İşlemler</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.today}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 text-purple-600">
              <User className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Bu Hafta</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.thisWeek}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Audit Logs Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tarih/Saat
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Kullanıcı
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    İşlem
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Modül
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Detaylar
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    IP Adresi
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredLogs.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center">
                        <FileText className="h-12 w-12 text-gray-400 mb-4" />
                        <p className="text-lg font-medium text-gray-500">Log bulunamadı</p>
                        <p className="text-gray-400">Arama kriterlerinizi değiştirmeyi deneyin</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div>
                          <div className="font-medium">
                            {new Date(log.timestamp).toLocaleDateString('tr-TR')}
                          </div>
                          <div className="text-gray-500">
                            {new Date(log.timestamp).toLocaleTimeString('tr-TR')}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div>
                          <div className="font-medium">{log.userId}</div>
                          {log.targetUserId && (
                            <div className="text-gray-500 text-xs">
                              Hedef: {log.targetUserId}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getActionBadgeColor(log.action)}`}>
                          {getActionDisplayName(log.action)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {getModuleDisplayName(log.module)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        <div className="max-w-xs">
                          <div className="font-medium">{log.details}</div>
                          {log.oldValue && log.newValue && (
                            <div className="mt-1 text-xs text-gray-500">
                              <div className="flex space-x-2">
                                <span className="bg-red-50 text-red-700 px-2 py-1 rounded">
                                  Eski: {typeof log.oldValue === 'object' ? JSON.stringify(log.oldValue) : log.oldValue}
                                </span>
                                <span className="bg-green-50 text-green-700 px-2 py-1 rounded">
                                  Yeni: {typeof log.newValue === 'object' ? JSON.stringify(log.newValue) : log.newValue}
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {log.ipAddress}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Summary */}
      <div className="bg-gray-50 rounded-lg p-4">
        <p className="text-sm text-gray-600">
          Toplam {auditLogs.length} log kaydı, {filteredLogs.length} tanesi gösteriliyor. 
          Loglar tarih sırasına göre en yeniden en eskiye doğru sıralanmıştır.
        </p>
      </div>
    </div>
  );
} 