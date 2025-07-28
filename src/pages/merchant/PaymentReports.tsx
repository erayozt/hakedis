import React, { useState, useEffect } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  Legend,
  ComposedChart
} from 'recharts';
import {
  Download,
  Filter,
  Calendar,
  TrendingUp,
  TrendingDown,
  Users,
  Shield,
  CreditCard,
  AlertTriangle,
  CheckCircle,
  Clock,
  DollarSign,
  Eye,
  FileText,
  RefreshCw,
  Activity
} from 'lucide-react';

// Mock data for detailed reports
const mockReportData = {
  overview: {
    payWithHP: 892450,
    payWithHPGrowth: 22.8,
    newCustomers: 28750,
    newCustomersGrowth: 18.4,
    linkingRate: 89.7,
    linkingRateGrowth: 3.2,
    shoppingFrequency: 3.2,
    shoppingFrequencyGrowth: 8.4
  },
  paymentPerformance: {
    daily: [
      { date: '2024-01-01', successRate: 92.5, volume: 1250000, transactions: 34120, fraudRate: 0.25 },
      { date: '2024-01-02', successRate: 94.2, volume: 1380000, transactions: 37650, fraudRate: 0.18 },
      { date: '2024-01-03', successRate: 93.8, volume: 1420000, transactions: 38940, fraudRate: 0.32 },
      { date: '2024-01-04', successRate: 95.1, volume: 1560000, transactions: 42580, fraudRate: 0.15 },
      { date: '2024-01-05', successRate: 94.8, volume: 1490000, transactions: 40720, fraudRate: 0.28 },
      { date: '2024-01-06', successRate: 96.2, volume: 1650000, transactions: 45130, fraudRate: 0.12 },
      { date: '2024-01-07', successRate: 94.9, volume: 1580000, transactions: 43210, fraudRate: 0.22 }
    ],
    hourly: [
      { hour: '00:00', transactions: 1250, successRate: 95.2 },
      { hour: '01:00', transactions: 980, successRate: 94.8 },
      { hour: '02:00', transactions: 750, successRate: 93.5 },
      { hour: '03:00', transactions: 620, successRate: 92.1 },
      { hour: '04:00', transactions: 580, successRate: 91.8 },
      { hour: '05:00', transactions: 720, successRate: 93.2 },
      { hour: '06:00', transactions: 1100, successRate: 94.5 },
      { hour: '07:00', transactions: 1850, successRate: 95.8 },
      { hour: '08:00', transactions: 2400, successRate: 96.2 },
      { hour: '09:00', transactions: 2800, successRate: 95.9 },
      { hour: '10:00', transactions: 3200, successRate: 96.1 },
      { hour: '11:00', transactions: 3450, successRate: 95.7 },
      { hour: '12:00', transactions: 3800, successRate: 96.3 },
      { hour: '13:00', transactions: 3650, successRate: 95.4 },
      { hour: '14:00', transactions: 3900, successRate: 96.0 },
      { hour: '15:00', transactions: 4100, successRate: 95.8 },
      { hour: '16:00', transactions: 4350, successRate: 96.1 },
      { hour: '17:00', transactions: 4200, successRate: 95.6 },
      { hour: '18:00', transactions: 3850, successRate: 95.9 },
      { hour: '19:00', transactions: 3200, successRate: 95.2 },
      { hour: '20:00', transactions: 2750, successRate: 94.8 },
      { hour: '21:00', transactions: 2200, successRate: 94.3 },
      { hour: '22:00', transactions: 1800, successRate: 93.9 },
      { hour: '23:00', transactions: 1400, successRate: 93.5 }
    ]
  },
  journeyFunnel: [
    { stage: 'Ödeme Başlatıldı', users: 100000, percentage: 100, dropoff: 0 },
    { stage: 'Ödeme Yöntemi Seçildi', users: 85000, percentage: 85, dropoff: 15 },
    { stage: 'Kart Bilgileri Girildi', users: 72000, percentage: 72, dropoff: 13 },
    { stage: '3DS Doğrulaması', users: 68000, percentage: 68, dropoff: 4 },
    { stage: 'Ödeme Yetkilendirildi', users: 64600, percentage: 64.6, dropoff: 3.4 },
    { stage: 'Ödeme Tamamlandı', users: 62800, percentage: 62.8, dropoff: 1.8 }
  ],
  fraudAnalytics: {
    byType: [
      { type: 'Stolen Card', count: 1250, percentage: 45.2, avgLoss: 85.50 },
      { type: 'Account Takeover', count: 780, percentage: 28.1, avgLoss: 125.75 },
      { type: 'Synthetic ID', count: 420, percentage: 15.2, avgLoss: 95.25 },
      { type: 'Card Testing', count: 200, percentage: 7.2, avgLoss: 15.80 },
      { type: 'Other', count: 120, percentage: 4.3, avgLoss: 45.30 }
    ],
    byChannel: [
      { channel: 'Mobil Uygulama', transactions: 45000, fraudCount: 125, rate: 0.28 },
      { channel: 'Web Masaüstü', transactions: 38000, fraudCount: 95, rate: 0.25 },
      { channel: 'Mobil Web', transactions: 32000, fraudCount: 110, rate: 0.34 },
      { channel: 'API/Backend', transactions: 15000, fraudCount: 45, rate: 0.30 }
    ]
  },
  paymentMethods: {
    distribution: [
      { method: 'Kredi Kartı', usage: 68.5, successRate: 94.8, avgValue: 125.50 },
      { method: 'Banka Kartı', usage: 22.3, successRate: 96.2, avgValue: 78.25 },
      { method: 'Dijital Cüzdan', usage: 6.8, successRate: 97.1, avgValue: 95.75 },
      { method: 'Banka Transferi', usage: 2.4, successRate: 98.5, avgValue: 285.30 }
    ],
    secure3D: [
      { method: '3D Secure', count: 73200, successRate: 95.8, avgTime: 12.5 },
      { method: 'Non-3D', count: 26800, successRate: 93.2, avgTime: 3.2 }
    ],
    storedCard: [
      { type: 'Saklı Kart', count: 45200, successRate: 97.2, avgTime: 1.8 },
      { type: 'Kart Formu', count: 54800, successRate: 94.1, avgTime: 8.5 }
    ],
    bankPerformance: [
      { bank: 'Garanti BBVA', successRate: 96.2, volume: 8500000, avgTime: 2.1, 
        secure3D: 95.8, nonSecure3D: 96.8, storedCard: 97.5 },
      { bank: 'İş Bankası', successRate: 95.8, volume: 7200000, avgTime: 2.3, 
        secure3D: 95.2, nonSecure3D: 96.5, storedCard: 97.1 },
      { bank: 'Yapı Kredi', successRate: 94.9, volume: 6800000, avgTime: 2.5, 
        secure3D: 94.5, nonSecure3D: 95.4, storedCard: 96.8 },
      { bank: 'Akbank', successRate: 96.5, volume: 5900000, avgTime: 1.9, 
        secure3D: 96.1, nonSecure3D: 96.9, storedCard: 97.8 },
      { bank: 'Ziraat Bankası', successRate: 93.2, volume: 4100000, avgTime: 2.8, 
        secure3D: 92.8, nonSecure3D: 93.7, storedCard: 95.2 }
    ]
  },
  cashbackAnalytics: {
    earned: [
      { month: 'Ocak', amount: 450000, users: 8500 },
      { month: 'Şubat', amount: 520000, users: 9200 },
      { month: 'Mart', amount: 580000, users: 9800 },
      { month: 'Nisan', amount: 620000, users: 10500 },
      { month: 'Mayıs', amount: 680000, users: 11200 },
      { month: 'Haziran', amount: 720000, users: 11800 }
    ],
    burned: [
      { month: 'Ocak', amount: 290000, burnRate: 64.4 },
      { month: 'Şubat', amount: 340000, burnRate: 65.4 },
      { month: 'Mart', amount: 395000, burnRate: 68.1 },
      { month: 'Nisan', amount: 425000, burnRate: 68.5 },
      { month: 'Mayıs', amount: 470000, burnRate: 69.1 },
      { month: 'Haziran', amount: 500000, burnRate: 69.4 }
    ],
    summary: {
      totalEarned: 3570000,
      totalBurned: 2420000,
      overallBurnRate: 67.8,
      activeUsers: 45820,
      avgPerUser: 77.9
         }
   }
};

