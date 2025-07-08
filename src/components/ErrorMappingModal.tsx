import React, { useState, useEffect } from 'react';
import { X, Save, AlertTriangle } from 'lucide-react';
import { ErrorMapping, POSProvider, ErrorCategory, HBErrorCode } from '../types';
import { posErrorService } from '../services/posErrorService';
import { Combobox, ComboboxOption } from './ui/combobox';

interface ErrorMappingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (mapping: ErrorMapping) => void;
  mapping?: ErrorMapping | null;
  providers: POSProvider[];
  categories: ErrorCategory[];
  hbErrorCodes: HBErrorCode[];
  currentProvider?: POSProvider | null;
  context: 'direct' | 'provider';
}

const ErrorMappingModal: React.FC<ErrorMappingModalProps> = ({
  isOpen,
  onClose,
  onSave,
  mapping,
  providers,
  categories,
  hbErrorCodes,
  currentProvider,
  context,
}) => {
  const [formData, setFormData] = useState({
    posProviderId: '',
    providerErrorCode: '',
    providerErrorMessage: '',
    hbErrorCodeId: null as string | null,
    userFriendlyMessage: '',
    categoryId: '',
    severity: 'medium' as const,
    internalNotes: '',
    isActive: true
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (mapping) {
      setFormData({
        posProviderId: mapping.posProviderId,
        providerErrorCode: mapping.providerErrorCode || '',
        providerErrorMessage: mapping.providerErrorMessage || '',
        hbErrorCodeId: mapping.hbErrorCodeId || null,
        userFriendlyMessage: mapping.userFriendlyMessage,
        categoryId: mapping.categoryId,
        severity: mapping.severity,
        internalNotes: mapping.internalNotes || '',
        isActive: mapping.isActive
      });
    } else {
      setFormData({
        posProviderId: currentProvider?.id || '',
        providerErrorCode: '',
        providerErrorMessage: '',
        hbErrorCodeId: null,
        userFriendlyMessage: '',
        categoryId: '',
        severity: 'medium',
        internalNotes: '',
        isActive: true
      });
    }
    setErrors({});
  }, [mapping, isOpen, currentProvider]);

  const availableProviders = providers.filter(provider => {
    const providerCode = provider.code.toLowerCase();
    if (context === 'provider') {
      return ['craftgate', 'payten'].includes(providerCode);
    }
    if (context === 'direct') {
      return ['hepsipay', 'wallet', 'paygate'].includes(providerCode);
    }
    return false;
  });

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.posProviderId) newErrors.posProviderId = 'POS sistemi seçimi zorunludur';
    if (!formData.providerErrorCode) newErrors.providerErrorCode = 'Hata kodu zorunludur';
    if (!formData.userFriendlyMessage) newErrors.userFriendlyMessage = 'Kullanıcı mesajı zorunludur';
    if (!formData.categoryId) newErrors.categoryId = 'Kategori seçimi zorunludur';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (Object.keys(errors).length > 0) {
      setErrors(prev => ({ ...prev, form: 'Lütfen tüm alanları doldurun' }));
      return;
    }

    setLoading(true);
    
    // Construct the mapping object based on formData
    const submissionData: ErrorMapping = {
      id: mapping?.id || `mapping-${Date.now()}`,
      posProviderId: formData.posProviderId,
      providerErrorCode: formData.providerErrorCode,
      providerErrorMessage: formData.providerErrorMessage,
      hbErrorCodeId: formData.hbErrorCodeId,
      userFriendlyMessage: formData.userFriendlyMessage,
      categoryId: formData.categoryId,
      internalNotes: formData.internalNotes,
      isActive: formData.isActive,
    };

    try {
      // Here you would typically call an API
      // For now, we'll just use the onSave callback
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
            {mapping ? 'Hata Mapping Düzenle' : 'Yeni Hata Mapping'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {errors.general && (
            <div className="flex items-center p-4 bg-red-50 border border-red-200 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
              <span className="text-red-700">{errors.general}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* POS Provider */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                POS Sistemi *
              </label>
              <select
                value={formData.posProviderId}
                onChange={(e) => setFormData(prev => ({ ...prev, posProviderId: e.target.value }))}
                disabled={!!mapping || !!currentProvider}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed ${
                  errors.posProviderId ? 'border-red-300' : 'border-gray-300'
                }`}
              >
                <option value="">Seçiniz...</option>
                {availableProviders.map(provider => (
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
                value={formData.providerErrorCode}
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

          {/* Original Error Message */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Orijinal Hata Mesajı
            </label>
            <input
              type="text"
              value={formData.providerErrorMessage}
              onChange={(e) => setFormData(prev => ({ ...prev, providerErrorMessage: e.target.value }))}
              placeholder="POS sisteminden gelen orijinal mesaj"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* User Friendly Message */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Kullanıcı Dostu Mesaj *
            </label>
            <textarea
              value={formData.userFriendlyMessage}
              onChange={(e) => setFormData(prev => ({ ...prev, userFriendlyMessage: e.target.value }))}
              placeholder="Son kullanıcıya gösterilecek anlaşılır mesaj"
              rows={3}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.userFriendlyMessage ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {errors.userFriendlyMessage && (
              <p className="mt-1 text-sm text-red-600">{errors.userFriendlyMessage}</p>
            )}
          </div>

          {/* HB Error Code Mapping - Only show for provider-specific error mapping context */}
          {context === 'provider' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                HB Kodu Eşleştir
              </label>
              <Combobox
                options={[{ value: '', label: 'Eşleştirme Yok' }, ...hbErrorCodes.map(code => ({
                  value: code.id,
                  label: `${code.hbErrorCode} - ${code.hbErrorMessage}`
                }))]}
                value={formData.hbErrorCodeId || ''}
                onChange={(value) => setFormData(prev => ({ ...prev, hbErrorCodeId: value || null }))}
                placeholder="Bir HB kodu seçin veya arayın..."
                searchPlaceholder="Kod veya mesaj arayın..."
                noResultsMessage="Sonuç bulunamadı."
              />
              <p className="mt-1 text-sm text-gray-500">
                Provider hatasını standart bir HB hatası ile eşleştirebilirsiniz.
              </p>
            </div>
          )}

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Kategori *
            </label>
            <select
              value={formData.categoryId}
              onChange={(e) => setFormData(prev => ({ ...prev, categoryId: e.target.value }))}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.categoryId ? 'border-red-300' : 'border-gray-300'
              }`}
            >
              <option value="">Seçiniz...</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            {errors.categoryId && (
              <p className="mt-1 text-sm text-red-600">{errors.categoryId}</p>
            )}
          </div>

          {/* Internal Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              İç Notlar
            </label>
            <textarea
              value={formData.internalNotes}
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
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <Save className="h-4 w-4" />
              )}
              {mapping ? 'Güncelle' : 'Kaydet'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ErrorMappingModal; 