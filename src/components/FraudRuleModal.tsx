import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Combobox } from './ui/combobox';
import { FraudRule, FraudRuleParameter, FraudRuleOperator, FraudRuleAction, FraudRuleValue, Merchant } from '../../types';
import { mockDataService } from '../services/mockDataService';
import toast from 'react-hot-toast';

interface FraudRuleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (rule: Omit<FraudRule, 'id' | 'createdAt' | 'updatedAt'>) => void;
  editingRule?: FraudRule | null;
}

const parameterLabels: Record<FraudRuleParameter, string> = {
  amount: 'İşlem Tutarı',
  cardType: 'Kart Tipi',
  cardCountry: 'Kart Ülkesi',
  hourOfDay: 'İşlem Saati',
  ipAddress: 'IP Adresi',
  uniqueDeviceId: 'Benzersiz Cihaz ID',
};

const operatorLabels: Record<FraudRuleOperator, string> = {
  '<': 'Küçüktür',
  '<=': 'Küçük Eşittir',
  '==': 'Eşittir',
  '>=': 'Büyük Eşittir',
  '>': 'Büyüktür',
  'in': 'İçerir',
  'notIn': 'İçermez',
  'is': 'Evet',
  'isNot': 'Hayır',
  'between': 'Arasındadır',
};

const actionLabels: Record<FraudRuleAction, string> = {
  'force_3d': '3D Secure Yönlendir',
  'process_non_3d': '3D Secure Olmadan İşle',
  'reject': 'İşlemi Reddet',
};

const getOperatorsForParameter = (param: FraudRuleParameter): FraudRuleOperator[] => {
  switch (param) {
    case 'amount':
      return ['<', '<=', '==', '>=', '>'];
    case 'cardType':
    case 'cardCountry':
    case 'ipAddress':
    case 'uniqueDeviceId':
      return ['in', 'notIn'];
    case 'hourOfDay':
      return ['between'];
    default:
      return [];
  }
};

const initialFormData = {
  merchantId: '',
  parameter: 'amount' as FraudRuleParameter,
  operator: '>' as FraudRuleOperator,
  value: '' as any,
  action: 'force_3d' as FraudRuleAction,
  isActive: true,
};

const FraudRuleModal: React.FC<FraudRuleModalProps> = ({ isOpen, onClose, onSave, editingRule }) => {
  const [formData, setFormData] = useState(initialFormData);
  const allMerchants = mockDataService.getMerchants();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const merchantOptions = [
    { value: 'all', label: 'Tüm Üye İşyerleri' },
    ...allMerchants.map(m => ({ value: m.id, label: `${m.merchantName} (${m.merchantNumber})` }))
  ];
  
  const getMerchantById = (id: string): Merchant | undefined => allMerchants.find(m => m.id === id);

  useEffect(() => {
    if (isOpen) {
      if (editingRule) {
        setFormData({
          merchantId: editingRule.merchantId,
          parameter: editingRule.parameter,
          operator: editingRule.operator,
          value: editingRule.value,
          action: editingRule.action,
          isActive: editingRule.isActive,
        });
      } else {
        setFormData(initialFormData);
      }
      setErrors({});
    }
  }, [editingRule, isOpen]);

  const handleParameterChange = (newParameter: FraudRuleParameter) => {
    const availableOperators = getOperatorsForParameter(newParameter);
    const newOperator = availableOperators[0];
    let initialValue: any = '';
    if (newParameter === 'hourOfDay') {
      initialValue = { start: '00:00', end: '23:59' };
    } else if (['cardType', 'cardCountry', 'ipAddress', 'uniqueDeviceId'].includes(newParameter)) {
      initialValue = [];
    }
    
    setFormData(prev => ({
      ...prev,
      parameter: newParameter,
      operator: newOperator,
      value: initialValue,
    }));
  };
  
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.merchantId) newErrors.merchantId = 'Üye işyeri seçimi zorunludur';

    switch (formData.parameter) {
        case 'amount':
            if (!formData.value || isNaN(Number(formData.value)) || Number(formData.value) <= 0) {
                newErrors.value = 'Geçerli bir pozitif sayı giriniz';
            }
            break;
        case 'cardType':
        case 'cardCountry':
        case 'ipAddress':
        case 'uniqueDeviceId':
            if (!Array.isArray(formData.value) || formData.value.length === 0) {
                newErrors.value = 'En az bir değer girmelisiniz.';
            }
            break;
        case 'hourOfDay':
            const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
            if (!formData.value.start || !timeRegex.test(formData.value.start)) {
                newErrors.value_start = 'Geçerli bir başlangıç saati girin (HH:MM)';
            }
            if (!formData.value.end || !timeRegex.test(formData.value.end)) {
                newErrors.value_end = 'Geçerli bir bitiş saati girin (HH:MM)';
            }
            break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
};

