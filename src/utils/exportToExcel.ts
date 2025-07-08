import * as XLSX from 'xlsx';
import { format } from 'date-fns';
import hepsipayLogo from '../assets/hepsipay-logo.png';
import { User, Merchant } from '../types';

export const exportToExcel = (data: any[], fileName: string) => {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  
  // Logo eklemek için özel bir başlık satırı oluşturma
  // Not: Excel'de doğrudan resim eklemek için daha karmaşık bir işlem gerekir
  // Bu basit bir metin başlığı ekler
  XLSX.utils.sheet_add_aoa(worksheet, [['Hepsipay Raporu']], { origin: 'A1' });
  
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Rapor');
  XLSX.writeFile(workbook, `${fileName}.xlsx`);
};

export const exportMerchantUsersToExcel = (users: User[], merchantNames: string[], fileName?: string) => {
  try {
    // Tarih formatlaması için güvenli fonksiyon
    const formatDate = (dateStr: string | undefined) => {
      if (!dateStr) return '';
      try {
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) return dateStr;
        return date.toLocaleDateString('tr-TR') + ' ' + date.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
      } catch {
        return dateStr; // Eğer format edilemezse original string'i döndür
      }
    };

    const exportData = users.map(user => {
      return {
        'Merchant Adı': user.merchant?.merchantName || 'N/A',
        'Merchant Numarası': user.merchant?.merchantNumber || 'N/A',
        'Merchant Tipi': user.merchant?.merchantType || 'N/A',
        'Ad': user.firstName || '',
        'Soyad': user.lastName || '',
        'E-posta': user.email || '',
        'TCKN': user.tckn || '',
        'Rol': user.roleId === 'merchant-admin' ? 'Merchant Admin' : 
               user.roleId === 'merchant-user' ? 'Merchant Kullanıcı' : 
               user.roleId || 'Rol Atanmamış',
        'Durum': user.isActive ? 'Aktif' : 'Pasif',
        'OTP Tipi': user.merchant?.otpType === 'mail' ? 'Mail OTP' :
                    user.merchant?.otpType === 'sms' ? 'SMS OTP' :
                    user.merchant?.otpType === 'none' ? 'Kapalı' : 'Bilinmiyor',
        'OTP Bitiş Tarihi': formatDate(user.merchant?.otpTypeExpiresAt),
        'Oluşturma Tarihi': formatDate(user.createdAt),
        'Son Güncelleme': formatDate(user.updatedAt)
      };
    });

    const workbook = XLSX.utils.book_new();
    
    // Ana çalışma sayfası
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    
    // Başlık satırı ekleme
    const now = new Date();
    const reportDate = now.toLocaleDateString('tr-TR') + ' ' + now.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
    
    const headerRow = [
      ['Hepsipay - Merchant Kullanıcı Raporu'],
      [''],
      [`Rapor Tarihi: ${reportDate}`],
      [`Seçilen Merchant Sayısı: ${merchantNames.length}`],
      [`Toplam Kullanıcı Sayısı: ${users.length}`],
      [''],
      ['Seçilen Merchant\'lar:'],
      ...merchantNames.map(name => [`- ${name}`]),
      ['']
    ];

    // Başlık ve boş satırları ekle
    XLSX.utils.sheet_add_aoa(worksheet, headerRow, { origin: 'A1' });
    
    // Veri tablosunu aşağıya taşı
    const dataStartRow = headerRow.length + 1;
    XLSX.utils.sheet_add_json(worksheet, exportData, { 
      origin: `A${dataStartRow}`,
      skipHeader: false 
    });

    // Sütun genişliklerini ayarla
    const columnWidths = [
      { wch: 25 }, // Merchant Adı
      { wch: 15 }, // Merchant Numarası  
      { wch: 12 }, // Merchant Tipi
      { wch: 15 }, // Ad
      { wch: 15 }, // Soyad
      { wch: 25 }, // E-posta
      { wch: 12 }, // TCKN
      { wch: 15 }, // Rol
      { wch: 8 },  // Durum
      { wch: 12 }, // OTP Tipi
      { wch: 18 }, // OTP Bitiş Tarihi
      { wch: 18 }, // Oluşturma Tarihi
      { wch: 18 }  // Son Güncelleme
    ];
    worksheet['!cols'] = columnWidths;

    // Sayfa adını ayarla
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Merchant Kullanıcıları');
    
    // Dosya adını oluştur
    const fileDate = new Date().toISOString().slice(0, 16).replace('T', '-').replace(/:/g, '-');
    const defaultFileName = `merchant-kullanicilari-${fileDate}`;
    XLSX.writeFile(workbook, `${fileName || defaultFileName}.xlsx`);
    
  } catch (error) {
    console.error('Excel export error:', error);
    throw new Error(`Excel dosyası oluşturulurken hata: ${error instanceof Error ? error.message : 'Bilinmeyen hata'}`);
  }
};