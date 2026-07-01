import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import { ProtectedRoute, PublicRoute } from "./Guards.jsx";
import LoginPage from "../pages/auth/LoginPage.jsx";
import EmployeeDashboard from "../pages/employee/EmployeeDashboard.jsx";
import StatusBoard from "../pages/employee/StatusBoard.jsx";
import EODPage from "../pages/employee/EODPage.jsx";
import AdminDashboard from "../pages/admin/AdminDashboard.jsx";
import EmployeeManagement from "../pages/admin/EmployeeManagement.jsx";
import EmployeeLayout from "../components/layout/EmployeeLayout.jsx";
import AdminLayout from "../components/layout/AdminLayout.jsx";
import NotFound from "../pages/NotFound.jsx";
import Unauthorized from "../pages/Unauthorized.jsx";

const router = createBrowserRouter([
  // Root redirect
  

  // Public routes
  {
    element: <PublicRoute />,
    children: [{ path: "/login", element: <LoginPage /> }],
  },

  // Employee routes
  {
    element: <ProtectedRoute allowedRoles={["employee"]} />,
    children: [
      {
        element: <EmployeeLayout />,
        children: [
          { path: "/employee/dashboard", element: <EmployeeDashboard /> },
          { path: "/employee/status", element: <StatusBoard /> },
          { path: "/employee/eod", element: <EODPage /> },
        ],
      },
    ],
  },

  // Admin routes
  {
    element: <ProtectedRoute allowedRoles={["admin"]} />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          { path: "/admin/dashboard", element: <AdminDashboard /> },
          { path: "/admin/employees", element: <EmployeeManagement /> },
        ],
      },
    ],
  },

  { path: "/unauthorized", element: <Unauthorized /> },
  { path: "/", element: <PublicRoute /> },
  { path: "*", element: <NotFound /> },
]);

const AppRouter = () => <RouterProvider router={router} />;
export default AppRouter;