import { useState, useMemo } from 'react';
import { DateRange } from 'react-day-picker';
import { subDays, format, eachDayOfInterval, startOfDay } from 'date-fns';
import { Calendar as CalendarIcon } from "lucide-react"
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


export default function PaymentReports() {
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
  
  const kpiMetrics = useMemo(() => {
    const totalTransactions = mockData.length;
    const successfulTransactions = mockData.filter(t => t.isSuccess);
    const totalVolume = successfulTransactions.reduce((sum, t) => sum + t.amount, 0);
    const successRate = totalTransactions > 0 ? (successfulTransactions.length / totalTransactions) * 100 : 0;
    const uniqueUsers = new Set(mockData.map(t => t.userId)).size;

    return { totalVolume, totalTransactions, successRate, newCustomers: uniqueUsers };
  }, [mockData]);

  const dailyPerformanceData = useMemo(() => {
    if (!date || !date.from || !date.to) return [];
    const days = eachDayOfInterval({ start: date.from, end: date.to });
    return days.map(day => {
      const dayStart = startOfDay(day);
      const dayTransactions = mockData.filter(t => startOfDay(t.date).getTime() === dayStart.getTime());
      const successfulCount = dayTransactions.filter(t => t.isSuccess).length;
      const totalCount = dayTransactions.length;
      const successRate = totalCount > 0 ? (successfulCount / totalCount) * 100 : 0;
      return { 
        date: format(day, 'dd.MM.yyyy'),
        chartDate: format(day, 'MMM dd'), 
        totalTransactions: totalCount,
        successfulTransactions: successfulCount,
        "Başarı Oranı": parseFloat(successRate.toFixed(1)) 
      };
    }).reverse();
  }, [mockData, date]);

  // Karşılaştırmalı analizler için veri
  const comparisonData = useMemo(() => {
    const calcStats = (data: any[]) => {
        const total = data.length;
        const success = data.filter(t => t.isSuccess).length;
        const rate = total > 0 ? (success / total) * 100 : 0;
        return { total, success, rate: parseFloat(rate.toFixed(1)) };
    };

    const threeD = mockData.filter(t => t.is3D);
    const nonThreeD = mockData.filter(t => !t.is3D);
    const storedCard = mockData.filter(t => t.isStoredCard);
    const newCard = mockData.filter(t => !t.isStoredCard);
    const installment = mockData.filter(t => t.isInstallment);
    const cash = mockData.filter(t => !t.isInstallment);

    return {
      secure: [{ name: '3D Secure', ...calcStats(threeD)}, { name: 'Non-3D', ...calcStats(nonThreeD) }],
      card: [{ name: 'Kayıtlı Kart', ...calcStats(storedCard) }, { name: 'Yeni Kart', ...calcStats(newCard) }],
      paymentType: [
        { name: 'Peşin', ...calcStats(cash) },
        { name: 'Taksitli', ...calcStats(installment) }
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
      total: data.total,
      success: data.success,
      "Başarı Oranı": data.total > 0 ? parseFloat(((data.success / data.total) * 100).toFixed(1)) : 0,
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
      .slice(0, 10);

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
            acc[t.cardType] = { amount: 0, count: 0 };
        }
        acc[t.cardType].amount += t.amount;
        acc[t.cardType].count++;
        return acc;
    }, {} as Record<string, {amount: number, count: number}>);

    const formattedTurnoverByCardType = Object.entries(turnoverByCardType).map(([name, data]) => ({name, value: data.amount, count: data.count}));

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
    .slice(0,10);

    return { customerDistribution, turnoverByCardType: formattedTurnoverByCardType, topCustomers: formattedTopCustomers };
  }, [mockData, date, kpiMetrics.newCustomers]);

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
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="genel-performans">Genel Performans</TabsTrigger>
          <TabsTrigger value="banka-analizleri">Banka Analizleri</TabsTrigger>
          <TabsTrigger value="kullanici-ciro">Kullanıcı & Ciro</TabsTrigger>
        </TabsList>

        <TabsContent value="genel-performans" className="space-y-4">
          <Card>
              <CardHeader>
                  <CardTitle>Günlük Başarı Oranı Trendi</CardTitle>
                  <CardDescription>Seçilen tarih aralığındaki günlük işlem başarı oranı.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                 <ResponsiveContainer width="100%" height={350}>
                      <LineChart data={dailyPerformanceData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="chartDate" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                          <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `%${value}`} />
                          <Tooltip formatter={(value: number) => [`${value.toFixed(2)}%`, "Başarı Oranı"]}/>
                          <Legend />
                          <Line type="monotone" dataKey="Başarı Oranı" stroke="#2563eb" strokeWidth={2} activeDot={{ r: 8 }} />
                      </LineChart>
                  </ResponsiveContainer>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Tarih</TableHead>
                        <TableHead className="text-right">Toplam İşlem</TableHead>
                        <TableHead className="text-right">Başarılı İşlem</TableHead>
                        <TableHead className="text-right">Başarı Oranı</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {dailyPerformanceData.map((day) => (
                        <TableRow key={day.date}>
                          <TableCell>{day.date}</TableCell>
                          <TableCell className="text-right">{day.totalTransactions}</TableCell>
                          <TableCell className="text-right">{day.successfulTransactions}</TableCell>
                          <TableCell className="text-right text-blue-600 font-medium">%{day['Başarı Oranı'].toFixed(2)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
              </CardContent>
          </Card>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
            <Card>
                <CardHeader>
                    <CardTitle>3D Secure vs Non-3D</CardTitle>
                    <CardDescription>Güvenlik tipine göre başarı oranı karşılaştırması.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={comparisonData.secure}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis tickFormatter={(value) => `%${value}`} />
                      <Tooltip formatter={(value: number) => [`${value.toFixed(2)}%`, "Başarı Oranı"]}/>
                      <Bar dataKey="rate" name="Başarı Oranı" fill="#3b82f6" />
                    </BarChart>
                  </ResponsiveContainer>
                   <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Tip</TableHead>
                        <TableHead className="text-right">Toplam İşlem</TableHead>
                        <TableHead className="text-right">Başarılı İşlem</TableHead>
                        <TableHead className="text-right">Başarı Oranı</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {comparisonData.secure.map((item) => (
                        <TableRow key={item.name}>
                          <TableCell>{item.name}</TableCell>
                          <TableCell className="text-right">{item.total}</TableCell>
                          <TableCell className="text-right">{item.success}</TableCell>
                          <TableCell className="text-right text-blue-600 font-medium">%{item.rate.toFixed(2)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Kayıtlı Kart vs Yeni Kart</CardTitle>
                    <CardDescription>Kart saklama durumuna göre başarı oranı.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                   <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={comparisonData.card}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis tickFormatter={(value) => `%${value}`}/>
                      <Tooltip formatter={(value: number) => [`${value.toFixed(2)}%`, "Başarı Oranı"]}/>
                      <Bar dataKey="rate" name="Başarı Oranı" fill="#10b981" />
                    </BarChart>
                  </ResponsiveContainer>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Tip</TableHead>
                        <TableHead className="text-right">Toplam İşlem</TableHead>
                        <TableHead className="text-right">Başarılı İşlem</TableHead>
                        <TableHead className="text-right">Başarı Oranı</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {comparisonData.card.map((item) => (
                        <TableRow key={item.name}>
                          <TableCell>{item.name}</TableCell>
                          <TableCell className="text-right">{item.total}</TableCell>
                          <TableCell className="text-right">{item.success}</TableCell>
                          <TableCell className="text-right text-blue-600 font-medium">%{item.rate.toFixed(2)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
            </Card>
            <Card className="col-span-2">
              <CardHeader>
                <CardTitle>Peşin vs Taksitli</CardTitle>
                 <CardDescription>İşlem adedi ve başarı oranı karşılaştırması.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={comparisonData.paymentType}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false}/>
                    <YAxis yAxisId="left" orientation="left" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis yAxisId="right" orientation="right" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `%${value}`}/>
                    <Tooltip />
                    <Legend />
                    <Bar yAxisId="left" dataKey="total" name="İşlem Adedi" fill="#8884d8" />
                    <Line yAxisId="right" type="monotone" dataKey="rate" name="Başarı Oranı" stroke="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
                 <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Tip</TableHead>
                        <TableHead className="text-right">Toplam İşlem</TableHead>
                        <TableHead className="text-right">Başarılı İşlem</TableHead>
                        <TableHead className="text-right">Başarı Oranı</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {comparisonData.paymentType.map((item) => (
                        <TableRow key={item.name}>
                          <TableCell>{item.name}</TableCell>
                          <TableCell className="text-right">{item.total}</TableCell>
                          <TableCell className="text-right">{item.success}</TableCell>
                          <TableCell className="text-right text-blue-600 font-medium">%{item.rate.toFixed(2)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="banka-analizleri" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Banka Bazında Başarı Oranları</CardTitle>
              <CardDescription>Kartı çıkaran bankalara göre işlem başarı oranları.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={bankAnalysisData.successRateByIssuer}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} angle={-45} textAnchor="end" height={60} />
                  <YAxis tickFormatter={(value) => `%${value.toFixed(0)}`} />
                  <Tooltip formatter={(value: number) => [`${value.toFixed(2)}%`, "Başarı Oranı"]}/>
                  <Bar dataKey="Başarı Oranı" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Banka</TableHead>
                    <TableHead className="text-right">Toplam İşlem</TableHead>
                    <TableHead className="text-right">Başarılı İşlem</TableHead>
                    <TableHead className="text-right">Başarı Oranı</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bankAnalysisData.successRateByIssuer.map((item) => (
                    <TableRow key={item.name}>
                      <TableCell>{item.name}</TableCell>
                      <TableCell className="text-right">{item.total}</TableCell>
                      <TableCell className="text-right">{item.success}</TableCell>
                      <TableCell className="text-right text-blue-600 font-medium">%{item['Başarı Oranı'].toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
            <Card>
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
            <Card>
              <CardHeader>
                <CardTitle>Sık Karşılaşılan Banka Hata Kodları</CardTitle>
                <CardDescription>Seçilen periyotta en sık alınan 10 banka hata kodu ve açıklaması.</CardDescription>
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
           </div>
        </TabsContent>
        <TabsContent value="kullanici-ciro" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
                <Card>
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
                <Card>
                    <CardHeader>
                        <CardTitle>Kart Tipine Göre Ciro Dağılımı</CardTitle>
                        <CardDescription>Cironun kart tiplerine ve işlem adetlerine göre dağılımı.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
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
                        <Table>
                           <TableHeader>
                              <TableRow>
                                <TableHead>Kart Tipi</TableHead>
                                <TableHead className="text-right">İşlem Adedi</TableHead>
                                <TableHead className="text-right">Toplam Ciro</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {userAndTurnoverData.turnoverByCardType.map((item) => (
                                <TableRow key={item.name}>
                                  <TableCell>{item.name}</TableCell>
                                  <TableCell className="text-right">{item.count}</TableCell>
                                  <TableCell className="text-right">₺{item.value.toLocaleString('tr-TR', { maximumFractionDigits: 2 })}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                        </Table>
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
