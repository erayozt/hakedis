
# Hepsipay Merchant Paneli Kullanıcı Kılavuzu (Detaylı)

Bu kılavuz, Hepsipay Merchant Panelini etkili bir şekilde kullanmanıza yardımcı olmak için tasarlanmıştır. Panel, ödeme operasyonlarınızı yönetmeniz, performansınızı izlemeniz ve finansal kayıtlarınıza erişmeniz için kapsamlı araçlar sunar.

## 1. Giriş

Merchant Paneli, iş yerinizin Hepsipay ile gerçekleştirdiği tüm işlemleri tek bir yerden yönetmenizi sağlar. Bu panel üzerinden anlık işlem verilerinizi takip edebilir, detaylı raporlar alabilir ve finansal mutabakatlarınızı kolayca yapabilirsiniz. Sol tarafta bulunan menüden **Kontrol Paneli**, **Ödeme Analizi**, **Dekontlar** gibi ana bölümlere ulaşabilirsiniz.

## 2. Ana Sayfa (Kontrol Paneli)

Panele giriş yaptığınızda sizi **Kontrol Paneli** karşılar. Bu sayfa, işletmenizin genel performansını bir bakışta görebilmeniz için tasarlanmıştır.

**Konum:** Sol menü > `Kontrol Paneli`

### 2.1. Üst Bilgi Alanı

Sayfanın en üstünde, genel işlemler için hızlı erişim butonları bulunur:

-   **Tarih Aralığı Seçimi:** Sağ üst köşede bulunan açılır menüden (`Son 7 Gün`, `Son 30 Gün`) raporlama periyodunu seçebilirsiniz.
-   **Raporları Görüntüle Butonu:** Tarih filtresinin hemen yanında, üzerinde `Göz` ikonu bulunan **"Raporları Görüntüle"** butonuna tıklayarak doğrudan "Ödeme Analizi ve Raporları" sayfasına geçiş yapabilirsiniz.

### 2.2. Genel Bakış Metrikleri (Metric Cards)

Üst bilgi alanının altında, işletmenizin kilit performans göstergelerini (KPI) içeren bir dizi kart bulunur. Bu kartlar genellikle 4'lü gruplar halinde sıralanmıştır.

-   **Toplam İşlem:** Gerçekleşen toplam işlem adedini gösterir.
-   **İşlem Hacmi:** Toplam cironuzu `₺` olarak gösterir.
-   **Başarı Oranı:** Başarılı işlemlerin yüzdesini belirtir.
-   **Pay with HP:** "Hepsipay ile Öde" kullanılarak yapılan işlem sayısını gösterir.
-   **Yeni Müşteri:** Belirtilen periyotta kazanılan yeni müşteri sayısı.
-   **Linkleme Oranı:** Müşterilerin kartlarını kaydetme oranı.
-   **Fraud Oranı:** Sahtekarlık şüphesi olan işlemlerin yüzdesi.
-   **Cashback Burn:** Müşterilerin kullandığı toplam cashback oranı.

### 2.3. Orta Bölüm Grafikleri ve Listeler

Sayfanın orta bölümünde, daha detaylı analizler sunan üç ana bileşen bulunur:

-   **Müşteri Yolculuğu:** Dönüşüm oranı, tıklama oranı gibi müşteri etkileşim metriklerini gösteren bir kart.
-   **Günlük Özet ve Son İşlemler:** Gün içinde gerçekleşen işlem adedi, hacim ve yeni kullanıcı sayısı gibi özet bilgileri ve son 5 işlemi (başarılı/başarısız durumu, müşteri adı, tutar) gösteren bir liste içerir. Bu kartın en altında bulunan **"Tüm İşlemleri Görüntüle"** butonu ile `Dekontlar` sayfasına gidebilirsiniz.
-   **Bildirimler:** Sistemle ilgili önemli güncellemeleri, hazır olan raporları veya uyarıları gösteren bir liste. En üstte **"X yeni"** şeklinde bir etiketle yeni bildirim sayısı belirtilir.

### 2.4. Alt Bölüm Grafikleri

Sayfanın en alt kısmında, görsel analizler sunan büyük grafik kartları yer alır:

-   **Ödeme Başarı Trendi:** Seçilen tarih aralığındaki başarı oranının zamana göre değişimini gösteren bir alan grafiği (Area Chart).
-   **Cashback Analizi:** Kazanılan ve kullanılan cashback miktarlarını karşılaştıran bir bölüm.
-   **Banka Performansı:** Anlaşmalı bankaların başarı oranlarını gösteren bir ilerleme çubuğu (progress bar) listesi.
-   **Fraud Analizi:** Direkt reddedilen ve izlenen şüpheli işlem sayılarını gösteren kartlar.
-   **Ödeme Tipleri ve Kaynakları:** Ödemelerin 3D Secure/Non-3D dağılımını ve Cüzdan/Saklı Kart/Kart Formu kullanım oranlarını gösteren iki ayrı pasta grafiği (Pie Chart).

