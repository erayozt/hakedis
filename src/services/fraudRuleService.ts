import { FraudRule } from '../types';

// Mock Fraud Rules data - Geliştirilmiş ve çeşitlendirilmiş
const mockFraudRules: FraudRule[] = [
  // M1001 - ABC Elektronik kuralları
  {
    id: 'rule-1',
    merchantId: 'M1001',
    parameter: 'amount',
    operator: '>',
    value: 5000,
    action: 'force_3d',
    isActive: true,
    createdAt: '2024-07-28T10:30:00Z',
    updatedAt: '2024-07-28T10:30:00Z'
  },
  {
    id: 'rule-2',
    merchantId: 'M1001',
    parameter: 'cardType',
    operator: 'in',
    value: ['prepaid'],
    action: 'reject',
    isActive: true,
    createdAt: '2024-07-28T11:00:00Z',
    updatedAt: '2024-07-28T11:00:00Z'
  },
  
  // M1002 - Moda Butik kuralları
  {
    id: 'rule-3',
    merchantId: 'M1002',
    parameter: 'amount',
    operator: '>',
    value: 2500,
    action: 'force_3d',
    isActive: true,
    createdAt: '2024-07-27T09:15:00Z',
    updatedAt: '2024-07-27T09:15:00Z'
  },

  // Genel Kurallar (Tüm Üye İşyerleri için)
  {
    id: 'rule-g1',
    merchantId: 'all', // 'all' tüm işyerlerini temsil eder
    parameter: 'hourOfDay',
    operator: 'between',
    value: { start: '02:00', end: '05:00' },
    action: 'force_3d',
    isActive: true,
    createdAt: '2024-07-25T00:00:00Z',
    updatedAt: '2024-07-25T00:00:00Z'
  },
  {
    id: 'rule-g2',
    merchantId: 'all',
    parameter: 'cardCountry',
    operator: 'notIn',
    value: ['TR'],
    action: 'force_3d',
    isActive: true,
    createdAt: '2024-07-26T14:00:00Z',
    updatedAt: '2024-07-26T14:00:00Z'
  },
  {
    id: 'rule-g3',
    merchantId: 'all',
    parameter: 'ipAddress',
    operator: 'in',
    value: ['192.168.1.101', '10.0.0.5'],
    action: 'reject',
    isActive: false,
    createdAt: '2024-07-20T18:00:00Z',
    updatedAt: '2024-07-21T10:00:00Z'
  },
   {
    id: 'rule-7',
    merchantId: 'M1004',
    parameter: 'uniqueDeviceId',
    operator: 'in',
    value: ['device_xyz_12345'],
    action: 'reject',
    isActive: true,
    createdAt: '2024-07-29T16:00:00Z',
    updatedAt: '2024-07-29T16:00:00Z'
  },
];

const getRules = async (): Promise<FraudRule[]> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return JSON.parse(JSON.stringify(mockFraudRules));
};


export const fraudRuleService = {
  // Tüm kuralları getir (genel ve merchant özel)
  async getAllRules(): Promise<FraudRule[]> {
    return getRules();
  },

  // Belirli bir merchant'ın kurallarını ve genel kuralları getir
  async getRulesByMerchant(merchantId: string): Promise<FraudRule[]> {
    const allRules = await getRules();
    return allRules.filter(rule => rule.merchantId === merchantId || rule.merchantId === 'all');
  },

  // Yeni kural oluştur
  async createRule(ruleData: Omit<FraudRule, 'id' | 'createdAt' | 'updatedAt'>): Promise<FraudRule> {
    await new Promise(resolve => setTimeout(resolve, 300));
    const newRule: FraudRule = {
      ...ruleData,
      id: `rule-${Date.now()}-${Math.random()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    mockFraudRules.push(newRule);
    return newRule;
  },

  // Kuralı güncelle
  async updateRule(id: string, updates: Partial<Omit<FraudRule, 'id' | 'createdAt' | 'updatedAt' | 'merchantId'>>): Promise<FraudRule> {
    await new Promise(resolve => setTimeout(resolve, 300));
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
    await new Promise(resolve => setTimeout(resolve, 200));
    const index = mockFraudRules.findIndex(rule => rule.id === id);
    if (index > -1) {
      mockFraudRules.splice(index, 1);
    }
  },

  // Kuralı aktif/pasif yap
  async toggleRuleStatus(id: string): Promise<FraudRule> {
    await new Promise(resolve => setTimeout(resolve, 150));
    const index = mockFraudRules.findIndex(rule => rule.id === id);
    if (index === -1) throw new Error('Rule not found');
    
    mockFraudRules[index].isActive = !mockFraudRules[index].isActive;
    mockFraudRules[index].updatedAt = new Date().toISOString();
    return mockFraudRules[index];
  }
};
