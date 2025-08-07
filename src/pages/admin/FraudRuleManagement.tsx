import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { PlusCircle, Edit2, Trash2, ToggleLeft, ToggleRight, Search, ChevronDown, X, Globe } from 'lucide-react';
import { FraudRule, FraudRuleParameter } from '../../types';
import { mockDataService } from '../../services/mockDataService';
import { fraudRuleService } from '../../services/fraudRuleService';
import FraudRuleModal from '../../components/FraudRuleModal';
import toast from 'react-hot-toast';
import { Badge } from '../../components/ui/badge';

const operatorLabels: Record<string, string> = {
  '<': '<',
  '<=': '≤',
  '==': '=',
  '>=': '≥',
  '>': '>',
  'in': 'içerir',
  'notIn': 'içermez',
  'is': 'evet',
  'isNot': 'hayır',
  'between': 'arasında'
};

const parameterLabels: Record<FraudRuleParameter, string> = {
  amount: 'İşlem Tutarı',
  cardType: 'Kart Tipi',
  cardCountry: 'Kart Ülkesi',
  hourOfDay: 'İşlem Saati',
  ipAddress: 'IP Adresi',
  uniqueDeviceId: 'Cihaz ID',
};

const actionLabels: Record<string, string> = {
  'force_3d': '3D Secure Yönlendir',
  'process_non_3d': '3D Secure Olmadan İşle',
  'reject': 'İşlemi Reddet'
};

const actionColors: Record<string, string> = {
  'force_3d': 'bg-blue-100 text-blue-800',
  'process_non_3d': 'bg-green-100 text-green-800',
  'reject': 'bg-red-100 text-red-800'
};

