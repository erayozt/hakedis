import { useState, useEffect } from 'react';
import { format, subDays, addHours } from 'date-fns';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';

// Örnek veri üreteci - Sağlanan yeni kolonlara göre tamamen güncellendi
const generateWalletDailyDetails = (settlementId: string) => {
  const details = [];
  const count = Math.floor(Math.random() * 20) + 5;
  
  for (let i = 0; i < count; i++) {
    const tutar = Math.random() * 500 + 10;
    const isSatis = Math.random() > 0.15;
    const is3D = Math.random() > 0.5;
    const kartBankalari = ['Garanti', 'Akbank', 'İş Bankası', 'Yapı Kredi', 'Ziraat'];
    const posBilgileri = ['Garanti POS', 'Akbank POS', 'İş Bankası POS'];
    const kartTipleri = ['Kredi Kartı', 'Banka Kartı'];
    const kartAileleri = ['Bonus', 'Maximum', 'World', 'Axess'];
    const hataMesajlari = ['İşlem Başarıyla Gerçekleştirildi.', 'Yetersiz Bakiye', 'Hatalı Kart Bilgisi'];
    
    details.push({
      hakEdişID: settlementId,
      işlemID: `3104a20f-c27b-40d1-9b93-${Math.random().toString(36).substring(2, 14)}`,
      işlemTarihiSaati: format(addHours(subDays(new Date(), 1), i), 'dd.MM.yyyy HH:mm'),
      üyeİşYeri: `1004 - Üye İşyeri M1004`,
      siparişNo: `${Math.floor(Math.random() * 1000000000)}`,
      üyeİşYeriSiparişNo: `U-${Math.floor(Math.random() * 1000)}`,
      tutar: tutar,
      taksit: 1,
      komisyonTutarı: isSatis ? tutar * 0.02 : 0,
      sabitÜcret: 0.00,
      komisyonOranı: 2,
      işlemTipi: isSatis ? 'Satış' : 'İade',
      siparişDurumu: 'Cüzdan ile ödeme başarıyla tamamlandı.',
      '3DileÖdeme': is3D ? 'Evet' : 'Hayır',
      bankaStatüsü: '',
      kartınBankası: kartBankalari[Math.floor(Math.random() * kartBankalari.length)],
      posBilgisi: posBilgileri[Math.floor(Math.random() * posBilgileri.length)],
      gönderilenPOSBilgisi: '',
      kartSahibiİsmi: 'A*** B***',
      kartNo: `5555 **** **** ${Math.floor(Math.random() * 9000) + 1000}`,
      kartTipi: kartTipleri[Math.floor(Math.random() * kartTipleri.length)],
      kartAilesi: kartAileleri[Math.floor(Math.random() * kartAileleri.length)],
      ödemeTipi: 'Cüzdan',
      kayıtlıKartMı: Math.random() > 0.5 ? 'Evet' : 'Hayır',
      ödemeSağlayıcısı: 'Craftgate',
      ödemeKanalı: ['iOSNative', 'AndroidNative', 'Web'][Math.floor(Math.random() * 3)],
      hataGrubu: '0000',
      hataMesajı: hataMesajlari[isSatis ? 0 : Math.floor(Math.random() * 2) + 1],
    });
  }
  return details;
};

interface WalletDailyTableProps {
  settlementId: string;
}

export default function WalletDailyTable({ settlementId }: WalletDailyTableProps) {
  const [details, setDetails] = useState(generateWalletDailyDetails(settlementId));

  useEffect(() => {
    setDetails(generateWalletDailyDetails(settlementId));
  }, [settlementId]);

  if (!details.length) {
    return <p className="text-center p-4 text-gray-500">Bu hakediş için detay bulunamadı.</p>;
  }

  const tableHeaders = [
    'Hak Ediş ID', 'İşlem ID', 'İşlem Tarihi-Saati', 'Üye İş Yeri', 'Sipariş No', 'Üye İş Yeri Sipariş No', 'Tutar', 'Taksit', 'Komisyon Tutarı (BSMV Hariç)', 'Sabit Ücret', 'Komisyon Oranı (%)', 'İşlem Tipi', 'Sipariş Durumu', '3D ile Ödeme', 'Banka Statüsü', 'Kartın Bankası', 'POS Bilgisi', 'Gönderilen POS Bilgisi', 'Kart Sahibi İsmi', 'Kart No', 'Kart Tipi', 'Kart Ailesi', 'Ödeme Tipi', 'Kayıtlı Kart Mı?', 'Ödeme Sağlayıcısı', 'Ödeme Kanalı', 'Hata Grubu', 'Hata Mesajı'
  ];

  return (
    <div className="overflow-x-auto">
      <Table className="min-w-full">
        <TableHeader>
          <TableRow>
            {tableHeaders.map(header => <TableHead key={header} className="whitespace-nowrap">{header}</TableHead>)}
          </TableRow>
        </TableHeader>
        <TableBody>
          {details.map((detail) => (
            <TableRow key={detail.işlemID}>
              <TableCell className="font-mono text-xs">{detail.hakEdişID}</TableCell>
              <TableCell className="font-mono text-xs">{detail.işlemID}</TableCell>
              <TableCell>{detail.işlemTarihiSaati}</TableCell>
              <TableCell>{detail.üyeİşYeri}</TableCell>
              <TableCell>{detail.siparişNo}</TableCell>
              <TableCell>{detail.üyeİşYeriSiparişNo}</TableCell>
              <TableCell className="text-right">{detail.tutar.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}</TableCell>
              <TableCell className="text-center">{detail.taksit}</TableCell>
              <TableCell className="text-right">{detail.komisyonTutarı.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}</TableCell>
              <TableCell className="text-right">{detail.sabitÜcret.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}</TableCell>
              <TableCell className="text-center">{detail.komisyonOranı}</TableCell>
              <TableCell>{detail.işlemTipi}</TableCell>
              <TableCell>{detail.siparişDurumu}</TableCell>
              <TableCell>{detail['3DileÖdeme']}</TableCell>
              <TableCell>{detail.bankaStatüsü}</TableCell>
              <TableCell>{detail.kartınBankası}</TableCell>
              <TableCell>{detail.posBilgisi}</TableCell>
              <TableCell>{detail.gönderilenPOSBilgisi}</TableCell>
              <TableCell>{detail.kartSahibiİsmi}</TableCell>
              <TableCell className="font-mono">{detail.kartNo}</TableCell>
              <TableCell>{detail.kartTipi}</TableCell>
              <TableCell>{detail.kartAilesi}</TableCell>
              <TableCell>{detail.ödemeTipi}</TableCell>
              <TableCell>{detail.kayıtlıKartMı}</TableCell>
              <TableCell>{detail.ödemeSağlayıcısı}</TableCell>
              <TableCell>{detail.ödemeKanalı}</TableCell>
              <TableCell>{detail.hataGrubu}</TableCell>
              <TableCell>{detail.hataMesajı}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
