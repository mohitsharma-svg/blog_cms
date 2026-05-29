"use client";

import { useEffect, useState } from "react";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import { useParams } from "next/navigation";
import api from "@/lib/api";
import { BookPlus, CalendarDays, Clock4, User } from "lucide-react";
import { API_BASE_URL } from "@/lib/config";

export default function BlogDetails() {
  const { slug } = useParams<{ slug: string }>();

  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;

    const getPost = async () => {
      try {
        const res = await api.get(`/blogs/slug/${slug}`);
        setPost(res.data);
      } catch (err) {
        console.error("API ERROR:", err);
        setPost(null);
      } finally {
        setLoading(false);
      }
    };

    getPost();
  }, [slug]);

  if (loading) {
    return (
      <>
        <Header />
        <main className="min-h-screen flex items-center justify-center">
          <p>Loading...</p>
        </main>
        <Footer />
      </>
    );
  }


const image_Url = post.image_url
  ? post.image_url.startsWith("http")
    ? post.image_url
    : `${API_BASE_URL}${post.image_url.startsWith("/") ? "" : "/"}${post.image_url}`
  : "/no-image.png";

  if (!post) {
    return (
      <>
        <Header />
        <main className="min-h-screen flex items-center justify-center">
          <h1 className="text-3xl font-bold">Blog not found</h1>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />

      <main className="max-w-4xl mx-auto px-6 py-16">
        <img
          src={image_Url || "/no-image.png"}
          alt={post.title}
          className="w-full h-[500px] object-cover rounded-2xl mb-10"
        />

        <div className="flex flex-wrap gap-3 mb-6">
          <span className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-600 px-4 py-2 rounded-full text-sm font-medium">
            <BookPlus className="w-4 h-4" />
            {post.category_name || "General"}
          </span>

          <span className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-600 px-4 py-2 rounded-full text-sm font-medium">
            <User className="w-4 h-4" />
            {post.user_name || "Unknown"}
          </span>

          <span className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-600 px-4 py-2 rounded-full text-sm font-medium">
            <CalendarDays className="w-4 h-4" />
            {post.created_at
              ? new Date(post.created_at).toLocaleDateString("en-IN")
              : "Recently"}
          </span>

          <span className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-600 px-4 py-2 rounded-full text-sm font-medium">
            <Clock4 className="w-4 h-4" />
            {post.created_at ? "recent" : ""}
          </span>
        </div>

        <h1 className="text-5xl font-bold mb-8">{post.title}</h1>

        <div
          className="prose"
          dangerouslySetInnerHTML={{ __html: post.description || "" }}
        />
      </main>

      <Footer />
    </>
  );
}