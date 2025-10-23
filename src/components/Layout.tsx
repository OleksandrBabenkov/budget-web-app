// src/components/Layout.tsx
import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, BarChartHorizontal, LogOut } from 'lucide-react';
import clsx from 'clsx'; // Your template has this!

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { user, logOut } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation(); // To know which page is active

  const handleLogout = async () => {
    try {
      await logOut();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  const navLinks = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Statistics', href: '/stats', icon: BarChartHorizontal },
  ];

  return (
    // Use your theme's neutral palette for the background
    <div className="flex min-h-screen bg-neutral-100">
      {/* Sidebar Navigation */}
      <nav className="flex w-64 flex-col border-r border-neutral-200 bg-white">
        {/* Logo/Brand */}
        <div className="flex h-16 shrink-0 items-center px-6">
          <h1 className="text-xl font-bold text-primary-600">
            ExpenseTracker
          </h1>
        </div>
        {/* Nav Links */}
        <div className="flex flex-1 flex-col gap-y-4 overflow-y-auto p-4">
          {navLinks.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              // Use clsx to conditionally apply active styles!
              className={clsx(
                'flex items-center gap-x-3 rounded-md p-3 text-sm font-medium',
                pathname === item.href
                  ? 'bg-primary-100 text-primary-700' // Active link
                  : 'text-neutral-700 hover:bg-neutral-100' // Inactive link
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          ))}
        </div>
        {/* Logout Button at bottom */}
        <div className="mt-auto border-t border-neutral-200 p-4">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-x-3 rounded-md p-3 text-sm font-medium text-neutral-700 hover:bg-neutral-100"
          >
            <LogOut className="h-5 w-5" />
            Logout
          </button>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 p-8">
        <h1 className="mb-6 text-2xl font-semibold text-neutral-900">
          Welcome, {user?.email}!
        </h1>
        {/* Your page content (Dashboard/Stats) renders here */}
        {children}
      </main>
    </div>
  );
}