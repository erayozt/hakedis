import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { Combobox } from './ui/combobox';
import { FraudRule, FraudRuleParameter, FraudRuleOperator, FraudRuleAction, Merchant } from '../../types';
import { mockDataService } from '../services/mockDataService';

interface FraudRuleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (rule: Omit<FraudRule, 'id' | 'createdAt' | 'updatedAt'>) => void;
  editingRule?: FraudRule | null;
}

const operatorLabels: Record<FraudRuleOperator, string> = {
  '<': 'Küçüktür (<)',
  '<=': 'Küçük Eşittir (≤)',
  '==': 'Eşittir (=)',
  '>=': 'Büyük Eşittir (≥)',
  '>': 'Büyüktür (>)'
};

const actionLabels: Record<FraudRuleAction, string> = {
  'force_3d': '3D Secure Yönlendir',
  'process_non_3d': '3D Secure Olmadan İşle',
  'reject': 'İşlemi Reddet'
};

const FraudRuleModal: React.FC<FraudRuleModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingRule
}) => {
  const [formData, setFormData] = useState({
    merchantId: '',
    parameter: 'amount' as FraudRuleParameter,
    operator: '>' as FraudRuleOperator,
    value: '',
    action: 'force_3d' as FraudRuleAction,
    reason: '',
    isActive: true
  });
  
  const allMerchants = mockDataService.getMerchants();
  
  // Merchant options for Combobox
  const merchantOptions = allMerchants.map(merchant => ({
    value: merchant.id,
    label: `${merchant.merchantName} (${merchant.merchantNumber})`
  }));

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (editingRule) {
      setFormData({
        merchantId: editingRule.merchantId,
        parameter: editingRule.parameter,
        operator: editingRule.operator,
        value: editingRule.value.toString(),
        action: editingRule.action,
        reason: editingRule.reason,
        isActive: editingRule.isActive
      });
    } else {
      setFormData({
        merchantId: '',
        parameter: 'amount',
        operator: '>',
        value: '',
        action: 'force_3d',
        reason: '',
        isActive: true
      });
    }
    setErrors({});
  }, [editingRule, isOpen]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.merchantId) {
      newErrors.merchantId = 'Üye işyeri seçimi zorunludur';
    }

    if (!formData.value || isNaN(Number(formData.value)) || Number(formData.value) <= 0) {
      newErrors.value = 'Geçerli bir pozitif sayı giriniz';
    }

    if (!formData.reason.trim()) {
      newErrors.reason = 'Gerekçe alanı zorunludur';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) return;

    const ruleData = {
      merchantId: formData.merchantId,
      parameter: formData.parameter,
      operator: formData.operator,
      value: Number(formData.value),
      action: formData.action,
      reason: formData.reason.trim(),
      isActive: formData.isActive
    };

    onSave(ruleData);
    onClose();
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {editingRule ? 'Kuralı Düzenle' : 'Yeni Fraud Kuralı Ekle'}
          </DialogTitle>
          <DialogDescription>
            Fraud kuralı {editingRule ? 'düzenleyin' : 'oluşturun'}.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Üye İşyeri Seçimi */}
          <div className="space-y-2">
            <Label htmlFor="merchantId">Üye İşyeri</Label>
            <div className={`${!!editingRule ? 'opacity-50 pointer-events-none' : ''}`}>
              <Combobox
                options={merchantOptions}
                value={formData.merchantId}
                onChange={(value) => handleInputChange('merchantId', value)}
                placeholder="Üye işyeri seçin"
                searchPlaceholder="İşyeri ara..."
                noResultsMessage="Eşleşen işyeri bulunamadı"
                className={errors.merchantId ? 'border-red-500' : ''}
              />
            </div>
            {!!editingRule && (
              <p className="text-xs text-gray-500">
                💡 Düzenleme modunda üye işyeri değiştirilemez
              </p>
            )}
            {errors.merchantId && <p className="text-sm text-red-500">{errors.merchantId}</p>}
          </div>

          {/* Parametre Seçimi */}
          <div className="space-y-2">
            <Label htmlFor="parameter">Parametre</Label>
            <Select
              value={formData.parameter}
              onValueChange={(value) => handleInputChange('parameter', value as FraudRuleParameter)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Parametre seçin" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="amount">İşlem Tutarı (TL)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Operatör ve Değer */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="operator">Karşılaştırma</Label>
              <Select
                value={formData.operator}
                onValueChange={(value) => handleInputChange('operator', value as FraudRuleOperator)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Operatör seçin" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(operatorLabels).map(([value, label]) => (
                    <SelectItem key={value} value={value}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="value">Değer (TL)</Label>
              <Input
                id="value"
                type="number"
                min="0"
                step="0.01"
                placeholder="Örn: 1000"
                value={formData.value}
                onChange={(e) => handleInputChange('value', e.target.value)}
                className={errors.value ? 'border-red-500' : ''}
              />
              {errors.value && <p className="text-sm text-red-500">{errors.value}</p>}
            </div>
          </div>

          {/* Aksiyon */}
          <div className="space-y-2">
            <Label htmlFor="action">Aksiyon</Label>
            <Select
              value={formData.action}
              onValueChange={(value) => handleInputChange('action', value as FraudRuleAction)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Aksiyon seçin" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(actionLabels).map(([value, label]) => (
                  <SelectItem key={value} value={value}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Gerekçe */}
          <div className="space-y-2">
            <Label htmlFor="reason">Gerekçe</Label>
            <Textarea
              id="reason"
              placeholder="Bu kuralın neden oluşturulduğunu açıklayın..."
              value={formData.reason}
              onChange={(e) => handleInputChange('reason', e.target.value)}
              className={errors.reason ? 'border-red-500' : ''}
              rows={3}
            />
            {errors.reason && <p className="text-sm text-red-500">{errors.reason}</p>}
          </div>

          {/* Kural Önizleme */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2">Kural Önizleme:</h4>
            <div className="text-sm text-blue-800 space-y-1">
              <p>
                <strong>Üye İşyeri:</strong> {formData.merchantId ? 
                  (() => {
                    const merchant = allMerchants.find(m => m.id === formData.merchantId);
                    return merchant ? `${merchant.merchantName} (${merchant.merchantNumber})` : '[Seçiniz]';
                  })() : '[Seçiniz]'
                }
              </p>
              <p>
                <strong>Kural:</strong> Eğer işlem tutarı <strong>{formData.value || '[değer]'} TL</strong> 
                {formData.operator === '<' && ' dan küçükse'}
                {formData.operator === '<=' && ' dan küçük veya eşitse'}
                {formData.operator === '==' && ' na eşitse'}
                {formData.operator === '>=' && ' dan büyük veya eşitse'}
                {formData.operator === '>' && ' dan büyükse'}
                , işlem <strong>{actionLabels[formData.action]}</strong> aksiyonu ile sonuçlanacaktır.
              </p>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            İptal
          </Button>
          <Button onClick={handleSave}>
            {editingRule ? 'Güncelle' : 'Kuralı Kaydet'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FraudRuleModal;