# Dinamik Fraud Kural Yönetimi - Ürün Gereksinim Dokümanı (PRD)

## 1. Giriş

### 1.1 Amaç
Bu doküman, Hepsipay Ödeme Hizmetleri ve Elektronik Para A.Ş. tarafından geliştirilen Üye İşyeri Yönetim Paneli'nin (Admin Panel) **Dinamik Fraud Kural Yönetimi** modülünün kapsamlı bir tanımını sunmaktadır. Doküman, sahtekarlık önleme süreçlerinin iş gereksinimlerini, kullanıcı deneyimini ve beklenen teknik davranışları detaylandırmaktadır.

### 1.2 Kapsam
Bu PRD, aşağıdaki bileşenleri ve süreçleri kapsamaktadır:
- Yeni fraud kurallarının oluşturulması, mevcutların düzenlenmesi ve durumlarının (aktif/pasif) yönetilmesi.
- Kural listeleme ekranı ve gelişmiş filtreleme özellikleri.
- Dinamik kural oluşturma formu (parametreye göre değişen giriş alanları).
- Kural parametreleri, operatörler ve aksiyonların tanımlanması.
- Global (`Tüm Üye İşyerleri`) ve üye işyeri bazında kural tanımlama yeteneği.

### 1.3 Hedef Kitle
- **Operasyon ve Risk Yönetimi Ekipleri:** Kuralları oluşturacak ve yönetecek olan ana kullanıcılar.
- Ürün Yöneticileri
- Yazılım Geliştirme Ekibi
- Test Ekibi
- Güvenlik Ekibi

### 1.4 Tanımlar ve Kısaltmalar
| Terim | Açıklama |
|---|---|
| Fraud | Sahtekarlık, dolandırıcılık. |
| Kural Parametresi | Bir kuralın neyi kontrol edeceğini belirleyen öznitelik (örn: Tutar, Kart Tipi). |
| Operatör | Parametrenin değerle nasıl karşılaştırılacağını belirten ifade (örn: Eşittir, Büyüktür). |
| Aksiyon | Kural koşulları sağlandığında tetiklenecek olan sonuç (örn: 3D'ye Zorla, Reddet). |
| MVP | Minimum Viable Product - Minimum Uygulanabilir Ürün |

## 2. Genel Bakış

### 2.1 Ürün Vizyonu
Hepsipay platformunda gerçekleşen finansal işlemleri, anlık olarak değişen sahtekarlık desenlerine karşı proaktif bir şekilde korumak; risk yönetimi ekibine, kodlama bilgisi gerektirmeden, esnek ve dinamik kurallar oluşturarak sahtekarlığı önleme yeteneği kazandırmaktır.

### 2.2 İş Hedefleri
- Sahtekarlık (fraud) kaynaklı finansal kayıpları minimize etmek.
- Yeni tespit edilen sahtekarlık yöntemlerine karşı anında aksiyon alabilme süresini kısaltmak.
- Operasyon ekibinin kural yönetimi için teknik ekiplere olan bağımlılığını ortadan kaldırmak.

## 3. Kural Yapısı ve Bileşenleri

Sistem, "EĞER [parametre] [operatör] [değer] ise, İŞLEME [aksiyon] uygula" mantığına dayanır.

### 3.1 Kural Parametreleri

#### Faz 1: Temel Parametreler (MVP)
| Parametre | Açıklama | Değer Tipi | Örnek Değer |
|---|---|---|---|
| `amount` | İşlem tutarı | Sayısal | `1500.00` |
| `cardType` | Kartın tipi | Liste (Çoklu Seçim) | `["DEBIT", "PREPAID"]` |
| `hourOfDay`| İşlemin yapıldığı saat aralığı | Zaman Aralığı | `{ start: "02:00", end: "05:00" }` |

#### Gelecek Fazlar (Tarih ve Kapsam Belirsiz)
Aşağıdaki parametrelerin eklenmesi gelecek fazlar için değerlendirilecektir.
| Parametre | Açıklama |
|---|---|
| `cardCountry` | Kartın ait olduğu ülke (BIN bilgisine göre) |
| `ipAddress` | İşlemin yapıldığı IP adresi veya bloğu |
| `uniqueDeviceId`| İşlemin yapıldığı cihaza ait özgün kimlik |

### 3.2 Operatörler
Parametrenin tipine göre dinamik olarak sunulan karşılaştırma operatörleri:

| Operatör | Açıklama | Desteklenen Parametreler |
|---|---|---|
| `<` | Küçüktür | `amount` |
| `<=` | Küçük veya eşittir | `amount` |
| `==` | Eşittir | `amount` |
| `>=` | Büyük veya eşittir | `amount` |
| `>` | Büyüktür | `amount` |
| `in` | İçerir (Listeden biri) | `cardType` |
| `notIn` | İçermez (Listeden hiçbiri) | `cardType` |
| `between` | Arasındadır | `hourOfDay` |

### 3.3 Aksiyonlar
Kural koşulu sağlandığında işlem için uygulanacak sonuç:

| Aksiyon | Açıklama |
|---|---|
| `force_3d` | İşlemi 3D Secure doğrulamasına zorla. |
| `process_non_3d`| İşlemi 3D Secure olmadan gerçekleştir. |
| `reject` | İşlemi direkt olarak reddet. |

## 4. Arayüz ve Kullanıcı Deneyimi

### 4.1 Kural Listeleme Ekranı
- Tanımlı kurallar bir tabloda listelenir.
- **Kolonlar:** Üye İşyeri, Kural Detayı, Aksiyon, Durum (Aktif/Pasif), Düzenle/Sil Butonları.
- **Filtreleme:** Üye İşyeri, Parametre Tipi, Aksiyon ve Durum'a göre filtreleme imkanı sunulur.

### 4.2 Kural Oluşturma/Düzenleme Modalı
- **Dinamik Form:** "Parametre" alanı seçildiğinde, "Operatör" ve "Değer" alanları o parametreye uygun seçenekleri ve giriş formatını sunar.
- **Kural Önizleme:** Form doldurulurken, oluşturulan kuralın insan dilinde bir özeti anlık olarak gösterilir.

## 5. Uygulama Yol Haritası

### 5.1 Faz 1: Temel Kural Seti (MVP)
- Kural motorunun ve arayüz altyapısının oluşturulması.
- **Parametreler:** `amount` (Tutar), `cardType` (Kart Tipi), `hourOfDay` (Saat Aralığı).
- Kural listeleme, ekleme, düzenleme ve durum (aktif/pasif) yönetimi.
- Global ve üye işyeri bazında kural atama.

### 5.2 Gelecek Fazlar (Tarih Belirsiz)
- **Gelişmiş Parametreler:** `cardCountry`, `ipAddress`, `uniqueDeviceId` gibi yeni parametrelerin eklenmesi.
- **Raporlama:** Kuralların performansı ve işlem akışına etkileri üzerine raporlama ekranları.
- **Makine Öğrenmesi:** Anomali tespiti ve kural öneri sistemleri.

---
## UAT Test Senaryoları

### 1. Faz 1 Testleri
- Tutar bazlı "büyüktür" kuralı oluşturulabilmeli ve doğru çalışmalı.
- Kart Tipi bazlı "içerir" kuralı (birden fazla tip seçerek) oluşturulabilmeli.
- Saat aralığı kuralı oluşturulabilmeli.
- Sadece "Aktif" olan ve "Tutar" parametresini kullanan kurallar filtrelenebilmeli.
- Parametre olarak "Saat Aralığı" seçildiğinde, Değer alanının zaman aralığı girişi sunduğu doğrulanmalı.
