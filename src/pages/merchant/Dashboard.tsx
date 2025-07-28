import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  CreditCard, 
  Shield, 
  AlertTriangle,
  DollarSign,
  BarChart3,
  PieChart,
  Activity,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  Wallet,
  FileText,
  Info
} from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Area
} from 'recharts';

// Mock data - gerçek API'den gelecek
const mockDashboardData = {
  overview: {
    totalTransactions: 1247892,
    totalVolume: 45673821.50,
    successRate: 94.8,
    fraudRate: 0.27,
    avgTransactionValue: 36.58,
    payWithHP: 892450,
    newCustomers: 28750,
    linkingRate: 89.7,
    growth: {
      transactions: 15.3,
      volume: 12.7,
      successRate: 2.1,
      fraudReduction: -18.5,
      payWithHP: 22.8,
      newCustomers: 18.4,
      linkingRate: 3.2
    }
  },
  paymentPerformance: [
    { date: '2024-01-01', successRate: 92.5, volume: 1250000 },
    { date: '2024-01-02', successRate: 94.2, volume: 1380000 },
    { date: '2024-01-03', successRate: 93.8, volume: 1420000 },
    { date: '2024-01-04', successRate: 95.1, volume: 1560000 },
    { date: '2024-01-05', successRate: 94.8, volume: 1490000 },
    { date: '2024-01-06', successRate: 96.2, volume: 1650000 },
    { date: '2024-01-07', successRate: 94.9, volume: 1580000 }
  ],
  journeyAnalytics: {
    conversionRate: 68.5,
    clickThroughRateSession: 38.7,
    linkingRate: 89.7,
    averageJourneyTime: 4.2,
    shoppingFrequency: 3.2
  },
  fraudAnalytics: {
    directRejects: 13110,
    totalTransactions: 4855556,
    monitoredTransactions: 179000,
  },
  paymentMethods: [
    { name: '3D Secure', value: 73.2, color: '#10b981' },
    { name: 'Non-3D', value: 26.8, color: '#3b82f6' }
  ],
  cashbackAnalytics: {
    totalCashbackEarned: 2850000,
    totalCashbackBurned: 1950000,
    activeCashbackUsers: 45820,
    burnRate: 68.4
  },
  bankPerformance: [
    { bank: 'Garanti BBVA', successRate: 96.2, volume: 8500000, avgTime: 2.1 },
    { bank: 'İş Bankası', successRate: 95.8, volume: 7200000, avgTime: 2.3 },
    { bank: 'Yapı Kredi', successRate: 94.9, volume: 6800000, avgTime: 2.5 },
    { bank: 'Akbank', successRate: 96.5, volume: 5900000, avgTime: 1.9 },
    { bank: 'Ziraat Bankası', successRate: 93.2, volume: 4100000, avgTime: 2.8 }
  ],
  notifications: [
    { id: 1, type: 'info', message: 'Dün toplam 1,247 işlem gerçekleştirildi (₺45,673)', time: '1 gün önce', severity: 'low' },
    { id: 2, type: 'wallet', message: 'Günlük cüzdan dekontunuz hazır - İndir', time: '2 saat önce', severity: 'medium', actionUrl: '/merchant/receipts' },
    { id: 3, type: 'statement', message: 'Aylık ekstre son ödeme tarihi: 15 Ocak 2025', time: '1 gün önce', severity: 'high', actionUrl: '/merchant/statements' },
    { id: 4, type: 'commission', message: 'Komisyon ekstresi hazırlandı - Görüntüle', time: '3 saat önce', severity: 'medium', actionUrl: '/merchant/statements' },
  ],
  recentTransactions: [
    { id: 'TRX7238', customer: 'Ali V.', amount: 149.90, status: 'success', time: '14:32' },
    { id: 'TRX7237', customer: 'Ayşe Y.', amount: 85.50, status: 'success', time: '14:28' },
    { id: 'TRX7236', customer: 'Mehmet K.', amount: 210.00, status: 'failed', time: '14:25' },
    { id: 'TRX7235', customer: 'Fatma S.', amount: 45.00, status: 'success', time: '14:19' },
    { id: 'TRX7234', customer: 'Hasan B.', amount: 320.75, status: 'success', time: '14:12' },
  ],
  paymentSource: [
    { name: 'Cüzdan', value: 45, color: '#f59e0b' },
    { name: 'Saklı Kart', value: 35, color: '#8b5cf6' },
    { name: 'Kart Formu', value: 20, color: '#3b82f6' },
  ]
};

