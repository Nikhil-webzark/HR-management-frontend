import { useEffect, useState } from "react";
import { getAllStatusAPI } from "../../api/status.api.js";
import { format } from "date-fns";

const statusConfig = {
  available: { label: "Available", color: "bg-green-100 text-green-700" },
  "on-leave": { label: "On Leave", color: "bg-red-100 text-red-700" },
  "half-day-leave": { label: "Half Day Leave", color: "bg-yellow-100 text-yellow-700" },
};

const StatusBoard = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchStatus = async () => {
    try {
      const response = await getAllStatusAPI();
      setEmployees(response.data.data);
    } catch (error) {
      console.error("Failed to fetch status board");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
    // Auto refresh every 30 seconds
    const interval = setInterval(fetchStatus, 5000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Company Status Board</h1>
          <p className="text-gray-500 text-sm mt-1">
            Live availability of all team members
          </p>
        </div>
        <button
          onClick={fetchStatus}
          className="text-sm text-gray-600 hover:text-gray-900 border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Refresh
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="text-left px-6 py-3 font-medium text-gray-600">Name</th>
              <th className="text-left px-6 py-3 font-medium text-gray-600">Current Status</th>
              <th className="text-left px-6 py-3 font-medium text-gray-600">Temporary Toggle</th>
              <th className="text-left px-6 py-3 font-medium text-gray-600">Last Updated</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {employees.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-12 text-gray-500">
                  No employees found
                </td>
              </tr>
            ) : (
              employees.map((emp) => {
                const status = statusConfig[emp.status] || statusConfig.available;
                return (
                  <tr key={emp._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-900 text-white flex items-center justify-center text-xs font-semibold">
                          {emp.fullName?.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-medium text-gray-900">{emp.fullName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${status.color}`}>
                        {status.label}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                          emp.temporaryAvailability
                            ? "bg-orange-100 text-orange-700"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {emp.temporaryAvailability ? "ON" : "OFF"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {emp.statusUpdatedAt
                        ? format(new Date(emp.statusUpdatedAt), "hh:mm a")
                        : "—"}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StatusBoard;