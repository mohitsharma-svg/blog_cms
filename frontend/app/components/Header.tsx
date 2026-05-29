import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link
          href="/"
          className="text-2xl font-bold text-indigo-600"
        >
          Blog CMS
        </Link>

        <nav className="hidden md:flex items-center gap-8 font-medium">
          <Link
            href="/"
            className="hover:text-indigo-600 transition"
          >
            Home
          </Link>

          <Link
            href="/blogs"
            className="hover:text-indigo-600 transition"
          >
            Blogs
          </Link>

          <Link
            href="/about"
            className="hover:text-indigo-600 transition"
          >
            About
          </Link>

          <Link
            href="/contact"
            className="hover:text-indigo-600 transition"
          >
            Contact
          </Link>
        </nav>

        <button onClick={() => window.location.href="/login"} className="bg-indigo-600 text-white px-5 py-2 rounded-lg hover:bg-indigo-700 transition">
          Login
        </button>
      </div>
    </header>
  );
}