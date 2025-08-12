import { useMemo, useState } from 'react';
import MerchantPaymentReports from '../merchant/PaymentReports';
import { Combobox, type ComboboxOption } from '../../components/ui/combobox';

export default function AdminPaymentReports() {
  const merchants = [
    { id: 'ALL', name: 'Tümü' },
    { id: 'M1001', name: 'HepsiModa A.Ş.' },
    { id: 'M1002', name: 'TeknoMarket Ltd.' },
    { id: 'M1003', name: 'Organik Gıda San.' },
    { id: 'M1004', name: 'Spor Severler A.Ş.' },
    { id: 'M1005', name: 'Kitap Dünyası' },
    { id: 'M1006', name: 'Kozmetik ve Sağlık' },
    { id: 'M1007', name: 'Bebek & Oyuncak' },
    { id: 'M1008', name: 'Elektronik Outlet' },
    { id: 'M1009', name: 'Ev & Yaşam' },
  ];

  const [selectedMerchantId, setSelectedMerchantId] = useState('ALL');
  const merchantOptions: ComboboxOption[] = useMemo(() => merchants.map(m => ({ value: m.id, label: m.name })), []);

  return (
    <div className="flex-1 space-y-2 p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Ödeme Raporları</h2>
      </div>
      <div className="flex items-center gap-3">
        <div className="text-sm text-gray-700 font-medium">Üye İş Yeri</div>
        <div className="w-80">
          <Combobox
            options={merchantOptions}
            value={selectedMerchantId}
            onChange={setSelectedMerchantId}
            placeholder="Üye iş yeri seçin"
            searchPlaceholder="İsim/ID ile arayın..."
          />
        </div>
      </div>

      {/* Not: MerchantPaymentReports kendi üst başlık/tarih filtrelerini render eder. Key değişimiyle veri yenilenir. */}
      <div className="mt-2">
        <MerchantPaymentReports key={selectedMerchantId} />
      </div>
    </div>
  );
}


