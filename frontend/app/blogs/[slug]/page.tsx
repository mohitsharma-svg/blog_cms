import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import { BookPlus, CalendarDays, Clock4, User } from "lucide-react";

import api from "@/lib/api";
import { API_BASE_URL } from "@/lib/config";

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

async function getPost(slug: string) {
  try {
    const res = await api.get(`/blogs/slug/${slug}`);
    console.log(res.data)
    return res.data;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export default async function BlogDetails({
  params,
}: Props) {
  const { slug } = await params;

  const post = await getPost(slug);

  if (!post) {
    return (
      <>
        <Header />

        <main className="min-h-screen flex items-center justify-center">
          <h1 className="text-3xl font-bold">
            Blog not found
          </h1>
        </main>

        <Footer />
      </>
    );
  }

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

    if (seconds < 60) {
      return `${seconds} sec ago`;
    }

    if (minutes < 60) {
      return `${minutes} min ago`;
    }

    if (hours < 24) {
      return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    }

    if (days < 30) {
      return `${days} day${days > 1 ? "s" : ""} ago`;
    }

    if (months < 12) {
      return `${months} month${months > 1 ? "s" : ""} ago`;
    }

    return `${years} year${years > 1 ? "s" : ""} ago`;
  };

  const imageUrl = post.image_url
    ? post.image_url
      .replace("127.0.0.1", "localhost")
      .startsWith("http")
      ? post.image_url.replace("127.0.0.1", "localhost")
      : `${API_BASE_URL}${post.image_url.startsWith("/") ? "" : "/"
      }${post.image_url}`
    : "/no-image.png";

  const created_date = post.created_at
    ? new Date(post.created_at).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    })
    : "Recently";

  const timeAgo = post.created_at
    ? getTimeAgo(post.created_at)
    : "";

  return (
    <>
      <Header />

      <main className="max-w-4xl mx-auto px-6 py-16">
        <img
          src={imageUrl}
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
            {created_date}
          </span>

          <span className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-600 px-4 py-2 rounded-full text-sm font-medium">
            <Clock4 className="w-4 h-4" />
            {timeAgo}
          </span>
        </div>

        <h1 className="text-5xl font-bold leading-tight mb-8">
          {post.title}
        </h1>
        <div
          className="prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{
            __html: post.description,
          }}
        />
      </main>

      <Footer />
    </>
  );
}