const CHART_COLORS = {
  primary: '#3b82f6',
  secondary: '#10b981',
  tertiary: '#f59e0b',
  danger: '#ef4444',
  purple: '#8b5cf6',
  indigo: '#6366f1',
  pink: '#ec4899',
  teal: '#14b8a6'
};

const ReportCard = ({ title, children, className = '' }: { title: string; children: React.ReactNode; className?: string }) => (
  <div className={`bg-white rounded-xl border border-gray-200 p-6 ${className}`}>
    <h3 className="text-lg font-semibold text-gray-900 mb-6">{title}</h3>
    {children}
  </div>
);

const StatCard = ({ 
  icon: Icon, 
  title, 
  value, 
  change, 
  changeType = 'positive',
  subtitle 
}: {
  icon: any;
  title: string;
  value: string;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  subtitle?: string;
}) => {
  const getChangeColor = () => {
    if (changeType === 'positive') return 'text-green-600';
    if (changeType === 'negative') return 'text-red-600';
    return 'text-gray-600';
  };

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 rounded-lg p-4 border border-gray-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Icon className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-xl font-bold text-gray-900">{value}</p>
            {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
          </div>
        </div>
        {change && (
          <div className={`text-right ${getChangeColor()}`}>
            <p className="text-sm font-medium">{change}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default function PaymentReports() {
  const [dateRange, setDateRange] = useState('7d');
  const [selectedReport, setSelectedReport] = useState('overview');
  const [isLoading, setIsLoading] = useState(false);

  const generateReport = async () => {
    setIsLoading(true);
    // Simulate report generation
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Ödeme Analizi ve Raporları</h1>
              <p className="text-gray-600 mt-1">Detaylı ödeme performansı ve fraud analizi</p>
            </div>
            <div className="flex items-center space-x-4">
              <select 
                value={dateRange} 
                onChange={(e) => setDateRange(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="1d">Son 24 Saat</option>
                <option value="7d">Son 7 Gün</option>
                <option value="30d">Son 30 Gün</option>
                <option value="90d">Son 90 Gün</option>
                <option value="custom">Özel Tarih</option>
              </select>
              <button 
                onClick={generateReport}
                disabled={isLoading}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {isLoading ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <FileText className="h-4 w-4 mr-2" />}
                {isLoading ? 'Oluşturuluyor...' : 'Rapor Oluştur'}
              </button>
              <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                <Download className="h-4 w-4 mr-2" />
                Dışa Aktar
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Report Navigation */}
        <div className="mb-6">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', name: 'Genel Bakış', icon: Eye },
              { id: 'performance', name: 'Performans', icon: TrendingUp },
              { id: 'journey', name: 'Müşteri Yolculuğu', icon: Users },
              { id: 'fraud', name: 'Fraud Analizi', icon: Shield },
              { id: 'methods', name: 'Ödeme Yöntemleri', icon: CreditCard },
              { id: 'cashback', name: 'Cashback Analizi', icon: DollarSign }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setSelectedReport(tab.id)}
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    selectedReport === tab.id
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {tab.name}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Overview Tab */}
        {selectedReport === 'overview' && (
          <div className="space-y-6">
            {/* Key Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              <StatCard
                icon={DollarSign}
                title="Toplam Hacim"
                value="₺2.4M"
                change="+12.5%"
                changeType="positive"
                subtitle="Son 7 gün"
              />
              <StatCard
                icon={CheckCircle}
                title="Başarı Oranı"
                value="94.8%"
                change="+2.1%"
                changeType="positive"
                subtitle="Yetkilendirme oranı"
              />
              <StatCard
                icon={CreditCard}
                title="Pay with HP"
                value={mockReportData.overview.payWithHP.toLocaleString()}
                change={`+${mockReportData.overview.payWithHPGrowth}%`}
                changeType="positive"
                subtitle="HP ile ödeme"
              />
              <StatCard
                icon={Users}
                title="Yeni Müşteri"
                value={mockReportData.overview.newCustomers.toLocaleString()}
                change={`+${mockReportData.overview.newCustomersGrowth}%`}
                changeType="positive"
                subtitle="Son 30 gün"
              />
              <StatCard
                icon={Shield}
                title="Linkleme Oranı"
                value={`${mockReportData.overview.linkingRate}%`}
                change={`+${mockReportData.overview.linkingRateGrowth}%`}
                changeType="positive"
                subtitle="Kart bağlama"
              />
            </div>

            {/* Secondary Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                icon={Activity}
                title="Alışveriş Frekansı"
                value={`${mockReportData.overview.shoppingFrequency}`}
                change={`+${mockReportData.overview.shoppingFrequencyGrowth}%`}
                changeType="positive"
                subtitle="Aylık HP müşteri"
              />
              <StatCard
                icon={Shield}
                title="Fraud Tespiti"
                value="0.27%"
                change="-18.5%"
                changeType="positive"
                subtitle="Fraud oranı"
              />
              <StatCard
                icon={Clock}
                title="Ort. İşleme Süresi"
                value="2.4s"
                change="-0.8s"
                changeType="positive"
                subtitle="Yanıt süresi"
              />
              <StatCard
                icon={DollarSign}
                title="Cashback Burn"
                value={`${mockReportData.cashbackAnalytics.summary.overallBurnRate}%`}
                change="+2.8%"
                changeType="positive"
                subtitle="Kullanım oranı"
              />
            </div>

            {/* Combined Performance Chart */}
            <ReportCard title="Ödeme Performansı Trendi">
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={mockReportData.paymentPerformance.daily}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="date" 
                      tickFormatter={(value) => new Date(value).toLocaleDateString('tr-TR', { month: 'short', day: 'numeric' })}
                    />
                    <YAxis yAxisId="rate" orientation="left" />
                    <YAxis yAxisId="volume" orientation="right" />
                    <Tooltip 
                      labelFormatter={(value) => new Date(value).toLocaleDateString('tr-TR')}
                      formatter={(value: any, name: string) => {
                        if (name === 'volume') return [`₺${(value/1000).toFixed(0)}K`, 'Hacim'];
                        if (name === 'successRate') return [`${value}%`, 'Başarı Oranı'];
                        if (name === 'fraudRate') return [`${value}%`, 'Fraud Oranı'];
                        return [value, name];
                      }}
                    />
                    <Legend />
                    <Bar yAxisId="volume" dataKey="volume" fill={CHART_COLORS.primary} opacity={0.3} />
                    <Line yAxisId="rate" type="monotone" dataKey="successRate" stroke={CHART_COLORS.secondary} strokeWidth={3} />
                    <Line yAxisId="rate" type="monotone" dataKey="fraudRate" stroke={CHART_COLORS.danger} strokeWidth={2} />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </ReportCard>

            {/* Bank Performance Analysis */}
            <ReportCard title="Banka Performansı Detaylı Analiz">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Banka
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Genel Başarı
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        3D Secure
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Non-3D
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Saklı Kart
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Hacim
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ort. Süre
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {mockReportData.paymentMethods.bankPerformance.map((bank) => (
                      <tr key={bank.bank} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-medium text-gray-900">{bank.bank}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            bank.successRate >= 96 ? 'bg-green-100 text-green-800' :
                            bank.successRate >= 94 ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {bank.successRate}%
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {bank.secure3D}%
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {bank.nonSecure3D}%
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {bank.storedCard}%
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ₺{(bank.volume / 1000000).toFixed(1)}M
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {bank.avgTime}s
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </ReportCard>
          </div>
        )}

        {/* Cashback Tab */}
        {selectedReport === 'cashback' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ReportCard title="Cashback Kazanımları">
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={mockReportData.cashbackAnalytics.earned}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip formatter={(value: any) => [`₺${value.toLocaleString()}`, 'Kazanılan']} />
                      <Area type="monotone" dataKey="amount" stroke={CHART_COLORS.primary} fill={CHART_COLORS.primary} fillOpacity={0.3} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </ReportCard>

              <ReportCard title="Cashback Burn Rate">
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={mockReportData.cashbackAnalytics.burned}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="month" />
                      <YAxis yAxisId="amount" orientation="left" />
                      <YAxis yAxisId="rate" orientation="right" />
                      <Tooltip />
                      <Bar yAxisId="amount" dataKey="amount" fill={CHART_COLORS.secondary} />
                      <Line yAxisId="rate" type="monotone" dataKey="burnRate" stroke={CHART_COLORS.danger} strokeWidth={3} />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </ReportCard>
            </div>

            {/* Cashback Summary */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-xl p-6">
                <h4 className="text-lg font-semibold text-green-900 mb-2">Toplam Kazanılan</h4>
                <p className="text-3xl font-bold text-green-700">₺{(mockReportData.cashbackAnalytics.summary.totalEarned / 1000000).toFixed(1)}M</p>
                <p className="text-sm text-green-600 mt-1">Son 6 ay</p>
              </div>
              <div className="bg-gradient-to-br from-orange-50 to-amber-100 rounded-xl p-6">
                <h4 className="text-lg font-semibold text-orange-900 mb-2">Toplam Kullanılan</h4>
                <p className="text-3xl font-bold text-orange-700">₺{(mockReportData.cashbackAnalytics.summary.totalBurned / 1000000).toFixed(1)}M</p>
                <p className="text-sm text-orange-600 mt-1">Burn rate: {mockReportData.cashbackAnalytics.summary.overallBurnRate}%</p>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl p-6">
                <h4 className="text-lg font-semibold text-blue-900 mb-2">Aktif Kullanıcı</h4>
                <p className="text-3xl font-bold text-blue-700">{mockReportData.cashbackAnalytics.summary.activeUsers.toLocaleString()}</p>
                <p className="text-sm text-blue-600 mt-1">Cashback kullanan</p>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-violet-100 rounded-xl p-6">
                <h4 className="text-lg font-semibold text-purple-900 mb-2">Kullanıcı Başına</h4>
                <p className="text-3xl font-bold text-purple-700">₺{mockReportData.cashbackAnalytics.summary.avgPerUser}</p>
                <p className="text-sm text-purple-600 mt-1">Ortalama cashback</p>
              </div>
            </div>
          </div>
        )}

        {/* Performance Tab */}
        {selectedReport === 'performance' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ReportCard title="Günlük Performans">
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={mockReportData.paymentPerformance.daily}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="date" tickFormatter={(value) => new Date(value).toLocaleDateString('tr-TR', { day: 'numeric' })} />
                      <YAxis />
                      <Tooltip />
                      <Area type="monotone" dataKey="successRate" stroke={CHART_COLORS.primary} fill={CHART_COLORS.primary} fillOpacity={0.3} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </ReportCard>

              <ReportCard title="Saatlik İşlem Kalıbı">
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={mockReportData.paymentPerformance.hourly}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="hour" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="transactions" fill={CHART_COLORS.secondary} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </ReportCard>
            </div>
          </div>
        )}

        {/* Journey Tab */}
        {selectedReport === 'journey' && (
          <div className="space-y-6">
            <ReportCard title="Dönüşüm Huni Analizi">
              <div className="space-y-4">
                {mockReportData.journeyFunnel.map((stage, index) => (
                  <div key={stage.stage} className="flex items-center space-x-4">
                    <div className="w-32 text-sm font-medium text-gray-700">{stage.stage}</div>
                    <div className="flex-1 bg-gray-200 rounded-full h-6 relative">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-blue-600 h-6 rounded-full flex items-center justify-center"
                        style={{ width: `${stage.percentage}%` }}
                      >
                        <span className="text-white text-xs font-medium">{stage.percentage}%</span>
                      </div>
                    </div>
                    <div className="w-20 text-sm text-gray-600">{stage.users.toLocaleString()}</div>
                    {index > 0 && (
                      <div className="w-16 text-sm text-red-600">-{stage.dropoff}%</div>
                    )}
                  </div>
                ))}
              </div>
            </ReportCard>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl p-6">
                <h4 className="text-lg font-semibold text-blue-900 mb-2">Dönüşüm Oranı</h4>
                <p className="text-3xl font-bold text-blue-700">62.8%</p>
                <p className="text-sm text-blue-600 mt-1">Genel tamamlanma oranı</p>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-xl p-6">
                <h4 className="text-lg font-semibold text-green-900 mb-2">Ort. Yolculuk Süresi</h4>
                <p className="text-3xl font-bold text-green-700">4.2dk</p>
                <p className="text-sm text-green-600 mt-1">Başlangıçtan tamamlanmaya</p>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-violet-100 rounded-xl p-6">
                <h4 className="text-lg font-semibold text-purple-900 mb-2">Terk Etme Oranı</h4>
                <p className="text-3xl font-bold text-purple-700">37.2%</p>
                <p className="text-sm text-purple-600 mt-1">Tamamlamayan kullanıcılar</p>
              </div>
            </div>
          </div>
        )}

        {/* Fraud Tab */}
        {selectedReport === 'fraud' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ReportCard title="Türe Göre Fraud">
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={mockReportData.fraudAnalytics.byType}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={120}
                        paddingAngle={5}
                        dataKey="percentage"
                      >
                        {mockReportData.fraudAnalytics.byType.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={Object.values(CHART_COLORS)[index]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: any) => `${value}%`} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </ReportCard>

              <ReportCard title="Kanala Göre Fraud Oranı">
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={mockReportData.fraudAnalytics.byChannel}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="channel" />
                      <YAxis />
                      <Tooltip formatter={(value: any) => `${value}%`} />
                      <Bar dataKey="rate" fill={CHART_COLORS.danger} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </ReportCard>
            </div>

            {/* Fraud Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-red-50 rounded-lg p-6 border border-red-200">
                <div className="flex items-center">
                  <AlertTriangle className="h-8 w-8 text-red-600 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-red-700">Toplam Fraud Denemesi</p>
                    <p className="text-2xl font-bold text-red-900">2,770</p>
                    <p className="text-xs text-red-600 mt-1">Toplam işlemlerin %0.27'si</p>
                  </div>
                </div>
              </div>
              <div className="bg-yellow-50 rounded-lg p-6 border border-yellow-200">
                <div className="flex items-center">
                  <Eye className="h-8 w-8 text-yellow-600 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-yellow-700">İzlem Altında</p>
                    <p className="text-2xl font-bold text-yellow-900">179,000</p>
                    <p className="text-xs text-yellow-600 mt-1">İnceleme için işaretlenen %2.6</p>
                  </div>
                </div>
              </div>
              <div className="bg-green-50 rounded-lg p-6 border border-green-200">
                <div className="flex items-center">
                  <CheckCircle className="h-8 w-8 text-green-600 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-green-700">Yanlış Pozitif Oranı</p>
                    <p className="text-2xl font-bold text-green-900">2.1%</p>
                    <p className="text-xs text-green-600 mt-1">Engellenen meşru işlemler</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Payment Methods Tab */}
        {selectedReport === 'methods' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <ReportCard title="Ödeme Yöntemi Dağılımı">
                <div className="space-y-4">
                  {mockReportData.paymentMethods.distribution.map((method, index) => (
                    <div key={method.method} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div 
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: Object.values(CHART_COLORS)[index] }}
                        ></div>
                        <span className="font-medium text-gray-900">{method.method}</span>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">{method.usage}%</p>
                        <p className="text-sm text-gray-600">%{method.successRate} başarı</p>
                      </div>
                    </div>
                  ))}
                </div>
              </ReportCard>

              <ReportCard title="3D Secure vs Non-3D">
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={mockReportData.paymentMethods.secure3D} layout="horizontal">
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis type="number" />
                      <YAxis dataKey="method" type="category" />
                      <Tooltip />
                      <Bar dataKey="count" fill={CHART_COLORS.primary} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </ReportCard>

              <ReportCard title="Saklı Kart vs Kart Formu">
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={mockReportData.paymentMethods.storedCard}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="type" />
                      <YAxis />
                      <Tooltip formatter={(value: any, name: string) => [
                        name === 'successRate' ? `${value}%` : value,
                        name === 'successRate' ? 'Başarı Oranı' : name
                      ]} />
                      <Bar dataKey="successRate" fill={CHART_COLORS.secondary} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </ReportCard>
            </div>

            {/* 3DS Performance Comparison */}
            <ReportCard title="3D Secure Performans Karşılaştırması">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-6 bg-gradient-to-br from-green-50 to-emerald-100 rounded-lg">
                  <h4 className="text-lg font-semibold text-green-900">3D Secure</h4>
                  <p className="text-3xl font-bold text-green-700 mt-2">95.8%</p>
                  <p className="text-sm text-green-600 mt-1">Başarı Oranı</p>
                  <p className="text-xs text-green-500 mt-2">Ort. Süre: 12.5s</p>
                </div>
                <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg">
                  <h4 className="text-lg font-semibold text-blue-900">Non-3D</h4>
                  <p className="text-3xl font-bold text-blue-700 mt-2">93.2%</p>
                  <p className="text-sm text-blue-600 mt-1">Başarı Oranı</p>
                  <p className="text-xs text-blue-500 mt-2">Ort. Süre: 3.2s</p>
                </div>
                <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-violet-100 rounded-lg">
                  <h4 className="text-lg font-semibold text-purple-900">Öneri</h4>
                  <p className="text-lg font-bold text-purple-700 mt-2">Karma Strateji</p>
                  <p className="text-sm text-purple-600 mt-1">Risk tabanlı yönlendirme</p>
                  <p className="text-xs text-purple-500 mt-2">Güvenlik ve UX optimizasyonu</p>
                </div>
              </div>
            </ReportCard>
          </div>
        )}
      </div>
    </div>
  );
} 