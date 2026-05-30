import Sidebar from "@/components/dashboard/Sidebar";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {

    return (
        <div className="flex">

            <Sidebar />

            <div className="flex-1 p-10 bg-slate-100 min-h-screen">
                {children}
            </div>

        </div>
    );
}