import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "react-hot-toast";
import { 
  Plus, 
  Save, 
  Play, 
  Trash2, 
  Copy,
  Zap,
  Settings,
  Eye,
  Code,
  TestTube,
  Layers,
  GitBranch,
  Filter,
  ArrowRight,
  Brackets,
  Star,
  AlertTriangle,
  FileText
} from "lucide-react";
import { ParameterDefinition, ParameterCategory } from "./ParameterDefinitions";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";

// Gelişmiş Kural Koşulları
export type RuleCondition = {
  id: string;
  field: string;
  operator: 'equals' | 'not_equals' | 'greater_than' | 'less_than' | 'greater_equal' | 'less_equal' | 
           'contains' | 'not_contains' | 'starts_with' | 'ends_with' | 'regex' | 'in_list' | 'not_in_list' |
           'in_range' | 'not_in_range' | 'is_null' | 'is_not_null' | 'date_before' | 'date_after' | 'date_between';
  value: string | number | string[] | RangeValue | DateRangeValue;
  parameterCategory?: ParameterCategory;
  isNested?: boolean;
  nestedConditions?: RuleCondition[];
  nestedLogic?: 'AND' | 'OR';
};

export type RangeValue = {
  min?: number;
  max?: number;
};

export type DateRangeValue = {
  start?: string;
  end?: string;
};

// Type guards
const isRangeValue = (value: any): value is RangeValue => {
  return typeof value === 'object' && value !== null && ('min' in value || 'max' in value);
};

const isDateRangeValue = (value: any): value is DateRangeValue => {
  return typeof value === 'object' && value !== null && ('start' in value || 'end' in value);
};

// Gelişmiş Kural Grupları
export type RuleGroup = {
  id: string;
  logic: 'AND' | 'OR';
  conditions: RuleCondition[];
  name?: string;
  description?: string;
  isActive?: boolean;
};

// Ana Kural Yapısı - Geliştirilmiş
export type FraudRuleBuilder = {
  id: string;
  name: string;
  description: string;
  type: 'Realtime' | 'Offline' | 'Offline/Filter';
  status: 'active' | 'inactive' | 'draft';
  priority: 'low' | 'medium' | 'high' | 'critical';
  groups: RuleGroup[];
  groupLogic: 'AND' | 'OR'; // Gruplar arası mantık
  actions: RuleAction[];
  conditions?: ConditionalAction[]; // IF-THEN-ELSE yapıları
  createdAt: string;
  updatedBy: string;
  version?: number;
  tags?: string[];
};

// Conditional Actions (IF-THEN-ELSE)
export type ConditionalAction = {
  id: string;
  condition: string; // Koşul açıklaması
  thenActions: RuleAction[];
  elseActions?: RuleAction[];
};

// Gelişmiş Kural Aksiyon Tipleri
export type RuleAction = {
  id: string;
  type: 'block' | 'flag' | 'review' | 'score' | 'notify' | 'redirect' | 'log' | 'custom';
  value?: string | number;
  description: string;
  parameters?: Record<string, any>;
  weight?: number; // Risk skoru için ağırlık
};

// Simüle edilmiş mevcut parametreler (gerçekte API'den gelecek)
const mockParameters: ParameterDefinition[] = [
  // Ülke Kodları
  {
    id: 'country_tr',
    category: 'countries',
    code: 'TR',
    name: 'Türkiye',
    description: 'Yerli kartlar ve işlemler',
    riskLevel: 'low',
    isActive: true,
    createdAt: '2023-01-01',
    updatedAt: '2023-01-01',
    createdBy: 'system'
  },
  {
    id: 'country_us',
    category: 'countries',
    code: 'US',
    name: 'Amerika Birleşik Devletleri',
    description: 'ABD merkezli kartlar',
    riskLevel: 'medium',
    isActive: true,
    createdAt: '2023-01-01',
    updatedAt: '2023-01-01',
    createdBy: 'system'
  },
  {
    id: 'country_ir',
    category: 'countries',
    code: 'IR',
    name: 'İran',
    description: 'Yüksek riskli ülke',
    riskLevel: 'critical',
    isActive: true,
    createdAt: '2023-01-01',
    updatedAt: '2023-01-01',
    createdBy: 'system'
  },
  {
    id: 'country_sy',
    category: 'countries',
    code: 'SY',
    name: 'Suriye',
    description: 'Yüksek riskli ülke',
    riskLevel: 'critical',
    isActive: true,
    createdAt: '2023-01-01',
    updatedAt: '2023-01-01',
    createdBy: 'system'
  },
  {
    id: 'country_cu',
    category: 'countries',
    code: 'CU',
    name: 'Küba',
    description: 'Yüksek riskli ülke',
    riskLevel: 'critical',
    isActive: true,
    createdAt: '2023-01-01',
    updatedAt: '2023-01-01',
    createdBy: 'system'
  },
  // MCC Kodları
  {
    id: 'mcc_7995',
    category: 'mccCodes',
    code: '7995',
    name: 'Kumar ve Bahis',
    description: 'Online kumar',
    riskLevel: 'critical',
    isActive: true,
    createdAt: '2023-01-01',
    updatedAt: '2023-01-01',
    createdBy: 'system'
  },
  {
    id: 'mcc_6051',
    category: 'mccCodes',
    code: '6051',
    name: 'Kripto Para',
    description: 'Kripto para alım-satım',
    riskLevel: 'high',
    isActive: true,
    createdAt: '2023-01-01',
    updatedAt: '2023-01-01',
    createdBy: 'system'
  },
  {
    id: 'mcc_4829',
    category: 'mccCodes',
    code: '4829',
    name: 'Para Transferi',
    description: 'Havale ve para transfer',
    riskLevel: 'high',
    isActive: true,
    createdAt: '2023-01-01',
    updatedAt: '2023-01-01',
    createdBy: 'system'
  },
  // İşlem Tipleri
  {
    id: 'txn_type_5',
    category: 'transactionTypes',
    code: '5',
    name: 'Refund (Geri Ödeme)',
    description: 'İade işlemi',
    riskLevel: 'medium',
    isActive: true,
    createdAt: '2023-01-01',
    updatedAt: '2023-01-01',
    createdBy: 'system'
  },
  // Response Kodları
  {
    id: 'response_091',
    category: 'responseCodes',
    code: '091',
    name: 'Switch İnaktif',
    description: 'Sistem geçici olarak devre dışı',
    riskLevel: 'medium',
    isActive: true,
    createdAt: '2023-01-01',
    updatedAt: '2023-01-01',
    createdBy: 'system'
  },
  {
    id: 'response_096',
    category: 'responseCodes',
    code: '096',
    name: 'Sistem Hatası',
    description: 'Teknik sistem sorunu',
    riskLevel: 'medium',
    isActive: true,
    createdAt: '2023-01-01',
    updatedAt: '2023-01-01',
    createdBy: 'system'
  },
  {
    id: 'response_909',
    category: 'responseCodes',
    code: '909',
    name: 'Sistem Arızası',
    description: 'Genel sistem hatası',
    riskLevel: 'high',
    isActive: true,
    createdAt: '2023-01-01',
    updatedAt: '2023-01-01',
    createdBy: 'system'
  },
  {
    id: 'response_04',
    category: 'responseCodes',
    code: '04',
    name: 'Kart Bloke',
    description: 'Kartın kullanımı engellenmiş',
    riskLevel: 'high',
    isActive: true,
    createdAt: '2023-01-01',
    updatedAt: '2023-01-01',
    createdBy: 'system'
  },
  {
    id: 'response_43',
    category: 'responseCodes',
    code: '43',
    name: 'Çalıntı Kart',
    description: 'Kart çalıntı olarak bildirilmiş',
    riskLevel: 'critical',
    isActive: true,
    createdAt: '2023-01-01',
    updatedAt: '2023-01-01',
    createdBy: 'system'
  }
];

// Genişletilmiş veri alanları
const availableFields = [
  { key: 'amount', label: 'İşlem Tutarı', type: 'number', category: 'transaction' },
  { key: 'merchantId', label: 'İşyeri ID', type: 'string', category: 'merchant' },
  { key: 'mcc', label: 'MCC Kodu', type: 'list', parameterCategory: 'mccCodes' as ParameterCategory, category: 'merchant' },
  { key: 'country', label: 'Ülke', type: 'list', parameterCategory: 'countries' as ParameterCategory, category: 'location' },
  { key: 'transactionType', label: 'İşlem Tipi', type: 'list', parameterCategory: 'transactionTypes' as ParameterCategory, category: 'transaction' },
  { key: 'responseCode', label: 'Banka Cevap Kodu', type: 'list', parameterCategory: 'responseCodes' as ParameterCategory, category: 'response' },
  { key: 'transactionCount', label: 'İşlem Adedi', type: 'number', category: 'behavior' },
  { key: 'timeWindow', label: 'Zaman Aralığı (dk)', type: 'number', category: 'time' },
  { key: 'cardBin', label: 'Kart BIN', type: 'string', category: 'card' },
  { key: 'ipAddress', label: 'IP Adresi', type: 'string', category: 'location' },
  { key: 'userAgent', label: 'User Agent', type: 'string', category: 'device' },
  { key: 'transactionTime', label: 'İşlem Zamanı', type: 'datetime', category: 'time' },
  { key: 'velocityCount', label: 'Hız Kontrolü', type: 'number', category: 'behavior' },
  { key: 'riskScore', label: 'Risk Skoru', type: 'number', category: 'score' },
  { key: 'deviceFingerprint', label: 'Cihaz Parmak İzi', type: 'string', category: 'device' },
  { key: 'customField1', label: 'Özel Alan 1', type: 'string', category: 'custom' },
  { key: 'customField2', label: 'Özel Alan 2', type: 'number', category: 'custom' }
];

