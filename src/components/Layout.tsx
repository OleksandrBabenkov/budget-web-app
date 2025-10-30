// src/components/Layout.tsx
import React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, BarChartHorizontal, LogOut, Menu, Download } from 'lucide-react';
import clsx from 'clsx'; // Your template has this!

interface LayoutProps {
  children: React.ReactNode;
}

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: Array<string>;
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export function Layout({ children }: LayoutProps) {
  const { logOut } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation(); // To know which page is active

  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const [installPromptEvent, setInstallPromptEvent] = 
    useState<BeforeInstallPromptEvent | null>(null);

  const handleLogout = async () => {
    try {
      await logOut();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  useEffect(() => {
    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault(); // Stop the browser's mini-infobar
      setInstallPromptEvent(event as BeforeInstallPromptEvent); // Store the event
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Cleanup
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const navLinks = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Statistics', href: '/stats', icon: BarChartHorizontal },
  ];

  const handleInstallClick = async () => {
    if (!installPromptEvent) {
      return;
    }
    // Show the browser's install dialog
    await installPromptEvent.prompt();
    
    // Wait for the user to respond
    const { outcome } = await installPromptEvent.userChoice;
    
    if (outcome === 'accepted') {
      console.log('User accepted the PWA install prompt');
    } else {
      console.log('User dismissed the PWA install prompt');
    }
    // We can only prompt once, so clear the event
    setInstallPromptEvent(null);
  };

  return (
    // --- Root div: Changed ---
    // Remove 'flex' here, we handle it inside
    <div className="min-h-screen bg-neutral-100">
      {/* --- Mobile Backdrop --- */}
      {/* Add this backdrop to close the menu when clicking outside */}
      {mobileNavOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setMobileNavOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* --- Sidebar Navigation: Changed --- */}
      <nav
        className={clsx(
          'fixed inset-y-0 z-50 flex w-64 flex-col border-r border-neutral-200 bg-white',
          'transition-transform duration-300 ease-in-out lg:translate-x-0', // Desktop styles
          mobileNavOpen ? 'translate-x-0' : '-translate-x-full' // Mobile open/close
        )}
      >
        {/* Logo/Brand (no change) */}
        <div className="flex h-16 shrink-0 items-center px-6">
          <h1 className="text-xl font-bold text-primary-600">
            ExpenseTracker
          </h1>
        </div>
        {/* Nav Links (no change) */}
        <div className="flex flex-1 flex-col gap-y-4 overflow-y-auto p-4">
          {navLinks.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={clsx(
                // ... (no change to clsx logic)
              )}
              // --- Add this onClick to close menu on navigation ---
              onClick={() => setMobileNavOpen(false)}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          ))}
        </div>

        {/* --- 7. Add the Install Button --- */}
        {/* It will only show if the prompt has been captured */}
        {installPromptEvent && (
          <div className="p-4">
            <button
              onClick={handleInstallClick}
              className="flex w-full items-center gap-x-3 rounded-md p-3 text-sm font-medium bg-primary-600 text-white hover:bg-primary-700"
            >
              <Download className="h-5 w-5" />
              Install App
            </button>
          </div>
        )}

        {/* Logout Button (no change) */}
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

      {/* --- Main Content Wrapper: Changed --- */}
      {/* This new div offsets for the sidebar ONLY on desktop */}
      <div className="lg:pl-64">
        {/* --- Mobile Header: New --- */}
        {/* This header is ONLY visible on mobile */}
        <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-x-4 border-b border-neutral-200 bg-white px-4 shadow-sm lg:hidden">
          <button
            type="button"
            className="-m-2.5 p-2.5 text-neutral-700"
            onClick={() => setMobileNavOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <Menu className="h-6 w-6" />
          </button>
          <div className="flex-1 text-lg font-semibold text-primary-600">
            {/* Find the current page name to display */}
            {navLinks.find((link) => link.href === pathname)?.name}
          </div>
        </header>

        {/* --- Main Content Area: Changed --- */}
        {/* Padding is now mobile-first */}
        <main className="p-4 sm:p-6 lg:p-8">
          {/*
          <h1 className="mb-6 text-2xl font-semibold text-neutral-900">
            Welcome, {user?.email}!
          </h1>
          */}
          {/* Your page content (Dashboard/Stats) renders here */}
          {children}
        </main>
      </div>
    </div>
  );
}