import React from 'react';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';

interface ReceiptPdfSummarySectionProps {
  receipt: any;
  formatCurrency: (amount: number | undefined) => string;
}

const formatDate = (dateString: string) => {
  if (!dateString) return '-';
  return format(new Date(dateString), 'dd.MM.yyyy', { locale: tr });
};

export default function ReceiptPdfSummarySection({ receipt, formatCurrency }: ReceiptPdfSummarySectionProps) {

  return (
    <div className="mb-6">
      <h2 className="text-sm font-semibold text-gray-800 mb-3 border-b-2 border-blue-500 pb-2">ÖDEME BİLGİLERİ</h2>
      
      <div className="grid grid-cols-2 gap-6">
        {/* Üye İşyeri Bilgileri */}
        <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
          <h3 className="text-xs font-semibold text-gray-700 mb-3">Üye İşyeri Bilgileri</h3>
          <div className="space-y-2 text-xs">
            <div className="grid grid-cols-2 gap-1">
              <p className="text-gray-600">Üye İşyeri:</p>
              <p className="font-semibold text-blue-700">ABC Ticaret Ltd. Şti.</p>
            </div>
            <div className="grid grid-cols-2 gap-1">
              <p className="text-gray-600">Üye İşyeri No:</p>
              <p className="font-medium">M123456</p>
            </div>
            <div className="grid grid-cols-2 gap-1">
              <p className="text-gray-600">Vergi No:</p>
              <p className="font-medium">1234567890</p>
            </div>
            <div className="grid grid-cols-2 gap-1">
              <p className="text-gray-600">IBAN:</p>
              <p className="font-medium">TR12 3456 7890 1234 5678 9012 34</p>
            </div>
            <div className="grid grid-cols-2 gap-1">
              <p className="text-gray-600">Ödeme Vadesi:</p>
              <p className="font-medium">Ertesi Gün Ödeme</p>
            </div>
          </div>
        </div>
        
        {/* Dekont Bilgileri */}
        <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
          <h3 className="text-xs font-semibold text-gray-700 mb-3">Dekont Bilgileri</h3>
          <div className="space-y-2 text-xs">
            <div className="grid grid-cols-2 gap-1">
              <p className="text-gray-600">Dekont No:</p>
              <p className="font-semibold text-blue-700">{receipt.id}</p>
            </div>
            <div className="grid grid-cols-2 gap-1">
              <p className="text-gray-600">Tarih:</p>
              <p className="font-medium">{formatDate(receipt.date)}</p>
            </div>
            <div className="grid grid-cols-2 gap-1">
              <p className="text-gray-600">Açıklama:</p>
              <p className="font-medium">{receipt.description}</p>
            </div>
            <div className="grid grid-cols-2 gap-1">
              <p className="text-gray-600">Ödeme Durumu:</p>
              <p className="font-medium">
                {receipt.status === 'completed' ? 'Tamamlandı' : 'Bekliyor'}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-1">
              <p className="text-gray-600">Tahakkuk:</p>
              <p className="font-medium">
                {receipt.tahakkukStatus === 'completed' 
                  ? 'Tamamlandı' 
                  : receipt.tahakkukStatus === 'partial'
                    ? 'Kısmi'
                    : 'Bekliyor'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 