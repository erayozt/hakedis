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
    { id: '1', name: 'Genel Hata', description: 'Genel banka veya sistem hataları', color: '#ef4444', icon: 'AlertOctagon', priority: 1 },
    { id: '2', name: 'Bakiye/Limit Hatası', description: 'Yetersiz bakiye, limit veya finansal retler', color: '#f97316', icon: 'DollarSign', priority: 2 },
    { id: '3', name: 'Kart Bilgisi Hatası', description: 'Hatalı kart no, son kullanma tarihi, CVV vb.', color: '#eab308', icon: 'CreditCard', priority: 2 },
    { id: '4', name: 'Güvenlik/Fraud', description: 'Şüpheli işlem, 3D Secure, bloke kart vb.', color: '#8b5cf6', icon: 'Shield', priority: 1 },
    { id: '5', name: 'Teknik Hata', description: 'Zaman aşımı, bağlantı hatası, sistemsel sorunlar', color: '#6b7280', icon: 'ServerCog', priority: 3 },
    { id: '6', name: 'Cüzdan Hatası', description: 'Cüzdanla ilgili spesifik hatalar', color: '#10b981', icon: 'Wallet', priority: 2 },
];


// HB Error Codes - Ana hata mesajları (Hepsipay standart hata kodları)
const mockHBErrorCodes: HBErrorCode[] = [
  { id: 'hb-001', hbErrorCode: 'HB-1001', hbErrorMessage: 'İşlem Başarısız', categoryId: '1', isActive: true, createdBy: 'system', lastModifiedBy: 'system' },
  { id: 'hb-002', hbErrorCode: 'HB-1002', hbErrorMessage: 'Limit Yetersiz', categoryId: '2', isActive: true, createdBy: 'system', lastModifiedBy: 'system' },
  { id: 'hb-003', hbErrorCode: 'HB-1003', hbErrorMessage: 'Geçersiz Kart Bilgisi', categoryId: '3', isActive: true, createdBy: 'system', lastModifiedBy: 'system' },
  { id: 'hb-004', hbErrorCode: 'HB-2001', hbErrorMessage: 'Banka Onay Vermedi', categoryId: '1', isActive: true, createdBy: 'system', lastModifiedBy: 'system' },
  { id: 'hb-005', hbErrorCode: 'HB-2002', hbErrorMessage: 'Şüpheli İşlem', categoryId: '4', isActive: true, createdBy: 'system', lastModifiedBy: 'system' },
  { id: 'hb-006', hbErrorCode: 'HB-3001', hbErrorMessage: 'Teknik Hata', categoryId: '5', isActive: false, createdBy: 'system', lastModifiedBy: 'system' },
  { id: 'hb-007', hbErrorCode: 'HB-3002', hbErrorMessage: 'Zaman Aşımı', categoryId: '5', isActive: true, createdBy: 'system', lastModifiedBy: 'system' },
  { id: 'hb-008', hbErrorCode: 'HB-4001', hbErrorMessage: 'Hatalı Tutar', categoryId: '3', isActive: true, createdBy: 'system', lastModifiedBy: 'system' },
  { id: 'hb-009', hbErrorCode: 'HB-4002', hbErrorMessage: 'Hatalı Taksit', categoryId: '3', isActive: true, createdBy: 'system', lastModifiedBy: 'system' },
  { id: 'hb-010', hbErrorCode: 'HB-5001', hbErrorMessage: '3D Secure Hatası', categoryId: '4', isActive: true, createdBy: 'system', lastModifiedBy: 'system' },
  { id: 'hb-011', hbErrorCode: 'HB-5002', hbErrorMessage: 'Kayıp/Çalıntı Kart', categoryId: '2', isActive: true, createdBy: 'system', lastModifiedBy: 'system' },
  { id: 'hb-012', hbErrorCode: 'HB-5003', hbErrorMessage: 'Karta El Konulmalı', categoryId: '2', isActive: true, createdBy: 'system', lastModifiedBy: 'system' },
  { id: 'hb-013', hbErrorCode: 'HB-6001', hbErrorMessage: 'Üye İşyeri Kapalı', categoryId: '1', isActive: true, createdBy: 'system', lastModifiedBy: 'system' },
  { id: 'hb-014', hbErrorCode: 'HB-6002', hbErrorMessage: 'Provizyon İptal Edilemedi', categoryId: '1', isActive: true, createdBy: 'system', lastModifiedBy: 'system' },
  { id: 'hb-015', hbErrorCode: 'HB-7001', hbErrorMessage: 'Cüzdan Bakiyesi Yetersiz', categoryId: '6', isActive: true, createdBy: 'system', lastModifiedBy: 'system' },
  { id: 'hb-016', hbErrorCode: 'HB-7002', hbErrorMessage: 'Cüzdan Bloke Edilmiş', categoryId: '6', isActive: true, createdBy: 'system', lastModifiedBy: 'system' },
  { id: 'hb-017', hbErrorCode: 'HB-8001', hbErrorMessage: 'Geçersiz CVV', categoryId: '3', isActive: true, createdBy: 'system', lastModifiedBy: 'system' },
  { id: 'hb-018', hbErrorCode: 'HB-8002', hbErrorMessage: 'Geçersiz Son Kullanma Tarihi', categoryId: '3', isActive: true, createdBy: 'system', lastModifiedBy: 'system' },
  { id: 'hb-019', hbErrorCode: 'HB-9001', hbErrorMessage: 'İzin Verilmeyen İşlem', categoryId: '4', isActive: true, createdBy: 'system', lastModifiedBy: 'system' },
  { id: 'hb-020', hbErrorCode: 'HB-9002', hbErrorMessage: 'Sistem Bakımda', categoryId: '5', isActive: true, createdBy: 'system', lastModifiedBy: 'system' },
  { id: 'hb-021', hbErrorCode: 'W-300', hbErrorMessage: 'Cüzdan bulunamadı', categoryId: '6', isActive: true, createdBy: 'system', lastModifiedBy: 'system' },
  { id: 'hb-022', hbErrorCode: 'W-100', hbErrorMessage: 'Cüzdan bakiyeniz yetersiz', categoryId: '6', isActive: true, createdBy: 'system', lastModifiedBy: 'system' },
  { id: 'hb-023', hbErrorCode: 'W-101', hbErrorMessage: 'Cüzdanınız geçici olarak kullanıma kapatılmıştır', categoryId: '6', isActive: true, createdBy: 'system', lastModifiedBy: 'system' },
  { id: 'hb-024', hbErrorCode: 'PG-05', hbErrorMessage: 'Do not honour', categoryId: '1', isActive: true, createdBy: 'system', lastModifiedBy: 'system' },
  { id: 'hb-025', hbErrorCode: 'PG-51', hbErrorMessage: 'Insufficient funds', categoryId: '2', isActive: true, createdBy: 'system', lastModifiedBy: 'system' },
  { id: 'hb-026', hbErrorCode: 'PG-54', hbErrorMessage: 'Expired card', categoryId: '3', isActive: true, createdBy: 'system', lastModifiedBy: 'system' },
  { id: 'hb-027', hbErrorCode: 'PG-14', hbErrorMessage: 'Invalid card number', categoryId: '3', isActive: true, createdBy: 'system', lastModifiedBy: 'system' },
  { id: 'hb-028', hbErrorCode: 'PG-57', hbErrorMessage: 'Transaction not permitted', categoryId: '4', isActive: false, createdBy: 'system', lastModifiedBy: 'system' },
  { id: 'hb-029', hbErrorCode: 'W-200', hbErrorMessage: 'Geçersiz cüzdan işlemi', categoryId: '6', isActive: true, createdBy: 'system', lastModifiedBy: 'system' },
  { id: 'hb-030', hbErrorCode: 'W-301', hbErrorMessage: 'Cüzdan servisine ulaşılamıyor', categoryId: '5', isActive: true, createdBy: 'system', lastModifiedBy: 'system' },
];

