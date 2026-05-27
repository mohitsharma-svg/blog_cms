import Image from "next/image";
import Link from "next/link";

import {
  User,
  CalendarDays,
  FolderOpen,
} from "lucide-react";

interface Blog {
  id: number;
  title: string;
  image: string;
  description: string;
  category?: string;
  author: string;
  date: string;
  slug?: string;
}

export default function BlogCard({
  blog,
}: {
  blog: Blog;
}) {
  // Fix localhost issue for Next.js Image
  const imageUrl = blog.image
    ? blog.image.replace("127.0.0.1", "localhost")
    : "/no-image.png";

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition duration-300 group">
      {/* Image */}
      <div className="relative h-60 w-full overflow-hidden">
        <Image
          src={imageUrl}
          alt={blog.title}
          fill
          priority
          unoptimized
          className="object-cover group-hover:scale-105 transition duration-500"
        />
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Meta */}
        <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 mb-4">
          {/* Category */}
          {blog.category && (
            <span className="inline-flex items-center gap-1 bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full">
              <FolderOpen className="w-4 h-4" />
              {blog.category}
            </span>
          )}

          <span className="inline-flex items-center gap-1">
            <User className="w-4 h-4" />
            {blog.author}
          </span>

          <span className="inline-flex items-center gap-1">
            <CalendarDays className="w-4 h-4" />
            {blog.date}
          </span>
        </div>

        <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
          {blog.title}
        </h3>

        <p className="text-gray-600 text-sm leading-6 mb-5 line-clamp-3">
          {blog.description}
        </p>

        {blog.slug ? (
          <Link
            href={`/blogs/${blog.slug}`}
            className="inline-flex items-center text-indigo-600 font-semibold hover:text-indigo-800 transition"
          >
            Read More →
          </Link>
        ) : (
          <button className="inline-flex items-center text-indigo-600 font-semibold hover:text-indigo-800 transition">
            Read More →
          </button>
        )}
      </div>
    </div>
  );
}