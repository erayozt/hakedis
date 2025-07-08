import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { posErrorService } from '../../services/posErrorService';
import { POSProvider, ErrorCategory, HBErrorCode } from '../../types';
import { ExtendedErrorMapping } from '../../services/posErrorService';
import ErrorMappingModal from '../../components/ErrorMappingModal';
import { 
  AlertTriangle, 
  Plus, 
  Search, 
  Download, 
  Upload,
  Eye,
  Edit2,
  FileText
} from 'lucide-react';

const POSErrorManagement: React.FC = () => {
  const [providers, setProviders] = useState<POSProvider[]>([]);
  const [categories, setCategories] = useState<ErrorCategory[]>([]);
  const [mappings, setMappings] = useState<ExtendedErrorMapping[]>([]);
  const [hbErrorCodes, setHbErrorCodes] = useState<HBErrorCode[]>([]);

  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('direct');

  // Filters
  const [selectedProviderIdForFilter, setSelectedProviderIdForFilter] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showOnlyActive, setShowOnlyActive] = useState(true);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(50);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMapping, setEditingMapping] = useState<ExtendedErrorMapping | null>(null);

  // Load initial data
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [providersData, categoriesData, mappingsData, hbErrorCodesData] = await Promise.all([
        posErrorService.getPOSProviders(),
        posErrorService.getErrorCategories(),
        posErrorService.getErrorMappings(),
        posErrorService.getHBErrorCodes()
      ]);

      setProviders(providersData);
      setCategories(categoriesData);
      setMappings(mappingsData);
      setHbErrorCodes(hbErrorCodesData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter mappings for current tab
  const getCurrentProviderMappings = () => {
    let providerIds: string[] = [];
    
    if (activeTab === 'direct') {
      // Özel Hata Kodları: Hepsipay Gateway, Wallet, Paygate
      const directProviders = providers.filter(p => 
        ['hepsipay', 'wallet', 'paygate'].includes(p.code.toLowerCase())
      );
      providerIds = directProviders.map(p => p.id);
    } else if (activeTab === 'provider') {
      // Provider Hata Kodları: Craftgate, Payten
      const providerCodeProviders = providers.filter(p => 
        ['craftgate', 'payten'].includes(p.code.toLowerCase())
      );
      providerIds = providerCodeProviders.map(p => p.id);
    }

    return mappings.filter(mapping => {
      // Tab'a göre provider'ları filtrele
      if (!providerIds.includes(mapping.posProviderId)) return false;

      // Provider tab'ındaysa ve bir provider seçilmişse ona göre filtrele
      if (activeTab === 'provider' && selectedProviderIdForFilter !== 'all' && mapping.posProviderId !== selectedProviderIdForFilter) {
        return false;
      }
      
      if (selectedCategory !== 'all' && mapping.hbErrorCode?.categoryId !== selectedCategory) return false;
      if (showOnlyActive && !mapping.isActive) return false;
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        return (
          mapping.providerErrorCode.toLowerCase().includes(term) ||
          mapping.providerErrorMessage?.toLowerCase().includes(term) ||
          mapping.hbErrorCode?.hbErrorCode.toLowerCase().includes(term) ||
          mapping.hbErrorCode?.hbErrorMessage.toLowerCase().includes(term)
        );
      }
      return true;
    });
  };

  // Pagination logic
  const getPaginatedMappings = () => {
    // Provider tabında bir provider seçili mi kontrolü
    const isProviderSelectedOnProviderTab = activeTab === 'provider' && selectedProviderIdForFilter === 'all';
    
    const filtered = getCurrentProviderMappings();
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return {
      data: filtered.slice(startIndex, endIndex),
      total: filtered.length,
      totalPages: Math.ceil(filtered.length / itemsPerPage)
    };
  };

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, selectedCategory, searchTerm, showOnlyActive, itemsPerPage, selectedProviderIdForFilter]);

  // Provider tab'ındaki provider'lar
  const providerCodeProviders = providers.filter(p => 
    ['craftgate', 'payten'].includes(p.code.toLowerCase())
  );

  const getCategoryById = (id: string) => categories.find(c => c.id === id);
  const getProviderById = (id: string) => providers.find(p => p.id === id);

  // Özel Hata Kodları tab'ında Provider Kodu/Mesajı kolonları gizli
  const shouldShowProviderColumns = () => {
    return activeTab === 'provider'; // Sadece provider tab'ında göster
  };

  const handleCreateMapping = () => {
    setEditingMapping(null);
    setIsModalOpen(true);
  };

  const handleEditMapping = (mapping: ExtendedErrorMapping) => {
    setEditingMapping(mapping);
    setIsModalOpen(true);
  };

  const handleSaveMapping = (savedMapping: ExtendedErrorMapping) => {
    if (editingMapping) {
      setMappings(prev => prev.map(m => m.id === savedMapping.id ? savedMapping : m));
    } else {
      setMappings(prev => [savedMapping, ...prev]);
    }
  };

  const paginatedResult = getPaginatedMappings();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2">Veriler yükleniyor...</span>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">POS Hata Mesaj Yönetimi</h1>
        <p className="text-gray-600">
          POS sistemlerinden gelen hata kodlarını dokümanlardan alarak yönetin ve kullanıcı dostu mesajlara dönüştürün
        </p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow border">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 h-auto p-1">
            <TabsTrigger 
              value="direct" 
              className="flex items-center justify-center gap-2 h-12 text-xs"
            >
              <FileText className="h-4 w-4" />
              <span>HB Hata Kodları</span>
            </TabsTrigger>
            <TabsTrigger 
              value="provider" 
              className="flex items-center justify-center gap-2 h-12 text-xs"
            >
              <FileText className="h-4 w-4" />
              <span>Provider Hata Kodları</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Header and Filters */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {activeTab === 'direct' ? 'HB Hata Kodları' : 'Provider Hata Kodları'}
              </h2>
              <p className="text-gray-600">
                {activeTab === 'direct' 
                  ? 'Hepsipay Gateway, Wallet ve Paygate sistemlerinin doğrudan HB hata kodları'
                  : 'Craftgate ve Payten sistemlerinin iki aşamalı hata kodu mapping\'leri'}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleCreateMapping}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Plus className="h-4 w-4" />
                Yeni Hata Kodu
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                <Download className="h-4 w-4" />
                Dışa Aktar
              </button>
            </div>
          </div>

          <div className={`grid grid-cols-1 md:grid-cols-${activeTab === 'provider' ? 4 : 3} gap-4`}>
            {activeTab === 'provider' && (
               <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Provider Filtresi</label>
                <select
                  value={selectedProviderIdForFilter}
                  onChange={(e) => setSelectedProviderIdForFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">Tüm Provider'lar</option>
                  {providerCodeProviders.map(provider => (
                    <option key={provider.id} value={provider.id}>{provider.name}</option>
                  ))}
                </select>
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">Tüm Kategoriler</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>{category.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Arama</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Hata kodu veya mesaj ara..."
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="flex items-end">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={showOnlyActive}
                  onChange={(e) => setShowOnlyActive(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">Sadece aktif olanlar</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Common Table and Pagination */}
      <div className="mt-6 bg-white rounded-lg shadow border overflow-hidden">
        <div className="px-6 py-4 border-b bg-gray-50 flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">
            {activeTab === 'direct' ? 'HB Hata Kodları' : 'Provider Hata Kodları'} ({paginatedResult.total})
          </h3>
          <div className="text-sm text-gray-500">
            Sayfa {currentPage} / {paginatedResult.totalPages} (Toplam: {paginatedResult.total})
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sistem
                </th>
                {shouldShowProviderColumns() && (
                  <>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Provider Kodu
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Provider Mesajı
                    </th>
                  </>
                )}
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  HB Kodu
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  HB Mesajı
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kategori
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Durum
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedResult.data.map((mapping) => {
                const category = getCategoryById(mapping.hbErrorCode?.categoryId || '');
                const provider = getProviderById(mapping.posProviderId);

                return (
                  <tr key={mapping.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                        provider?.code === 'hepsipay' ? 'bg-purple-100 text-purple-800 border-purple-200' :
                        provider?.code === 'wallet' ? 'bg-green-100 text-green-800 border-green-200' :
                        provider?.code === 'paygate' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                        provider?.code === 'craftgate' ? 'bg-orange-100 text-orange-800 border-orange-200' :
                        provider?.code === 'payten' ? 'bg-red-100 text-red-800 border-red-200' :
                        'bg-gray-100 text-gray-800 border-gray-200'
                      }`}>
                        {provider?.code === 'hepsipay' ? 'Özel' :
                         provider?.code === 'wallet' ? 'Wallet' :
                         provider?.code === 'paygate' ? 'Paygate' :
                         provider?.code === 'craftgate' ? 'Craftgate' :
                         provider?.code === 'payten' ? 'Payten' :
                         provider?.name || 'Bilinmeyen'}
                      </span>
                    </td>
                    {shouldShowProviderColumns() && (
                      <>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-mono font-medium text-gray-900">
                            {mapping.providerErrorCode}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900 max-w-xs">
                            {mapping.providerErrorMessage || '-'}
                          </div>
                        </td>
                      </>
                    )}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-mono font-medium text-blue-600">
                        {mapping.hbErrorCode?.hbErrorCode || '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-md">
                        {mapping.hbErrorCode?.hbErrorMessage || '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {category && (
                        <span
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border"
                          style={{
                            backgroundColor: category.color + '20',
                            color: category.color,
                            borderColor: category.color + '40'
                          }}
                        >
                          {category.name}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        mapping.isActive
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {mapping.isActive ? 'Aktif' : 'Pasif'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button className="text-blue-600 hover:text-blue-900">
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleEditMapping(mapping)}
                          className="text-gray-600 hover:text-gray-900"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {paginatedResult.total === 0 && (
          <div className="text-center py-12">
            <AlertTriangle className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Hiç hata kodu bulunamadı</h3>
            <p className="mt-1 text-sm text-gray-500">
              {activeTab === 'direct' ? 'HB hata kodları' : 'Provider hata kodları'} için henüz mapping tanımlanmamış.
            </p>
            <div className="mt-6">
              <button
                onClick={handleCreateMapping}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                İlk Hata Kodunu Ekle
              </button>
            </div>
          </div>
        )}

        {paginatedResult.totalPages > 1 && (
          <div className="px-6 py-4 border-t bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-700">
                  {((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, paginatedResult.total)} arası, toplam {paginatedResult.total}
                </span>
              </div>
              <div className="flex items-center space-x-1">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-l-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Önceki
                </button>
                {Array.from({ length: paginatedResult.totalPages }, (_, i) => i + 1)
                  .filter(page => {
                    return page === 1 ||
                           page === paginatedResult.totalPages ||
                           Math.abs(page - currentPage) <= 1;
                  })
                  .map((page, index, array) => {
                    const showDots = index > 0 && page - array[index - 1] > 1;
                    return (
                      <React.Fragment key={page}>
                        {showDots && (
                          <span className="px-3 py-2 text-sm font-medium text-gray-500">...</span>
                        )}
                        <button
                          onClick={() => setCurrentPage(page)}
                          className={`px-3 py-2 text-sm font-medium border ${
                            currentPage === page
                              ? 'bg-blue-50 border-blue-500 text-blue-600'
                              : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                          }`}
                        >
                          {page}
                        </button>
                      </React.Fragment>
                    );
                  })}
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, paginatedResult.totalPages))}
                  disabled={currentPage === paginatedResult.totalPages}
                  className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-r-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Sonraki
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Error Mapping Modal */}
      <ErrorMappingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveMapping}
        mapping={editingMapping}
        providers={providers}
        categories={categories}
        hbErrorCodes={hbErrorCodes}
        currentProvider={
          activeTab === 'provider'
            ? providers.find(p => p.id === selectedProviderIdForFilter)
            : null
        }
        context={activeTab as 'direct' | 'provider'}
      />
    </div>
  );
};

export default POSErrorManagement; 