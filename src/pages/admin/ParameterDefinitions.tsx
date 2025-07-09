import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { toast } from "react-hot-toast";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  Globe, 
  CreditCard, 
  Building, 
  AlertCircle,
  Settings
} from "lucide-react";

// Ana Parametre Tipleri
export type ParameterCategory = 
  | 'countries'
  | 'mccCodes' 
  | 'transactionTypes'
  | 'responseCodes'
  | 'riskScores';

// Parametre Tanım Yapısı
export type ParameterDefinition = {
  id: string;
  category: ParameterCategory;
  code: string;
  name: string;
  description: string;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
};

// Başlangıç Verileri - Gerçek sistemlerden esinlenilmiş
const initialParameters: ParameterDefinition[] = [
  // Ülke Kodları
  {
    id: 'country_tr',
    category: 'countries',
    code: 'TR',
    name: 'Türkiye',
    description: 'Yerli kartlar ve işlemler',
    riskLevel: 'low',
    isActive: true,
    createdAt: '2023-01-01 10:00',
    updatedAt: '2023-01-01 10:00',
    createdBy: 'system@hepsipay.com'
  },
  {
    id: 'country_us',
    category: 'countries',
    code: 'US',
    name: 'Amerika Birleşik Devletleri',
    description: 'ABD merkezli kartlar',
    riskLevel: 'medium',
    isActive: true,
    createdAt: '2023-01-01 10:00',
    updatedAt: '2023-01-01 10:00',
    createdBy: 'system@hepsipay.com'
  },
  {
    id: 'country_ir',
    category: 'countries',
    code: 'IR',
    name: 'İran',
    description: 'Yüksek riskli ülke - Ekonomik yaptırımlar',
    riskLevel: 'critical',
    isActive: true,
    createdAt: '2023-01-01 10:00',
    updatedAt: '2023-01-01 10:00',
    createdBy: 'system@hepsipay.com'
  },
  {
    id: 'country_kp',
    category: 'countries',
    code: 'KP',
    name: 'Kuzey Kore',
    description: 'Kritik riskli ülke - Tam yasak',
    riskLevel: 'critical',
    isActive: true,
    createdAt: '2023-01-01 10:00',
    updatedAt: '2023-01-01 10:00',
    createdBy: 'system@hepsipay.com'
  },
  {
    id: 'country_sy',
    category: 'countries',
    code: 'SY',
    name: 'Suriye',
    description: 'Yüksek riskli ülke - Ekonomik yaptırımlar',
    riskLevel: 'critical',
    isActive: true,
    createdAt: '2023-01-01 10:00',
    updatedAt: '2023-01-01 10:00',
    createdBy: 'system@hepsipay.com'
  },
  {
    id: 'country_cu',
    category: 'countries',
    code: 'CU',
    name: 'Küba',
    description: 'Yüksek riskli ülke - Ekonomik yaptırımlar',
    riskLevel: 'critical',
    isActive: true,
    createdAt: '2023-01-01 10:00',
    updatedAt: '2023-01-01 10:00',
    createdBy: 'system@hepsipay.com'
  },
  {
    id: 'country_de',
    category: 'countries',
    code: 'DE',
    name: 'Almanya',
    description: 'AB üyesi güvenli ülke',
    riskLevel: 'low',
    isActive: true,
    createdAt: '2023-01-01 10:00',
    updatedAt: '2023-01-01 10:00',
    createdBy: 'system@hepsipay.com'
  },
  {
    id: 'country_ru',
    category: 'countries',
    code: 'RU',
    name: 'Rusya',
    description: 'Orta riskli ülke',
    riskLevel: 'medium',
    isActive: true,
    createdAt: '2023-01-01 10:00',
    updatedAt: '2023-01-01 10:00',
    createdBy: 'system@hepsipay.com'
  },

  // MCC Kodları
  {
    id: 'mcc_5999',
    category: 'mccCodes',
    code: '5999',
    name: 'Diğer Perakende Mağazalar',
    description: 'Çeşitli perakende satış noktaları',
    riskLevel: 'low',
    isActive: true,
    createdAt: '2023-01-01 10:00',
    updatedAt: '2023-01-01 10:00',
    createdBy: 'system@hepsipay.com'
  },
  {
    id: 'mcc_7995',
    category: 'mccCodes',
    code: '7995',
    name: 'Kumar ve Bahis',
    description: 'Online kumar, bahis siteleri',
    riskLevel: 'critical',
    isActive: true,
    createdAt: '2023-01-01 10:00',
    updatedAt: '2023-01-01 10:00',
    createdBy: 'system@hepsipay.com'
  },
  {
    id: 'mcc_6051',
    category: 'mccCodes',
    code: '6051',
    name: 'Kripto Para - Finansal Kurumlar',
    description: 'Kripto para alım-satım platformları',
    riskLevel: 'high',
    isActive: true,
    createdAt: '2023-01-01 10:00',
    updatedAt: '2023-01-01 10:00',
    createdBy: 'system@hepsipay.com'
  },
  {
    id: 'mcc_5912',
    category: 'mccCodes',
    code: '5912',
    name: 'Eczane',
    description: 'İlaç ve sağlık ürünleri satışı',
    riskLevel: 'low',
    isActive: true,
    createdAt: '2023-01-01 10:00',
    updatedAt: '2023-01-01 10:00',
    createdBy: 'system@hepsipay.com'
  },
  {
    id: 'mcc_5411',
    category: 'mccCodes',
    code: '5411',
    name: 'Market ve Süpermarket',
    description: 'Gıda ve günlük ihtiyaç ürünleri',
    riskLevel: 'low',
    isActive: true,
    createdAt: '2023-01-01 10:00',
    updatedAt: '2023-01-01 10:00',
    createdBy: 'system@hepsipay.com'
  },
  {
    id: 'mcc_5812',
    category: 'mccCodes',
    code: '5812',
    name: 'Restoran ve Lokanta',
    description: 'Yemek ve içecek servisi',
    riskLevel: 'low',
    isActive: true,
    createdAt: '2023-01-01 10:00',
    updatedAt: '2023-01-01 10:00',
    createdBy: 'system@hepsipay.com'
  },
  {
    id: 'mcc_4829',
    category: 'mccCodes',
    code: '4829',
    name: 'Para Transferi',
    description: 'Havale ve para transfer hizmetleri',
    riskLevel: 'high',
    isActive: true,
    createdAt: '2023-01-01 10:00',
    updatedAt: '2023-01-01 10:00',
    createdBy: 'system@hepsipay.com'
  },
  {
    id: 'mcc_7801',
    category: 'mccCodes',
    code: '7801',
    name: 'Online Bahis',
    description: 'İnternet üzerinden bahis hizmetleri',
    riskLevel: 'critical',
    isActive: true,
    createdAt: '2023-01-01 10:00',
    updatedAt: '2023-01-01 10:00',
    createdBy: 'system@hepsipay.com'
  },

  // İşlem Tipleri (Belgeden)
  {
    id: 'txn_type_1',
    category: 'transactionTypes',
    code: '1',
    name: 'Ödeme (Payment)',
    description: 'Standart ödeme işlemi',
    riskLevel: 'low',
    isActive: true,
    createdAt: '2023-01-01 10:00',
    updatedAt: '2023-01-01 10:00',
    createdBy: 'system@hepsipay.com'
  },
  {
    id: 'txn_type_2',
    category: 'transactionTypes',
    code: '2',
    name: 'PreAuth (Ön Provizyon)',
    description: 'Ön yetkilendirme işlemi',
    riskLevel: 'low',
    isActive: true,
    createdAt: '2023-01-01 10:00',
    updatedAt: '2023-01-01 10:00',
    createdBy: 'system@hepsipay.com'
  },
  {
    id: 'txn_type_3',
    category: 'transactionTypes',
    code: '3',
    name: 'PostAuth (Provizyon Kapama)',
    description: 'Ön yetkilendirme kapama',
    riskLevel: 'low',
    isActive: true,
    createdAt: '2023-01-01 10:00',
    updatedAt: '2023-01-01 10:00',
    createdBy: 'system@hepsipay.com'
  },
  {
    id: 'txn_type_5',
    category: 'transactionTypes',
    code: '5',
    name: 'Refund (Geri Ödeme)',
    description: 'İade işlemi',
    riskLevel: 'medium',
    isActive: true,
    createdAt: '2023-01-01 10:00',
    updatedAt: '2023-01-01 10:00',
    createdBy: 'system@hepsipay.com'
  },
  {
    id: 'txn_type_7',
    category: 'transactionTypes',
    code: '7',
    name: 'Chargeback-Refunded (Harcama İtirazı Reddi)',
    description: 'Harcama itirazının reddedilmesi',
    riskLevel: 'high',
    isActive: true,
    createdAt: '2023-01-01 10:00',
    updatedAt: '2023-01-01 10:00',
    createdBy: 'system@hepsipay.com'
  },

  // Banka Cevap Kodları (Belgeden)
  {
    id: 'response_00',
    category: 'responseCodes',
    code: '00',
    name: 'İşlem Onaylandı',
    description: 'Başarılı işlem',
    riskLevel: 'low',
    isActive: true,
    createdAt: '2023-01-01 10:00',
    updatedAt: '2023-01-01 10:00',
    createdBy: 'system@hepsipay.com'
  },
  {
    id: 'response_05',
    category: 'responseCodes',
    code: '05',
    name: 'İşlem Reddedildi',
    description: 'Genel red kodu',
    riskLevel: 'medium',
    isActive: true,
    createdAt: '2023-01-01 10:00',
    updatedAt: '2023-01-01 10:00',
    createdBy: 'system@hepsipay.com'
  },
  {
    id: 'response_14',
    category: 'responseCodes',
    code: '14',
    name: 'Geçersiz Kart Numarası',
    description: 'Kart numarası hatalı',
    riskLevel: 'high',
    isActive: true,
    createdAt: '2023-01-01 10:00',
    updatedAt: '2023-01-01 10:00',
    createdBy: 'system@hepsipay.com'
  },
  {
    id: 'response_96',
    category: 'responseCodes',
    code: '96',
    name: 'Sistem Hatası',
    description: 'Teknik sistem sorunu',
    riskLevel: 'medium',
    isActive: true,
    createdAt: '2023-01-01 10:00',
    updatedAt: '2023-01-01 10:00',
    createdBy: 'system@hepsipay.com'
  },
  {
    id: 'response_091',
    category: 'responseCodes',
    code: '091',
    name: 'Switch İnaktif',
    description: 'Ödeme sistemi geçici olarak devre dışı',
    riskLevel: 'medium',
    isActive: true,
    createdAt: '2023-01-01 10:00',
    updatedAt: '2023-01-01 10:00',
    createdBy: 'system@hepsipay.com'
  },
  {
    id: 'response_909',
    category: 'responseCodes',
    code: '909',
    name: 'Sistem Arızası',
    description: 'Genel sistem hatası',
    riskLevel: 'high',
    isActive: true,
    createdAt: '2023-01-01 10:00',
    updatedAt: '2023-01-01 10:00',
    createdBy: 'system@hepsipay.com'
  },
  {
    id: 'response_04',
    category: 'responseCodes',
    code: '04',
    name: 'Kart Bloke',
    description: 'Kartın kullanımı engellenmiş',
    riskLevel: 'high',
    isActive: true,
    createdAt: '2023-01-01 10:00',
    updatedAt: '2023-01-01 10:00',
    createdBy: 'system@hepsipay.com'
  },
  {
    id: 'response_38',
    category: 'responseCodes',
    code: '38',
    name: 'Hatalı PIN Denemesi',
    description: 'PIN kodu hatalı girildi',
    riskLevel: 'medium',
    isActive: true,
    createdAt: '2023-01-01 10:00',
    updatedAt: '2023-01-01 10:00',
    createdBy: 'system@hepsipay.com'
  },
  {
    id: 'response_41',
    category: 'responseCodes',
    code: '41',
    name: 'Kayıp Kart',
    description: 'Kart kayıp olarak bildirilmiş',
    riskLevel: 'critical',
    isActive: true,
    createdAt: '2023-01-01 10:00',
    updatedAt: '2023-01-01 10:00',
    createdBy: 'system@hepsipay.com'
  },
  {
    id: 'response_43',
    category: 'responseCodes',
    code: '43',
    name: 'Çalıntı Kart',
    description: 'Kart çalıntı olarak bildirilmiş',
    riskLevel: 'critical',
    isActive: true,
    createdAt: '2023-01-01 10:00',
    updatedAt: '2023-01-01 10:00',
    createdBy: 'system@hepsipay.com'
  },
  {
    id: 'response_51',
    category: 'responseCodes',
    code: '51',
    name: 'Yetersiz Bakiye',
    description: 'Hesapta yeterli para yok',
    riskLevel: 'low',
    isActive: true,
    createdAt: '2023-01-01 10:00',
    updatedAt: '2023-01-01 10:00',
    createdBy: 'system@hepsipay.com'
  },

  // Risk Skorları
  {
    id: 'risk_velocity',
    category: 'riskScores',
    code: 'VELOCITY_HIGH',
    name: 'Yüksek İşlem Hızı',
    description: 'Çok kısa sürede çoklu işlem',
    riskLevel: 'high',
    isActive: true,
    createdAt: '2023-01-01 10:00',
    updatedAt: '2023-01-01 10:00',
    createdBy: 'system@hepsipay.com'
  },
  {
    id: 'risk_amount',
    category: 'riskScores',
    code: 'AMOUNT_SUSPICIOUS',
    name: 'Şüpheli Tutar',
    description: 'Olağandışı yüksek tutar',
    riskLevel: 'high',
    isActive: true,
    createdAt: '2023-01-01 10:00',
    updatedAt: '2023-01-01 10:00',
    createdBy: 'system@hepsipay.com'
  }
];