// Provider Error Mappings - Provider kodlarının HB kodlarına mapping'i
const mockErrorMappings: ErrorMapping[] = [
  // Hepsipay Gateway (Direct Mapping)
  { id: 'map-001', posProviderId: '1', providerErrorCode: 'HB-1001', userFriendlyMessage: 'İşleminiz banka tarafından reddedildi.', hbErrorCodeId: 'hb-001', categoryId: '1', isActive: true, createdBy: 'system', lastModifiedBy: 'system' },
  { id: 'map-002', posProviderId: '1', providerErrorCode: 'HB-1002', userFriendlyMessage: 'Kartınızın limiti yetersiz.', hbErrorCodeId: 'hb-002', categoryId: '2', isActive: true, createdBy: 'system', lastModifiedBy: 'system' },
  { id: 'map-003', posProviderId: '1', providerErrorCode: 'HB-1003', userFriendlyMessage: 'Lütfen kart bilgilerinizi kontrol ediniz.', hbErrorCodeId: 'hb-003', categoryId: '3', isActive: true, createdBy: 'system', lastModifiedBy: 'system' },

  // Paygate (Direct Mapping)
  { id: 'map-004', posProviderId: '2', providerErrorCode: 'PG-05', providerErrorMessage: 'Do not honour', userFriendlyMessage: 'Banka onay vermedi.', hbErrorCodeId: 'hb-024', categoryId: '1', isActive: true, createdBy: 'system', lastModifiedBy: 'system' },
  { id: 'map-005', posProviderId: '2', providerErrorCode: 'PG-51', providerErrorMessage: 'Insufficient funds', userFriendlyMessage: 'Limitiniz yetersiz.', hbErrorCodeId: 'hb-025', categoryId: '2', isActive: true, createdBy: 'system', lastModifiedBy: 'system' },

  // Wallet (Direct Mapping)
  { id: 'map-006', posProviderId: '3', providerErrorCode: 'W-100', userFriendlyMessage: 'Cüzdan bakiyeniz yetersiz.', hbErrorCodeId: 'hb-022', categoryId: '6', isActive: true, createdBy: 'system', lastModifiedBy: 'system' },

  // Craftgate (Mapped and Unmapped)
  { id: 'map-007', posProviderId: '4', providerErrorCode: '1051', providerErrorMessage: 'Yetersiz Bakiye', userFriendlyMessage: 'Kartınızın limiti yetersiz görünüyor.', hbErrorCodeId: 'hb-002', categoryId: '2', isActive: true, createdBy: 'system', lastModifiedBy: 'system' },
  { id: 'map-008', posProviderId: '4', providerErrorCode: '1054', providerErrorMessage: 'Vade sonu tarihi geçersiz.', userFriendlyMessage: 'Kartınızın son kullanma tarihini kontrol ediniz.', hbErrorCodeId: 'hb-018', categoryId: '3', isActive: true, createdBy: 'system', lastModifiedBy: 'system' },
  { id: 'map-009', posProviderId: '4', providerErrorCode: '2501', providerErrorMessage: 'Üye işyeri sahtekarlık şüphesi', userFriendlyMessage: 'Güvenlik nedeniyle işleminiz askıya alınmıştır.', hbErrorCodeId: null, categoryId: '4', isActive: true, createdBy: 'system', lastModifiedBy: 'system' },
  { id: 'map-010', posProviderId: '4', providerErrorCode: '3003', providerErrorMessage: 'Banka bağlantı hatası', userFriendlyMessage: 'Banka ile iletişim kurulamadı, lütfen tekrar deneyin.', hbErrorCodeId: 'hb-3001', categoryId: '5', isActive: true, createdBy: 'system', lastModifiedBy: 'system' },
  { id: 'map-011', posProviderId: '4', providerErrorCode: '3005', providerErrorMessage: 'Banka sistem hatası', userFriendlyMessage: 'Bankanızın sistemlerinde geçici bir sorun bulunmaktadır.', hbErrorCodeId: 'hb-3001', categoryId: '5', isActive: true, createdBy: 'system', lastModifiedBy: 'system' },
  { id: 'map-012', posProviderId: '4', providerErrorCode: '1001', providerErrorMessage: 'Banka onay vermiyor', userFriendlyMessage: 'Bankanız bu işleme onay vermedi.', hbErrorCodeId: 'hb-004', categoryId: '1', isActive: true, createdBy: 'system', lastModifiedBy: 'system' },
  { id: 'map-013', posProviderId: '4', providerErrorCode: '1007', providerErrorMessage: 'Karta el koy', userFriendlyMessage: 'Güvenlik sebebiyle kartınıza bankanız tarafından el konulacaktır.', hbErrorCodeId: 'hb-5003', categoryId: '2', isActive: true, createdBy: 'system', lastModifiedBy: 'system' },
  { id: 'map-014', posProviderId: '4', providerErrorCode: '1012', providerErrorMessage: 'Geçersiz işlem', userFriendlyMessage: 'Geçersiz bir işlem denediniz.', hbErrorCodeId: 'hb-9001', categoryId: '4', isActive: true, createdBy: 'system', lastModifiedBy: 'system' },
  { id: 'map-015', posProviderId: '4', providerErrorCode: '1014', providerErrorMessage: 'Geçersiz Kart Numarası', userFriendlyMessage: 'Kart numaranızı kontrol ediniz.', hbErrorCodeId: 'hb-003', categoryId: '3', isActive: true, createdBy: 'system', lastModifiedBy: 'system' },
  { id: 'map-016', posProviderId: '4', providerErrorCode: '1019', providerErrorMessage: 'İşlem tekrarı', userFriendlyMessage: 'Bu işlemi kısa süre önce denediniz, lütfen bekleyin.', hbErrorCodeId: null, categoryId: '4', isActive: true, createdBy: 'system', lastModifiedBy: 'system' },
  { id: 'map-017', posProviderId: '4', providerErrorCode: '1041', providerErrorMessage: 'Kayıp Kart', userFriendlyMessage: 'Kartınızın kayıp/çalıntı bildirimi mevcut.', hbErrorCodeId: 'hb-5002', categoryId: '2', isActive: true, createdBy: 'system', lastModifiedBy: 'system' },
  { id: 'map-018', posProviderId: '4', providerErrorCode: '1043', providerErrorMessage: 'Çalıntı Kart', userFriendlyMessage: 'Kartınızın kayıp/çalıntı bildirimi mevcut.', hbErrorCodeId: 'hb-5002', categoryId: '2', isActive: true, createdBy: 'system', lastModifiedBy: 'system' },
  { id: 'map-019', posProviderId: '4', providerErrorCode: '1057', providerErrorMessage: 'İşlem tipine izin verilmiyor', userFriendlyMessage: 'Kartınız bu tip işlemlere kapalıdır.', hbErrorCodeId: 'hb-9001', categoryId: '4', isActive: true, createdBy: 'system', lastModifiedBy: 'system' },
  { id: 'map-020', posProviderId: '4', providerErrorCode: '1058', providerErrorMessage: 'POS, terminale kapalı', userFriendlyMessage: 'Üye işyeri bu işlemlere kapalıdır.', hbErrorCodeId: 'hb-6001', categoryId: '1', isActive: true, createdBy: 'system', lastModifiedBy: 'system' },

  // Payten (Mapped and Unmapped)
  { id: 'map-021', posProviderId: '5', providerErrorCode: '01', providerErrorMessage: 'Bankanızı Arayın', userFriendlyMessage: 'Lütfen bankanızla iletişime geçin.', hbErrorCodeId: 'hb-2001', categoryId: '1', isActive: true, createdBy: 'system', lastModifiedBy: 'system' },
  { id: 'map-022', posProviderId: '5', providerErrorCode: '05', providerErrorMessage: 'Red/Onaylanmadı', userFriendlyMessage: 'İşleminiz banka tarafından reddedildi.', hbErrorCodeId: 'hb-2001', categoryId: '1', isActive: true, createdBy: 'system', lastModifiedBy: 'system' },
  { id: 'map-023', posProviderId: '5', providerErrorCode: '12', providerErrorMessage: 'Geçersiz İşlem', userFriendlyMessage: 'Geçersiz bir işlem denemesi.', hbErrorCodeId: 'hb-9001', categoryId: '4', isActive: true, createdBy: 'system', lastModifiedBy: 'system' },
  { id: 'map-024', posProviderId: '5', providerErrorCode: '14', providerErrorMessage: 'Geçersiz Kart', userFriendlyMessage: 'Kart bilgilerinizi kontrol ediniz.', hbErrorCodeId: 'hb-003', categoryId: '3', isActive: true, createdBy: 'system', lastModifiedBy: 'system' },
  { id: 'map-025', posProviderId: '5', providerErrorCode: '51', providerErrorMessage: 'Yetersiz Bakiye/Limit', userFriendlyMessage: 'Kartınızda yeterli bakiye bulunmamaktadır.', hbErrorCodeId: 'hb-002', categoryId: '2', isActive: true, createdBy: 'system', lastModifiedBy: 'system' },
  { id: 'map-026', posProviderId: '5', providerErrorCode: '54', providerErrorMessage: 'Süresi Dolmuş Kart', userFriendlyMessage: 'Kartınızın son kullanma tarihi geçmiş.', hbErrorCodeId: 'hb-018', categoryId: '3', isActive: true, createdBy: 'system', lastModifiedBy: 'system' },
  { id: 'map-027', posProviderId: '5', providerErrorCode: '57', providerErrorMessage: 'İşlem Tipine İzin Yok', userFriendlyMessage: 'Kartınız bu tür işlemlere kapalıdır.', hbErrorCodeId: 'hb-9001', categoryId: '4', isActive: true, createdBy: 'system', lastModifiedBy: 'system' },
  { id: 'map-028', posProviderId: '5', providerErrorCode: '91', providerErrorMessage: 'Banka Cevap Vermiyor', userFriendlyMessage: 'Banka ile iletişim kurulamadı.', hbErrorCodeId: 'hb-3001', categoryId: '5', isActive: true, createdBy: 'system', lastModifiedBy: 'system' },
  { id: 'map-029', posProviderId: '5', providerErrorCode: '96', providerErrorMessage: 'Sistem Hatası', userFriendlyMessage: 'Sistemsel bir sorun oluştu, lütfen tekrar deneyin.', hbErrorCodeId: 'hb-3001', categoryId: '5', isActive: true, createdBy: 'system', lastModifiedBy: 'system' },
  { id: 'map-030', posProviderId: '5', providerErrorCode: 'T01', providerErrorMessage: 'Provider Timeout', userFriendlyMessage: 'İşlem zaman aşımına uğradı.', hbErrorCodeId: null, categoryId: '5', isActive: true, createdBy: 'system', lastModifiedBy: 'system' },
  { id: 'map-031', posProviderId: '5', providerErrorCode: 'T02', providerErrorMessage: 'Duplicate Transaction', userFriendlyMessage: 'Bu işlemi daha önce denediniz.', hbErrorCodeId: null, categoryId: '4', isActive: true, createdBy: 'system', lastModifiedBy: 'system' },
  { id: 'map-032', posProviderId: '5', providerErrorCode: '41', providerErrorMessage: 'Kayıp Kart', userFriendlyMessage: 'Kartınız için kayıp bildirimi yapılmış.', hbErrorCodeId: 'hb-5002', categoryId: '2', isActive: true, createdBy: 'system', lastModifiedBy: 'system' },
  { id: 'map-033', posProviderId: '5', providerErrorCode: '43', providerErrorMessage: 'Çalıntı Kart', userFriendlyMessage: 'Kartınız için çalıntı bildirimi yapılmış.', hbErrorCodeId: 'hb-5002', categoryId: '2', isActive: true, createdBy: 'system', lastModifiedBy: 'system' },
  { id: 'map-034', posProviderId: '5', providerErrorCode: '33', providerErrorMessage: 'Süresi Dolmuş Kart', userFriendlyMessage: 'Kartınızın son kullanım tarihi geçmiş.', hbErrorCodeId: 'hb-018', categoryId: '3', isActive: true, createdBy: 'system', lastModifiedBy: 'system' },

  // More direct mappings for Hepsipay/Paygate/Wallet
  { id: 'map-035', posProviderId: '1', providerErrorCode: 'HB-2001', userFriendlyMessage: 'Bankanız tarafından onay verilmemiştir.', hbErrorCodeId: 'hb-004', categoryId: '1', isActive: true, createdBy: 'system', lastModifiedBy: 'system' },
  { id: 'map-036', posProviderId: '1', providerErrorCode: 'HB-5001', userFriendlyMessage: '3D Secure doğrulaması başarısız oldu.', hbErrorCodeId: 'hb-010', categoryId: '4', isActive: true, createdBy: 'system', lastModifiedBy: 'system' },
  { id: 'map-037', posProviderId: '2', providerErrorCode: 'PG-54', providerErrorMessage: 'Expired card', userFriendlyMessage: 'Kartınızın son kullanma tarihi geçmiş.', hbErrorCodeId: 'hb-026', categoryId: '3', isActive: true, createdBy: 'system', lastModifiedBy: 'system' },
  { id: 'map-038', posProviderId: '2', providerErrorCode: 'PG-57', providerErrorMessage: 'Transaction not permitted', userFriendlyMessage: 'Bu işleme izin verilmiyor.', hbErrorCodeId: 'hb-028', categoryId: '4', isActive: false, createdBy: 'system', lastModifiedBy: 'system' },
  { id: 'map-039', posProviderId: '3', providerErrorCode: 'W-101', userFriendlyMessage: 'Cüzdanınız geçici olarak kullanıma kapatılmıştır.', hbErrorCodeId: 'hb-023', categoryId: '6', isActive: true, createdBy: 'system', lastModifiedBy: 'system' },
  { id: 'map-040', posProviderId: '3', providerErrorCode: 'W-200', userFriendlyMessage: 'Geçersiz cüzdan işlemi.', hbErrorCodeId: 'hb-029', categoryId: '6', isActive: true, createdBy: 'system', lastModifiedBy: 'system' },
  
  // Adding even more data to reach the goal
  { id: 'map-041', posProviderId: '4', providerErrorCode: '1062', providerErrorMessage: 'Taksit bulunamadı', userFriendlyMessage: 'Seçtiğiniz taksit seçeneği geçersizdir.', hbErrorCodeId: 'hb-4002', categoryId: '3', isActive: true, createdBy: 'system', lastModifiedBy: 'system' },
  { id: 'map-042', posProviderId: '4', providerErrorCode: '1063', providerErrorMessage: 'CVV Hatalı', userFriendlyMessage: 'Güvenlik kodunu (CVV) hatalı girdiniz.', hbErrorCodeId: 'hb-017', categoryId: '3', isActive: true, createdBy: 'system', lastModifiedBy: 'system' },
  { id: 'map-043', posProviderId: '4', providerErrorCode: '2011', providerErrorMessage: 'Yinelenen işlem', userFriendlyMessage: 'Bu işlem daha önce gerçekleştirildi.', hbErrorCodeId: null, categoryId: '4', isActive: true, createdBy: 'system', lastModifiedBy: 'system' },
  { id: 'map-044', posProviderId: '4', providerErrorCode: '3100', providerErrorMessage: '3DSecure Doğrulama Hatası', userFriendlyMessage: '3D Secure şifrenizi yanlış girdiniz.', hbErrorCodeId: 'hb-010', categoryId: '4', isActive: true, createdBy: 'system', lastModifiedBy: 'system' },
  { id: 'map-045', posProviderId: '5', providerErrorCode: '02', providerErrorMessage: 'Bankanızı Arayın (Özel Durum)', userFriendlyMessage: 'Özel bir durum nedeniyle bankanızla görüşmeniz gerekmektedir.', hbErrorCodeId: 'hb-2001', categoryId: '1', isActive: true, createdBy: 'system', lastModifiedBy: 'system' },
  { id: 'map-046', posProviderId: '5', providerErrorCode: '08', providerErrorMessage: 'Kimlik Doğrulama Hatası', userFriendlyMessage: 'Kimliğiniz doğrulanamadı.', hbErrorCodeId: 'hb-010', categoryId: '4', isActive: true, createdBy: 'system', lastModifiedBy: 'system' },
  { id: 'map-047', posProviderId: '5', providerErrorCode: '30', providerErrorMessage: 'Format Hatası', userFriendlyMessage: 'Sistemsel bir formatlama hatası oluştu.', hbErrorCodeId: 'hb-3001', categoryId: '5', isActive: true, createdBy: 'system', lastModifiedBy: 'system' },
  { id: 'map-048', posProviderId: '5', providerErrorCode: '62', providerErrorMessage: 'Kısıtlı Kart', userFriendlyMessage: 'Kartınız kısıtlanmış. Bankanızla görüşün.', hbErrorCodeId: null, categoryId: '2', isActive: true, createdBy: 'system', lastModifiedBy: 'system' },
  { id: 'map-049', posProviderId: '1', providerErrorCode: 'HB-4001', userFriendlyMessage: 'Lütfen geçerli bir tutar giriniz.', hbErrorCodeId: 'hb-008', categoryId: '3', isActive: true, createdBy: 'system', lastModifiedBy: 'system' },
  { id: 'map-050', posProviderId: '1', providerErrorCode: 'HB-9002', userFriendlyMessage: 'Sistemde geçici bir bakım çalışması yapılmaktadır.', hbErrorCodeId: 'hb-020', categoryId: '5', isActive: true, createdBy: 'system', lastModifiedBy: 'system' },
  { id: 'map-051', posProviderId: '2', providerErrorCode: 'PG-01', providerErrorMessage: 'Refer to card issuer', userFriendlyMessage: 'Lütfen kartı aldığınız banka ile görüşün.', hbErrorCodeId: 'hb-2001', categoryId: '1', isActive: true, createdBy: 'system', lastModifiedBy: 'system' },
  { id: 'map-052', posProviderId: '2', providerErrorCode: 'PG-14', providerErrorMessage: 'Invalid card number', userFriendlyMessage: 'Geçersiz bir kart numarası girdiniz.', hbErrorCodeId: 'hb-027', categoryId: '3', isActive: true, createdBy: 'system', lastModifiedBy: 'system' },
  { id: 'map-053', posProviderId: '3', providerErrorCode: 'W-300', userFriendlyMessage: 'Cüzdan bulunamadı.', hbErrorCodeId: 'hb-021', categoryId: '6', isActive: true, createdBy: 'system', lastModifiedBy: 'system' },
  { id: 'map-054', posProviderId: '3', providerErrorCode: 'W-301', userFriendlyMessage: 'Cüzdan servisine ulaşılamıyor.', hbErrorCodeId: 'hb-030', categoryId: '5', isActive: true, createdBy: 'system', lastModifiedBy: 'system' },
  { id: 'map-055', posProviderId: '4', providerErrorCode: '4000', providerErrorMessage: 'İade Reddedildi', userFriendlyMessage: 'İade işlemi bankanız tarafından reddedildi.', hbErrorCodeId: null, categoryId: '1', isActive: true, createdBy: 'system', lastModifiedBy: 'system' },
  { id: 'map-056', posProviderId: '4', providerErrorCode: '4001', providerErrorMessage: 'İade tutarı geçersiz', userFriendlyMessage: 'Geçersiz bir iade tutarı denendi.', hbErrorCodeId: null, categoryId: '3', isActive: true, createdBy: 'system', lastModifiedBy: 'system' },
  { id: 'map-057', posProviderId: '5', providerErrorCode: '75', providerErrorMessage: 'PIN deneme sayısı aşıldı', userFriendlyMessage: 'Şifrenizi bir çok kez hatalı girdiniz.', hbErrorCodeId: null, categoryId: '2', isActive: true, createdBy: 'system', lastModifiedBy: 'system' },
  { id: 'map-058', posProviderId: '5', providerErrorCode: '82', providerErrorMessage: 'Hatalı CVV', userFriendlyMessage: 'Kartınızın güvenlik kodunu (CVV) yanlış girdiniz.', hbErrorCodeId: 'hb-017', categoryId: '3', isActive: true, createdBy: 'system', lastModifiedBy: 'system' },
  { id: 'map-059', posProviderId: '1', providerErrorCode: 'HB-8001', userFriendlyMessage: 'Geçersiz CVV girdiniz.', hbErrorCodeId: 'hb-017', categoryId: '3', isActive: true, createdBy: 'system', lastModifiedBy: 'system' },
  { id: 'map-060', posProviderId: '1', providerErrorCode: 'HB-7001', userFriendlyMessage: 'Hepsipay cüzdanınızda yeterli bakiye bulunmuyor.', hbErrorCodeId: 'hb-015', categoryId: '6', isActive: true, createdBy: 'system', lastModifiedBy: 'system' }
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