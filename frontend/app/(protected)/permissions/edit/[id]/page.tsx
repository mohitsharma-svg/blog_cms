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
} from "lucide-react";


import api from "@/lib/api";

import { validateName } from "@/lib/validation";

export default function EditPermissionPage() {

  const router = useRouter();
  const params = useParams();
  const id = params.id;
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");

  const [error, setError] = useState("");

  const fetchPermission = async () => {
    try {

      const res = await api.get(
        `/permissions/${id}`
      );
      setName(res.data.name || "");
    } catch (error) {
      console.error(error);
      toast.error(
        "Failed to fetch permission"
      );
    }
  };

  useEffect(() => {
    fetchPermission();
  }, []);

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
        `/permissions/update/${id}`,
        {
          name,
        }
      );

      toast.success(
        "Permission updated successfully"
      );
      router.replace("/permissions");
    } catch (error: any) {
      console.error(error);
      toast.error(
        error?.response?.data?.detail ||
        "Failed to update permission"
      );

    } finally {
      setLoading(false);
    }
  };

  return (

      <div className="max-w-full">

        <div
          className="
            glass
            rounded-2xl
            p-6
            border border-white/40
            shadow-lg
          "
        >

          <h1
            className="
              text-2xl
              font-semibold
              text-slate-800
              mb-6
            "
          >
            Edit Permission
          </h1>

          <form
            onSubmit={handleUpdate}
            className="space-y-5"
          >

            <div className="flex gap-6 flex-col md:flex-row">
              <div className="w-full">

                <label
                  className="
                  text-sm
                  font-medium
                  text-slate-700
                  mb-2
                  block
                "
                >
                  Permission Name
                  <span className="text-red-500 pl-1">*</span>
                </label>

                <div className="field">

                  <Tag
                    className="
                    w-3 h-3
                    text-slate-400
                  "
                  />

                  <input
                    type="text"
                    placeholder="Enter permission name"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      setError("");
                    }}
                    className="input"
                  />

                </div>

                {
                  error && (
                    <p
                      className="
                      text-red-500
                      text-sm
                      mt-1
                    "
                    >
                      {error}
                    </p>
                  )
                }

              </div>

            </div>

            <div
              className="
                flex items-center
                gap-3
                pt-4
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

                {
                  loading
                    ? "Updating..."
                    : "Update Permission"
                }

              </button>

            </div>

          </form>

        </div>

      </div>
  );
}