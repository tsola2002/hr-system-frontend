"use client";

import { useEffect, useState } from "react";
import API from "@/services/api";
import { Customer } from "@/types/customer";
import { toast } from "sonner";
import { Pencil, Trash2, Plus, LogOut } from "lucide-react";

// shadcn dialog
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import { customerSchema, CustomerFormData } from "@/schemas/customerSchema";
import Spinner from "@/components/ui/spinner";

export default function CustomersPage() {

    const [loading, setLoading] = useState(false);

    const [customers, setCustomers] = useState<Customer[]>([]);
    
    const [openModal, setOpenModal] = useState(false);

    const [modalMode, setModalMode] = useState<"create" | "edit">("create");

    const [deleteModalOpen, setDeleteModalOpen] =
    useState(false);

    const [customerToDelete, setCustomerToDelete] =
    useState<Customer | null>(null);

  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null,
  );

  const [saving, setSaving] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<CustomerFormData>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      name: "",
      email: "",
      address: "",
      date_of_birth: "",
    },
  });

  useEffect(() => {
    fetchCustomers();
  }, []);



  const fetchCustomers = async () => {
    try {
      console.log("FETCHING CUSTOMERS");

      setLoading(true);

      const response = await API.get("/customers");

      console.log("CUSTOMERS RESPONSE:", response.data);

      setCustomers(response.data);
    } catch (error) {
      console.log(error);

      toast.error("Failed to load customers");
    } finally {
      setLoading(false);
    }
  };



  // CREATE AND UPDATE USING REACT HOOK FORM AND ZOD
  const saveCustomer = async (data: CustomerFormData) => {
    try {
      setSaving(true);

      if (modalMode === "create") {
        await API.post("/customers", data);

        toast.success("Customer created successfully");
      } else {
        await API.put(`/customers/${selectedCustomer?.id}`, data);

        toast.success("Customer updated successfully");
      }

      reset();

      setOpenModal(false);

      fetchCustomers();
    } catch (error) {
      console.log(error);

      toast.error("Operation failed");
    } finally {
      setSaving(false);
    }
  };

  // ✅ DELETE FUNCTIONALITY
  const deleteCustomer = async () => {

    if (!customerToDelete) return;

        try {

            await API.delete(
            `/customers/${customerToDelete.id}`
            );

            toast.success(
            "Customer deleted successfully"
            );

            setDeleteModalOpen(false);

            setCustomerToDelete(null);

            fetchCustomers();

        } catch (error) {

            console.log(error);

            toast.error(
            "Failed to delete customer"
            );
        }
    };

  const openCreateModal = () => {
    setModalMode("create");

    setSelectedCustomer(null);

    // setFormData({
    //   name: "",
    //   email: "",
    //   address: "",
    //   date_of_birth: "",
      // });
    
    reset({
        name: "",
        email: "",
        address: "",
        date_of_birth: "",
    });

    setOpenModal(true);
  };

  const openEditModal = (customer: Customer) => {
    setModalMode("edit");

    setSelectedCustomer(customer);

    // setFormData({
    //   name: customer.name,
    //   email: customer.email,
    //   address: customer.address,
    //   date_of_birth: customer.date_of_birth,
      // });
      
    reset({
        name: customer.name,
        email: customer.email,
        address: customer.address,
        date_of_birth: customer.date_of_birth,
    });

    setOpenModal(true);
    };
    
  const openDeleteModal = (customer: Customer) => {

    setCustomerToDelete(customer);

    setDeleteModalOpen(true);
    };

  const logout = async () => {
    try {
      await API.post("/logout");

      localStorage.removeItem("token");

      toast.success("Logged out");

      window.location.href = "/login";
    } catch (error) {
      console.log(error);

      toast.error("Logout failed");
    }
  };

  return (
    <>
      <div className="bg-white p-10 rounded-2xl shadow-xl">
        <div className="flex justify-between mb-6">
          <h1 className="text-3xl font-bold">Customers</h1>

          <div className="flex gap-3">
            {/* ✅ PROPER DIALOG TRIGGER */}
            {/* ADD CUSTOMER */}
            <button
              onClick={openCreateModal}
              className="bg-green-600 hover:bg-green-700 hover:scale-105 transition-all duration-200 text-white px-4 py-2 rounded-lg flex gap-2"
            >
              <Plus />
              Add Customer
            </button>

            {/* LOGOUT */}
            <button
              onClick={logout}
              className="bg-red-600 hover:bg-red-700 transition-colors hover:scale-105 text-white px-4 py-2 rounded-lg flex gap-2"
            >
              <LogOut />
              Logout
            </button>
          </div>
        </div>

        {loading ? (
          <Spinner />
          ) : (
            <table className="w-full border">
              <thead className="bg-blue-600 text-white">
                <tr>
                  <th className="p-4">Name</th>
                  <th>Email</th>
                  <th>Address</th>
                  <th>Date Of Birth</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {customers.map((customer) => (
                  <tr
                    key={customer.id}
                    className="border-b text-center hover:bg-slate-100"
                  >
                    <td className="p-4">{customer.name}</td>
                    <td>{customer.email}</td>
                    <td>{customer.address}</td>
                    <td>{customer.date_of_birth}</td>

                    <td>
                      <div className="flex justify-center gap-3">
                        <button
                          onClick={() => openEditModal(customer)}
                          className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg"
                        >
                          <Pencil size={18} />
                        </button>

                        <button
                          onClick={() => openDeleteModal(customer)}
                          className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

        {/* SINGLE REUSABLE MODAL */}
        <Dialog open={openModal} onOpenChange={setOpenModal}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle className="text-center text-blue-700 text-2xl">
                {modalMode === "create" ? "Add Customer" : "Edit Customer"}
              </DialogTitle>
            </DialogHeader>

                      
            <form
                onSubmit={handleSubmit(
                saveCustomer
                )}
                className="space-y-4 mt-4"
            >
            <div className="space-y-4 mt-4">
                <input
                    type="text"
                    placeholder="Customer Name"
                    {...register("name")}
                    className="w-full border p-3 rounded-lg"
                    />

                    {errors.name && (
                        <p className="text-red-500 text-sm">
                            {errors.name.message}
                        </p>
                    )}

                <input
                    type="email"
                    placeholder="Customer Email"
                    {...register("email")}
                    className="w-full border p-3 rounded-lg"
                />

                {errors.email && (
                    <p className="text-red-500 text-sm">
                        {errors.email.message}
                    </p>
                )}

                <input
                    type="text"
                    placeholder="Customer Address"
                    {...register("address")}
                    className="w-full border p-3 rounded-lg"
                    />

                    {errors.address && (
                    <p className="text-red-500 text-sm">
                        {errors.address.message}
                    </p>
                )}

                <input
                    type="date"
                    {...register("date_of_birth")}
                    className="w-full border p-3 rounded-lg"
                    />

                    {errors.date_of_birth && (
                    <p className="text-red-500 text-sm">
                        {errors.date_of_birth.message}
                    </p>
                )}

            <button
                type="submit"
                disabled={saving}
                className="w-full bg-blue-600 hover:bg-blue-700 hover:scale-105 transition-all text-white p-3 rounded-lg disabled:opacity-50"
                >
                {saving
                    ? modalMode ===
                    "create"
                    ? "Creating..."
                    : "Updating..."
                    : modalMode ===
                    "create"
                    ? "Create Customer"
                    : "Update Customer"}
            </button>
            </div>
            </form>
          </DialogContent>
        </Dialog>
              
              {/* DELETE REUSABLE MODAL */}
            <Dialog
            open={deleteModalOpen}
            onOpenChange={setDeleteModalOpen}
            >
                <DialogContent className="sm:max-w-md">

                    <DialogHeader>

                    <DialogTitle className="text-red-600">
                        Delete Customer
                    </DialogTitle>

                    </DialogHeader>

                    <div className="space-y-4">

                <p>
                    Are you sure you want to delete
                    <strong>
                    {" "}
                    {customerToDelete?.name}
                    {" "}
                    </strong>
                    ?
                </p>

                <p className="text-sm text-gray-500">
                    This action cannot be undone.
                </p>

                <div className="flex justify-end gap-3">

                    <button
                    onClick={() =>
                        setDeleteModalOpen(false)
                    }
                    className="px-4 py-2 border rounded-lg"
                    >
                    Cancel
                    </button>

                    <button
                    onClick={deleteCustomer}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
                    >
                    Delete
                    </button>

                </div>

                </div>

            </DialogContent>
        </Dialog>
      </div>
    </>
  );
}
