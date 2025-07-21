import React, { useState, useEffect, useRef } from 'react';
import { posErrorService } from '../../services/posErrorService';
import { POSProvider, ErrorCategory, HBErrorCode, ErrorMapping } from '../../types';
import { ExtendedErrorMapping } from '../../services/posErrorService';
import ErrorMappingModal from '../../components/ErrorMappingModal';
import HbCodeEditModal from '../../components/HbCodeEditModal';
import { 
  AlertTriangle, 
  Plus, 
  Search, 
  Download, 
  ChevronRight,
  ChevronDown,
  Edit2,
  Trash2,
  Upload,
  FileSpreadsheet
} from 'lucide-react';

const POSErrorManagement: React.FC = () => {
  const [providers, setProviders] = useState<POSProvider[]>([]);
  const [categories, setCategories] = useState<ErrorCategory[]>([]);
  const [mappings, setMappings] = useState<ExtendedErrorMapping[]>([]);
  const [hbErrorCodes, setHbErrorCodes] = useState<HBErrorCode[]>([]);

  const [loading, setLoading] = useState(true);

  // Filters
  const [selectedProviderIdForFilter, setSelectedProviderIdForFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Pagination states for master codes
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);

  // Expanded rows state
  const [expandedHbCodeIds, setExpandedHbCodeIds] = useState<Set<string>>(new Set());

  // Modal states
  const [isMappingModalOpen, setIsMappingModalOpen] = useState(false);
  const [editingMapping, setEditingMapping] = useState<ExtendedErrorMapping | null>(null);
  
  const [isHbCodeModalOpen, setIsHbCodeModalOpen] = useState(false);
  const [editingHbCode, setEditingHbCode] = useState<HBErrorCode | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log("Seçilen dosya:", file.name);
      alert(`${file.name} seçildi. Bu özellik şu anda geliştirme aşamasındadır.`);
      if(event.target) {
        event.target.value = '';
      }
    }
  };

  const handleExportCsv = () => {
    const headers = [
      "ProviderSistemKodu (Zorunlu)", 
      "ProviderHataKodu (Zorunlu)", 
      "Eslestirilecek_AnaHataKodu (Zorunlu)",
      "ProviderHataMesaji (Opsiyonel)", 
      "Durum (Aktif/Pasif - Varsayilan: Aktif)"
    ];

    // Get all mappings data to export. If none, provide a template with examples.
    let rows: (string | number | undefined)[][];

    if (mappings.length > 0) {
      rows = mappings
        .filter(m => !['hepsipay', 'wallet', 'paygate'].includes(m.posProvider?.code || ''))
        .map(mapping => [
        mapping.posProvider?.code.toUpperCase(),
        mapping.providerErrorCode,
        mapping.hbErrorCode?.hbErrorCode,
        mapping.providerErrorMessage,
        mapping.isActive ? 'Aktif' : 'Pasif'
      ]);
    } else {
      // Provide more realistic sample data if there's nothing to export
      rows = [
        ['CRAFTGATE', '3D-SEC-004', '3010', '3D Secure Dogrulamasi Basarisiz', 'Aktif'],
        ['PAYTEN', 'GW-TIMEOUT', '2005', 'Gateway Zaman Asimi', 'Aktif'],
        ['CRAFTGATE', 'INVALID_CARD_NUMBER', '1001', 'Gecersiz Kart Numarasi', 'Pasif']
      ];
    }
    
    // Using a library like 'papaparse' would be better for complex CSV generation.
    // For now, this manual approach handles basic cases.
    const csvContent = [
        headers.join(','), 
        ...rows.map(row => 
            row.map(field => `"${(field || '').toString().replace(/"/g, '""')}"`).join(',')
        )
    ].join('\n');

    const bom = "\uFEFF"; // BOM for UTF-8 Excel compatibility
    const blob = new Blob([bom + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "hata-kodu-eslestirmeleri.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getCategoryById = (id: string) => categories.find(c => c.id === id);
  const getProviderById = (id: string) => providers.find(p => p.id === id);

  // Group mappings by their master HBErrorCode ID
  const mappingsByHbCodeId = React.useMemo(() => {
    return mappings.reduce((acc, mapping) => {
      const key = mapping.hbErrorCodeId;
      if (key) {
        if (!acc[key]) {
          acc[key] = [];
        }
        acc[key].push(mapping);
      }
      return acc;
    }, {} as Record<string, ExtendedErrorMapping[]>);
  }, [mappings]);

  // Filter master HB error codes
  const getFilteredHbErrorCodes = () => {
    let filteredCodes = [...hbErrorCodes];

    if (searchTerm) {
        const term = searchTerm.toLowerCase();
        const relevantHbCodeIds = new Set<string>();

        // Find mappings that match the search term
        mappings.forEach(mapping => {
            const match = mapping.providerErrorCode.toLowerCase().includes(term) ||
                          mapping.providerErrorMessage?.toLowerCase().includes(term) ||
                          mapping.hbErrorCode?.hbErrorCode.toLowerCase().includes(term) ||
                          mapping.hbErrorCode?.hbErrorMessage.toLowerCase().includes(term);
            if (match && mapping.hbErrorCodeId) {
                relevantHbCodeIds.add(mapping.hbErrorCodeId);
            }
        });
        
        // Also search in hbErrorCodes themselves
        hbErrorCodes.forEach(code => {
            const match = code.hbErrorCode.toLowerCase().includes(term) ||
                          code.hbErrorMessage.toLowerCase().includes(term);
            if(match) {
                relevantHbCodeIds.add(code.id);
            }
        });

        filteredCodes = filteredCodes.filter(code => relevantHbCodeIds.has(code.id));
    }

    if (selectedProviderIdForFilter !== 'all') {
        const relevantHbCodeIds = new Set<string>();
        mappings.forEach(mapping => {
            if (mapping.posProviderId === selectedProviderIdForFilter && mapping.hbErrorCodeId) {
                relevantHbCodeIds.add(mapping.hbErrorCodeId);
            }
        });
        filteredCodes = filteredCodes.filter(code => relevantHbCodeIds.has(code.id));
    }

    return filteredCodes;
  };

  // Pagination logic
  const getPaginatedHbErrorCodes = () => {
    const filtered = getFilteredHbErrorCodes();
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return {
      data: filtered.slice(startIndex, endIndex),
      total: filtered.length,
      totalPages: Math.ceil(filtered.length / itemsPerPage)
    };
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedProviderIdForFilter, itemsPerPage]);

  const toggleHbCodeRow = (hbCodeId: string) => {
    setExpandedHbCodeIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(hbCodeId)) {
        newSet.delete(hbCodeId);
      } else {
        newSet.add(hbCodeId);
      }
      return newSet;
    });
  };

  const handleCreateMapping = (hbErrorCodeId: string) => {
    const newMappingTemplate: Partial<ExtendedErrorMapping> & { hbErrorCodeId: string } = {
      hbErrorCodeId: hbErrorCodeId,
      posProviderId: '',
      providerErrorCode: '',
      providerErrorMessage: '',
      isActive: true,
    };
    setEditingMapping(newMappingTemplate as ExtendedErrorMapping);
    setIsMappingModalOpen(true);
  };

  const handleEditHbCode = (hbCode: HBErrorCode) => {
    setEditingHbCode(hbCode);
    setIsHbCodeModalOpen(true);
  };

  const handleSaveHbCode = (updatedHbCode: HBErrorCode) => {
    setHbErrorCodes(prev => 
      prev.map(code => code.id === updatedHbCode.id ? updatedHbCode : code)
    );
    setIsHbCodeModalOpen(false);
    setEditingHbCode(null);
  };

  const handleEditMapping = (mapping: ExtendedErrorMapping) => {
    setEditingMapping(mapping);
    setIsMappingModalOpen(true);
  };

  const handleSaveMapping = (savedMapping: ErrorMapping) => {
    if (savedMapping.id) {
      setMappings(prev => prev.map(m => m.id === savedMapping.id ? { ...m, ...savedMapping } : m));
    } else {
      const newMappingWithId: ExtendedErrorMapping = {
        ...savedMapping,
        id: `map-${new Date().getTime()}`, 
        hbErrorCode: hbErrorCodes.find(c => c.id === savedMapping.hbErrorCodeId),
        category: categories.find(c => c.id === savedMapping.categoryId),
        posProvider: providers.find(p => p.id === savedMapping.posProviderId)
      };
      setMappings(prev => [newMappingWithId, ...prev]);
    }

    setIsMappingModalOpen(false);
    setEditingMapping(null);
  };

  const handleDeleteMapping = (mappingId: string) => {
    setMappings(prev => prev.filter(m => m.id !== mappingId));
  }

  const paginatedResult = getPaginatedHbErrorCodes();

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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">POS Hata Mesaj Yönlendirmeleri</h1>
        <p className="text-gray-600">
          Ana hata kodlarını yönetin ve dış provider'lardan gelen hataları bu kodlarla eşleştirin.
        </p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow border mb-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">
            Toplu İşlemler
          </h2>
          <div className="flex items-center gap-2">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileImport}
              className="hidden"
              accept=".csv"
            />
            <button
              onClick={handleImportClick}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Upload className="h-4 w-4" />
              İçe Aktar
            </button>
            <button 
                onClick={handleExportCsv}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              <Download className="h-4 w-4" />
              Dışa Aktar
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow border">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">
                Filtreler
              </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Provider'a Göre Filtrele</label>
              <select
                value={selectedProviderIdForFilter}
                onChange={(e) => setSelectedProviderIdForFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">Tüm Provider'lar</option>
                {providers.map(provider => (
                  <option key={provider.id} value={provider.id}>{provider.name}</option>
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
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="mt-6 bg-white rounded-lg shadow border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="w-12 px-6"></th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  HB Kodu
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Orijinal Sistem Mesajı
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  HB Mesajı (Kullanıcı Dostu)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kategori
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Eşleşme Sayısı
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedResult.data.map((hbCode) => {
                const associatedMappings = mappingsByHbCodeId[hbCode.id] || [];
                const isExpanded = expandedHbCodeIds.has(hbCode.id);
                const category = getCategoryById(hbCode.categoryId);

                return (
                  <React.Fragment key={hbCode.id}>
                    <tr className="hover:bg-gray-50">
                      <td className="px-6">
                        <button onClick={() => toggleHbCodeRow(hbCode.id)} className="text-gray-500 hover:text-gray-800">
                          {isExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-mono font-medium text-blue-600">{hbCode.hbErrorCode}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-mono text-gray-600">{hbCode.originalSystemMessage}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 max-w-md">{hbCode.hbErrorMessage}</div>
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
                        <span className="text-sm text-gray-700">{associatedMappings.length}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center gap-4">
                          <button onClick={() => handleEditHbCode(hbCode)} className="flex items-center gap-1 text-gray-600 hover:text-gray-900">
                            <Edit2 className="h-4 w-4" /> Mesajı Düzenle
                          </button>
                          <button onClick={() => handleCreateMapping(hbCode.id)} className="flex items-center gap-1 text-blue-600 hover:text-blue-900">
                            <Plus className="h-4 w-4" /> Yeni Eşleştirme
                          </button>
                        </div>
                      </td>
                    </tr>
                    {isExpanded && (
                      <tr className="bg-gray-50">
                        <td colSpan={7} className="p-0">
                          <div className="p-4">
                            {associatedMappings.length > 0 ? (
                              <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-100">
                                  <tr>
                                    <th className="px-6 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Provider</th>
                                    <th className="px-6 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Provider Kodu</th>
                                    <th className="px-6 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Provider Mesajı</th>
                                    <th className="px-6 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Durum</th>
                                    <th className="px-6 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">İşlemler</th>
                                  </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                  {associatedMappings.map(mapping => {
                                      const provider = getProviderById(mapping.posProviderId);
                                      const isMasterMapping = ['hepsipay', 'wallet', 'paygate'].includes(provider?.code || '');
                                    return (
                                      <tr key={mapping.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">{provider?.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-mono">{mapping.providerErrorCode}</td>
                                        <td className="px-6 py-4 text-sm max-w-sm">{mapping.providerErrorMessage}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                mapping.isActive
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-gray-100 text-gray-800'
                                            }`}>
                                                {mapping.isActive ? 'Aktif' : 'Pasif'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-2">
                                                <button onClick={() => handleEditMapping(mapping)} disabled={isMasterMapping} className="text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed">
                                                    <Edit2 size={16} />
                                                </button>
                                                <button onClick={() => handleDeleteMapping(mapping.id)} disabled={isMasterMapping} className="text-red-600 hover:text-red-900 disabled:opacity-50 disabled:cursor-not-allowed">
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                      </tr>
                                    );
                                  })}
                                </tbody>
                              </table>
                            ) : (
                              <div className="text-center py-4 text-gray-500">
                                Bu ana hata kodu için henüz bir provider eşleştirmesi yapılmamış.
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
        
        {paginatedResult.total === 0 && !loading && (
          <div className="text-center py-12">
            <AlertTriangle className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Sonuç Bulunamadı</h3>
            <p className="mt-1 text-sm text-gray-500">
              Filtre kriterlerinize uygun bir hata kodu veya eşleştirme bulunamadı.
            </p>
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
                 {/* TODO: Better pagination component */}
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

      <HbCodeEditModal
        isOpen={isHbCodeModalOpen}
        onClose={() => setIsHbCodeModalOpen(false)}
        onSave={handleSaveHbCode}
        hbCode={editingHbCode}
        categories={categories}
      />

      <ErrorMappingModal
        isOpen={isMappingModalOpen}
        onClose={() => {
          setIsMappingModalOpen(false);
          setEditingMapping(null);
        }}
        onSave={handleSaveMapping}
        mapping={editingMapping ? {
          ...editingMapping,
          categoryId: editingMapping.category?.id || '',
        } : null}
        providers={providers.filter(p => !['hepsipay', 'wallet', 'paygate'].includes(p.code))}
        categories={categories}
        hbErrorCodes={hbErrorCodes}
      />
    </div>
  );
};

export default POSErrorManagement; 