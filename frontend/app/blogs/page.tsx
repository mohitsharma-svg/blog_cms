"use client";

import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import BlogCard from "@/app/components/BlogCard";
import { API_BASE_URL } from "@/lib/config";
import api from "@/lib/api";

interface Blog {
    id: string;
    title: string;
    description: string;
    image_url: string;
    slug: string;
    category_name?: string;
    user_name?: string;
    status?: string;
    created_at?: string;
}

export default function Blogs() {
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // ✅ CACHE (IMPORTANT FIX)
    const cache = useRef<Record<number, Blog[]>>({});

    const fetchPosts = async (pageNumber: number = 1) => {
        try {
            setPage(pageNumber);
            if (cache.current[pageNumber]) {
                setBlogs(cache.current[pageNumber]);
                return;
            }

            setLoading(true);

            const res = await api.get(
                `/posts/?page=${pageNumber}&limit=6`
            );

            const response = res.data;

            const activePosts = response.data.filter(
                (post: Blog) => post.status === "active"
            );

            // ✅ STORE IN CACHE
            cache.current[pageNumber] = activePosts;

            setBlogs(activePosts);
            setTotalPages(response.total_pages);
        } catch (error) {
            console.error(error);
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

            <main className="min-h-screen bg-gray-50">
                <section className="max-w-7xl mx-auto px-6 py-16">

                    {/* Heading */}
                    <div className="mb-12">
                        <h1 className="text-4xl font-bold text-gray-900 mb-3">
                            Latest Blog Posts
                        </h1>
                        <p className="text-gray-600">
                            Explore modern articles and insights.
                        </p>
                    </div>

                    {/* Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative">

                        {/* ✅ Soft loading (NO full UI hide) */}
                        {loading && (
                            <div className="absolute inset-0 flex justify-center items-center bg-white/40 z-10">
                                <p className="text-gray-600 animate-pulse">
                                    Loading...
                                </p>
                            </div>
                        )}

                        {blogs.map((blog) => {
                            const fixedImageUrl = blog.image_url
                                ? blog.image_url.replace(
                                      "127.0.0.1",
                                      "localhost"
                                  )
                                : "";

                            const image =
                                fixedImageUrl &&
                                fixedImageUrl.startsWith("http")
                                    ? fixedImageUrl
                                    : fixedImageUrl
                                    ? `${API_BASE_URL}${
                                          fixedImageUrl.startsWith("/")
                                              ? ""
                                              : "/"
                                      }${fixedImageUrl}`
                                    : "/no-image.png";

                            const created_date = blog.created_at
                                ? new Date(
                                      blog.created_at
                                  ).toLocaleDateString("en-IN", {
                                      day: "2-digit",
                                      month: "long",
                                      year: "numeric",
                                  })
                                : "Recently";

                            const timeAgo = blog.created_at
                                ? getTimeAgo(blog.created_at)
                                : "";

                            return (
                                <BlogCard
                                    key={blog.id}
                                    blog={{
                                        id: Number(blog.id),
                                        title: blog.title,
                                        description: blog.description
                                            .replace(/<[^>]*>/g, "")
                                            .slice(0, 140),
                                        slug: blog.slug,
                                        image,
                                        category:
                                            blog.category_name ||
                                            "General",
                                        author:
                                            blog.user_name || "Admin",
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
                            className="px-4 py-2 border rounded disabled:opacity-40"
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
                            className="px-4 py-2 border rounded disabled:opacity-40"
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