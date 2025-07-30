import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { AlertCircle, ShieldX } from 'lucide-react';

interface ErrorDisplayStyleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (style: 'inline' | 'fullscreen') => void;
  categoryName: string;
  currentStyle: 'inline' | 'fullscreen';
}

const ErrorDisplayStyleModal: React.FC<ErrorDisplayStyleModalProps> = ({ isOpen, onClose, onSave, categoryName, currentStyle }) => {
  const [selectedStyle, setSelectedStyle] = useState(currentStyle);

  useEffect(() => {
    setSelectedStyle(currentStyle);
  }, [currentStyle, isOpen]);

  const handleSave = () => {
    onSave(selectedStyle);
    onClose();
  };

  const InlinePreview = () => (
    <div className="w-full h-48 bg-gray-100 rounded-lg p-3 flex flex-col justify-between border">
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 rounded w-1/3"></div>
        <div className="h-8 bg-gray-200 rounded w-full"></div>
      </div>
      {/* Inline Hata Mesajı */}
      <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-2 rounded-md">
        <p className="text-xs font-bold">İşlem banka tarafından onaylanmadı.</p>
        <p className="text-xs">Lütfen farklı bir kartla deneyin.</p>
      </div>
      <div className="h-8 bg-blue-500 rounded w-full text-white flex items-center justify-center text-sm font-semibold">
        Ödeme Yap
      </div>
    </div>
  );

  const FullscreenPreview = () => (
    <div className="w-full h-48 bg-gray-100 rounded-lg flex flex-col items-center justify-center text-center border p-3">
        <ShieldX className="h-10 w-10 text-red-500 mb-2" />
        <h3 className="font-bold text-gray-800">İşlem Başarısız</h3>
        <p className="text-sm text-gray-600 mt-1">
            Sistemsel bir hata oluştu. Lütfen kısa bir süre sonra tekrar deneyiniz.
        </p>
    </div>
  );


  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>"{categoryName}" Kategorisi İçin Gösterim Stili</DialogTitle>
          <DialogDescription>
            Bu kategorideki hataların checkout sayfasında nasıl gösterileceğini seçin.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
          {/* Inline Seçeneği */}
          <div 
            className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${selectedStyle === 'inline' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}
            onClick={() => setSelectedStyle('inline')}
          >
            <div className="flex items-center mb-3">
              <input
                type="radio"
                id="inline-radio"
                name="style-radio"
                checked={selectedStyle === 'inline'}
                onChange={() => setSelectedStyle('inline')}
                className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
              />
              <label htmlFor="inline-radio" className="ml-2 block text-sm font-medium text-gray-900">
                Inline Gösterim
              </label>
            </div>
            <InlinePreview />
            <p className="text-xs text-gray-500 mt-2">Hata, ödeme formunun içinde bir satır olarak gösterilir. Kullanıcı formdan ayrılmaz.</p>
          </div>

          {/* Fullscreen Seçeneği */}
          <div 
            className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${selectedStyle === 'fullscreen' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}
            onClick={() => setSelectedStyle('fullscreen')}
          >
            <div className="flex items-center mb-3">
              <input
                type="radio"
                id="fullscreen-radio"
                name="style-radio"
                checked={selectedStyle === 'fullscreen'}
                onChange={() => setSelectedStyle('fullscreen')}
                className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
              />
               <label htmlFor="fullscreen-radio" className="ml-2 block text-sm font-medium text-gray-900">
                Fullscreen Gösterim
              </label>
            </div>
            <FullscreenPreview />
            <p className="text-xs text-gray-500 mt-2">Hata, tüm ekranı kaplayan bir sayfada gösterilir. Kullanıcının akışı kesilir.</p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>İptal</Button>
          <Button onClick={handleSave}>Seçimi Kaydet</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ErrorDisplayStyleModal;
