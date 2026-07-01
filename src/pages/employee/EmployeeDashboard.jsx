import { useEffect, useState } from "react";
import { toast } from "sonner";
import useAuthStore from "../../store/authStore.js";
import { updateMyStatusAPI, toggleTemporaryAvailabilityAPI } from "../../api/status.api.js";

const statusOptions = [
  { value: "available", label: "Available", color: "bg-green-100 text-green-700" },
  { value: "on-leave", label: "On Leave", color: "bg-red-100 text-red-700" },
  { value: "half-day-leave", label: "Half Day Leave", color: "bg-yellow-100 text-yellow-700" },
];

const EmployeeDashboard = () => {
  const { user, refreshUser } = useAuthStore();
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [toggling, setToggling] = useState(false);

  const currentStatus = statusOptions.find((s) => s.value === user?.status);

  const handleStatusChange = async (status) => {
    try {
      setUpdatingStatus(true);
      await updateMyStatusAPI({ status });
      await refreshUser();
      toast.success("Status updated successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update status");
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleToggle = async () => {
    try {
      setToggling(true);
      await toggleTemporaryAvailabilityAPI();
      await refreshUser();
      toast.success(
        user?.temporaryAvailability
          ? "You are now available again"
          : "You are now temporarily unavailable"
      );
    } catch (error) {
      toast.error("Failed to update availability");
    } finally {
      setToggling(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Welcome back, {user?.fullName}</p>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gray-900 text-white flex items-center justify-center text-2xl font-bold">
            {user?.fullName?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{user?.fullName}</h2>
            <p className="text-gray-500 text-sm">{user?.email}</p>
            {user?.department && (
              <p className="text-gray-500 text-sm">{user?.designation} · {user?.department}</p>
            )}
          </div>
          <div className="ml-auto">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${currentStatus?.color}`}>
              {currentStatus?.label}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Update Status */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-base font-semibold text-gray-900 mb-4">Update Availability</h3>
          <div className="space-y-2">
            {statusOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => handleStatusChange(option.value)}
                disabled={updatingStatus || user?.status === option.value}
                className={`w-full text-left px-4 py-3 rounded-lg border text-sm font-medium transition-all ${
                  user?.status === option.value
                    ? "border-gray-900 bg-gray-900 text-white"
                    : "border-gray-200 hover:border-gray-300 text-gray-700"
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {option.label}
                {user?.status === option.value && (
                  <span className="ml-2 text-xs opacity-75">(Current)</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Temporary Availability Toggle */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-base font-semibold text-gray-900 mb-2">
            Temporary Unavailability
          </h3>
          <p className="text-gray-500 text-sm mb-6">
            Use this when you're in a meeting, on a call, or taking a short break.
          </p>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900">
                {user?.temporaryAvailability ? "Currently Unavailable" : "Currently Available"}
              </p>
              <p className="text-xs text-gray-500 mt-0.5">
                {user?.temporaryAvailability
                  ? "Toggle OFF when you're back"
                  : "Toggle ON to mark as unavailable"}
              </p>
            </div>

            {/* Toggle Switch */}
            <button
              onClick={handleToggle}
              disabled={toggling}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none disabled:opacity-50 ${
                user?.temporaryAvailability ? "bg-red-500" : "bg-gray-200"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  user?.temporaryAvailability ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;