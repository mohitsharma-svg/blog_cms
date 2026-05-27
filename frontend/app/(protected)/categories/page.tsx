"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import {
  Plus,
  Pencil,
  Trash2,
  ShieldCheck,
  ShieldX,
} from "lucide-react";

import toast from "react-hot-toast";
import Swal from "sweetalert2";
import DataTable from "@/app/components/ui/DataTable";

import api from "@/lib/api";
import { usePermission } from "@/app/hooks/usePermission";

type Category = {
  id: number;
  name: string;
  status: string;
};

export default function CategoriesPage() {

  const router = useRouter();
  const { can } = usePermission();

  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchCategories = async () => {

    try {

      setLoading(true);

      
      const res = await api.get("/categories/");

      const formatted = res.data.map(
        (category: Category, index: number) => ({

          sr_no: index + 1,

          ...category,

          status: (
            <span
              className={`
                inline-flex items-center gap-1
                px-3 py-1 rounded-full
                text-xs font-medium
                ${category.status === "active"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
                }
              `}
            >
              {
                category.status === "active"
                  ? <ShieldCheck className="w-3 h-3" />
                  : <ShieldX className="w-3 h-3" />
              }

              {category.status}
            </span>
          ),

          action: (
            <div className="flex items-center gap-2">
              {can('category.status') && (
              <button
                onClick={() =>
                  handleStatus(category.id)
                }
                className="
                  p-2 rounded-lg
                  bg-yellow-100 text-yellow-600
                  hover:bg-yellow-200
                  transition cursor-pointer
                "
              >
                <ShieldX className="w-4 h-4" />
              </button>
              )}
              {can('category.update') && (
              <button
                onClick={() =>
                  router.push(
                    `/categories/edit/${category.id}`
                  )
                }
                className="
                  p-2 rounded-lg
                  bg-blue-100 text-blue-600
                  hover:bg-blue-200
                  transition cursor-pointer
                "
              >
                <Pencil className="w-4 h-4" />
              </button>
)}
              {can('category.delete') && (
              <button
                onClick={() =>
                  handleDelete(category.id)
                }
                className="
                  p-2 rounded-lg
                  bg-red-100 text-red-600
                  hover:bg-red-200
                  transition cursor-pointer
                "
              >
                <Trash2 className="w-4 h-4" />
              </button>
              )}


            </div>
          ),
        })
      );

      setCategories(formatted);

    } catch (error) {

      console.error(error);

      toast.error("Failed to fetch categories");

    } finally {

      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleDelete = async (id: number) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This category will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it!"
    });

    if (!result.isConfirmed) return;

    try {
      await api.delete(`/categories/delete/${id}`);
      toast.success("Category deleted successfully");
      fetchCategories();
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete category");
    }
  };

  const handleStatus = async (id: number) => {
    try {
      await api.get(`/categories/status/${id}`);
      toast.success("Status updated successfully");
      fetchCategories();
    } catch (error) {
      console.error(error);
      toast.error("Failed to update status");
    }
  };

  const finalCategories = categories.map((item) => ({
    ...item,
    description: (
      <div
        title={item.description}
        className="cursor-pointer"
      >
        {
          item.description?.length > 20
            ? `${item.description.substring(0, 20)}...`
            : item.description
        }
      </div>
    ),
  }))

  const columns = [
    { key: "sr_no", label: "Sr.No." },
    { key: "name", label: "Name", sortable: true },
    { key: "description", label: "Description", sortable: true },
    { key: "status", label: "Status" },
    { key: "action", label: "Action" },
  ] as any;

  return (

      <div className="space-y-4">

        <div className="flex items-center justify-between">

          <h1 className="text-xl font-semibold text-slate-800">
            Manage Categories
          </h1>

{can('category.create') && (
          <button
            onClick={() =>
              router.push("/categories/create")
            }
            className="
              flex items-center gap-2
              bg-gradient-to-r
              from-blue-600 to-purple-600
              text-white
              px-4 py-2
              rounded-xl
              font-medium
              shadow-md
              hover:scale-[1.02]
              transition-all
              cursor-pointer
            "
          >
            <Plus className="w-4 h-4" />
            Add
          </button>
)}
        </div>

        <DataTable
          data={finalCategories}
          columns={columns}
        />

      </div>
  );
}