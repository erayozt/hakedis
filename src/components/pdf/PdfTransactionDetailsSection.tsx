interface PdfTransactionDetailsSectionProps {
  statement: any;
  formatCurrency: (amount: number | undefined) => string;
}

export default function PdfTransactionDetailsSection({ statement, formatCurrency }: PdfTransactionDetailsSectionProps) {
  // Storedcard ve iade verilerini alalım
  const storedCardData = statement?.storedCardTransactions || { count: 0, volume: 0, commission: 0 };
  const refundCount = storedCardData.refundCount || 0;
  const refundVolume = storedCardData.refundVolume || 0;
  
  // İade komisyonu hesaplama (BSMV dahil)
  const refundCommissionRate = parseFloat(statement.merchant.storedCardCommission?.replace('%', '').replace(',', '.')) / 100 || 0;
  const refundCommission = refundVolume * refundCommissionRate;
  
  // Net tutarları hesaplama (BSMV zaten dahil)
  const storedCardNetAmount = storedCardData.volume - storedCardData.commission;
  const refundNetAmount = refundVolume - refundCommission;
  
  // Toplam değerler
  const totalCount = storedCardData.count - refundCount;
  const totalVolume = storedCardData.volume - refundVolume;
  const totalCommission = storedCardData.commission - refundCommission;
  const totalNetAmount = totalVolume - totalCommission;

  return (
    <div className="mb-8">
      <h2 className="text-sm font-semibold text-gray-800 mb-3 border-b-2 border-blue-500 pb-2">İŞLEM ÖZETİ</h2>
      
      <table className="min-w-full text-xs border border-gray-200 rounded-lg overflow-hidden mb-4 shadow-sm">
        <thead className="bg-gray-100 text-gray-700">
          <tr>
            <th className="px-3 py-2 text-left font-medium">İşlem Tipi</th>
            <th className="px-3 py-2 text-left font-medium">İşlem Adedi</th>
            <th className="px-3 py-2 text-left font-medium">Toplam Tutar</th>
            <th className="px-3 py-2 text-left font-medium">Komisyon</th>
            <th className="px-3 py-2 text-left font-medium">Net Tutar</th>
          </tr>
        </thead>
        <tbody>
          {/* Saklı Kart İşlemleri */}
          <tr className="hover:bg-gray-50">
            <td className="px-3 py-2 border-b font-medium">Saklı Kart</td>
            <td className="px-3 py-2 border-b">{storedCardData.count}</td>
            <td className="px-3 py-2 border-b text-green-600">{formatCurrency(storedCardData.volume)}</td>
            <td className="px-3 py-2 border-b text-blue-600">{formatCurrency(storedCardData.commission)}</td>
            <td className="px-3 py-2 border-b text-green-600">{formatCurrency(storedCardNetAmount)}</td>
          </tr>
          
          {/* İade İşlemleri */}
          <tr className="hover:bg-gray-50">
            <td className="px-3 py-2 border-b font-medium">İade</td>
            <td className="px-3 py-2 border-b">{refundCount}</td>
            <td className="px-3 py-2 border-b text-red-600">{formatCurrency(-refundVolume)}</td>
            <td className="px-3 py-2 border-b text-red-600">{formatCurrency(-refundCommission)}</td>
            <td className="px-3 py-2 border-b text-red-600">{formatCurrency(-refundNetAmount)}</td>
          </tr>
          
          {/* Toplam Satırı */}
          <tr className="bg-gray-50 font-medium">
            <td className="px-3 py-2 border-b">Toplam</td>
            <td className="px-3 py-2 border-b">{totalCount}</td>
            <td className="px-3 py-2 border-b">{formatCurrency(totalVolume)}</td>
            <td className="px-3 py-2 border-b text-blue-700">{formatCurrency(totalCommission)}</td>
            <td className="px-3 py-2 border-b text-green-700">{formatCurrency(totalNetAmount)}</td>
          </tr>
        </tbody>
      </table>
      
      {/* Diğer Ücretler Bölümü */}
      {(statement.packageFee > 0 || statement.otherFees > 0) && (
        <div className="border border-gray-200 rounded-lg p-3 mb-4">
          <h3 className="text-xs font-medium text-gray-700 mb-2">Diğer Ücretler</h3>
          <div className="space-y-2 text-xs">
            {statement.packageFee > 0 && (
              <div className="flex justify-between items-center">
                <span>Paket Ücreti</span>
                <span className="font-medium text-blue-600">{formatCurrency(statement.packageFee)}</span>
              </div>
            )}
            {statement.otherFees > 0 && (
              <div className="flex justify-between items-center">
                <span>Diğer</span>
                <span className="font-medium">{formatCurrency(statement.otherFees)}</span>
              </div>
            )}
            <div className="flex justify-between items-center pt-1 border-t">
              <span className="font-medium">Toplam</span>
              <span className="font-medium">{formatCurrency((statement.packageFee || 0) + (statement.otherFees || 0))}</span>
            </div>
          </div>
        </div>
      )}
      
      {/* Ödenecek Toplam Tutar */}
      <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 shadow-sm">
        <div className="flex justify-between items-center text-sm font-semibold">
          <span className="text-blue-800">Ödenecek Toplam:</span>
          <span className="text-blue-700 text-lg">{formatCurrency(totalCommission + (statement.packageFee || 0) + (statement.otherFees || 0))}</span>
        </div>
      </div>
      
      {/* Yasal Bilgi Notu */}
      <div className="mt-4 text-xs text-gray-500 bg-gray-50 p-2 rounded border border-gray-200">
        <p>Not: Yukarıda belirtilen tüm komisyon ve ücretlere %5 Banka ve Sigorta Muameleleri Vergisi (BSMV) dahildir.</p>
      </div>
    </div>
  );
} 