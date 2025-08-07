import { useState, useMemo } from 'react';
import { Download, Eye, Search } from 'lucide-react';
import { format, subDays, addDays, startOfDay } from 'date-fns';
import toast from 'react-hot-toast';
import { exportToExcel } from '../../utils/exportToExcel';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Badge } from '../../components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose, DialogDescription } from '../../components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import WalletDailyTable from './WalletDailyTable'; 
import PaymentApprovalDashboard from './PaymentApprovalDashboard';

// Bu veri üreteci artık sadece Günlük Hakediş Raporu tarafından kullanılacak
const generateWalletSettlements = () => {
  const settlements = [];
  const today = new Date();
  for (let i = 0; i < 30; i++) {
    const date = subDays(today, i);
    const dateStr = format(date, 'yyyy-MM-dd');
    const merchantCount = Math.floor(Math.random() * 6) + 5;
    for (let j = 0; j < merchantCount; j++) {
      const merchantId = `M${11041 + j}`; // PaymentApprovalDashboard ile tutarlı ID'ler
      const paymentAmount = Math.random() * 10000 + 1000;
      const paymentCount = Math.floor(Math.random() * 50) + 10;
      const refundAmount = Math.random() * paymentAmount * 0.2;
      const refundCount = Math.floor(Math.random() * 5);
      const netAmount = paymentAmount - refundAmount;
      const commissionRate = 0.015 + (Math.random() * 0.01);
      const commissionAmount = netAmount * commissionRate;
      const confirmation = Math.random() > 0.5;

      settlements.push({
        id: `HAK-${dateStr}-${merchantId}`,
        settlementDate: dateStr,
        merchant: {
          merchantNumber: merchantId,
          merchantName: `Üye İşyeri ${merchantId}`,
          title: `${merchantId} Ticaret A.Ş.`,
          merchantType: Math.random() > 0.5 ? 'SME' : 'KA',
          iban: `TR${Math.floor(Math.random() * 10000000000000000)}`
        },
        totalPaymentAmount: paymentAmount,
        totalPaymentCount: paymentCount,
        totalRefundAmount: refundAmount,
        totalRefundCount: refundCount,
        totalNetAmount: netAmount,
        tahakkuk: confirmation,
        tahakkukTarihi: confirmation ? format(addDays(date, 1), 'yyyy-MM-dd') : null,
        valorDay: Math.floor(Math.random() * 3) + 1,
        commissionRate: commissionRate,
        bsmv: 0.05,
        totalCommissionAmount: commissionAmount,
      });
    }
  }
  return settlements;
};

// Tüm hakediş verisini bir state'te tutalım ki her iki component de erişebilsin
const allSettlementsData = generateWalletSettlements();

type Settlement = typeof allSettlementsData[0];

interface DailySettlementReportProps {
  settlements: Settlement[];
  onShowDetails: (settlement: Settlement) => void;
}

