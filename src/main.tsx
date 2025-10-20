// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css'; // <-- Your Tailwind styles

// Import your components
import { Layout } from './components/Layout';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';

// Configure the routes
const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />, // The main layout wraps all pages
    children: [
      {
        index: true, // This makes HomePage the default child
        element: <HomePage />,
      },
      {
        path: 'login',
        element: <LoginPage />,
      },
      // ... add other routes here (e.g., /signup, /dashboard)
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);