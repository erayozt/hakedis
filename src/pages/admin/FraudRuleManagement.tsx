import React, { useState, useEffect, useRef } from 'react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { PlusCircle, Edit2, Trash2, ToggleLeft, ToggleRight, Search, ChevronDown, X } from 'lucide-react';
import { Merchant, FraudRule } from '../../types';
import { mockDataService } from '../../services/mockDataService';
import { fraudRuleService } from '../../services/fraudRuleService';
import FraudRuleModal from '../../components/FraudRuleModal';
import toast from 'react-hot-toast';

const operatorLabels: Record<string, string> = {
  '<': '<',
  '<=': '≤',
  '==': '=',
  '>=': '≥',
  '>': '>'
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
  
  // Column filter states
  const [merchantFilter, setMerchantFilter] = useState('');
  const [parameterFilter, setParameterFilter] = useState('');
  const [actionFilter, setActionFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  
  // Filter dropdown states
  const [showMerchantFilter, setShowMerchantFilter] = useState(false);
  const [showParameterFilter, setShowParameterFilter] = useState(false);
  const [showActionFilter, setShowActionFilter] = useState(false);
  const [showStatusFilter, setShowStatusFilter] = useState(false);
  
  // Refs for filter dropdowns
  const merchantFilterRef = useRef<HTMLDivElement>(null);
  const parameterFilterRef = useRef<HTMLDivElement>(null);
  const actionFilterRef = useRef<HTMLDivElement>(null);
  const statusFilterRef = useRef<HTMLDivElement>(null);
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<FraudRule | null>(null);
  
  const allMerchants = mockDataService.getMerchants();

  // Load all rules from all merchants
  const loadAllRules = async () => {
    setInitialLoading(true);
    try {
      const allRulesPromises = allMerchants.map(merchant => 
        fraudRuleService.getRulesByMerchant(merchant.id)
      );
      const allRulesArrays = await Promise.all(allRulesPromises);
      const flattenedRules = allRulesArrays.flat();
      setAllRules(flattenedRules);
      setFilteredRules(flattenedRules);
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

  // Close filter dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (merchantFilterRef.current && !merchantFilterRef.current.contains(event.target as Node)) {
        setShowMerchantFilter(false);
      }
      if (parameterFilterRef.current && !parameterFilterRef.current.contains(event.target as Node)) {
        setShowParameterFilter(false);
      }
      if (actionFilterRef.current && !actionFilterRef.current.contains(event.target as Node)) {
        setShowActionFilter(false);
      }
      if (statusFilterRef.current && !statusFilterRef.current.contains(event.target as Node)) {
        setShowStatusFilter(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Apply filters
  useEffect(() => {
    let filtered = [...allRules];

    if (merchantFilter) {
      filtered = filtered.filter(rule => {
        const merchant = allMerchants.find(m => m.id === rule.merchantId);
        return merchant?.merchantName.toLowerCase().includes(merchantFilter.toLowerCase()) ||
               merchant?.merchantNumber.toLowerCase().includes(merchantFilter.toLowerCase());
      });
    }

    if (parameterFilter) {
      if (parameterFilter === 'tutar') {
        filtered = filtered.filter(rule => rule.parameter === 'amount');
      } else {
        filtered = filtered.filter(rule => rule.parameter === parameterFilter);
      }
    }

    if (actionFilter) {
      filtered = filtered.filter(rule => rule.action === actionFilter);
    }

    if (statusFilter) {
      if (statusFilter === 'active') {
        filtered = filtered.filter(rule => rule.isActive);
      } else if (statusFilter === 'inactive') {
        filtered = filtered.filter(rule => !rule.isActive);
      }
    }

    setFilteredRules(filtered);
  }, [allRules, merchantFilter, parameterFilter, actionFilter, statusFilter, allMerchants]);

  const getMerchantById = (merchantId: string) => {
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
        // Güncelleme
        const updatedRule = await fraudRuleService.updateRule(editingRule.id, ruleData);
        setAllRules(prev => prev.map(rule => rule.id === updatedRule.id ? updatedRule : rule));
        toast.success('Kural başarıyla güncellendi');
      } else {
        // Yeni kural
        const newRule = await fraudRuleService.createRule(ruleData);
        setAllRules(prev => [...prev, newRule]);
        toast.success('Yeni kural başarıyla eklendi');
      }
    } catch (error) {
      console.error('Error saving rule:', error);
      toast.error('Kural kaydedilirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRule = async (ruleId: string) => {
    if (!confirm('Bu kuralı silmek istediğinizden emin misiniz?')) return;
    
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

  const handleToggleRule = async (ruleId: string) => {
    setLoading(true);
    try {
      const updatedRule = await fraudRuleService.toggleRuleStatus(ruleId);
      setAllRules(prev => prev.map(rule => rule.id === updatedRule.id ? updatedRule : rule));
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
    setShowMerchantFilter(false);
    setShowParameterFilter(false);
    setShowActionFilter(false);
    setShowStatusFilter(false);
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
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Fraud Kural Yönetimi</h1>
          <p className="text-gray-600">
            Tüm üye işyerleri için fraud kurallarını görüntüleyin ve yönetin.
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
        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                {/* Üye İş Yeri Column */}
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center space-x-2">
                    <span>Üye İş Yeri</span>
                    <div className="relative" ref={merchantFilterRef}>
                      <button
                        onClick={() => setShowMerchantFilter(!showMerchantFilter)}
                        className={`p-1 rounded hover:bg-gray-200 ${merchantFilter ? 'text-blue-600' : 'text-gray-400'}`}
                      >
                        <Search className="h-3 w-3" />
                      </button>
                      {showMerchantFilter && (
                        <div className="absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-[100] min-w-[200px]">
                          <div className="p-3">
                            <Input
                              placeholder="İşyeri ara..."
                              value={merchantFilter}
                              onChange={(e) => setMerchantFilter(e.target.value)}
                              className="w-full"
                              autoFocus
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </th>
                
                {/* Parametre Column */}
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center space-x-2">
                    <span>Parametre</span>
                    <div className="relative" ref={parameterFilterRef}>
                      <button
                        onClick={() => setShowParameterFilter(!showParameterFilter)}
                        className={`p-1 rounded hover:bg-gray-200 ${parameterFilter ? 'text-blue-600' : 'text-gray-400'}`}
                      >
                        <ChevronDown className="h-3 w-3" />
                      </button>
                      {showParameterFilter && (
                        <div className="absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-[100] min-w-[150px]">
                          <div className="py-1">
                            <button
                              onClick={() => {
                                setParameterFilter('');
                                setShowParameterFilter(false);
                              }}
                              className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50"
                            >
                              Tümü
                            </button>
                            <button
                              onClick={() => {
                                setParameterFilter('tutar');
                                setShowParameterFilter(false);
                              }}
                              className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50"
                            >
                              İşlem Tutarı
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </th>
                
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Koşul
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Değer
                </th>
                
                {/* Aksiyon Column */}
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center space-x-2">
                    <span>Aksiyon</span>
                    <div className="relative" ref={actionFilterRef}>
                      <button
                        onClick={() => setShowActionFilter(!showActionFilter)}
                        className={`p-1 rounded hover:bg-gray-200 ${actionFilter ? 'text-blue-600' : 'text-gray-400'}`}
                      >
                        <ChevronDown className="h-3 w-3" />
                      </button>
                      {showActionFilter && (
                        <div className="absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-[100] min-w-[200px]">
                          <div className="py-1">
                            <button
                              onClick={() => {
                                setActionFilter('');
                                setShowActionFilter(false);
                              }}
                              className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50"
                            >
                              Tümü
                            </button>
                            <button
                              onClick={() => {
                                setActionFilter('force_3d');
                                setShowActionFilter(false);
                              }}
                              className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50"
                            >
                              3D Secure Yönlendir
                            </button>
                            <button
                              onClick={() => {
                                setActionFilter('process_non_3d');
                                setShowActionFilter(false);
                              }}
                              className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50"
                            >
                              3D Secure Olmadan İşle
                            </button>
                            <button
                              onClick={() => {
                                setActionFilter('reject');
                                setShowActionFilter(false);
                              }}
                              className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50"
                            >
                              İşlemi Reddet
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </th>
                
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Gerekçe
                </th>
                
                {/* Durum Column */}
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center space-x-2">
                    <span>Durum</span>
                    <div className="relative" ref={statusFilterRef}>
                      <button
                        onClick={() => setShowStatusFilter(!showStatusFilter)}
                        className={`p-1 rounded hover:bg-gray-200 ${statusFilter ? 'text-blue-600' : 'text-gray-400'}`}
                      >
                        <ChevronDown className="h-3 w-3" />
                      </button>
                      {showStatusFilter && (
                        <div className="absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-[100] min-w-[120px]">
                          <div className="py-1">
                            <button
                              onClick={() => {
                                setStatusFilter('');
                                setShowStatusFilter(false);
                              }}
                              className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50"
                            >
                              Tümü
                            </button>
                            <button
                              onClick={() => {
                                setStatusFilter('active');
                                setShowStatusFilter(false);
                              }}
                              className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50"
                            >
                              Aktif
                            </button>
                            <button
                              onClick={() => {
                                setStatusFilter('inactive');
                                setShowStatusFilter(false);
                              }}
                              className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50"
                            >
                              Pasif
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </th>
                
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRules.length > 0 ? (
                filteredRules.map((rule) => {
                  const merchant = getMerchantById(rule.merchantId);
                  return (
                    <tr key={rule.id} className={`hover:bg-gray-50 ${!rule.isActive ? 'opacity-60' : ''}`}>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{merchant?.merchantName}</div>
                          <div className="text-xs text-gray-500">{merchant?.merchantNumber}</div>
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="text-sm text-gray-900 capitalize">
                          {rule.parameter === 'amount' ? 'İşlem Tutarı' : rule.parameter}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="text-sm font-mono text-gray-700">
                          {operatorLabels[rule.operator]}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="text-sm font-medium text-gray-900">
                          {rule.value.toLocaleString('tr-TR')} TL
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${actionColors[rule.action]}`}>
                          {actionLabels[rule.action]}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-gray-600 max-w-xs truncate block" title={rule.reason}>
                          {rule.reason}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <button
                          onClick={() => handleToggleRule(rule.id)}
                          disabled={loading}
                          className={`flex items-center text-sm font-medium ${rule.isActive ? 'text-green-600' : 'text-gray-400'}`}
                        >
                          {rule.isActive ? (
                            <ToggleRight className="h-5 w-5 mr-1" />
                          ) : (
                            <ToggleLeft className="h-5 w-5 mr-1" />
                          )}
                          {rule.isActive ? 'Aktif' : 'Pasif'}
                        </button>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleOpenModal(rule)}
                            disabled={loading}
                            className="text-blue-600 hover:text-blue-900"
                            title="Düzenle"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteRule(rule.id)}
                            disabled={loading}
                            className="text-red-600 hover:text-red-900"
                            title="Sil"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-gray-500">
                    <div>
                      <p className="text-lg font-medium">Kural bulunamadı</p>
                      <p className="mt-1 text-sm">
                        {hasActiveFilters
                          ? 'Filtre kriterlerinize uygun kural bulunamadı.'
                          : 'Henüz hiç kural tanımlanmamış. "Yeni Kural Ekle" butonuna tıklayarak başlayın.'
                        }
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <FraudRuleModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveRule}
        editingRule={editingRule}
      />
    </div>
  );
};

export default FraudRuleManagement;