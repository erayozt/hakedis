import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "react-hot-toast";
import { 
  Shield, 
  Clock, 
  Globe, 
  CreditCard, 
  AlertTriangle,
  DollarSign,
  Users,
  Building,
  Zap,
  Copy,
  Eye,
  Star
} from "lucide-react";

// Şablon Kategorileri
export type TemplateCategory = 'velocity' | 'amount' | 'geographic' | 'behavioral' | 'merchant' | 'card';

// Kural Şablonu Yapısı
export type RuleTemplate = {
  id: string;
  name: string;
  description: string;
  category: TemplateCategory;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  useCase: string;
  conditions: string[];
  defaultParameters: Record<string, any>;
  estimatedFalsePositive: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  popularity: number; // 1-5 stars
  tags: string[];
  icon: any;
};

// Önceden Tanımlanmış Şablonlar
const ruleTemplates: RuleTemplate[] = [
  // Velocity (Hız/Sıklık) Şablonları
  {
    id: 'velocity_card_attempts',
    name: 'Aynı Kart ile Çoklu Deneme',
    description: 'Kısa sürede aynı kart ile yapılan çoklu işlem denemelerini tespit eder.',
    category: 'velocity',
    riskLevel: 'high',
    useCase: 'Çalıntı kart tespiti, bot saldırıları',
    conditions: [
      'İşlem adedi > 5',
      'Zaman aralığı < 10 dakika',
      'Aynı kart numarası',
      'Farklı işyerleri (opsiyonel)'
    ],
    defaultParameters: {
      thresholdCount: 5,
      timeWindowMinutes: 10,
      includeSuccessful: false
    },
    estimatedFalsePositive: '%2-5',
    difficulty: 'beginner',
    popularity: 5,
    tags: ['velocity', 'card-security', 'bot-protection'],
    icon: CreditCard
  },
  {
    id: 'velocity_ip_cards',
    name: 'Aynı IP\'den Çoklu Kart',
    description: 'Tek IP adresinden çok sayıda farklı kart ile işlem denemesi.',
    category: 'velocity',
    riskLevel: 'critical',
    useCase: 'Kart numarası test etme, toplu saldırılar',
    conditions: [
      'Farklı kart sayısı > 3',
      'Zaman aralığı < 15 dakika',
      'Aynı IP adresi',
      'Banka red oranı > %50'
    ],
    defaultParameters: {
      uniqueCardCount: 3,
      timeWindowMinutes: 15,
      minDeclineRate: 50
    },
    estimatedFalsePositive: '%1-3',
    difficulty: 'intermediate',
    popularity: 4,
    tags: ['velocity', 'ip-analysis', 'card-testing'],
    icon: Users
  },

  // Amount (Tutar) Şablonları
  {
    id: 'amount_high_value',
    name: 'Yüksek Tutarlı İşlem',
    description: 'Olağandışı yüksek tutarlı işlemleri anlık olarak tespit eder.',
    category: 'amount',
    riskLevel: 'medium',
    useCase: 'Büyük tutarlı sahte işlemler, çalıntı kart kullanımı',
    conditions: [
      'İşlem tutarı > 10,000 TL',
      'İşlem tipi = Ödeme',
      'İlk işlem kontrolü (opsiyonel)'
    ],
    defaultParameters: {
      thresholdAmount: 10000,
      transactionType: 1,
      checkFirstTransaction: true
    },
    estimatedFalsePositive: '%5-10',
    difficulty: 'beginner',
    popularity: 5,
    tags: ['amount', 'high-value', 'real-time'],
    icon: DollarSign
  },
  {
    id: 'amount_suspicious_refund',
    name: 'Şüpheli Geri Ödeme',
    description: 'Yüksek tutarlı veya sık geri ödeme işlemlerini kontrol eder.',
    category: 'amount',
    riskLevel: 'high',
    useCase: 'Para aklama, sahte iade işlemleri',
    conditions: [
      'İşlem tipi = Geri Ödeme',
      'Tutar > 5,000 TL',
      'Günlük geri ödeme adedi > 3'
    ],
    defaultParameters: {
      transactionType: 5,
      thresholdAmount: 5000,
      dailyRefundCount: 3
    },
    estimatedFalsePositive: '%3-7',
    difficulty: 'intermediate',
    popularity: 4,
    tags: ['refund', 'money-laundering', 'amount-analysis'],
    icon: AlertTriangle
  },

  // Geographic (Coğrafi) Şablonları
  {
    id: 'geo_high_risk_country',
    name: 'Yüksek Riskli Ülke',
    description: 'Belirli yüksek riskli ülkelerden gelen işlemleri kontrol eder.',
    category: 'geographic',
    riskLevel: 'critical',
    useCase: 'Uluslararası dolandırıcılık, yaptırım listesi kontrolü',
    conditions: [
      'Ülke kodu IN [IR, KP, SY, CU]',
      'İşlem tutarı > 100 TL',
      'İşlem tipi = Ödeme'
    ],
    defaultParameters: {
      riskCountries: ['IR', 'KP', 'SY', 'CU'],
      thresholdAmount: 100,
      transactionType: 1
    },
    estimatedFalsePositive: '%1-2',
    difficulty: 'beginner',
    popularity: 3,
    tags: ['geography', 'sanctions', 'compliance'],
    icon: Globe
  },

  // Behavioral (Davranışsal) Şablonları
  {
    id: 'behavioral_night_transactions',
    name: 'Gece Saatleri İşlemleri',
    description: 'Gece saatlerinde yapılan yüksek tutarlı işlemleri izler.',
    category: 'behavioral',
    riskLevel: 'medium',
    useCase: 'Çalıntı kart kullanımı, bot işlemleri',
    conditions: [
      'Saat aralığı: 01:00 - 07:00',
      'İşlem tutarı > 2,500 TL',
      'İşyeri kategorisi kontrol (opsiyonel)'
    ],
    defaultParameters: {
      startHour: 1,
      endHour: 7,
      thresholdAmount: 2500,
      checkMCC: false
    },
    estimatedFalsePositive: '%8-15',
    difficulty: 'intermediate',
    popularity: 4,
    tags: ['time-based', 'behavioral', 'night-activity'],
    icon: Clock
  },

  // Merchant (İşyeri) Şablonları
  {
    id: 'merchant_risky_mcc',
    name: 'Riskli İş Kategorisi',
    description: 'Kumar, kripto para gibi yüksek riskli MCC kodlarını kontrol eder.',
    category: 'merchant',
    riskLevel: 'high',
    useCase: 'Yasal uyumluluk, risk yönetimi',
    conditions: [
      'MCC kodu IN [7995, 6051, 7801]',
      'İşlem adedi > 3 (günlük)',
      'Toplam tutar > 1,000 TL'
    ],
    defaultParameters: {
      riskMCCs: ['7995', '6051', '7801'],
      dailyTransactionCount: 3,
      dailyAmount: 1000
    },
    estimatedFalsePositive: '%5-8',
    difficulty: 'beginner',
    popularity: 5,
    tags: ['mcc', 'compliance', 'gambling', 'crypto'],
    icon: Building
  },

  // Card (Kart) Şablonları
  {
    id: 'card_decline_velocity',
    name: 'Kart Red Sıklığı',
    description: 'Kısa sürede çok sayıda red alan kartları tespit eder.',
    category: 'card',
    riskLevel: 'high',
    useCase: 'Geçersiz kart tespiti, CVV deneme saldırıları',
    conditions: [
      'Banka red sayısı > 4',
      'Zaman aralığı < 60 dakika',
      'Aynı kart numarası',
      'Red kodları: 05, 14, 51'
    ],
    defaultParameters: {
      declineCount: 4,
      timeWindowMinutes: 60,
      declineCodes: ['05', '14', '51']
    },
    estimatedFalsePositive: '%3-6',
    difficulty: 'intermediate',
    popularity: 4,
    tags: ['card-testing', 'decline-analysis', 'cvv-attack'],
    icon: Shield
  }
];

