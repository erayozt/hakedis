import { POSProvider, ErrorCategory, ErrorMapping, HBErrorCode, ErrorLog, ErrorStats, ErrorTemplate } from '../types';

// Mock data for POS providers
const mockPOSProviders: POSProvider[] = [
  {
    id: '1',
    name: 'Hepsipay Gateway',
    code: 'hepsipay',
    description: 'Hepsipay\'in kendi gateway sistemi',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    name: 'Paygate',
    code: 'paygate',
    description: 'Paygate ödeme sistemi',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '3',
    name: 'Wallet',
    code: 'wallet',
    description: 'Hepsipay Cüzdan sistemi',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '4',
    name: 'Craftgate',
    code: 'craftgate',
    description: 'Craftgate ödeme sistemi',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '5',
    name: 'Payten',
    code: 'payten',
    description: 'Payten POS sistemi',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  }
];

// Mock data for error categories
const mockErrorCategories: ErrorCategory[] = [
  { id: 'cat-1', name: 'Banka/Finansal Hata', description: 'Bankadan veya finansal kurumdan kaynaklanan hatalar', color: '#EF4444', icon: 'Landmark', priority: 1 },
  { id: 'cat-2', name: 'Teknik/Sistemsel Hata', description: 'Gateway, altyapı veya sistemsel sorunlar', color: '#F97316', icon: 'ServerCog', priority: 1 },
  { id: 'cat-3', name: 'Kullanıcı Hatası', description: 'Kullanıcının hatalı veri girmesi veya eksik işlem yapması', color: '#EAB308', icon: 'UserX', priority: 2 },
  { id: 'cat-4', name: 'Güvenlik/Risk Hatası', description: '3D Secure, şüpheli işlem veya fraud kontrolleri', color: '#8B5CF6', icon: 'ShieldAlert', priority: 1 },
  { id: 'cat-5', name: 'İşlem Akışı Hatası', description: 'İşlem akışında beklenmedik durumlar', color: '#3B82F6', icon: 'ArrowRightLeft', priority: 3 },
  { id: 'cat-6', name: 'Cüzdan Hatası', description: 'Cüzdan işlemleriyle ilgili hatalar', color: '#10B981', icon: 'Wallet', priority: 2 },
];