const categoryConfig = {
  countries: {
    title: 'Ülke Kodları',
    icon: Globe,
    description: 'Ülke tanımları ve risk seviyeleri'
  },
  mccCodes: {
    title: 'MCC Kodları',
    icon: Building,
    description: 'İş yeri kategori kodları'
  },
  transactionTypes: {
    title: 'İşlem Tipleri',
    icon: CreditCard,
    description: 'Ödeme işlem türleri'
  },
  responseCodes: {
    title: 'Banka Cevap Kodları',
    icon: AlertCircle,
    description: 'Banka yanıt kodları'
  },
  riskScores: {
    title: 'Risk Skorları',
    icon: Settings,
    description: 'Risk değerlendirme parametreleri'
  }
};

export default function ParameterDefinitionsPage() {
  const [parameters, setParameters] = useState<ParameterDefinition[]>(initialParameters);
  const [activeCategory, setActiveCategory] = useState<ParameterCategory>('countries');
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [selectedParameter, setSelectedParameter] = useState<ParameterDefinition | null>(null);
  const [formData, setFormData] = useState<Partial<ParameterDefinition>>({});

  const handleNewParameter = () => {
    setFormData({
      category: activeCategory,
      code: '',
      name: '',
      description: '',
      riskLevel: 'low',
      isActive: true
    });
    setIsCreating(true);
    setSelectedParameter(null);
    setIsSheetOpen(true);
  };

  const handleEditParameter = (parameter: ParameterDefinition) => {
    setFormData(parameter);
    setIsCreating(false);
    setSelectedParameter(parameter);
    setIsSheetOpen(true);
  };

  const handleDeleteParameter = (parameterId: string) => {
    if (confirm('Bu parametreyi silmek istediğinizden emin misiniz?')) {
      setParameters(prev => prev.filter(p => p.id !== parameterId));
      toast.success('Parametre başarıyla silindi.');
    }
  };

  const handleSave = () => {
    if (!formData.code || !formData.name) {
      toast.error('Kod ve isim alanları zorunludur.');
      return;
    }

    const now = new Date().toLocaleString('tr-TR');
    
    if (isCreating) {
      const newParameter: ParameterDefinition = {
        id: `${formData.category}_${Date.now()}`,
        ...formData,
        createdAt: now,
        updatedAt: now,
        createdBy: 'currentUser@hepsipay.com'
      } as ParameterDefinition;
      
      setParameters(prev => [newParameter, ...prev]);
      toast.success('Parametre başarıyla oluşturuldu.');
    } else if (selectedParameter) {
      setParameters(prev => prev.map(p => 
        p.id === selectedParameter.id 
          ? { ...formData, updatedAt: now } as ParameterDefinition
          : p
      ));
      toast.success('Parametre başarıyla güncellendi.');
    }

    setIsSheetOpen(false);
    setIsCreating(false);
    setSelectedParameter(null);
  };

  const filteredParameters = parameters.filter(p => p.category === activeCategory);

  const getRiskBadgeVariant = (riskLevel: string) => {
    switch (riskLevel) {
      case 'low': return 'default';
      case 'medium': return 'secondary';
      case 'high': return 'destructive';
      case 'critical': return 'destructive';
      default: return 'default';
    }
  };

  const getRiskBadgeColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Parametre Tanımları</h1>
          <p className="text-md text-gray-600 mt-1">
            Fraud kurallarında kullanılacak tüm parametreleri merkezi olarak yönetin.
          </p>
        </div>
        <Button onClick={handleNewParameter}>
          <Plus className="h-4 w-4 mr-2" />
          Yeni Parametre
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow-md border">
        <Tabs value={activeCategory} onValueChange={(value) => setActiveCategory(value as ParameterCategory)}>
          <TabsList className="grid w-full grid-cols-5 rounded-none border-b">
            {Object.entries(categoryConfig).map(([key, config]) => {
              const IconComponent = config.icon;
              return (
                <TabsTrigger key={key} value={key} className="flex items-center gap-2">
                  <IconComponent className="h-4 w-4" />
                  {config.title}
                </TabsTrigger>
              );
            })}
          </TabsList>

          {Object.entries(categoryConfig).map(([key, config]) => (
            <TabsContent key={key} value={key}>
              <div className="p-6">
                <div className="mb-4">
                <h3 className="text-lg font-semibold">{config.title}</h3>
                <p className="text-sm text-gray-600">{config.description}</p>
              </div>
              
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Kod</TableHead>
                    <TableHead>İsim</TableHead>
                    <TableHead>Açıklama</TableHead>
                    <TableHead>Risk Seviyesi</TableHead>
                    <TableHead>Durum</TableHead>
                    <TableHead>Son Güncelleme</TableHead>
                    <TableHead className="text-right">Eylemler</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredParameters.map((parameter) => (
                    <TableRow key={parameter.id}>
                      <TableCell className="font-mono">{parameter.code}</TableCell>
                      <TableCell className="font-medium">{parameter.name}</TableCell>
                      <TableCell className="max-w-xs truncate">{parameter.description}</TableCell>
                      <TableCell>
                        <Badge 
                          variant={getRiskBadgeVariant(parameter.riskLevel)}
                          className={getRiskBadgeColor(parameter.riskLevel)}
                        >
                          {parameter.riskLevel === 'low' && 'Düşük'}
                          {parameter.riskLevel === 'medium' && 'Orta'}
                          {parameter.riskLevel === 'high' && 'Yüksek'}
                          {parameter.riskLevel === 'critical' && 'Kritik'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={parameter.isActive ? 'default' : 'secondary'}>
                          {parameter.isActive ? 'Aktif' : 'Pasif'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-gray-500">{parameter.updatedAt}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleEditParameter(parameter)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleDeleteParameter(parameter.id)}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>

      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="w-full sm:max-w-md">
          <SheetHeader>
            <SheetTitle>
              {isCreating ? 'Yeni Parametre' : 'Parametre Düzenle'}
            </SheetTitle>
            <SheetDescription>
              {categoryConfig[formData.category || activeCategory]?.title} parametresi {isCreating ? 'oluşturun' : 'düzenleyin'}.
            </SheetDescription>
          </SheetHeader>

          <div className="py-6 space-y-4">
            <div>
              <Label htmlFor="code">Parametre Kodu *</Label>
              <Input
                id="code"
                value={formData.code || ''}
                onChange={(e) => setFormData({...formData, code: e.target.value})}
                placeholder="Örn: TR, 5999, 05"
              />
            </div>

            <div>
              <Label htmlFor="name">İsim *</Label>
              <Input
                id="name"
                value={formData.name || ''}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="Açıklayıcı isim"
              />
            </div>

            <div>
              <Label htmlFor="description">Açıklama</Label>
              <Input
                id="description"
                value={formData.description || ''}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Detaylı açıklama"
              />
            </div>

            <div>
              <Label htmlFor="riskLevel">Risk Seviyesi</Label>
              <select
                id="riskLevel"
                value={formData.riskLevel || 'low'}
                onChange={(e) => setFormData({...formData, riskLevel: e.target.value as any})}
                className="w-full p-2 border rounded-md"
              >
                <option value="low">Düşük</option>
                <option value="medium">Orta</option>
                <option value="high">Yüksek</option>
                <option value="critical">Kritik</option>
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive || false}
                onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
              />
              <Label htmlFor="isActive">Aktif</Label>
            </div>
          </div>

          <SheetFooter>
            <SheetClose asChild>
              <Button variant="outline">İptal</Button>
            </SheetClose>
            <Button onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              Kaydet
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
} 