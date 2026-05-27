"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  useParams,
  useRouter,
} from "next/navigation";

import toast from "react-hot-toast";

import {
  Save,
  Tag,
  ShieldCheck,
  CheckCircle2,
  ArrowLeft
} from "lucide-react";

import api from "@/lib/api";

import { validateName } from "@/lib/validation";

interface Permission {
  id: string;
  name: string;
}

export default function EditRolePage() {
  const router = useRouter();

  const params = useParams();

  const id = params.id;

  const [loading, setLoading] =
    useState(false);

  const [permissionsLoading, setPermissionsLoading] =
    useState(true);

  const [name, setName] = useState("");

  const [permissions, setPermissions] =
    useState<Permission[]>([]);

  const [selectedPermissions, setSelectedPermissions] =
    useState<string[]>([]);

  const [error, setError] =
    useState("");

  const fetchRole = async () => {
    try {
      const res = await api.get(
        `/roles/${id}`
      );

      setName(res.data.name || "");

      // support both object and string permissions
      setSelectedPermissions(
        (res.data.permissions || []).map(
          (permission: any) =>
            typeof permission === "object"
              ? permission.id
              : permission
        )
      );

    } catch (error) {
      console.error(error);

      toast.error(
        "Failed to fetch role"
      );
    }
  };

  const fetchPermissions = async () => {
    try {
      const res = await api.get(
        "/permissions"
      );

      setPermissions(res.data || []);
    } catch (error) {
      console.error(error);

      toast.error(
        "Failed to fetch permissions"
      );
    } finally {
      setPermissionsLoading(false);
    }
  };

  useEffect(() => {
    fetchRole();
    fetchPermissions();
  }, []);

  const togglePermission = (
    permissionId: string
  ) => {
    setSelectedPermissions((prev) =>
      prev.includes(permissionId)
        ? prev.filter(
          (id) => id !== permissionId
        )
        : [...prev, permissionId]
    );
  };

  const handleUpdate = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    const nameValidation =
      validateName(name);

    setError(nameValidation);

    if (nameValidation) return;

    try {
      setLoading(true);

      await api.put(
        `/roles/update/${id}`,
        {
          name,
          permissions:
            selectedPermissions,
        }
      );

      toast.success(
        "Role updated successfully"
      );

      router.replace("/roles");
    } catch (error: any) {
      console.error(error);

      toast.error(
        error?.response?.data?.detail ||
        "Failed to update role"
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
            Edit Role
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
        onSubmit={handleUpdate}
        className="p-8 space-y-8"
      >
        <div>
          <label
            className="
                block
                text-sm
                font-semibold
                text-gray-700
                mb-2
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
                border border-gray-300
                rounded-2xl
                px-4 py-3
                focus-within:ring-2
                focus-within:ring-black
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
                setName(
                  e.target.value
                );

                setError("");
              }}
              className="
                  w-full
                  bg-transparent
                  outline-none
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
              {permissions.map(
                (permission) => {
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
                          flex items-center justify-between
                          rounded-md
                          border
                          px-2 py-2
                          text-left
                          transition-all
                          ${checked
                          ? `
                                border-black
                                bg-black
                                text-white
                                shadow-md
                              `
                          : `
                                border-gray-200
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
                }
              )}
            </div>
          )}
        </div>

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
              ? "Updating..."
              : "Update Role"}
          </button>
        </div>
      </form>
    </>
  );
}