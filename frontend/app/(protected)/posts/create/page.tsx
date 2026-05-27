"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Save, Tag, FolderOpen } from "lucide-react";

import api from "@/lib/api";
import DescriptionEditor from "@/app/components/ui/DescriptionEditor";

interface Category {
  id: string;
  name: string;
}

export default function CreatePostPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryId, setCategoryId] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const fetchCategories = async () => {
    try {
      const response = await api.get("/categories");

      setCategories(response.data || []);
    } catch (error) {
      toast.error("Failed to load categories");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }

    if (!categoryId) {
      toast.error("Category is required");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("category_id", categoryId);

      if (image) {
        formData.append("image", image);
      }

      await api.post("/posts/create", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Post created successfully");
      router.push("/posts");
    } catch (err) {
      toast.error("Failed to create post");
    } finally {
      setLoading(false);
    }
  };

  return (
      <div className="glass p-6 rounded-2xl">
        <h1 className="text-2xl font-semibold mb-6">
          Create Post
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">

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
              Title
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
                className="input"
                placeholder="Enter title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
          </div>
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
              Category
              <span className="text-red-500 pl-1">*</span>
            </label>

            <div className="field">
              <FolderOpen
                className="
                  w-4 h-4
                  text-slate-400
                "
              />

              <select
                className="input"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
              >
                <option value="">
                  Select Category
                </option>

                {categories.map((category) => (
                  <option
                    key={category.id}
                    value={category.id}
                  >
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

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
              Description
            </label>

            <DescriptionEditor
              value={description}
              onChange={setDescription}
            />
          </div>

          <div className="w-full">
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
              <div className="mt-3">
                <img
                  src={preview}
                  alt="Preview"
                  className="w-40 h-40 object-cover rounded-xl border"
                />
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="
              flex items-center gap-2
              bg-blue-600 text-white
              px-5 py-2 rounded-xl
            "
          >
            <Save className="w-4 h-4" />

            {loading ? "Saving..." : "Create Post"}
          </button>
        </form>
      </div>
  );
}