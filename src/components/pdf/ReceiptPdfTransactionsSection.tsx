import React from 'react';

interface ReceiptPdfTransactionsSectionProps {
  receipt: any;
  formatCurrency: (amount: number | undefined) => string;
}

export default function ReceiptPdfTransactionsSection({ receipt, formatCurrency }: ReceiptPdfTransactionsSectionProps) {
  // Cüzdan işlem hesaplamaları
  const totalWalletVolume = receipt.walletTransactions.volume;
  const totalWalletRefunds = receipt.walletTransactions.refunds || 0;
  const totalWalletCommission = receipt.walletTransactions.commission;
  const netWalletAmount = totalWalletVolume - totalWalletRefunds - totalWalletCommission;

  // Alışveriş kredisi hesaplamaları
  const creditVolume = receipt.creditTransactions.volume;
  const creditRefunds = receipt.creditTransactions.refunds || 0;
  const creditCommission = receipt.creditTransactions.commission;
  const creditNetAmount = creditVolume - creditRefunds - creditCommission;

  return (
    <div className="mb-6">
      <h2 className="text-sm font-semibold text-gray-800 mb-4 border-b-2 border-blue-500 pb-2">İŞLEM DETAYLARI</h2>
      
      {/* Cüzdan İşlemleri */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Cüzdan İşlemleri</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200 text-xs">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-3 py-2 text-left border-b border-gray-200">İşlem Tipi</th>
                <th className="px-3 py-2 text-left border-b border-gray-200">İşlem Adedi</th>
                <th className="px-3 py-2 text-right border-b border-gray-200">Tutar</th>
                <th className="px-3 py-2 text-right border-b border-gray-200">Komisyon</th>
                <th className="px-3 py-2 text-right border-b border-gray-200">Net Tutar</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-3 py-2 border-b border-gray-200">Satış</td>
                <td className="px-3 py-2 border-b border-gray-200">{receipt.walletTransactions.count}</td>
                <td className="px-3 py-2 text-right border-b border-gray-200">{formatCurrency(totalWalletVolume)}</td>
                <td className="px-3 py-2 text-right border-b border-gray-200">{formatCurrency(totalWalletCommission)}</td>
                <td className="px-3 py-2 text-right border-b border-gray-200">{formatCurrency(totalWalletVolume - totalWalletCommission)}</td>
              </tr>
              <tr>
                <td className="px-3 py-2 border-b border-gray-200">İade</td>
                <td className="px-3 py-2 border-b border-gray-200">{receipt.walletTransactions.refundCount || 0}</td>
                <td className="px-3 py-2 text-right border-b border-gray-200 text-red-600">-{formatCurrency(totalWalletRefunds)}</td>
                <td className="px-3 py-2 text-right border-b border-gray-200">-</td>
                <td className="px-3 py-2 text-right border-b border-gray-200 text-red-600">-{formatCurrency(totalWalletRefunds)}</td>
              </tr>
              <tr className="bg-gray-50 font-semibold">
                <td className="px-3 py-2 border-b border-gray-200">Toplam</td>
                <td className="px-3 py-2 border-b border-gray-200">
                  {receipt.walletTransactions.count + (receipt.walletTransactions.refundCount || 0)}
                </td>
                <td className="px-3 py-2 text-right border-b border-gray-200">{formatCurrency(totalWalletVolume - totalWalletRefunds)}</td>
                <td className="px-3 py-2 text-right border-b border-gray-200">{formatCurrency(totalWalletCommission)}</td>
                <td className="px-3 py-2 text-right border-b border-gray-200">{formatCurrency(netWalletAmount)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Alışveriş Kredisi İşlemleri */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
          <span>Alışveriş Kredisi İşlemleri</span>
          <span className="ml-2 bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded">Cüzdan İçinde</span>
        </h3>
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200 text-xs">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-3 py-2 text-left border-b border-gray-200">İşlem Tipi</th>
                <th className="px-3 py-2 text-left border-b border-gray-200">İşlem Adedi</th>
                <th className="px-3 py-2 text-right border-b border-gray-200">Tutar</th>
                <th className="px-3 py-2 text-right border-b border-gray-200">Komisyon</th>
                <th className="px-3 py-2 text-right border-b border-gray-200">Net Tutar</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-3 py-2 border-b border-gray-200">Satış</td>
                <td className="px-3 py-2 border-b border-gray-200">{receipt.creditTransactions.count}</td>
                <td className="px-3 py-2 text-right border-b border-gray-200">{formatCurrency(creditVolume)}</td>
                <td className="px-3 py-2 text-right border-b border-gray-200">{formatCurrency(creditCommission)}</td>
                <td className="px-3 py-2 text-right border-b border-gray-200">{formatCurrency(creditVolume - creditCommission)}</td>
              </tr>
              <tr>
                <td className="px-3 py-2 border-b border-gray-200">İade</td>
                <td className="px-3 py-2 border-b border-gray-200">{receipt.creditTransactions.refundCount || 0}</td>
                <td className="px-3 py-2 text-right border-b border-gray-200 text-red-600">-{formatCurrency(creditRefunds)}</td>
                <td className="px-3 py-2 text-right border-b border-gray-200">-</td>
                <td className="px-3 py-2 text-right border-b border-gray-200 text-red-600">-{formatCurrency(creditRefunds)}</td>
              </tr>
              <tr className="bg-gray-50 font-semibold">
                <td className="px-3 py-2 border-b border-gray-200">Toplam</td>
                <td className="px-3 py-2 border-b border-gray-200">
                  {receipt.creditTransactions.count + (receipt.creditTransactions.refundCount || 0)}
                </td>
                <td className="px-3 py-2 text-right border-b border-gray-200">{formatCurrency(creditVolume - creditRefunds)}</td>
                <td className="px-3 py-2 text-right border-b border-gray-200">{formatCurrency(creditCommission)}</td>
                <td className="px-3 py-2 text-right border-b border-gray-200">{formatCurrency(creditNetAmount)}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-gray-500 mt-2 italic">
          * Yukarıdaki alışveriş kredisi işlemleri, cüzdan işlemlerinin bir alt kümesidir ve toplam tutara ayrıca eklenmez.
        </p>
      </div>

      {/* Özet Bilgileri */}
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
        <h3 className="text-sm font-semibold text-gray-800 mb-3">Özet Bilgileri</h3>
        <div className="grid grid-cols-2 gap-4 text-xs">
          <div>
            <p className="text-gray-600 mb-1">Toplam İşlem Tutarı:</p>
            <p className="text-lg font-semibold">{formatCurrency(totalWalletVolume)}</p>
          </div>
          <div>
            <p className="text-gray-600 mb-1">Net Ödeme Tutarı:</p>
            <p className="text-lg font-semibold text-green-600">{formatCurrency(netWalletAmount)}</p>
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-3">
          Net ödeme tutarı, toplam işlem tutarından iadeler ve komisyon düşülerek hesaplanmıştır.
        </p>
      </div>
    </div>
  );
} 