## 3. Ödeme Analizi ve Raporları

Bu bölüm, ödeme performansınızla ilgili daha derinlemesine analizler yapmanızı ve özel raporlar oluşturmanızı sağlar.

**Konum:** Sol menü > `Ödeme Analizi` veya Kontrol Panelindeki `Raporları Görüntüle` butonu.

### 3.1. Rapor Filtreleme ve Oluşturma

Sayfanın üst kısmındaki kontrol alanından raporlarınızı özelleştirebilirsiniz:

-   **Tarih Aralığı:** `Son 24 Saat`, `Son 7 Gün`, `Son 30 Gün`, `Son 90 Gün` veya `Özel Tarih` seçenekleriyle veri aralığını belirleyebilirsiniz.
-   **Rapor Oluştur Butonu:** Tarih seçiminin yanında, üzerinde `Dosya` ikonu bulunan **"Rapor Oluştur"** butonu, seçilen filtrelere göre verileri günceller. Rapor oluşturulurken buton "Oluşturuluyor..." şeklinde değişir ve `Yenile` ikonu döner.
-   **Dışa Aktar Butonu:** Raporları `Excel` veya `CSV` olarak indirmek için, üzerinde `İndir` ikonu bulunan **"Dışa Aktar"** butonunu kullanın.

### 3.2. Rapor Sekmeleri

Filtreleme alanının altında, farklı analiz türlerine geçiş yapmanızı sağlayan sekmeler bulunur:

-   **Genel Bakış:** Performans metriklerinin özetini sunar.
-   **Performans:** Günlük ve saatlik işlem trendlerini gösterir.
-   **Müşteri Yolculuğu:** Dönüşüm huni (funnel) analizini detaylandırır.
-   **Fraud Analizi:** Sahtekarlık türlerine ve kanallarına göre dağılımı gösterir.
-   **Ödeme Yöntemleri:** Ödeme yöntemlerinin kullanım ve başarı oranlarını karşılaştırır.
-   **Cashback Analizi:** Kazanılan ve kullanılan cashback trendlerini gösterir.

Her sekme, konusuna özel grafikler ve tablolar içerir. Örneğin, **Banka Performansı Detaylı Analiz** tablosunda bankaların başarı oranlarını 3D Secure, Non-3D ve Saklı Kart kırılımında görebilirsiniz.

## 4. Dekontlar

Bu bölüm, Hepsipay tarafından size yapılan hakediş ödemelerine ait dekontları görüntülemenizi, filtrelemenizi ve indirmenizi sağlar.

**Konum:** Sol menü > `Dekontlar`

### 4.1. Dekont Arama ve Filtreleme

Dekont tablosunun başlık satırında (thead), her bir kolon için özel filtreleme seçenekleri bulunur. Filtrelemek için kolon başlığının yanındaki `Filtre` (huni) ikonuna tıklayın:

-   **Dekont ID:** Açılan pencereye aramak istediğiniz ID'yi yazın.
-   **Tarih:** Başlangıç ve bitiş tarihlerini seçebileceğiniz bir takvim penceresi açılır.
-   **Toplam Tutar:** Minimum ve maksimum tutar aralığı girebileceğiniz alanlar açılır.
-   **Ödeme Gönderim Durumu:** `Tümü`, `Tamamlandı`, `Bekliyor` seçeneklerinden birini seçebileceğiniz bir radyo butonu grubu açılır.
-   **Tahakkuk Durumu:** `Tümü`, `Tamamlandı`, `Kısmi`, `Bekliyor` seçeneklerini içeren bir radyo butonu grubu açılır.

Her filtre penceresinde **"Uygula"** ve **"Temizle"** butonları bulunur.

### 4.2. Dekont Görüntüleme ve İndirme

Dekont tablosundaki her satırın sağ tarafında iki adet ikon bulunur:

-   **Detay Görüntüle:** Üzerinde `Dosya` ikonu bulunan butona tıklayarak dekontun detaylarını içeren bir modal (pencere) açabilirsiniz. Bu modalda, dekonta ait cüzdan ve alışveriş kredisi işlem dökümleri, komisyonlar ve net tutar gibi ayrıntılı bilgiler yer alır.
-   **PDF İndir:** Üzerinde `İndir` ikonu bulunan yeşil renkli butona tıklayarak dekontu doğrudan `PDF` formatında bilgisayarınıza indirebilirsiniz. Bu işlem, dekontun PDF halini yeni bir sekmede veya pencerede açar.

### 4.3. Sayfalama (Pagination)

Tablonun en altında, çok sayıda dekontunuz olması durumunda sayfalar arasında gezinmenizi sağlayan **"Önceki"** ve **"Sonraki"** butonları ve toplam dekont sayısını gösteren bir bilgi alanı yer alır.

---

