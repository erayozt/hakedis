import { useState, useEffect } from 'react';
import { Role, Permission, RoleFormData } from '../../types';
import { userService } from '../../services/userService';
import { Plus, Edit, Trash, Shield, AlertCircle, Save, X } from 'lucide-react';
import PermissionMatrix from '../../components/PermissionMatrix';
import toast from 'react-hot-toast';

export default function RoleManagement() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);
  const [showRoleForm, setShowRoleForm] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteTargetRole, setDeleteTargetRole] = useState<Role | null>(null);

  const [formData, setFormData] = useState<RoleFormData>({
    name: '',
    description: '',
    permissions: [],
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [rolesData, permissionsData] = await Promise.all([
        userService.getRoles(),
        userService.getPermissions(),
      ]);
      setRoles(rolesData);
      setPermissions(permissionsData);
    } catch (error) {
      toast.error('Veriler yüklenirken hata oluştu');
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRole = () => {
    setEditingRole(null);
    setFormData({
      name: '',
      description: '',
      permissions: [],
    });
    setShowRoleForm(true);
  };

  const handleEditRole = (role: Role) => {
    if (role.isSystemRole) {
      toast.error('Sistem rolleri düzenlenemez');
      return;
    }
    
    if (role.name.includes('Merchant')) {
      toast.error('Merchant rolleri düzenlenemez');
      return;
    }
    
    setEditingRole(role);
    setFormData({
      name: role.name,
      description: role.description,
      permissions: role.permissions.map(p => p.id),
    });
    setShowRoleForm(true);
  };

  const handleDeleteRole = (role: Role) => {
    if (role.isSystemRole) {
      toast.error('Sistem rolleri silinemez');
      return;
    }
    
    if (role.name.includes('Merchant')) {
      toast.error('Merchant rolleri silinemez');
      return;
    }
    
    setDeleteTargetRole(role);
    setShowDeleteConfirm(true);
  };

  const confirmDeleteRole = async () => {
    if (!deleteTargetRole) return;

    try {
      await userService.deleteRole(deleteTargetRole.id);
      toast.success('Rol başarıyla silindi');
      loadData();
      setShowDeleteConfirm(false);
      setDeleteTargetRole(null);
    } catch (error: any) {
      toast.error(error.message || 'Rol silinirken hata oluştu');
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error('Rol adı zorunludur');
      return;
    }
    
    if (!formData.description.trim()) {
      toast.error('Rol açıklaması zorunludur');
      return;
    }
    
    if (formData.permissions.length === 0) {
      toast.error('En az bir yetki seçmelisiniz');
      return;
    }

    try {
      if (editingRole) {
        await userService.updateRole(editingRole.id, formData);
        toast.success('Rol başarıyla güncellendi');
      } else {
        await userService.createRole(formData);
        toast.success('Rol başarıyla oluşturuldu');
      }
      
      loadData();
      setShowRoleForm(false);
      setEditingRole(null);
    } catch (error: any) {
      toast.error(error.message || 'Rol işlemi sırasında hata oluştu');
    }
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePermissionChange = (permissionIds: string[]) => {
    setFormData(prev => ({
      ...prev,
      permissions: permissionIds,
    }));
  };

  const getRoleStats = () => {
    const systemRoles = roles.filter(r => r.isSystemRole).length;
    const customRoles = roles.filter(r => !r.isSystemRole).length;
    return { systemRoles, customRoles };
  };

  const { systemRoles, customRoles } = getRoleStats();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Rol Yönetimi</h1>
        <button
          onClick={handleCreateRole}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Yeni Rol Oluştur
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
              <Shield className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Toplam Rol</p>
              <p className="text-2xl font-semibold text-gray-900">{roles.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              <Shield className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Sistem Rolleri</p>
              <p className="text-2xl font-semibold text-gray-900">{systemRoles}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 text-purple-600">
              <Shield className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Özel Roller</p>
              <p className="text-2xl font-semibold text-gray-900">{customRoles}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Roles Table */}
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
                    Rol Adı
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Açıklama
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Yetki Sayısı
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tip
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Oluşturma Tarihi
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    İşlemler
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {roles.map((role) => (
                  <tr key={role.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{role.name}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-500 max-w-xs truncate">
                        {role.description}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {role.permissions.length}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        role.isSystemRole 
                          ? 'bg-yellow-100 text-yellow-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {role.isSystemRole ? 'Sistem Rolü' : 'Özel Rol'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(role.createdAt).toLocaleDateString('tr-TR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => handleEditRole(role)}
                          disabled={role.isSystemRole || role.name.includes('Merchant')}
                          className={`p-1 ${
                            role.isSystemRole || role.name.includes('Merchant')
                              ? 'text-gray-300 cursor-not-allowed' 
                              : 'text-blue-600 hover:text-blue-900'
                          }`}
                          title={
                            role.isSystemRole 
                              ? 'Sistem rolü düzenlenemez' 
                              : role.name.includes('Merchant')
                              ? 'Merchant rolü düzenlenemez'
                              : 'Düzenle'
                          }
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteRole(role)}
                          disabled={role.isSystemRole || role.name.includes('Merchant')}
                          className={`p-1 ${
                            role.isSystemRole || role.name.includes('Merchant')
                              ? 'text-gray-300 cursor-not-allowed' 
                              : 'text-red-600 hover:text-red-900'
                          }`}
                          title={
                            role.isSystemRole 
                              ? 'Sistem rolü silinemez' 
                              : role.name.includes('Merchant')
                              ? 'Merchant rolü silinemez'
                              : 'Sil'
                          }
                        >
                          <Trash className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Role Form Modal */}
      {showRoleForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                {editingRole ? 'Rol Düzenle' : 'Yeni Rol Oluştur'}
              </h2>
              <button
                onClick={() => setShowRoleForm(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rol Adı *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Örn: Finans Uzmanı"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Açıklama *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleFormChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Rolün açıklaması..."
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-4">
                  Yetkiler *
                </label>
                <PermissionMatrix
                  permissions={permissions}
                  selectedPermissions={formData.permissions}
                  onChange={handlePermissionChange}
                />
              </div>

              <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowRoleForm(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {editingRole ? 'Güncelle' : 'Oluştur'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && deleteTargetRole && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md mx-4">
            <div className="flex items-center space-x-3 mb-4">
              <div className="flex-shrink-0">
                <AlertCircle className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">Rol Sil</h3>
                <p className="text-sm text-gray-500">
                  "{deleteTargetRole.name}" rolünü silmek istediğinizden emin misiniz? 
                  Bu işlem geri alınamaz.
                </p>
              </div>
            </div>

            <div className="flex space-x-3 justify-end">
              <button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setDeleteTargetRole(null);
                }}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                İptal
              </button>
              <button
                onClick={confirmDeleteRole}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Sil
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 