// Gelişmiş operatör tanımları
const operators = [
  // Temel karşılaştırmalar
  { value: 'equals', label: 'Eşittir', types: ['string', 'number', 'list', 'datetime'], category: 'basic' },
  { value: 'not_equals', label: 'Eşit Değildir', types: ['string', 'number', 'list', 'datetime'], category: 'basic' },
  
  // Sayısal karşılaştırmalar
  { value: 'greater_than', label: 'Büyüktür', types: ['number', 'datetime'], category: 'numeric' },
  { value: 'less_than', label: 'Küçüktür', types: ['number', 'datetime'], category: 'numeric' },
  { value: 'greater_equal', label: 'Büyük Eşittir', types: ['number', 'datetime'], category: 'numeric' },
  { value: 'less_equal', label: 'Küçük Eşittir', types: ['number', 'datetime'], category: 'numeric' },
  { value: 'in_range', label: 'Aralık İçinde', types: ['number'], category: 'numeric' },
  { value: 'not_in_range', label: 'Aralık Dışında', types: ['number'], category: 'numeric' },
  
  // Metin işlemleri
  { value: 'contains', label: 'İçerir', types: ['string'], category: 'text' },
  { value: 'not_contains', label: 'İçermez', types: ['string'], category: 'text' },
  { value: 'starts_with', label: 'İle Başlar', types: ['string'], category: 'text' },
  { value: 'ends_with', label: 'İle Biter', types: ['string'], category: 'text' },
  { value: 'regex', label: 'Regex Eşleşir', types: ['string'], category: 'text' },
  
  // Liste işlemleri
  { value: 'in_list', label: 'Listede Var', types: ['list'], category: 'list' },
  { value: 'not_in_list', label: 'Listede Yok', types: ['list'], category: 'list' },
  
  // Null kontrolleri
  { value: 'is_null', label: 'Boş', types: ['string', 'number'], category: 'null' },
  { value: 'is_not_null', label: 'Boş Değil', types: ['string', 'number'], category: 'null' },
  
  // Tarih işlemleri
  { value: 'date_before', label: 'Öncesinde', types: ['datetime'], category: 'date' },
  { value: 'date_after', label: 'Sonrasında', types: ['datetime'], category: 'date' },
  { value: 'date_between', label: 'Arasında', types: ['datetime'], category: 'date' }
];

// Mevcut fraud kurallarını yeni formata dönüştür
const convertLegacyRules = (): FraudRuleBuilder[] => {
  const legacyRules = [
    {
      id: 'same_bin_velocity',
      name: 'Aynı BIN ile İşlem Sıklığı',
      description: 'Belirtilen süre içerisinde aynı BIN ile X adetten fazla işlem denemesi yapılması durumunda tetiklenir.',
      status: 'active',
      type: 'Offline',
      parameters: { thresholdCount: 5, timeWindowMinutes: 10 }
    },
    {
      id: 'system_error_response',
      name: 'Sistem Hatası Cevabı',
      description: 'Belirtilen süre içerisinde belirli sistem hatası kodlarını alan işlem sayısının eşik değeri geçmesi durumunda tetiklenir.',
      status: 'active',
      type: 'Offline/Filter',
      parameters: { thresholdCount: 3, timeWindowMinutes: 60, responseCodes: ['091', '096', '909'] }
    },
    {
      id: 'high_amount_realtime',
      name: 'Yüksek Tutar Limiti',
      description: 'Tek bir işlemde belirtilen tutarın üzerinde işlem yapılması denendiğinde anlık olarak tetiklenir.',
      status: 'active',
      type: 'Realtime',
      parameters: { thresholdAmount: 10000 }
    },
    {
      id: 'risky_mcc_check',
      name: 'Riskli İş Yeri Kategorisi (MCC)',
      description: 'Yüksek riskli olarak tanımlanan MCC kodlarına sahip iş yerlerinden, belirli bir süre içinde aynı kartla yapılan işlem adedini veya tutarını kontrol eder.',
      status: 'inactive',
      type: 'Realtime',
      parameters: { mccCodes: ['7995', '6051'], thresholdAmount: 500, thresholdCount: 3, timeWindowMinutes: 60 }
    },
    {
      id: 'night_transactions',
      name: 'Gece Saatleri İşlemleri',
      description: 'Gece 01:00 - 07:00 arası belirli bir tutarın üzerindeki işlemleri izlemek için kurulan senaryo.',
      status: 'active',
      type: 'Offline',
      parameters: { thresholdAmount: 2500 }
    },
    {
      id: 'high_risk_country_check',
      name: 'Yüksek Riskli Ülke Kontrolü',
      description: 'Belirtilen yüksek riskli ülkelerden yapılan belirli bir tutarın üzerindeki işlemleri anlık olarak inceler.',
      status: 'inactive',
      type: 'Realtime',
      parameters: { countries: ['IR', 'KP', 'SY', 'CU'], thresholdAmount: 100 }
    },
    {
      id: 'suspicious_new_account',
      name: 'Şüpheli Yeni Hesap Aktivitesi',
      description: 'Oluşturulduktan sonraki ilk 1 saat içinde 2000 TL üzeri işlem yapan yeni hesapları inceler.',
      status: 'active',
      type: 'Offline',
      parameters: { thresholdAmount: 2000, timeWindowMinutes: 60 }
    },
    {
      id: 'multi_card_from_same_ip',
      name: 'Aynı IP\'den Çoklu Kart Denemesi',
      description: '15 dakika içinde aynı IP adresinden 3\'ten fazla farklı kart ile işlem denemesi yapılmasını kontrol eder.',
      status: 'active',
      type: 'Offline',
      parameters: { thresholdCount: 3, timeWindowMinutes: 15 }
    },
    {
      id: 'card_decline_velocity',
      name: 'Kart Red Sıklığı',
      description: 'Bir kart için 1 saat içinde 4\'ten fazla banka reddi alınması durumunu izler.',
      status: 'active',
      type: 'Offline',
      parameters: { thresholdCount: 4, timeWindowMinutes: 60 }
    },
    {
      id: 'risky_decline_codes',
      name: 'Riskli Ret Cevap Kodu Sıklığı',
      description: 'Belirli bir süre içinde, sık karşılaşılan ret kodlarını alan işyerlerini izler.',
      status: 'active',
      type: 'Offline',
      parameters: { thresholdCount: 5, timeWindowMinutes: 10, responseCodes: ['04', '14', '38', '41', '43'] }
    },
    {
      id: 'same_card_merchant_velocity',
      name: 'Aynı Kart ve İşyerinde Tekrarlı İşlem',
      description: 'Aynı kart ile aynı işyerinden 1 gün içerisinde X adet ve Y TL üzeri gerçekleşen işlemleri kontrol eder.',
      status: 'active',
      type: 'Offline',
      parameters: { thresholdCount: 3, thresholdAmount: 1000, timeWindowMinutes: 1440 }
    },
    {
      id: 'foreign_card_high_volume',
      name: 'Yurt Dışı Kartlarla Yüksek Hacimli İşlemler',
      description: '1 gün içerisinde, yurt dışı kartlarla yapılan işlem adedinin veya toplam tutarın belirli bir eşiği geçmesini kontrol eder.',
      status: 'inactive',
      type: 'Offline',
      parameters: { thresholdCount: 10, thresholdAmount: 20000, timeWindowMinutes: 1440 }
    },
    {
      id: 'same_bin_high_amount_velocity',
      name: 'Aynı BIN ile Yüksek Tutar ve Sıklık',
      description: 'Aynı BIN ile 1 saat içerisinde X adet ve Y TL üzeri güvensiz işlemleri kontrol eder.',
      status: 'active',
      type: 'Offline',
      parameters: { thresholdCount: 2, thresholdAmount: 5000, timeWindowMinutes: 60 }
    },
    {
      id: 'high_turnover_increase',
      name: 'Yüksek Ciro Kontrolü',
      description: 'Son 90 günlük cirosunu %30 aşan üye işyerleri için alarm üretir.',
      status: 'active',
      type: 'Offline',
      parameters: { percentageThreshold: 30, historicalLookbackDays: 90 }
    },
    {
      id: 'high_transaction_count_increase',
      name: 'Yüksek İşlem Adedi Kontrolü',
      description: 'Son 90 günlük işlem adedini %30 aşan üye işyerleri için alarm üretir.',
      status: 'active',
      type: 'Offline',
      parameters: { percentageThreshold: 30, historicalLookbackDays: 90 }
    },
    {
      id: 'suspicious_refund_amount',
      name: 'Şüpheli Geri Ödeme Tutarı',
      description: 'Belirli bir tutarın üzerindeki geri ödeme (Refund) işlemlerini inceler.',
      status: 'active',
      type: 'Realtime',
      parameters: { transactionType: 5, thresholdAmount: 5000 }
    }
  ];

  return legacyRules.map(rule => {
    const conditions: RuleCondition[] = [];
    
    // Legacy parametreleri yeni kural koşullarına dönüştür
    if (rule.parameters.thresholdCount) {
      conditions.push({
        id: `condition_count_${Date.now()}`,
        field: 'transactionCount',
        operator: 'greater_than',
        value: rule.parameters.thresholdCount
      });
    }
    
    if (rule.parameters.thresholdAmount) {
      conditions.push({
        id: `condition_amount_${Date.now()}`,
        field: 'amount',
        operator: 'greater_than',
        value: rule.parameters.thresholdAmount
      });
    }
    
    if (rule.parameters.timeWindowMinutes) {
      conditions.push({
        id: `condition_time_${Date.now()}`,
        field: 'timeWindow',
        operator: 'less_equal',
        value: rule.parameters.timeWindowMinutes
      });
    }
    
    if (rule.parameters.mccCodes) {
      conditions.push({
        id: `condition_mcc_${Date.now()}`,
        field: 'mcc',
        operator: 'in_list',
        value: rule.parameters.mccCodes
      });
    }
    
    if (rule.parameters.countries) {
      conditions.push({
        id: `condition_country_${Date.now()}`,
        field: 'country',
        operator: 'in_list',
        value: rule.parameters.countries
      });
    }
    
    if (rule.parameters.responseCodes) {
      conditions.push({
        id: `condition_response_${Date.now()}`,
        field: 'responseCode',
        operator: 'in_list',
        value: rule.parameters.responseCodes
      });
    }
    
    if (rule.parameters.transactionType) {
      conditions.push({
        id: `condition_txntype_${Date.now()}`,
        field: 'transactionType',
        operator: 'equals',
        value: rule.parameters.transactionType
      });
    }

    return {
      id: rule.id,
      name: rule.name,
      description: rule.description,
      type: rule.type as 'Realtime' | 'Offline' | 'Offline/Filter',
      status: rule.status as 'active' | 'inactive' | 'draft',
      priority: 'medium' as const,
      groups: [{
        id: `group_${rule.id}`,
        logic: 'AND' as const,
        conditions,
        name: 'Ana Grup',
        isActive: true
      }],
      groupLogic: 'AND' as const,
      actions: [{
        id: `action_${rule.id}`,
        type: rule.status === 'active' ? 'flag' as const : 'review' as const,
        description: rule.status === 'active' ? 'İşlemi bayrakla' : 'İşlemi incelemeye al',
        weight: 10
      }],
      createdAt: '2023-07-15 10:00',
      updatedBy: 'legacy-migration@hepsipay.com',
      version: 1,
      tags: ['legacy', 'migrated']
    };
  });
};

