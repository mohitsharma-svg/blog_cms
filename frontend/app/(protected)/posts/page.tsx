"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { Plus, Pencil, Trash2, ShieldCheck, ShieldX } from "lucide-react";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

import DataTable from "@/app/components/ui/DataTable";

import api from "@/lib/api";
import { API_BASE_URL } from "@/lib/config";
import { usePermission } from "@/app/hooks/usePermission";

type Post = {
  id: string;
  title: string;
  status: string;
  description?: string;
  category_name?: string;
  image_url?: string;
};

export default function PostPage() {
  const router = useRouter();
  const { can } = usePermission();

  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchPosts = async () => {
    try {
      setLoading(true);

      const res = await api.get("/posts/");

      const response = res.data;
      setPosts(response.data || []);

    } catch (error) {
      toast.error("Failed to fetch posts");
      setPosts([]); 
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This post will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
    });

    if (!result.isConfirmed) return;

    try {
      await api.delete(`/posts/delete/${id}`);

      toast.success("Deleted successfully");

      setPosts((prev) => prev.filter((p) => p.id !== id));
    } catch {
      toast.error("Delete failed");
    }
  };

  const handleStatus = async (id: string) => {
    try {
      const res = await api.patch(`/posts/status/${id}`);
      const updated = res.data;

      toast.success("Status updated");
      setPosts((prev) =>
        prev.map((p) =>
          p.id === id ? { ...p, status: updated.status } : p
        )
      );
    } catch {
      toast.error("Status update failed");
    }
  };

  const getImageUrl = (url?: string) => {
    if (!url) return "/images/default.png";
    if (url.startsWith("http")) return url;
    return `${API_BASE_URL}${url.startsWith("/") ? "" : "/"}${url}`;
  };

  const finalPosts = posts.map((post, index) => ({
    sr_no: index + 1,
    id: post.id,
    title: post.title,
    category: post.category_name || "-",

    image_url: (
      <img
        src={getImageUrl(post.image_url)}
        alt="post"
        className="w-20 h-20 object-cover rounded-lg border"
      />
    ),

    description: post.description ? (
      <div
        className="cursor-pointer"
        dangerouslySetInnerHTML={{
          __html:
            post.description.length > 50
              ? post.description.substring(0, 50) + "..."
              : post.description,
        }}
      />
    ) : (
      "-"
    ),

    status: (
      <span
        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium
        ${post.status === "active"
            ? "bg-green-100 text-green-700"
            : "bg-red-100 text-red-700"
          }`}
      >
        {post.status === "active" ? (
          <ShieldCheck className="w-3 h-3" />
        ) : (
          <ShieldX className="w-3 h-3" />
        )}
        {post.status}
      </span>
    ),

    action: (
      <div className="flex items-center gap-2">
        {can('post.status') && (
        <button
          onClick={() => handleStatus(post.id)}
          className="p-2 rounded-lg bg-yellow-100 text-yellow-600 hover:bg-yellow-200"
        >
          {post.status === "active" ? (
            <ShieldX className="w-4 h-4" />
          ) : (
            <ShieldCheck className="w-4 h-4" />
          )}
        </button>
        )}
{can('post.update') && (
        <button
          onClick={() => router.push(`/posts/edit/${post.id}`)}
          className="p-2 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200"
        >
          <Pencil className="w-4 h-4" />
        </button>
)}
{can('post.delete') && (
        <button
          onClick={() => handleDelete(post.id)}
          className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200"
        >
          <Trash2 className="w-4 h-4" />
        </button>
)}
      </div>
    ),
  }));

  const columns = [
    { key: "sr_no", label: "Sr.No." },
    { key: "image_url", label: "Image", sortable: false },
    { key: "title", label: "Title", sortable: true },
    { key: "category", label: "Category", sortable: true },
    { key: "description", label: "Description", sortable: true },
    { key: "status", label: "Status" },
    { key: "action", label: "Action" },
  ] as any;

  return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold text-slate-800">
            Manage Posts
          </h1>

{can('post.create') && (
          <button
            onClick={() => router.push("/posts/create")}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-xl"
          >
            <Plus className="w-4 h-4" />
            Add
          </button>
          )}
        </div>

        <DataTable data={finalPosts} columns={columns} />
      </div>
  );
}