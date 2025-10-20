// src/pages/LoginPage.tsx
export function LoginPage() {
  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-neutral-900 text-center mb-6">
        Log In
      </h2>
      <form className="flex flex-col gap-4">
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-neutral-700 mb-1"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            className="w-full border border-neutral-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="you@example.com"
          />
        </div>
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-neutral-700 mb-1"
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            className="w-full border border-neutral-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-primary-600 text-white py-2.5 rounded-lg font-medium hover:bg-primary-500"
        >
          Log In
        </button>
      </form>
    </div>
  );
}