export default function RuleBuilderPage() {
  const [parameters, setParameters] = useState<ParameterDefinition[]>(mockParameters);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentRule, setCurrentRule] = useState<FraudRuleBuilder | null>(null);
  const [activeTab, setActiveTab] = useState("builder");
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const [existingRules, setExistingRules] = useState<FraudRuleBuilder[]>(convertLegacyRules());
  const [currentPage, setCurrentPage] = useState(1);
  const rulesPerPage = 8;

  // Yeni kural oluşturma
  const createNewRule = () => {
    const newRule: FraudRuleBuilder = {
      id: `rule_${Date.now()}`,
      name: '',
      description: '',
      type: 'Offline',
      status: 'draft',
      priority: 'medium',
      groups: [{
        id: 'group_1',
        logic: 'AND',
        conditions: [],
        name: 'Ana Grup',
        isActive: true
      }],
      groupLogic: 'AND', // Gruplar arası mantık
      actions: [{
        id: 'action_1',
        type: 'flag',
        description: 'İşlemi bayrakla',
        weight: 10
      }],
      createdAt: new Date().toLocaleString('tr-TR'),
      updatedBy: 'currentUser@hepsipay.com',
      version: 1,
      tags: []
    };
    setCurrentRule(newRule);
    setIsModalOpen(true);
  };

  // Yeni koşul ekleme (geliştirilmiş)
  const addCondition = (groupId: string, isNested = false, parentConditionId?: string) => {
    if (!currentRule) return;

    const newCondition: RuleCondition = {
      id: `condition_${Date.now()}`,
      field: '',
      operator: 'equals',
      value: '',
      isNested,
      nestedConditions: [],
      nestedLogic: 'AND'
    };

    if (isNested && parentConditionId) {
      // Nested koşul ekleme
      setCurrentRule({
        ...currentRule,
        groups: currentRule.groups.map(group =>
          group.id === groupId
            ? {
                ...group,
                conditions: group.conditions.map(condition =>
                  condition.id === parentConditionId
                    ? {
                        ...condition,
                        nestedConditions: [...(condition.nestedConditions || []), newCondition]
                      }
                    : condition
                )
              }
            : group
        )
      });
    } else {
      // Normal koşul ekleme
      setCurrentRule({
        ...currentRule,
        groups: currentRule.groups.map(group =>
          group.id === groupId
            ? { ...group, conditions: [...group.conditions, newCondition] }
            : group
        )
      });
    }
  };

  // Yeni grup ekleme (geliştirilmiş)
  const addGroup = () => {
    if (!currentRule) return;

    const newGroup: RuleGroup = {
      id: `group_${Date.now()}`,
      logic: 'AND',
      conditions: [],
      name: `Grup ${currentRule.groups.length + 1}`,
      isActive: true
    };

    setCurrentRule({
      ...currentRule,
      groups: [...currentRule.groups, newGroup]
    });
  };

  // Koşul güncelleme (geliştirilmiş)
  const updateCondition = (groupId: string, conditionId: string, updates: Partial<RuleCondition>, isNested = false, parentConditionId?: string) => {
    if (!currentRule) return;

    if (isNested && parentConditionId) {
      // Nested koşul güncelleme
      setCurrentRule({
        ...currentRule,
        groups: currentRule.groups.map(group =>
          group.id === groupId
            ? {
                ...group,
                conditions: group.conditions.map(condition =>
                  condition.id === parentConditionId
                    ? {
                        ...condition,
                        nestedConditions: condition.nestedConditions?.map(nestedCondition =>
                          nestedCondition.id === conditionId
                            ? { ...nestedCondition, ...updates }
                            : nestedCondition
                        )
                      }
                    : condition
                )
              }
            : group
        )
      });
    } else {
      // Normal koşul güncelleme
      setCurrentRule({
        ...currentRule,
        groups: currentRule.groups.map(group =>
          group.id === groupId
            ? {
                ...group,
                conditions: group.conditions.map(condition =>
                  condition.id === conditionId
                    ? { ...condition, ...updates }
                    : condition
                )
              }
            : group
        )
      });
    }
  };

  // Koşul silme (geliştirilmiş)
  const deleteCondition = (groupId: string, conditionId: string, isNested = false, parentConditionId?: string) => {
    if (!currentRule) return;

    if (isNested && parentConditionId) {
      // Nested koşul silme
      setCurrentRule({
        ...currentRule,
        groups: currentRule.groups.map(group =>
          group.id === groupId
            ? {
                ...group,
                conditions: group.conditions.map(condition =>
                  condition.id === parentConditionId
                    ? {
                        ...condition,
                        nestedConditions: condition.nestedConditions?.filter(nested => nested.id !== conditionId)
                      }
                    : condition
                )
              }
            : group
        )
      });
    } else {
      // Normal koşul silme
      setCurrentRule({
        ...currentRule,
        groups: currentRule.groups.map(group =>
          group.id === groupId
            ? { ...group, conditions: group.conditions.filter(condition => condition.id !== conditionId) }
            : group
        )
      });
    }
  };

  // Grup silme
  const deleteGroup = (groupId: string) => {
    if (!currentRule || currentRule.groups.length <= 1) return;
    setCurrentRule({
      ...currentRule,
      groups: currentRule.groups.filter(group => group.id !== groupId)
    });
  };

  // Geçerli operatörleri alma (geliştirilmiş)
  const getValidOperators = (fieldKey: string) => {
    const field = availableFields.find(f => f.key === fieldKey);
    if (!field) return [];
    return operators.filter(op => op.types.includes(field.type));
  };

  // Parametre değerlerini alma
  const getParameterValues = (category: ParameterCategory) => {
    return parameters.filter(param => param.category === category);
  };

  // Gelişmiş değer input bileşeni
  const renderValueInput = (condition: RuleCondition, groupId: string, isNested = false, parentConditionId?: string) => {
    const field = availableFields.find(f => f.key === condition.field);
    const operator = condition.operator;

    // Range operatörleri için özel input
    if (operator === 'in_range' || operator === 'not_in_range') {
      const value = condition.value as { min?: number; max?: number } || {};
      return (
        <div className="flex space-x-2">
          <Input
            type="number"
            placeholder="Min"
            value={value.min || ''}
            onChange={(e) => updateCondition(groupId, condition.id, {
              value: { ...value, min: parseFloat(e.target.value) || undefined }
            }, isNested, parentConditionId)}
          />
          <Input
            type="number"
            placeholder="Max"
            value={value.max || ''}
            onChange={(e) => updateCondition(groupId, condition.id, {
              value: { ...value, max: parseFloat(e.target.value) || undefined }
            }, isNested, parentConditionId)}
          />
        </div>
      );
    }

    // Tarih aralığı için özel input
    if (operator === 'date_between') {
      const value = condition.value as { start?: string; end?: string } || {};
      return (
        <div className="flex space-x-2">
          <Input
            type="datetime-local"
            value={value.start || ''}
            onChange={(e) => updateCondition(groupId, condition.id, {
              value: { ...value, start: e.target.value }
            }, isNested, parentConditionId)}
          />
          <Input
            type="datetime-local"
            value={value.end || ''}
            onChange={(e) => updateCondition(groupId, condition.id, {
              value: { ...value, end: e.target.value }
            }, isNested, parentConditionId)}
          />
        </div>
      );
    }

    // Null kontrolleri için input yok
    if (operator === 'is_null' || operator === 'is_not_null') {
      return <span className="text-sm text-gray-500 px-3 py-2">Değer gerekmiyor</span>;
    }

    // Liste parametreleri için select
    if (field?.parameterCategory) {
      const parameterValues = getParameterValues(field.parameterCategory);
      if (operator === 'in_list' || operator === 'not_in_list') {
        return (
          <Select
            value={Array.isArray(condition.value) ? condition.value.join(',') : ''}
            onValueChange={(value) => updateCondition(groupId, condition.id, {
              value: value.split(',').filter(Boolean)
            }, isNested, parentConditionId)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Değer seçin" />
            </SelectTrigger>
            <SelectContent>
              {parameterValues.map(param => (
                <SelectItem key={param.id} value={param.code}>
                  {param.name} ({param.code})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      }
    }

    // Tarih operatörleri için datetime input
    if (field?.type === 'datetime' && (operator === 'date_before' || operator === 'date_after')) {
      return (
        <Input
          type="datetime-local"
          value={condition.value as string}
          onChange={(e) => updateCondition(groupId, condition.id, { value: e.target.value }, isNested, parentConditionId)}
        />
      );
    }

    // Sayı alanları için number input
    if (field?.type === 'number') {
      return (
        <Input
          type="number"
          value={condition.value as string}
          onChange={(e) => updateCondition(groupId, condition.id, { value: parseFloat(e.target.value) || 0 }, isNested, parentConditionId)}
          placeholder="Sayı girin"
        />
      );
    }

    // Varsayılan text input
    return (
      <Input
        value={condition.value as string}
        onChange={(e) => updateCondition(groupId, condition.id, { value: e.target.value }, isNested, parentConditionId)}
        placeholder={operator === 'regex' ? 'Regex pattern' : 'Değer girin'}
      />
    );
  };

  // Gelişmiş kural önizlemesi
  const generateRulePreview = () => {
    if (!currentRule) return 'Kural seçilmedi';

    let preview = `Kural: ${currentRule.name}\n`;
    preview += `Tip: ${currentRule.type}\n`;
    preview += `Durum: ${currentRule.status}\n`;
    preview += `Öncelik: ${currentRule.priority}\n\n`;

    preview += `Gruplar (${currentRule.groupLogic} mantığı ile bağlı):\n\n`;

    currentRule.groups.forEach((group, groupIndex) => {
      preview += `${groupIndex + 1}. ${group.name || `Grup ${groupIndex + 1}`} (${group.logic} mantığı):\n`;
      
      group.conditions.forEach((condition, conditionIndex) => {
        const field = availableFields.find(f => f.key === condition.field);
        const operator = operators.find(op => op.value === condition.operator);
        
        preview += `   ${conditionIndex > 0 ? group.logic + ' ' : ''}${field?.label || condition.field} ${operator?.label || condition.operator} ${
          typeof condition.value === 'object' 
            ? JSON.stringify(condition.value)
            : condition.value
        }\n`;

        // Nested koşulları göster
        if (condition.nestedConditions && condition.nestedConditions.length > 0) {
          preview += `      Nested koşullar (${condition.nestedLogic}):\n`;
          condition.nestedConditions.forEach((nested, nestedIndex) => {
            const nestedField = availableFields.find(f => f.key === nested.field);
            const nestedOperator = operators.find(op => op.value === nested.operator);
            preview += `         ${nestedIndex > 0 ? condition.nestedLogic + ' ' : ''}${nestedField?.label || nested.field} ${nestedOperator?.label || nested.operator} ${nested.value}\n`;
          });
        }
      });
      preview += '\n';
    });

    preview += `Aksiyonlar:\n`;
    currentRule.actions.forEach((action, actionIndex) => {
      preview += `${actionIndex + 1}. ${action.type}: ${action.description}`;
      if (action.weight) preview += ` (Ağırlık: ${action.weight})`;
      preview += '\n';
    });

    return preview;
  };

  // Gelişmiş test simülasyonu
  const testRule = () => {
    if (!currentRule) return;

    // Gerçek test verisi simülasyonu
    const testData = {
      amount: 1500,
      mcc: '7995',
      country: 'TR',
      transactionType: '1',
      transactionTime: new Date().toISOString(),
      riskScore: 75,
      velocityCount: 3,
      ipAddress: '192.168.1.1'
    };

    // Basit kural eşleştirme simülasyonu
    let matched = false;
    let matchedGroups = 0;

    currentRule.groups.forEach(group => {
      let groupMatched = false;
      let conditionResults: boolean[] = [];

      group.conditions.forEach(condition => {
        const fieldValue = (testData as any)[condition.field];
        let conditionMatched = false;

        switch (condition.operator) {
          case 'equals':
            conditionMatched = fieldValue === condition.value;
            break;
          case 'greater_than':
            conditionMatched = fieldValue > condition.value;
            break;
          case 'contains':
            conditionMatched = String(fieldValue).includes(String(condition.value));
            break;
          default:
            conditionMatched = true; // Simülasyon için
        }

        conditionResults.push(conditionMatched);
      });

      // Grup mantığına göre sonuç
      if (group.logic === 'AND') {
        groupMatched = conditionResults.every(result => result);
      } else {
        groupMatched = conditionResults.some(result => result);
      }

      if (groupMatched) matchedGroups++;
    });

    // Grup mantığına göre genel sonuç
    if (currentRule.groupLogic === 'AND') {
      matched = matchedGroups === currentRule.groups.length;
    } else {
      matched = matchedGroups > 0;
    }

    if (matched) {
      toast.success('✅ Test başarılı! Kural test verisi ile eşleşti.', {
        duration: 4000,
      });
    } else {
      toast.error('❌ Test sonucu: Kural test verisi ile eşleşmedi.', {
        duration: 4000,
      });
    }

    // Test sonucu detaylarını göster
    console.log('Test Data:', testData);
    console.log('Rule Match:', matched);
    console.log('Matched Groups:', matchedGroups, '/', currentRule.groups.length);
  };

  // Test senaryosu yükleme
  const loadTestScenario = (scenarioName: string) => {
    let testData: any = {};
    let testConditions: RuleCondition[] = [];

    switch (scenarioName) {
      case 'high-risk':
        testData = {
          amount: 10000,
          mcc: '7995',
          country: 'TR',
          transactionType: '1',
          transactionTime: '2023-10-27T22:00:00', // Gece saati
          riskScore: 90,
          velocityCount: 10,
          ipAddress: '192.168.1.100'
        };
                 testConditions = [
           { id: 'test_cond_1', field: 'amount', operator: 'greater_than', value: 10000 },
           { id: 'test_cond_2', field: 'mcc', operator: 'in_list', value: ['7995'] },
           { id: 'test_cond_3', field: 'transactionTime', operator: 'date_before', value: '2023-10-27T07:00:00' } // Gece saati
         ];
        break;
      case 'velocity':
        testData = {
          amount: 500,
          mcc: '5411',
          country: 'TR',
          transactionType: '1',
          transactionTime: '2023-10-27T10:00:00',
          riskScore: 50,
          velocityCount: 15,
          ipAddress: '192.168.1.101'
        };
                 testConditions = [
           { id: 'test_cond_4', field: 'amount', operator: 'greater_than', value: 500 },
           { id: 'test_cond_5', field: 'velocityCount', operator: 'greater_than', value: 10 },
           { id: 'test_cond_6', field: 'transactionTime', operator: 'date_between', value: { start: '2023-10-27T09:00:00', end: '2023-10-27T11:00:00' } }
         ];
        break;
      case 'normal':
        testData = {
          amount: 1500,
          mcc: '5812',
          country: 'TR',
          transactionType: '1',
          transactionTime: '2023-10-27T12:00:00',
          riskScore: 75,
          velocityCount: 3,
          ipAddress: '192.168.1.102'
        };
                 testConditions = [
           { id: 'test_cond_7', field: 'amount', operator: 'greater_than', value: 1000 },
           { id: 'test_cond_8', field: 'mcc', operator: 'in_list', value: ['5812'] },
           { id: 'test_cond_9', field: 'transactionTime', operator: 'date_between', value: { start: '2023-10-27T08:00:00', end: '2023-10-27T14:00:00' } }
         ];
        break;
      case 'international':
        testData = {
          amount: 2000,
          mcc: '4829',
          country: 'US',
          transactionType: '1',
          transactionTime: '2023-10-27T15:00:00',
          riskScore: 80,
          velocityCount: 5,
          ipAddress: '192.168.1.103'
        };
        testConditions = [
          { id: 'test_1', field: 'amount', operator: 'greater_than', value: 1500 },
          { id: 'test_2', field: 'mcc', operator: 'in_list', value: ['4829'] },
          { id: 'test_3', field: 'country', operator: 'not_equals', value: 'TR' }
        ];
        break;
      default:
        testData = {
          amount: 1500,
          mcc: '7995',
          country: 'TR',
          transactionType: '1',
          transactionTime: '2023-10-27T10:00:00',
          riskScore: 75,
          velocityCount: 3,
          ipAddress: '192.168.1.104'
        };
        testConditions = [
          { id: 'test_4', field: 'amount', operator: 'greater_than', value: 1000 },
          { id: 'test_5', field: 'mcc', operator: 'in_list', value: ['7995'] },
          { id: 'test_6', field: 'transactionTime', operator: 'date_between', value: { start: '2023-10-27T09:00:00', end: '2023-10-27T11:00:00' } }
        ];
        break;
    }

    setCurrentRule({
      ...currentRule!,
      groups: [{
        id: 'group_1',
        logic: 'AND',
        conditions: testConditions
      }],
      actions: [{
        id: 'action_1',
        type: 'flag',
        description: 'İşlemi bayrakla',
        weight: 10
      }]
    });

         // Test verilerini input alanlarına yükle
     const amountEl = document.getElementById('test-amount') as HTMLInputElement;
     if (amountEl) amountEl.value = testData.amount.toString();
     
     const riskScoreEl = document.getElementById('test-risk-score') as HTMLInputElement;
     if (riskScoreEl) riskScoreEl.value = testData.riskScore.toString();
     
     const velocityEl = document.getElementById('test-velocity') as HTMLInputElement;
     if (velocityEl) velocityEl.value = testData.velocityCount.toString();
     
     const ipEl = document.getElementById('test-ip') as HTMLInputElement;
     if (ipEl) ipEl.value = testData.ipAddress;
     
     const datetimeEl = document.getElementById('test-datetime') as HTMLInputElement;
     if (datetimeEl) datetimeEl.value = testData.transactionTime;
  };

     // Test sonuçlarını temizle
   const clearTestResults = () => {
     setCurrentRule({
       ...currentRule!,
       groups: [{
         id: 'group_1',
         logic: 'AND',
         conditions: []
       }],
       actions: [{
         id: 'action_1',
         type: 'flag',
         description: 'İşlemi bayrakla',
         weight: 10
       }]
     });
     
     const testResultsEl = document.getElementById('test-results');
     if (testResultsEl) {
       testResultsEl.innerHTML = '<div class="text-center py-8 text-gray-500"><div class="h-12 w-12 mx-auto mb-3 text-gray-300">🧪</div><p>Test sonuçları burada görünecek</p><p class="text-sm">Yukarıdan bir test senaryosu seçin</p></div>';
     }
     
     const testPassedEl = document.getElementById('test-passed');
     if (testPassedEl) testPassedEl.textContent = '0';
     
     const testFailedEl = document.getElementById('test-failed');
     if (testFailedEl) testFailedEl.textContent = '0';
     
     const testTotalEl = document.getElementById('test-total');
     if (testTotalEl) testTotalEl.textContent = '0';
     
     const testHistoryEl = document.getElementById('test-history');
     if (testHistoryEl) {
       testHistoryEl.innerHTML = '<div class="text-sm text-gray-500 text-center py-2">Henüz test yapılmadı</div>';
     }
   };

  // Gelişmiş test simülasyonu
  const runAdvancedTest = () => {
    if (!currentRule) return;

         const amountEl = document.getElementById('test-amount') as HTMLInputElement;
     const riskScoreEl = document.getElementById('test-risk-score') as HTMLInputElement;
     const velocityEl = document.getElementById('test-velocity') as HTMLInputElement;
     const ipEl = document.getElementById('test-ip') as HTMLInputElement;
     const datetimeEl = document.getElementById('test-datetime') as HTMLInputElement;

     const testData: any = {
       amount: parseFloat(amountEl?.value || '1500') || 1500,
       mcc: '7995',
       country: 'TR',
       transactionType: '1',
       transactionTime: datetimeEl?.value || new Date().toISOString(),
       riskScore: parseFloat(riskScoreEl?.value || '75') || 75,
       velocityCount: parseInt(velocityEl?.value || '3', 10) || 3,
       ipAddress: ipEl?.value || '192.168.1.1'
     };

    const testConditions: (RuleCondition & { matched: boolean })[] = [];
    currentRule.groups.forEach(group => {
      group.conditions.forEach(condition => {
        const fieldValue = (testData as any)[condition.field];
        let conditionMatched = false;

        switch (condition.operator) {
          case 'equals':
            conditionMatched = fieldValue === condition.value;
            break;
          case 'not_equals':
            conditionMatched = fieldValue !== condition.value;
            break;
          case 'greater_than':
            conditionMatched = fieldValue > condition.value;
            break;
          case 'less_than':
            conditionMatched = fieldValue < condition.value;
            break;
          case 'greater_equal':
            conditionMatched = fieldValue >= condition.value;
            break;
          case 'less_equal':
            conditionMatched = fieldValue <= condition.value;
            break;
          case 'contains':
            conditionMatched = String(fieldValue).includes(String(condition.value));
            break;
          case 'not_contains':
            conditionMatched = !String(fieldValue).includes(String(condition.value));
            break;
          case 'starts_with':
            conditionMatched = String(fieldValue).startsWith(String(condition.value));
            break;
          case 'ends_with':
            conditionMatched = String(fieldValue).endsWith(String(condition.value));
            break;
          case 'regex':
            // Regex eşleşme simülasyonu (basit bir örnek)
            // Gerçek regex eşleşme için bir kütüphane kullanılmalı
            if (typeof condition.value === 'string' && typeof fieldValue === 'string') {
              const regex = new RegExp(condition.value);
              conditionMatched = regex.test(fieldValue);
            } else {
              conditionMatched = false; // Regex için değer ve alan tipi uyumsuzluğu
            }
            break;
          case 'in_list':
            conditionMatched = Array.isArray(fieldValue) && Array.isArray(condition.value) && condition.value.some(val => fieldValue.includes(val));
            break;
          case 'not_in_list':
            conditionMatched = Array.isArray(fieldValue) && Array.isArray(condition.value) && !condition.value.some(val => fieldValue.includes(val));
            break;
          case 'in_range':
            if (typeof fieldValue === 'number' && isRangeValue(condition.value)) {
              conditionMatched = fieldValue >= (condition.value.min || 0) && fieldValue <= (condition.value.max || Number.MAX_VALUE);
            } else if (typeof fieldValue === 'string' && isDateRangeValue(condition.value)) {
              const start = new Date(condition.value.start || '').getTime();
              const end = new Date(condition.value.end || '').getTime();
              const testTime = new Date(fieldValue).getTime();
              conditionMatched = testTime >= start && testTime <= end;
            }
            break;
          case 'not_in_range':
            if (typeof fieldValue === 'number' && isRangeValue(condition.value)) {
              conditionMatched = fieldValue < (condition.value.min || 0) || fieldValue > (condition.value.max || Number.MAX_VALUE);
            } else if (typeof fieldValue === 'string' && isDateRangeValue(condition.value)) {
              const start = new Date(condition.value.start || '').getTime();
              const end = new Date(condition.value.end || '').getTime();
              const testTime = new Date(fieldValue).getTime();
              conditionMatched = testTime < start || testTime > end;
            }
            break;
          case 'is_null':
            conditionMatched = fieldValue === null || fieldValue === undefined;
            break;
          case 'is_not_null':
            conditionMatched = fieldValue !== null && fieldValue !== undefined;
            break;
          case 'date_before':
            if (typeof fieldValue === 'string' && typeof condition.value === 'string') {
              conditionMatched = new Date(fieldValue).getTime() < new Date(condition.value).getTime();
            }
            break;
          case 'date_after':
            if (typeof fieldValue === 'string' && typeof condition.value === 'string') {
              conditionMatched = new Date(fieldValue).getTime() > new Date(condition.value).getTime();
            }
            break;
          case 'date_between':
            if (typeof fieldValue === 'string' && isDateRangeValue(condition.value)) {
              const start = new Date(condition.value.start || '').getTime();
              const end = new Date(condition.value.end || '').getTime();
              const testTime = new Date(fieldValue).getTime();
              conditionMatched = testTime >= start && testTime <= end;
            }
            break;
          default:
            conditionMatched = true; // Simülasyon için
        }

        // Nested koşulları da simüle et
        if (condition.nestedConditions && condition.nestedConditions.length > 0) {
          let nestedMatched = false;
          condition.nestedConditions.forEach(nested => {
            const nestedFieldValue = (testData as any)[nested.field];
            let nestedConditionMatched = false;

            switch (nested.operator) {
              case 'equals':
                nestedConditionMatched = nestedFieldValue === nested.value;
                break;
              case 'not_equals':
                nestedConditionMatched = nestedFieldValue !== nested.value;
                break;
              case 'greater_than':
                nestedConditionMatched = nestedFieldValue > nested.value;
                break;
              case 'less_than':
                nestedConditionMatched = nestedFieldValue < nested.value;
                break;
              case 'greater_equal':
                nestedConditionMatched = nestedFieldValue >= nested.value;
                break;
              case 'less_equal':
                nestedConditionMatched = nestedFieldValue <= nested.value;
                break;
              case 'contains':
                nestedConditionMatched = String(nestedFieldValue).includes(String(nested.value));
                break;
              case 'not_contains':
                nestedConditionMatched = !String(nestedFieldValue).includes(String(nested.value));
                break;
              case 'starts_with':
                nestedConditionMatched = String(nestedFieldValue).startsWith(String(nested.value));
                break;
              case 'ends_with':
                nestedConditionMatched = String(nestedFieldValue).endsWith(String(nested.value));
                break;
              case 'regex':
                if (typeof nested.value === 'string' && typeof nestedFieldValue === 'string') {
                  const regex = new RegExp(nested.value);
                  nestedConditionMatched = regex.test(nestedFieldValue);
                } else {
                  nestedConditionMatched = false;
                }
                break;
              case 'in_list':
                nestedConditionMatched = Array.isArray(nestedFieldValue) && Array.isArray(nested.value) && nested.value.some(val => nestedFieldValue.includes(val));
                break;
              case 'not_in_list':
                nestedConditionMatched = Array.isArray(nestedFieldValue) && Array.isArray(nested.value) && !nested.value.some(val => nestedFieldValue.includes(val));
                break;
              case 'in_range':
                if (typeof nestedFieldValue === 'number' && isRangeValue(nested.value)) {
                  nestedConditionMatched = nestedFieldValue >= (nested.value.min || 0) && nestedFieldValue <= (nested.value.max || Number.MAX_VALUE);
                } else if (typeof nestedFieldValue === 'string' && isDateRangeValue(nested.value)) {
                  const start = new Date(nested.value.start || '').getTime();
                  const end = new Date(nested.value.end || '').getTime();
                  const testTime = new Date(nestedFieldValue).getTime();
                  nestedConditionMatched = testTime >= start && testTime <= end;
                }
                break;
              case 'not_in_range':
                if (typeof nestedFieldValue === 'number' && isRangeValue(nested.value)) {
                  nestedConditionMatched = nestedFieldValue < (nested.value.min || 0) || nestedFieldValue > (nested.value.max || Number.MAX_VALUE);
                } else if (typeof nestedFieldValue === 'string' && isDateRangeValue(nested.value)) {
                  const start = new Date(nested.value.start || '').getTime();
                  const end = new Date(nested.value.end || '').getTime();
                  const testTime = new Date(nestedFieldValue).getTime();
                  nestedConditionMatched = testTime < start || testTime > end;
                }
                break;
              case 'is_null':
                nestedConditionMatched = nestedFieldValue === null || nestedFieldValue === undefined;
                break;
              case 'is_not_null':
                nestedConditionMatched = nestedFieldValue !== null && nestedFieldValue !== undefined;
                break;
              case 'date_before':
                if (typeof nestedFieldValue === 'string' && typeof nested.value === 'string') {
                  nestedConditionMatched = new Date(nestedFieldValue).getTime() < new Date(nested.value).getTime();
                }
                break;
              case 'date_after':
                if (typeof nestedFieldValue === 'string' && typeof nested.value === 'string') {
                  nestedConditionMatched = new Date(nestedFieldValue).getTime() > new Date(nested.value).getTime();
                }
                break;
              case 'date_between':
                if (typeof nestedFieldValue === 'string' && isDateRangeValue(nested.value)) {
                  const start = new Date(nested.value.start || '').getTime();
                  const end = new Date(nested.value.end || '').getTime();
                  const testTime = new Date(nestedFieldValue).getTime();
                  nestedConditionMatched = testTime >= start && testTime <= end;
                }
                break;
              default:
                nestedConditionMatched = true;
            }

            if (nested.nestedLogic === 'AND') {
              nestedMatched = nestedMatched && nestedConditionMatched;
            } else {
              nestedMatched = nestedMatched || nestedConditionMatched;
            }
          });
          conditionMatched = conditionMatched && nestedMatched;
        }

        // Grup mantığına göre sonuç
        if (condition.nestedLogic === 'AND') {
          conditionMatched = conditionMatched && condition.nestedLogic === 'AND'; // Nested koşulların kendi mantığı
        } else {
          conditionMatched = conditionMatched || condition.nestedLogic === 'OR'; // Nested koşulların kendi mantığı
        }

        testConditions.push({ ...condition, matched: conditionMatched } as RuleCondition & { matched: boolean });
      });
    });

    let finalMatched = false;
    let totalTests = 0;
    let passedTests = 0;
    let failedTests = 0;

    // Grup mantığına göre genel sonuç
    if (currentRule.groupLogic === 'AND') {
      finalMatched = testConditions.every(condition => condition.matched);
    } else {
      finalMatched = testConditions.some(condition => condition.matched);
    }

    totalTests = testConditions.length;
    passedTests = testConditions.filter(condition => condition.matched).length;
    failedTests = totalTests - passedTests;

    const testResultsDiv = document.getElementById('test-results');
    if (testResultsDiv) {
      testResultsDiv.innerHTML = `
        <div class="text-center py-8 text-gray-500">
          <TestTube className="h-12 w-12 mx-auto mb-3 text-gray-300" />
          <p>Test sonuçları burada görünecek</p>
          <p className="text-sm">Yukarıdan bir test senaryosu seçin</p>
        </div>
      `;
    }

    const testHistoryDiv = document.getElementById('test-history');
    if (testHistoryDiv) {
      testHistoryDiv.innerHTML = `
        <div className="text-sm text-gray-500 text-center py-2">
          Henüz test yapılmadı
        </div>
      `;
    }

    if (finalMatched) {
      toast.success('✅ Test başarılı! Kural test verisi ile eşleşti.', {
        duration: 4000,
      });
      if (testResultsDiv) {
        testResultsDiv.innerHTML = `
          <div class="text-center py-8 text-green-600">
            <TestTube className="h-12 w-12 mx-auto mb-3 text-green-300" />
            <p>Kural test verisi ile eşleşti!</p>
            <p className="text-sm">${passedTests} koşul eşleşti, ${failedTests} koşul eşleşmedi.</p>
          </div>
        `;
      }
      if (testHistoryDiv) {
        testHistoryDiv.innerHTML = `
          <div className="text-sm text-green-600 text-center py-2">
            <p>Son test: ${new Date().toLocaleString('tr-TR')}</p>
            <p>Sonuç: Başarılı</p>
          </div>
        `;
      }
    } else {
      toast.error('❌ Test sonucu: Kural test verisi ile eşleşmedi.', {
        duration: 4000,
      });
      if (testResultsDiv) {
        testResultsDiv.innerHTML = `
          <div class="text-center py-8 text-red-600">
            <TestTube className="h-12 w-12 mx-auto mb-3 text-red-300" />
            <p>Kural test verisi ile eşleşmedi!</p>
            <p className="text-sm">${passedTests} koşul eşleşti, ${failedTests} koşul eşleşmedi.</p>
          </div>
        `;
      }
      if (testHistoryDiv) {
        testHistoryDiv.innerHTML = `
          <div className="text-sm text-red-600 text-center py-2">
            <p>Son test: ${new Date().toLocaleString('tr-TR')}</p>
            <p>Sonuç: Başarısız</p>
          </div>
        `;
      }
    }

         const testPassedEl = document.getElementById('test-passed');
     if (testPassedEl) testPassedEl.textContent = passedTests.toString();
     
     const testFailedEl = document.getElementById('test-failed');
     if (testFailedEl) testFailedEl.textContent = failedTests.toString();
     
     const testTotalEl = document.getElementById('test-total');
     if (testTotalEl) testTotalEl.textContent = totalTests.toString();
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Kurallar</h1>
          <p className="text-md text-gray-600 mt-1">
            Fraud kurallarını görüntüleyin, oluşturun ve test edin.
          </p>
        </div>
        <Button onClick={createNewRule}>
          <Plus className="h-4 w-4 mr-2" />
          Yeni Kural Oluştur
        </Button>
      </div>

      {/* Kural İstatistikleri - Yatay */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Aktif Kurallar</p>
              <p className="text-2xl font-bold text-green-600">
                {existingRules.filter(r => r.status === 'active').length}
              </p>
            </div>
            <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
              <div className="h-3 w-3 bg-green-600 rounded-full"></div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pasif Kurallar</p>
              <p className="text-2xl font-bold text-red-600">
                {existingRules.filter(r => r.status === 'inactive').length}
              </p>
            </div>
            <div className="h-8 w-8 bg-red-100 rounded-full flex items-center justify-center">
              <div className="h-3 w-3 bg-red-600 rounded-full"></div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Realtime</p>
              <p className="text-2xl font-bold text-blue-600">
                {existingRules.filter(r => r.type === 'Realtime').length}
              </p>
            </div>
            <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
              <Zap className="h-4 w-4 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Offline</p>
              <p className="text-2xl font-bold text-gray-600">
                {existingRules.filter(r => r.type === 'Offline').length}
              </p>
            </div>
            <div className="h-8 w-8 bg-gray-100 rounded-full flex items-center justify-center">
              <Settings className="h-4 w-4 text-gray-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Toplam Koşul</p>
              <p className="text-2xl font-bold text-purple-600">
                {existingRules.reduce((acc, rule) => acc + (rule.groups[0]?.conditions.length || 0), 0)}
              </p>
            </div>
            <div className="h-8 w-8 bg-purple-100 rounded-full flex items-center justify-center">
              <Filter className="h-4 w-4 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Ana İçerik */}
        <div>
          <div className="bg-white rounded-lg shadow-md border">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold flex items-center">
                  <Layers className="h-5 w-5 mr-2" />
                  Fraud Kuralları
                </h2>
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  {existingRules.length} Kural
                </Badge>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                Sistemdeki aktif ve pasif fraud kurallarını görüntüleyin, düzenleyin veya yeni kural oluşturun.
              </p>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Durum
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Kural Adı
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tip
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Koşullar
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Eylemler
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {existingRules
                    .slice((currentPage - 1) * rulesPerPage, currentPage * rulesPerPage)
                    .map((rule) => (
                    <tr key={rule.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4 whitespace-nowrap">
                        <Badge 
                          variant={rule.status === 'active' ? 'default' : 'destructive'}
                          className={rule.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}
                        >
                          {rule.status === 'active' ? 'Aktif' : 'Pasif'}
                        </Badge>
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-sm font-medium text-gray-900">{rule.name}</div>
                        <div className="text-xs text-gray-500 line-clamp-1">{rule.description}</div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <Badge variant={rule.type === 'Realtime' ? 'destructive' : 'secondary'}>
                          {rule.type}
                        </Badge>
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-sm text-gray-900">
                          {rule.groups[0]?.conditions.length || 0} koşul
                        </div>
                        <div className="text-xs text-gray-500">
                          {rule.groups[0]?.conditions.slice(0, 2).map(c => {
                            const field = availableFields.find(f => f.key === c.field);
                            return `${field?.label || c.field}`;
                          }).join(', ')}
                          {rule.groups[0]?.conditions.length > 2 && '...'}
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setCurrentRule(rule);
                            setIsModalOpen(true);
                          }}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Görüntüle
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Pagination */}
            {existingRules.length > rulesPerPage && (
              <div className="px-6 py-4 border-t bg-gray-50 flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  <span>{(currentPage - 1) * rulesPerPage + 1}</span>
                  <span> - </span>
                  <span>{Math.min(currentPage * rulesPerPage, existingRules.length)}</span>
                  <span> / </span>
                  <span>{existingRules.length} kural</span>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    Önceki
                  </Button>
                  <div className="flex space-x-1">
                    {Array.from({ length: Math.ceil(existingRules.length / rulesPerPage) }, (_, i) => (
                      <Button
                        key={i + 1}
                        variant={currentPage === i + 1 ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(i + 1)}
                        className="w-8 h-8 p-0"
                      >
                        {i + 1}
                      </Button>
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === Math.ceil(existingRules.length / rulesPerPage)}
                  >
                    Sonraki
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>


      </div>

      {/* Kural Oluşturma Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-7xl w-[95vw] h-[90vh] p-0 flex flex-col overflow-hidden bg-white">
          <DialogHeader className="p-6 border-b flex-shrink-0 bg-white">
            <DialogTitle className="flex items-center text-gray-900">
              <Code className="h-5 w-5 mr-2" />
              {currentRule?.name || 'Yeni Fraud Kuralı'}
            </DialogTitle>
            <DialogDescription className="text-gray-600">
              Gelişmiş koşullar ve mantıksal operatörler kullanarak fraud kuralı oluşturun.
            </DialogDescription>
          </DialogHeader>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col bg-white">
            <TabsList className="grid w-full grid-cols-3 rounded-none border-b bg-gray-100">
              <TabsTrigger value="builder" className="data-[state=active]:bg-white">Kural Oluşturucu</TabsTrigger>
              <TabsTrigger value="preview" className="data-[state=active]:bg-white">Önizleme</TabsTrigger>
              <TabsTrigger value="test" className="data-[state=active]:bg-white">Test</TabsTrigger>
            </TabsList>

            <TabsContent value="builder" className="flex-1 bg-white">
              <div className="flex-1 overflow-y-auto p-6 bg-white">
              {currentRule && (
                <div className="space-y-6">
                  {/* Temel Bilgiler */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="ruleName">Kural Adı *</Label>
                      <Input
                        id="ruleName"
                        value={currentRule.name}
                        onChange={(e) => setCurrentRule({...currentRule, name: e.target.value})}
                        placeholder="Açıklayıcı kural adı"
                        className="w-full"
                      />
                    </div>
                    <div>
                      <Label htmlFor="ruleType">Tip</Label>
                      <Select
                        value={currentRule.type}
                        onValueChange={(value: any) => setCurrentRule({...currentRule, type: value})}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="z-50">
                          <SelectItem value="Realtime">Realtime</SelectItem>
                          <SelectItem value="Offline">Offline</SelectItem>
                          <SelectItem value="Offline/Filter">Offline/Filter</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="ruleDescription">Açıklama</Label>
                    <Input
                      id="ruleDescription"
                      value={currentRule.description}
                      onChange={(e) => setCurrentRule({...currentRule, description: e.target.value})}
                      placeholder="Kuralın ne yaptığını açıklayın"
                    />
                  </div>

                  {/* Kural Grupları */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <h3 className="text-lg font-semibold">Koşullar</h3>
                        <div className="flex items-center space-x-2">
                          <Label className="text-sm">Gruplar arası mantık:</Label>
                          <Select
                            value={currentRule.groupLogic}
                            onValueChange={(value: 'AND' | 'OR') => 
                              setCurrentRule({...currentRule, groupLogic: value})
                            }
                          >
                            <SelectTrigger className="w-20">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="AND">VE</SelectItem>
                              <SelectItem value="OR">VEYA</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}>
                          <Settings className="h-4 w-4 mr-2" />
                          Gelişmiş
                        </Button>
                        <Button variant="outline" onClick={addGroup}>
                          <Plus className="h-4 w-4 mr-2" />
                          Yeni Grup
                        </Button>
                      </div>
                    </div>

                    {/* Grup mantığı göstergesi */}
                    {currentRule.groups.length > 1 && (
                      <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <p className="text-sm text-blue-800 flex items-center">
                          <GitBranch className="h-4 w-4 mr-2" />
                          Gruplar <strong className="mx-1">{currentRule.groupLogic}</strong> mantığı ile birleştirilecek
                        </p>
                      </div>
                    )}

                    {currentRule.groups.map((group, groupIndex) => (
                      <div key={group.id} className="border-2 border-gray-200 rounded-lg p-4 mb-4 relative">
                        {/* Grup başlığı */}
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-4">
                            <Input
                              value={group.name || ''}
                              onChange={(e) => setCurrentRule({
                                ...currentRule,
                                groups: currentRule.groups.map(g =>
                                  g.id === group.id ? {...g, name: e.target.value} : g
                                )
                              })}
                              placeholder={`Grup ${groupIndex + 1}`}
                              className="w-40 font-medium"
                            />
                            <Select
                              value={group.logic}
                              onValueChange={(value: 'AND' | 'OR') => 
                                setCurrentRule({
                                  ...currentRule,
                                  groups: currentRule.groups.map(g =>
                                    g.id === group.id ? {...g, logic: value} : g
                                  )
                                })
                              }
                            >
                              <SelectTrigger className="w-20">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="AND">VE</SelectItem>
                                <SelectItem value="OR">VEYA</SelectItem>
                              </SelectContent>
                            </Select>
                            <Checkbox
                              checked={group.isActive}
                              onChange={(e) => setCurrentRule({
                                ...currentRule,
                                groups: currentRule.groups.map(g =>
                                  g.id === group.id ? {...g, isActive: e.target.checked} : g
                                )
                              })}
                            />
                            <Label className="text-sm">Aktif</Label>
                          </div>
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => addCondition(group.id)}
                            >
                              <Plus className="h-4 w-4 mr-1" />
                              Koşul
                            </Button>
                            {currentRule.groups.length > 1 && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => deleteGroup(group.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </div>

                        {/* Gruplar arası mantık göstergesi */}
                        {groupIndex > 0 && (
                          <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                            {currentRule.groupLogic}
                          </div>
                        )}

                        {/* Koşullar */}
                        <div className="space-y-3">
                          {group.conditions.map((condition, conditionIndex) => (
                            <div key={condition.id} className="border border-gray-200 rounded-lg p-3">
                              {/* Ana koşul */}
                              <div className="space-y-3">
                                {conditionIndex > 0 && (
                                  <div className="text-center text-sm font-medium text-blue-600 bg-blue-50 rounded px-2 py-1 w-fit mx-auto">
                                    {group.logic}
                                  </div>
                                )}
                                <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-end">
                                  <div className="lg:col-span-3">
                                    <Label>Alan</Label>
                                    <Select
                                      value={condition.field}
                                      onValueChange={(value) => updateCondition(group.id, condition.id, { field: value })}
                                    >
                                      <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Alan seçin" />
                                      </SelectTrigger>
                                      <SelectContent className="z-50 max-h-60 overflow-y-auto">
                                        {Object.entries(
                                          availableFields.reduce((acc, field) => {
                                            if (!acc[field.category]) acc[field.category] = [];
                                            acc[field.category].push(field);
                                            return acc;
                                          }, {} as Record<string, typeof availableFields>)
                                        ).map(([category, fields]) => (
                                          <div key={category}>
                                            <div className="px-2 py-1 text-xs font-semibold text-gray-500 uppercase">
                                              {category}
                                            </div>
                                            {fields.map(field => (
                                              <SelectItem key={field.key} value={field.key}>
                                                {field.label}
                                              </SelectItem>
                                            ))}
                                          </div>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  <div className="lg:col-span-3">
                                    <Label>Operatör</Label>
                                    <Select
                                      value={condition.operator}
                                      onValueChange={(value: any) => updateCondition(group.id, condition.id, { operator: value })}
                                    >
                                      <SelectTrigger className="w-full">
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent className="z-50 max-h-60 overflow-y-auto">
                                        {Object.entries(
                                          getValidOperators(condition.field).reduce((acc, op) => {
                                            if (!acc[op.category]) acc[op.category] = [];
                                            acc[op.category].push(op);
                                            return acc;
                                          }, {} as Record<string, typeof operators>)
                                        ).map(([category, ops]) => (
                                          <div key={category}>
                                            <div className="px-2 py-1 text-xs font-semibold text-gray-500 uppercase">
                                              {category}
                                            </div>
                                            {ops.map(op => (
                                              <SelectItem key={op.value} value={op.value}>
                                                {op.label}
                                              </SelectItem>
                                            ))}
                                          </div>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  <div className="lg:col-span-4">
                                    <Label>Değer</Label>
                                    {renderValueInput(condition, group.id)}
                                  </div>
                                  <div className="lg:col-span-2 flex flex-col sm:flex-row gap-2">
                                    {showAdvancedOptions && (
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => addCondition(group.id, true, condition.id)}
                                        title="Nested koşul ekle"
                                        className="w-full sm:w-auto"
                                      >
                                        <Brackets className="h-4 w-4 mr-1" />
                                        Nested
                                      </Button>
                                    )}
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => deleteCondition(group.id, condition.id)}
                                      className="w-full sm:w-auto"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </div>
                              </div>

                              {/* Nested koşullar */}
                              {condition.nestedConditions && condition.nestedConditions.length > 0 && (
                                <div className="mt-3 ml-6 pl-4 border-l-2 border-gray-300">
                                  <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center space-x-2">
                                      <Label className="text-sm text-gray-600">Nested koşullar:</Label>
                                      <Select
                                        value={condition.nestedLogic}
                                        onValueChange={(value: 'AND' | 'OR') => 
                                          updateCondition(group.id, condition.id, { nestedLogic: value })
                                        }
                                      >
                                        <SelectTrigger className="w-16 h-7">
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="AND">VE</SelectItem>
                                          <SelectItem value="OR">VEYA</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                  </div>
                                  
                                  {condition.nestedConditions.map((nestedCondition, nestedIndex) => (
                                    <div key={nestedCondition.id} className="grid grid-cols-12 gap-2 mb-2 items-end">
                                      {nestedIndex > 0 && (
                                        <div className="col-span-1 text-center text-xs font-medium text-purple-600">
                                          {condition.nestedLogic}
                                        </div>
                                      )}
                                      <div className={nestedIndex === 0 ? "col-span-3" : "col-span-2"}>
                                        <Select
                                          value={nestedCondition.field}
                                          onValueChange={(value) => updateCondition(group.id, nestedCondition.id, { field: value }, true, condition.id)}
                                        >
                                          <SelectTrigger>
                                            <SelectValue placeholder="Alan" />
                                          </SelectTrigger>
                                          <SelectContent>
                                            {availableFields.map(field => (
                                              <SelectItem key={field.key} value={field.key}>
                                                {field.label}
                                              </SelectItem>
                                            ))}
                                          </SelectContent>
                                        </Select>
                                      </div>
                                      <div className="col-span-2">
                                        <Select
                                          value={nestedCondition.operator}
                                          onValueChange={(value: any) => updateCondition(group.id, nestedCondition.id, { operator: value }, true, condition.id)}
                                        >
                                          <SelectTrigger>
                                            <SelectValue />
                                          </SelectTrigger>
                                          <SelectContent>
                                            {getValidOperators(nestedCondition.field).map(op => (
                                              <SelectItem key={op.value} value={op.value}>
                                                {op.label}
                                              </SelectItem>
                                            ))}
                                          </SelectContent>
                                        </Select>
                                      </div>
                                      <div className="col-span-4">
                                        {renderValueInput(nestedCondition, group.id, true, condition.id)}
                                      </div>
                                      <div className="col-span-1">
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          onClick={() => deleteCondition(group.id, nestedCondition.id, true, condition.id)}
                                        >
                                          <Trash2 className="h-3 w-3" />
                                        </Button>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))}

                          {group.conditions.length === 0 && (
                            <div className="text-center py-6 text-gray-500 border-2 border-dashed border-gray-300 rounded-lg">
                              <Filter className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                              <p className="mb-2">Bu grup henüz koşul içermiyor</p>
                              <Button variant="outline" onClick={() => addCondition(group.id)}>
                                İlk koşulu ekleyin
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}

                    {/* Gelişmiş seçenekler */}
                    {showAdvancedOptions && (
                      <div className="mt-6 p-4 bg-gray-50 rounded-lg border">
                        <h4 className="text-md font-semibold mb-3 flex items-center">
                          <Settings className="h-4 w-4 mr-2" />
                          Gelişmiş Ayarlar
                        </h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label>Öncelik</Label>
                            <Select
                              value={currentRule.priority}
                              onValueChange={(value: any) => setCurrentRule({...currentRule, priority: value})}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="low">Düşük</SelectItem>
                                <SelectItem value="medium">Orta</SelectItem>
                                <SelectItem value="high">Yüksek</SelectItem>
                                <SelectItem value="critical">Kritik</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label>Durum</Label>
                            <Select
                              value={currentRule.status}
                              onValueChange={(value: any) => setCurrentRule({...currentRule, status: value})}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="draft">Taslak</SelectItem>
                                <SelectItem value="active">Aktif</SelectItem>
                                <SelectItem value="inactive">Pasif</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div className="mt-4">
                          <Label>Etiketler (virgülle ayırın)</Label>
                          <Input
                            value={currentRule.tags?.join(', ') || ''}
                            onChange={(e) => setCurrentRule({
                              ...currentRule, 
                              tags: e.target.value.split(',').map(tag => tag.trim()).filter(Boolean)
                            })}
                            placeholder="fraud, high-risk, manual-review"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
              </div>
            </TabsContent>

            <TabsContent value="preview" className="flex-1 bg-white">
              <div className="flex-1 overflow-y-auto p-6 bg-white">
                <div className="bg-gray-50 rounded-lg p-4 border">
                  <h3 className="font-semibold mb-2 flex items-center text-gray-900">
                    <Eye className="h-4 w-4 mr-2" />
                    Kural Önizlemesi
                  </h3>
                  <pre className="text-sm whitespace-pre-wrap text-gray-700">{generateRulePreview()}</pre>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="test" className="flex-1 bg-white">
              <div className="flex-1 overflow-y-auto p-6 bg-white">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold flex items-center">
                      <TestTube className="h-4 w-4 mr-2" />
                      Kural Test Merkezi
                    </h3>
                    <Badge variant="secondary">v{currentRule?.version || 1}</Badge>
                  </div>

                  {/* Test Senaryoları */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Test Verisi Girişi */}
                    <div className="space-y-4">
                      <div className="border rounded-lg p-4">
                        <h4 className="font-medium mb-3 flex items-center">
                          <Code className="h-4 w-4 mr-2" />
                          Test Verisi
                        </h4>
                        
                        <div className="space-y-3">
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <Label className="text-sm">İşlem Tutarı (TL)</Label>
                              <Input
                                type="number"
                                placeholder="1500"
                                defaultValue="1500"
                                id="test-amount"
                              />
                            </div>
                            <div>
                              <Label className="text-sm">MCC Kodu</Label>
                              <Select defaultValue="7995">
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="7995">7995 - Kumar ve Bahis</SelectItem>
                                  <SelectItem value="5411">5411 - Market</SelectItem>
                                  <SelectItem value="5812">5812 - Restoran</SelectItem>
                                  <SelectItem value="4829">4829 - Para Transferi</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <Label className="text-sm">Ülke</Label>
                              <Select defaultValue="TR">
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="TR">🇹🇷 Türkiye</SelectItem>
                                  <SelectItem value="US">🇺🇸 ABD</SelectItem>
                                  <SelectItem value="DE">🇩🇪 Almanya</SelectItem>
                                  <SelectItem value="RU">🇷🇺 Rusya</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label className="text-sm">İşlem Tipi</Label>
                              <Select defaultValue="1">
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="1">1 - Satış</SelectItem>
                                  <SelectItem value="2">2 - İade</SelectItem>
                                  <SelectItem value="3">3 - Ön Provizyon</SelectItem>
                                  <SelectItem value="5">5 - Geri Ödeme</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <Label className="text-sm">Risk Skoru</Label>
                              <Input
                                type="number"
                                placeholder="75"
                                defaultValue="75"
                                min="0"
                                max="100"
                                id="test-risk-score"
                              />
                            </div>
                            <div>
                              <Label className="text-sm">Hız Kontrolü</Label>
                              <Input
                                type="number"
                                placeholder="3"
                                defaultValue="3"
                                id="test-velocity"
                              />
                            </div>
                          </div>

                          <div>
                            <Label className="text-sm">IP Adresi</Label>
                            <Input
                              placeholder="192.168.1.1"
                              defaultValue="192.168.1.1"
                              id="test-ip"
                            />
                          </div>

                          <div>
                            <Label className="text-sm">İşlem Zamanı</Label>
                            <Input
                              type="datetime-local"
                              defaultValue={new Date().toISOString().slice(0, 16)}
                              id="test-datetime"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Hazır Test Senaryoları */}
                      <div className="border rounded-lg p-4">
                        <h4 className="font-medium mb-3 flex items-center">
                          <Star className="h-4 w-4 mr-2" />
                          Hazır Test Senaryoları
                        </h4>
                        
                        <div className="space-y-2">
                          <Button 
                            variant="outline" 
                            className="w-full justify-start text-left"
                            onClick={() => loadTestScenario('high-risk')}
                          >
                            <AlertTriangle className="h-4 w-4 mr-2 text-red-500" />
                            <div>
                              <div className="font-medium">Yüksek Risk</div>
                              <div className="text-xs text-gray-500">Kumar + Yüksek tutar + Gece saati</div>
                            </div>
                          </Button>

                          <Button 
                            variant="outline" 
                            className="w-full justify-start text-left"
                            onClick={() => loadTestScenario('velocity')}
                          >
                            <Zap className="h-4 w-4 mr-2 text-yellow-500" />
                            <div>
                              <div className="font-medium">Hız Kontrolü</div>
                              <div className="text-xs text-gray-500">Çok sayıda işlem + Kısa süre</div>
                            </div>
                          </Button>

                          <Button 
                            variant="outline" 
                            className="w-full justify-start text-left"
                            onClick={() => loadTestScenario('normal')}
                          >
                            <Badge className="h-4 w-4 mr-2 text-green-500" />
                            <div>
                              <div className="font-medium">Normal İşlem</div>
                              <div className="text-xs text-gray-500">Düşük risk + Normal tutar</div>
                            </div>
                          </Button>

                          <Button 
                            variant="outline" 
                            className="w-full justify-start text-left"
                            onClick={() => loadTestScenario('international')}
                          >
                            <GitBranch className="h-4 w-4 mr-2 text-blue-500" />
                            <div>
                              <div className="font-medium">Uluslararası</div>
                              <div className="text-xs text-gray-500">Yurtdışı + Farklı para birimi</div>
                            </div>
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Test Sonuçları */}
                    <div className="space-y-4">
                      <div className="border rounded-lg p-4">
                        <h4 className="font-medium mb-3 flex items-center">
                          <Eye className="h-4 w-4 mr-2" />
                          Test Sonuçları
                        </h4>
                        
                        <div id="test-results" className="space-y-3">
                          <div className="text-center py-8 text-gray-500">
                            <TestTube className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                            <p>Test sonuçları burada görünecek</p>
                            <p className="text-sm">Yukarıdan bir test senaryosu seçin</p>
                          </div>
                        </div>
                      </div>

                      {/* Test Geçmişi */}
                      <div className="border rounded-lg p-4">
                        <h4 className="font-medium mb-3 flex items-center">
                          <FileText className="h-4 w-4 mr-2" />
                          Test Geçmişi
                        </h4>
                        
                        <div className="space-y-2 max-h-40 overflow-y-auto" id="test-history">
                          <div className="text-sm text-gray-500 text-center py-2">
                            Henüz test yapılmadı
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Test Butonu */}
                  <div className="flex justify-center space-x-3">
                    <Button onClick={runAdvancedTest} size="lg">
                      <Play className="h-4 w-4 mr-2" />
                      Test Çalıştır
                    </Button>
                    <Button variant="outline" onClick={clearTestResults}>
                      <Trash2 className="h-4 w-4 mr-2" />
                      Temizle
                    </Button>
                  </div>

                  {/* Test İstatistikleri */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                      <div className="text-2xl font-bold text-green-600" id="test-passed">0</div>
                      <div className="text-sm text-green-600">Başarılı</div>
                    </div>
                    <div className="text-center p-4 bg-red-50 rounded-lg border border-red-200">
                      <div className="text-2xl font-bold text-red-600" id="test-failed">0</div>
                      <div className="text-sm text-red-600">Başarısız</div>
                    </div>
                    <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="text-2xl font-bold text-blue-600" id="test-total">0</div>
                      <div className="text-sm text-blue-600">Toplam</div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter className="p-6 border-t flex-shrink-0 bg-white">
            <div className="flex justify-between w-full">
              <Button 
                variant="outline" 
                onClick={() => setIsModalOpen(false)}
              >
                İptal
              </Button>
              <div className="flex space-x-2">
                <Button 
                  variant="outline"
                  onClick={() => {
                    setActiveTab("test");
                  }}
                >
                  Test Et
                </Button>
                <Button 
                  onClick={() => {
                    if (currentRule) {
                      console.log('Kural kaydediliyor:', currentRule);
                      toast.success('Kural başarıyla kaydedildi!');
                      setIsModalOpen(false);
                    }
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Kaydet
                </Button>
              </div>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 