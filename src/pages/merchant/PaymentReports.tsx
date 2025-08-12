import { useState, useMemo } from 'react';
import { DateRange } from 'react-day-picker';
import { subDays, format, eachDayOfInterval, startOfDay, startOfMonth } from 'date-fns';
import { Calendar as CalendarIcon, DollarSign, CreditCard, Users, CheckCircle, ArrowUpRight, ArrowDownRight } from "lucide-react"
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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
import ReportDetailModal from "../../components/ReportDetailModal";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { exportToExcel } from "../../utils/exportToExcel";

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
  const paymentMethods = ['Saklı Kart', 'Kredi Kartı & Banka Kartı', 'Hepsi Finans', 'Cüzdan'];
  
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
      installmentCount: undefined as number | undefined,
      issuerBank: banks[Math.floor(Math.random() * banks.length)],
      acquirer: acquirers[Math.floor(Math.random() * acquirers.length)],
      cardType: cardTypes[Math.floor(Math.random() * cardTypes.length)],
      paymentMethod: paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
      userId: userPool[Math.floor(Math.random() * userPool.length)],
      errorCode: isSuccess ? null : errorCodes[Math.floor(Math.random() * errorCodes.length)],
    });
    // Taksit sayısını atayalım (2-12 arası), peşin için 1 kabul edilebilir ancak breakdown sadece >=2 için kullanılacak
    if (transactions[i].isInstallment) {
      (transactions[i] as any).installmentCount = Math.floor(Math.random() * 11) + 2; // 2..12
    } else {
      (transactions[i] as any).installmentCount = 1;
    }
  }
  return transactions;
};


