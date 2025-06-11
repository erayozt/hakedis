import React from 'react';
import ReceiptPdfHeader from './ReceiptPdfHeader';
import ReceiptPdfSummarySection from './ReceiptPdfSummarySection';
import ReceiptPdfTransactionsSection from './ReceiptPdfTransactionsSection';
import ReceiptPdfFooter from './ReceiptPdfFooter';

interface ReceiptPdfDocumentProps {
  receipt: any;
  formatCurrency: (amount: number | undefined) => string;
}

export default function ReceiptPdfDocument({ receipt, formatCurrency }: ReceiptPdfDocumentProps) {
  return (
    <div className="p-8">
      {/* PDF Header */}
      <ReceiptPdfHeader 
        receiptId={receipt.id} 
        date={receipt.date}
        description={receipt.description} 
      />
      
      {/* Özet Bilgiler */}
      <ReceiptPdfSummarySection receipt={receipt} formatCurrency={formatCurrency} />
      
      {/* İşlem Detayları Bölümü */}
      <ReceiptPdfTransactionsSection receipt={receipt} formatCurrency={formatCurrency} />

      {/* Footer */}
      <ReceiptPdfFooter receiptId={receipt.id} />
    </div>
  );
} 