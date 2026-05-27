"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import toast from "react-hot-toast";
import { Save, Tag, FolderOpen } from "lucide-react";

import api from "@/lib/api";
import DescriptionEditor from "@/app/components/ui/DescriptionEditor";
import { API_BASE_URL } from "@/lib/config";

interface Category {
  id: string;
  name: string;
}

export default function EditPostPage() {
  const router = useRouter();
  const params = useParams();
  const postId = params.id as string;

  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryId, setCategoryId] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    fetchCategories();
    fetchPost();
  }, []);

  const fetchPost = async () => {
    try {
      const res = await api.get(`/posts/${postId}`);
      const post = res.data;

      setTitle(post.title);
      setDescription(post.description || "");
      setCategoryId(post.category_id);

      // ✅ FIXED IMAGE HANDLING
      setPreview(
        post.image_url
          ? post.image_url.startsWith("http")
            ? post.image_url
            : `${API_BASE_URL}/${post.image_url}`
          : null
      );
    } catch {
      toast.error("Failed to load post");
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await api.get("/categories");
      setCategories(res.data || []);
    } catch {
      toast.error("Failed to load categories");
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) return toast.error("Title is required");
    if (!categoryId) return toast.error("Category is required");

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("category_id", categoryId);

      if (image) formData.append("image", image);

      await api.put(`/posts/update/${postId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Post updated successfully");
      router.push("/posts");
    } catch {
      toast.error("Failed to update post");
    } finally {
      setLoading(false);
    }
  };

  return (
      <div className="glass p-6 rounded-2xl">
        <h1 className="text-2xl font-semibold mb-6">Edit Post</h1>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* TITLE */}
          <div>
            <label className="text-sm font-medium text-slate-700 mb-2 block">
              Title *
            </label>

            <div className="field">
              <Tag className="w-3 h-3 text-slate-400" />
              <input
                className="input"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
          </div>

          {/* CATEGORY */}
          <div>
            <label className="text-sm font-medium text-slate-700 mb-2 block">
              Category *
            </label>

            <div className="field">
              <FolderOpen className="w-4 h-4 text-slate-400" />
              <select
                className="input"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
              >
                <option value="">Select Category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* DESCRIPTION */}
          <DescriptionEditor
            value={description}
            onChange={setDescription}
          />

          {/* IMAGE */}
          <div>
            <label className="text-sm font-medium text-slate-700 mb-2 block">
              Image
            </label>

            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="input"
            />

            {preview && (
              <img
                src={preview}
                className="w-40 h-40 object-cover rounded-xl border mt-3"
              />
            )}
          </div>

          {/* BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-xl"
          >
            <Save className="w-4 h-4" />
            {loading ? "Updating..." : "Update Post"}
          </button>

        </form>
      </div>
  );
}