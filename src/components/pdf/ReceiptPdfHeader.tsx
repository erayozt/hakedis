import React from 'react';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import hepsipayLogo from '../../assets/hepsipay-logo.png';

interface ReceiptPdfHeaderProps {
  receiptId: string;
  date: string;
  description: string;
}

export default function ReceiptPdfHeader({ receiptId, date, description }: ReceiptPdfHeaderProps) {
  return (
    <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-300">
      <div className="flex items-center">
        <img src={hepsipayLogo} alt="Hepsipay Logo" className="h-10" />
      </div>
      <div className="text-right">
        <h1 className="text-xl font-bold text-blue-700">ÖDEME DEKONTU</h1>
        {receiptId && <p className="text-sm font-semibold text-gray-700">Dekont No: {receiptId}</p>}
        {description && <p className="text-sm text-gray-700">Açıklama: {description}</p>}
        <p className="text-sm text-gray-700">Tarih: <span className="font-medium">{format(new Date(date), 'dd MMMM yyyy', { locale: tr })}</span></p>
      </div>
    </div>
  );
} 