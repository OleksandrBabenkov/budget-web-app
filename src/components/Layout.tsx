// src/components/Layout.tsx
import { Outlet, Link } from 'react-router-dom';

export function Layout() {
  return (
    // Use your theme colors!
    <div className="min-h-screen bg-neutral-50 text-neutral-800">
      <header className="bg-white border-b border-neutral-200">
        <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link
            to="/"
            className="text-2xl font-bold text-primary-600 hover:text-primary-500"
          >
            MySaaS
          </Link>
          <div className="flex items-center gap-4">
            <Link
              to="/login"
              className="text-neutral-600 hover:text-primary-600"
            >
              Log In
            </Link>
            <Link
              to="/login" // You'd change this to a /signup page
              className="bg-primary-600 text-white px-4 py-2 rounded-md font-medium hover:bg-primary-500"
            >
              Sign Up
            </Link>
          </div>
        </nav>
      </header>

      {/* This is where your page content will be rendered */}
      <main className="container mx-auto p-4">
        <Outlet />
      </main>
    </div>
  );
}