const FraudRuleManagement: React.FC = () => {
  const [allRules, setAllRules] = useState<FraudRule[]>([]);
  const [filteredRules, setFilteredRules] = useState<FraudRule[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  
  const [merchantFilter, setMerchantFilter] = useState('');
  const [parameterFilter, setParameterFilter] = useState('');
  const [actionFilter, setActionFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  
  const [showMerchantFilter, setShowMerchantFilter] = useState(false);
  const [showParameterFilter, setShowParameterFilter] = useState(false);
  const [showActionFilter, setShowActionFilter] = useState(false);
  const [showStatusFilter, setShowStatusFilter] = useState(false);
  
  const merchantFilterRef = useRef<HTMLDivElement>(null);
  const parameterFilterRef = useRef<HTMLDivElement>(null);
  const actionFilterRef = useRef<HTMLDivElement>(null);
  const statusFilterRef = useRef<HTMLDivElement>(null);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<FraudRule | null>(null);
  
  const allMerchants = useMemo(() => mockDataService.getMerchants(), []);

  const loadAllRules = async () => {
    setInitialLoading(true);
    try {
      const rules = await fraudRuleService.getAllRules();
      setAllRules(rules);
    } catch (error) {
      console.error('Error loading rules:', error);
      toast.error('Kurallar yüklenirken hata oluştu');
    } finally {
      setInitialLoading(false);
    }
  };

  useEffect(() => {
    loadAllRules();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const refs = [merchantFilterRef, parameterFilterRef, actionFilterRef, statusFilterRef];
      const setters = [setShowMerchantFilter, setShowParameterFilter, setShowActionFilter, setShowStatusFilter];
      refs.forEach((ref, index) => {
        if (ref.current && !ref.current.contains(event.target as Node)) {
          setters[index](false);
        }
      });
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    let filtered = [...allRules];

    if (merchantFilter) {
      filtered = filtered.filter(rule => {
        if (rule.merchantId === 'all') {
            return 'tüm üye işyerleri'.includes(merchantFilter.toLowerCase()) || 'genel kural'.includes(merchantFilter.toLowerCase());
        }
        const merchant = allMerchants.find(m => m.id === rule.merchantId);
        return merchant?.merchantName.toLowerCase().includes(merchantFilter.toLowerCase()) ||
               merchant?.merchantNumber.toLowerCase().includes(merchantFilter.toLowerCase());
      });
    }

    if (parameterFilter) filtered = filtered.filter(rule => rule.parameter === parameterFilter);
    if (actionFilter) filtered = filtered.filter(rule => rule.action === actionFilter);
    if (statusFilter) filtered = filtered.filter(rule => rule.isActive === (statusFilter === 'active'));
    
    setFilteredRules(filtered);
  }, [allRules, merchantFilter, parameterFilter, actionFilter, statusFilter, allMerchants]);

  const getMerchantInfo = (merchantId: string) => {
    if (merchantId === 'all') {
      return { merchantName: 'Tüm Üye İşyerleri', merchantNumber: 'Genel Kural' };
    }
    return allMerchants.find(m => m.id === merchantId);
  };

  const handleOpenModal = (rule?: FraudRule) => {
    setEditingRule(rule || null);
    setIsModalOpen(true);
  };

  const handleSaveRule = async (ruleData: Omit<FraudRule, 'id' | 'createdAt' | 'updatedAt'>) => {
    setLoading(true);
    try {
      if (editingRule) {
        const updatedRule = await fraudRuleService.updateRule(editingRule.id, ruleData);
        setAllRules(prev => prev.map(rule => rule.id === updatedRule.id ? updatedRule : rule));
        toast.success('Kural başarıyla güncellendi');
      } else {
        const newRule = await fraudRuleService.createRule(ruleData);
        setAllRules(prev => [...prev, newRule]);
        toast.success('Yeni kural başarıyla eklendi');
      }
    } catch (error) {
      console.error('Error saving rule:', error);
      toast.error('Kural kaydedilirken hata oluştu');
    } finally {
      setLoading(false);
      setIsModalOpen(false);
    }
  };

  const handleDeleteRule = async (ruleId: string) => {
    if (!window.confirm('Bu kuralı silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.')) return;
    
    setLoading(true);
    try {
      await fraudRuleService.deleteRule(ruleId);
      setAllRules(prev => prev.filter(rule => rule.id !== ruleId));
      toast.success('Kural başarıyla silindi');
    } catch (error) {
      console.error('Error deleting rule:', error);
      toast.error('Kural silinirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleRule = async (rule: FraudRule) => {
    setLoading(true);
    try {
      const updatedRule = await fraudRuleService.toggleRuleStatus(rule.id);
      setAllRules(prev => prev.map(r => r.id === updatedRule.id ? updatedRule : r));
      toast.success(`Kural ${updatedRule.isActive ? 'aktif' : 'pasif'} hale getirildi`);
    } catch (error) {
      console.error('Error toggling rule:', error);
      toast.error('Kural durumu değiştirilirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setMerchantFilter('');
    setParameterFilter('');
    setActionFilter('');
    setStatusFilter('');
  };
  
  const formatRuleValue = (rule: FraudRule) => {
    const { parameter, value } = rule;
    switch (parameter) {
      case 'amount':
        return `${(value as number).toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}`;
      case 'cardType':
      case 'cardCountry':
      case 'ipAddress':
      case 'uniqueDeviceId':
        if (Array.isArray(value)) return value.join(', ');
        return String(value);
      case 'hourOfDay':
        if (typeof value === 'object' && value !== null && 'start' in value && 'end' in value) {
            return `${value.start} - ${value.end}`;
        }
        return 'Geçersiz Saat Aralığı';
      default:
        return String(value);
    }
  };

  const hasActiveFilters = merchantFilter || parameterFilter || actionFilter || statusFilter;

  if (initialLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2">Kurallar yükleniyor...</span>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-full mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Fraud Kural Yönetimi</h1>
          <p className="text-gray-600">
            Genel veya üye işyeri bazında fraud kurallarını yönetin.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          {hasActiveFilters && (
            <Button variant="outline" size="sm" onClick={clearFilters}>
              <X className="h-3 w-3 mr-1" />
              Filtreleri Temizle
            </Button>
          )}
          <Button onClick={() => handleOpenModal()} disabled={loading}>
            <PlusCircle className="h-4 w-4 mr-2" />
            Yeni Kural Ekle
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center space-x-2">
                    <span>Üye İşyeri</span>
                    <div className="relative" ref={merchantFilterRef}>
                      <button onClick={() => setShowMerchantFilter(!showMerchantFilter)} className={`p-1 rounded hover:bg-gray-200 ${merchantFilter ? 'text-blue-600' : 'text-gray-400'}`}>
                        <Search className="h-3 w-3" />
                      </button>
                      {showMerchantFilter && (
                        <div className="absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-10 min-w-[200px] p-3">
                          <Input placeholder="İşyeri veya 'genel' ara..." value={merchantFilter} onChange={(e) => setMerchantFilter(e.target.value)} autoFocus />
                        </div>
                      )}
                    </div>
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                   <div className="flex items-center space-x-2">
                    <span>Kural Detayı</span>
                     <div className="relative" ref={parameterFilterRef}>
                       <button onClick={() => setShowParameterFilter(!showParameterFilter)} className={`p-1 rounded hover:bg-gray-200 ${parameterFilter ? 'text-blue-600' : 'text-gray-400'}`}>
                         <ChevronDown className="h-3 w-3" />
                       </button>
                       {showParameterFilter && (
                         <div className="absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-10 min-w-[180px] py-1">
                           <button onClick={() => { setParameterFilter(''); setShowParameterFilter(false); }} className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50">Tümü</button>
                           {Object.entries(parameterLabels).map(([key, label]) => (
                              <button key={key} onClick={() => { setParameterFilter(key); setShowParameterFilter(false); }} className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50">{label}</button>
                           ))}
                         </div>
                       )}
                     </div>
                   </div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center space-x-2">
                    <span>Aksiyon</span>
                     <div className="relative" ref={actionFilterRef}>
                       <button onClick={() => setShowActionFilter(!showActionFilter)} className={`p-1 rounded hover:bg-gray-200 ${actionFilter ? 'text-blue-600' : 'text-gray-400'}`}>
                         <ChevronDown className="h-3 w-3" />
                       </button>
                       {showActionFilter && (
                         <div className="absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-10 min-w-[200px] py-1">
                           <button onClick={() => { setActionFilter(''); setShowActionFilter(false); }} className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50">Tümü</button>
                           {Object.entries(actionLabels).map(([key, label]) => (
                              <button key={key} onClick={() => { setActionFilter(key); setShowActionFilter(false); }} className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50">{label}</button>
                           ))}
                         </div>
                       )}
                     </div>
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center space-x-2">
                    <span>Durum</span>
                     <div className="relative" ref={statusFilterRef}>
                       <button onClick={() => setShowStatusFilter(!showStatusFilter)} className={`p-1 rounded hover:bg-gray-200 ${statusFilter ? 'text-blue-600' : 'text-gray-400'}`}>
                         <ChevronDown className="h-3 w-3" />
                       </button>
                       {showStatusFilter && (
                         <div className="absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-10 min-w-[120px] py-1">
                           <button onClick={() => { setStatusFilter(''); setShowStatusFilter(false); }} className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50">Tümü</button>
                           <button onClick={() => { setStatusFilter('active'); setShowStatusFilter(false); }} className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50">Aktif</button>
                           <button onClick={() => { setStatusFilter('inactive'); setShowStatusFilter(false); }} className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50">Pasif</button>
                         </div>
                       )}
                     </div>
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">İşlemler</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRules.length > 0 ? (
                filteredRules.map((rule) => {
                  const merchantInfo = getMerchantInfo(rule.merchantId);
                  return (
                    <tr key={rule.id} className={`hover:bg-gray-50 ${!rule.isActive ? 'opacity-50' : ''}`}>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center">
                           {rule.merchantId === 'all' && <Globe className="h-5 w-5 mr-2 text-blue-600" />}
                           <div>
                            <div className="text-sm font-medium text-gray-900">{merchantInfo?.merchantName}</div>
                            <div className="text-xs text-gray-500">{merchantInfo?.merchantNumber}</div>
                           </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                         <div className="text-sm font-semibold text-gray-800">{parameterLabels[rule.parameter]}</div>
                         <div className="text-xs text-gray-600 font-mono mt-1">
                            {operatorLabels[rule.operator]} <span className="font-sans font-bold text-black">{formatRuleValue(rule)}</span>
                         </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <Badge variant="outline" className={`${actionColors[rule.action]} border`}>
                          {actionLabels[rule.action]}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <button onClick={() => handleToggleRule(rule)} disabled={loading} className={`flex items-center text-sm font-medium ${rule.isActive ? 'text-green-600' : 'text-gray-400'}`}>
                          {rule.isActive ? <ToggleRight className="h-5 w-5 mr-1" /> : <ToggleLeft className="h-5 w-5 mr-1" />}
                          {rule.isActive ? 'Aktif' : 'Pasif'}
                        </button>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-3">
                          <button onClick={() => handleOpenModal(rule)} disabled={loading} className="text-blue-600 hover:text-blue-900" title="Düzenle">
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button onClick={() => handleDeleteRule(rule.id)} disabled={loading} className="text-red-600 hover:text-red-900" title="Sil">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center text-gray-500">
                    <p className="text-lg font-medium">Kural bulunamadı</p>
                    <p className="mt-1 text-sm">
                      {hasActiveFilters ? 'Filtre kriterlerinize uygun kural bulunamadı.' : 'Henüz hiç kural tanımlanmamış.'}
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
          <FraudRuleModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSave={handleSaveRule}
            editingRule={editingRule}
          />
      )}
    </div>
  );
};

export default FraudRuleManagement;