const handleSave = () => {
    if (!validateForm()) {
        toast.error("Lütfen formdaki hataları düzeltin.");
        return;
    }

    let finalValue: FraudRuleValue = formData.value;
    if (formData.parameter === 'amount') {
        finalValue = Number(formData.value);
    } else if (['ipAddress', 'uniqueDeviceId', 'cardCountry'].includes(formData.parameter) && typeof formData.value === 'string') {
        finalValue = formData.value.split(',').map(s => s.trim()).filter(Boolean);
    }

    const ruleData: Omit<FraudRule, 'id' | 'createdAt' | 'updatedAt'> = { ...formData, value: finalValue };

    onSave(ruleData);
    onClose();
};

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };
  
  const renderValueInput = () => {
    const commonProps = {
        className: errors.value ? 'border-red-500' : '',
    };
    
    switch (formData.parameter) {
      case 'amount':
        return (
          <div>
            <Label htmlFor="value">Değer (TL)</Label>
            <Input id="value" type="number" min="0" step="0.01" placeholder="Örn: 1000"
                   value={formData.value} onChange={(e) => handleInputChange('value', e.target.value)} {...commonProps} />
            {errors.value && <p className="text-sm text-red-500 mt-1">{errors.value}</p>}
          </div>
        );
      case 'cardType':
        const cardTypeOptions = [ { value: 'debit', label: 'Debit Kart' }, { value: 'credit', label: 'Kredi Kartı' }, { value: 'prepaid', label: 'Ön Ödemeli Kart' } ];
        return (
          <div>
            <Label>Kart Tipleri</Label>
             <Combobox multiple options={cardTypeOptions} value={formData.value} onChange={(v) => handleInputChange('value', v)} 
                       placeholder="Kart tipi seçin" searchPlaceholder="Tip ara..." noResultsMessage="Bulunamadı" {...commonProps}/>
            {errors.value && <p className="text-sm text-red-500 mt-1">{errors.value}</p>}
          </div>
        );
       case 'cardCountry':
       case 'ipAddress':
       case 'uniqueDeviceId':
            const labels = { cardCountry: 'Kart Ülkesi (ISO 3166-1 alpha-2)', ipAddress: 'IP Adresleri', uniqueDeviceId: 'Cihaz IDleri' };
            const placeholders = { cardCountry: 'Örn: TR, US, DE', ipAddress: 'Örn: 192.168.1.1, 10.0.0.5', uniqueDeviceId: 'Örn: device123, device-abc' };
            return (
              <div>
                <Label htmlFor="value">{labels[formData.parameter]}</Label>
                <Input id="value" placeholder={`${placeholders[formData.parameter]} (virgülle ayırın)`}
                       value={Array.isArray(formData.value) ? formData.value.join(', ') : formData.value}
                       onChange={(e) => handleInputChange('value', e.target.value)} {...commonProps} />
                {errors.value && <p className="text-sm text-red-500 mt-1">{errors.value}</p>}
              </div>
            );
      case 'hourOfDay':
        return (
          <div className="grid grid-cols-2 gap-4 items-center">
            <div>
              <Label htmlFor="value_start">Başlangıç Saati</Label>
              <Input id="value_start" type="time" value={formData.value.start} onChange={(e) => handleInputChange('value', { ...formData.value, start: e.target.value })} 
                     className={errors.value_start ? 'border-red-500' : ''}/>
               {errors.value_start && <p className="text-sm text-red-500 mt-1">{errors.value_start}</p>}
            </div>
            <div>
              <Label htmlFor="value_end">Bitiş Saati</Label>
              <Input id="value_end" type="time" value={formData.value.end} onChange={(e) => handleInputChange('value', { ...formData.value, end: e.target.value })}
                     className={errors.value_end ? 'border-red-500' : ''} />
               {errors.value_end && <p className="text-sm text-red-500 mt-1">{errors.value_end}</p>}
            </div>
          </div>
        );
      default: return null;
    }
  };
  
  const renderRuleSummary = () => {
      const merchant = formData.merchantId === 'all' ? 'Tüm Üye İşyerleri' : getMerchantById(formData.merchantId)?.merchantName || '[Seçiniz]';
      const parameter = parameterLabels[formData.parameter].toLowerCase();
      const operator = operatorLabels[formData.operator];
      let valueText = '';
      
      switch(formData.parameter) {
          case 'amount':
            valueText = `${formData.value || '[değer]'} TL`;
            break;
          case 'cardType':
          case 'cardCountry':
          case 'ipAddress':
          case 'uniqueDeviceId':
            valueText = `[${(Array.isArray(formData.value) && formData.value.length > 0) ? formData.value.join(', ') : '...'}] listesini`;
            break;
          case 'hourOfDay':
            valueText = `${formData.value.start || '[başlangıç]'} ve ${formData.value.end || '[bitiş]'} saatleri`;
            break;
          default:
            valueText = `[değer]`;
      }
      
      return (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
            <h4 className="font-medium text-blue-900 mb-2">Kural Özeti:</h4>
            <div className="text-sm text-blue-800 space-y-1">
                <p><strong>Üye İşyeri:</strong> {merchant}</p>
                <p>
                   Eğer <strong>{parameter}</strong>, <strong>{valueText}</strong> {operator} ise,
                   işlem <strong>{actionLabels[formData.action]}</strong> aksiyonu ile sonuçlanacaktır.
                </p>
            </div>
        </div>
      )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{editingRule ? 'Kuralı Düzenle' : 'Yeni Fraud Kuralı Ekle'}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4 max-h-[70vh] overflow-y-auto pr-2">
          <div className="space-y-2">
            <Label htmlFor="merchantId">Üye İşyeri</Label>
            <Combobox options={merchantOptions} value={formData.merchantId} onChange={(v) => handleInputChange('merchantId', v)}
                      placeholder="İşyeri veya genel kural seçin" searchPlaceholder="İşyeri ara..." noResultsMessage="Bulunamadı"
                      className={errors.merchantId ? 'border-red-500' : ''}/>
            {errors.merchantId && <p className="text-sm text-red-500">{errors.merchantId}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="parameter">Kural Parametresi</Label>
            <Select value={formData.parameter} onValueChange={(v) => handleParameterChange(v as FraudRuleParameter)}>
              <SelectTrigger><SelectValue/></SelectTrigger>
              <SelectContent>
                {Object.entries(parameterLabels).map(([key, label]) => (
                  <SelectItem key={key} value={key}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="operator">Koşul</Label>
                <Select value={formData.operator} onValueChange={(v) => handleInputChange('operator', v as FraudRuleOperator)}>
                  <SelectTrigger><SelectValue/></SelectTrigger>
                  <SelectContent>
                    {getOperatorsForParameter(formData.parameter).map(op => (
                      <SelectItem key={op} value={op}>{operatorLabels[op]}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 md:col-span-1">{renderValueInput()}</div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="action">Aksiyon</Label>
            <Select value={formData.action} onValueChange={(v) => handleInputChange('action', v as FraudRuleAction)}>
              <SelectTrigger><SelectValue/></SelectTrigger>
              <SelectContent>
                {Object.entries(actionLabels).map(([key, label]) => (
                  <SelectItem key={key} value={key}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {renderRuleSummary()}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>İptal</Button>
          <Button onClick={handleSave}>{editingRule ? 'Değişiklikleri Kaydet' : 'Kural Oluştur'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FraudRuleModal;
