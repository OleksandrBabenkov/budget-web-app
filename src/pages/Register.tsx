// Copyright (c) 2025 Oleksandr Babenkov
// All Rights Reserved


// src/pages/Register.tsx
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { GoogleLogo } from '../components/GoogleLogo'; // Adjust path as needed
import { useEffect } from 'react';

export function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { user, signUp, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      await signUp(email, password);
      navigate('/'); // Redirect to dashboard on success
    } catch (err) {
      setError('Failed to create an account.');
      console.error(err);
    }
  };


  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      // Navigate to dashboard (or AuthContext will handle it)
    } catch (error) {
      console.error("Failed to sign in with Google", error);
    }
  };

  useEffect(() => {
    // If the user object exists (is not null), they are logged in.
    if (user) {
      navigate('/'); // Redirect to the dashboard
    }
  }, [user, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded shadow-md">
        <h2 className="text-2xl font-bold text-center">Sign Up</h2>
        {error && (
          <p className="p-3 text-red-700 bg-red-100 rounded">{error}</p>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password (min. 6 characters)
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 font-medium text-white bg-indigo-600 rounded shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Sign Up
          </button>
        </form>
        <p className="text-sm text-center">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
            Log In
          </Link>
        </p>

        <div className="w-full max-w-sm mx-auto p-4">
          {/* ... your other form elements (email/password) ... */}
          
          <button
            onClick={handleGoogleSignIn}
            type="button" // Use 'button' to prevent form submission
            className="
              flex items-center justify-center w-full px-4 py-2 
              border border-gray-300 rounded-lg shadow-sm
              bg-white 
              text-sm font-medium text-gray-700 
              hover:bg-gray-50 
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
              transition duration-150 ease-in-out
            "
          >
            <GoogleLogo />
            <span className="ml-3">Sign in with Google</span>
          </button>
        </div>


      </div>
    </div>
  );
}