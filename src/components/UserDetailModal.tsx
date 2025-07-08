import { useState } from 'react';
import { User, Role } from '../types';
import { X, User as UserIcon, Building2, Shield, Calendar, Eye, Save, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

interface UserDetailModalProps {
  user: User;
  roles: Role[];
  isOpen: boolean;
  onClose: () => void;
  onRoleUpdate: (userId: string, roleId: string) => Promise<void>;
}

export default function UserDetailModal({ 
  user, 
  roles, 
  isOpen, 
  onClose, 
  onRoleUpdate 
}: UserDetailModalProps) {
  const [selectedRoleId, setSelectedRoleId] = useState(user.roleId);
  const [loading, setLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  if (!isOpen) return null;

  const currentRole = roles.find(r => r.id === user.roleId);
  const selectedRole = roles.find(r => r.id === selectedRoleId);
  const hasRoleChanged = selectedRoleId !== user.roleId;
  const isMerchantUser = user.userType === 'merchant';

  const handleRoleUpdate = async () => {
    if (isMerchantUser) {
      toast.error('Merchant kullanıcılarının rolleri değiştirilemez');
      return;
    }

    if (!hasRoleChanged) {
      toast.error('Lütfen farklı bir rol seçin');
      return;
    }

    setLoading(true);
    try {
      await onRoleUpdate(user.id, selectedRoleId);
      setShowConfirmation(false);
      onClose();
    } catch (error) {
      // Error handled in parent component
    } finally {
      setLoading(false);
    }
  };

  const getUserTypeBadge = (userType: string) => {
    const colors = {
      admin: 'bg-blue-100 text-blue-800 border border-blue-200',
      merchant: 'bg-green-100 text-green-800 border border-green-200',
    };
    const labels = {
      admin: 'Admin Kullanıcı',
      merchant: 'Merchant Kullanıcı',
    };
    return (
      <span className={`px-3 py-1 text-sm font-medium rounded-full ${colors[userType as keyof typeof colors]}`}>
        {labels[userType as keyof typeof labels]}
      </span>
    );
  };

  const getStatusBadge = (isActive: boolean) => {
    return (
      <span className={`px-3 py-1 text-sm font-medium rounded-full ${
        isActive 
          ? 'bg-green-100 text-green-800 border border-green-200' 
          : 'bg-red-100 text-red-800 border border-red-200'
      }`}>
        {isActive ? 'Aktif' : 'Pasif'}
      </span>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Kullanıcı Detayları</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* User Info */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                <UserIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  {user.firstName} {user.lastName}
                </h3>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Shield className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">Kullanıcı Tipi:</span>
                </div>
                {getUserTypeBadge(user.userType)}
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Eye className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">Durum:</span>
                </div>
                {getStatusBadge(user.isActive)}
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">Kayıt Tarihi:</span>
                </div>
                <p className="text-sm text-gray-900">
                  {new Date(user.createdAt).toLocaleDateString('tr-TR')}
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">Son Giriş:</span>
                </div>
                <p className="text-sm text-gray-900">
                  {user.lastLoginAt 
                    ? new Date(user.lastLoginAt).toLocaleDateString('tr-TR')
                    : 'Hiç giriş yapmamış'
                  }
                </p>
              </div>
            </div>
          </div>

          {/* Merchant Info */}
          {user.merchant && (
            <div className="bg-green-50 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-3">
                <Building2 className="w-5 h-5 text-green-600" />
                <h4 className="text-lg font-medium text-gray-900">Merchant Bilgileri</h4>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Merchant Adı:</p>
                  <p className="font-medium text-gray-900">{user.merchant.merchantName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Merchant No:</p>
                  <p className="font-medium text-gray-900">{user.merchant.merchantNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Ünvan:</p>
                  <p className="font-medium text-gray-900">{user.merchant.title}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Tip:</p>
                  <span className={`px-2 py-1 text-xs font-medium rounded ${
                    user.merchant.merchantType === 'SME' 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'bg-purple-100 text-purple-800'
                  }`}>
                    {user.merchant.merchantType}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Current Role */}
          <div className="bg-yellow-50 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-3">
              <Shield className="w-5 h-5 text-yellow-600" />
              <h4 className="text-lg font-medium text-gray-900">Mevcut Rol</h4>
            </div>
            
            <div className="space-y-2">
              <h5 className="font-medium text-gray-900">{currentRole?.name}</h5>
              <p className="text-sm text-gray-600">{currentRole?.description}</p>
              
              {currentRole?.isSystemRole && (
                <div className="flex items-center space-x-2 text-amber-600">
                  <AlertCircle className="w-4 h-4" />
                  <span className="text-sm">Bu bir sistem rolüdür</span>
                </div>
              )}
              
              {isMerchantUser && (
                <div className="flex items-center space-x-2 text-blue-600">
                  <AlertCircle className="w-4 h-4" />
                  <span className="text-sm">Merchant kullanıcı rolleri değiştirilemez</span>
                </div>
              )}
              
              <div className="mt-3">
                <p className="text-sm font-medium text-gray-700 mb-2">Yetkiler:</p>
                <div className="flex flex-wrap gap-1">
                  {currentRole?.permissions.slice(0, 5).map(permission => (
                    <span 
                      key={permission.id}
                      className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded"
                    >
                      {permission.displayName}
                    </span>
                  ))}
                  {(currentRole?.permissions.length || 0) > 5 && (
                    <span className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                      +{(currentRole?.permissions.length || 0) - 5} daha
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Role Change */}
          <div className="border border-gray-200 rounded-lg p-4">
            <h4 className="text-lg font-medium text-gray-900 mb-4">Rol Değiştir</h4>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Yeni Rol Seçin
                </label>
                <select
                  value={selectedRoleId}
                  onChange={(e) => setSelectedRoleId(e.target.value)}
                  disabled={isMerchantUser}
                  className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    isMerchantUser ? 'bg-gray-100 cursor-not-allowed' : ''
                  }`}
                >
                  {roles.map(role => (
                    <option key={role.id} value={role.id}>
                      {role.name} {role.isSystemRole ? '(Sistem Rolü)' : ''}
                    </option>
                  ))}
                </select>
              </div>

              {selectedRole && selectedRoleId !== user.roleId && (
                <div className="bg-blue-50 rounded-lg p-3">
                  <h5 className="font-medium text-blue-900">{selectedRole.name}</h5>
                  <p className="text-sm text-blue-700">{selectedRole.description}</p>
                  
                  <div className="mt-2">
                    <p className="text-sm font-medium text-blue-800 mb-1">Yeni Yetkiler:</p>
                    <div className="flex flex-wrap gap-1">
                      {selectedRole.permissions.slice(0, 5).map(permission => (
                        <span 
                          key={permission.id}
                          className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded"
                        >
                          {permission.displayName}
                        </span>
                      ))}
                      {selectedRole.permissions.length > 5 && (
                        <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                          +{selectedRole.permissions.length - 5} daha
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {hasRoleChanged && !isMerchantUser && (
                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowConfirmation(true)}
                    disabled={loading}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {loading ? 'Güncelleniyor...' : 'Rolü Güncelle'}
                  </button>
                  
                  <button
                    onClick={() => setSelectedRoleId(user.roleId)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    İptal
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Confirmation Modal */}
        {showConfirmation && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 max-w-md mx-4">
              <div className="flex items-center space-x-3 mb-4">
                <div className="flex-shrink-0">
                  <AlertCircle className="h-6 w-6 text-amber-600" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Rol Değişikliğini Onayla</h3>
                  <p className="text-sm text-gray-500">
                    {user.firstName} {user.lastName} kullanıcısının rolü 
                    "{currentRole?.name}" den "{selectedRole?.name}" olarak değiştirilecek.
                  </p>
                </div>
              </div>

              <div className="flex space-x-3 justify-end">
                <button
                  onClick={() => setShowConfirmation(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  İptal
                </button>
                <button
                  onClick={handleRoleUpdate}
                  disabled={loading}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                >
                  {loading ? 'Güncelleniyor...' : 'Onayla'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 