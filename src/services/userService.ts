import { User, Role, Permission, AuditLog, UserFilters, RoleFormData, Merchant } from '../types';

// Mock Permissions
export const mockPermissions: Permission[] = [
  { id: '1', module: 'wallet-settlement', action: 'view', displayName: 'Cüzdan Hakediş - Görüntüleme' },
  { id: '2', module: 'wallet-settlement', action: 'create', displayName: 'Cüzdan Hakediş - Oluşturma' },
  { id: '3', module: 'wallet-settlement', action: 'update', displayName: 'Cüzdan Hakediş - Güncelleme' },
  { id: '4', module: 'wallet-settlement', action: 'delete', displayName: 'Cüzdan Hakediş - Silme' },
  { id: '5', module: 'stored-card', action: 'view', displayName: 'Saklı Kart - Görüntüleme' },
  { id: '6', module: 'stored-card', action: 'create', displayName: 'Saklı Kart - Oluşturma' },
  { id: '7', module: 'stored-card', action: 'update', displayName: 'Saklı Kart - Güncelleme' },
  { id: '8', module: 'stored-card', action: 'delete', displayName: 'Saklı Kart - Silme' },
  { id: '9', module: 'users', action: 'view', displayName: 'Kullanıcılar - Görüntüleme' },
  { id: '10', module: 'users', action: 'create', displayName: 'Kullanıcılar - Oluşturma' },
  { id: '11', module: 'users', action: 'update', displayName: 'Kullanıcılar - Güncelleme' },
  { id: '12', module: 'users', action: 'delete', displayName: 'Kullanıcılar - Silme' },
  { id: '13', module: 'roles', action: 'view', displayName: 'Roller - Görüntüleme' },
  { id: '14', module: 'roles', action: 'create', displayName: 'Roller - Oluşturma' },
  { id: '15', module: 'roles', action: 'update', displayName: 'Roller - Güncelleme' },
  { id: '16', module: 'roles', action: 'delete', displayName: 'Roller - Silme' },
  { id: '17', module: 'communication', action: 'view', displayName: 'İletişim - Görüntüleme' },
  { id: '18', module: 'communication', action: 'update', displayName: 'İletişim - Güncelleme' },
];

