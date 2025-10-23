// src/contexts/AuthContext.tsx
import {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';
import type { ReactNode } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import type { User, UserCredential } from 'firebase/auth';
import { auth } from '../firebaseConfig'; // Import your auth service

// Define the shape of the context's value
interface AuthContextType {
  user: User | null;
  loading: boolean;
  signUp: (email: string, pass: string) => Promise<UserCredential>;
  logIn: (email: string, pass: string) => Promise<UserCredential>;
  logOut: () => Promise<void>;
}

// Create the context
// We use '!' to tell TypeScript we'll definitely provide a value
const AuthContext = createContext<AuthContextType>(null!);

// Best Practice: Create a custom hook to consume the context
export function useAuth() {
  return useContext(AuthContext);
}

// Create the Provider component
interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // The listener
  useEffect(() => {
    // onAuthStateChanged returns an 'unsubscribe' function
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    // Clean up the listener when the component unmounts
    return unsubscribe;
  }, []); // Empty array ensures this runs only once

  // Auth functions
  function signUp(email: string, pass: string) {
    return createUserWithEmailAndPassword(auth, email, pass);
  }

  function logIn(email: string, pass: string) {
    return signInWithEmailAndPassword(auth, email, pass);
  }

  function logOut() {
    return signOut(auth);
  }

  // The value to be passed to all consuming components
  const value = {
    user,
    loading,
    signUp,
    logIn,
    logOut,
  };

  // Render the provider
  // We don't render children until loading is false
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}