# POS Hata Mesajları Yönetimi - Ürün Gereksinim Dokümanı (PRD)

## 1. Giriş

### 1.1 Amaç
Bu doküman, Hepsipay Ödeme Hizmetleri ve Elektronik Para A.Ş. tarafından geliştirilen Üye İşyeri Yönetim Paneli'nin POS Hata Mesajları Yönetimi modülünün kapsamlı bir tanımını sunmaktadır. Doküman, farklı POS provider'larından gelen hata kodlarının standart Hepsipay hata kodlarına eşleştirilerek, kullanıcı dostu mesajlar halinde sunulması süreçlerinin iş gereksinimlerini, kullanıcı deneyimini ve beklenen davranışlarını detaylandırmaktadır.

### 1.2 Kapsam
Bu PRD, aşağıdaki POS hata mesajları yönetimi bileşenlerini kapsamaktadır:
- Ana hata kodları (HB kodları) yönetimi
- Provider hata kodları eşleştirme sistemi
- Kullanıcı dostu mesaj düzenleme fonksiyonları
- Hata kodu filtreleme ve arama özellikleri
- Hiyerarşik görüntüleme sistemi
- Denetim ve güvenlik gereksinimleri

### 1.3 Hedef Kitle
Bu doküman aşağıdaki paydaşlar için hazırlanmıştır:
- Ürün Yöneticileri
- İş Analistleri
- UX/UI Tasarımcıları
- Yazılım Geliştirme Ekibi
- Test Ekibi
- Operasyon Ekibi
- Teknik Destek Ekibi

### 1.4 Tanımlar ve Kısaltmalar
| Terim | Açıklama |
|-------|----------|
| HB Kodu | Hepsipay standart hata kodu (örn: 1001, 2005) |
| Provider | POS servis sağlayıcısı (Craftgate, Payten, vs.) |
| Mapping | Provider hata kodunun HB koduna eşleştirilmesi |
| Original System Message | Sistemden gelen değiştirilemez ham hata mesajı |
| User Friendly Message | Kullanıcıya gösterilen düzenlenebilir mesaj |

## 2. Genel Bakış

### 2.1 Ürün Vizyonu
POS Hata Mesajları Yönetimi modülü, farklı POS provider'larından gelen çeşitli hata formatlarını standartlaştırarak, son kullanıcılara tutarlı ve anlaşılır hata mesajları sunmayı amaçlamaktadır. Bu sayede müşteri deneyimi iyileştirilirken, destek taleplerinin azaltılması hedeflenmektedir.

### 2.2 İş Hedefleri
- Farklı provider'ların hata kodlarını merkezi olarak yönetmek
- Kullanıcı dostu hata mesajları ile müşteri deneyimini iyileştirmek
- Hata mesajları ile ilgili destek taleplerini %40 azaltmak
- Yeni provider entegrasyonlarında hata yönetimi sürecini hızlandırmak
- Hata mesajlarının tutarlılığını sağlamak

### 2.3 Başarı Kriterleri
- Hata mesajı düzenleme süresinin %50 azaltılması
- Kullanıcı dostu mesajların %95 oranında aktif kullanımı
- Yeni provider entegrasyonlarında hata eşleştirme süresinin %60 azaltılması
- Müşteri destek taleplerinde hata mesajları kategorisinde %40 azalma
- Admin kullanıcı memnuniyet anketlerinde %90 ve üzeri memnuniyet skoru

## 3. Hata Yönetimi Sistemi

### 3.1 Ana Hata Kodları (HB Kodları)
Ana hata kodları, Hepsipay'in standartlaştırılmış hata kodu sistemidir:
- **Kod Formatı**: 4 haneli sayısal kod (örn: 1001, 2005, 3010)
- **Orijinal Sistem Mesajı**: Değiştirilemez, sistem tarafından üretilen mesaj
- **Kullanıcı Dostu Mesaj**: Düzenlenebilir, son kullanıcıya gösterilen mesaj
- **Kategori**: Hatanın türünü belirten sınıflandırma (sistem tarafından yönetilir)
- **Durum**: Aktif/Pasif (sistem tarafından yönetilir)

### 3.2 Provider Eşleştirmeleri
Her provider'ın kendi hata kodları HB kodlarına eşleştirilir:
- **Provider Bilgisi**: Craftgate, Payten, Paygate, vs.
- **Provider Hata Kodu**: Provider'ın kendi sistemindeki hata kodu
- **Provider Hata Mesajı**: Provider'dan gelen ham hata mesajı
- **Eşleştirilen HB Kodu**: Bağlı olunan ana hata kodu
- **Durum**: Eşleştirmenin aktif/pasif durumu

