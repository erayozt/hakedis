import React, { useState, useEffect } from 'react';
import { X, Save, AlertTriangle } from 'lucide-react';
import { ErrorMapping, POSProvider, ErrorCategory, HBErrorCode } from '../types';
import { Combobox } from './ui/combobox';

interface ErrorMappingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (mapping: ErrorMapping) => void;
  mapping?: Partial<ErrorMapping> | null; // Allow partial mapping for new entries
  providers: POSProvider[];
  categories: ErrorCategory[];
  hbErrorCodes: HBErrorCode[];
}

const ErrorMappingModal: React.FC<ErrorMappingModalProps> = ({
  isOpen,
  onClose,
  onSave,
  mapping,
  providers,
  categories,
  hbErrorCodes,
}) => {
  const [formData, setFormData] = useState<Partial<ErrorMapping>>({
    posProviderId: '',
    providerErrorCode: '',
    providerErrorMessage: '',
    hbErrorCodeId: null,
    userFriendlyMessage: '', // Bu alan HB Kodundan gelecek, burada yönetilmeyecek
    categoryId: '', // Bu alan da HB kodundan gelecek
    internalNotes: '',
    isActive: true,
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (isOpen) {
      if (mapping) {
        setFormData({
          id: mapping.id,
          posProviderId: mapping.posProviderId || '',
          providerErrorCode: mapping.providerErrorCode || '',
          providerErrorMessage: mapping.providerErrorMessage || '',
          hbErrorCodeId: mapping.hbErrorCodeId || null,
          isActive: mapping.isActive !== undefined ? mapping.isActive : true,
          internalNotes: mapping.internalNotes || ''
        });
      } else {
        // Reset for a completely new entry if needed (though current logic handles this via mapping prop)
        setFormData({
            posProviderId: '',
            providerErrorCode: '',
            providerErrorMessage: '',
            hbErrorCodeId: null,
            isActive: true,
            internalNotes: ''
        });
      }
      setErrors({});
    }
  }, [mapping, isOpen]);
  
  const selectedHbCode = hbErrorCodes.find(c => c.id === (mapping?.hbErrorCodeId || formData.hbErrorCodeId));

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.posProviderId) newErrors.posProviderId = 'POS sistemi seçimi zorunludur';
    if (!formData.providerErrorCode) newErrors.providerErrorCode = 'Hata kodu zorunludur';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
        return;
    }

    setLoading(true);
    
    // Construct the final mapping object
    const submissionData: ErrorMapping = {
      id: formData.id || `map-${Date.now()}`,
      posProviderId: formData.posProviderId!,
      providerErrorCode: formData.providerErrorCode!,
      providerErrorMessage: formData.providerErrorMessage || '',
      hbErrorCodeId: selectedHbCode!.id,
      userFriendlyMessage: selectedHbCode!.hbErrorMessage,
      categoryId: selectedHbCode!.categoryId,
      internalNotes: formData.internalNotes || '',
      isActive: formData.isActive !== undefined ? formData.isActive : true,
      // Add dummy data for missing fields to satisfy the type
      createdAt: mapping?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: (mapping as any)?.createdBy || 'frontend-user',
      lastModifiedBy: 'frontend-user',
    };

    try {
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call
      onSave(submissionData);
      onClose();
    } catch (error) {
      console.error("Failed to save mapping:", error);
      setErrors(prev => ({ ...prev, form: 'Kaydetme işlemi sırasında bir hata oluştu.' }));
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            {mapping?.id ? 'Eşleştirmeyi Düzenle' : 'Yeni Eşleştirme Yap'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Linked HB Code Info */}
          {selectedHbCode && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg space-y-2">
              <h3 className="text-sm font-semibold text-blue-800">Eşleştirilecek Ana Hata Kodu</h3>
              <p className="text-blue-700 font-mono">
                <span className="font-bold">{selectedHbCode.hbErrorCode}:</span> {selectedHbCode.hbErrorMessage}
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* POS Provider */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                POS Sistemi *
              </label>
              <select
                value={formData.posProviderId || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, posProviderId: e.target.value }))}
                disabled={!!formData.id} // Sadece ID'si olan (mevcut) kayıtlarda pasif yap
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed ${
                  errors.posProviderId ? 'border-red-300' : 'border-gray-300'
                }`}
              >
                <option value="">Seçiniz...</option>
                {providers.map(provider => (
                  <option key={provider.id} value={provider.id}>
                    {provider.name}
                  </option>
                ))}
              </select>
              {errors.posProviderId && (
                <p className="mt-1 text-sm text-red-600">{errors.posProviderId}</p>
              )}
            </div>

            {/* Error Code */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hata Kodu *
              </label>
              <input
                type="text"
                value={formData.providerErrorCode || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, providerErrorCode: e.target.value }))}
                placeholder="örn: 1501, 1520"
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.providerErrorCode ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.providerErrorCode && (
                <p className="mt-1 text-sm text-red-600">{errors.providerErrorCode}</p>
              )}
            </div>
          </div>

          {/* Internal Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              İç Notlar
            </label>
            <textarea
              value={formData.internalNotes || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, internalNotes: e.target.value }))}
              placeholder="Dahili notlar ve açıklamalar"
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Is Active - Switch Button */}
          <div>
            <label className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Durum</span>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, isActive: !prev.isActive }))}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                    formData.isActive ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      formData.isActive ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
                <span className="ml-3 text-sm text-gray-600">
                  {formData.isActive ? 'Aktif' : 'Pasif'}
                </span>
              </div>
            </label>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-6 border-t">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50"
            >
              İptal
            </button>
            <button
              type="submit"
              disabled={loading || !selectedHbCode}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <Save className="h-4 w-4" />
              )}
              {mapping?.id ? 'Güncelle' : 'Kaydet'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ErrorMappingModal; 