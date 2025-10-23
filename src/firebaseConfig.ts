// src/firebaseConfig.ts

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// import { enablePersistence } from "firebase/firestore";

// enablePersistence(db)
//   .catch((err) => console.log("Firebase persistence error: ", err));
// 1. Read the environment variables from Vite
// Vite exposes .env variables on the `import.meta.env` object
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
export const db = getFirestore(app);
// export const storage = getStorage(app);
// export const analytics = getAnalytics(app);


// 4. Export the initialized app (optional, but useful)
export default app;