### 3.3 Özel Provider'lar
Bazı provider'lar özel statüdedir ve düzenlenemez:
- **Hepsipay Gateway**: Ana sistem provider'ı
- **Wallet**: Hepsipay cüzdan sistemi  
- **Paygate**: Merkezi ödeme gateway'i

## 4. Sistem Süreçleri

### 4.1 Ana Hata Mesajı Düzenleme Süreci
1. Admin kullanıcı, HB kodunun kullanıcı dostu mesajını düzenlemek ister
2. Düzenleme modalı açılır, mevcut mesaj görüntülenir
3. Yeni mesaj girilir ve kaydedilir
4. Değişiklik denetim loglarına kaydedilir
5. İlgili tüm eşleştirmelerde yeni mesaj geçerli olur

### 4.2 Filtreleme ve Arama Süreci
1. Kullanıcı, arama kriterlerini kolon başlıklarındaki filtrelere girer
2. Sistem, HB Kodu, Provider ve Provider Kodu alanlarında filtreleme yapar
3. Sonuçlar anlık olarak güncellenir
4. Filtreleme, hem ana kodlarda hem eşleştirmelerde geçerlidir

### 4.3 Veri Görüntüleme Süreci
1. Sistem, HB kodlarını sayısal sıraya göre listeler
2. Her HB kodu, mavi arka planla vurgulanır
3. HB kodunun altında, o koda eşleştirilen provider'lar listelenir
4. Hiyerarşik yapı ile ilişkiler görsel olarak belirtilir

## 5. Kullanıcı Arayüzü ve Deneyimi

### 5.1 Ana Sayfa Düzeni
Ana sayfa aşağıdaki bileşenleri içerir:
- **Sayfa Başlığı**: "POS Hata Mesaj Yönlendirmeleri"
- **Açıklama Metni**: Sayfanın amacını belirten kısa açıklama
- **Filtreleme Tablosu**: Kolon başlıklarında entegre filtreler
- **Hiyerarşik Tablo**: Ana kodlar ve eşleştirmeler
- **Sayfalama**: Büyük veri setleri için sayfalama kontrolü

### 5.2 Tablo Yapısı
**Ana HB Kod Satırları** (Mavi arka plan):
- HB Kodu (kalın font)
- "Ana Hata Kodu" etiketi
- "-" boş gösterimi
- Orijinal sistem mesajı
- Kullanıcı dostu mesaj (kalın font)
- Düzenle butonu (mavi kalem ikonu)

**Provider Eşleştirme Satırları**:
- "└─" hiyerarşi göstergesi
- Provider adı (girinti ile)
- Provider hata kodu (girinti ile)
- Provider hata mesajı (girinti ile)
- "⟵ Yukarıdaki HB mesajı" referans gösterimi
- Boş işlem sütunu

### 5.3 Filtreleme Özellikleri
**HB Kodu Filtresi**:
- Ana kodları ve eşleştirmeleri birlikte filtreler
- Gerçek zamanlı arama
- Büyük/küçük harf duyarsız

**Provider Filtresi**:
- Sadece eşleştirme satırlarını filtreler
- Ana kod satırları her zaman görünür
- Kısmi metin eşleştirmesi

**Provider Kodu Filtresi**:
- Sadece provider kodlarında arama
- Tam ve kısmi eşleştirme
- Alfanumerik destek

### 5.4 Düzenleme Modalı
**Ana Hata Mesajı Düzenleme Modalı**:
- HB kodu (salt okunur)
- Mevcut kullanıcı dostu mesaj
- Çok satırlı metin alanı
- Kaydet/İptal butonları
- Validasyon (boş mesaj kontrolü)

## 6. Denetim ve Güvenlik

### 6.1 Denetim Logları
Aşağıdaki işlemler denetim loglarına kaydedilir:
- Ana hata mesajı düzenlemeleri
- Filtreleme ve arama işlemleri
- Sayfa görüntüleme aktiviteleri
- Modal açma/kapama işlemleri

### 6.2 Log Detayları
Her log kaydı şu bilgileri içerir:
- Tarih ve saat (UTC)
- Kullanıcı ID
- İşlem tipi (mesaj düzenleme, filtreleme, vs.)
- Hedef HB kod ID
- Eski mesaj değeri
- Yeni mesaj değeri
- IP adresi
- User Agent bilgisi

