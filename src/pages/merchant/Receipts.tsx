import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { Search, FileText, Download, ChevronLeft, ChevronRight, Filter, Calendar, CreditCard, Hash } from 'lucide-react';
import ReceiptDetailModal from '../../components/ReceiptDetailModal';

export default function Receipts() {
  const [isLoading, setIsLoading] = useState(true);
  const [receipts, setReceipts] = useState<any[]>([]);
  const [filteredReceipts, setFilteredReceipts] = useState<any[]>([]);
  const [selectedReceipt, setSelectedReceipt] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Filtreleme state'leri
  const [idFilter, setIdFilter] = useState('');
  const [dateRange, setDateRange] = useState({
    start: new Date(new Date().setDate(new Date().getDate() - 30)),
    end: new Date()
  });
  const [isDateFilterActive, setIsDateFilterActive] = useState(false);
  const [amountFilter, setAmountFilter] = useState({ min: '', max: '' });
  const [statusFilter, setStatusFilter] = useState('all');
  const [tahakkukFilter, setTahakkukFilter] = useState('all');

  // Simüle edilmiş veri yüklemesi
  useEffect(() => {
    const fetchReceipts = async () => {
      setIsLoading(true);
      try {
        // Mock veri - gerçek API'den alınacak
        const mockData = Array.from({ length: 20 }, (_, i) => ({
          id: `REC-${1000 + i}`,
          date: new Date(Date.now() - (i * 24 * 60 * 60 * 1000)).toISOString(),
          amount: Math.round(Math.random() * 10000) / 100 * 1000,
          walletTransactions: {
            count: Math.floor(Math.random() * 500) + 50,
            volume: Math.round(Math.random() * 10000) / 100 * 1000,
            refundCount: Math.floor(Math.random() * 50) + 5,
            refunds: Math.round(Math.random() * 1000) / 100 * 100,
            commission: Math.round(Math.random() * 1000) / 100 * 25,
            netAmount: Math.round(Math.random() * 10000) / 100 * 950
          },
          creditTransactions: {
            count: Math.floor(Math.random() * 100) + 10,
            volume: Math.round(Math.random() * 5000) / 100 * 1000,
            refundCount: Math.floor(Math.random() * 20) + 2,
            refunds: Math.round(Math.random() * 500) / 100 * 50,
            commission: Math.round(Math.random() * 500) / 100 * 25,
            netAmount: Math.round(Math.random() * 5000) / 100 * 950
          },
          status: i % 5 === 0 ? 'pending' : 'completed',
          tahakkukStatus: i % 3 === 0 ? 'pending' : i % 7 === 0 ? 'partial' : 'completed',
          description: `${format(new Date(Date.now() - (i * 24 * 60 * 60 * 1000)), 'dd MMMM yyyy', { locale: tr })} tarihli cüzdan ve alışveriş kredisi hakediş ödemesi`
        }));
        
        setReceipts(mockData);
        setFilteredReceipts(mockData);
      } catch (error) {
        console.error('Dekontlar yüklenirken hata oluştu:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReceipts();
  }, []);

  // Tüm filtreleri uygulama
  useEffect(() => {
    let filtered = [...receipts];
    
    // ID filtreleme
    if (idFilter) {
      filtered = filtered.filter(receipt => 
        receipt.id.toLowerCase().includes(idFilter.toLowerCase())
      );
    }
    
    // Tarih aralığı filtreleme
    if (isDateFilterActive) {
      filtered = filtered.filter(receipt => {
        const receiptDate = new Date(receipt.date);
        return receiptDate >= dateRange.start && receiptDate <= dateRange.end;
      });
    }
    
    // Tutar filtreleme
    if (amountFilter.min || amountFilter.max) {
      filtered = filtered.filter(receipt => {
        const amount = receipt.amount;
        const minAmount = amountFilter.min ? parseFloat(amountFilter.min) : 0;
        const maxAmount = amountFilter.max ? parseFloat(amountFilter.max) : Infinity;
        return amount >= minAmount && amount <= maxAmount;
      });
    }
    
    // Durum filtreleme
    if (statusFilter !== 'all') {
      filtered = filtered.filter(receipt => receipt.status === statusFilter);
    }
    
    // Tahakkuk durumu filtreleme
    if (tahakkukFilter !== 'all') {
      filtered = filtered.filter(receipt => receipt.tahakkukStatus === tahakkukFilter);
    }
    
    setFilteredReceipts(filtered);
  }, [idFilter, isDateFilterActive, dateRange, amountFilter, statusFilter, tahakkukFilter, receipts]);

  // Filtre dropdown açma/kapama
  const toggleDropdown = (id: string) => {
    document.querySelectorAll('.filter-dropdown').forEach(el => {
      if (el.id !== id) {
        el.classList.add('hidden');
      }
    });
    document.getElementById(id)?.classList.toggle('hidden');
  };

  // Tarih filtresini uygulama
  const applyDateFilter = () => {
    setIsDateFilterActive(true);
    document.getElementById('dateFilterDropdown')?.classList.add('hidden');
  };

  // Tutar filtresini uygulama
  const applyAmountFilter = () => {
    document.getElementById('amountFilterDropdown')?.classList.add('hidden');
  };

  // Dekont detayı görüntüleme
  const handleViewReceipt = (receipt: any) => {
    setSelectedReceipt(receipt);
    setIsModalOpen(true);
  };

  // Para birimini formatlama
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(amount);
  };

  // Tarih formatlama
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'dd MMMM yyyy', { locale: tr });
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Ödeme Dekontları</h1>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          {filteredReceipts.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <p className="text-gray-500">Uygun dekont bulunamadı.</p>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="flex items-center">
                        Dekont ID
                        <button 
                          className="ml-1 text-gray-400 hover:text-gray-600"
                          onClick={() => toggleDropdown('idFilterDropdown')}
                        >
                          <Filter className="h-3 w-3" />
                        </button>
                        
                        {/* ID Filtresi Dropdown */}
                        <div id="idFilterDropdown" className="filter-dropdown absolute mt-8 w-64 bg-white rounded-lg shadow-lg p-4 z-10 hidden">
                          <div className="space-y-3">
                            <h3 className="text-sm font-medium text-gray-700">Dekont ID Filtresi</h3>
                            <div>
                              <input 
                                type="text" 
                                className="w-full px-3 py-2 border border-gray-300 rounded"
                                placeholder="Dekont ID'si girin..."
                                value={idFilter}
                                onChange={(e) => setIdFilter(e.target.value)}
                              />
                            </div>
                            <div className="flex justify-between">
                              <button 
                                className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 text-sm"
                                onClick={() => setIdFilter('')}
                              >
                                Temizle
                              </button>
                              <button 
                                className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                                onClick={() => document.getElementById('idFilterDropdown')?.classList.add('hidden')}
                              >
                                Uygula
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="flex items-center">
                        Tarih
                        <button 
                          className="ml-1 text-gray-400 hover:text-gray-600"
                          onClick={() => toggleDropdown('dateFilterDropdown')}
                        >
                          <Filter className="h-3 w-3" />
                        </button>
                        
                        {/* Tarih Filtresi Dropdown */}
                        <div id="dateFilterDropdown" className="filter-dropdown absolute mt-8 w-72 bg-white rounded-lg shadow-lg p-4 z-10 hidden">
                          <div className="space-y-3">
                            <h3 className="text-sm font-medium text-gray-700">Tarih Aralığı</h3>
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <label className="block text-xs text-gray-500">Başlangıç</label>
                                <input 
                                  type="date" 
                                  className="w-full px-2 py-1 border border-gray-300 rounded"
                                  value={format(dateRange.start, 'yyyy-MM-dd')}
                                  onChange={(e) => setDateRange({...dateRange, start: new Date(e.target.value)})}
                                />
                              </div>
                              <div>
                                <label className="block text-xs text-gray-500">Bitiş</label>
                                <input 
                                  type="date" 
                                  className="w-full px-2 py-1 border border-gray-300 rounded"
                                  value={format(dateRange.end, 'yyyy-MM-dd')}
                                  onChange={(e) => setDateRange({...dateRange, end: new Date(e.target.value)})}
                                />
                              </div>
                            </div>
                            <div className="flex justify-between">
                              <button 
                                className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 text-sm"
                                onClick={() => {
                                  setIsDateFilterActive(false);
                                  setDateRange({
                                    start: new Date(new Date().setDate(new Date().getDate() - 30)),
                                    end: new Date()
                                  });
                                }}
                              >
                                Temizle
                              </button>
                              <button 
                                className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                                onClick={applyDateFilter}
                              >
                                Uygula
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Açıklama
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="flex items-center">
                        Toplam Tutar
                        <button 
                          className="ml-1 text-gray-400 hover:text-gray-600"
                          onClick={() => toggleDropdown('amountFilterDropdown')}
                        >
                          <Filter className="h-3 w-3" />
                        </button>
                        
                        {/* Tutar Filtresi Dropdown */}
                        <div id="amountFilterDropdown" className="filter-dropdown absolute mt-8 w-72 bg-white rounded-lg shadow-lg p-4 z-10 hidden">
                          <div className="space-y-3">
                            <h3 className="text-sm font-medium text-gray-700">Tutar Aralığı</h3>
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <label className="block text-xs text-gray-500">Minimum (₺)</label>
                                <input 
                                  type="number" 
                                  className="w-full px-2 py-1 border border-gray-300 rounded"
                                  placeholder="0"
                                  value={amountFilter.min}
                                  onChange={(e) => setAmountFilter({...amountFilter, min: e.target.value})}
                                />
                              </div>
                              <div>
                                <label className="block text-xs text-gray-500">Maksimum (₺)</label>
                                <input 
                                  type="number" 
                                  className="w-full px-2 py-1 border border-gray-300 rounded"
                                  placeholder="∞"
                                  value={amountFilter.max}
                                  onChange={(e) => setAmountFilter({...amountFilter, max: e.target.value})}
                                />
                              </div>
                            </div>
                            <div className="flex justify-between">
                              <button 
                                className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 text-sm"
                                onClick={() => setAmountFilter({ min: '', max: '' })}
                              >
                                Temizle
                              </button>
                              <button 
                                className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                                onClick={applyAmountFilter}
                              >
                                Uygula
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="flex items-center">
                        Ödeme Gönderim Durumu
                        <button 
                          className="ml-1 text-gray-400 hover:text-gray-600"
                          onClick={() => toggleDropdown('statusFilterDropdown')}
                        >
                          <Filter className="h-3 w-3" />
                        </button>
                        
                        {/* Durum Filtresi Dropdown */}
                        <div id="statusFilterDropdown" className="filter-dropdown absolute mt-8 w-64 bg-white rounded-lg shadow-lg p-4 z-10 hidden">
                          <div className="space-y-3">
                            <h3 className="text-sm font-medium text-gray-700">Ödeme Durumu</h3>
                            <div className="space-y-2">
                              <label className="flex items-center">
                                <input 
                                  type="radio" 
                                  name="status" 
                                  value="all" 
                                  checked={statusFilter === 'all'}
                                  onChange={() => setStatusFilter('all')}
                                  className="mr-2"
                                />
                                Tümü
                              </label>
                              <label className="flex items-center">
                                <input 
                                  type="radio" 
                                  name="status" 
                                  value="completed"
                                  checked={statusFilter === 'completed'}
                                  onChange={() => setStatusFilter('completed')}
                                  className="mr-2"
                                />
                                Tamamlandı
                              </label>
                              <label className="flex items-center">
                                <input 
                                  type="radio" 
                                  name="status" 
                                  value="pending"
                                  checked={statusFilter === 'pending'}
                                  onChange={() => setStatusFilter('pending')}
                                  className="mr-2"
                                />
                                Bekliyor
                              </label>
                            </div>
                            <div className="flex justify-end">
                              <button 
                                className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                                onClick={() => document.getElementById('statusFilterDropdown')?.classList.add('hidden')}
                              >
                                Uygula
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="flex items-center">
                        Tahakkuk Durumu
                        <button 
                          className="ml-1 text-gray-400 hover:text-gray-600"
                          onClick={() => toggleDropdown('tahakkukFilterDropdown')}
                        >
                          <Filter className="h-3 w-3" />
                        </button>
                        
                        {/* Tahakkuk Durumu Filtresi Dropdown */}
                        <div id="tahakkukFilterDropdown" className="filter-dropdown absolute mt-8 w-64 bg-white rounded-lg shadow-lg p-4 z-10 hidden">
                          <div className="space-y-3">
                            <h3 className="text-sm font-medium text-gray-700">Tahakkuk Durumu</h3>
                            <div className="space-y-2">
                              <label className="flex items-center">
                                <input 
                                  type="radio" 
                                  name="tahakkuk" 
                                  value="all" 
                                  checked={tahakkukFilter === 'all'}
                                  onChange={() => setTahakkukFilter('all')}
                                  className="mr-2"
                                />
                                Tümü
                              </label>
                              <label className="flex items-center">
                                <input 
                                  type="radio" 
                                  name="tahakkuk" 
                                  value="completed"
                                  checked={tahakkukFilter === 'completed'}
                                  onChange={() => setTahakkukFilter('completed')}
                                  className="mr-2"
                                />
                                Tamamlandı
                              </label>
                              <label className="flex items-center">
                                <input 
                                  type="radio" 
                                  name="tahakkuk" 
                                  value="partial"
                                  checked={tahakkukFilter === 'partial'}
                                  onChange={() => setTahakkukFilter('partial')}
                                  className="mr-2"
                                />
                                Kısmi
                              </label>
                              <label className="flex items-center">
                                <input 
                                  type="radio" 
                                  name="tahakkuk" 
                                  value="pending"
                                  checked={tahakkukFilter === 'pending'}
                                  onChange={() => setTahakkukFilter('pending')}
                                  className="mr-2"
                                />
                                Bekliyor
                              </label>
                            </div>
                            <div className="flex justify-end">
                              <button 
                                className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                                onClick={() => document.getElementById('tahakkukFilterDropdown')?.classList.add('hidden')}
                              >
                                Uygula
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      İşlemler
                    </th>
                  </tr>
                </thead>
                
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredReceipts.map((receipt) => (
                    <tr key={receipt.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{receipt.id}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{formatDate(receipt.date)}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 truncate max-w-xs">
                          {receipt.description}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-green-600">
                          {formatCurrency(receipt.amount)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          receipt.status === 'completed' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {receipt.status === 'completed' ? 'Tamamlandı' : 'Bekliyor'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          receipt.tahakkukStatus === 'completed' 
                            ? 'bg-green-100 text-green-800' 
                            : receipt.tahakkukStatus === 'partial'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {receipt.tahakkukStatus === 'completed' 
                            ? 'Tamamlandı' 
                            : receipt.tahakkukStatus === 'partial'
                              ? 'Kısmi'
                              : 'Bekliyor'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleViewReceipt(receipt)}
                          className="text-blue-600 hover:text-blue-900 mr-4"
                        >
                          <FileText className="h-5 w-5" />
                        </button>
                        <button
                          className="text-green-600 hover:text-green-900"
                        >
                          <Download className="h-5 w-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {/* Pagination */}
              <div className="bg-gray-50 px-6 py-3 flex items-center justify-between border-t border-gray-200">
                <div className="flex-1 flex justify-between items-center">
                  <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                    <ChevronLeft className="h-4 w-4 mr-2" />
                    Önceki
                  </button>
                  <span className="text-sm text-gray-700">
                    Toplam <span className="font-medium">{filteredReceipts.length}</span> dekont
                  </span>
                  <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                    Sonraki
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
      
      {/* Dekont Detay Modal */}
      {selectedReceipt && (
        <ReceiptDetailModal 
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          receipt={selectedReceipt}
        />
      )}
    </div>
  );
} 