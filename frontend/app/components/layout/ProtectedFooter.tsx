export default function ProtectedFooter() {
  return (
    <footer className="border-t border-gray-200 bg-white px-6 py-4">
      <div className="flex flex-col items-center justify-between gap-2 text-center text-sm text-gray-500 md:flex-row">
        <p>
          © {new Date().getFullYear()} My App. All rights reserved.
        </p>

        <div className="flex items-center gap-4">
          <span className="hover:text-gray-700 transition cursor-pointer">
            Privacy Policy
          </span>

          <span className="hover:text-gray-700 transition cursor-pointer">
            Terms
          </span>

          <span className="hover:text-gray-700 transition cursor-pointer">
            Support
          </span>
        </div>
      </div>
    </footer>
  );
}