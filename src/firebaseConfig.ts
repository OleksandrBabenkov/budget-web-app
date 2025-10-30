// src/firebaseConfig.ts

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {
  initializeFirestore, // <-- 1. Import this instead of getFirestore
  persistentLocalCache, // <-- 2. Import the persistence-enabled cache
  persistentSingleTabManager, // <-- 3. Import the tab manager
} from 'firebase/firestore';


const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// 2. Initialize Firebase
const app = initializeApp(firebaseConfig);

// 3. Initialize and export Firebase services
// This is a best practice so you can import them from one place
export const auth = getAuth(app);
export const db = initializeFirestore(app, {
  // Use the persistent cache
  localCache: persistentLocalCache({
    // Use this tab manager to handle the 'failed-precondition' error
    tabManager: persistentSingleTabManager({}),
  }),
});

// 4. Export the initialized app (optional, but useful)
export default app;