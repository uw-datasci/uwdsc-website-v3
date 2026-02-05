import Link from "next/link";

export default function AuthCodeErrorPage() {
  return (
    <div className="p-8 max-w-md mx-auto text-center">
      <h1 className="text-2xl font-bold mb-4">Authentication Error</h1>
      <p className="text-gray-600 mb-6">
        There was an error verifying your email. Please try again.
      </p>
      <div className="space-y-4">
        <Link
          href="/login"
          className="block w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Try Login Again
        </Link>
        <Link
          href="/register"
          className="block w-full px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
        >
          Register New Account
        </Link>
      </div>
    </div>
  );
}
