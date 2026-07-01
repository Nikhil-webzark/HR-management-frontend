import { useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore.js";

const Unauthorized = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-900">403</h1>
        <p className="text-xl font-semibold text-gray-700 mt-3">Access Denied</p>
        <p className="text-gray-500 mt-2 mb-6">
          You don't have permission to access this page.
        </p>
        <button
          onClick={() =>
            navigate(
              user?.role === "admin" ? "/admin/dashboard" : "/employee/dashboard",
              { replace: true }
            )
          }
          className="bg-gray-900 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors"
        >
          Go to Dashboard
        </button>
      </div>
    </div>
  );
};

export default Unauthorized;