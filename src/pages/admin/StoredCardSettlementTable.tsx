import { useState, useEffect, Fragment } from 'react';
import { Download, Check, Filter, ChevronDown, ChevronUp } from 'lucide-react';
import { format, subMonths } from 'date-fns';
import toast from 'react-hot-toast';
import { exportToExcel } from '../../utils/exportToExcel';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Badge } from '../../components/ui/badge';
import StoredCardMonthlyTable from './StoredCardMonthlyTable'; // Detayları göstermek için

// Örnek veri üreteci (Mevcut haliyle bırakıldı)
const generateStoredCardSettlements = () => {
    const settlements = [];
    const today = new Date();
    for (let i = 0; i < 6; i++) {
        const date = subMonths(today, i);
        const monthStr = format(date, 'yyyy-MM');
        const merchantCount = Math.floor(Math.random() * 11) + 5;
        for (let j = 0; j < merchantCount; j++) {
            const merchantId = `M${1000 + j}`;
            const paymentAmount = Math.random() * 50000 + 5000;
            const netAmount = paymentAmount - (paymentAmount * 0.15);
            settlements.push({
                id: `HAK-SC-${monthStr}-${merchantId}`,
                settlementDate: monthStr,
                merchant: {
                    merchantNumber: merchantId,
                    merchantName: `Üye İşyeri ${merchantId}`,
                    title: `${merchantId} Ticaret A.Ş.`,
                    merchantType: Math.random() > 0.5 ? 'SME' : 'KA',
                    iban: `TR${Math.floor(Math.random() * 10000000000000000)}`
                },
                totalPaymentAmount: paymentAmount,
                totalPaymentCount: Math.floor(Math.random() * 200) + 50,
                totalRefundAmount: paymentAmount * 0.15,
                totalRefundCount: Math.floor(Math.random() * 20),
                totalNetAmount: netAmount,
                totalCommissionAmount: netAmount * (0.015 + (Math.random() * 0.01)),
                revenueCollected: Math.random() > 0.4,
                collectionDate: Math.random() > 0.4 ? format(subMonths(date, -1), 'yyyy-MM-dd') : null
            });
        }
    }
    return settlements;
};


export default function StoredCardSettlementTable() {
  const [settlements, setSettlements] = useState(generateStoredCardSettlements());
  const [filteredSettlements, setFilteredSettlements] = useState(settlements);
  const [selectedMonth, setSelectedMonth] = useState(format(new Date(), 'yyyy-MM'));
  const [filterStatus, setFilterStatus] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [openRowId, setOpenRowId] = useState<string | null>(null);
  
  const location = useLocation();
  const navigate = useNavigate();
  
  // ... (useEffect, applyFilters, handleFilterChange, getLastSixMonths, handleExportExcel, handleRevenueApproval fonksiyonları aynı kalır)
    const handleRevenueApproval = (settlementId: string) => {
    setSettlements(prev => 
      prev.map(s => s.id === settlementId 
        ? { ...s, revenueCollected: true, collectionDate: format(new Date(), 'yyyy-MM-dd') } 
        : s
      )
    );
    toast.success('Alacak onayı verildi');
  };

  const getLastSixMonths = () => {
    const today = new Date();
    const months = [];
    for (let i = 0; i < 6; i++) {
      const date = subMonths(today, i);
      months.push({
        value: format(date, 'yyyy-MM'),
        label: format(date, 'MMMM yyyy')
      });
    }
    return months;
  };

  const handleExportExcel = () => {
     // ...
  }

  const toggleRow = (id: string) => {
    setOpenRowId(prevId => (prevId === id ? null : id));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Saklı Kart Hakedişleri</CardTitle>
            <div className="flex items-center gap-2">
               <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                <SelectTrigger className="w-[240px]">
                  <SelectValue placeholder="Ay Seçin" />
                </SelectTrigger>
                <SelectContent>
                  {getLastSixMonths().map(month => (
                    <SelectItem key={month.value} value={month.value}>{month.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon" onClick={() => setShowFilters(!showFilters)}>
                <Filter className="h-4 w-4" />
              </Button>
              <Button onClick={handleExportExcel}>
                <Download className="h-4 w-4 mr-2" />
                Excel'e Aktar
              </Button>
            </div>
          </div>
        </CardHeader>
        {showFilters && (
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger><SelectValue placeholder="Tahsilat Durumu" /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Tüm Tahsilat Durumları</SelectItem>
                        <SelectItem value="pending">Bekleyenler</SelectItem>
                        <SelectItem value="collected">Tahsil Edilenler</SelectItem>
                    </SelectContent>
                </Select>
                <Button onClick={() => { /* handleFilterChange() */ }}>Filtrele</Button>
            </div>
          </CardContent>
        )}
      </Card>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]"></TableHead>
                <TableHead>Üye İşyeri</TableHead>
                <TableHead>İşlem Sayısı</TableHead>
                <TableHead className="text-right">Net Tutar</TableHead>
                <TableHead className="text-right">Komisyon Tutarı</TableHead>
                <TableHead className="text-center">Gelir Tahsilat</TableHead>
                <TableHead className="text-center">İşlemler</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSettlements.filter(s => s.settlementDate === selectedMonth).map((settlement) => (
                <Fragment key={settlement.id}>
                  <TableRow className="cursor-pointer" onClick={() => toggleRow(settlement.id)}>
                    <TableCell>
                      <Button variant="ghost" size="icon">
                        {openRowId === settlement.id ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                      </Button>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{settlement.merchant.merchantName}</div>
                      <div className="text-sm text-muted-foreground">{settlement.merchant.merchantNumber}</div>
                    </TableCell>
                    <TableCell>{settlement.totalPaymentCount}</TableCell>
                    <TableCell className="text-right font-medium">
                      {settlement.totalNetAmount.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                        {settlement.totalCommissionAmount.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant={settlement.revenueCollected ? 'default' : 'secondary'}>
                        {settlement.revenueCollected ? 'Edildi' : 'Bekliyor'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      {!settlement.revenueCollected && (
                        <Button size="sm" onClick={(e) => { e.stopPropagation(); handleRevenueApproval(settlement.id); }}>
                          <Check className="h-4 w-4 mr-2" />
                          Onay Ver
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                  {openRowId === settlement.id && (
                    <TableRow>
                      <TableCell colSpan={7} className="p-0">
                         <div className="p-4 bg-gray-50">
                           <StoredCardMonthlyTable settlementId={settlement.id} />
                         </div>
                      </TableCell>
                    </TableRow>
                  )}
                </Fragment>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
