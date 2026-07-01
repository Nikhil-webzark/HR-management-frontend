import { useEffect, useState } from "react";
import { getAdminDashboardStatsAPI } from "../../api/status.api.js";
import { Users, UserCheck, UserX, Clock, FileText, AlertCircle } from "lucide-react";

const StatCard = ({ title, value, icon: Icon, color }) => (
  <div className="bg-white rounded-xl border border-gray-200 p-6">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-500 font-medium">{title}</p>
        <p className="text-3xl font-bold text-gray-900 mt-1">{value ?? "—"}</p>
      </div>
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
        <Icon size={22} />
      </div>
    </div>
  </div>
);

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await getAdminDashboardStatsAPI();
        setStats(response.data.data);
      } catch (error) {
        console.error("Failed to fetch dashboard stats");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  const statCards = [
    {
      title: "Total Employees",
      value: stats?.totalEmployees,
      icon: Users,
      color: "bg-blue-50 text-blue-600",
    },
    {
      title: "Available",
      value: stats?.available,
      icon: UserCheck,
      color: "bg-green-50 text-green-600",
    },
    {
      title: "On Leave",
      value: stats?.onLeave,
      icon: UserX,
      color: "bg-red-50 text-red-600",
    },
    {
      title: "Half Day",
      value: stats?.halfDay,
      icon: Clock,
      color: "bg-yellow-50 text-yellow-600",
    },
    {
      title: "Temporarily Unavailable",
      value: stats?.temporarilyUnavailable,
      icon: AlertCircle,
      color: "bg-orange-50 text-orange-600",
    },
    {
      title: "EOD Submitted Today",
      value: stats?.submittedToday,
      icon: FileText,
      color: "bg-purple-50 text-purple-600",
    },
    {
      title: "EOD Pending",
      value: stats?.pendingEOD,
      icon: AlertCircle,
      color: "bg-gray-100 text-gray-600",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">
          Overview of today's team activity
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <StatCard key={card.title} {...card} />
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;