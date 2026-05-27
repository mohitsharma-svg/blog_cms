"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";

export type MenuItem = {
  label: string;
  href: string;
  permission: string;
};

export type User = {
  id: number;
  name: string;
  email: string;
  status: string;
  roles: string[];
  permissions: string[];
  menu?: MenuItem[];
};

// =======================
// GLOBAL CACHE (IMPORTANT)
// =======================
let userCache: User | null = null;
let fetchPromise: Promise<User> | null = null;

export function useAuth() {

  const [user, setUser] = useState<User | null>(userCache);
  const [loading, setLoading] = useState(!userCache);

  const loadUser = async () => {

    try {

      // If already cached → return
      if (userCache) {
        setUser(userCache);
        setLoading(false);
        return userCache;
      }

      // If request already running → reuse it
      if (!fetchPromise) {
        fetchPromise = api
          .get("/auth/me")
          .then((res) => {
            userCache = res.data;
            return res.data;
          })
          .catch(() => {
            userCache = null;
            return null;
          });
      }

      const data = await fetchPromise;

      setUser(data);
      return data;

    } finally {
      setLoading(false);
    }
  };

  const clearUser = () => {
    userCache = null;
    fetchPromise = null;
    setUser(null);
    setLoading(false);
  };

  useEffect(() => {
    loadUser();
  }, []);

  return {
    user,
    loading,
    refresh: loadUser,
    clearUser,
  };
}