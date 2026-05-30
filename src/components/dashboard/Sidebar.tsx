"use client";

import Link from "next/link";

export default function Sidebar() {

    return (
        <div className="w-64 min-h-screen bg-blue-600 text-white p-6">

            <h1 className="text-3xl font-bold mb-10">
                Dashboard
            </h1>

            <nav className="flex flex-col gap-4">

                <Link
                    href="/dashboard/customers"
                    className="bg-white/20 p-3 rounded-lg hover:bg-white/30"
                >
                    Customers
                </Link>

            </nav>

        </div>
    );
}