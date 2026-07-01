import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  getAllEmployeesAPI,
  createEmployeeAPI,
  updateEmployeeAPI,
  deleteEmployeeAPI,
  toggleAccountStatusAPI,
  resetPasswordAPI,
} from "../../api/employee.api.js";
import { createEmployeeSchema, updateEmployeeSchema, resetPasswordSchema } from "../../schemas/index.js";
import { Search, Plus, Pencil, Trash2, RefreshCw, Power } from "lucide-react";

const statusConfig = {
  available: { label: "Available", color: "bg-green-100 text-green-700" },
  "on-leave": { label: "On Leave", color: "bg-red-100 text-red-700" },
  "half-day-leave": { label: "Half Day", color: "bg-yellow-100 text-yellow-700" },
};

// Simple Modal component
const Modal = ({ open, onClose, title, children }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-xl border border-gray-200 p-6 w-full max-w-md shadow-xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">×</button>
        </div>
        {children}
      </div>
    </div>
  );
};

// Reusable form field
const Field = ({ label, error, children }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
    {children}
    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
  </div>
);

const inputClass = "w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent";

const EmployeeManagement = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [activeFilter, setActiveFilter] = useState("");

  // Modal states
  const [createModal, setCreateModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [resetModal, setResetModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  // Forms
  const createForm = useForm({ resolver: zodResolver(createEmployeeSchema) });
  const editForm = useForm({ resolver: zodResolver(updateEmployeeSchema) });
  const resetForm = useForm({ resolver: zodResolver(resetPasswordSchema) });

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const params = {};
      if (search) params.search = search;
      if (statusFilter) params.status = statusFilter;
      if (activeFilter !== "") params.isActive = activeFilter;
      const response = await getAllEmployeesAPI(params);
      setEmployees(response.data.data);
    } catch {
      toast.error("Failed to fetch employees");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(fetchEmployees, 300);
    return () => clearTimeout(timer);
  }, [search, statusFilter, activeFilter]);

  // Create
  const handleCreate = async (data) => {
    try {
      await createEmployeeAPI(data);
      toast.success("Employee created successfully");
      setCreateModal(false);
      createForm.reset();
      fetchEmployees();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create employee");
    }
  };

  // Edit
  const openEdit = (emp) => {
    setSelectedEmployee(emp);
    editForm.reset({
      fullName: emp.fullName,
      email: emp.email,
      department: emp.department || "",
      designation: emp.designation || "",
      phone: emp.phone || "",
    });
    setEditModal(true);
  };

  const handleEdit = async (data) => {
    try {
      await updateEmployeeAPI(selectedEmployee._id, data);
      toast.success("Employee updated successfully");
      setEditModal(false);
      fetchEmployees();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update employee");
    }
  };

  // Delete
  const openDelete = (emp) => {
    setSelectedEmployee(emp);
    setDeleteModal(true);
  };

  const handleDelete = async () => {
    try {
      await deleteEmployeeAPI(selectedEmployee._id);
      toast.success("Employee deleted successfully");
      setDeleteModal(false);
      fetchEmployees();
    } catch {
      toast.error("Failed to delete employee");
    }
  };

  // Toggle status
  const handleToggleStatus = async (emp) => {
    try {
      await toggleAccountStatusAPI(emp._id);
      toast.success(emp.isActive ? "Account deactivated" : "Account activated");
      fetchEmployees();
    } catch {
      toast.error("Failed to update account status");
    }
  };

  // Reset password
  const openReset = (emp) => {
    setSelectedEmployee(emp);
    resetForm.reset();
    setResetModal(true);
  };

  const handleReset = async (data) => {
    try {
      await resetPasswordAPI(selectedEmployee._id, data);
      toast.success("Password reset successfully");
      setResetModal(false);
    } catch {
      toast.error("Failed to reset password");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Employee Management</h1>
          <p className="text-gray-500 text-sm mt-1">{employees.length} employees total</p>
        </div>
        <button
          onClick={() => setCreateModal(true)}
          className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors"
        >
          <Plus size={16} />
          Add Employee
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, department..."
            className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 bg-white"
        >
          <option value="">All Statuses</option>
          <option value="available">Available</option>
          <option value="on-leave">On Leave</option>
          <option value="half-day-leave">Half Day</option>
        </select>
        <select
          value={activeFilter}
          onChange={(e) => setActiveFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 bg-white"
        >
          <option value="">All Accounts</option>
          <option value="true">Active</option>
          <option value="false">Inactive</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left px-6 py-3 font-medium text-gray-600">Employee</th>
                  <th className="text-left px-6 py-3 font-medium text-gray-600">Department</th>
                  <th className="text-left px-6 py-3 font-medium text-gray-600">Status</th>
                  <th className="text-left px-6 py-3 font-medium text-gray-600">Account</th>
                  <th className="text-left px-6 py-3 font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {employees.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-12 text-gray-500">
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
                            <div className="w-8 h-8 rounded-full bg-gray-900 text-white flex items-center justify-center text-xs font-semibold flex-shrink-0">
                              {emp.fullName?.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{emp.fullName}</p>
                              <p className="text-gray-500 text-xs">{emp.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-600">
                          {emp.department || "—"}
                          {emp.designation && (
                            <p className="text-xs text-gray-400">{emp.designation}</p>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${status.color}`}>
                            {status.label}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                            emp.isActive
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}>
                            {emp.isActive ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => openEdit(emp)}
                              className="p-1.5 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                              title="Edit"
                            >
                              <Pencil size={15} />
                            </button>
                            <button
                              onClick={() => handleToggleStatus(emp)}
                              className={`p-1.5 rounded-lg transition-colors ${
                                emp.isActive
                                  ? "text-red-500 hover:bg-red-50"
                                  : "text-green-500 hover:bg-green-50"
                              }`}
                              title={emp.isActive ? "Deactivate" : "Activate"}
                            >
                              <Power size={15} />
                            </button>
                            <button
                              onClick={() => openReset(emp)}
                              className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Reset Password"
                            >
                              <RefreshCw size={15} />
                            </button>
                            <button
                              onClick={() => openDelete(emp)}
                              className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create Modal */}
      <Modal open={createModal} onClose={() => setCreateModal(false)} title="Add New Employee">
        <form onSubmit={createForm.handleSubmit(handleCreate)} className="space-y-4">
          <Field label="Full Name *" error={createForm.formState.errors.fullName?.message}>
            <input {...createForm.register("fullName")} className={inputClass} placeholder="John Doe" />
          </Field>
          <Field label="Email *" error={createForm.formState.errors.email?.message}>
            <input {...createForm.register("email")} type="email" className={inputClass} placeholder="john@company.com" />
          </Field>
          <Field label="Password *" error={createForm.formState.errors.password?.message}>
            <input {...createForm.register("password")} type="password" className={inputClass} placeholder="Min 8 characters" />
          </Field>
          <Field label="Department" error={createForm.formState.errors.department?.message}>
            <input {...createForm.register("department")} className={inputClass} placeholder="Engineering" />
          </Field>
          <Field label="Designation" error={createForm.formState.errors.designation?.message}>
            <input {...createForm.register("designation")} className={inputClass} placeholder="Software Engineer" />
          </Field>
          <Field label="Phone" error={createForm.formState.errors.phone?.message}>
            <input {...createForm.register("phone")} className={inputClass} placeholder="9876543210" />
          </Field>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setCreateModal(false)} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">Cancel</button>
            <button type="submit" disabled={createForm.formState.isSubmitting} className="flex-1 bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-700 disabled:opacity-50">
              {createForm.formState.isSubmitting ? "Creating..." : "Create Employee"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Modal */}
      <Modal open={editModal} onClose={() => setEditModal(false)} title="Edit Employee">
        <form onSubmit={editForm.handleSubmit(handleEdit)} className="space-y-4">
          <Field label="Full Name" error={editForm.formState.errors.fullName?.message}>
            <input {...editForm.register("fullName")} className={inputClass} />
          </Field>
          <Field label="Email" error={editForm.formState.errors.email?.message}>
            <input {...editForm.register("email")} type="email" className={inputClass} />
          </Field>
          <Field label="Department" error={editForm.formState.errors.department?.message}>
            <input {...editForm.register("department")} className={inputClass} />
          </Field>
          <Field label="Designation" error={editForm.formState.errors.designation?.message}>
            <input {...editForm.register("designation")} className={inputClass} />
          </Field>
          <Field label="Phone" error={editForm.formState.errors.phone?.message}>
            <input {...editForm.register("phone")} className={inputClass} />
          </Field>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setEditModal(false)} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">Cancel</button>
            <button type="submit" disabled={editForm.formState.isSubmitting} className="flex-1 bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-700 disabled:opacity-50">
              {editForm.formState.isSubmitting ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Modal */}
      <Modal open={deleteModal} onClose={() => setDeleteModal(false)} title="Delete Employee">
        <p className="text-gray-600 text-sm mb-6">
          Are you sure you want to delete{" "}
          <span className="font-semibold text-gray-900">{selectedEmployee?.fullName}</span>?
          This action cannot be undone.
        </p>
        <div className="flex gap-3">
          <button onClick={() => setDeleteModal(false)} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">Cancel</button>
          <button onClick={handleDelete} className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700">Delete</button>
        </div>
      </Modal>

      {/* Reset Password Modal */}
      <Modal open={resetModal} onClose={() => setResetModal(false)} title="Reset Password">
        <p className="text-gray-500 text-sm mb-4">
          Reset password for{" "}
          <span className="font-medium text-gray-900">{selectedEmployee?.fullName}</span>
        </p>
        <form onSubmit={resetForm.handleSubmit(handleReset)} className="space-y-4">
          <Field label="New Password" error={resetForm.formState.errors.password?.message}>
            <input {...resetForm.register("password")} type="password" className={inputClass} placeholder="Min 8 characters" />
          </Field>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setResetModal(false)} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">Cancel</button>
            <button type="submit" disabled={resetForm.formState.isSubmitting} className="flex-1 bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-700 disabled:opacity-50">
              {resetForm.formState.isSubmitting ? "Resetting..." : "Reset Password"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default EmployeeManagement;