// HB Error Codes - Ana hata mesajları (Hepsipay standart hata kodları)
const mockHBErrorCodes: HBErrorCode[] = [
  // Kategori 1: Banka/Finansal Hata
  { id: 'hb-1001', hbErrorCode: '1001', originalSystemMessage: 'ERR_INVALID_CARD_DATA', hbErrorMessage: 'Lütfen kart bilgilerinizi kontrol edip tekrar deneyin.', categoryId: 'cat-1', severity: 'high', shouldRetry: false, suggestedActions: [], isActive: true, showToUser: true, createdAt: '2024-01-01T10:00:00Z', updatedAt: '2024-01-01T10:00:00Z', createdBy: 'system', lastModifiedBy: 'system' },
  { id: 'hb-2001', hbErrorCode: '2001', originalSystemMessage: 'ERR_BANK_DECLINED', hbErrorMessage: 'Bankanız bu işleme onay vermedi. Lütfen bankanızla iletişime geçin.', categoryId: 'cat-1', severity: 'high', shouldRetry: false, suggestedActions: [], isActive: true, showToUser: true, createdAt: '2024-01-01T10:00:00Z', updatedAt: '2024-01-01T10:00:00Z', createdBy: 'system', lastModifiedBy: 'system' },
  { id: 'hb-4001', hbErrorCode: '4001', originalSystemMessage: 'ERR_RESTRICTED_CARD', hbErrorMessage: 'Kartınız bu tür işlemlere kapalıdır. Farklı bir kart deneyin.', categoryId: 'cat-1', severity: 'high', shouldRetry: false, suggestedActions: [], isActive: true, showToUser: true, createdAt: '2024-01-01T10:00:00Z', updatedAt: '2024-01-01T10:00:00Z', createdBy: 'system', lastModifiedBy: 'system' },
  { id: 'hb-4004', hbErrorCode: '4004', originalSystemMessage: 'ERR_INSUFFICIENT_FUNDS', hbErrorMessage: 'Kartınızda yeterli bakiye bulunmamaktadır.', categoryId: 'cat-1', severity: 'high', shouldRetry: false, suggestedActions: [], isActive: true, showToUser: true, createdAt: '2024-01-01T10:00:00Z', updatedAt: '2024-01-01T10:00:00Z', createdBy: 'system', lastModifiedBy: 'system' },
  
  // Kategori 2: Teknik/Sistemsel Hata
  { id: 'hb-2005', hbErrorCode: '2005', originalSystemMessage: 'ERR_GATEWAY_TIMEOUT', hbErrorMessage: 'Bankanızla iletişim kurarken bir sorun oluştu. Lütfen tekrar deneyin.', categoryId: 'cat-2', severity: 'critical', shouldRetry: true, suggestedActions: [], isActive: true, showToUser: true, createdAt: '2024-01-01T10:00:00Z', updatedAt: '2024-01-01T10:00:00Z', createdBy: 'system', lastModifiedBy: 'system' },
  { id: 'hb-7001', hbErrorCode: '7001', originalSystemMessage: 'ERR_SYSTEM_MAINTENANCE', hbErrorMessage: 'Sistemde bakım çalışması yapılmaktadır. Lütfen daha sonra tekrar deneyin.', categoryId: 'cat-2', severity: 'critical', shouldRetry: false, suggestedActions: [], isActive: true, showToUser: true, createdAt: '2024-01-01T10:00:00Z', updatedAt: '2024-01-01T10:00:00Z', createdBy: 'system', lastModifiedBy: 'system' },
  { id: 'hb-7002', hbErrorCode: '7002', originalSystemMessage: 'ERR_INVALID_MERCHANT', hbErrorMessage: 'Üye işyeri bilgileri geçersiz. Lütfen destek ekibiyle iletişime geçin.', categoryId: 'cat-2', severity: 'high', shouldRetry: false, suggestedActions: [], isActive: true, showToUser: false, createdAt: '2024-01-01T10:00:00Z', updatedAt: '2024-01-01T10:00:00Z', createdBy: 'system', lastModifiedBy: 'system' },
  { id: 'hb-9001', hbErrorCode: '9001', originalSystemMessage: 'ERR_GENERIC_FAILURE', hbErrorMessage: 'Beklenmedik bir hata oluştu. Lütfen tekrar deneyin.', categoryId: 'cat-2', severity: 'high', shouldRetry: true, suggestedActions: [], isActive: true, showToUser: true, createdAt: '2024-01-01T10:00:00Z', updatedAt: '2024-01-01T10:00:00Z', createdBy: 'system', lastModifiedBy: 'system' },
  
  // Kategori 3: Kullanıcı Hatası
  { id: 'hb-1002', hbErrorCode: '1002', originalSystemMessage: 'ERR_EXPIRED_CARD', hbErrorMessage: 'Kartınızın son kullanma tarihi geçmiş. Lütfen farklı bir kart kullanın.', categoryId: 'cat-3', severity: 'high', shouldRetry: false, suggestedActions: [], isActive: true, showToUser: true, createdAt: '2024-01-01T10:00:00Z', updatedAt: '2024-01-01T10:00:00Z', createdBy: 'system', lastModifiedBy: 'system' },
  { id: 'hb-1003', hbErrorCode: '1003', originalSystemMessage: 'ERR_INVALID_CVV', hbErrorMessage: 'Güvenlik kodunu (CVV) hatalı girdiniz.', categoryId: 'cat-3', severity: 'high', shouldRetry: true, suggestedActions: [], isActive: true, showToUser: true, createdAt: '2024-01-01T10:00:00Z', updatedAt: '2024-01-01T10:00:00Z', createdBy: 'system', lastModifiedBy: 'system' },

  // Kategori 4: Güvenlik/Risk Hatası
  { id: 'hb-2002', hbErrorCode: '2002', originalSystemMessage: 'ERR_SUSPECTED_FRAUD', hbErrorMessage: 'İşleminiz güvenlik nedeniyle reddedilmiştir.', categoryId: 'cat-4', severity: 'critical', shouldRetry: false, suggestedActions: [], isActive: true, showToUser: true, createdAt: '2024-01-01T10:00:00Z', updatedAt: '2024-01-01T10:00:00Z', createdBy: 'system', lastModifiedBy: 'system' },
  { id: 'hb-3010', hbErrorCode: '3010', originalSystemMessage: 'ERR_3D_SECURE_FAILURE', hbErrorMessage: '3D Secure doğrulaması başarısız oldu.', categoryId: 'cat-4', severity: 'high', shouldRetry: true, suggestedActions: [], isActive: true, showToUser: true, createdAt: '2024-01-01T10:00:00Z', updatedAt: '2024-01-01T10:00:00Z', createdBy: 'system', lastModifiedBy: 'system' },
  { id: 'hb-3011', hbErrorCode: '3011', originalSystemMessage: 'ERR_3D_SECURE_TIMEOUT', hbErrorMessage: '3D Secure doğrulama süresi doldu. Lütfen tekrar deneyin.', categoryId: 'cat-4', severity: 'high', shouldRetry: true, suggestedActions: [], isActive: true, showToUser: true, createdAt: '2024-01-01T10:00:00Z', updatedAt: '2024-01-01T10:00:00Z', createdBy: 'system', lastModifiedBy: 'system' },
  { id: 'hb-8001', hbErrorCode: '8001', originalSystemMessage: 'ERR_LOST_OR_STOLEN_CARD', hbErrorMessage: 'Kayıp/Çalıntı kart. Lütfen bankanızla iletişime geçin.', categoryId: 'cat-4', severity: 'critical', shouldRetry: false, suggestedActions: [], isActive: true, showToUser: true, createdAt: '2024-01-01T10:00:00Z', updatedAt: '2024-01-01T10:00:00Z', createdBy: 'system', lastModifiedBy: 'system' },
  { id: 'hb-8002', hbErrorCode: '8002', originalSystemMessage: 'ERR_PICKUP_CARD', hbErrorMessage: 'Bu karta banka tarafından el konulmalıdır.', categoryId: 'cat-4', severity: 'critical', shouldRetry: false, suggestedActions: [], isActive: true, showToUser: false, createdAt: '2024-01-01T10:00:00Z', updatedAt: '2024-01-01T10:00:00Z', createdBy: 'system', lastModifiedBy: 'system' },

  // Kategori 5: İşlem Akışı Hatası
  { id: 'hb-5001', hbErrorCode: '5001', originalSystemMessage: 'ERR_INVALID_AMOUNT', hbErrorMessage: 'İşlem tutarı geçersiz.', categoryId: 'cat-5', severity: 'high', shouldRetry: false, suggestedActions: [], isActive: true, showToUser: false, createdAt: '2024-01-01T10:00:00Z', updatedAt: '2024-01-01T10:00:00Z', createdBy: 'system', lastModifiedBy: 'system' },
  { id: 'hb-5002', hbErrorCode: '5002', originalSystemMessage: 'ERR_DUPLICATE_TRANSACTION', hbErrorMessage: 'Bu işlem daha önce gerçekleştirilmiş.', categoryId: 'cat-5', severity: 'low', shouldRetry: false, suggestedActions: [], isActive: true, showToUser: true, createdAt: '2024-01-01T10:00:00Z', updatedAt: '2024-01-01T10:00:00Z', createdBy: 'system', lastModifiedBy: 'system' },
  
  // Kategori 6: Cüzdan Hatası
  { id: 'hb-6001', hbErrorCode: '6001', originalSystemMessage: 'ERR_WALLET_NOT_FOUND', hbErrorMessage: 'Cüzdan bulunamadı.', categoryId: 'cat-6', severity: 'high', shouldRetry: false, suggestedActions: [], isActive: true, showToUser: true, createdAt: '2024-01-01T10:00:00Z', updatedAt: '2024-01-01T10:00:00Z', createdBy: 'system', lastModifiedBy: 'system' },
  { id: 'hb-6002', hbErrorCode: '6002', originalSystemMessage: 'ERR_WALLET_INACTIVE', hbErrorMessage: 'Cüzdanınız geçici olarak kullanıma kapalıdır.', categoryId: 'cat-6', severity: 'high', shouldRetry: false, suggestedActions: [], isActive: true, showToUser: true, createdAt: '2024-01-01T10:00:00Z', updatedAt: '2024-01-01T10:00:00Z', createdBy: 'system', lastModifiedBy: 'system' },
  { id: 'hb-6003', hbErrorCode: '6003', originalSystemMessage: 'ERR_WALLET_INSUFFICIENT_BALANCE', hbErrorMessage: 'Cüzdan bakiyesi yetersiz.', categoryId: 'cat-6', severity: 'high', shouldRetry: false, suggestedActions: [], isActive: true, showToUser: true, createdAt: '2024-01-01T10:00:00Z', updatedAt: '2024-01-01T10:00:00Z', createdBy: 'system', lastModifiedBy: 'system' },
];

