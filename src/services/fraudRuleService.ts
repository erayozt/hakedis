import { FraudRule } from '../types';

// Mock Fraud Rules data
const mockFraudRules: FraudRule[] = [
  // M1001 - ABC Elektronik kuralları
  {
          id: 'rule-1',
      merchantId: 'M1001',
      parameter: 'amount',
    operator: '>',
    value: 5000,
    action: 'force_3d',
    reason: 'Yüksek tutarlı işlemler için güvenlik artırılması',
    isActive: true,
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z'
  },
  {
    id: 'rule-2',
    merchantId: 'M1001',
    parameter: 'amount',
    operator: '>=',
    value: 10000,
    action: 'reject',
    reason: 'Çok yüksek tutarlı işlemler için ek onay gerekiyor',
    isActive: true,
    createdAt: '2024-01-16T14:20:00Z',
    updatedAt: '2024-01-16T14:20:00Z'
  },
  
  // M1002 - Moda Butik kuralları
  {
    id: 'rule-3',
    merchantId: 'M1002',
    parameter: 'amount',
    operator: '>',
    value: 2500,
    action: 'force_3d',
    reason: 'Orta tutarlı işlemler için 3D Secure zorunluluğu',
    isActive: true,
    createdAt: '2024-01-17T09:15:00Z',
    updatedAt: '2024-01-17T09:15:00Z'
  },
  {
    id: 'rule-4',
    merchantId: 'M1002',
    parameter: 'amount',
    operator: '>=',
    value: 8000,
    action: 'reject',
    reason: 'Tekstil sektörü için yüksek tutar limiti',
    isActive: false,
    createdAt: '2024-01-18T11:45:00Z',
    updatedAt: '2024-01-20T16:30:00Z'
  },
  
  // M1003 - Kitap Dünyası kuralları
  {
    id: 'rule-5',
    merchantId: 'M1003',
    parameter: 'amount',
    operator: '>',
    value: 1500,
    action: 'force_3d',
    reason: 'KOBİ için düşük tutarlı 3D Secure koruması',
    isActive: true,
    createdAt: '2024-01-19T08:20:00Z',
    updatedAt: '2024-01-19T08:20:00Z'
  },
  {
    id: 'rule-6',
    merchantId: 'M1003',
    parameter: 'amount',
    operator: '<',
    value: 500,
    action: 'process_non_3d',
    reason: 'Düşük tutarlı kitap alımları için hızlı işlem',
    isActive: true,
    createdAt: '2024-01-20T13:10:00Z',
    updatedAt: '2024-01-20T13:10:00Z'
  },
  
  // M1004 - Spor Malzemeleri kuralları
  {
    id: 'rule-7',
    merchantId: 'M1004',
    parameter: 'amount',
    operator: '>',
    value: 3000,
    action: 'force_3d',
    reason: 'Spor ekipmanları için güvenlik önlemi',
    isActive: true,
    createdAt: '2024-01-21T10:00:00Z',
    updatedAt: '2024-01-21T10:00:00Z'
  },
  {
    id: 'rule-8',
    merchantId: 'M1004',
    parameter: 'amount',
    operator: '>=',
    value: 12000,
    action: 'reject',
    reason: 'Çok yüksek tutarlı spor malzemesi alımları şüpheli',
    isActive: true,
    createdAt: '2024-01-22T15:30:00Z',
    updatedAt: '2024-01-22T15:30:00Z'
  },
  
  // M1005 - Organik Market kuralları
  {
    id: 'rule-9',
    merchantId: 'M1005',
    parameter: 'amount',
    operator: '>',
    value: 1000,
    action: 'force_3d',
    reason: 'Organik ürünler için güvenlik kontrolü',
    isActive: true,
    createdAt: '2024-01-23T12:15:00Z',
    updatedAt: '2024-01-23T12:15:00Z'
  },
  
  // M1006 - Teknoloji Merkezi kuralları
  {
    id: 'rule-10',
    merchantId: 'M1006',
    parameter: 'amount',
    operator: '>',
    value: 7500,
    action: 'force_3d',
    reason: 'Teknoloji ürünleri için yüksek güvenlik',
    isActive: true,
    createdAt: '2024-01-24T09:45:00Z',
    updatedAt: '2024-01-24T09:45:00Z'
  },
  {
    id: 'rule-11',
    merchantId: 'M1006',
    parameter: 'amount',
    operator: '>=',
    value: 15000,
    action: 'reject',
    reason: 'Bilişim sektörü için fraud koruması',
    isActive: true,
    createdAt: '2024-01-25T14:00:00Z',
    updatedAt: '2024-01-25T14:00:00Z'
  },
  
  // M1007 - Bebek Ürünleri kuralları
  {
    id: 'rule-12',
    merchantId: 'M1007',
    parameter: 'amount',
    operator: '>',
    value: 2000,
    action: 'force_3d',
    reason: 'Bebek ürünleri için güvenli alışveriş',
    isActive: false,
    createdAt: '2024-01-26T11:20:00Z',
    updatedAt: '2024-01-28T10:15:00Z'
  },
  
  // M1008 - Mobilya Dünyası kuralları
  {
    id: 'rule-13',
    merchantId: 'M1008',
    parameter: 'amount',
    operator: '>',
    value: 4000,
    action: 'force_3d',
    reason: 'Mobilya sektörü için orta seviye güvenlik',
    isActive: true,
    createdAt: '2024-01-27T16:30:00Z',
    updatedAt: '2024-01-27T16:30:00Z'
  },
  {
    id: 'rule-14',
    merchantId: 'M1008',
    parameter: 'amount',
    operator: '<',
    value: 1000,
    action: 'process_non_3d',
    reason: 'Küçük mobilya aksesuarları için hızlı işlem',
    isActive: true,
    createdAt: '2024-01-28T08:45:00Z',
    updatedAt: '2024-01-28T08:45:00Z'
  }
];

