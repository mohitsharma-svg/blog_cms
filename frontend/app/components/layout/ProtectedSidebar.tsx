"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/app/hooks/useAuth";

export default function ProtectedSidebar() {
  const pathname = usePathname();
  const { user } = useAuth();

  const menu = user?.menu || [];

  return (
    <aside className="flex h-full w-72 flex-col bg-white">
      {/* Logo / Brand */}
      <div className="border-b border-gray-200 px-6 py-5">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">
          Admin Panel
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-6">
        <nav className="flex flex-col gap-2">
          {menu.map((item) => {
            const isActive =
              pathname === item.href ||
              pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group flex items-center rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-black text-white shadow-sm"
                    : "text-gray-700 hover:bg-gray-100 hover:text-black"
                }`}
              >
                <span className="truncate">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* User Info */}
      <div className="border-t border-gray-200 p-4">
        <div className="rounded-xl bg-gray-100 p-4">
          <p className="text-sm font-semibold text-gray-900">
            {user?.name || "User"}
          </p>

          <p className="mt-1 text-xs text-gray-500">
            {user?.email || "user@example.com"}
          </p>
        </div>
      </div>
    </aside>
  );
}