// Provider Error Mappings - Provider kodlarının HB kodlarına mapping'i
const mockErrorMappings: ErrorMapping[] = [
  // Master Mappings (Hepsipay, Wallet, Paygate)
  { id: 'map-1', posProviderId: '1', providerErrorCode: '1001', providerErrorMessage: 'ERR_INVALID_CARD_DATA', userFriendlyMessage: '', hbErrorCodeId: 'hb-1001', categoryId: 'cat-1', isActive: true, createdAt: '2024-01-10T10:00:00Z', updatedAt: '2024-01-10T10:00:00Z', createdBy: 'system', lastModifiedBy: 'system'},
  { id: 'map-2', posProviderId: '1', providerErrorCode: '2005', providerErrorMessage: 'ERR_GATEWAY_TIMEOUT', userFriendlyMessage: '', hbErrorCodeId: 'hb-2005', categoryId: 'cat-2', isActive: true, createdAt: '2024-01-10T10:00:00Z', updatedAt: '2024-01-10T10:00:00Z', createdBy: 'system', lastModifiedBy: 'system'},
  { id: 'map-3', posProviderId: '3', providerErrorCode: '6003', providerErrorMessage: 'ERR_WALLET_INSUFFICIENT_BALANCE', userFriendlyMessage: '', hbErrorCodeId: 'hb-6003', categoryId: 'cat-6', isActive: true, createdAt: '2024-01-10T10:00:00Z', updatedAt: '2024-01-10T10:00:00Z', createdBy: 'system', lastModifiedBy: 'system'},
  { id: 'map-4', posProviderId: '2', providerErrorCode: '3010', providerErrorMessage: 'ERR_3D_SECURE_FAILURE', userFriendlyMessage: '', hbErrorCodeId: 'hb-3010', categoryId: 'cat-4', isActive: true, createdAt: '2024-01-10T10:00:00Z', updatedAt: '2024-01-10T10:00:00Z', createdBy: 'system', lastModifiedBy: 'system'},
  { id: 'map-5', posProviderId: '1', providerErrorCode: '2001', providerErrorMessage: 'ERR_BANK_DECLINED', userFriendlyMessage: '', hbErrorCodeId: 'hb-2001', categoryId: 'cat-1', isActive: true, createdAt: '2024-01-10T10:00:00Z', updatedAt: '2024-01-10T10:00:00Z', createdBy: 'system', lastModifiedBy: 'system'},
  { id: 'map-6', posProviderId: '3', providerErrorCode: '6001', providerErrorMessage: 'ERR_WALLET_NOT_FOUND', userFriendlyMessage: '', hbErrorCodeId: 'hb-6001', categoryId: 'cat-6', isActive: true, createdAt: '2024-01-10T10:00:00Z', updatedAt: '2024-01-10T10:00:00Z', createdBy: 'system', lastModifiedBy: 'system'},
  { id: 'map-7', posProviderId: '2', providerErrorCode: '8001', providerErrorMessage: 'ERR_LOST_OR_STOLEN_CARD', userFriendlyMessage: '', hbErrorCodeId: 'hb-8001', categoryId: 'cat-4', isActive: true, createdAt: '2024-01-10T10:00:00Z', updatedAt: '2024-01-10T10:00:00Z', createdBy: 'system', lastModifiedBy: 'system'},
  { id: 'map-8', posProviderId: '1', providerErrorCode: '5002', providerErrorMessage: 'ERR_DUPLICATE_TRANSACTION', userFriendlyMessage: '', hbErrorCodeId: 'hb-5002', categoryId: 'cat-5', isActive: true, createdAt: '2024-01-10T10:00:00Z', updatedAt: '2024-01-10T10:00:00Z', createdBy: 'system', lastModifiedBy: 'system'},
  
  // External Provider Mappings
  // Craftgate
  { id: 'map-9', posProviderId: '4', providerErrorCode: 'CG-100', providerErrorMessage: 'Invalid Card Number or Exp.', userFriendlyMessage: '', hbErrorCodeId: 'hb-1001', categoryId: 'cat-1', isActive: true, createdAt: '2024-01-11T11:00:00Z', updatedAt: '2024-01-11T11:00:00Z', createdBy: 'admin', lastModifiedBy: 'admin'},
  { id: 'map-10', posProviderId: '4', providerErrorCode: 'CG-250', providerErrorMessage: '3D Secure Auth Failed', userFriendlyMessage: '', hbErrorCodeId: 'hb-3010', categoryId: 'cat-4', isActive: true, createdAt: '2024-01-11T11:00:00Z', updatedAt: '2024-01-11T11:00:00Z', createdBy: 'admin', lastModifiedBy: 'admin'},
  { id: 'map-11', posProviderId: '4', providerErrorCode: 'CG-SYS-01', providerErrorMessage: 'System Under Maintenance', userFriendlyMessage: '', hbErrorCodeId: 'hb-7001', categoryId: 'cat-2', isActive: true, createdAt: '2024-01-11T11:00:00Z', updatedAt: '2024-01-11T11:00:00Z', createdBy: 'admin', lastModifiedBy: 'admin'},
  { id: 'map-12', posProviderId: '4', providerErrorCode: 'CG-FRD-05', providerErrorMessage: 'High-risk transaction detected', userFriendlyMessage: '', hbErrorCodeId: 'hb-2002', categoryId: 'cat-4', isActive: true, createdAt: '2024-01-11T11:00:00Z', updatedAt: '2024-01-11T11:00:00Z', createdBy: 'admin', lastModifiedBy: 'admin'},
  
  // Payten
  { id: 'map-13', posProviderId: '5', providerErrorCode: 'PT-51', providerErrorMessage: 'Not enough balance', userFriendlyMessage: '', hbErrorCodeId: 'hb-4004', categoryId: 'cat-1', isActive: false, createdAt: '2024-01-12T12:00:00Z', updatedAt: '2024-01-12T12:00:00Z', createdBy: 'admin', lastModifiedBy: 'admin'},
  { id: 'map-14', posProviderId: '5', providerErrorCode: 'PT-99', providerErrorMessage: 'System Timeout', userFriendlyMessage: '', hbErrorCodeId: 'hb-2005', categoryId: 'cat-2', isActive: true, createdAt: '2024-01-12T12:00:00Z', updatedAt: '2024-01-12T12:00:00Z', createdBy: 'admin', lastModifiedBy: 'admin'},
  { id: 'map-15', posProviderId: '5', providerErrorCode: 'PT-14', providerErrorMessage: 'Expired Card Date', userFriendlyMessage: '', hbErrorCodeId: 'hb-1002', categoryId: 'cat-3', isActive: true, createdAt: '2024-01-12T12:00:00Z', updatedAt: '2024-01-12T12:00:00Z', createdBy: 'admin', lastModifiedBy: 'admin'},
  { id: 'map-16', posProviderId: '5', providerErrorCode: 'PT-05', providerErrorMessage: 'Do not honour', userFriendlyMessage: '', hbErrorCodeId: 'hb-2001', categoryId: 'cat-1', isActive: true, createdAt: '2024-01-12T12:00:00Z', updatedAt: '2024-01-12T12:00:00Z', createdBy: 'admin', lastModifiedBy: 'admin'},
  { id: 'map-17', posProviderId: '5', providerErrorCode: 'PT-57', providerErrorMessage: 'Lost Card - Pickup', userFriendlyMessage: '', hbErrorCodeId: 'hb-8001', categoryId: 'cat-4', isActive: true, createdAt: '2024-01-12T12:00:00Z', updatedAt: '2024-01-12T12:00:00Z', createdBy: 'admin', lastModifiedBy: 'admin'},
  { id: 'map-18', posProviderId: '4', providerErrorCode: 'CG-DUP-TRX', providerErrorMessage: 'Duplicate Transaction ID', userFriendlyMessage: '', hbErrorCodeId: 'hb-5002', categoryId: 'cat-5', isActive: true, createdAt: '2024-01-11T11:00:00Z', updatedAt: '2024-01-11T11:00:00Z', createdBy: 'admin', lastModifiedBy: 'admin'},
  { id: 'map-19', posProviderId: '5', providerErrorCode: 'PT-CVV', providerErrorMessage: 'CVV Check Failed', userFriendlyMessage: '', hbErrorCodeId: 'hb-1003', categoryId: 'cat-3', isActive: true, createdAt: '2024-01-12T12:00:00Z', updatedAt: '2024-01-12T12:00:00Z', createdBy: 'admin', lastModifiedBy: 'admin'},
  { id: 'map-20', posProviderId: '4', providerErrorCode: 'CG-INV-MER', providerErrorMessage: 'Invalid Merchant', userFriendlyMessage: '', hbErrorCodeId: 'hb-7002', categoryId: 'cat-2', isActive: true, createdAt: '2024-01-11T11:00:00Z', updatedAt: '2024-01-11T11:00:00Z', createdBy: 'admin', lastModifiedBy: 'admin'},
];

