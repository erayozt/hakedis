import { useState, useEffect } from 'react';
import { CreditCard, Wallet, Calendar, Clock, Users, UserCheck, UserX, BarChart3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { userService } from '../../services/userService';
import { cn } from '../../utils/format';

interface DashboardStats {
  dau: number;
  mau: number;
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  roleDistribution: { name: string; count: number }[];
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const data = await userService.getDashboardStats();
        setStats(data);
      } catch (error) {
        console.error("Failed to fetch dashboard stats", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);


  const StatCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode; onClick?: () => void, color: string }> = ({ title, value, icon, onClick, color }) => (
    <div 
      className={cn("bg-white rounded-lg shadow p-6 transition-colors", onClick && "cursor-pointer hover:bg-gray-50")}
      onClick={onClick}
    >
      <div className="flex items-center">
        <div className={cn("p-3 rounded-full", color)}>
          {icon}
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-semibold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  );


  if (loading) {
    return (
       <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
      
      {/* User Stats */}
       <h2 className="text-xl font-semibold text-gray-800 mt-8">Kullanıcı İstatistikleri</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         <StatCard title="Günlük Aktif (DAU)" value={stats?.dau ?? 0} icon={<UserCheck className="h-8 w-8 text-teal-600" />} color="bg-teal-100" />
         <StatCard title="Aylık Aktif (MAU)" value={stats?.mau ?? 0} icon={<Users className="h-8 w-8 text-sky-600" />} color="bg-sky-100" />
         <StatCard title="Toplam Aktif Kullanıcı" value={stats?.activeUsers ?? 0} icon={<UserCheck className="h-8 w-8 text-green-600" />} color="bg-green-100" />
         <StatCard title="Toplam Pasif Kullanıcı" value={stats?.inactiveUsers ?? 0} icon={<UserX className="h-8 w-8 text-red-600" />} color="bg-red-100" />
      </div>


      {/* Financial Stats */}
      <h2 className="text-xl font-semibold text-gray-800 mt-8">Finansal İşlemler</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Bekleyen Cüzdan Hakedişleri" 
          value={24} 
          icon={<Wallet className="h-8 w-8 text-blue-600" />} 
          onClick={() => navigate('/admin/wallet-settlement?status=pending')}
          color="bg-blue-100"
        />
        <StatCard 
          title="Bekleyen Saklı Kart Komisyonları" 
          value={18} 
          icon={<CreditCard className="h-8 w-8 text-green-600" />} 
          onClick={() => navigate('/admin/stored-card-settlement?status=pending')}
          color="bg-green-100"
        />
        <StatCard 
          title="Bugünkü Ödemeler" 
          value={"₺45.320"} 
          icon={<Calendar className="h-8 w-8 text-yellow-600" />}
          color="bg-yellow-100"
        />
         <StatCard 
          title="Tahakkuk Teyidi Bekleyenler" 
          value={12} 
          icon={<Clock className="h-8 w-8 text-purple-600" />} 
          onClick={() => navigate('/admin/wallet-settlement?confirmation=pending')}
          color="bg-purple-100"
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Role Distribution */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <BarChart3 className="w-5 h-5 mr-2" />
            Rol Dağılımı
          </h2>
          <div className="space-y-3">
            {stats?.roleDistribution.map((role, index) => {
               const maxCount = stats.roleDistribution[0]?.count || 1;
               const widthPercentage = (role.count / maxCount) * 100;
              return (
                <div key={index}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-gray-700">{role.name}</span>
                    <span className="text-sm font-semibold text-gray-900">{role.count}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-blue-500 h-2.5 rounded-full"
                      style={{ width: `${widthPercentage}%` }}
                    ></div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Son İşlemler</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    İşlem ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Üye İşyeri
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tutar
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {[1, 2, 3, 4, 5].map((item) => (
                  <tr key={item}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      TRX-{Math.floor(Math.random() * 1000000)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      Üye İşyeri {Math.floor(Math.random() * 100)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ₺{(Math.random() * 1000).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
} 