import React from 'react';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';

interface PdfSummarySectionProps {
  statement: any;
  formatCurrency: (amount: number | undefined) => string;
}

export default function PdfSummarySection({ statement, formatCurrency }: PdfSummarySectionProps) {
  // Tarih formatlama
  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    return format(new Date(dateString), 'dd.MM.yyyy', { locale: tr });
  };
  
  // İade komisyonu hesaplama
  const refundCommissionRate = parseFloat(statement.merchant.storedCardCommission?.replace('%', '').replace(',', '.')) / 100 || 0;
  const refundCommission = statement.storedCardTransactions.refundVolume * refundCommissionRate;
  
  // Toplam işlem hacmi ve komisyon hesaplama
  const totalVolume = statement.storedCardTransactions.volume - statement.storedCardTransactions.refundVolume;
  const totalCommission = statement.storedCardTransactions.commission - refundCommission;
  const netAmount = totalVolume - totalCommission;
  
  // Ödenecek toplam tutar
  const totalPayable = totalCommission + (statement.packageFee || 0) + (statement.otherFees || 0);
  
  return (
    <div className="mb-6">
      <h2 className="text-sm font-semibold text-gray-800 mb-3 border-b-2 border-blue-500 pb-2">ÖZET BİLGİLER</h2>
      
      <div className="grid grid-cols-3 gap-6">
        {/* Üye İşyeri Bilgileri */}
        <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
          <h3 className="text-xs font-semibold text-gray-700 mb-3">Üye İşyeri Bilgileri</h3>
          <div className="space-y-2 text-xs">
            <div className="grid grid-cols-2 gap-1">
              <p className="text-gray-600">Üye İşyeri:</p>
              <p className="font-semibold text-blue-700">{statement.merchant.name}</p>
            </div>
            <div className="grid grid-cols-2 gap-1">
              <p className="text-gray-600">Üye İşyeri No:</p>
              <p className="font-medium">{statement.merchant.id}</p>
            </div>
            <div className="grid grid-cols-2 gap-1">
              <p className="text-gray-600">Üye İşyeri Tipi:</p>
              <p className="font-medium">{statement.merchant.type}</p>
            </div>
            <div className="grid grid-cols-2 gap-1">
              <p className="text-gray-600">Paket:</p>
              <p className="font-medium">{statement.merchant.package}</p>
            </div>
          </div>
        </div>
        
        {/* Ekstre Bilgileri */}
        <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
          <h3 className="text-xs font-semibold text-gray-700 mb-3">Ekstre Bilgileri</h3>
          <div className="space-y-2 text-xs">
            <div className="grid grid-cols-2 gap-1">
              <p className="text-gray-600">Ekstre No:</p>
              <p className="font-semibold text-blue-700">{statement.id}</p>
            </div>
            <div className="grid grid-cols-2 gap-1">
              <p className="text-gray-600">Dönem:</p>
              <p className="font-medium">{statement.period}</p>
            </div>
            <div className="grid grid-cols-2 gap-1">
              <p className="text-gray-600">Ekstre Tarihi:</p>
              <p className="font-medium">{formatDate(statement.issueDate)}</p>
            </div>
            <div className="grid grid-cols-2 gap-1">
              <p className="text-gray-600">Son Ödeme Tarihi:</p>
              <p className="font-medium">{formatDate(statement.dueDate)}</p>
            </div>
            <div className="grid grid-cols-2 gap-1">
              <p className="text-gray-600">Durum:</p>
              <p className="font-medium">{statement.status === 'paid' ? 'Ödendi' : statement.status === 'pending' ? 'Ödeme Bekliyor' : 'Gecikti'}</p>
            </div>
          </div>
        </div>
        
        {/* Ödeme Bilgileri */}
        <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
          <h3 className="text-xs font-semibold text-gray-700 mb-3">Ödeme Bilgileri</h3>
          <div className="space-y-2 text-xs">
            <div className="grid grid-cols-2 gap-1">
              <p className="text-gray-600">Banka:</p>
              <p className="font-medium">Yapı Kredi Bankası</p>
            </div>
            <div className="grid grid-cols-2 gap-1">
              <p className="text-gray-600">Alıcı:</p>
              <p className="font-medium">D Ödeme Elektronik Para ve Ödeme Hizmetleri A.Ş.</p>
            </div>
            <div className="grid grid-cols-2 gap-1">
              <p className="text-gray-600">IBAN:</p>
              <p className="font-medium">{statement.merchant.iban}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-1 mt-4 pt-2 border-t border-gray-200">
              <p className="text-gray-600 font-medium">Ödenecek Tutar:</p>
              <p className="font-medium text-blue-700 text-right">{formatCurrency(totalPayable)}</p>
            </div>
            
            <div className="mt-2 pt-2 bg-yellow-50 p-2 rounded border border-yellow-100 text-yellow-800">
              <p>* Ödemelerinizi üye işyeri paneli üzerinden kart ile kolayca gerçekleştirebilirsiniz.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 