// HB Error Code lookup helper
const getHBErrorCodeById = (id: string | null | undefined): HBErrorCode | undefined => {
    if (!id) return undefined;
    return mockHBErrorCodes.find(hb => hb.id === id);
};

// Extended ErrorMapping interface for display with HB data
export interface ExtendedErrorMapping extends Omit<ErrorMapping, 'categoryId'> {
    hbErrorCode?: HBErrorCode;
    category?: ErrorCategory;
    posProvider?: POSProvider;
}

// Helper function to get extended mapping with HB data
const getExtendedMappings = (mappings: ErrorMapping[]): ExtendedErrorMapping[] => {
    return mappings.map(mapping => {
        const { categoryId, ...restOfMapping } = mapping;
        return {
            ...restOfMapping,
            hbErrorCode: getHBErrorCodeById(mapping.hbErrorCodeId),
            category: mockErrorCategories.find(c => c.id === categoryId),
            posProvider: mockPOSProviders.find(p => p.id === mapping.posProviderId)
        };
    });
};


// Mock error logs
const generateMockErrorLogs = (): ErrorLog[] => {
  const logs: ErrorLog[] = [];
  const errorCodes = ['1501', '1520', '1534', 'AMEX_CAN_USE_ONLY_MR', 'ERR20005'];
  
  for (let i = 0; i < 100; i++) {
    const errorCode = errorCodes[Math.floor(Math.random() * errorCodes.length)];
    const mapping = mockErrorMappings.find(m => m.providerErrorCode === errorCode);
    
    logs.push({
      id: `log-${i + 1}`,
      errorMappingId: mapping?.id,
      posProviderId: mapping?.posProviderId || '1',
      merchantId: `M${Math.floor(Math.random() * 100000)}`,
      originalErrorCode: errorCode,
      originalErrorMessage: mapping?.providerErrorMessage,
      userFriendlyMessage: getHBErrorCodeById(mapping?.hbErrorCodeId || '')?.hbErrorMessage || 'Beklenmeyen hata',
      transactionId: `TXN${Date.now()}-${i}`,
      userId: `user-${Math.floor(Math.random() * 1000)}`,
      userAgent: 'Mozilla/5.0...',
      ipAddress: `192.168.1.${Math.floor(Math.random() * 255)}`,
      occurredAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      resolved: Math.random() > 0.7,
      resolvedAt: Math.random() > 0.5 ? new Date().toISOString() : undefined,
      resolvedBy: Math.random() > 0.5 ? 'support-team' : undefined,
      resolutionNotes: Math.random() > 0.5 ? 'Kullanıcı farklı kart ile tekrar denedi' : undefined
    });
  }
  
  return logs.sort((a, b) => new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime());
};

