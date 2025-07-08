import { useState, useEffect } from 'react';
import { User, Role, UserFilters } from '../../types';
import { userService } from '../../services/userService';
import { Search, Filter, Edit, Eye, UserPlus, AlertCircle } from 'lucide-react';
import UserDetailModal from '../../components/UserDetailModal';
import toast from 'react-hot-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";

type TabType = 'admins' | 'allLdapUsers';

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [allLdapUsers, setAllLdapUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('admins');

  const [filters, setFilters] = useState<UserFilters>({
    userType: 'admin', // Sadece admin kullanıcıları göster
    isActive: 'all',
    roleId: 'all',
    search: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (activeTab === 'admins') {
      loadUsers();
    } else {
      loadAllLdapUsers();
    }
  }, [filters, activeTab]);

  const loadData = async () => {
    try {
      const [rolesData] = await Promise.all([
        userService.getRoles(),
      ]);
      setRoles(rolesData);
    } catch (error) {
      toast.error('Veriler yüklenirken hata oluştu');
      console.error('Error loading data:', error);
    }
  };

  const loadUsers = async () => {
    setLoading(true);
    try {
      const usersData = await userService.getUsers(filters);
      setUsers(usersData);
    } catch (error) {
      toast.error('Kullanıcılar yüklenirken hata oluştu');
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadAllLdapUsers = async () => {
    setLoading(true);
    try {
      const ldapUsersData = await userService.getAllLdapUsers({ search: filters.search });
      setAllLdapUsers(ldapUsersData);
    } catch (error) {
      toast.error('Tüm LDAP kullanıcıları yüklenirken hata oluştu');
      console.error('Error loading LDAP users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key: keyof UserFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFilters(prev => ({
      ...prev,
      search: value,
    }));
  };

  const handleUserClick = (user: User) => {
    setSelectedUser(user);
    setShowUserModal(true);
  };

  const handleDeactivateUser = async (userId: string) => {
    try {
      await userService.deactivateUser(userId);
      toast.success('Kullanıcı başarıyla pasife alındı.');
      if (activeTab === 'admins') {
        loadUsers();
      } else {
        loadAllLdapUsers();
      }
    } catch (error) {
      toast.error('Kullanıcı pasife alınırken bir hata oluştu.');
    }
  };
  
  const handleRequestPermission = (user: User) => {
    toast.success(`${user.name} için yetki talebi oluşturuldu.`);
    toast.loading('Onay için SuperAdmin\'e (Mustafa Can Geçginer) bildirim gönderiliyor...', { duration: 4000 });
    setTimeout(() => {
      toast.success(`${user.name} kullanıcısına yönergeleri içeren bir e-posta gönderildi.`, {
        duration: 5000,
      });
    }, 1000);
  };

  const handleRoleUpdate = async (userId: string, roleId: string) => {
    try {
      const user = users.find(u => u.id === userId);
      if (user?.userType === 'merchant') {
        toast.error('Merchant kullanıcılarının rolleri değiştirilemez');
        return;
      }
      
      await userService.updateUserRole(userId, roleId);
      toast.success('Kullanıcı rolü başarıyla güncellendi');
      loadUsers(); // Refresh the list
    } catch (error: any) {
      toast.error(error.message || 'Rol güncellenirken hata oluştu');
    }
  };

  const getStatusBadge = (user: User) => {
    let isActive = user.isActive;
    let text = isActive ? 'Aktif' : 'Pasif';
    let className = isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';

    if(user.isManuallyDeactivated) {
      isActive = false;
      text = 'Kalıcı Pasif';
      className = 'bg-gray-200 text-gray-800';
    } else if (user.ldapDeactivated) {
      isActive = false;
      text = 'LDAP Pasif';
      className = 'bg-yellow-100 text-yellow-800';
    }

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${className}`}>
        {text}
      </span>
    );
  };

  const getRoleName = (roleId: string) => {
    const role = roles.find(r => r.id === roleId);
    return role?.name || 'Rol Bulunamadı';
  };

  const renderUsersTable = (userList: User[], isLdapList: boolean) => {
    return (
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
                    Kullanıcı
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rol
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Durum
                  </th>
                   {!isLdapList && (
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Son Giriş
                    </th>
                   )}
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    İşlemler
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {userList.map((user) => (
                  <tr key={user.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <img className="h-10 w-10 rounded-full" src={user.avatar} alt="" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{user.name}</div>
                          <div className="text-sm text-gray-500">{user.title}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{user.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {isLdapList ? (user.roleId ? getRoleName(user.roleId) : <span className="text-xs italic">Rol Atanmamış</span>) : getRoleName(user.roleId!)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(user)}
                    </td>
                    {!isLdapList && (
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleDateString('tr-TR') : 'Giriş Yapılmamış'}
                      </td>
                    )}
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {isLdapList ? (
                        !user.roleId && (
                           <button
                            onClick={() => handleRequestPermission(user)}
                            className="text-blue-600 hover:text-blue-900 flex items-center"
                          >
                             <UserPlus className="w-4 h-4 mr-1" /> Yetki Talep Et
                          </button>
                        )
                      ) : (
                        <div className="flex items-center justify-end space-x-4">
                           <button
                            onClick={() => handleUserClick(user)}
                            className="text-gray-600 hover:text-gray-900"
                            title="Detayları Görüntüle"
                          >
                            <Eye className="w-5 h-5" />
                          </button>
                          {!user.isManuallyDeactivated && (
                             <button
                              onClick={() => handleDeactivateUser(user.id)}
                              className="text-red-600 hover:text-red-900"
                              title="Kullanıcıyı Pasife Al"
                            >
                              <AlertCircle className="w-5 h-5" />
                            </button>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Kullanıcı Yönetimi</h1>
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
              placeholder="Email, ad, soyad ile ara..."
              value={filters.search || ''}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-200">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Durum
              </label>
              <select
                value={filters.isActive?.toString() || 'all'}
                onChange={(e) => handleFilterChange('isActive', e.target.value === 'all' ? 'all' : e.target.value === 'true')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">Tümü</option>
                <option value="true">Aktif</option>
                <option value="false">Pasif</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Rol
              </label>
              <select
                value={filters.roleId || 'all'}
                onChange={(e) => handleFilterChange('roleId', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                disabled={activeTab === 'allLdapUsers'}
              >
                <option value="all">Tümü</option>
                {roles.filter(role => !['merchant-admin', 'merchant-user'].includes(role.id)).map(role => (
                  <option key={role.id} value={role.id}>
                    {role.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>

      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as TabType)} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="admins">Admin Kullanıcıları</TabsTrigger>
          <TabsTrigger value="allLdapUsers">Tüm Şirket Çalışanları (LDAP)</TabsTrigger>
        </TabsList>
        <TabsContent value="admins">
          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-4">
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                  <UserPlus className="h-6 w-6" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Toplam Admin</p>
                  <p className="text-2xl font-semibold text-gray-900">{users.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-green-100 text-green-600">
                  <Eye className="h-6 w-6" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Aktif Admin</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {users.filter(u => u.isActive && !u.isManuallyDeactivated && !u.ldapDeactivated).length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-purple-100 text-purple-600">
                  <UserPlus className="h-6 w-6" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Admin Rolleri</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {roles.filter(r => !['merchant-admin', 'merchant-user'].includes(r.id)).length}
                  </p>
                </div>
              </div>
            </div>
          </div>
          {renderUsersTable(users, false)}
        </TabsContent>
        <TabsContent value="allLdapUsers">
          {renderUsersTable(allLdapUsers, true)}
        </TabsContent>
      </Tabs>

      {showUserModal && selectedUser && (
        <UserDetailModal
          user={selectedUser}
          roles={roles.filter(role => !['merchant-admin', 'merchant-user'].includes(role.id))}
          isOpen={showUserModal}
          onClose={() => {
            setShowUserModal(false);
            setSelectedUser(null);
          }}
          onRoleUpdate={handleRoleUpdate}
        />
      )}
    </div>
  );
} 