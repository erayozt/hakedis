import React, { useState, useEffect } from 'react';
import { posErrorService } from '../../services/posErrorService';
import { POSProvider, ErrorCategory, HBErrorCode, ErrorMapping } from '../../types';
import { ExtendedErrorMapping } from '../../services/posErrorService';
import HbCodeEditModal from '../../components/HbCodeEditModal';
import { 
  AlertTriangle, 
  Edit2
} from 'lucide-react';

const POSErrorManagement: React.FC = () => {
  const [providers, setProviders] = useState<POSProvider[]>([]);
  const [categories, setCategories] = useState<ErrorCategory[]>([]);
  const [mappings, setMappings] = useState<ExtendedErrorMapping[]>([]);
  const [hbErrorCodes, setHbErrorCodes] = useState<HBErrorCode[]>([]);

  const [loading, setLoading] = useState(true);

  // Column filters
  const [hbCodeFilter, setHbCodeFilter] = useState('');
  const [providerFilter, setProviderFilter] = useState('');
  const [providerCodeFilter, setProviderCodeFilter] = useState('');
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);

  // Modal states
  const [isHbCodeModalOpen, setIsHbCodeModalOpen] = useState(false);
  const [editingHbCode, setEditingHbCode] = useState<HBErrorCode | null>(null);



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




  const getProviderById = (id: string) => providers.find(p => p.id === id);

  // Get grouped data by HB codes
  const getGroupedTableData = () => {
    // First apply filters to mappings
    let filteredMappings = [...mappings];

    if (hbCodeFilter) {
      filteredMappings = filteredMappings.filter(mapping => 
        mapping.hbErrorCode?.hbErrorCode.toLowerCase().includes(hbCodeFilter.toLowerCase())
      );
    }

    if (providerFilter) {
      filteredMappings = filteredMappings.filter(mapping => 
        mapping.posProvider?.name.toLowerCase().includes(providerFilter.toLowerCase())
      );
    }

    if (providerCodeFilter) {
      filteredMappings = filteredMappings.filter(mapping => 
        mapping.providerErrorCode.toLowerCase().includes(providerCodeFilter.toLowerCase())
      );
    }

    // Group mappings by HB code
    const mappingsByHbCode = filteredMappings.reduce((acc, mapping) => {
      const hbCodeId = mapping.hbErrorCodeId;
      if (hbCodeId && mapping.hbErrorCode) {
        if (!acc[hbCodeId]) {
          acc[hbCodeId] = {
            hbCode: mapping.hbErrorCode,
            mappings: []
          };
        }
        acc[hbCodeId].mappings.push(mapping);
      }
      return acc;
    }, {} as Record<string, { hbCode: HBErrorCode; mappings: ExtendedErrorMapping[] }>);

    // Convert to flat array for table rendering
    const tableData: Array<{
      type: 'hbCode' | 'mapping';
      hbCode?: HBErrorCode;
      mapping?: ExtendedErrorMapping;
      id: string;
    }> = [];

    // Sort HB codes by code number
    const sortedHbCodes = Object.values(mappingsByHbCode).sort((a, b) => 
      a.hbCode.hbErrorCode.localeCompare(b.hbCode.hbErrorCode)
    );

    sortedHbCodes.forEach(group => {
      // Add HB code header row
      tableData.push({
        type: 'hbCode',
        hbCode: group.hbCode,
        id: `hb-${group.hbCode.id}`
      });

      // Add mapping rows
      group.mappings.forEach(mapping => {
        tableData.push({
          type: 'mapping',
          mapping,
          id: `mapping-${mapping.id}`
        });
      });
    });

    return tableData;
  };

  // Pagination logic
  const getPaginatedData = () => {
    const groupedData = getGroupedTableData();
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return {
      data: groupedData.slice(startIndex, endIndex),
      total: groupedData.length,
      totalPages: Math.ceil(groupedData.length / itemsPerPage)
    };
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [hbCodeFilter, providerFilter, providerCodeFilter, itemsPerPage]);



  const handleEditHbMessage = (mapping: ExtendedErrorMapping) => {
    if (mapping.hbErrorCode) {
      setEditingHbCode(mapping.hbErrorCode);
      setIsHbCodeModalOpen(true);
    }
  };

  const handleSaveHbCode = (updatedHbCode: HBErrorCode) => {
    setHbErrorCodes(prev => 
      prev.map(code => code.id === updatedHbCode.id ? updatedHbCode : code)
    );
    setIsHbCodeModalOpen(false);
    setEditingHbCode(null);
  };





  const paginatedResult = getPaginatedData();

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





      {/* Table */}
      <div className="mt-6 bg-white rounded-lg shadow border overflow-hidden">


        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="space-y-1">
                    <div>HB Kodu</div>
                    <input
                      type="text"
                      value={hbCodeFilter}
                      onChange={(e) => setHbCodeFilter(e.target.value)}
                      placeholder="Filtrele..."
                      className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="space-y-1">
                    <div>Provider</div>
                    <input
                      type="text"
                      value={providerFilter}
                      onChange={(e) => setProviderFilter(e.target.value)}
                      placeholder="Filtrele..."
                      className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="space-y-1">
                    <div>Provider Kodu</div>
                    <input
                      type="text"
                      value={providerCodeFilter}
                      onChange={(e) => setProviderCodeFilter(e.target.value)}
                      placeholder="Filtrele..."
                      className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Provider Mesajı
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  HB Mesajı (Kullanıcı Dostu)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedResult.data.map((item) => {
                if (item.type === 'hbCode' && item.hbCode) {
                  // HB Code header row
                  return (
                    <tr key={item.id} className="bg-blue-50 border-t-2 border-blue-200">
                      <td className="px-6 py-3 whitespace-nowrap">
                        <div className="text-sm font-mono font-bold text-blue-800">
                          {item.hbCode.hbErrorCode}
                        </div>
                      </td>
                      <td className="px-6 py-3 whitespace-nowrap">
                        <div className="text-xs text-gray-500 uppercase tracking-wide">Ana Hata Kodu</div>
                      </td>
                      <td className="px-6 py-3 whitespace-nowrap">
                        <div className="text-xs text-gray-500 uppercase tracking-wide">-</div>
                      </td>
                      <td className="px-6 py-3">
                        <div className="text-sm text-gray-700 font-mono">{item.hbCode.originalSystemMessage}</div>
                      </td>
                      <td className="px-6 py-3">
                        <div className="text-sm text-gray-900 font-medium">{item.hbCode.hbErrorMessage}</div>
                      </td>
                      <td className="px-6 py-3 whitespace-nowrap text-sm font-medium">
                        <button 
                          onClick={() => handleEditHbMessage({hbErrorCode: item.hbCode} as ExtendedErrorMapping)} 
                          className="text-blue-600 hover:text-blue-900"
                          title="Kullanıcı dostu mesajı düzenle"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  );
                } else if (item.type === 'mapping' && item.mapping) {
                  // Mapping row
                  const provider = getProviderById(item.mapping.posProviderId);
                  const isMasterMapping = ['hepsipay', 'wallet', 'paygate'].includes(provider?.code || '');
                  
                  return (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-6 py-3 whitespace-nowrap">
                        <div className="text-xs text-gray-400 ml-4">└─</div>
                      </td>
                      <td className="px-6 py-3 whitespace-nowrap">
                        <div className="text-sm text-gray-900 ml-4">{provider?.name}</div>
                      </td>
                      <td className="px-6 py-3 whitespace-nowrap">
                        <div className="text-sm font-mono text-gray-600 ml-4">{item.mapping.providerErrorCode}</div>
                      </td>
                      <td className="px-6 py-3">
                        <div className="text-sm text-gray-700 ml-4">{item.mapping.providerErrorMessage}</div>
                      </td>
                      <td className="px-6 py-3">
                        <div className="text-xs text-gray-400 ml-4">⟵ Yukarıdaki HB mesajı</div>
                      </td>
                      <td className="px-6 py-3 whitespace-nowrap text-sm font-medium">
                        <div className="text-xs text-gray-400">-</div>
                      </td>
                    </tr>
                  );
                }
                return null;
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
      />


    </div>
  );
};

export default POSErrorManagement; 