import { useEffect, useState } from "react";
import { getAdminDashboardStatsAPI } from "../../api/status.api.js";
import { Users, UserCheck, UserX, Clock, FileText, AlertCircle } from "lucide-react";
import { Toaster, toast } from "sonner";

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
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setError(null);
        const response = await getAdminDashboardStatsAPI();
        setStats(response.data.data);
      } catch (error) {
        const errorMsg = error.response?.data?.message || error.message || "Failed to fetch dashboard stats";
        console.error("Fetch dashboard stats error:", errorMsg, error);
        setError(errorMsg);
        toast.error(errorMsg);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
    const intervalId = setInterval(fetchStats, 5000);

    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">Overview of today's team activity</p>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800 font-medium">Error loading dashboard</p>
          <p className="text-red-700 text-sm mt-1">{error}</p>
        </div>
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