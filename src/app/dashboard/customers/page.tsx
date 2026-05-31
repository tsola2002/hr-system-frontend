"use client";

import { useEffect, useState } from "react";
import API from "@/services/api";
import { Customer } from "@/types/customer";
import { toast } from "sonner";
import {
    Pencil,
    Trash2,
    Plus,
    LogOut,
} from "lucide-react";

// shadcn dialog
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function CustomersPage() {

    const [customers, setCustomers] = useState<Customer[]>([]);

    const [openModal, setOpenModal] = useState(false);

    const [modalMode, setModalMode] =
        useState<"create" | "edit">("create");
    
    const [selectedCustomer, setSelectedCustomer] =
    useState<Customer | null>(null);

    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchCustomers();
    }, []);

    
    // FORM STATE 
    const [formData, setFormData] = useState(
        {
            name: "",
            email: "",
            address: "",
            date_of_birth: "",
        });

    

    const fetchCustomers = async () => {

        try {

            console.log("FETCHING CUSTOMERS");

            const response = await API.get("/customers");

            console.log("CUSTOMERS RESPONSE:", response.data);

            setCustomers(response.data);

        } catch (error) {

            console.log(error);

            toast.error("Failed to load customers");
        }
    };


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(
            {
                ...formData,
                [e.target.name]: e.target.value,
            });
    };

    // CREATE CUSTOMER 
    // const createCustomer = async () => {
    //     try {

    //         setSaving(true);

    //         console.log("SENDING CUSTOMER:", formData);
            
    //         const response = await API.post("/customers", formData);
            
    //         console.log("CREATE RESPONSE:", response.data);
            
    //         toast.success("Customer created successfully");
            
            
    //         // CLEAR FORM
    //         setFormData({
    //             name: "",
    //             email: "",
    //             address: "",
    //             date_of_birth: "",
    //         });

    //         setOpenModal(false);
            
    //         // REFRESH TABLE
    //         fetchCustomers();
    //     } catch (error) {
    //         console.log(error);
    //         toast.error("Failed to create customer");
    //     } finally {
    //         setSaving(false);
    //     }
    // };

    const saveCustomer = async () => {

        try {

            setSaving(true);

            if (modalMode === "create") {

                await API.post("/customers", formData);

                toast.success("Customer created successfully");

            } else {

                await API.put(
                    `/customers/${selectedCustomer?.id}`,
                    formData
                );

                toast.success("Customer updated successfully");
            }

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
    const deleteCustomer = async (id: number) => {
        try {
            const confirmDelete = window.confirm(
                "Are you sure you want to delete this customer?"
            );

            if (!confirmDelete) return;

            await API.delete(`/customers/${id}`);

            toast.success("Customer deleted successfully");

            fetchCustomers();

        } catch (error) {
            console.log(error);
            toast.error("Failed to delete customer");
        }
    };

    const openCreateModal = () => {

        setModalMode("create");

        setSelectedCustomer(null);

        setFormData({
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

        setFormData({
            name: customer.name,
            email: customer.email,
            address: customer.address,
            date_of_birth: customer.date_of_birth,
        });

        setOpenModal(true);
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

                    <h1 className="text-3xl font-bold">
                        Customers
                    </h1>

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

                                <td className="p-4">
                                    {customer.name}
                                </td>

                                <td>
                                    {customer.email}
                                </td>

                                <td>
                                    {customer.address}
                                </td>

                                <td>
                                    {customer.date_of_birth}
                                </td>

                                <td>

                                    <div className="flex justify-center gap-3">

                                        <button onClick={() => openEditModal(customer)} className="bg-blue-500 hover:bg-blue-600 hover:scale-105 transition-all duration-200 text-white p-2 rounded-lg">
                                            <Pencil size={18} />
                                        </button>

                                        <button onClick={() => deleteCustomer(customer.id)} className="bg-red-500 text-white hover:bg-red-600 hover:scale-105 transition-all duration-200 p-2 rounded-lg">
                                            <Trash2 size={18} />
                                        </button>

                                    </div>

                                </td>

                            </tr>

                        ))}

                    </tbody>

                </table>

                {/* SINGLE REUSABLE MODAL */}
                <Dialog open={openModal} onOpenChange={setOpenModal}>
                    <DialogContent className="sm:max-w-[500px]">

                        <DialogHeader>
                            <DialogTitle className="text-center text-blue-700 text-2xl">
                                {modalMode === "create"
                                    ? "Add Customer"
                                    : "Edit Customer"}
                            </DialogTitle>
                        </DialogHeader>

                        <div className="space-y-4 mt-4">

                            <input
                                type="text"
                                name="name"
                                placeholder="Customer Name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full border p-3 rounded-lg"
                            />

                            <input
                                type="email"
                                name="email"
                                placeholder="Customer Email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full border p-3 rounded-lg"
                            />

                            <input
                                type="text"
                                name="address"
                                placeholder="Customer Address"
                                value={formData.address}
                                onChange={handleChange}
                                className="w-full border p-3 rounded-lg"
                            />

                            <input
                                type="date"
                                name="date_of_birth"
                                value={formData.date_of_birth}
                                onChange={handleChange}
                                className="w-full border p-3 rounded-lg"
                            />

                            <button
                                onClick={saveCustomer}
                                disabled={saving}
                                className="w-full bg-blue-600 hover:bg-blue-700 hover:scale-105 transition-all text-white p-3 rounded-lg disabled:opacity-50"
                            >
                                {saving
                                    ? modalMode === "create"
                                        ? "Creating..."
                                        : "Updating..."
                                    : modalMode === "create"
                                        ? "Create Customer"
                                        : "Update Customer"}
                            </button>

                        </div>

                    </DialogContent>
                </Dialog>

            </div>

           
        </>
    );
}