const mockErrorLogs = generateMockErrorLogs();

// Service functions
export const posErrorService = {
  // POS Providers
  async getPOSProviders(): Promise<POSProvider[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockPOSProviders.filter(p => p.isActive);
  },

  async createPOSProvider(provider: Omit<POSProvider, 'id' | 'createdAt' | 'updatedAt'>): Promise<POSProvider> {
    await new Promise(resolve => setTimeout(resolve, 500));
    const newProvider: POSProvider = {
      ...provider,
      id: `pos-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    mockPOSProviders.push(newProvider);
    return newProvider;
  },

  async updatePOSProvider(id: string, updates: Partial<POSProvider>): Promise<POSProvider> {
    await new Promise(resolve => setTimeout(resolve, 500));
    const index = mockPOSProviders.findIndex(p => p.id === id);
    if (index === -1) throw new Error('POS Provider not found');
    
    mockPOSProviders[index] = {
      ...mockPOSProviders[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    return mockPOSProviders[index];
  },

  // Error Categories
  async getErrorCategories(): Promise<ErrorCategory[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return mockErrorCategories;
  },

  async createErrorCategory(category: Omit<ErrorCategory, 'id'>): Promise<ErrorCategory> {
    await new Promise(resolve => setTimeout(resolve, 500));
    const newCategory: ErrorCategory = {
      ...category,
      id: `cat-${Date.now()}`
    };
    mockErrorCategories.push(newCategory);
    return newCategory;
  },

  // HB Error Codes
  async getHBErrorCodes(): Promise<HBErrorCode[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...mockHBErrorCodes];
  },

  async createHBErrorCode(hbCode: Omit<HBErrorCode, 'id' | 'createdBy' | 'lastModifiedBy'>): Promise<HBErrorCode> {
    await new Promise(resolve => setTimeout(resolve, 500));
    const newHBCode: HBErrorCode = {
      ...hbCode,
      id: `hb-${Date.now()}`,
      createdBy: 'current-user', // replace with actual user
      lastModifiedBy: 'current-user',
    };
    mockHBErrorCodes.push(newHBCode);
    return newHBCode;
  },

  // Error Mappings (Provider -> HB Code mappings)
  async getErrorMappings(filters?: {
    posProviderId?: string;
    search?: string;
    isActive?: boolean;
    isMapped?: boolean;
    categoryId?: string;
  }): Promise<ExtendedErrorMapping[]> {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    let filtered = [...mockErrorMappings];
    
    if (filters?.posProviderId) {
      filtered = filtered.filter(m => m.posProviderId === filters.posProviderId);
    }
     if (filters?.categoryId) {
      filtered = filtered.filter(m => m.categoryId === filters.categoryId);
    }
    if (filters?.isMapped !== undefined) {
      filtered = filtered.filter(m => {
        const hasMapping = !!m.hbErrorCodeId;
        return hasMapping === filters.isMapped;
      });
    }
    if (filters?.search) {
      const search = filters.search.toLowerCase();
      filtered = filtered.filter(m => {
        const hbCode = getHBErrorCodeById(m.hbErrorCodeId);
        const category = mockErrorCategories.find(c => c.id === m.categoryId);
        const provider = mockPOSProviders.find(p => p.id === m.posProviderId);

        return (
          m.providerErrorCode.toLowerCase().includes(search) ||
          m.providerErrorMessage?.toLowerCase().includes(search) ||
          m.userFriendlyMessage.toLowerCase().includes(search) ||
          hbCode?.hbErrorCode.toLowerCase().includes(search) ||
          hbCode?.hbErrorMessage.toLowerCase().includes(search) ||
          category?.name.toLowerCase().includes(search) ||
          provider?.name.toLowerCase().includes(search)
        );
      });
    }
    if (filters?.isActive !== undefined) {
      filtered = filtered.filter(m => m.isActive === filters.isActive);
    }
    
    return getExtendedMappings(filtered);
  },

  async createErrorMapping(mapping: Omit<ErrorMapping, 'id' | 'createdBy' | 'lastModifiedBy'>): Promise<ErrorMapping> {
    await new Promise(resolve => setTimeout(resolve, 600));
    const newMapping: ErrorMapping = {
      ...mapping,
      id: `map-${Date.now()}`,
      createdBy: 'current-user',
      lastModifiedBy: 'current-user'
    };
    mockErrorMappings.push(newMapping);
    return newMapping;
  },

  async updateErrorMapping(id: string, updates: Partial<Omit<ErrorMapping, 'id' | 'createdBy' | 'lastModifiedBy'>>): Promise<ErrorMapping> {
    await new Promise(resolve => setTimeout(resolve, 600));
    const index = mockErrorMappings.findIndex(m => m.id === id);
    if (index === -1) throw new Error('Error mapping not found');
    
    mockErrorMappings[index] = {
      ...mockErrorMappings[index],
      ...updates,
      lastModifiedBy: 'current-user'
    };
    return mockErrorMappings[index];
  },

  async deleteErrorMapping(id: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 400));
    const index = mockErrorMappings.findIndex(m => m.id === id);
    if (index > -1) {
        mockErrorMappings.splice(index, 1);
    }
  },

  // Error Logs
  async getErrorLogs(filters?: {
    posProviderId?: string;
    errorCode?: string;
    dateFrom?: string;
    dateTo?: string;
    resolved?: boolean;
    limit?: number;
  }): Promise<ErrorLog[]> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    let filtered = [...mockErrorLogs];
    
    if (filters?.posProviderId) {
      filtered = filtered.filter(l => l.posProviderId === filters.posProviderId);
    }
    if (filters?.errorCode) {
      filtered = filtered.filter(l => l.originalErrorCode === filters.errorCode);
    }
    if (filters?.resolved !== undefined) {
      filtered = filtered.filter(l => l.resolved === filters.resolved);
    }
    if (filters?.dateFrom) {
      filtered = filtered.filter(l => l.occurredAt >= filters.dateFrom!);
    }
    if (filters?.dateTo) {
      filtered = filtered.filter(l => l.occurredAt <= filters.dateTo!);
    }
    
    if (filters?.limit) {
      filtered = filtered.slice(0, filters.limit);
    }
    
    return filtered;
  },

  // Error Statistics
  async getErrorStats(posProviderId?: string, dateRange?: { from: string; to: string }): Promise<ErrorStats[]> {
    await new Promise(resolve => setTimeout(resolve, 600));
    
    let logs = mockErrorLogs;
    if (posProviderId) {
      logs = logs.filter(l => l.posProviderId === posProviderId);
    }
    if (dateRange) {
      logs = logs.filter(l => l.occurredAt >= dateRange.from && l.occurredAt <= dateRange.to);
    }
    
    const stats: { [key: string]: ErrorStats } = {};
    
    logs.forEach(log => {
      const key = `${log.posProviderId}-${log.originalErrorCode}`;
      if (!stats[key]) {
        stats[key] = {
          posProviderId: log.posProviderId,
          errorCode: log.originalErrorCode,
          count: 0,
          lastOccurred: log.occurredAt,
          trend: 'stable',
          affectedMerchants: 0,
          averageResolutionTime: 0
        };
      }
      
      stats[key].count++;
      if (log.occurredAt > stats[key].lastOccurred) {
        stats[key].lastOccurred = log.occurredAt;
      }
    });
    
    return Object.values(stats).sort((a, b) => b.count - a.count);
  },

}; 