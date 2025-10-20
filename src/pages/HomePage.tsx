// src/pages/HomePage.tsx
export function HomePage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-neutral-900">
        Welcome to your SaaS Starter
      </h1>
      <p className="mt-2 text-neutral-700">
        Everything is set up and ready to go!
      </p>

      <div className="mt-8 flex gap-4">
        <button className="bg-primary-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-primary-500">
          Primary Button
        </button>
        <button className="bg-neutral-200 text-neutral-800 px-5 py-2.5 rounded-lg font-medium hover:bg-neutral-300">
          Secondary Button
        </button>
      </div>

      <div className="mt-6 flex flex-col gap-2">
        <div className="bg-success-100 border-l-4 border-success-500 text-success-700 p-4 rounded-md">
          This is a success message.
        </div>
        <div className="bg-warning-100 border-l-4 border-warning-500 text-warning-700 p-4 rounded-md">
          This is a warning message.
        </div>
        <div className="bg-error-100 border-l-4 border-error-500 text-error-700 p-4 rounded-md">
          This is an error message.
        </div>
      </div>
    </div>
  );
}