// Mock Roles
export const mockRoles: Role[] = [
  {
    id: 'superadmin',
    name: 'Super Admin',
    description: 'Tüm sisteme erişim yetkisi. Rol ve kullanıcı yönetimi yapabilir.',
    permissions: mockPermissions,
    isSystemRole: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'maker',
    name: 'Maker',
    description: 'Veri girişi ve işlem hazırlama yetkisi.',
    permissions: mockPermissions.filter(p => ['view', 'create'].includes(p.action)),
    isSystemRole: false,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'checker',
    name: 'Checker',
    description: 'Maker tarafından girilen işlemleri onaylama/reddetme yetkisi.',
    permissions: mockPermissions.filter(p => ['view', 'update'].includes(p.action)),
    isSystemRole: false,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'observer',
    name: 'Observer',
    description: 'Sadece görüntüleme yetkisi.',
    permissions: mockPermissions.filter(p => p.action === 'view'),
    isSystemRole: false,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'merchant-admin',
    name: 'Merchant Admin',
    description: 'Merchant panel yöneticisi',
    permissions: mockPermissions.filter(p => p.action === 'view'),
    isSystemRole: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'merchant-user',
    name: 'Merchant Kullanıcı',
    description: 'Temel merchant kullanıcısı',
    permissions: mockPermissions.filter(p => 
      p.action === 'view' && (p.module === 'wallet-settlement' || p.module === 'stored-card')
    ),
    isSystemRole: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
];

const getRoleNameById = (roleId: string) => mockRoles.find(r => r.id === roleId)?.name || 'Unknown Role';

// Generate large mock data
let allUsers: User[] = [];

// Merkezi merchant verileri
const merchantDatabase: Record<string, Merchant> = {};

const generateMockUsers = (): User[] => {
  if (allUsers.length > 0) return allUsers;

  const users: User[] = [];
  
  // Admin kullanıcılar
  users.push(
    {
      id: '1',
      email: 'mustafa.gecginer@hepsipay.com',
      firstName: 'Mustafa Can',
      lastName: 'Geçginer',
      name: 'Mustafa Can Geçginer',
      avatar: 'https://i.pravatar.cc/150?u=mustafa.gecginer@hepsipay.com',
      title: getRoleNameById('superadmin'),
      isActive: true,
      createdAt: '2024-01-01T00:00:00Z',
      lastLoginAt: '2024-05-20T10:30:00Z',
      userType: 'admin',
      roleId: 'superadmin',
    },
    {
      id: '2',
      email: 'ahmet.maker@hepsipay.com',
      firstName: 'Ahmet',
      lastName: 'Maker',
      name: 'Ahmet Maker',
      avatar: 'https://i.pravatar.cc/150?u=ahmet.maker@hepsipay.com',
      title: getRoleNameById('maker'),
      isActive: true,
      createdAt: '2024-01-15T00:00:00Z',
      lastLoginAt: '2024-05-23T09:15:00Z',
      userType: 'admin',
      roleId: 'maker',
    },
    {
      id: '3',
      email: 'zeynep.checker@hepsipay.com',
      firstName: 'Zeynep',
      lastName: 'Checker',
      name: 'Zeynep Checker',
      avatar: 'https://i.pravatar.cc/150?u=zeynep.checker@hepsipay.com',
      title: getRoleNameById('checker'),
      isActive: true,
      createdAt: '2024-02-01T00:00:00Z',
      lastLoginAt: '2024-05-24T14:20:00Z',
      userType: 'admin',
      roleId: 'checker',
    },
    {
      id: '4',
      email: 'ayse.observer@hepsipay.com',
      firstName: 'Ayşe',
      lastName: 'Observer',
      name: 'Ayşe Observer',
      avatar: 'https://i.pravatar.cc/150?u=ayse.observer@hepsipay.com',
      title: getRoleNameById('observer'),
      isActive: true,
      createdAt: '2024-02-01T00:00:00Z',
      lastLoginAt: '2024-05-24T14:20:00Z',
      userType: 'admin',
      roleId: 'observer',
    },
    {
      id: '5',
      email: 'eski.calisan@hepsipay.com',
      firstName: 'Eski',
      lastName: 'Çalışan',
      name: 'Eski Çalışan',
      avatar: 'https://i.pravatar.cc/150?u=eski.calisan@hepsipay.com',
      title: getRoleNameById('observer'),
      isActive: false,
      ldapDeactivated: true,
      createdAt: '2023-02-01T00:00:00Z',
      lastLoginAt: '2024-01-24T14:20:00Z',
      userType: 'admin',
      roleId: 'observer',
    },
     {
      id: '6',
      email: 'kalici.pasif@hepsipay.com',
      firstName: 'Kalıcı',
      lastName: 'Pasif',
      name: 'Kalıcı Pasif',
      avatar: 'https://i.pravatar.cc/150?u=kalici.pasif@hepsipay.com',
      title: getRoleNameById('maker'),
      isActive: false,
      isManuallyDeactivated: true,
      createdAt: '2023-03-01T00:00:00Z',
      lastLoginAt: '2024-02-24T14:20:00Z',
      userType: 'admin',
      roleId: 'maker',
    }
  );

  // LDAP'den gelen ama rolü olmayan kullanıcılar
  users.push(
    {
      id: '1001',
      email: 'eray.ozturk@hepsipay.com',
      firstName: 'Eray',
      lastName: 'Öztürk',
      name: 'Eray Öztürk',
      avatar: 'https://i.pravatar.cc/150?u=eray.ozturk@hepsipay.com',
      title: 'Software Developer',
      isActive: true,
      userType: 'admin',
      createdAt: '2024-03-01T00:00:00Z',
      lastLoginAt: null
    },
    {
      id: '1002',
      email: 'sirket.calisani@hepsipay.com',
      firstName: 'Sirket',
      lastName: 'Çalışanı',
      name: 'Sirket Çalışanı',
      avatar: 'https://i.pravatar.cc/150?u=sirket.calisani@hepsipay.com',
      title: 'Human Resources',
      isActive: true,
      userType: 'admin',
      createdAt: '2024-04-01T00:00:00Z',
      lastLoginAt: null
    }
  );

  // 100 merchant, her birinden 10 kullanıcı
  const merchantNames = [
    'Teknoloji Dünyası', 'Moda Plaza', 'Kitap Evi', 'Spor Market', 'Elektronik City',
    'Ayakkabı Mağazası', 'Kozmetik Store', 'Ev Tekstili', 'Bahçe Market', 'Oyuncak Dünyası',
    'Gıda Market', 'İnşaat Malzemeleri', 'Otomotiv Store', 'Mobilya Palace', 'Kırtasiye Plus',
    'Saat & Aksesuar', 'Parfüm House', 'Bebek Dünyası', 'Pet Shop', 'Hediyelik Eşya',
    'Müzik Enstrümanları', 'Fotoğraf Studio', 'Bisiklet Store', 'Outdoor Market', 'Hobi Dünyası',
    'Antika Store', 'Sanat Galerisi', 'Çiçek Bahçesi', 'Balık Market', 'Et Dünyası',
    'Organik Market', 'Vitamin Store', 'Eczane Plus', 'Optik Center', 'Berber Shop',
    'Kuaför Salonu', 'Güzellik Merkezi', 'Fitness Club', 'Yüzme Havuzu', 'Yoga Studio',
    'Dil Kursu', 'Müzik Okulu', 'Resim Atölyesi', 'Dikiş Kursu', 'Yemek Kursu',
    'Cafe Restaurant', 'Pasta Shop', 'Burger House', 'Pizza Palace', 'Döner Evi',
    'Lahmacun Salonu', 'Balık Restaurant', 'Et Restaurant', 'Vegan Cafe', 'Kahve Dünyası',
    'Çay Bahçesi', 'Nargile Cafe', 'Internet Cafe', 'Oyun Salonu', 'Bilardo Salonu',
    'Bowling Center', 'Sinema Kompleksi', 'Tiyatro Salonu', 'Konser Holü', 'Gece Kulübü',
    'Bar Restaurant', 'Otel Paradise', 'Pansiyon Ev', 'Kamp Alanı', 'Tatil Köyü',
    'Travel Agency', 'Oto Kiralama', 'Taksi Durağı', 'Otopark', 'Benzin İstasyonu',
    'Oto Tamiri', 'Lastik Servisi', 'Cam Filmi', 'Boyahane', 'Elektrikçi',
    'Tesisatçı', 'Marangoz', 'Boyacı', 'Temizlik Servisi', 'Güvenlik Hizmetleri',
    'Kargo Şirketi', 'Nakliyat', 'Depo Hizmetleri', 'Lojistik Center', 'Gümrük Müşaviri',
    'Muhasebe Ofisi', 'Hukuk Bürosu', 'Mühendislik Ofisi', 'Mimarlık Bürosu', 'İnşaat Firması',
    'Reklam Ajansı', 'Grafik Tasarım', 'Web Tasarım', 'Yazılım Firması', 'IT Destek'
  ];

  const firstNames = [
    'Mehmet', 'Ali', 'Ahmet', 'Mustafa', 'Hasan', 'Hüseyin', 'İbrahim', 'Ömer', 'Yusuf', 'Murat',
    'Ayşe', 'Fatma', 'Hatice', 'Zeynep', 'Emine', 'Merve', 'Elif', 'Özge', 'Seda', 'Burcu',
    'Can', 'Cem', 'Deniz', 'Emre', 'Furkan', 'Gökhan', 'Halil', 'İsmail', 'Kaan', 'Levent',
    'Nur', 'Pınar', 'Rukiye', 'Şule', 'Tuba', 'Ülkü', 'Vildan', 'Yasemin', 'Zara', 'Aslı'
  ];

  const lastNames = [
    'Yılmaz', 'Kaya', 'Demir', 'Çelik', 'Şahin', 'Yıldız', 'Yıldırım', 'Öztürk', 'Aydin', 'Özkan',
    'Kaplan', 'Doğan', 'Arslan', 'Koç', 'Kurt', 'Özdemir', 'Aslan', 'Polat', 'Erdoğan', 'Acar',
    'Güler', 'Karaca', 'Kılıç', 'Özgür', 'Ateş', 'Keskin', 'Türk', 'Bulut', 'Akın', 'Sönmez'
  ];

  let userId = 10; // Admin'ler 1-6, LDAP 1001-1002

  for (let merchantIndex = 1; merchantIndex <= 20; merchantIndex++) { // Reduced for performance
    const merchantId = `M${merchantIndex.toString().padStart(3, '0')}`;
    const merchantName = merchantNames[merchantIndex - 1];
    const merchantType = merchantIndex % 3 === 0 ? 'KA' : 'SME';
    const otpTypes: Array<'none' | 'mail' | 'sms'> = ['none', 'mail', 'sms'];
    const otpType = otpTypes[Math.floor(Math.random() * otpTypes.length)];

    // Merkezi merchant verisi - tüm kullanıcılar bu referansı paylaşacak
    const merchantData: Merchant = {
        id: merchantId,
        merchantNumber: merchantId,
        merchantName,
        title: `${merchantName} ${merchantType === 'KA' ? 'A.Ş.' : 'Ltd.'}`,
        merchantType,
        iban: `TR${Math.floor(Math.random() * 9000000000000000000000000) + 1000000000000000000000000}`,
        otpType,
        otpTypeExpiresAt: null,
    };

    // Merkezi veritabanına kaydet
    merchantDatabase[merchantId] = merchantData;

    // Her merchant için 2-6 arası rastgele kullanıcı
    const userCount = Math.floor(Math.random() * 5) + 2; // 2-6 arası

    for (let userIndex = 1; userIndex <= userCount; userIndex++) {
      const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${userIndex}@${merchantName.toLowerCase().replace(/\s+/g, '').replace(/[^a-z]/g, '')}.com`;
      const isActive = Math.random() > 0.2; // %80 aktif
      const roleId = userIndex === 1 ? 'merchant-admin' : 'merchant-user';

      users.push({
        id: userId.toString(),
        email: email,
        firstName,
        lastName,
        name: `${firstName} ${lastName}`,
        tckn: Math.floor(10000000000 + Math.random() * 90000000000).toString(),
        avatar: `https://i.pravatar.cc/150?u=${email}`,
        title: getRoleNameById(roleId),
        isActive,
        createdAt: `2024-0${Math.floor(Math.random() * 5) + 1}-${Math.floor(Math.random() * 28) + 1}T00:00:00Z`,
        lastLoginAt: isActive ? `2024-05-${Math.floor(Math.random() * 30) + 1}T${Math.floor(Math.random() * 24)}:${Math.floor(Math.random() * 60)}:00Z` : null,
        userType: 'merchant',
        merchantId,
        roleId,
        merchant: merchantData, // Aynı referansı paylaş
      });

      userId++;
    }
  }

  allUsers = users;
  return users;
};

