import React from 'react';
import Mermaid from '@/components/Mermaid';

const Architecture: React.FC = () => {
  const diagram = `
    graph TD
      A[Web Uygulaması] --> B[Admin Paneli]
      A --> C[Müşteri Paneli]
      
      B --> D[Dekont Yönetimi]
      B --> E[Kullanıcı Yönetimi]
      B --> F[İşlem Geçmişi]
      
      C --> G[Dekont Görüntüleme]
      C --> H[İşlem Listesi]
      C --> I[Profil Yönetimi]
      
      D --> J[Dekont Şablonları]
      D --> K[Dekont Oluşturma]
      D --> L[Dekont Arşivi]
      
      F --> M[İşlem Detayları]
      F --> N[İade İşlemleri]
      F --> O[Raporlama]
      
      style A fill:#f9f,stroke:#333,stroke-width:4px
      style B fill:#bbf,stroke:#333,stroke-width:2px
      style C fill:#bbf,stroke:#333,stroke-width:2px
  `;

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Sistem Mimarisi</h1>
      <div className="bg-white rounded-lg shadow-lg p-6">
        <Mermaid chart={diagram} />
      </div>
      <div className="mt-8 space-y-4">
        <h2 className="text-2xl font-semibold">Mimari Açıklaması</h2>
        <p className="text-gray-700">
          Bu sistem, dekont ve ekstre yönetimi için tasarlanmış bir web uygulamasıdır. 
          İki ana bölümden oluşur: Admin Paneli ve Müşteri Paneli.
        </p>
        <h3 className="text-xl font-semibold mt-4">Admin Paneli Özellikleri:</h3>
        <ul className="list-disc pl-6 text-gray-700">
          <li>Dekont şablonları oluşturma ve yönetme</li>
          <li>Kullanıcı hesaplarını yönetme</li>
          <li>İşlem geçmişini görüntüleme ve raporlama</li>
          <li>İade işlemlerini yönetme</li>
        </ul>
        <h3 className="text-xl font-semibold mt-4">Müşteri Paneli Özellikleri:</h3>
        <ul className="list-disc pl-6 text-gray-700">
          <li>Dekontları görüntüleme ve indirme</li>
          <li>İşlem geçmişini takip etme</li>
          <li>Profil bilgilerini güncelleme</li>
        </ul>
      </div>
    </div>
  );
};

export default Architecture; 