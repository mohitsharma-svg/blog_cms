"use client";

import { useEffect, useMemo } from "react";
import { useRouter, usePathname } from "next/navigation";
import ProtectedSidebar from "./ProtectedSidebar";
import ProtectedHeader from "./ProtectedHeader";
import ProtectedFooter from "./ProtectedFooter";
import { useAuth } from "@/app/hooks/useAuth";

function normalizeResource(resource: string) {
  const map: Record<string, string> = {
    users: "user",
    categories: "category",
    companies: "company",
    posts: "post",
    menus: "menu",
    roles: "role",
    permissions: "permission",
  };

  return map[resource] || resource.replace(/s$/, "");
}

function checkPermissionByMenu(
  pathname: string,
  menu: any[],
  permissions: string[]
) {
  const path = pathname.replace(/\/$/, "");

  const matchedMenu = menu.find((m) => {
    const href = m.href?.replace(/\/$/, "");
    return path.startsWith(href);
  });

  if (!matchedMenu) return false;

  if (matchedMenu.permission) {
    return permissions.includes(matchedMenu.permission);
  }

  const segments = matchedMenu.href.split("/").filter(Boolean);

  if (!segments.length) return true;

  const resource = normalizeResource(segments[0]);

  let action = "view";

  if (path.includes("create")) action = "create";
  if (path.includes("edit")) action = "update";
  if (path.includes("delete")) action = "delete";

  const required = `${resource}.${action}`;

  return permissions.includes(required);
}

export default function ProtectedLayoutWrapper({ children }: any) {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAuth();

  const permissions = useMemo(() => user?.permissions || [], [user]);
  const menu = useMemo(() => user?.menu || [], [user]);

  const hasAccess = useMemo(() => {
    if (!user) return false;
    return checkPermissionByMenu(pathname, menu, permissions);
  }, [pathname, user]);

  useEffect(() => {
    if (!user) return;

    if (!hasAccess) {
      router.replace("/403");
    }
  }, [hasAccess, user]);

  // prevent flicker
  if (!user) return null;
  if (!hasAccess) return null;

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex h-screen overflow-hidden">

        <aside className="hidden md:flex md:w-72 md:flex-col border-r border-gray-200 bg-white shadow-sm">
          <ProtectedSidebar />
        </aside>

        <div className="flex flex-1 flex-col overflow-hidden">

          <header className="sticky top-0 z-20 border-b border-gray-200 bg-white shadow-sm">
            <ProtectedHeader />
          </header>

          <main className="flex-1 overflow-y-auto p-4 md:p-6">
            <div className="mx-auto w-full max-w-7xl">
              <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100 min-h-full">
                {children}
              </div>
            </div>
          </main>

          <footer className="border-t border-gray-200 bg-white">
            <ProtectedFooter />
          </footer>

        </div>
      </div>
    </div>
  );
}