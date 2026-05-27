import { useAuth } from "@/app/hooks/useAuth";

export function usePermission() {

  const { user } = useAuth();

  const roles: string[] = user?.roles || [];

  const permissions: string[] =
    user?.permissions || [];

  const menu = user?.menu || [];

  const isAdmin =
    roles.includes("admin") ||
    roles.includes("Power Admin");


  const hasRole = (
    role: string | string[]
  ) => {

    if (isAdmin) return true;

    const list = Array.isArray(role)
      ? role
      : [role];

    return list.some((r) =>
      roles.includes(r)
    );
  };

  const hasPermission = (
    permission: string | string[]
  ) => {
    console.log(isAdmin)
    if (isAdmin) return true;

    if (!user) return false;

    const list = Array.isArray(permission)
      ? permission
      : [permission];

    return list.some((perm) => {
      if (permissions.includes(perm)) {
        return true;
      }

      const [module, action] =
        perm.split(".");

      if (action === "*") {

        return permissions.some((p) =>
          p.startsWith(`${module}.`)
        );
      }

      return false;
    });
  };

  const can = (
    permission: string | string[]
  ) => {
    return hasPermission(permission);
  };

  const hasMenu = (href: string) => {

    if (isAdmin) return true;

    if (!user) return false;

    return menu.some(
      (m: any) => m.href === href
    );
  };

  return {
    user,
    roles,
    permissions,
    menu,

    isAdmin,

    hasRole,

    hasPermission,

    can,

    hasMenu,
  };
}