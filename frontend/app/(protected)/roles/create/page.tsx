"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react"

import toast from "react-hot-toast";

import {
  Save,
  ShieldCheck,
  Tag,
  CheckCircle2,
} from "lucide-react";

import api from "@/lib/api";

import { validateName } from "@/lib/validation";

interface Permission {
  id: number;
  name: string;
}

export default function CreateRolePage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const [permissionsLoading, setPermissionsLoading] =
    useState(true);

  const [permissions, setPermissions] = useState<
    Permission[]
  >([]);

  const [selectedPermissions, setSelectedPermissions] =
    useState<number[]>([]);

  const [name, setName] = useState("");

  const [error, setError] = useState("");

  useEffect(() => {
    fetchPermissions();
  }, []);

  const fetchPermissions = async () => {
    try {
      const response = await api.get("/permissions");

      setPermissions(response.data || []);
    } catch (error) {
      console.error(error);

      toast.error("Failed to load permissions");
    } finally {
      setPermissionsLoading(false);
    }
  };

  const togglePermission = (id: number) => {
    setSelectedPermissions((prev) =>
      prev.includes(id)
        ? prev.filter((p) => p !== id)
        : [...prev, id]
    );
  };

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    const nameValidation = validateName(name);

    setError(nameValidation);

    if (nameValidation) return;

    try {
      setLoading(true);

      await api.post("/roles/create", {
        name,
        permissions: selectedPermissions,
      });

      toast.success(
        "Role created successfully"
      );

      router.replace("/roles");
    } catch (error: any) {
      console.error(error);

      toast.error(
        error?.response?.data?.detail ||
        "Failed to create role"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-800">
            Create User
          </h1>
        </div>

        <button
          onClick={() => router.back()}
          className="
                        flex items-center gap-2
                        px-4 py-2
                        rounded-xl
                        border border-[var(--border)]
                        bg-white
                        hover:bg-slate-50
                        transition
                        cursor-pointer
                        "
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
      </div>

      <form
        onSubmit={handleSubmit}
        className="p-2 space-y-2"
      >
        {/* Role Name */}
        <div>
          <label
            className="
                text-sm
                font-semibold
                text-gray-700
                mb-2
                block
              "
          >
            Role Name
            <span className="text-red-500 pl-1">
              *
            </span>
          </label>

          <div
            className="
                flex items-center
                gap-3
                rounded-2xl
                border border-gray-300
                px-4 py-3
                focus-within:ring-2
                focus-within:ring-black
                transition
              "
          >
            <Tag
              className="
                  w-4 h-4
                  text-gray-400
                "
            />

            <input
              type="text"
              placeholder="Enter role name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError("");
              }}
              className="
                  w-full
                  outline-none
                  bg-transparent
                  text-sm
                "
            />
          </div>

          {error && (
            <p
              className="
                  text-red-500
                  text-sm
                  mt-2
                "
            >
              {error}
            </p>
          )}
        </div>

        {/* Permissions */}
        <div>
          <div
            className="
                flex items-center
                gap-2
                mb-5
              "
          >
            <ShieldCheck
              className="
                  w-5 h-5
                  text-gray-700
                "
            />

            <h2
              className="
                  text-lg
                  font-semibold
                  text-gray-900
                "
            >
              Assign Permissions
            </h2>
          </div>

          {permissionsLoading ? (
            <div
              className="
                  text-sm
                  text-gray-500
                "
            >
              Loading permissions...
            </div>
          ) : permissions.length === 0 ? (
            <div
              className="
                  text-sm
                  text-gray-500
                "
            >
              No permissions found
            </div>
          ) : (
            <div
              className="
                  grid
                  grid-cols-2
                  sm:grid-cols-3
                  lg:grid-cols-5
                  gap-2
                "
            >
              {permissions.map((permission) => {
                const checked =
                  selectedPermissions.includes(
                    permission.id
                  );

                return (
                  <button
                    key={permission.id}
                    type="button"
                    onClick={() =>
                      togglePermission(
                        permission.id
                      )
                    }
                    className={`
                        group
                        flex items-center justify-between
                        rounded-md
                        border
                        px-2 py-2
                        transition-all
                        text-left
                        ${checked
                        ? `
                              border-black
                              bg-black
                              text-white
                              shadow-md
                            `
                        : `
                              border-gray-200
                              bg-white
                              hover:border-gray-400
                              hover:shadow-sm
                            `
                      }
                      `}
                  >
                    <span
                      className="
                          text-[10px]
                          font-normal
                          break-all
                        "
                    >
                      {permission.name}
                    </span>

                    <CheckCircle2
                      className={`
                          w-3 h-3
                          ${checked
                          ? "opacity-100"
                          : "opacity-20"
                        }
                        `}
                    />
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          className="
              flex items-center
              justify-start
              pt-4
              border-t border-gray-100
            "
        >
          <button
            type="submit"
            disabled={loading}
            className="
                  flex items-center gap-2
                  bg-gradient-to-r
                  from-blue-600 to-purple-600
                  text-white
                  px-5 py-2.5
                  rounded-xl
                  font-medium
                  shadow-lg
                  hover:scale-[1.02]
                  transition-all
                  disabled:opacity-70
                  cursor-pointer
                "
          >
            <Save className="w-4 h-4" />

            {loading
              ? "Creating..."
              : "Create Role"}
          </button>
        </div>
      </form>
    </>
  );
}