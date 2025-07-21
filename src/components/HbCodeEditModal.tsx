import React, { useState, useEffect } from 'react';
import { X, Save, AlertTriangle } from 'lucide-react';
import { HBErrorCode, ErrorCategory } from '../types';

interface HbCodeEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedHbCode: HBErrorCode) => void;
  hbCode: HBErrorCode | null;
  categories: ErrorCategory[];
}

const HbCodeEditModal: React.FC<HbCodeEditModalProps> = ({
  isOpen,
  onClose,
  onSave,
  hbCode,
  categories,
}) => {
  const [formData, setFormData] = useState({
    hbErrorMessage: '',
    categoryId: '',
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (hbCode) {
      setFormData({
        hbErrorMessage: hbCode.hbErrorMessage,
        categoryId: hbCode.categoryId,
      });
      setErrors({});
    }
  }, [hbCode, isOpen]);

  if (!isOpen || !hbCode) {
    return null;
  }

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.hbErrorMessage.trim()) {
      newErrors.hbErrorMessage = 'Hata mesajı boş bırakılamaz.';
    }
    if (!formData.categoryId) {
      newErrors.categoryId = 'Kategori seçimi zorunludur.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) {
      onSave({ ...hbCode, ...formData });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity ${
        isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
    >
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg transform transition-all">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold">Ana Hata Mesajını Düzenle</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">HB Kodu</label>
            <input
              type="text"
              disabled
              value={hbCode.hbErrorCode}
              className="mt-1 w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg"
            />
            <p className="text-xs text-gray-500 mt-1">Bu kod sistemseldir ve değiştirilemez.</p>
          </div>

          <div>
            <label htmlFor="hbErrorMessage" className="block text-sm font-medium text-gray-700">
              HB Mesajı (Kullanıcı Dostu)
            </label>
            <textarea
              id="hbErrorMessage"
              name="hbErrorMessage"
              value={formData.hbErrorMessage}
              onChange={handleChange}
              rows={3}
              className={`mt-1 w-full px-3 py-2 border rounded-lg ${
                errors.hbErrorMessage ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.hbErrorMessage && <p className="text-xs text-red-500 mt-1">{errors.hbErrorMessage}</p>}
          </div>

          <div>
            <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700">
              Kategori
            </label>
            <select
              id="categoryId"
              name="categoryId"
              value={formData.categoryId}
              onChange={handleChange}
              className={`mt-1 w-full px-3 py-2 border rounded-lg ${
                errors.categoryId ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Kategori Seçin</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            {errors.categoryId && <p className="text-xs text-red-500 mt-1">{errors.categoryId}</p>}
          </div>
        </div>

        <div className="flex items-center justify-end p-4 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            İptal
          </button>
          <button
            onClick={handleSubmit}
            className="ml-3 flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700"
          >
            <Save size={16} />
            Kaydet
          </button>
        </div>
      </div>
    </div>
  );
};

export default HbCodeEditModal; 