## 5. Finansal Terimler Sözlüğü

Bu bölümde, panelde sıkça karşılaşabileceğiniz finansal ve teknik terimlerin basit açıklamalarını bulabilirsiniz.

-   **Hacim (Ciro):** Belirli bir zaman diliminde (günlük, aylık vb.) gerçekleşen tüm başarılı işlemlerin toplam finansal değeridir. Kısacası, işletmenizin o dönemdeki toplam satış tutarını ifade eder.

-   **Başarı Oranı (Yetkilendirme Oranı):** Müşterileriniz tarafından başlatılan ödeme denemelerinin ne kadarının banka tarafından onaylanıp başarıyla sonuçlandığını gösteren yüzdelik orandır. Yüksek olması, ödeme altyapınızın sağlıklı çalıştığını gösterir.

-   **Fraud Oranı:** Toplam işlemler içinde sahtekarlık (fraud) şüphesiyle sistem tarafından reddedilen veya riskli olarak işaretlenen işlemlerin yüzdesidir. Düşük bir fraud oranı, güvenli bir operasyon yürüttüğünüz anlamına gelir.

-   **Dönüşüm Oranı:** Sitenizi veya uygulamanızı ziyaret eden kişilerden, ödeme işlemini başarıyla tamamlayanların oranını ifade eder. Müşteri yolculuğunun ne kadar etkili olduğunun bir göstergesidir.

-   **Linkleme Oranı (Kart Saklama Oranı):** Ödeme yapan müşterilerinizin, kart bilgilerini daha sonraki alışverişlerinde tekrar kullanmak üzere güvenli bir şekilde kaydetme (linkleme/saklama) oranını gösterir. Yüksek olması, müşteri sadakatini ve gelecekteki hızlı alışveriş potansiyelini artırır.

-   **3D Secure:** Kartla yapılan online ödemelerde ek bir güvenlik katmanıdır. Kart sahibinin, işlemi genellikle cep telefonuna gelen bir SMS şifresi ile doğrulamasını gerektirir. Bu yöntem, sahtekarlığa karşı hem sizi hem de müşterinizi korur.

-   **Non-3D Secure:** 3D Secure güvenlik adımı olmadan, sadece kart bilgileri (kart numarası, son kullanma tarihi, CVV) ile yapılan ödemelerdir. Daha hızlı bir ödeme akışı sunar ancak sahtekarlık ve chargeback (ters ibraz) riski 3D Secure'a göre daha yüksek olabilir.

-   **Saklı Kart:** Müşterinin, ödeme bilgilerini (kart numarasını) PCI-DSS uyumlu güvenli altyapıda saklayarak sonraki alışverişlerinde tekrar girmek zorunda kalmadan hızlıca ödeme yapmasını sağlayan yöntemdir.

-   **Hakediş:** Belirli bir dönemde (genellikle günlük veya aylık) yaptığınız satışlardan elde ettiğiniz, anlaşılan komisyon ve diğer işlem ücretleri düşüldükten sonra Hepsipay tarafından banka hesabınıza ödenecek olan net tutardır.

-   **Dekont:** Size yapılan hakediş ödemesinin tüm finansal detaylarını (toplam ciro, iadeler, komisyon kesintisi, işlem ücretleri, vergiler ve net ödenen tutar) içeren resmi belgedir. Finansal kayıtlarınız ve muhasebesel mutabakat için kritik öneme sahiptir.

-   **Tahakkuk:** Bir gelirin veya giderin, para transferi fiilen gerçekleşmemiş olsa bile, muhasebe kayıtlarına geçirilmesi işlemidir. Paneldeki "Tahakkuk Durumu", bir hakedişin hesaplanıp hesaplanmadığını, ödemeye hazır olup olmadığını veya ödenip ödenmediğini belirtir.

-   **Komisyon:** Hepsipay ödeme altyapısını ve hizmetlerini kullandığınız için, her başarılı işlem üzerinden, aranızdaki sözleşmede belirtilen oranlara göre kesilen hizmet bedelidir.

-   **Cashback:** Müşterilerinize, yaptıkları alışverişler üzerinden sunduğunuz ve daha sonraki alışverişlerinde indirim olarak kullanabildikleri "para puan" veya "nakit iade" sistemidir. Müşteri sadakatini artırmak için etkili bir araçtır.

-   **Cashback Burn Rate:** Müşterilerin kazandıkları toplam cashback tutarının ne kadarını harcadıklarını (yaktıklarını) gösteren orandır. Bu oran, cashback kampanyanızın ne kadar etkili olduğunu ve müşteriler tarafından ne kadar benimsendiğini gösterir.

Bu detaylı kılavuzun Hepsipay Merchant Panelini daha verimli kullanmanıza yardımcı olacağını umuyoruz. Herhangi bir sorunuz veya geri bildiriminiz için destek ekibimizle iletişime geçmekten çekinmeyin. 