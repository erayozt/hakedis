import React, { useState, useEffect } from 'react';
import { posErrorService } from '../../services/posErrorService';
import { ErrorCategory } from '../types';
import { Button } from '../../components/ui/button';
import toast from 'react-hot-toast';
import ErrorDisplayStyleModal from '../../components/ErrorDisplayStyleModal';
import { ArrowRightLeft } from 'lucide-react';

// Varsayılan gösterim tipleri. Bunları mock veriden alıyoruz.
const displayTypeMapping: { [key: string]: 'inline' | 'fullscreen' } = {
  'Banka/Finansal Hata': 'inline',          
  'Teknik/Sistemsel Hata': 'fullscreen',    
  'Kullanıcı Hatası': 'inline',             
  'Güvenlik/Risk Hatası': 'fullscreen',     
  'İşlem Akışı Hatası': 'fullscreen',     
  'Cüzdan Hatası': 'inline',                
  'Other': 'fullscreen'                     
};


const ErrorDisplayManagement: React.FC = () => {
  const [categories, setCategories] = useState<ErrorCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [displayStyles, setDisplayStyles] = useState<Record<string, 'inline' | 'fullscreen'>>({});
  const [isSaving, setIsSaving] = useState(false);
  
  // Modal state'leri
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<ErrorCategory | null>(null);

  useEffect(() => {
    const loadCategories = async () => {
      setLoading(true);
      try {
        const categoriesData = await posErrorService.getErrorCategories();
        setCategories(categoriesData);
        
        const initialStyles: Record<string, 'inline' | 'fullscreen'> = {};
        categoriesData.forEach(category => {
          initialStyles[category.id] = displayTypeMapping[category.name] || 'inline';
        });
        setDisplayStyles(initialStyles);

      } catch (error) {
        console.error("Error loading categories:", error);
        toast.error("Kategoriler yüklenirken bir hata oluştu.");
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, []);

  const handleOpenModal = (category: ErrorCategory) => {
    setSelectedCategory(category);
    setIsModalOpen(true);
  };

  const handleModalSave = (newStyle: 'inline' | 'fullscreen') => {
    if (selectedCategory) {
      setDisplayStyles(prevStyles => ({
        ...prevStyles,
        [selectedCategory.id]: newStyle
      }));
    }
  };

  const handleSaveChanges = () => {
    setIsSaving(true);
    // Mock servise kaydetme simülasyonu
    console.log("Kaydedilen Stiller:", displayStyles);
    setTimeout(() => {
      setIsSaving(false);
      toast.success("Gösterim stilleri başarıyla güncellendi!");
    }, 1000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2">Kategoriler yükleniyor...</span>
      </div>
    );
  }

  return (
    <>
      <div className="p-1 bg-white rounded-lg ">
        <div className="space-y-6">
          {categories.map(category => (
            <div key={category.id} className="p-4 border rounded-lg flex items-center justify-between hover:bg-gray-50 transition-colors">
              <div>
                <div className="flex items-center mb-1">
                  <span 
                    className="w-4 h-4 rounded-full mr-3"
                    style={{ backgroundColor: category.color }}
                  ></span>
                  <h3 className="text-lg font-semibold text-gray-800">{category.name}</h3>
                </div>
                <p className="text-sm text-gray-500 ml-7">{category.description}</p>
              </div>
              <div className="flex items-center space-x-4">
                <span className={`px-3 py-1 text-xs font-medium rounded-full ${displayStyles[category.id] === 'fullscreen' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                  {displayStyles[category.id] === 'fullscreen' ? 'Fullscreen' : 'Inline'}
                </span>
                <Button variant="outline" size="sm" onClick={() => handleOpenModal(category)}>
                  <ArrowRightLeft className="h-4 w-4 mr-2" />
                  Değiştir
                </Button>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-8 flex justify-end">
          <Button onClick={handleSaveChanges} disabled={isSaving}>
            {isSaving ? 'Kaydediliyor...' : 'Tüm Değişiklikleri Kaydet'}
          </Button>
        </div>
      </div>
      
      {selectedCategory && (
        <ErrorDisplayStyleModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleModalSave}
          categoryName={selectedCategory.name}
          currentStyle={displayStyles[selectedCategory.id]}
        />
      )}
    </>
  );
};

export default ErrorDisplayManagement;