export default function PaymentReports() {
  const [activeTab, setActiveTab] = useState("genel-performans");
  const [date, setDate] = useState<DateRange | undefined>({
    from: subDays(new Date(), 29),
    to: new Date(),
  });
  const [openDailyVolumeModal, setOpenDailyVolumeModal] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<string>('Tümü');
  const [selectedThreeD, setSelectedThreeD] = useState<string>('Tümü');
  const [selectedIssuer, setSelectedIssuer] = useState<string>('Tümü');

  const mockData = useMemo(() => {
    if (date && date.from && date.to) {
      return generateMockTransactions(date);
    }
    return [];
  }, [date]);

  const methodOptions = useMemo(() => {
    const set = new Set(mockData.map(t => t.paymentMethod));
    return ['Tümü', ...Array.from(set) as string[]];
  }, [mockData]);
  const issuerOptions = useMemo(() => {
    const set = new Set(mockData.map(t => t.issuerBank));
    return ['Tümü', ...Array.from(set) as string[]];
  }, [mockData]);

  const filteredData = useMemo(() => {
    return mockData.filter(t => {
      if (selectedMethod !== 'Tümü' && t.paymentMethod !== selectedMethod) return false;
      if (selectedThreeD === '3D' && !t.is3D) return false;
      if (selectedThreeD === 'Non-3D' && t.is3D) return false;
      if (selectedIssuer !== 'Tümü' && t.issuerBank !== selectedIssuer) return false;
      return true;
    });
  }, [mockData, selectedMethod, selectedThreeD, selectedIssuer]);
  
  const kpiMetrics = useMemo(() => {
    const totalTransactions = filteredData.length;
    const successfulTransactions = filteredData.filter(t => t.isSuccess);
    const totalVolume = successfulTransactions.reduce((sum, t) => sum + t.amount, 0);
    const successRate = totalTransactions > 0 ? (successfulTransactions.length / totalTransactions) * 100 : 0;
    const uniqueUsers = new Set(filteredData.map(t => t.userId)).size;

    return { totalVolume, totalTransactions, successRate, newCustomers: uniqueUsers };
  }, [filteredData]);

  const previousKpiMetrics = useMemo(() => {
    if (!date?.from || !date?.to) return null;
    const dayDiff = Math.max(1, Math.ceil((date.to.getTime() - date.from.getTime()) / (1000 * 60 * 60 * 24)));
    const prevFrom = subDays(date.from, dayDiff);
    const prevTo = subDays(date.to, dayDiff);
    const prevData = generateMockTransactions({ from: prevFrom, to: prevTo });
    const prevFiltered = prevData.filter(t => {
      if (selectedMethod !== 'Tümü' && t.paymentMethod !== selectedMethod) return false;
      if (selectedThreeD === '3D' && !t.is3D) return false;
      if (selectedThreeD === 'Non-3D' && t.is3D) return false;
      if (selectedIssuer !== 'Tümü' && t.issuerBank !== selectedIssuer) return false;
      return true;
    });
    const totalTransactions = prevFiltered.length;
    const successfulTransactions = prevFiltered.filter(t => t.isSuccess);
    const totalVolume = successfulTransactions.reduce((sum, t) => sum + t.amount, 0);
    const successRate = totalTransactions > 0 ? (successfulTransactions.length / totalTransactions) * 100 : 0;
    const uniqueUsers = new Set(prevFiltered.map(t => t.userId)).size;
    return { totalVolume, totalTransactions, successRate, newCustomers: uniqueUsers };
  }, [date, selectedMethod, selectedThreeD, selectedIssuer]);

  const dailyPerformanceData = useMemo(() => {
    if (!date || !date.from || !date.to) return [];
    const days = eachDayOfInterval({ start: date.from, end: date.to });
    return days.map(day => {
      const dayStart = startOfDay(day);
      const dayTransactions = filteredData.filter(t => startOfDay(t.date).getTime() === dayStart.getTime());
      const successfulCount = dayTransactions.filter(t => t.isSuccess).length;
      const totalCount = dayTransactions.length;
      const successVolume = dayTransactions.filter(t => t.isSuccess).reduce((sum, t) => sum + t.amount, 0);
      const successRate = totalCount > 0 ? (successfulCount / totalCount) * 100 : 0;
      return { 
        date: format(day, 'dd.MM.yyyy'),
        chartDate: format(day, 'MMM dd'), 
        totalTransactions: totalCount,
        successfulTransactions: successfulCount,
        "Başarı Oranı": parseFloat(successRate.toFixed(1)),
        dateObj: day,
        successVolume,
      };
    }).reverse();
  }, [filteredData, date]);

  // Karşılaştırmalı analizler için veri
  const comparisonData = useMemo(() => {
    const calcStats = (data: any[]) => {
        const total = data.length;
        const success = data.filter(t => t.isSuccess).length;
        const rate = total > 0 ? (success / total) * 100 : 0;
        return { total, success, rate: parseFloat(rate.toFixed(1)) };
    };

    const threeD = filteredData.filter(t => t.is3D);
    const nonThreeD = filteredData.filter(t => !t.is3D);
    const sakliKart = filteredData.filter(t => t.paymentMethod === 'Saklı Kart');
    const kart = filteredData.filter(t => t.paymentMethod === 'Kredi Kartı & Banka Kartı');
    const hepsiFinans = filteredData.filter(t => t.paymentMethod === 'Hepsi Finans');
    const cuzdan = filteredData.filter(t => t.paymentMethod === 'Cüzdan');
    const installment = filteredData.filter(t => t.isInstallment);
    const cash = filteredData.filter(t => !t.isInstallment);

    const toShare = (parts: Array<{ name: string; total: number }>) => {
      const grand = parts.reduce((s, p) => s + p.total, 0) || 1;
      return parts.map(p => ({ ...p, share: parseFloat(((p.total / grand) * 100).toFixed(1)) }));
    };

    // Taksit kırılımı 2..12
    const installmentBreakdown = Array.from({ length: 11 }, (_, idx) => idx + 2).map((k) => {
      const subset = installment.filter(t => (t as any).installmentCount === k);
      return { name: `${k} Taksit`, total: subset.length };
    });
    const installmentBreakdownWithShare = toShare(installmentBreakdown);
    // Top N + Diğer için kompakt dizi
    const sortedInstallments = [...installmentBreakdownWithShare].sort((a, b) => b.share - a.share);
    const TOP_N = 6;
    const top = sortedInstallments.slice(0, TOP_N);
    const others = sortedInstallments.slice(TOP_N);
    const otherShare = parseFloat((others.reduce((s, x) => s + (x.share || 0), 0)).toFixed(1));
    const otherTotal = others.reduce((s, x) => s + (x.total || 0), 0);
    const installmentBreakdownCompact = otherShare > 0 ? [...top, { name: 'Diğer', share: otherShare, total: otherTotal }] : top;

    return {
      // Başarı oranlarını hesaplamaya devam ediyoruz fakat grafiklerde paylaşım (share) kullanılacak
      secure: toShare([
        { name: '3D Secure', ...calcStats(threeD) },
        { name: 'Non-3D', ...calcStats(nonThreeD) },
      ]),
      method: toShare([
        { name: 'Saklı Kart', ...calcStats(sakliKart) },
        { name: 'Kredi Kartı & Banka Kartı', ...calcStats(kart) },
        { name: 'Hepsi Finans', ...calcStats(hepsiFinans) },
        { name: 'Cüzdan', ...calcStats(cuzdan) },
      ]),
      paymentType: toShare([
        { name: 'Peşin', ...calcStats(cash) },
        { name: 'Taksitli', ...calcStats(installment) },
      ]),
      installmentBreakdown: installmentBreakdownWithShare,
      installmentBreakdownCompact,
    };
  }, [filteredData]);

  const bankAnalysisData = useMemo(() => {
    const successRateByIssuer = filteredData.reduce((acc, t) => {
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
      total: data.total,
      success: data.success,
      "Başarı Oranı": data.total > 0 ? parseFloat(((data.success / data.total) * 100).toFixed(1)) : 0,
    })).sort((a, b) => b["Başarı Oranı"] - a["Başarı Oranı"]);
    
    const volumeByAcquirer = filteredData.reduce((acc, t) => {
        if (t.isSuccess) {
            if (!acc[t.acquirer]) {
                acc[t.acquirer] = 0;
            }
            acc[t.acquirer] += t.amount;
        }
        return acc;
    }, {} as Record<string, number>);

    const formattedVolumeByAcquirer = Object.entries(volumeByAcquirer).map(([name, value]) => ({ name, value }));

    const errorCodes = filteredData
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

    const formattedAllErrorCodes = Object.entries(errorCodes)
      .map(([code, data]) => ({ code, description: data.description, count: data.count }))
      .sort((a, b) => b.count - a.count);
    const formattedErrorCodesTop = formattedAllErrorCodes.slice(0, 10);

    return { successRateByIssuer: formattedSuccessRate, volumeByAcquirer: formattedVolumeByAcquirer, errorCodesTop: formattedErrorCodesTop, errorCodesAll: formattedAllErrorCodes };
  }, [filteredData]);

  const hourlyByIssuer = useMemo(() => {
    // Saatlik toplamları bankaya göre çıkar, top 5 bankayı al
    const hours = Array.from({ length: 24 }, (_, h) => h);
    const counts: Record<string, number[]> = {};
    const issuerTotals: Record<string, number> = {};
    filteredData.forEach(t => {
      const h = new Date(t.date).getHours();
      const bank = t.issuerBank;
      if (!counts[bank]) counts[bank] = Array.from({ length: 24 }, () => 0);
      counts[bank][h] += 1;
      issuerTotals[bank] = (issuerTotals[bank] || 0) + 1;
    });
    const topBanks = Object.entries(issuerTotals)
      .sort((a,b) => b[1]-a[1])
      .slice(0,5)
      .map(([bank]) => bank);
    const data = hours.map(h => {
      const row: any = { hour: `${h}:00` };
      topBanks.forEach(bank => {
        row[bank] = (counts[bank]?.[h] || 0);
      });
      return row;
    });
    return { data, topBanks };
  }, [filteredData]);

  const userAndTurnoverData = useMemo(() => {
    // Yeni/Mevcut müşteri analizi için geçmiş veri simülasyonu
    const previousPeriodStart = subDays(date?.from || new Date(), 30);
    const previousPeriodTransactions = new Set(
        generateMockTransactions({from: previousPeriodStart, to: subDays(date?.from || new Date(), 1)})
        .map(t => t.userId)
        .slice(0, Math.floor(kpiMetrics.newCustomers * 0.6)) // Mevcut müşterilerin bir kısmını simüle et
    );

    const currentPeriodUsers = new Set(filteredData.map(t => t.userId));
    const newUsers = new Set([...currentPeriodUsers].filter(user => !previousPeriodTransactions.has(user)));
    const existingUsers = new Set([...currentPeriodUsers].filter(user => previousPeriodTransactions.has(user)));
    
    const customerDistribution = [
        { name: 'Yeni Müşteri', value: newUsers.size },
        { name: 'Mevcut Müşteri', value: existingUsers.size },
    ];

    // Kart tipine göre ciro
    const turnoverByCardType = filteredData.filter(t => t.isSuccess).reduce((acc, t) => {
        if(!acc[t.cardType]) {
            acc[t.cardType] = { amount: 0, count: 0 };
        }
        acc[t.cardType].amount += t.amount;
        acc[t.cardType].count++;
        return acc;
    }, {} as Record<string, {amount: number, count: number}>);

    const formattedTurnoverByCardType = Object.entries(turnoverByCardType).map(([name, data]) => ({name, value: data.amount, count: data.count}));

    // En çok harcama yapan müşteriler
    const topCustomers = filteredData.filter(t=> t.isSuccess).reduce((acc, t) => {
        if(!acc[t.userId]) {
            acc[t.userId] = 0;
        }
        acc[t.userId] += t.amount;
        return acc;
    }, {} as Record<string, number>);

    const formattedTopCustomers = Object.entries(topCustomers)
    .map(([userId, totalAmount]) => ({ userId, totalAmount }))
    .sort((a,b) => b.totalAmount - a.totalAmount)
    .slice(0,10);

    return { customerDistribution, turnoverByCardType: formattedTurnoverByCardType, topCustomers: formattedTopCustomers };
  }, [filteredData, date, kpiMetrics.newCustomers]);

  // Modal durumları ve kolon tanımları
  const [openDailyModal, setOpenDailyModal] = useState(false);
  const [openSecureModal, setOpenSecureModal] = useState(false);
  const [openCardModal, setOpenCardModal] = useState(false);
  const [openPaymentTypeModal, setOpenPaymentTypeModal] = useState(false);
  const [openIssuerModal, setOpenIssuerModal] = useState(false);
  const [openInstallmentModal, setOpenInstallmentModal] = useState(false);
  const [openAllErrorsModal, setOpenAllErrorsModal] = useState(false);
  const bankLogos: Record<string, string> = {
    'Garanti': 'https://logo.clearbit.com/garanti.com.tr',
    'Akbank': 'https://logo.clearbit.com/akbank.com',
    'İş Bankası': 'https://logo.clearbit.com/isbank.com.tr',
    'Yapı Kredi': 'https://logo.clearbit.com/yapikredi.com.tr',
    'Ziraat': 'https://logo.clearbit.com/ziraatbank.com.tr',
    'Halkbank': 'https://logo.clearbit.com/halkbank.com.tr',
    'Vakıfbank': 'https://logo.clearbit.com/vakifbank.com.tr',
  };

  const dailyColumns = [
    { key: 'date', header: 'Tarih' },
    { key: 'totalTransactions', header: 'Toplam İşlem', align: 'right' as const },
    { key: 'successfulTransactions', header: 'Başarılı İşlem', align: 'right' as const },
    { key: 'Başarı Oranı', header: 'Başarı Oranı', align: 'right' as const, render: (r: any) => `%${(r['Başarı Oranı'] as number).toFixed(2)}` },
  ];

  const simpleRateColumns = [
    { key: 'name', header: 'Tip' },
    { key: 'total', header: 'Toplam İşlem', align: 'right' as const },
    { key: 'success', header: 'Başarılı İşlem', align: 'right' as const },
    { key: 'rate', header: 'Başarı Oranı', align: 'right' as const, render: (r: any) => `%${(r.rate as number).toFixed(2)}` },
  ];

  const issuerColumns = [
    { key: 'name', header: 'Banka' },
    { key: 'total', header: 'Toplam İşlem', align: 'right' as const },
    { key: 'success', header: 'Başarılı İşlem', align: 'right' as const },
    { key: 'Başarı Oranı', header: 'Başarı Oranı', align: 'right' as const, render: (r: any) => `%${(r['Başarı Oranı'] as number).toFixed(2)}` },
  ];

  const installmentColumns = [
    { key: 'name', header: 'Taksit' },
    { key: 'total', header: 'Toplam İşlem', align: 'right' as const },
    { key: 'share', header: 'Pay (%)', align: 'right' as const, render: (r: any) => `%${(r.share as number).toFixed(2)}` },
  ];

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Detaylı Raporlar</h2>
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

      {/* Hızlı Tarih Seçimi ve KPI Kartları */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" onClick={() => setDate({ from: startOfDay(new Date()), to: new Date() })}>Bugün</Button>
          <Button variant="outline" onClick={() => setDate({ from: subDays(new Date(), 6), to: new Date() })}>Son 7 Gün</Button>
          <Button variant="outline" onClick={() => setDate({ from: subDays(new Date(), 29), to: new Date() })}>Son 30 Gün</Button>
          <Button variant="outline" onClick={() => setDate({ from: startOfMonth(new Date()), to: new Date() })}>Bu Ay</Button>
        </div>
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Toplam Ciro</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₺{kpiMetrics.totalVolume.toLocaleString('tr-TR', { maximumFractionDigits: 2 })}</div>
              <p className="text-xs text-muted-foreground">Başarılı işlemler</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Toplam İşlem</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{kpiMetrics.totalTransactions.toLocaleString('tr-TR')}</div>
              <p className="text-xs text-muted-foreground">Seçilen periyot</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Başarı Oranı</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">%{kpiMetrics.successRate.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">Genel</p>
            </CardContent>
          </Card>
          {null}
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="genel-performans">Genel Performans</TabsTrigger>
          <TabsTrigger value="banka-analizleri">Banka Analizleri</TabsTrigger>
        </TabsList>

        <TabsContent value="genel-performans" className="space-y-4">
          {/* 1. Satır: Günlük Başarı Oranı Trendi + 3D Secure */}
          <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-3">
            <Card className="md:col-span-2 lg:col-span-2">
              <CardHeader>
                  <CardTitle>Günlük Başarı Oranı Trendi</CardTitle>
                  <CardDescription>Seçilen tarih aralığındaki günlük işlem başarı oranı.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                 <ResponsiveContainer width="100%" height={350}>
                        <AreaChart data={dailyPerformanceData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="chartDate" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis yAxisId="left" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `%${value}`} />
                            <YAxis yAxisId="right" orientation="right" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `₺${Number(value).toLocaleString('tr-TR', { maximumFractionDigits: 0 })}`} />
                            <Tooltip formatter={(value: number, name: string, props: any) => {
                              const isVolume = props?.dataKey === 'successVolume';
                              const label = isVolume ? 'Ciro' : 'Başarı Oranı';
                              const formatted = isVolume ? `₺${Number(value).toLocaleString('tr-TR', { maximumFractionDigits: 0 })}` : `${Number(value).toFixed(2)}%`;
                              return [formatted, label];
                            }}/>
                          <Legend />
                            <Area yAxisId="left" type="monotone" dataKey="Başarı Oranı" name="Başarı Oranı" stroke="#2563eb" fill="#2563eb" fillOpacity={0.25} />
                            <Line yAxisId="right" type="monotone" dataKey="successVolume" name="Ciro" stroke="#22c55e" strokeWidth={2} />
                        </AreaChart>
                  </ResponsiveContainer>
                    <div className="flex justify-end">
                      <Button variant="outline" onClick={() => setOpenDailyModal(true)}>Detayları Gör</Button>
                    </div>
              </CardContent>
          </Card>
            <Card className="md:col-span-1 lg:col-span-1">
                <CardHeader>
                    <CardTitle>3D Secure vs Non-3D</CardTitle>
                    <CardDescription>Güvenlik tiplerine göre işlem pay dağılımı.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ResponsiveContainer width="100%" height={350}>
                    <PieChart>
                      <Pie
                        data={comparisonData.secure}
                        dataKey="share"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={110}
                        label
                      >
                        {comparisonData.secure.map((entry: any, index: number) => (
                          <Cell key={`cell-sec-${index}`} fill={["#3b82f6", "#94a3b8"][index % 2]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: number, name: string) => [`${(value as number).toFixed(2)}%`, `${name} Payı`]} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="flex justify-end">
                    <Button variant="outline" onClick={() => setOpenSecureModal(true)}>Detayları Gör</Button>
                  </div>
                </CardContent>
            </Card>
          </div>

          {/* 2. Satır: Günlük Ciro ve İşlem Adedi + Ödeme Yöntemleri */}
          <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-3">
            <Card className="md:col-span-2 lg:col-span-2">
              <CardHeader>
                <CardTitle>Günlük Ciro ve İşlem Adedi</CardTitle>
                <CardDescription>Seçilen periyotta günlük ciro (₺) ve işlem adedi.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={dailyPerformanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="chartDate" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis yAxisId="left" orientation="left" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis yAxisId="right" orientation="right" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `₺${Number(value).toLocaleString('tr-TR', { maximumFractionDigits: 0 })}`} />
                    <Tooltip formatter={(value: number, name: string, props: any) => {
                      const isVolume = props?.dataKey === 'successVolume';
                      const label = isVolume ? 'Ciro' : 'İşlem Adedi';
                      const formatted = isVolume ? `₺${Number(value).toLocaleString('tr-TR', { maximumFractionDigits: 0 })}` : `${value}`;
                      return [formatted, label];
                    }} />
                    <Legend />
                    <Bar yAxisId="left" dataKey="totalTransactions" name="İşlem Adedi" fill="#8884d8" />
                    <Line yAxisId="right" type="monotone" dataKey="successVolume" name="Ciro" stroke="#22c55e" strokeWidth={2} />
                  </BarChart>
                </ResponsiveContainer>
                <div className="flex justify-end">
                  <Button variant="outline" onClick={() => setOpenDailyVolumeModal(true)}>Detayları Gör</Button>
                </div>
              </CardContent>
            </Card>
            <Card className="md:col-span-1 lg:col-span-1">
                <CardHeader>
                    <CardTitle>Ödeme Yöntemleri</CardTitle>
                    <CardDescription>Ödeme yöntemlerine göre işlem pay dağılımı.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                   <ResponsiveContainer width="100%" height={350}>
                    <PieChart>
                      <Pie
                        data={comparisonData.method}
                        dataKey="share"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={120}
                        label
                      >
                        {comparisonData.method.map((entry: any, index: number) => (
                          <Cell key={`cell-method-${index}`} fill={["#10b981", "#3b82f6", "#f59e0b", "#ef4444"][index % 4]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: number, name: string) => [`${(value as number).toFixed(2)}%`, `${name} Payı`]} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="flex justify-end">
                    <Button variant="outline" onClick={() => setOpenCardModal(true)}>Detayları Gör</Button>
                  </div>
                </CardContent>
            </Card>
          </div>

          {/* İlgili modallar */}
          <ReportDetailModal
            open={openDailyVolumeModal}
            onOpenChange={setOpenDailyVolumeModal}
            title="Günlük Ciro ve İşlem Adedi Detay"
            description="Tarih bazında ciro (₺) ve işlem adedi."
            columns={[
              { key: 'date', header: 'Tarih' },
              { key: 'successVolume', header: 'Ciro (₺)', align: 'right', render: (r: any) => `₺${r.successVolume.toLocaleString('tr-TR', { maximumFractionDigits: 2 })}` },
              { key: 'totalTransactions', header: 'Toplam İşlem', align: 'right' },
            ] as any}
            rows={dailyPerformanceData as any}
            enableDateFilter
            dateAccessor={(r: any) => r.dateObj as Date}
            initialPageSize={25}
          />
          <ReportDetailModal
            open={openDailyModal}
            onOpenChange={setOpenDailyModal}
            title="Günlük Başarı Oranı Detayı"
            description="Tarih bazında toplam, başarılı işlem ve başarı oranı."
            columns={dailyColumns as any}
            rows={dailyPerformanceData as any}
            enableDateFilter
            dateAccessor={(r: any) => r.dateObj as Date}
            initialPageSize={25}
          />
          <ReportDetailModal
            open={openSecureModal}
            onOpenChange={setOpenSecureModal}
            title="3D Secure vs Non-3D Detay"
            description="Güvenlik tipine göre işlem metrikleri."
            columns={simpleRateColumns as any}
            rows={comparisonData.secure as any}
            enableDateFilter={false}
            initialPageSize={10}
          />
          <ReportDetailModal
            open={openCardModal}
            onOpenChange={setOpenCardModal}
            title="Ödeme Yöntemleri Detay"
            description="Ödeme yöntemlerine göre işlem metrikleri."
            columns={simpleRateColumns as any}
            rows={comparisonData.method as any}
            enableDateFilter={false}
            initialPageSize={10}
          />

          {/* 3. Satır: Peşin vs Taksitli + Taksit Kırılımı */}
          <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-3 md:col-span-2 lg:col-span-2">
              <Card className="lg:col-span-1">
                <CardHeader>
                  <CardTitle>Peşin vs Taksitli</CardTitle>
                  <CardDescription>Ödeme tiplerine göre işlem payı.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ResponsiveContainer width="100%" height={350}>
                    <PieChart>
                      <Pie
                        data={comparisonData.paymentType}
                        dataKey="share"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={110}
                        label
                      >
                        {comparisonData.paymentType.map((entry: any, index: number) => (
                          <Cell key={`cell-paytype-${index}`} fill={["#34d399", "#60a5fa"][index % 2]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: number, name: string) => [`${(value as number).toFixed(2)}%`, `${name} Payı`]} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="flex justify-end">
                    <Button variant="outline" onClick={() => setOpenPaymentTypeModal(true)}>Detayları Gör</Button>
                  </div>
                </CardContent>
              </Card>
              <ReportDetailModal
                open={openPaymentTypeModal}
                onOpenChange={setOpenPaymentTypeModal}
                title="Peşin vs Taksitli Detay"
                description="Ödeme tipine göre işlem metrikleri ve taksit kırılımı."
                columns={simpleRateColumns as any}
                rows={comparisonData.paymentType as any}
                enableDateFilter={false}
                initialPageSize={10}
              />
              <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Taksit Kırılımı (Sadece Taksitli Satışlar)</CardTitle>
                <CardDescription>En çok kullanılan taksit seçenekleri (Top 6) ve diğerleri.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={comparisonData.installmentBreakdownCompact} layout="vertical" margin={{ left: 40 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" tickFormatter={(value) => `%${value}`} domain={[0, 100]} />
                    <YAxis type="category" dataKey="name" width={120} />
                    <Tooltip formatter={(value: number, name: string, props: any) => [`${(value as number).toFixed(2)}%`, props?.payload?.name]} />
                    <Legend />
                    <Bar dataKey="share" name="Pay (%)" fill="#2563eb" />
                  </BarChart>
                </ResponsiveContainer>
                <div className="flex justify-end">
                  <Button variant="outline" onClick={() => setOpenInstallmentModal(true)}>Detayları Gör</Button>
                </div>
              </CardContent>
              </Card>
            </div>

            <ReportDetailModal
              open={openInstallmentModal}
              onOpenChange={setOpenInstallmentModal}
              title="Taksit Kırılımı Detay"
              description="2–12 taksit seçeneklerinin pay (%) ve adet dağılımı."
              columns={installmentColumns as any}
              rows={comparisonData.installmentBreakdown as any}
              enableDateFilter={false}
              initialPageSize={12}
            />
        </TabsContent>

        <TabsContent value="banka-analizleri" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-3">
            <Card className="md:col-span-2 lg:col-span-2">
              <CardHeader>
                <CardTitle>Banka Bazında Başarı Oranları</CardTitle>
                <CardDescription>Kartı çıkaran bankalara göre işlem başarı oranları (heatmap).</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="overflow-x-auto">
                  <Table className="min-w-full">
                    <TableHeader>
                      <TableRow>
                        <TableHead>Banka</TableHead>
                        <TableHead className="text-right">Toplam</TableHead>
                        <TableHead className="text-right">Başarılı</TableHead>
                        <TableHead className="text-right">Başarı Oranı</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {bankAnalysisData.successRateByIssuer.map((item) => (
                        <TableRow key={item.name}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <img src={bankLogos[item.name] || ''} alt={item.name} className="w-5 h-5 rounded-sm object-contain bg-white" onError={(e: any)=>{ e.currentTarget.style.display='none'; }} />
                              <span>{item.name}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">{item.total}</TableCell>
                          <TableCell className="text-right">{item.success}</TableCell>
                          <TableCell className="text-right">
                            <span className="px-2 py-1 rounded text-sm font-medium" style={{ backgroundColor: `hsl(${120 * (item['Başarı Oranı']/100)}, 70%, 90%)`, color: '#1f2937' }}>
                              %{item['Başarı Oranı'].toFixed(2)}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                <div className="flex justify-end">
                  <Button variant="outline" onClick={() => setOpenIssuerModal(true)}>Detayları Gör</Button>
          </div>
              </CardContent>
            </Card>
            <Card className="md:col-span-1 lg:col-span-1">
              <CardHeader>
                <CardTitle>Sık Karşılaşılan Banka Hata Kodları</CardTitle>
                <CardDescription>En sık alınan 10 banka hata kodu.</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Hata Kodu</TableHead>
                      <TableHead>Açıklama</TableHead>
                      <TableHead className="text-right">Adet</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {bankAnalysisData.errorCodesTop.map((error) => (
                      <TableRow key={error.code}>
                        <TableCell className="font-medium">{error.code}</TableCell>
                        <TableCell>{error.description}</TableCell>
                        <TableCell className="text-right">{error.count}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <div className="flex justify-end mt-3">
                  <Button variant="outline" onClick={() => setOpenAllErrorsModal(true)}>Tüm Hatalar</Button>
                </div>
              </CardContent>
            </Card>
           </div>
          <ReportDetailModal
            open={openIssuerModal}
            onOpenChange={setOpenIssuerModal}
            title="Banka Bazında Başarı Oranları Detay"
            description="Kartı çıkaran bankalara göre metrikler."
            columns={issuerColumns as any}
            rows={bankAnalysisData.successRateByIssuer as any}
            enableDateFilter={false}
            initialPageSize={25}
          />
          <ReportDetailModal
            open={openAllErrorsModal}
            onOpenChange={setOpenAllErrorsModal}
            title="Tüm Banka Hata Kodları"
            description="Seçilen periyotta görülen tüm banka hata kodları."
            columns={[
              { key: 'code', header: 'Hata Kodu' },
              { key: 'description', header: 'Açıklama' },
              { key: 'count', header: 'Adet', align: 'right' },
            ] as any}
            rows={bankAnalysisData.errorCodesAll as any}
            enableDateFilter={false}
            initialPageSize={50}
          />
          <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-3">
            <Card className="md:col-span-2 lg:col-span-2">
                    <CardHeader>
                <CardTitle>İşlem Zaman Dağılımı (Banka Bazlı)</CardTitle>
                <CardDescription>Seçilen periyotta saat bazında işlem adedi (top 5 banka, stack bar).</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={hourlyByIssuer.data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="hour" interval={2} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    {hourlyByIssuer.topBanks.map((bank, idx) => (
                      <Bar key={bank} dataKey={bank} stackId="a" name={bank} fill={["#2563eb", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"][idx % 5]} />
                    ))}
                  </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            <Card className="md:col-span-1 lg:col-span-1">
                    <CardHeader>
                <CardTitle>Acquirer Bazında Hacim Dağılımı</CardTitle>
                  <CardDescription>İşlem hacminin sanal POS'lara göre dağılımı (pay %). Hover: Tutar.</CardDescription>
                    </CardHeader>
              <CardContent>
                        <ResponsiveContainer width="100%" height={350}>
                           <PieChart>
                          <Pie data={bankAnalysisData.volumeByAcquirer} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={120} fill="#8884d8" label={({ percent }) => `${(percent*100).toFixed(1)}%`}>
                              {bankAnalysisData.volumeByAcquirer.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={['#8884d8', '#82ca9d', '#ffc658'][index % 3]} />
                                    ))}
                                </Pie>
                          <Tooltip formatter={(value: number, name: string, props: any) => {
                            const pct = props && props.payload && typeof props.payload.percent === 'number' ? (props.payload.percent * 100).toFixed(1) : '0.0';
                            return [`₺${(value as number).toLocaleString('tr-TR', { maximumFractionDigits: 0 })}`, `${props?.payload?.name} (${pct}%)`]
                          }} />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                </CardContent>
            </Card>
          </div>
        </TabsContent>
        
      </Tabs>
    </div>
  )
}
