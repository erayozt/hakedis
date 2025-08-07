import { useState, useEffect } from 'react';
import { format, subDays } from 'date-fns';

// Örnek veri üreteci - Sadece ilgili hakedişin detaylarını döndürecek şekilde basitleştirildi
const generateStoredCardMonthlyDetails = (settlementId: string) => {
  const details = [];
  const count = Math.floor(Math.random() * 30) + 10; // 10 ila 40 arası işlem detayı
  
  for (let i = 0; i < count; i++) {
    const amount = Math.random() * 200 + 5;
    const isRefund = Math.random() > 0.9;
    
    details.push({
      id: `TXN-SC-${settlementId}-${i}`,
      transactionDate: format(subDays(new Date(), Math.floor(Math.random() * 30)), 'yyyy-MM-dd HH:mm:ss'),
      transactionType: isRefund ? 'İade' : 'Saklı Kart Ödemesi',
      amount: isRefund ? -amount : amount,
      commission: isRefund ? 0 : amount * 0.02,
      netAmount: isRefund ? -amount : amount - (amount * 0.02),
      cardIssuer: ['Garanti', 'Akbank', 'İş Bankası', 'Yapı Kredi'][Math.floor(Math.random() * 4)],
      orderId: `ORD-SC-${Math.floor(Math.random() * 100000)}`,
    });
  }
  return details;
};

interface StoredCardMonthlyTableProps {
  settlementId: string;
}

export default function StoredCardMonthlyTable({ settlementId }: StoredCardMonthlyTableProps) {
  const [details, setDetails] = useState(generateStoredCardMonthlyDetails(settlementId));

  useEffect(() => {
    setDetails(generateStoredCardMonthlyDetails(settlementId));
  }, [settlementId]);

  if (!details.length) {
    return <p className="text-center p-4">Bu hakediş için detay bulunamadı.</p>;
  }

  return (
    <div className="bg-white rounded-lg shadow-inner border">
        <h4 className="text-lg font-semibold p-4 border-b">Hakediş Detayları ({settlementId})</h4>
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100">
                <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">İşlem Tarihi</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">Sipariş No</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">İşlem Tipi</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">Kart Bankası</th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-600 uppercase">Tutar</th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-600 uppercase">Komisyon</th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-600 uppercase">Net Tutar</th>
                </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                {details.map((detail) => (
                    <tr key={detail.id}>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{detail.transactionDate}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{detail.orderId}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                        <span className={`font-medium ${detail.transactionType === 'İade' ? 'text-red-600' : 'text-blue-600'}`}>
                            {detail.transactionType}
                        </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{detail.cardIssuer}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-right font-mono">{detail.amount.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-right font-mono">{detail.commission.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-right font-mono font-semibold">{detail.netAmount.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    </div>
  );
}
