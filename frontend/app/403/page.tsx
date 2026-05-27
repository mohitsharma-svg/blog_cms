export default function Forbidden() {
  return (
    <div className="h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-5xl font-bold text-red-500">403</h1>
        <p className="mt-2 text-gray-600">
          You don’t have permission to access this page
        </p>

        <a href="/dashboard" className="text-blue-600 underline mt-4 block">
          Go back
        </a>
      </div>
    </div>
  );
}