const DailySettlementReport = ({ settlements, onShowDetails }: DailySettlementReportProps) => {
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  
  const getLastThirtyDays = () => {
    const today = new Date();
    const days = [];
    for (let i = 0; i < 30; i++) {
      const date = subDays(today, i);
      days.push({
        value: format(date, 'yyyy-MM-dd'),
        label: format(date, 'dd MMMM yyyy')
      });
    }
    return days;
  };

  const handleExportExcel = () => {
      toast.success('Excel dosyası başarıyla indirildi');
  }

  const dailySettlements = settlements.filter(s => s.settlementDate === selectedDate);

  return (
    <div className="space-y-6">
       <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Günlük Hakediş Raporu</CardTitle>
            <div className="flex items-center gap-2">
              <Select value={selectedDate} onValueChange={setSelectedDate}>
                <SelectTrigger className="w-[240px]">
                  <SelectValue placeholder="Tarih Seçin" />
                </SelectTrigger>
                <SelectContent>
                  {getLastThirtyDays().map(day => (
                    <SelectItem key={day.value} value={day.value}>{day.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button onClick={handleExportExcel}>
                <Download className="h-4 w-4 mr-2" />
                Excel'e Aktar
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                 <TableRow>
                  <TableHead>Hak Ediş ID</TableHead>
                  <TableHead>Üye İş Yeri</TableHead>
                  <TableHead>Ünvan</TableHead>
                  <TableHead>IBAN</TableHead>
                  <TableHead>Hak Ediş Tarihi</TableHead>
                  <TableHead className="text-right">Net Tutar</TableHead>
                  <TableHead className="text-center">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dailySettlements.map((settlement) => (
                  <TableRow key={settlement.id}>
                    <TableCell className="font-mono text-xs">{settlement.id}</TableCell>
                    <TableCell>{settlement.merchant.merchantName}</TableCell>
                    <TableCell>{settlement.merchant.title}</TableCell>
                    <TableCell className="font-mono text-xs">{settlement.merchant.iban}</TableCell>
                    <TableCell>{format(new Date(settlement.settlementDate), 'dd.MM.yyyy')}</TableCell>
                    <TableCell className="text-right font-semibold">{settlement.totalNetAmount.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}</TableCell>
                    <TableCell className="text-center">
                      <Button variant="outline" size="sm" onClick={() => onShowDetails(settlement)}>
                        <Eye className="h-4 w-4 mr-2" />
                        İşlem Detayları
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function WalletSettlementPage() {
  const [activeTab, setActiveTab] = useState("payment-management");
  const [detailModalSettlement, setDetailModalSettlement] = useState<Settlement | null>(null);

  const handleShowDetails = (settlement: Settlement) => {
    setDetailModalSettlement(settlement);
  };
  
  const handleShowDailyDetailsFromApproval = (date: Date, merchantId: string) => {
     const targetDateStr = format(startOfDay(date), 'yyyy-MM-dd');
     const foundSettlement = allSettlementsData.find(s => 
        s.settlementDate === targetDateStr && s.merchant.merchantNumber === merchantId
     );

     if (foundSettlement) {
        setDetailModalSettlement(foundSettlement);
        setActiveTab('daily-report');
     } else {
        toast.error(`${format(date, 'dd.MM.yyyy')} tarihi için ${merchantId} ID'li hakediş detayı bulunamadı.`);
     }
  }

  return (
    <div className="p-4">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="payment-management">Ödeme Yönetimi</TabsTrigger>
          <TabsTrigger value="daily-report">Günlük Hakediş Raporu</TabsTrigger>
        </TabsList>
        <TabsContent value="payment-management">
          <PaymentApprovalDashboard onShowDailyDetails={handleShowDailyDetailsFromApproval} />
        </TabsContent>
        <TabsContent value="daily-report">
          <DailySettlementReport settlements={allSettlementsData} onShowDetails={handleShowDetails} />
        </TabsContent>
      </Tabs>

      {detailModalSettlement && (
          <Dialog open={!!detailModalSettlement} onOpenChange={(open) => !open && setDetailModalSettlement(null)}>
             <DialogContent className="max-w-none w-full h-full p-0">
                <DialogHeader className="p-6 pb-0">
                    <DialogTitle>Günlük İşlem Detayları: {detailModalSettlement.id}</DialogTitle>
                     <DialogDescription>
                        Bu ekranda seçilen hakedişe ait gün içindeki tüm işlem dökümünü görebilirsiniz.
                    </DialogDescription>
                </DialogHeader>
                <div className="overflow-y-auto px-6">
                    <WalletDailyTable settlementId={detailModalSettlement.id} />
                </div>
                <DialogFooter className="p-6 pt-0">
                    <DialogClose asChild>
                        <Button type="button" variant="secondary">
                            Kapat
                        </Button>
                    </DialogClose>
                </DialogFooter>
             </DialogContent>
          </Dialog>
      )}
    </div>
  );
}
