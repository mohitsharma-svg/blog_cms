export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-10">
        <div>
          <h3 className="text-2xl font-bold text-white mb-4">
            MyBlog
          </h3>

          <p className="text-sm leading-7">
            Modern blog platform built using Next.js and Tailwind CSS.
          </p>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-4">
            Quick Links
          </h4>

          <ul className="space-y-3 text-sm">
            <li>Home</li>
            <li>Blogs</li>
            <li>About</li>
            <li>Contact</li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-4">
            Newsletter
          </h4>

          <div className="flex flex-col gap-4">
            <input
              type="email"
              placeholder="Enter your email"
              className="px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 outline-none"
            />

            <button className="bg-indigo-600 hover:bg-indigo-700 px-4 py-3 rounded-lg text-white transition">
              Subscribe
            </button>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-800 py-5 text-center text-sm text-gray-400">
        © 2026 MyBlog. All rights reserved.
      </div>
    </footer>
  );
}