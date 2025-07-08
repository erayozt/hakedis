import { useState, useEffect } from 'react';
import { User, Role, Merchant } from '../../types';
import { userService } from '../../services/userService';
import { Search, Building2, Users, UserPlus, AlertCircle, Eye, ChevronRight, X, ArrowLeft, Filter, RotateCcw, Mail, MoreVertical, Power, Edit, Clock, Download } from 'lucide-react';
import UserDetailModal from '../../components/UserDetailModal';
import toast from 'react-hot-toast';
import { cn } from '../../utils/format';
import { exportMerchantUsersToExcel } from '../../utils/exportToExcel';

interface MerchantStats {
  merchant: Merchant;
  userCount: number;
  activeUserCount: number;
  users: User[];
}

// OTP Modal Component
interface OtpModalProps {
  isOpen: boolean;
  onClose: () => void;
  merchant: Merchant;
  onUpdateOtp: (otpType: 'none' | 'mail' | 'sms', durationInMinutes?: number) => void;
}

// Bulk OTP Modal Component
interface BulkOtpModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCount: number;
  onUpdateOtp: (otpType: 'none' | 'mail' | 'sms', durationInMinutes?: number) => void;
}

function BulkOtpModal({ isOpen, onClose, selectedCount, onUpdateOtp }: BulkOtpModalProps) {
  if (!isOpen) return null;

  const handleOtpChange = (otpType: 'none' | 'mail' | 'sms', durationInMinutes?: number) => {
    onUpdateOtp(otpType, durationInMinutes);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96 max-w-md mx-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">
            Toplu OTP Ayarları
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mb-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>{selectedCount}</strong> merchant seçildi. Tümüne aynı OTP ayarı uygulanacak.
          </p>
        </div>

        <div className="space-y-3">
          {/* Mail OTP */}
          <button
            onClick={() => handleOtpChange('mail')}
            className="w-full text-left p-3 rounded-lg border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors"
          >
            <div className="flex items-center">
              <Mail className="w-5 h-5 mr-3 text-blue-600" />
              <div>
                <div className="font-medium text-gray-900">Mail OTP</div>
                <div className="text-sm text-gray-500">Tüm seçili merchant'lara e-posta doğrulama</div>
              </div>
            </div>
          </button>

          {/* SMS OTP */}
          <button
            onClick={() => handleOtpChange('sms')}
            className="w-full text-left p-3 rounded-lg border-2 border-gray-200 hover:border-yellow-300 hover:bg-yellow-50 transition-colors"
          >
            <div className="flex items-center">
              <Users className="w-5 h-5 mr-3 text-yellow-600" />
              <div>
                <div className="font-medium text-gray-900">SMS OTP</div>
                <div className="text-sm text-gray-500">Tüm seçili merchant'lara SMS doğrulama</div>
              </div>
            </div>
          </button>

          {/* Kapat Seçenekleri */}
          <div className="border-t pt-3">
            <div className="text-sm font-medium text-gray-700 mb-2">OTP'yi Kapat</div>
            
            {/* Süreli Kapatma */}
            <div className="space-y-2">
              <div className="text-xs text-gray-500 mb-2">Geçici olarak kapat:</div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleOtpChange('none', 15)}
                  className="p-2 text-sm border border-gray-200 rounded hover:bg-gray-50 flex items-center justify-center"
                >
                  <Clock className="w-4 h-4 mr-1" />
                  15 dk
                </button>
                <button
                  onClick={() => handleOtpChange('none', 30)}
                  className="p-2 text-sm border border-gray-200 rounded hover:bg-gray-50 flex items-center justify-center"
                >
                  <Clock className="w-4 h-4 mr-1" />
                  30 dk
                </button>
                <button
                  onClick={() => handleOtpChange('none', 60)}
                  className="p-2 text-sm border border-gray-200 rounded hover:bg-gray-50 flex items-center justify-center"
                >
                  <Clock className="w-4 h-4 mr-1" />
                  1 saat
                </button>
                <button
                  onClick={() => handleOtpChange('none', 1440)}
                  className="p-2 text-sm border border-gray-200 rounded hover:bg-gray-50 flex items-center justify-center"
                >
                  <Clock className="w-4 h-4 mr-1" />
                  1 gün
                </button>
              </div>
            </div>

            {/* Kalıcı Kapatma */}
            <button
              onClick={() => handleOtpChange('none')}
              className="w-full mt-3 p-3 rounded-lg border-2 border-red-200 hover:border-red-300 hover:bg-red-50 transition-colors"
            >
              <div className="flex items-center justify-center">
                <Power className="w-5 h-5 mr-2 text-red-600" />
                <div className="font-medium text-red-900">Kalıcı Olarak Kapat</div>
              </div>
            </button>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            İptal
          </button>
        </div>
      </div>
    </div>
  );
}

