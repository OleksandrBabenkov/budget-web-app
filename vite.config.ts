// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa'; // <-- 1. Import

export default defineConfig({
  plugins: [
    react(),
    // --- 2. Add the PWA plugin ---
    VitePWA({
      // registerType: 'autoUpdate', // Optional: auto-update the service worker
      
      // --- 3. Configure the Manifest ---
      manifest: {
        name: 'React Expense Tracker',
        short_name: 'Expenses',
        description: 'A simple app for tracking daily expenses.',
        theme_color: '#ffffff', // Your app's main theme color
        background_color: '#ffffff',
        start_url: '/',
        display: 'standalone',
        scope: '/',
        icons: [
          // You need to create these icons and place them in your 'public' folder
          {
            src: '/manifest-icon-192.maskable.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/manifest-icon-512.maskable.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: '/manifest-icon-512.maskable.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable', // Important for Android
          },
        ],
      },

      // --- 4. Service Worker Strategy (Caching) ---
      workbox: {
        // This will cache your app shell (HTML, JS, CSS, fonts, images)
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff,woff2}'],
      },
    }),
  ],
});