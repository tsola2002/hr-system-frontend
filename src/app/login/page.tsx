"use client";

import { useForm } from "react-hook-form";
import API from "@/services/api";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function LoginPage() {

    const router = useRouter();

    const { register, handleSubmit } = useForm();

    const login = async (data: any) => {

    try {

        const response = await API.post("/login", data);

        console.log("LOGIN RESPONSE:", response.data);

        localStorage.setItem(
            "token",
            response.data.token
        );

        toast.success("Login successful");

        router.push("/dashboard/customers");

    } catch (error) {

        console.log(error);

        toast.error("Invalid credentials");
    }
};

    return (
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-500 to-purple-500">

            <form
                onSubmit={handleSubmit(login)}
                className="bg-white p-10 rounded-2xl shadow-2xl w-96"
            >

                <h1 className="text-3xl font-bold mb-6 text-center">
                    Login
                </h1>

                <input
                    {...register("email")}
                    placeholder="Email"
                    className="w-full border p-3 rounded mb-4"
                />

                <input
                    {...register("password")}
                    type="password"
                    placeholder="Password"
                    className="w-full border p-3 rounded mb-4"
                />

                <button
                    className="w-full bg-blue-600 text-white p-3 rounded-lg"
                >
                    Login
                </button>

            </form>

        </div>
    );
}