function OtpModal({ isOpen, onClose, merchant, onUpdateOtp }: OtpModalProps) {
  if (!isOpen) return null;

  const handleOtpChange = (otpType: 'none' | 'mail' | 'sms', durationInMinutes?: number) => {
    onUpdateOtp(otpType, durationInMinutes);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96 max-w-md mx-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">
            OTP Ayarları - {merchant.merchantName}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3">
          {/* Mail OTP */}
          <button
            onClick={() => handleOtpChange('mail')}
            className={`w-full text-left p-3 rounded-lg border-2 transition-colors ${
              merchant.otpType === 'mail' 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center">
              <Mail className="w-5 h-5 mr-3 text-blue-600" />
              <div>
                <div className="font-medium text-gray-900">Mail OTP</div>
                <div className="text-sm text-gray-500">E-posta ile doğrulama</div>
              </div>
              {merchant.otpType === 'mail' && !merchant.otpTypeExpiresAt && (
                <div className="ml-auto">
                  <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">Aktif</span>
                </div>
              )}
            </div>
          </button>

          {/* SMS OTP */}
          <button
            onClick={() => handleOtpChange('sms')}
            className={`w-full text-left p-3 rounded-lg border-2 transition-colors ${
              merchant.otpType === 'sms' 
                ? 'border-yellow-500 bg-yellow-50' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center">
              <Users className="w-5 h-5 mr-3 text-yellow-600" />
              <div>
                <div className="font-medium text-gray-900">SMS OTP</div>
                <div className="text-sm text-gray-500">SMS ile doğrulama</div>
              </div>
              {merchant.otpType === 'sms' && !merchant.otpTypeExpiresAt && (
                <div className="ml-auto">
                  <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">Aktif</span>
                </div>
              )}
            </div>
          </button>

          {/* Kapat Seçenekleri */}
          <div className="border-t pt-3">
            <div className="text-sm font-medium text-gray-700 mb-2">OTP'yi Kapat</div>
            
            {/* Süreli Kapatma */}
            <div className="space-y-2">
              <div className="text-xs text-gray-500 mb-2">Geçici olarak kapat:</div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleOtpChange('none', 15)}
                  className="p-2 text-sm border border-gray-200 rounded hover:bg-gray-50 flex items-center justify-center"
                >
                  <Clock className="w-4 h-4 mr-1" />
                  15 dk
                </button>
                <button
                  onClick={() => handleOtpChange('none', 30)}
                  className="p-2 text-sm border border-gray-200 rounded hover:bg-gray-50 flex items-center justify-center"
                >
                  <Clock className="w-4 h-4 mr-1" />
                  30 dk
                </button>
                <button
                  onClick={() => handleOtpChange('none', 60)}
                  className="p-2 text-sm border border-gray-200 rounded hover:bg-gray-50 flex items-center justify-center"
                >
                  <Clock className="w-4 h-4 mr-1" />
                  1 saat
                </button>
                <button
                  onClick={() => handleOtpChange('none', 1440)}
                  className="p-2 text-sm border border-gray-200 rounded hover:bg-gray-50 flex items-center justify-center"
                >
                  <Clock className="w-4 h-4 mr-1" />
                  1 gün
                </button>
              </div>
            </div>

            {/* Kalıcı Kapatma */}
            <button
              onClick={() => handleOtpChange('none')}
              className="w-full mt-3 p-3 rounded-lg border-2 border-red-200 hover:border-red-300 hover:bg-red-50 transition-colors"
            >
              <div className="flex items-center justify-center">
                <Power className="w-5 h-5 mr-2 text-red-600" />
                <div className="font-medium text-red-900">Kalıcı Olarak Kapat</div>
              </div>
            </button>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            İptal
          </button>
        </div>
      </div>
    </div>
  );
}

interface EditUserModalProps {
  user: User;
  onClose: () => void;
  onSave: (userId: string, data: Partial<User>) => void;
}

function EditUserModal({ user, onClose, onSave }: EditUserModalProps) {
  const [formData, setFormData] = useState({
    firstName: user.firstName || '',
    lastName: user.lastName || '',
    email: user.email || '',
    tckn: user.tckn || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(user.id, formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Kullanıcıyı Düzenle</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Ad</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Soyad</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">TCKN</label>
              <input
                type="text"
                name="tckn"
                value={formData.tckn}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300"
            >
              İptal
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Kaydet
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function MerchantUserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMerchant, setSelectedMerchant] = useState<MerchantStats | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showDrawer, setShowDrawer] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [typeFilter, setTypeFilter] = useState<'all' | 'SME' | 'KA'>('all');
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [now, setNow] = useState(new Date());

  // Modal states
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [selectedMerchantForOtp, setSelectedMerchantForOtp] = useState<Merchant | null>(null);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  
  // Bulk selection states
  const [selectedMerchants, setSelectedMerchants] = useState<Set<string>>(new Set());
  const [showBulkOtpModal, setShowBulkOtpModal] = useState(false);
  


  const itemsPerPage = 20;

  useEffect(() => {
    loadData();
    const timer = setInterval(() => setNow(new Date()), 1000); // Saniyede bir zamanı güncelle
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpenDropdown(null);
        if (showDrawer) setShowDrawer(false);
        if (editingUser) setEditingUser(null);
      }
    };

    const handleClickOutside = (event: MouseEvent) => {
      // Dropdown menüsü dışında tıklanırsa kapat
      const target = event.target as HTMLElement;
      if (!target.closest('.relative.inline-block')) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener('keydown', handleEscapeKey);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
      document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showDrawer, editingUser]);

  const loadData = async () => {
    try {
      const [usersData, rolesData] = await Promise.all([
        userService.getUsers({ userType: 'merchant' }),
        userService.getRoles(),
      ]);
      setUsers(usersData);
      setRoles(rolesData.filter(r => ['merchant-admin', 'merchant-user'].includes(r.id)));
    } catch (error) {
      toast.error('Veriler yüklenirken hata oluştu');
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUserClick = (user: User) => {
    setSelectedUser(user);
    setShowUserModal(true);
  };

  const handleMerchantClick = (merchant: MerchantStats) => {
    setSelectedMerchant(merchant);
    setShowDrawer(true);
  };

  const handleRoleUpdate = async (userId: string, roleId: string) => {
    try {
      // Merchant kullanıcıları için rol değişikliği engellendi
      toast.error('Merchant kullanıcılarının rolleri değiştirilemez');
      return;
    } catch (error: any) {
      toast.error(error.message || 'Rol güncellenirken hata oluştu');
    }
  };

  // Bulk selection handlers
  const handleSelectMerchant = (merchantId: string) => {
    const newSelected = new Set(selectedMerchants);
    if (newSelected.has(merchantId)) {
      newSelected.delete(merchantId);
    } else {
      newSelected.add(merchantId);
    }
    setSelectedMerchants(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedMerchants.size === paginatedMerchants.length) {
      setSelectedMerchants(new Set());
    } else {
      setSelectedMerchants(new Set(paginatedMerchants.map(m => m.merchant.id)));
    }
  };

  const handleBulkExport = () => {
    if (selectedMerchants.size === 0) {
      toast.error('Lütfen önce merchant seçin');
      return;
    }

    const selectedMerchantIds = Array.from(selectedMerchants);
    
    // Seçilen merchant'ların kullanıcılarını filtrele
    const selectedUsers = users.filter(user => 
      user.merchant && selectedMerchantIds.includes(user.merchant.id)
    );
    
    // Seçilen merchant isimlerini al
    const selectedMerchantNames = selectedMerchantIds.map(id => {
      const merchant = users.find(u => u.merchant?.id === id)?.merchant;
      return merchant?.merchantName || 'Bilinmeyen Merchant';
    });

    if (selectedUsers.length === 0) {
      toast.error('Seçilen merchant\'larda kullanıcı bulunamadı');
      return;
    }

    try {
      exportMerchantUsersToExcel(selectedUsers, selectedMerchantNames);
      toast.success(`${selectedMerchants.size} merchant'ın ${selectedUsers.length} kullanıcısı Excel'e aktarıldı`);
    } catch (error: any) {
      console.error('Export error:', error);
      toast.error(`Excel export hatası: ${error.message || error.toString()}`);
    }
  };

  const handleBulkOtpUpdate = async (otpType: 'none' | 'mail' | 'sms', durationInMinutes?: number) => {
    if (selectedMerchants.size === 0) {
      toast.error('Lütfen önce merchant seçin');
      return;
    }

    const merchantIds = Array.from(selectedMerchants);
    const merchantNames = merchantIds.map(id => 
      users.find(u => u.merchant?.id === id)?.merchant?.merchantName || id
    );

    try {
      // Optimistic UI Update for all selected merchants
      const originalUsers = [...users];
      const now = new Date();
      const expiresAt = durationInMinutes ? new Date(now.getTime() + durationInMinutes * 60000).toISOString() : null;
      
      const newUsers = originalUsers.map(u => {
        if (u.merchant && selectedMerchants.has(u.merchant.id)) {
          return { ...u, merchant: { ...u.merchant, otpType: otpType, otpTypeExpiresAt: expiresAt } };
        }
        return u;
      });
      setUsers(newUsers);

      // Update all selected merchants
      const updatePromises = merchantIds.map(merchantId => 
        userService.setMerchantOtpType(merchantId, otpType, durationInMinutes)
      );

      await Promise.all(updatePromises);

      // Show success message
      const typeText = { 
        none: durationInMinutes ? 'Süreli olarak kapatıldı' : 'Kalıcı olarak kapatıldı', 
        mail: 'Mail OTP olarak ayarlandı', 
        sms: 'SMS OTP olarak ayarlandı' 
      };
      
      if (merchantIds.length === 1) {
        toast.success(`${merchantNames[0]} için OTP ayarı: ${typeText[otpType]}.`);
      } else {
        toast.success(`${merchantIds.length} merchant için OTP ayarı: ${typeText[otpType]}.`);
      }

      // Clear selection
      setSelectedMerchants(new Set());
      setShowBulkOtpModal(false);

    } catch (error) {
      console.error('Bulk OTP update error:', error);
      toast.error('OTP durumu güncellenirken bir hata oluştu.');
      // Revert changes on error
      setUsers(users);
    }
  };

  const handleSetOtpType = async (merchantId: string, otpType: 'none' | 'mail' | 'sms', durationInMinutes?: number) => {
    console.log('handleSetOtpType called:', { merchantId, otpType, durationInMinutes });
    
    const originalUsers = [...users];
    const merchantName = users.find(u => u.merchant?.id === merchantId)?.merchant?.merchantName || '';

    // Optimistic UI Update: Update the UI immediately
    const now = new Date();
    const expiresAt = durationInMinutes ? new Date(now.getTime() + durationInMinutes * 60000).toISOString() : null;
    
    const newUsers = originalUsers.map(u => {
      if (u.merchant?.id === merchantId) {
        return { ...u, merchant: { ...u.merchant, otpType: otpType, otpTypeExpiresAt: expiresAt } };
      }
      return u;
    });
    setUsers(newUsers);

    try {
      // Send the request to the service in the background
      const updatedMerchantData = await userService.setMerchantOtpType(merchantId, otpType, durationInMinutes);

      // Drawer'da açık olan merchant'ı da güncelle
      if (selectedMerchant && selectedMerchant.merchant.id === merchantId) {
        setSelectedMerchant(prev => ({
          ...prev!,
          merchant: updatedMerchantData,
          users: prev!.users.map(u => ({
            ...u,
            merchant: updatedMerchantData
          }))
        }));
      }

      // Verify the final state if needed, but for now, just show the success toast.
      if (otpType === 'none' && durationInMinutes && updatedMerchantData.otpTypeExpiresAt) {
          const expiresDate = new Date(updatedMerchantData.otpTypeExpiresAt);
          const formattedExpiresAt = expiresDate.toLocaleString('tr-TR', {
            day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
          });
          toast.success(`${merchantName} için OTP kapatıldı. ${formattedExpiresAt} tarihinde otomatik olarak aktif edilecektir.`);
      } else {
        const typeText = { none: 'Kalıcı olarak kapatıldı', mail: 'Mail OTP olarak ayarlandı', sms: 'SMS OTP olarak ayarlandı' };
        toast.success(`${merchantName} için OTP ayarı: ${typeText[otpType]}.`);
      }
    } catch (error) {
      console.error('OTP update error:', error);
      toast.error('OTP durumu güncellenirken bir hata oluştu.');
      setUsers(originalUsers); // Revert on error
      
      // Drawer'daki veriyi de geri al
      if (selectedMerchant && selectedMerchant.merchant.id === merchantId) {
        const originalMerchant = originalUsers.find(u => u.merchant?.id === merchantId)?.merchant;
        if (originalMerchant) {
          setSelectedMerchant(prev => ({
            ...prev!,
            merchant: originalMerchant,
            users: prev!.users.map(u => ({
              ...u,
              merchant: originalMerchant
            }))
          }));
        }
      }
    }
  };
  
  const handleUpdateUser = async (userId: string, data: Partial<User>) => {
    try {
      const updatedUser = await userService.updateMerchantUser(userId, data);
      
      // State'i güncelle
      setUsers(prevUsers => prevUsers.map(u => u.id === userId ? { ...u, ...updatedUser } : u));
      
      toast.success('Kullanıcı bilgileri başarıyla güncellendi.');
      setEditingUser(null); // Modalı kapat
    } catch (error) {
      toast.error('Kullanıcı güncellenirken bir hata oluştu.');
    }
  };

  const handleResetPassword = async (user: User) => {
    try {
      await userService.sendPasswordResetEmail(user.id);
      toast.success(`${user.name} için şifre sıfırlama linki gönderildi`);
    } catch (error) {
      toast.error('Şifre sıfırlama linki gönderilirken hata oluştu');
    }
    setOpenDropdown(null);
  };



  const getStatusBadge = (isActive: boolean) => {
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
        isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
      }`}>
        {isActive ? 'Aktif' : 'Pasif'}
      </span>
    );
  };

  const getRoleName = (roleId: string) => {
    const role = roles.find(r => r.id === roleId);
    return role?.name || 'Rol Bulunamadı';
  };

  const OtpStatusDisplay: React.FC<{ merchant: Merchant, now: Date, onExpire: () => void }> = ({ merchant, now, onExpire }) => {
    const { otpType, otpTypeExpiresAt } = merchant;
    
    useEffect(() => {
      if (otpType === 'none' && otpTypeExpiresAt) {
        const expires = new Date(otpTypeExpiresAt).getTime();
        const remaining = Math.round((expires - now.getTime()) / 1000);
        if (remaining <= 0) {
          onExpire();
        }
      }
    }, [now, otpType, otpTypeExpiresAt, onExpire]);

    if (otpType === 'none' && otpTypeExpiresAt) {
      const expires = new Date(otpTypeExpiresAt);
      const remaining = Math.round((expires.getTime() - now.getTime()) / 1000);

      if (remaining > 0) {
        const minutes = Math.floor(remaining / 60);
        const seconds = remaining % 60;
        const formattedExpiresAt = expires.toLocaleString('tr-TR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

        return (
          <span 
            className={cn("px-3 py-1 text-xs font-semibold rounded-full flex items-center justify-center bg-gray-200 text-gray-800")}
            title={`Bitiş zamanı: ${formattedExpiresAt}`}
          >
            <Clock className="w-3 h-3 mr-1.5" />
            <span>Süreli Pasif ({`${minutes}:${seconds.toString().padStart(2, '0')}`})</span>
          </span>
        );
      }
    }

    const statusConfig = {
      none: { text: 'Kapalı', className: 'bg-red-100 text-red-800', Icon: Power },
      mail: { text: 'Mail OTP', className: 'bg-blue-100 text-blue-800', Icon: Mail },
      sms: { text: 'SMS OTP', className: 'bg-yellow-100 text-yellow-800', Icon: Users } 
    };
    const config = statusConfig[otpType];
    return (
       <span className={cn("px-3 py-1 text-xs font-semibold rounded-full flex items-center justify-center", config.className)}>
        <config.Icon className="w-3 h-3 mr-1" />
        {config.text}
      </span>
    );
  }

  // Merchant'ları gruplama ve filtreleme
  const calculateMerchantStats = (): MerchantStats[] => {
    const merchantGroups = users.reduce((acc, user) => {
      if (user.merchant) {
        const merchantId = user.merchant.id;
        if (!acc[merchantId]) {
          acc[merchantId] = {
            merchant: user.merchant,
            userCount: 0,
            activeUserCount: 0,
            users: [],
          };
        } else {
          // Her zaman en güncel merchant nesnesini kullan
          acc[merchantId].merchant = user.merchant;
        }
        acc[merchantId].userCount++;
        acc[merchantId].users.push(user);
        if (user.isActive) {
          acc[merchantId].activeUserCount++;
        }
      }
      return acc;
    }, {} as Record<string, MerchantStats>);

    let merchantList = Object.values(merchantGroups);

    // Arama filtresi
    if (searchTerm) {
      merchantList = merchantList.filter(merchant =>
        merchant.merchant.merchantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        merchant.merchant.merchantNumber.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Durum filtresi
    if (statusFilter === 'active') {
      merchantList = merchantList.filter(merchant => merchant.activeUserCount > 0);
    } else if (statusFilter === 'inactive') {
      merchantList = merchantList.filter(merchant => merchant.activeUserCount === 0);
    }

    // Tip filtresi
    if (typeFilter !== 'all') {
      merchantList = merchantList.filter(merchant => merchant.merchant.merchantType === typeFilter);
    }

    return merchantList;
  };

  const merchantStats = calculateMerchantStats();
  const totalPages = Math.ceil(merchantStats.length / itemsPerPage);
  const paginatedMerchants = merchantStats.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalUsers = users.length;
  const activeUsers = users.filter(u => u.isActive).length;
  const totalMerchants = merchantStats.length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Merchant Kullanıcı Yönetimi</h1>
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
              placeholder="Merchant adı veya numarası ile ara..."
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
                Durum
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">Tümü</option>
                <option value="active">Aktif Kullanıcısı Olan</option>
                <option value="inactive">Aktif Kullanıcısı Olmayan</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Merchant Tipi
              </label>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value as any)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">Tümü</option>
                <option value="SME">SME</option>
                <option value="KA">KA</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
              <Building2 className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Toplam Merchant</p>
              <p className="text-2xl font-semibold text-gray-900">{totalMerchants}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              <Users className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Toplam Kullanıcı</p>
              <p className="text-2xl font-semibold text-gray-900">{totalUsers}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
              <UserPlus className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Aktif Kullanıcı</p>
              <p className="text-2xl font-semibold text-gray-900">{activeUsers}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 text-purple-600">
              <UserPlus className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Ort. Kullanıcı/Merchant</p>
              <p className="text-2xl font-semibold text-gray-900">
                {totalMerchants > 0 ? Math.round(totalUsers / totalMerchants) : 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Merchant Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-gray-900">Merchant Listesi</h3>
              <p className="text-sm text-gray-500 mt-1">
                {searchTerm || statusFilter !== 'all' || typeFilter !== 'all'
                  ? `${merchantStats.length} merchant bulundu`
                  : `Toplam ${merchantStats.length} merchant`
                }
                {selectedMerchants.size > 0 && (
                  <span className="ml-2 text-blue-600 font-medium">
                    • {selectedMerchants.size} seçildi
                  </span>
                )}
              </p>
            </div>
            
            {/* Bulk Actions */}
            {selectedMerchants.size > 0 && (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setShowBulkOtpModal(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
                >
                  <Power className="w-4 h-4 mr-2" />
                  Toplu OTP Ayarla ({selectedMerchants.size})
                </button>
                <button
                  onClick={handleBulkExport}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Excel'e Aktar ({selectedMerchants.size})
                </button>
                <button
                  onClick={() => setSelectedMerchants(new Set())}
                  className="px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : paginatedMerchants.length === 0 ? (
            <div className="flex flex-col items-center py-12">
              <AlertCircle className="h-12 w-12 text-gray-400 mb-4" />
              <p className="text-lg font-medium text-gray-500">Merchant bulunamadı</p>
              <p className="text-gray-400">Arama kriterlerinizi değiştirmeyi deneyin</p>
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedMerchants.size === paginatedMerchants.length && paginatedMerchants.length > 0}
                        onChange={handleSelectAll}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="ml-2">Merchant</span>
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Kullanıcı Sayısı
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    OTP Durumu
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    İşlemler
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedMerchants.map((m) => (
                  <tr key={m.merchant.id} className={`hover:bg-gray-50 ${selectedMerchants.has(m.merchant.id) ? 'bg-blue-50' : ''}`}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedMerchants.has(m.merchant.id)}
                          onChange={() => handleSelectMerchant(m.merchant.id)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <div className="ml-3 flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                          <Building2 className="w-5 h-5 text-gray-600"/>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{m.merchant.merchantName}</div>
                          <div className="text-sm text-gray-500">#{m.merchant.merchantNumber} - {m.merchant.merchantType}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{m.userCount} Kullanıcı</div>
                      <div className="text-sm text-gray-500">{m.activeUserCount} Aktif</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => {
                          setSelectedMerchantForOtp(m.merchant);
                          setShowOtpModal(true);
                        }}
                        className="w-40"
                      >
                        <OtpStatusDisplay merchant={m.merchant} now={now} onExpire={loadData} />
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                       <button
                        onClick={() => handleMerchantClick(m)}
                        className="text-blue-600 hover:text-blue-900 flex items-center justify-end w-full"
                      >
                        Kullanıcıları Yönet <ChevronRight className="w-4 h-4 ml-1"/>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500">
                {paginatedMerchants.length > 0 && (
                  <>
                    Sayfa {currentPage} / {totalPages} 
                    ({(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, merchantStats.length)} arası, 
                    toplam {merchantStats.length} merchant)
                  </>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Önceki
                </button>
                <span className="px-3 py-2 text-sm text-gray-600">
                  {currentPage} / {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Sonraki
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Drawer */}
      {showDrawer && (
        <div 
          className={cn(
            "fixed top-0 right-0 h-full bg-white shadow-lg z-30 transition-transform transform w-full md:w-1/2 lg:w-1/3",
            showDrawer ? "translate-x-0" : "translate-x-full"
          )}
        >
          {selectedMerchant && (
            <div className="h-full flex flex-col">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <button
                      onClick={() => setShowDrawer(false)}
                      className="mr-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900">
                        {selectedMerchant.merchant.merchantName}
                      </h2>
                      <p className="text-sm text-gray-500">
                        {selectedMerchant.merchant.merchantNumber} • {selectedMerchant.merchant.merchantType}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowDrawer(false)}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                {/* Stats */}
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div className="bg-white p-3 rounded-lg border">
                    <p className="text-sm text-gray-500">Toplam Kullanıcı</p>
                    <p className="text-2xl font-semibold text-gray-900">{selectedMerchant.userCount}</p>
                  </div>
                  <div className="bg-white p-3 rounded-lg border">
                    <p className="text-sm text-gray-500">Aktif Kullanıcı</p>
                    <p className="text-2xl font-semibold text-green-600">{selectedMerchant.activeUserCount}</p>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="overflow-y-auto flex-grow">
                {selectedMerchant.users.length === 0 ? (
                  <div className="text-center py-12">
                    <Users className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="text-lg font-medium text-gray-500">Kullanıcı bulunamadı</p>
                    <p className="text-gray-400">Bu merchant'ın henüz kullanıcısı yok</p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-200">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Kullanıcı
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Rol
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Durum
                          </th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            İşlemler
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {selectedMerchant.users.map(user => (
                          <tr key={user.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">{user.firstName} {user.lastName}</div>
                              <div className="text-sm text-gray-500">{user.email}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{getRoleName(user.roleId!)}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(user.isActive)}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <div className="relative inline-block text-left">
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setOpenDropdown(openDropdown === user.id ? null : user.id);
                                  }} 
                                  className="p-1 rounded-full hover:bg-gray-100"
                                >
                                  <MoreVertical className="w-5 h-5" />
                                </button>
                                {openDropdown === user.id && (
                                  <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                                    <div className="py-1">
                                      <button
                                        onClick={(e) => { 
                                          e.stopPropagation();
                                          setEditingUser(user); 
                                          setOpenDropdown(null); 
                                        }}
                                        className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                      >
                                        <Edit className="w-4 h-4 mr-2" />
                                        Kullanıcıyı Düzenle
                                      </button>
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleResetPassword(user);
                                        }}
                                        className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                      >
                                        <Mail className="w-4 h-4 mr-2" />
                                        Şifre Sıfırlama Maili Gönder
                                      </button>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* OTP Modal */}
      {showOtpModal && selectedMerchantForOtp && (
        <OtpModal
          isOpen={showOtpModal}
          onClose={() => {
            setShowOtpModal(false);
            setSelectedMerchantForOtp(null);
          }}
          merchant={selectedMerchantForOtp}
          onUpdateOtp={(otpType, durationInMinutes) => handleSetOtpType(selectedMerchantForOtp.id, otpType, durationInMinutes)}
        />
      )}

      {/* Bulk OTP Modal */}
      {showBulkOtpModal && (
        <BulkOtpModal
          isOpen={showBulkOtpModal}
          onClose={() => setShowBulkOtpModal(false)}
          selectedCount={selectedMerchants.size}
          onUpdateOtp={handleBulkOtpUpdate}
        />
      )}

      {/* User Detail Modal */}
      {showUserModal && selectedUser && (
        <UserDetailModal
          user={selectedUser}
          roles={roles}
          isOpen={showUserModal}
          onClose={() => {
            setShowUserModal(false);
            setSelectedUser(null);
          }}
          onRoleUpdate={handleRoleUpdate}
        />
      )}

      {editingUser && (
        <EditUserModal 
          user={editingUser}
          onClose={() => setEditingUser(null)}
          onSave={handleUpdateUser}
        />
      )}
    </div>
  );
} 