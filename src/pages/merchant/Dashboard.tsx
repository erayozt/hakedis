import { useState, useMemo } from 'react';
import { DateRange } from 'react-day-picker';
import { subDays, format, eachDayOfInterval, startOfDay, addDays, differenceInCalendarDays } from 'date-fns';
import { Calendar as CalendarIcon, DollarSign, CreditCard, CheckCircle, Wallet, FileText, Bell, TrendingUp, Shield, AlertTriangle, ChevronRight } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';

import { cn } from "../../lib/utils"
import { Button } from "../../components/ui/button"
import { Calendar } from "../../components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../components/ui/popover"
import { 
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { useNavigate } from "react-router-dom";

// Gelişmiş Mock Veri Servisi
const generateMockTransactions = (dateRange: DateRange) => {
  const transactions = [];
  const { from, to } = dateRange;
  if (!from || !to) return [];

  const diffDays = Math.ceil((to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24));
  const numTransactions = diffDays * (Math.floor(Math.random() * 500) + 1000);

  const banks = ['Garanti', 'Akbank', 'İş Bankası', 'Yapı Kredi', 'Ziraat', 'Halkbank', 'Vakıfbank'];
  const cardTypes = ['CREDIT', 'DEBIT', 'PREPAID'];
  const acquirers = ['Garanti POS', 'Akbank POS', 'İş Bankası POS'];
  
  const userPool = Array.from({ length: 1500 }, (_, i) => `user_${i}`);
  const errorCodes = [
    { code: '05', description: 'Onaylanmadı/Red' },
    { code: '51', description: 'Yetersiz Bakiye' },
    { code: '54', description: 'Vadesi Dolmuş Kart' },
    { code: '14', description: 'Geçersiz Kart' },
    { code: '01', description: 'Bankanızı Arayın' },
    { code: '57', description: 'İşlem Tipine İzin Yok' },
  ];

  for (let i = 0; i < numTransactions; i++) {
    const transactionDate = new Date(from.getTime() + Math.random() * (to.getTime() - from.getTime()));
    const isSuccess = Math.random() < 0.92;
    
    transactions.push({
      id: `txn_${i}`,
      date: transactionDate,
      amount: Math.random() * 1000 + 10,
      isSuccess,
      is3D: Math.random() > 0.3,
      isStoredCard: Math.random() > 0.4,
      isInstallment: Math.random() > 0.6,
      issuerBank: banks[Math.floor(Math.random() * banks.length)],
      acquirer: acquirers[Math.floor(Math.random() * acquirers.length)],
      cardType: cardTypes[Math.floor(Math.random() * cardTypes.length)],
      userId: userPool[Math.floor(Math.random() * userPool.length)],
      errorCode: isSuccess ? null : errorCodes[Math.floor(Math.random() * errorCodes.length)],
    });
  }
  return transactions;
};


export default function Dashboard() {
  const [date, setDate] = useState<DateRange | undefined>({
    from: subDays(new Date(), 29),
    to: new Date(),
  });
  const navigate = useNavigate();

  const mockData = useMemo(() => {
    if (date && date.from && date.to) {
      return generateMockTransactions(date);
    }
    return [];
  }, [date]);

  // Temel metrikler
  const baseMetrics = useMemo(() => {
    const totalTransactions = mockData.length;
    const successfulTransactions = mockData.filter(t => t.isSuccess);
    const totalVolume = successfulTransactions.reduce((sum, t) => sum + t.amount, 0);
    const successRate = totalTransactions > 0 ? (successfulTransactions.length / totalTransactions) * 100 : 0;
    const averageBasket = successfulTransactions.length > 0 ? totalVolume / successfulTransactions.length : 0;
    const uniqueUsers = new Set(mockData.map(t => t.userId)).size || 1;
    const frequency = successfulTransactions.length / uniqueUsers;
    return { totalVolume, totalTransactions, successRate, averageBasket, uniqueUsers, successfulOrders: successfulTransactions.length, frequency };
  }, [mockData]);

  // Günlük performans (başarı alan + ciro çizgisi)
  const dailyPerformanceData = useMemo(() => {
    if (!date || !date.from || !date.to) return [];
    const days = eachDayOfInterval({ start: date.from, end: date.to });
    return days.map(day => {
      const dayStart = startOfDay(day);
      const dayTransactions = mockData.filter(t => startOfDay(t.date).getTime() === dayStart.getTime());
      const successfulCount = dayTransactions.filter(t => t.isSuccess).length;
      const successRate = dayTransactions.length > 0 ? (successfulCount / dayTransactions.length) * 100 : 0;
      const successVolume = dayTransactions.filter(t => t.isSuccess).reduce((sum, t) => sum + t.amount, 0);
      return { date: format(day, 'MMM dd'), "Başarı Oranı": parseFloat(successRate.toFixed(1)), successVolume };
    });
  }, [mockData, date]);
  // Banka ve hata özetleri
  const analysis = useMemo(() => {
    const successRateByIssuer = mockData.reduce((acc, t) => {
      if (!acc[t.issuerBank]) {
        acc[t.issuerBank] = { total: 0, success: 0 };
      }
      acc[t.issuerBank].total++;
      if (t.isSuccess) {
        acc[t.issuerBank].success++;
      }
      return acc;
    }, {} as Record<string, { total: number; success: number }>);

    const formattedSuccessRate = Object.entries(successRateByIssuer).map(([bank, data]) => ({
      name: bank,
      "Başarı Oranı": data.total > 0 ? (data.success / data.total) * 100 : 0,
    })).sort((a, b) => b["Başarı Oranı"] - a["Başarı Oranı"]);
    
    const volumeByAcquirer = mockData.reduce((acc, t) => {
        if (t.isSuccess) {
            if (!acc[t.acquirer]) {
                acc[t.acquirer] = 0;
            }
            acc[t.acquirer] += t.amount;
        }
        return acc;
    }, {} as Record<string, number>);

    const formattedVolumeByAcquirer = Object.entries(volumeByAcquirer).map(([name, value]) => ({ name, value }));

    const errorCodes = mockData
      .filter(t => !t.isSuccess && t.errorCode)
      .reduce((acc, t) => {
        const code = t.errorCode!.code;
        const description = t.errorCode!.description;
        if (!acc[code]) {
          acc[code] = { count: 0, description };
        }
        acc[code].count++;
        return acc;
      }, {} as Record<string, { count: number, description: string }>);

    const formattedErrorCodes = Object.entries(errorCodes)
      .map(([code, data]) => ({ code, description: data.description, count: data.count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return { successRateByIssuer: formattedSuccessRate, volumeByAcquirer: formattedVolumeByAcquirer, errorCodes: formattedErrorCodes };
  }, [mockData]);

  // Finans KPI’ları (beklenen ödeme, ekstre durumu, hakediş özeti)
  const finance = useMemo(() => {
    const today = new Date();
    const expectedPaymentNextDay = Math.round(baseMetrics.totalVolume * 0.02);
    const expectedPaymentCount = Math.round(baseMetrics.totalTransactions * 0.01);
    const lastStatementAmount = Math.round(baseMetrics.totalVolume * 0.18);
    const statementIssueDate = subDays(today, 5);
    const statementDueDate = addDays(statementIssueDate, 10);
    const daysToDue = differenceInCalendarDays(statementDueDate, today);
    const walletSettlementAmount = Math.round(baseMetrics.totalVolume * 0.35);
    const storedCardSettlementAmount = Math.round(baseMetrics.totalVolume * 0.22);
    return { expectedPaymentNextDay, expectedPaymentCount, lastStatementAmount, statementDueDate, daysToDue, walletSettlementAmount, storedCardSettlementAmount };
  }, [baseMetrics]);

  // Operasyon ve risk özetleri
  const ops = useMemo(() => {
    const errorRate = 100 - baseMetrics.successRate;
    const topIssuer = analysis.successRateByIssuer[0]?.name || '-';
    const refundRate = Math.min(5, Math.max(0.5, (100 - baseMetrics.successRate) / 3));
    const chargebackCount = Math.round(baseMetrics.totalTransactions * 0.002);
    return { errorRate, topIssuer, refundRate, chargebackCount };
  }, [analysis.successRateByIssuer, baseMetrics]);

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Kontrol Paneli</h2>
        <div className="flex items-center space-x-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button id="date" variant={"outline"} className={cn("w-[300px] justify-start text-left font-normal",!date && "text-muted-foreground")}>
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date?.from ? (date.to ? (<>{format(date.from, "LLL dd, y")} - {format(date.to, "LLL dd, y")}</>) : (format(date.from, "LLL dd, y"))) : (<span>Tarih aralığı seçin</span>)}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar initialFocus mode="range" defaultMonth={date?.from} selected={date} onSelect={setDate} numberOfMonths={2}/>
            </PopoverContent>
          </Popover>
        </div>
      </div>
      {/* Finans odaklı KPI'lar */}
       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Beklenen Ödeme (1 Gün)</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₺{finance.expectedPaymentNextDay.toLocaleString('tr-TR')}</div>
            <p className="text-xs text-muted-foreground">{finance.expectedPaymentCount.toLocaleString('tr-TR')} tahsilat bekleniyor</p>
            <div className="mt-2"><Button size="sm" variant="outline" onClick={()=>navigate('/merchant/wallet-settlement')}>Ödemeleri Gör</Button></div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Son Ekstre Durumu</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₺{finance.lastStatementAmount.toLocaleString('tr-TR')}</div>
            <p className="text-xs text-muted-foreground">Son ödeme: {format(finance.statementDueDate, 'dd MMM yyyy')} ({finance.daysToDue >= 0 ? `${finance.daysToDue} gün kaldı` : `${Math.abs(finance.daysToDue)} gün gecikti`})</p>
            <div className="mt-2"><Button size="sm" variant="outline" onClick={()=>navigate('/merchant/statements')}>Ekstreye Git</Button></div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hakediş Özeti</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xs text-gray-500 mb-1">Geçen ay</div>
            <div className="text-sm">Cüzdan: <span className="font-semibold">₺{finance.walletSettlementAmount.toLocaleString('tr-TR')}</span></div>
            <div className="text-sm">Saklı Kart: <span className="font-semibold">₺{finance.storedCardSettlementAmount.toLocaleString('tr-TR')}</span></div>
            <div className="mt-2 flex gap-2">
              <Button size="sm" variant="outline" onClick={()=>navigate('/merchant/wallet-settlement')}>Cüzdan</Button>
              <Button size="sm" variant="outline" onClick={()=>navigate('/merchant/stored-card-settlement')}>Saklı Kart</Button>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Frekans (Sipariş/Kullanıcı)</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{baseMetrics.frequency.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">{baseMetrics.successfulOrders.toLocaleString('tr-TR')} sipariş / {baseMetrics.uniqueUsers.toLocaleString('tr-TR')} kullanıcı</p>
            <div className="mt-2"><Button size="sm" variant="outline" onClick={()=>navigate('/merchant/payment-reports')}>Raporlara Git</Button></div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ortalama Sepet Tutarı</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₺{baseMetrics.averageBasket.toLocaleString('tr-TR', { maximumFractionDigits: 2 })}</div>
            <p className="text-xs text-muted-foreground">Başarılı siparişlerde ortalama</p>
            <div className="mt-2"><Button size="sm" variant="outline" onClick={()=>navigate('/merchant/payment-reports')}>Raporlara Git</Button></div>
          </CardContent>
        </Card>
      </div>

      {/* Bildirimler kaldırıldı: aşağıdaki özet grid içinde sağ tarafta gösterilecek */}


      {/* Özet grafikler */}
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-3">
        <Card className="md:col-span-2 lg:col-span-2">
                <CardHeader>
            <CardTitle>Günlük Başarı Oranı ve Ciro</CardTitle>
            <CardDescription>Son dönem performans özeti</CardDescription>
              </CardHeader>
              <CardContent>
            <ResponsiveContainer width="100%" height={320}>
              <AreaChart data={dailyPerformanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis yAxisId="left" tickFormatter={(v) => `%${v}`} />
                <YAxis yAxisId="right" orientation="right" tickFormatter={(v)=>`₺${Number(v).toLocaleString('tr-TR',{maximumFractionDigits:0})}`} />
                    <Tooltip />
                    <Legend />
                <Area yAxisId="left" type="monotone" dataKey="Başarı Oranı" stroke="#2563eb" fill="#2563eb" fillOpacity={0.2} />
                <Line yAxisId="right" type="monotone" dataKey="successVolume" name="Ciro" stroke="#22c55e" strokeWidth={2} />
              </AreaChart>
                </ResponsiveContainer>
            <div className="flex justify-end mt-3"><Button variant="outline" onClick={()=>navigate('/merchant/payment-reports')}>Raporlara Git</Button></div>
              </CardContent>
            </Card>
        {/* Bildirimler - sağ sütunda dikey ve scrollable */}
        <Card className="md:col-span-1 lg:col-span-1">
          <CardHeader className="pb-3">
            <CardTitle>Bildirimler</CardTitle>
            <CardDescription>Hızlı aksiyonlar</CardDescription>
                </CardHeader>
                <CardContent>
            <div className="space-y-2 max-h-[320px] overflow-y-auto pr-1">
              <div className="flex items-start justify-between bg-yellow-50 border border-yellow-200 rounded px-3 py-2">
                <div className="flex items-start gap-2"><AlertTriangle className="w-4 h-4 mt-0.5 text-yellow-600"/><div>
                  <div className="text-sm font-medium">Ekstre son ödeme tarihi yaklaşıyor</div>
                  <div className="text-xs text-gray-600">{format(finance.statementDueDate, 'dd MMM yyyy')} • {finance.daysToDue} gün</div>
                </div></div>
                <Button size="sm" variant="outline" onClick={()=>navigate('/merchant/statements')}>Gör</Button>
              </div>
              <div className="flex items-start justify-between bg-blue-50 border border-blue-200 rounded px-3 py-2">
                <div className="flex items-start gap-2"><Shield className="w-4 h-4 mt-0.5 text-blue-600"/><div>
                  <div className="text-sm font-medium">Şifre geçerlilik süresi</div>
                  <div className="text-xs text-gray-600">10 gün içinde dolacak</div>
                </div></div>
                <Button size="sm" variant="outline">Güncelle</Button>
              </div>
              <div className="flex items-start justify-between bg-green-50 border border-green-200 rounded px-3 py-2">
                <div className="flex items-start gap-2"><Bell className="w-4 h-4 mt-0.5 text-green-600"/><div>
                  <div className="text-sm font-medium">Beklenen ödeme</div>
                  <div className="text-xs text-gray-600">₺{finance.expectedPaymentNextDay.toLocaleString('tr-TR')}</div>
                </div></div>
                <Button size="sm" variant="outline" onClick={()=>navigate('/merchant/wallet-settlement')}>Git</Button>
              </div>
              <div className="flex items-start justify-between bg-red-50 border border-red-200 rounded px-3 py-2">
                <div className="flex items-start gap-2"><AlertTriangle className="w-4 h-4 mt-0.5 text-red-600"/><div>
                  <div className="text-sm font-medium">POS hata oranında artış</div>
                  <div className="text-xs text-gray-600">Son 1 saatte +%1.8</div>
                </div></div>
                <Button size="sm" variant="outline" onClick={()=>navigate('/admin/pos-error-management')}>İncele</Button>
              </div>
              <div className="flex items-start justify-between bg-indigo-50 border border-indigo-200 rounded px-3 py-2">
                <div className="flex items-start gap-2"><FileText className="w-4 h-4 mt-0.5 text-indigo-600"/><div>
                  <div className="text-sm font-medium">Yeni dekont oluşturuldu</div>
                  <div className="text-xs text-gray-600">₺45.230,00 • 2 belge</div>
                </div></div>
                <Button size="sm" variant="outline" onClick={()=>navigate('/merchant/statements')}>Aç</Button>
              </div>
              <div className="flex items-start justify-between bg-emerald-50 border border-emerald-200 rounded px-3 py-2">
                <div className="flex items-start gap-2"><CheckCircle className="w-4 h-4 mt-0.5 text-emerald-600"/><div>
                  <div className="text-sm font-medium">Komisyon ödemesi tamamlandı</div>
                  <div className="text-xs text-gray-600">Bugün • 13:45</div>
                </div></div>
                <Button size="sm" variant="outline" onClick={()=>navigate('/merchant/stored-card-settlement')}>Detay</Button>
              </div>
              <div className="flex items-start justify-between bg-orange-50 border border-orange-200 rounded px-3 py-2">
                <div className="flex items-start gap-2"><Bell className="w-4 h-4 mt-0.5 text-orange-600"/><div>
                  <div className="text-sm font-medium">Yeni kampanya bildirimi</div>
                  <div className="text-xs text-gray-600">3D oranını artırmaya yönelik öneri</div>
                </div></div>
                <Button size="sm" variant="outline" onClick={()=>navigate('/merchant/payment-reports')}>Göz At</Button>
              </div>
              <div className="flex items-start justify-between bg-slate-50 border border-slate-200 rounded px-3 py-2">
                <div className="flex items-start gap-2"><Bell className="w-4 h-4 mt-0.5 text-slate-600"/><div>
                  <div className="text-sm font-medium">Planlı bakım</div>
                  <div className="text-xs text-gray-600">Bu gece 02:00-04:00 arasında kısa kesintiler</div>
                </div></div>
                <Button size="sm" variant="outline">Detay</Button>
              </div>
          </div>
                </CardContent>
              </Card>
          </div>

      {/* Risk & Operasyon Özeti - geniş kart */}
           <Card>
              <CardHeader>
          <CardTitle>Risk & Operasyon Özeti</CardTitle>
          <CardDescription>Başlıca metrikler</CardDescription>
              </CardHeader>
              <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <div className="text-sm text-gray-600 mb-1">POS Hata Oranı</div>
              <div className="text-2xl font-semibold mb-2">%{ops.errorRate.toFixed(2)}</div>
              <div className="w-full h-2 bg-gray-200 rounded">
                <div className="h-2 bg-red-500 rounded" style={{ width: `${Math.min(100, ops.errorRate)}%` }} />
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600 mb-1">En İyi Banka</div>
              <div className="inline-flex items-center gap-2 px-2 py-1 rounded bg-green-50 text-green-700 text-sm font-medium">{ops.topIssuer}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600 mb-1">İade Oranı</div>
              <div className="text-2xl font-semibold">%{ops.refundRate.toFixed(2)}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600 mb-1">Chargeback (Dönem)</div>
              <div className="text-2xl font-semibold">{ops.chargebackCount}</div>
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <Button size="sm" variant="outline" onClick={()=>navigate('/merchant/payment-reports')}>Banka Analizleri</Button>
            <Button size="sm" variant="outline" onClick={()=>navigate('/admin/pos-error-management')}>POS Hataları</Button>
          </div>
                </CardContent>
            </Card>
    </div>
  )
}
