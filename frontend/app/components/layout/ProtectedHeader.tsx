"use client";

import { useRouter } from "next/navigation";
import { logout } from "@/lib/auth";
import { useAuth } from "@/app/hooks/useAuth";
import api from "@/lib/api";

export default function ProtectedHeader() {
  const router = useRouter();
  const { user, clearUser } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();

      clearUser();

      api.post("/auth/refresh", null, {
        validateStatus: () => true,
      });

      router.replace("/login");
    } catch (err) {
      console.error("Logout failed", err);
      router.replace("/login");
    }
  };

  return (
    <header className="flex h-18 items-center justify-between bg-white px-6">
      {/* Left */}
      <div>
        <h1 className="text-xl font-bold text-gray-900">
          Dashboard
        </h1>

        <p className="text-sm text-gray-500">
          Manage your application
        </p>
      </div>

      {/* Right */}
      <div className="flex items-center gap-4">
        {/* User Info */}
        <div className="hidden text-right sm:block">
          <p className="text-sm font-semibold text-gray-900">
            {user?.name || "Admin"}
          </p>

          <p className="text-xs text-gray-500">
            {user?.email || "admin@example.com"}
          </p>
        </div>

        {/* Avatar */}
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black text-sm font-semibold text-white">
          {(user?.name || "A").charAt(0).toUpperCase()}
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="rounded-xl border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
        >
          Logout
        </button>
      </div>
    </header>
  );
}