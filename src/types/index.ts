export interface Merchant {
  id: string;
  merchantNumber: string;
  merchantName: string;
  title: string;
  merchantType: 'SME' | 'KA';
  iban: string;
  otpType: 'none' | 'mail' | 'sms';
  otpTypeExpiresAt?: string | null; // ISO 8601 formatında tarih
}

export interface WalletSettlement {
  id: string;
  merchant: Merchant;
  settlementDate: string;
  totalPaymentAmount: number;
  totalPaymentCount: number;
  totalRefundAmount: number;
  totalRefundCount: number;
  totalNetAmount: number;
  moneySent: boolean;
  sendDate?: string;
  accrualConfirmation: boolean;
  valorDay: string;
  commissionRate: number;
  bsmv: number;
  totalCommissionAmount: number;
}

export interface StoredCardSettlement {
  id: string;
  merchant: Merchant;
  settlementDate: string;
  totalPaymentAmount: number;
  totalPaymentCount: number;
  totalRefundAmount: number;
  totalRefundCount: number;
  totalNetAmount: number;
  incomeTaxCollection: boolean;
  collectionDate?: string;
  valorDay: string;
  commissionRate: number;
  bsmv: number;
  totalCommissionAmount: number;
}

// Kullanıcı Yönetimi İçin Yeni Types

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  name: string; // firstName + lastName
  tckn?: string;
  avatar?: string;
  title?: string;
  roleId?: string;
  userType: 'admin' | 'merchant';
  isActive: boolean;
  isManuallyDeactivated?: boolean;
  ldapDeactivated?: boolean;
  lastLoginAt: string | null;
  merchantId?: string;
  merchant?: Merchant;
  createdAt: string;
}

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: Permission[];
  isSystemRole: boolean; // Sistem rolleri silinemez
  createdAt: string;
  updatedAt: string;
}

export interface Permission {
  id: string;
  module: string; // 'wallet-settlement', 'stored-card', 'users', 'roles' vs.
  action: string; // 'view', 'create', 'update', 'delete'
  displayName: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  targetUserId?: string;
  action: string;
  module: string;
  details: string;
  oldValue?: any;
  newValue?: any;
  timestamp: string;
  ipAddress: string;
  userAgent: string;
}

export interface UserFilters {
  userType?: 'merchant' | 'admin' | 'all';
  isActive?: boolean | 'all';
  roleId?: string | 'all';
  merchantId?: string | 'all';
  search?: string;
}

export interface RoleFormData {
  name: string;
  description: string;
  permissions: string[]; // Permission ID'leri
}

// POS Hata Yönetimi
export interface POSProvider {
  id: string;
  name: string;
  code: string; // Kısa kod (örn: "PAYTEN", "CRAFTGATE")
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ErrorCategory {
  id: string;
  name: string;
  description: string;
  color: string; // Hex color for UI
  icon: string; // Icon name
  priority: number; // 1=Critical, 2=High, 3=Medium, 4=Low
}

// HB Hata Kodları - Ana hata mesajı tablosu
export interface HBErrorCode {
  id: string;
  hbErrorCode: string; // HB error code (örn: "1501", "1502")
  originalSystemMessage: string; // Sistemden gelen ham, değiştirilemez mesaj
  hbErrorMessage: string; // Kullanıcı dostu, düzenlenebilir mesaj
  categoryId: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  shouldRetry: boolean;
  suggestedActions: string[];
  isActive: boolean;
  showToUser: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  lastModifiedBy: string;
}

// Provider Error Mapping - Provider kodlarının HB kodlarına mapping'i
export interface ErrorMapping {
  id: string;
  posProviderId: string;
  providerErrorCode: string;
  providerErrorMessage?: string;
  hbErrorCodeId?: string | null;
  userFriendlyMessage: string;
  categoryId: string;
  internalNotes?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  lastModifiedBy: string;
}

export interface ErrorLog {
  id: string;
  errorMappingId?: string;
  posProviderId: string;
  merchantId?: string;
  originalErrorCode: string;
  originalErrorMessage?: string;
  userFriendlyMessage: string;
  transactionId?: string;
  userId?: string;
  userAgent?: string;
  ipAddress?: string;
  occurredAt: string;
  resolved: boolean;
  resolvedAt?: string;
  resolvedBy?: string;
  resolutionNotes?: string;
}

export interface ErrorStats {
  posProviderId: string;
  errorCode: string;
  count: number;
  lastOccurred: string;
  trend: 'increasing' | 'decreasing' | 'stable';
  affectedMerchants: number;
  averageResolutionTime: number; // minutes
}

export interface ErrorTemplate {
  id: string;
  name: string;
  template: string; // Handlebars template
  variables: string[]; // Available variables
  description: string;
  categoryId: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}