const Card = ({ children, className = '' }: { children: React.ReactNode, className?: string }) => (
  <div className={`bg-white rounded-xl border border-gray-200 p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${className}`}>
    {children}
  </div>
);

const MetricCard = ({ 
  title, 
  value, 
  change, 
  changeType = 'positive', 
  icon: Icon, 
  prefix = '', 
  suffix = '',
  subtitle 
}: {
  title: string;
  value: string | number;
  change?: number;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon: any;
  prefix?: string;
  suffix?: string;
  subtitle?: string;
}) => {
  const getChangeColor = () => {
    if (changeType === 'positive') return 'text-green-600';
    if (changeType === 'negative') return 'text-red-600';
    return 'text-gray-600';
  };

  const getChangeIcon = () => {
    if (changeType === 'positive') return TrendingUp;
    if (changeType === 'negative') return TrendingDown;
    return Activity;
  };

  const ChangeIcon = getChangeIcon();

  return (
    <Card className="p-4">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-xl font-bold text-gray-900 mt-1">
            {prefix}{typeof value === 'number' ? value.toLocaleString() : value}{suffix}
          </p>
        </div>
        <div className="p-2 bg-blue-100 rounded-lg">
          <Icon className="h-5 w-5 text-blue-600" />
        </div>
      </div>
      <div className="flex items-end justify-between mt-2">
        <p className="text-xs text-gray-500">{subtitle}</p>
        {change !== undefined && (
          <div className={`flex items-center space-x-1 text-xs font-medium ${getChangeColor()}`}>
            <ChangeIcon className="h-4 w-4" />
            <span>{Math.abs(change)}%</span>
          </div>
        )}
      </div>
    </Card>
  );
};

const getNotificationIcon = (type: string) => {
  switch (type) {
    case 'wallet': return <Wallet className="h-5 w-5 text-blue-500" />;
    case 'statement': return <FileText className="h-5 w-5 text-purple-500" />;
    case 'commission': return <DollarSign className="h-5 w-5 text-green-500" />;
    case 'info':
    default:
      return <Info className="h-5 w-5 text-gray-500" />;
  }
};