export const fraudRuleService = {
  // Belirli bir merchant'ın kurallarını getir
  async getRulesByMerchant(merchantId: string): Promise<FraudRule[]> {
    await new Promise(resolve => setTimeout(resolve, 300)); // Simulated delay
    return mockFraudRules.filter(rule => rule.merchantId === merchantId);
  },

  // Yeni kural oluştur
  async createRule(ruleData: Omit<FraudRule, 'id' | 'createdAt' | 'updatedAt'>): Promise<FraudRule> {
    await new Promise(resolve => setTimeout(resolve, 500));
    const newRule: FraudRule = {
      ...ruleData,
      id: `rule-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    mockFraudRules.push(newRule);
    return newRule;
  },

  // Kuralı güncelle
  async updateRule(id: string, updates: Partial<Omit<FraudRule, 'id' | 'createdAt' | 'updatedAt'>>): Promise<FraudRule> {
    await new Promise(resolve => setTimeout(resolve, 500));
    const index = mockFraudRules.findIndex(rule => rule.id === id);
    if (index === -1) throw new Error('Rule not found');
    
    mockFraudRules[index] = {
      ...mockFraudRules[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    return mockFraudRules[index];
  },

  // Kuralı sil
  async deleteRule(id: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 400));
    const index = mockFraudRules.findIndex(rule => rule.id === id);
    if (index > -1) {
      mockFraudRules.splice(index, 1);
    }
  },

  // Kuralı aktif/pasif yap
  async toggleRuleStatus(id: string): Promise<FraudRule> {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = mockFraudRules.findIndex(rule => rule.id === id);
    if (index === -1) throw new Error('Rule not found');
    
    mockFraudRules[index].isActive = !mockFraudRules[index].isActive;
    mockFraudRules[index].updatedAt = new Date().toISOString();
    return mockFraudRules[index];
  }
};