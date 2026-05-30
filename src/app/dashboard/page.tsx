import Link from "next/link";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-200 flex items-center justify-center">
      <div className="bg-white shadow-2xl rounded-3xl p-10 w-[900px]">

        <h1 className="text-5xl font-bold text-center text-blue-600 mb-4">
          Customer Dashboard
        </h1>

        <p className="text-center text-gray-600 mb-10">
          Manage customers using your Laravel JWT API backend.
        </p>

        <div className="grid grid-cols-2 gap-6">

          {/* Customers Card */}
          <Link href="/customers">
            <div className="bg-blue-500 hover:bg-blue-600 transition-all duration-300 cursor-pointer rounded-2xl p-8 text-white shadow-lg">
              <h2 className="text-3xl font-bold mb-2">
                Customers
              </h2>

              <p>
                View, create, update and delete customers.
              </p>
            </div>
          </Link>

          {/* Login Card */}
          <Link href="/login">
            <div className="bg-purple-500 hover:bg-purple-600 transition-all duration-300 cursor-pointer rounded-2xl p-8 text-white shadow-lg">
              <h2 className="text-3xl font-bold mb-2">
                Login
              </h2>

              <p>
                Authenticate using JWT tokens.
              </p>
            </div>
          </Link>

        </div>

      </div>
    </div>
  );
}