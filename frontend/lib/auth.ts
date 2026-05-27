import api from "@/lib/api";

export const login = async (data: any) => {
  return api.post("/auth/login", data);
};

export const logout = async () => {
  return api.post("/auth/logout");
};