### 6.3 Güvenlik Gereksinimleri
- Sadece yetkili admin kullanıcıları mesaj düzenleyebilir
- Özel provider'lar (Hepsipay, Wallet, Paygate) düzenlenemez
- Tüm değişiklikler kayıt altına alınır
- XSS ve injection saldırılarına karşı korunma

## 7. Kullanım Senaryoları

### 7.1 Ana Hata Mesajı Düzenleme
**Aktörler:** Admin Kullanıcı
**Ön Koşullar:** 
- Kullanıcı admin paneline giriş yapmış olmalıdır
- POS Hata Yönetimi sayfasına erişim yetkisi olmalıdır

**Akış:**
1. Kullanıcı POS Hata Yönetimi sayfasına gider
2. Düzenlemek istediği HB kodunun satırında mavi kalem ikonuna tıklar
3. Düzenleme modalı açılır
4. Mevcut kullanıcı dostu mesajı görür
5. Yeni mesaj metnini girer
6. "Kaydet" butonuna tıklar
7. Modal kapanır ve değişiklik tabloda görünür

**Sonuç:**
- Ana hata mesajı güncellenir
- İlgili tüm eşleştirmelerde yeni mesaj geçerli olur
- Denetim loglarına kayıt eklenir

### 7.2 Hata Kodu Arama ve Filtreleme
**Aktörler:** Admin Kullanıcı
**Ön Koşullar:**
- Kullanıcı POS Hata Yönetimi sayfasında olmalıdır

**Akış:**
1. Kullanıcı HB Kodu filtre kutusuna "1001" yazar
2. Sistem anlık olarak filtreleme yapar
3. Sadece 1001 kodu ile ilgili veriler görüntülenir
4. Provider filtresi ile "Craftgate" yazar
5. Sadece Craftgate eşleştirmeleri gösterilir
6. Filtreleri temizler
7. Tüm veriler tekrar görüntülenir

**Sonuç:**
- İstenen veriler hızlıca bulunur
- Çoklu filtreleme ile detaylı arama yapılır
- Gerçek zamanlı sonuçlar alınır

### 7.3 Hiyerarşik Veri İnceleme
**Aktörler:** Admin Kullanıcı, Operasyon Ekibi
**Ön Koşullar:**
- Kullanıcı sayfaya erişim yetkisine sahip olmalıdır

**Akış:**
1. Kullanıcı sayfayı açar
2. HB kodlarının mavi arka planla vurgulandığını görür
3. Her HB kodunun altında provider eşleştirmelerini inceler
4. "└─" işaretleri ile hiyerarşiyi takip eder
5. Hangi provider'ın hangi HB koda eşleştiğini anlar
6. Gerektiğinde düzenleme yapar

**Sonuç:**
- Veri ilişkileri net olarak görülür
- Provider-HB kod eşleştirmeleri anlaşılır
- Sistem organizasyonu kavranır

## 8. Teknik Olmayan Gereksinimler

### 8.1 Performans Gereksinimleri
- Sayfa yükleme süresi 3 saniyeyi geçmemelidir
- Filtreleme işlemleri 1 saniye içinde tamamlanmalıdır
- 1000+ hata kodu ve 5000+ eşleştirme sorunsuz görüntülenmelidir
- Düzenleme modalı 2 saniye içinde açılmalıdır

### 8.2 Kullanılabilirlik Gereksinimleri
- Arayüz sezgisel ve kolay öğrenilebilir olmalıdır
- Filtreleme gerçek zamanlı olmalıdır
- Hiyerarşik yapı görsel olarak net belirtilmelidir
- Hata mesajları açık ve anlaşılır olmalıdır
- Responsive tasarım ile farklı ekran boyutlarında çalışmalıdır

### 8.3 Güvenilirlik Gereksinimleri
- %99.9 uptime sağlanmalıdır
- Veri tutarlılığı her zaman korunmalıdır
- Düzenleme işlemleri atomik olmalıdır
- Sistem hatalarında veri kaybı olmamalıdır

### 8.4 Desteklenebilirlik Gereksinimleri
- Detaylı log mekanizmaları bulunmalıdır
- Hata ayıklama araçları sağlanmalıdır
- Konfigürasyon değişiklikleri kolay yapılabilmelidir
- Sistem modüler yapıda olmalıdır

## 9. Uygulama Yol Haritası

### 9.1 Faz 1: Temel Görüntüleme (Tamamlandı)
- Hiyerarşik tablo yapısı
- HB kodları ve eşleştirmeler görüntüleme
- Temel filtreleme özellikleri
- Kolon başlıklarında filtreleme