export default function MerchantDashboard() {
  const navigate = useNavigate();
  const [dateRange, setDateRange] = useState('7d');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const { overview, paymentPerformance, journeyAnalytics, fraudAnalytics, paymentMethods, notifications, cashbackAnalytics, bankPerformance } = mockDashboardData;

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/80 backdrop-blur-sm p-3 rounded-lg border border-gray-200 shadow-lg">
          <p className="text-sm font-bold text-gray-800">{new Date(label).toLocaleDateString('tr-TR', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
          {payload.map((pld: any) => (
            <div key={pld.dataKey} style={{ color: pld.color }} className="text-sm flex items-center justify-between space-x-4 mt-1">
              <span>{pld.name === 'successRate' ? 'Başarı Oranı' : 'Hacim'}:</span>
              <span className="font-bold">{pld.name === 'successRate' ? `${pld.value}%` : `₺${pld.value.toLocaleString()}`}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Kontrol Paneli</h1>
              <p className="text-gray-600 mt-1">Ödeme performansı genel görünümü</p>
            </div>
            <div className="flex items-center space-x-4">
              <select value={dateRange} onChange={(e) => setDateRange(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                <option value="7d">Son 7 Gün</option>
                <option value="30d">Son 30 Gün</option>
              </select>
              <button onClick={() => navigate('/merchant/reports')} className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <Eye className="h-4 w-4 mr-2" />
                Raporları Görüntüle
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard title="Toplam İşlem" value={overview.totalTransactions} change={overview.growth.transactions} icon={Activity} />
          <MetricCard title="İşlem Hacmi" value={overview.totalVolume} change={overview.growth.volume} icon={DollarSign} prefix="₺" />
          <MetricCard title="Başarı Oranı" value={overview.successRate} change={overview.growth.successRate} icon={CheckCircle} suffix="%" />
          <MetricCard title="Pay with HP" value={overview.payWithHP} change={overview.growth.payWithHP} icon={CreditCard} />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard title="Yeni Müşteri" value={overview.newCustomers} change={overview.growth.newCustomers} icon={Users} />
          <MetricCard title="Linkleme Oranı" value={overview.linkingRate} change={overview.growth.linkingRate} icon={PieChart} suffix="%" />
          <MetricCard title="Fraud Oranı" value={overview.fraudRate} change={overview.growth.fraudReduction} changeType="negative" icon={Shield} suffix="%" />
          <MetricCard title="Cashback Burn" value={cashbackAnalytics.burnRate} change={-5.2} icon={DollarSign} suffix="%" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Müşteri Yolculuğu</h3>
            <div className="grid grid-cols-2 gap-4 h-full">
                {[
                  { title: 'Dönüşüm Oranı', value: `${journeyAnalytics.conversionRate}%`, icon: <TrendingUp/>, color: 'blue' },
                  { title: 'CTR (Session)', value: `${journeyAnalytics.clickThroughRateSession}%`, icon: <BarChart3/>, color: 'green' },
                  { title: 'Alışveriş Frekansı', value: journeyAnalytics.shoppingFrequency, icon: <Users/>, color: 'purple' },
                  { title: 'Ort. Yolculuk Süresi', value: `${journeyAnalytics.averageJourneyTime}dk`, icon: <Clock/>, color: 'orange' },
                ].map(item => (
                  <div key={item.title} className={`p-4 rounded-lg flex items-center justify-between bg-gradient-to-br from-${item.color}-50 to-${item.color}-100`}>
                    <div>
                      <p className="text-sm font-medium text-gray-700">{item.title}</p>
                      <p className={`text-2xl font-bold text-${item.color}-600`}>{item.value}</p>
                    </div>
                    <div className={`text-${item.color}-500`}>{item.icon}</div>
                  </div>
                ))}
            </div>
          </Card>
           
           <Card className="flex flex-col h-full p-0">
             <div className="p-6 bg-gradient-to-br from-gray-700 to-gray-900 text-white rounded-t-xl">
                <h3 className="text-lg font-semibold text-white mb-4">Günlük Özet</h3>
                <div className="flex justify-between text-center">
                  <div>
                    <p className="text-2xl font-bold">1,247</p>
                    <p className="text-xs text-gray-300">Bugünkü İşlem</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold">₺45.6K</p>
                    <p className="text-xs text-gray-300">Günlük Hacim</p>
                  </div>
                   <div>
                    <p className="text-2xl font-bold">28</p>
                    <p className="text-xs text-gray-300">Yeni Kullanıcı</p>
                  </div>
                </div>
             </div>
             <div className="p-6 flex-grow">
               <h4 className="text-sm font-semibold text-gray-600 mb-3">Son İşlemler</h4>
               <div className="space-y-3">
                 {mockDashboardData.recentTransactions.map(tx => (
                   <div key={tx.id} className="flex items-center justify-between text-sm">
                     <div className="flex items-center space-x-3">
                       {tx.status === 'success' ? <CheckCircle className="h-5 w-5 text-green-500" /> : <XCircle className="h-5 w-5 text-red-500" />}
                       <div>
                         <p className="font-medium text-gray-800">{tx.customer}</p>
                         <p className="text-xs text-gray-400">{tx.id}</p>
                       </div>
                     </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-800">₺{tx.amount.toFixed(2)}</p>
                        <p className="text-xs text-gray-400">{tx.time}</p>
                      </div>
                   </div>
                 ))}
               </div>
             </div>
             <div className="p-6 pt-0">
                <button onClick={() => navigate('/merchant/receipts')} className="w-full text-center py-2 text-sm text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 font-medium">
                  Tüm İşlemleri Görüntüle
                </button>
             </div>
           </Card>

            <Card className="flex flex-col h-full">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Bildirimler</h3>
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">{notifications.length} yeni</span>
              </div>
              <div className="space-y-3 flex-grow overflow-y-auto pr-2">
                {notifications.map((notification) => (
                  <div key={notification.id} className={`flex items-start space-x-3 p-3 rounded-lg border cursor-pointer hover:shadow-md hover:border-blue-300 ${notification.severity === 'high' ? 'bg-red-50 border-red-200' : 'bg-gray-50 border-gray-200'}`}>
                    <div className="flex-shrink-0 pt-1">{getNotificationIcon(notification.type)}</div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">{notification.message}</p>
                      <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full mt-4 text-center text-sm text-blue-600 hover:text-blue-700 font-medium">Tümünü Gör</button>
            </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-1 flex flex-col">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Ödeme Başarı Trendi</h3>
            <div className="flex-grow" style={{ height: '350px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={paymentPerformance} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                  <defs>
                    <linearGradient id="colorSuccess" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                  <XAxis dataKey="date" tickFormatter={(d) => new Date(d).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' })} tick={{ fill: '#6b7280', fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis tickFormatter={(v) => `${v}%`} tick={{ fill: '#6b7280', fontSize: 10 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="successRate" stroke="#10b981" strokeWidth={2} fill="url(#colorSuccess)" name="Başarı Oranı" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className="flex flex-col">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Cashback Analizi</h3>
            <div className="space-y-4 flex-grow flex flex-col justify-center">
              <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                <div className="flex items-center space-x-3"><TrendingUp className="text-green-500"/><p className="text-sm font-medium text-green-700">Kazanılan</p></div>
                <p className="text-lg font-bold text-green-600">₺{(cashbackAnalytics.totalCashbackEarned / 1000).toFixed(0)}K</p>
              </div>
              <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg">
                <div className="flex items-center space-x-3"><TrendingDown className="text-yellow-500"/><p className="text-sm font-medium text-yellow-700">Kullanılan</p></div>
                <p className="text-lg font-bold text-yellow-600">₺{(cashbackAnalytics.totalCashbackBurned / 1000).toFixed(0)}K</p>
              </div>
              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center space-x-3"><Users className="text-blue-500"/><p className="text-sm font-medium text-blue-700">Aktif Kullanıcı</p></div>
                <p className="text-lg font-bold text-blue-600">{cashbackAnalytics.activeCashbackUsers.toLocaleString()}</p>
              </div>
            </div>
          </Card>
          
          <Card className="flex flex-col">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Banka Performansı</h3>
            <div className="space-y-2 flex-grow">
              {bankPerformance.map((bank) => (
                <div key={bank.bank} className="flex-grow">
                  <div className="flex items-center justify-between text-sm mb-1">
                    <p className="font-medium text-gray-700">{bank.bank}</p>
                    <p className="font-semibold text-green-600">{bank.successRate}%</p>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div className="bg-green-500 h-1.5 rounded-full" style={{ width: `${bank.successRate}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Fraud Analizi</h3>
            <div className="space-y-4">
              <div className="bg-red-50 p-4 rounded-lg flex items-center space-x-4">
                <Shield className="h-8 w-8 text-red-500"/>
                <div>
                  <p className="text-sm font-medium text-red-700">Direkt Reddedilen İşlemler</p>
                  <p className="text-2xl font-bold text-red-600">{fraudAnalytics.directRejects.toLocaleString()}</p>
                </div>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg flex items-center space-x-4">
                <Eye className="h-8 w-8 text-yellow-500"/>
                <div>
                  <p className="text-sm font-medium text-yellow-700">İzlenen Riskli İşlemler</p>
                  <p className="text-2xl font-bold text-yellow-600">{fraudAnalytics.monitoredTransactions.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </Card>
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Ödeme Tipleri</h3>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie data={paymentMethods} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={70} paddingAngle={5}>
                    {paymentMethods.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                  </Pie>
                  <Tooltip formatter={(value:any) => `${value.toFixed(1)}%`} />
                  <Legend iconType="circle" iconSize={8} />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
          </Card>
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Ödeme Kaynakları</h3>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie data={mockDashboardData.paymentSource} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={70} paddingAngle={5}>
                    {mockDashboardData.paymentSource.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                  </Pie>
                  <Tooltip formatter={(value:any) => `${value.toFixed(1)}%`} />
                  <Legend iconType="circle" iconSize={8} />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
} 