// Mock Users
generateMockUsers();
let mockUsers: User[] = allUsers.filter(u => u.roleId);

// Mock Audit Logs
export const mockAuditLogs: AuditLog[] = [
  {
    id: '1',
    userId: '1',
    targetUserId: '4',
    action: 'role_updated',
    module: 'users',
    details: 'Kullanıcı rolü güncellendi',
    oldValue: { roleId: '5', roleName: 'Merchant Kullanıcı' },
    newValue: { roleId: '4', roleName: 'Merchant Admin' },
    timestamp: '2024-05-24T10:30:00Z',
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
  },
  {
    id: '2',
    userId: '1',
    action: 'role_created',
    module: 'roles',
    details: 'Yeni rol oluşturuldu',
    newValue: { name: 'Test Rol', permissions: ['1', '2'] },
    timestamp: '2024-05-23T15:45:00Z',
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
  },
];

// API Functions
export const userService = {
  // Kullanıcı işlemleri
  async getUsers(filters?: UserFilters): Promise<User[]> {
    // Süresi dolan OTP ayarlarını kontrol et ve sıfırla (simülasyon)
    const now = new Date();
    Object.values(merchantDatabase).forEach(merchant => {
      if (merchant.otpTypeExpiresAt && new Date(merchant.otpTypeExpiresAt) < now) {
        merchant.otpType = 'mail'; // Varsayılan olarak maile dön
        merchant.otpTypeExpiresAt = null;
      }
    });

    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call
    
    let filteredUsers = [...mockUsers];
    
    if (filters?.userType && filters.userType !== 'all') {
      filteredUsers = filteredUsers.filter(user => user.userType === filters.userType);
    }
    
    if (filters?.isActive !== 'all' && filters?.isActive !== undefined) {
      let isActive = filters.isActive;
      filteredUsers = filteredUsers.filter(user => {
        // Manually deactivated users should always be considered inactive
        if (user.isManuallyDeactivated) return !isActive;
        // LDAP deactivated users should be considered inactive
        if (user.ldapDeactivated) return !isActive;
        return user.isActive === isActive;
      });
    }
    
    if (filters?.roleId && filters.roleId !== 'all') {
      filteredUsers = filteredUsers.filter(user => user.roleId === filters.roleId);
    }
    
    if (filters?.merchantId && filters.merchantId !== 'all') {
      filteredUsers = filteredUsers.filter(user => user.merchantId === filters.merchantId);
    }
    
    if (filters?.search) {
      const search = filters.search.toLowerCase();
      filteredUsers = filteredUsers.filter(user => 
        user.name.toLowerCase().includes(search) ||
        user.email.toLowerCase().includes(search)
      );
    }
    
    return filteredUsers;
  },

  async getAllLdapUsers(filters?: { search?: string }): Promise<User[]> {
    await new Promise(resolve => setTimeout(resolve, 500));
    let ldapUsers = allUsers.filter(u => u.userType === 'admin');

    if (filters?.search) {
      const search = filters.search.toLowerCase();
      ldapUsers = ldapUsers.filter(user => 
        user.name.toLowerCase().includes(search) ||
        user.email.toLowerCase().includes(search)
      );
    }

    return ldapUsers;
  },

  async deactivateUser(userId: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 300));
    const userInAll = allUsers.find(u => u.id === userId);
    if (userInAll) {
      userInAll.isActive = false;
      userInAll.isManuallyDeactivated = true;
    }
    
    const userInMock = mockUsers.find(u => u.id === userId);
     if (userInMock) {
      userInMock.isActive = false;
      userInMock.isManuallyDeactivated = true;
    }

    return Promise.resolve();
  },

  async getUserById(id: string): Promise<User | undefined> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return allUsers.find(user => user.id === id);
  },

  async updateUserRole(userId: string, roleId: string): Promise<User> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const userIndex = allUsers.findIndex(user => user.id === userId);
    if (userIndex === -1) {
      throw new Error("Kullanıcı bulunamadı");
    }
    
    const user = { ...allUsers[userIndex] };

    if (user.userType === 'merchant') {
       throw new Error('Merchant kullanıcılarının rolleri değiştirilemez');
    }

    const oldRoleName = mockRoles.find(r => r.id === user.roleId)?.name;
    
    allUsers[userIndex].roleId = roleId;
    allUsers[userIndex].title = getRoleNameById(roleId);

    // mockUsers'ı da güncelle
    const mockUserIndex = mockUsers.findIndex(u => u.id === userId);
    if (mockUserIndex > -1) {
      mockUsers[mockUserIndex].roleId = roleId;
      mockUsers[mockUserIndex].title = getRoleNameById(roleId);
    } else {
      // eğer kullanıcı mockUsers'da yoksa (örn. rolü olmayan bir ldap kullanıcısı), ekle
       mockUsers.push(allUsers[userIndex]);
    }
    
    const newRoleName = mockRoles.find(r => r.id === roleId)?.name;

    mockAuditLogs.unshift({
      id: (mockAuditLogs.length + 1).toString(),
      userId: '1', // Gerçekte session'dan alınmalı
      targetUserId: userId,
      action: 'role_updated',
      module: 'users',
      details: `Kullanıcının rolü güncellendi: ${oldRoleName || 'Rol Yok'} -> ${newRoleName}`,
      oldValue: { roleId: user.roleId },
      newValue: { roleId: roleId },
      timestamp: new Date().toISOString(),
      ipAddress: '192.168.1.100',
      userAgent: 'Mock User Agent',
    });

    return allUsers[userIndex];
  },

  // Rol işlemleri
  async getRoles(): Promise<Role[]> {
    await new Promise(resolve => setTimeout(resolve, 100));
    return [...mockRoles];
  },

  async createRole(roleData: RoleFormData): Promise<Role> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newRole: Role = {
      id: Date.now().toString(),
      name: roleData.name,
      description: roleData.description,
      permissions: mockPermissions.filter(p => roleData.permissions.includes(p.id)),
      isSystemRole: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    mockRoles.push(newRole);
    
    // Audit log ekle
    const auditLog: AuditLog = {
      id: Date.now().toString(),
      userId: '1',
      action: 'role_created',
      module: 'roles',
      details: 'Yeni rol oluşturuldu',
      newValue: { name: newRole.name, permissions: roleData.permissions },
      timestamp: new Date().toISOString(),
      ipAddress: '192.168.1.100',
      userAgent: navigator.userAgent,
    };
    mockAuditLogs.unshift(auditLog);
    
    return newRole;
  },

  async updateRole(roleId: string, roleData: RoleFormData): Promise<Role> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const roleIndex = mockRoles.findIndex(role => role.id === roleId);
    if (roleIndex === -1) {
      throw new Error('Rol bulunamadı');
    }
    
    if (mockRoles[roleIndex].isSystemRole) {
      throw new Error('Sistem rolleri düzenlenemez');
    }
    
    if (mockRoles[roleIndex].name.includes('Merchant')) {
      throw new Error('Merchant rolleri düzenlenemez');
    }
    
    const oldRole = { ...mockRoles[roleIndex] };
    
    mockRoles[roleIndex] = {
      ...mockRoles[roleIndex],
      name: roleData.name,
      description: roleData.description,
      permissions: mockPermissions.filter(p => roleData.permissions.includes(p.id)),
      updatedAt: new Date().toISOString(),
    };
    
    // Audit log ekle
    const auditLog: AuditLog = {
      id: Date.now().toString(),
      userId: '1',
      action: 'role_updated',
      module: 'roles',
      details: 'Rol güncellendi',
      oldValue: { name: oldRole.name, permissions: oldRole.permissions.map(p => p.id) },
      newValue: { name: roleData.name, permissions: roleData.permissions },
      timestamp: new Date().toISOString(),
      ipAddress: '192.168.1.100',
      userAgent: navigator.userAgent,
    };
    mockAuditLogs.unshift(auditLog);
    
    return mockRoles[roleIndex];
  },

  async deleteRole(roleId: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const roleIndex = mockRoles.findIndex(role => role.id === roleId);
    if (roleIndex === -1) {
      throw new Error('Rol bulunamadı');
    }
    
    if (mockRoles[roleIndex].isSystemRole) {
      throw new Error('Sistem rolleri silinemez');
    }
    
    if (mockRoles[roleIndex].name.includes('Merchant')) {
      throw new Error('Merchant rolleri silinemez');
    }
    
    // Rolü kullanan kullanıcı var mı kontrol et
    const usersWithRole = mockUsers.filter(user => user.roleId === roleId);
    if (usersWithRole.length > 0) {
      throw new Error('Bu rol kullanıcılara atanmış olduğu için silinemez');
    }
    
    const deletedRole = mockRoles[roleIndex];
    mockRoles.splice(roleIndex, 1);
    
    // Audit log ekle
    const auditLog: AuditLog = {
      id: Date.now().toString(),
      userId: '1',
      action: 'role_deleted',
      module: 'roles',
      details: 'Rol silindi',
      oldValue: { name: deletedRole.name, id: deletedRole.id },
      timestamp: new Date().toISOString(),
      ipAddress: '192.168.1.100',
      userAgent: navigator.userAgent,
    };
    mockAuditLogs.unshift(auditLog);
  },

  // Yetki işlemleri
  async getPermissions(): Promise<Permission[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return [...mockPermissions];
  },

  // Audit log işlemleri
  async getAuditLogs(limit = 50): Promise<AuditLog[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockAuditLogs.slice(0, limit);
  },

  async updateMerchantUser(userId: string, userData: Partial<Pick<User, 'firstName' | 'lastName' | 'email' | 'tckn'>>): Promise<User> {
    await new Promise(resolve => setTimeout(resolve, 500));

    const userIndex = allUsers.findIndex(u => u.id === userId);
    if (userIndex === -1) {
      throw new Error("Kullanıcı bulunamadı");
    }

    const updatedUser = { ...allUsers[userIndex], ...userData, name: `${userData.firstName || allUsers[userIndex].firstName} ${userData.lastName || allUsers[userIndex].lastName}` };
    allUsers[userIndex] = updatedUser;
    
    const mockUserIndex = mockUsers.findIndex(u => u.id === userId);
    if (mockUserIndex > -1) {
      mockUsers[mockUserIndex] = updatedUser;
    }

    return updatedUser;
  },

  async setMerchantOtpType(merchantId: string, otpType: 'none' | 'mail' | 'sms', durationInMinutes?: number): Promise<Merchant> {
     await new Promise(resolve => setTimeout(resolve, 300));
     
     // Merkezi merchant verisini güncelle
     const merchantData = merchantDatabase[merchantId];
     if (!merchantData) {
       throw new Error("Merchant bulunamadı");
     }

     const now = new Date();
     const expiresAt = durationInMinutes ? new Date(now.getTime() + durationInMinutes * 60000).toISOString() : null;

     // Merkezi veriyi güncelle
     merchantData.otpType = otpType;
     merchantData.otpTypeExpiresAt = expiresAt;

     // Tüm kullanıcı dizilerinde bu merchant'ı kullanan kullanıcıları güncelle
     // allUsers ve mockUsers aynı referansları paylaştığı için otomatik güncellenir
     
     return merchantData;
  },
  
  async getDashboardStats(): Promise<any> {
    await new Promise(resolve => setTimeout(resolve, 700));

    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const dau = allUsers.filter(u => u.lastLoginAt && new Date(u.lastLoginAt) > oneDayAgo).length;
    const mau = allUsers.filter(u => u.lastLoginAt && new Date(u.lastLoginAt) > thirtyDaysAgo).length;

    const totalUsers = allUsers.length;
    const activeUsers = allUsers.filter(u => u.isActive).length;
    const inactiveUsers = totalUsers - activeUsers;

    const roleDistribution = allUsers.reduce((acc, user) => {
      if (user.roleId) {
        const roleName = getRoleNameById(user.roleId);
        acc[roleName] = (acc[roleName] || 0) + 1;
      } else {
         acc['Rol Atanmamış'] = (acc['Rol Atanmamış'] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    return {
      dau,
      mau,
      totalUsers,
      activeUsers,
      inactiveUsers,
      roleDistribution: Object.entries(roleDistribution).map(([name, count]) => ({ name, count })).sort((a,b) => b.count - a.count),
    };
  },

  async sendPasswordResetEmail(userId: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    const user = allUsers.find(u => u.id === userId);
    if (!user) {
      throw new Error("Kullanıcı bulunamadı");
    }
    console.log(`Password reset email sent to ${user.email}`);
    return Promise.resolve();
  },
}; 