### 9.2 Faz 2: Düzenleme Özellikleri (Tamamlandı)
- Ana hata mesajı düzenleme modalı
- Kategori yönetiminin kaldırılması
- Provider eşleştirme düzenleme özelliklerinin kaldırılması
- Silme fonksiyonlarının kaldırılması

### 9.3 Faz 3: Gelişmiş Özellikler (Gelecek)
- Toplu mesaj düzenleme
- Excel içe/dışa aktarma
- Gelişmiş raporlama
- Otomatik mesaj önerileri

## 10. Sözlük
| Terim | Açıklama |
|-------|----------|
| HB Kodu | Hepsipay standart hata kodu sistemi |
| Provider | POS servis sağlayıcısı |
| Mapping | Eşleştirme, provider kodunun HB koduna bağlanması |
| Craftgate | POS provider'ı |
| Payten | POS provider'ı |
| Paygate | Merkezi ödeme gateway'i |
| Modal | Açılır pencere formu |
| Responsive | Farklı ekran boyutlarına uyarlanabilen tasarım |

---

## UAT Test Senaryoları

### 1. Hiyerarşik Görüntüleme Testleri
- HB kodlarının mavi arka planla doğru gösterildiğini doğrulamak
- Provider eşleştirmelerinin girinti ile doğru gösterildiğini doğrulamak
- "└─" ve "⟵" işaretlerinin doğru konumlarda göründüğünü doğrulamak
- Veri sıralamasının HB koduna göre doğru yapıldığını doğrulamak

### 2. Filtreleme Fonksiyonalitesinin Testleri
- HB Kodu filtresinin hem ana kodlarda hem eşleştirmelerde çalıştığını doğrulamak
- Provider filtresinin sadece eşleştirme satırlarını filtrelediğini doğrulamak
- Provider Kodu filtresinin doğru sonuçlar döndürdüğünü doğrulamak
- Çoklu filtrelerin birlikte çalıştığını doğrulamak
- Filtre temizleme işleminin doğru çalıştığını doğrulamak

### 3. Ana Hata Mesajı Düzenleme Testleri
- Düzenleme modalının doğru açıldığını doğrulamak
- Mevcut mesajın modal içinde doğru gösterildiğini doğrulamak
- Mesaj güncelleme işleminin başarılı olduğunu doğrulamak
- Boş mesaj kontrolü validasyonunun çalıştığını doğrulamak
- Modal kapandıktan sonra değişikliklerin tabloda görüldüğünü doğrulamak

### 4. Güvenlik ve Yetki Testleri
- Sadece yetkili kullanıcıların düzenleme yapabildiğini doğrulamak
- Özel provider'ların (Hepsipay, Wallet, Paygate) düzenlenemediğini doğrulamak
- Tüm işlemlerin denetim loglarına kaydedildiğini doğrulamak
- XSS ve injection saldırılarına karşı korunmanın olduğunu doğrulamak

### 5. Performans ve Kullanılabilirlik Testleri
- Sayfa yükleme süresinin 3 saniyeyi geçmediğini doğrulamak
- Filtreleme işlemlerinin 1 saniye içinde tamamlandığını doğrulamak
- Büyük veri setlerinin sorunsuz gösterildiğini doğrulamak
- Responsive tasarımın farklı ekran boyutlarında çalıştığını doğrulamak

### 6. Denetim ve Loglama Testleri
- Mesaj düzenleme işlemlerinin loglandığını doğrulamak
- Log detaylarının gerekli tüm bilgileri içerdiğini doğrulamak
- Filtreleme işlemlerinin loglandığını doğrulamak
- Log verilerinin doğru formatda kaydedildiğini doğrulamak

### 7. Entegrasyon Testleri
- Mevcut admin panel yapısıyla uyumlu çalıştığını doğrulamak
- Kullanıcı yetkilendirme sisteminin entegre olduğunu doğrulamak
- Denetim log sisteminin çalıştığını doğrulamak
- Veri tabanı işlemlerinin tutarlı olduğunu doğrulamak

### 8. Hata Durumu Testleri
- Ağ bağlantısı kesildiğinde uygun hata mesajı gösterildiğini doğrulamak
- Sunucu hatalarında kullanıcıya bilgi verildiğini doğrulamak
- Geçersiz veri girişlerinde validasyon mesajlarının göründüğünü doğrulamak
- Sistem yükü altında sayfanın stabil çalıştığını doğrulamak 