// Kategori yapılandırması
const categoryConfig = {
  velocity: {
    title: 'Hız/Sıklık Kuralları',
    description: 'İşlem sıklığı ve hız bazlı tespit',
    color: 'bg-blue-100 text-blue-800',
    icon: Zap
  },
  amount: {
    title: 'Tutar Kuralları',
    description: 'İşlem tutarı bazlı kontroller',
    color: 'bg-green-100 text-green-800',
    icon: DollarSign
  },
  geographic: {
    title: 'Coğrafi Kurallar',
    description: 'Lokasyon ve ülke bazlı kontroller',
    color: 'bg-purple-100 text-purple-800',
    icon: Globe
  },
  behavioral: {
    title: 'Davranışsal Kurallar',
    description: 'Kullanıcı davranışı analizi',
    color: 'bg-orange-100 text-orange-800',
    icon: Users
  },
  merchant: {
    title: 'İşyeri Kuralları',
    description: 'İşyeri ve MCC bazlı kontroller',
    color: 'bg-indigo-100 text-indigo-800',
    icon: Building
  },
  card: {
    title: 'Kart Güvenliği',
    description: 'Kart bazlı güvenlik kontrolleri',
    color: 'bg-red-100 text-red-800',
    icon: CreditCard
  }
};

export default function RuleTemplatesPage() {
  const [selectedCategory, setSelectedCategory] = useState<TemplateCategory | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Şablonu uygula
  const applyTemplate = (template: RuleTemplate) => {
    // Gerçek uygulamada bu şablon, kural oluşturucu sayfasına aktarılacak
    toast.success(`"${template.name}" şablonu uygulandı! Kural oluşturucu sayfasına yönlendiriliyorsunuz.`);
    
    // Şablonu localStorage'a kaydet (kural oluşturucu tarafından okunacak)
    localStorage.setItem('selectedTemplate', JSON.stringify(template));
    
    // Kural oluşturucu sayfasına yönlendir
    window.location.href = '/admin/rule-builder';
  };

  // Şablonu önizle
  const previewTemplate = (template: RuleTemplate) => {
    const preview = `
Şablon: ${template.name}

Açıklama: ${template.description}

Kullanım Alanı: ${template.useCase}

Koşullar:
${template.conditions.map(condition => `• ${condition}`).join('\n')}

Varsayılan Parametreler:
${Object.entries(template.defaultParameters).map(([key, value]) => `• ${key}: ${value}`).join('\n')}

Tahmini Yanlış Pozitif Oranı: ${template.estimatedFalsePositive}
    `;
    
    alert(preview);
  };

  // Filtrelenmiş şablonlar
  const filteredTemplates = ruleTemplates.filter(template => {
    const categoryMatch = selectedCategory === 'all' || template.category === selectedCategory;
    const searchMatch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       template.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return categoryMatch && searchMatch;
  });

  // Risk seviyesi badge rengi
  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Zorluk seviyesi badge rengi
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-blue-100 text-blue-800';
      case 'intermediate': return 'bg-purple-100 text-purple-800';
      case 'advanced': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Kural Şablonları</h1>
        <p className="text-md text-gray-600">
          Yaygın fraud senaryoları için hazır kural şablonları. Tek tıkla uygulayın veya kendi ihtiyaçlarınıza göre özelleştirin.
        </p>
      </div>

      {/* Filtreler */}
      <div className="bg-white rounded-lg shadow-md border p-6 mb-6">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex-1 min-w-[200px]">
            <input
              type="text"
              placeholder="Şablon ara..."
              className="w-full px-3 py-2 border rounded-md"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            <Button
              variant={selectedCategory === 'all' ? 'default' : 'outline'}
              onClick={() => setSelectedCategory('all')}
              size="sm"
            >
              Tümü
            </Button>
            {Object.entries(categoryConfig).map(([key, config]) => {
              const IconComponent = config.icon;
              return (
                <Button
                  key={key}
                  variant={selectedCategory === key ? 'default' : 'outline'}
                  onClick={() => setSelectedCategory(key as TemplateCategory)}
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <IconComponent className="h-4 w-4" />
                  {config.title}
                </Button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Şablon Kartları */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template) => {
          const IconComponent = template.icon;
          const categoryInfo = categoryConfig[template.category];
          
          return (
            <Card key={template.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      <IconComponent className="h-5 w-5" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{template.name}</CardTitle>
                      <Badge className={`${categoryInfo.color} text-xs`}>
                        {categoryInfo.title}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex">
                    {Array.from({ length: template.popularity }, (_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </div>
                <CardDescription className="mt-2">
                  {template.description}
                </CardDescription>
              </CardHeader>

              <CardContent>
                <div className="space-y-3">
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-1">Kullanım Alanı:</h4>
                    <p className="text-sm text-gray-600">{template.useCase}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-1">Ana Koşullar:</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {template.conditions.slice(0, 3).map((condition, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                          {condition}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-2">
                    <Badge className={getRiskColor(template.riskLevel)}>
                      {template.riskLevel === 'low' && 'Düşük Risk'}
                      {template.riskLevel === 'medium' && 'Orta Risk'}
                      {template.riskLevel === 'high' && 'Yüksek Risk'}
                      {template.riskLevel === 'critical' && 'Kritik Risk'}
                    </Badge>
                    <Badge className={getDifficultyColor(template.difficulty)}>
                      {template.difficulty === 'beginner' && 'Başlangıç'}
                      {template.difficulty === 'intermediate' && 'Orta'}
                      {template.difficulty === 'advanced' && 'İleri'}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      FP: {template.estimatedFalsePositive}
                    </Badge>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => previewTemplate(template)}
                  className="flex-1"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Önizle
                </Button>
                <Button 
                  size="sm" 
                  onClick={() => applyTemplate(template)}
                  className="flex-1"
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Uygula
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>

      {filteredTemplates.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400">
            <Building className="h-12 w-12 mx-auto mb-4" />
            <p>Aradığınız kriterlere uygun şablon bulunamadı.</p>
            <p className="text-sm">Arama terimini değiştirin veya farklı kategori seçin.</p>
          </div>
        </div>
      )}
    </div>
  );
} 