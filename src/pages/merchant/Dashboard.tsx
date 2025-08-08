import { useState, useMemo } from 'react';
import { DateRange } from 'react-day-picker';
import { subDays, format, eachDayOfInterval, startOfDay } from 'date-fns';
import { Calendar as CalendarIcon, DollarSign, CreditCard, Users, CheckCircle, ShieldCheck, Lock } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
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
  const [activeTab, setActiveTab] = useState("genel-performans");
  const [date, setDate] = useState<DateRange | undefined>({
    from: subDays(new Date(), 29),
    to: new Date(),
  });

  const mockData = useMemo(() => {
    if (date && date.from && date.to) {
      return generateMockTransactions(date);
    }
    return [];
  }, [date]);

  // KPI Metrikleri
  const kpiMetrics = useMemo(() => {
    const totalTransactions = mockData.length;
    const successfulTransactions = mockData.filter(t => t.isSuccess);
    const totalVolume = successfulTransactions.reduce((sum, t) => sum + t.amount, 0);
    const successRate = totalTransactions > 0 ? (successfulTransactions.length / totalTransactions) * 100 : 0;
    const uniqueUsers = new Set(mockData.map(t => t.userId)).size;

    return { totalVolume, totalTransactions, successRate, newCustomers: uniqueUsers };
  }, [mockData]);

  // Günlük Performans Grafiği verisi
  const dailyPerformanceData = useMemo(() => {
    if (!date || !date.from || !date.to) return [];
    const days = eachDayOfInterval({ start: date.from, end: date.to });
    return days.map(day => {
      const dayStart = startOfDay(day);
      const dayTransactions = mockData.filter(t => startOfDay(t.date).getTime() === dayStart.getTime());
      const successfulCount = dayTransactions.filter(t => t.isSuccess).length;
      const successRate = dayTransactions.length > 0 ? (successfulCount / dayTransactions.length) * 100 : 0;
      return { date: format(day, 'MMM dd'), "Başarı Oranı": parseFloat(successRate.toFixed(1)) };
    });
  }, [mockData, date]);

  // Karşılaştırmalı analizler için veri
  const comparisonData = useMemo(() => {
    const calcSuccessRate = (data: any[]) => data.length > 0 ? (data.filter(t => t.isSuccess).length / data.length) * 100 : 0;

    const threeD = mockData.filter(t => t.is3D);
    const nonThreeD = mockData.filter(t => !t.is3D);
    const storedCard = mockData.filter(t => t.isStoredCard);
    const newCard = mockData.filter(t => !t.isStoredCard);
    const installment = mockData.filter(t => t.isInstallment);
    const cash = mockData.filter(t => !t.isInstallment);

    return {
      secure: [{ name: '3D Secure', "Başarı Oranı": calcSuccessRate(threeD)}, { name: 'Non-3D', "Başarı Oranı": calcSuccessRate(nonThreeD) }],
      card: [{ name: 'Kayıtlı Kart', "Başarı Oranı": calcSuccessRate(storedCard) }, { name: 'Yeni Kart', "Başarı Oranı": calcSuccessRate(newCard) }],
      paymentType: [
        { name: 'Peşin', "İşlem Adedi": cash.length, "Başarı Oranı": calcSuccessRate(cash) },
        { name: 'Taksitli', "İşlem Adedi": installment.length, "Başarı Oranı": calcSuccessRate(installment) }
      ]
    };
  }, [mockData]);

  const bankAnalysisData = useMemo(() => {
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

  const userAndTurnoverData = useMemo(() => {
    // Yeni/Mevcut müşteri analizi için geçmiş veri simülasyonu
    const previousPeriodStart = subDays(date?.from || new Date(), 30);
    const previousPeriodTransactions = new Set(
        generateMockTransactions({from: previousPeriodStart, to: subDays(date?.from || new Date(), 1)})
        .map(t => t.userId)
        .slice(0, Math.floor(kpiMetrics.newCustomers * 0.6)) // Mevcut müşterilerin bir kısmını simüle et
    );

    const currentPeriodUsers = new Set(mockData.map(t => t.userId));
    const newUsers = new Set([...currentPeriodUsers].filter(user => !previousPeriodTransactions.has(user)));
    const existingUsers = new Set([...currentPeriodUsers].filter(user => previousPeriodTransactions.has(user)));
    
    const customerDistribution = [
        { name: 'Yeni Müşteri', value: newUsers.size },
        { name: 'Mevcut Müşteri', value: existingUsers.size },
    ];

    // Kart tipine göre ciro
    const turnoverByCardType = mockData.filter(t => t.isSuccess).reduce((acc, t) => {
        if(!acc[t.cardType]) {
            acc[t.cardType] = 0;
        }
        acc[t.cardType] += t.amount;
        return acc;
    }, {} as Record<string, number>);

    const formattedTurnoverByCardType = Object.entries(turnoverByCardType).map(([name, value]) => ({name, value}));

    // En çok harcama yapan müşteriler
    const topCustomers = mockData.filter(t=> t.isSuccess).reduce((acc, t) => {
        if(!acc[t.userId]) {
            acc[t.userId] = 0;
        }
        acc[t.userId] += t.amount;
        return acc;
    }, {} as Record<string, number>);

    const formattedTopCustomers = Object.entries(topCustomers)
    .map(([userId, totalAmount]) => ({ userId, totalAmount }))
    .sort((a,b) => b.totalAmount - a.totalAmount)
    .slice(0,5);

    return { customerDistribution, turnoverByCardType: formattedTurnoverByCardType, topCustomers: formattedTopCustomers };
  }, [mockData, date, kpiMetrics.newCustomers]);

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
      
       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Toplam Hacim</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₺{kpiMetrics.totalVolume.toLocaleString('tr-TR', { maximumFractionDigits: 2 })}</div>
            <p className="text-xs text-muted-foreground">Başarılı işlemlerin toplamı</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Başarı Oranı</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">%{kpiMetrics.successRate.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Genel başarı oranı</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Toplam İşlem</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpiMetrics.totalTransactions.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Tüm işlem denemeleri</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tekil Müşteri</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{kpiMetrics.newCustomers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Bu periyotta işlem yapan</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="genel-performans">Genel Performans</TabsTrigger>
          <TabsTrigger value="banka-analizleri">Banka Analizleri</TabsTrigger>
          <TabsTrigger value="kullanici-ciro">Kullanıcı & Ciro</TabsTrigger>
        </TabsList>

        <TabsContent value="genel-performans" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
                <CardHeader>
                    <CardTitle>Günlük Başarı Oranı Trendi</CardTitle>
                </CardHeader>
                <CardContent className="pl-2">
                   <ResponsiveContainer width="100%" height={350}>
                        <LineChart data={dailyPerformanceData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `%${value}`} />
                            <Tooltip formatter={(value: number) => [`${value.toFixed(2)}%`, "Başarı Oranı"]}/>
                            <Legend />
                            <Line type="monotone" dataKey="Başarı Oranı" stroke="#2563eb" strokeWidth={2} activeDot={{ r: 8 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Peşin vs Taksitli</CardTitle>
                 <CardDescription>İşlem adedi ve başarı oranı karşılaştırması.</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={comparisonData.paymentType}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false}/>
                    <YAxis yAxisId="left" orientation="left" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis yAxisId="right" orientation="right" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `%${value}`}/>
                    <Tooltip />
                    <Legend />
                    <Bar yAxisId="left" dataKey="İşlem Adedi" fill="#8884d8" />
                    <Line yAxisId="right" type="monotone" dataKey="Başarı Oranı" stroke="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
            <Card>
                <CardHeader>
                    <CardTitle>3D Secure vs Non-3D</CardTitle>
                    <CardDescription>Güvenlik tipine göre başarı oranı karşılaştırması.</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={comparisonData.secure}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis tickFormatter={(value) => `%${value}`} />
                      <Tooltip formatter={(value: number) => [`${value.toFixed(2)}%`, "Başarı Oranı"]}/>
                      <Bar dataKey="Başarı Oranı" fill="#3b82f6" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Kayıtlı Kart vs Yeni Kart</CardTitle>
                    <CardDescription>Kart saklama durumuna göre başarı oranı.</CardDescription>
                </CardHeader>
                <CardContent>
                   <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={comparisonData.card}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis tickFormatter={(value) => `%${value}`}/>
                      <Tooltip formatter={(value: number) => [`${value.toFixed(2)}%`, "Başarı Oranı"]}/>
                      <Bar dataKey="Başarı Oranı" fill="#10b981" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="banka-analizleri" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-4">
                <CardHeader>
                  <CardTitle>Banka Bazında Başarı Oranları</CardTitle>
                  <CardDescription>Kartı çıkaran bankalara göre işlem başarı oranları.</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={bankAnalysisData.successRateByIssuer}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} angle={-45} textAnchor="end" height={60} />
                      <YAxis tickFormatter={(value) => `%${value.toFixed(0)}`} />
                      <Tooltip formatter={(value: number) => [`${value.toFixed(2)}%`, "Başarı Oranı"]}/>
                      <Bar dataKey="Başarı Oranı" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              <Card className="col-span-3">
                <CardHeader>
                  <CardTitle>Acquirer Bazında Hacim Dağılımı</CardTitle>
                   <CardDescription>İşlem hacminin sanal POS'lara göre dağılımı.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={350}>
                        <PieChart>
                            <Pie data={bankAnalysisData.volumeByAcquirer} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={120} fill="#8884d8" label>
                                {bankAnalysisData.volumeByAcquirer.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={['#8884d8', '#82ca9d', '#ffc658'][index % 3]} />
                                ))}
                            </Pie>
                            <Tooltip formatter={(value: number) => `₺${value.toLocaleString('tr-TR', { maximumFractionDigits: 0 })}`} />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </CardContent>
              </Card>
          </div>
           <Card>
              <CardHeader>
                <CardTitle>Sık Karşılaşılan Banka Hata Kodları</CardTitle>
                <CardDescription>Seçilen periyotta en sık alınan 5 banka hata kodu ve açıklaması.</CardDescription>
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
                    {bankAnalysisData.errorCodes.map((error) => (
                      <TableRow key={error.code}>
                        <TableCell className="font-medium">{error.code}</TableCell>
                        <TableCell>{error.description}</TableCell>
                        <TableCell className="text-right">{error.count}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
        </TabsContent>
        <TabsContent value="kullanici-ciro" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Yeni vs Mevcut Müşteri Dağılımı</CardTitle>
                        <CardDescription>Seçilen periyottaki müşteri profili.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={350}>
                            <PieChart>
                                <Pie data={userAndTurnoverData.customerDistribution} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={120} fill="#8884d8" label>
                                    {userAndTurnoverData.customerDistribution.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={['#10b981', '#3b82f6'][index % 2]} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(value: number) => `${value.toLocaleString()} Müşteri`} />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Kart Tipine Göre Ciro Dağılımı</CardTitle>
                        <CardDescription>Cironun kart tiplerine göre dağılımı.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={350}>
                           <PieChart>
                                <Pie data={userAndTurnoverData.turnoverByCardType} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={120} fill="#8884d8" label>
                                    {userAndTurnoverData.turnoverByCardType.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={['#ffc658', '#82ca9d', '#8884d8'][index % 3]} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(value: number) => `₺${value.toLocaleString('tr-TR', { maximumFractionDigits: 0 })}`} />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>En Yüksek Hacimli Müşteriler</CardTitle>
                    <CardDescription>Seçilen periyotta en çok harcama yapan müşteriler.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Müşteri ID</TableHead>
                                <TableHead className="text-right">Toplam Harcama</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {userAndTurnoverData.topCustomers.map((customer) => (
                                <TableRow key={customer.userId}>
                                    <TableCell className="font-medium">{customer.userId}</TableCell>
                                    <TableCell className="text-right">₺{customer.totalAmount.toLocaleString('tr-TR', { maximumFractionDigits: 2 })}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
