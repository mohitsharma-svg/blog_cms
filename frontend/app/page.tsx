"use client";

import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import BlogCard from "@/app/components/BlogCard";
import { useState, useEffect, useRef } from "react";
import api from "@/lib/api";
import toast from "react-hot-toast";
import { API_BASE_URL } from "@/lib/config";

interface Post {
  id: number;
  title: string;
  description: string;
  image_url: string;
  slug: string;
  category_name?: string;
  user_name?: string;
  status?: string;
  created_at?: string;
}

export default function HomePage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // ✅ CACHE (IMPORTANT FIX)
  const cache = useRef<Record<number, Post[]>>({});

  const fetchPosts = async (pageNumber: number = 1) => {
    try {
      setPage(pageNumber);

      // ✅ instant render from cache (NO FLICKER)
      if (cache.current[pageNumber]) {
        setPosts(cache.current[pageNumber]);
        return;
      }

      setLoading(true);

      const res = await api.get(
        `/posts/?page=${pageNumber}&limit=6`
      );

      const response = res.data;

      const activePosts = response.data.filter(
        (post: Post) => post.status === "active"
      );

      // cache store
      cache.current[pageNumber] = activePosts;

      setPosts(activePosts);
      setTotalPages(response.total_pages);
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch blog posts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts(1);
  }, []);

  const getTimeAgo = (dateString: string) => {
    const now = new Date();
    const postDate = new Date(dateString);

    const seconds = Math.floor(
      (now.getTime() - postDate.getTime()) / 1000
    );

    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);

    if (seconds < 60) return `${seconds} sec ago`;
    if (minutes < 60) return `${minutes} min ago`;
    if (hours < 24)
      return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    if (days < 30)
      return `${days} day${days > 1 ? "s" : ""} ago`;
    if (months < 12)
      return `${months} month${months > 1 ? "s" : ""} ago`;

    return `${years} year${years > 1 ? "s" : ""} ago`;
  };

  return (
    <>
      <Header />

      <main className="flex-1">

        {/* Hero */}
        <section className="bg-gradient-to-r from-indigo-600 to-blue-500 text-white py-24">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <h1 className="text-5xl font-bold mb-6">
              Welcome to My Blog Website
            </h1>

            <p className="text-lg max-w-2xl mx-auto mb-8 text-gray-100">
              Explore articles about programming, Next.js, React, Tailwind CSS,
              APIs, and full stack development.
            </p>

            <button className="bg-white text-indigo-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition">
              Explore Blogs
            </button>
          </div>
        </section>

        {/* Blog Section */}
        <section className="max-w-7xl mx-auto px-6 py-16">

          <div className="flex items-center justify-between mb-10">
            <h2 className="text-3xl font-bold">
              Latest Blog Posts
            </h2>
          </div>

          {/* ❗ Soft loading (NO page wipe) */}
          {loading && (
            <div className="text-center mb-6 text-gray-500 animate-pulse">
              Loading...
            </div>
          )}

          {/* Empty */}
          {!loading && posts.length === 0 && (
            <div className="flex justify-center py-20">
              <p className="text-lg text-gray-500">
                No blog posts found
              </p>
            </div>
          )}

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => {
              const fixedImageUrl = post.image_url
                ? post.image_url.replace("127.0.0.1", "localhost")
                : "";

              const image =
                fixedImageUrl && fixedImageUrl.startsWith("http")
                  ? fixedImageUrl
                  : fixedImageUrl
                  ? `${API_BASE_URL}${
                      fixedImageUrl.startsWith("/") ? "" : "/"
                    }${fixedImageUrl}`
                  : "/no-image.png";

              const created_date = post.created_at
                ? new Date(post.created_at).toLocaleDateString(
                    "en-IN",
                    {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    }
                  )
                : "Recently";

              const timeAgo = post.created_at
                ? getTimeAgo(post.created_at)
                : "";

              return (
                <BlogCard
                  key={post.id}
                  blog={{
                    id: Number(post.id),
                    title: post.title,
                    description: post.description.replace(
                      /<[^>]*>/g,
                      ""
                    ).slice(0, 140),
                    slug: post.slug,
                    image,
                    category: post.category_name || "General",
                    author: post.user_name || "Admin",
                    date: `${created_date} • ${timeAgo}`,
                  }}
                />
              );
            })}
          </div>

          {/* Pagination */}
          <div className="flex justify-center items-center gap-2 mt-10">

            <button
              onClick={() => fetchPosts(page - 1)}
              disabled={page === 1}
              className="px-3 py-2 border rounded disabled:opacity-40"
            >
              Prev
            </button>

            {Array.from(
              { length: totalPages },
              (_, i) => i + 1
            ).map((p) => (
              <button
                key={p}
                onClick={() => fetchPosts(p)}
                className={`w-10 h-10 rounded-full border ${
                  page === p
                    ? "bg-black text-white"
                    : "bg-white text-black hover:bg-gray-100"
                }`}
              >
                {p}
              </button>
            ))}

            <button
              onClick={() => fetchPosts(page + 1)}
              disabled={page === totalPages}
              className="px-3 py-2 border rounded disabled:opacity-40"
            >
              Next
            </button>

          </div>

        </section>
      </main>

      <Footer />
    </>
  );
}