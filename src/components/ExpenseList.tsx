import React, { useState, useEffect } from 'react';
import { db } from '../firebaseConfig';
import {
  collection,
  query,
  where,
  onSnapshot,
  orderBy,
  Timestamp,
  doc, // <-- Add this
  deleteDoc, // <-- Add this
} from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext'; // Your custom hook
import { Trash2, Edit } from 'lucide-react'; // Using icons from your stack

// --- Design System Placeholders ---
// Using placeholder components as before.
// Replace these with your actual pre-built components.
const IconButton = (props: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button
    {...props}
    className="p-1.5 text-gray-500 hover:text-gray-900 disabled:text-gray-300"
  />
);
const LoadingSpinner = () => (
  <div className="text-center p-4">Loading expenses...</div>
);
const ErrorMessage = ({ children }: { children: React.ReactNode }) => (
  <div className="text-center p-4 text-red-600">{children}</div>
);
const EmptyState = ({ children }: { children: React.ReactNode }) => (
  <div className="text-center p-4 text-gray-500">{children}</div>
);
// --- End of Placeholders ---

// Define a type for our expense object
// This matches the data structure we're writing
export interface Expense {
  id: string; // The Firestore document ID
  userId: string;
  amount: number;
  category: string;
  date: Timestamp; // Keep as Timestamp for potential future logic
  comment: string;
}

export const ExpenseList = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [deletingId, setDeletingId] = useState<string | null>(null);

  const { user } = useAuth(); // Get the user from your context

  useEffect(() => {
    // If there's no user, don't query
    if (!user) {
      setLoading(false);
      setExpenses([]); // Clear expenses if user logs out
      return;
    }

    setLoading(true);
    setError(null);

    // 1. Create the query
    const expensesColRef = collection(db, 'expenses');
    const q = query(
      expensesColRef,
      where('userId', '==', user.uid), // <-- The crucial security/filter rule
      orderBy('date', 'desc') // Show most recent expenses first
    );

    // 2. Set up the real-time listener
    // 'onSnapshot' returns an 'unsubscribe' function
    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const expensesData: Expense[] = [];
        querySnapshot.forEach((doc) => {
          expensesData.push({
            id: doc.id,
            ...(doc.data() as Omit<Expense, 'id'>),
          });
        });
        setExpenses(expensesData);
        setLoading(false);
      },
      (err) => {
        // Handle errors from the listener
        console.error(err);
        setError('Failed to fetch expenses. Please try again.');
        setLoading(false);
      }
    );

    // 3. Clean up the listener on component unmount
    return () => unsubscribe();
  }, [user]); // Re-run this effect if the user changes

  // --- Placeholder Functions for CRUD ---
  const handleEdit = (id: string) => {
    console.log('Edit expense:', id);
    // Future: Open a modal with ExpenseForm pre-filled with this data
  };

  const handleDelete = async (id: string) => {
      // Basic confirmation
      if (!window.confirm('Are you sure you want to delete this expense?')) {
        return;
      }

      setDeletingId(id); // Disable the button
      
      try {
        // 1. Get a reference to the specific document
        const docRef = doc(db, 'expenses', id);
        
        // 2. Delete the document
        await deleteDoc(docRef);
        
        // 'onSnapshot' will automatically update the UI,
        // so we don't need to manually remove it from the 'expenses' state.

      } catch (err) {
        console.error('Error deleting document: ', err);
        // Optional: show a user-facing error message
      } finally {
        setDeletingId(null); // Re-enable button
      }
    };
  
  // --- Render Logic ---

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage>{error}</ErrorMessage>;
  }

  if (expenses.length === 0) {
    return <EmptyState>You have no expenses yet. Add one above!</EmptyState>;
  }

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold">Your Expenses</h3>
      <ul className="divide-y divide-gray-200">
        {expenses.map((expense) => (
          <li
            key={expense.id}
            className="flex items-center justify-between p-3"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {expense.category}
                </p>
                <p className="text-sm font-semibold text-gray-900">
                  ${expense.amount.toFixed(2)}
                </p>
              </div>
              <div className="flex items-center justify-between mt-1">
                <p className="text-sm text-gray-500 truncate">
                  {expense.comment || <span className="italic">No comment</span>}
                </p>
                <p className="text-sm text-gray-500">
                  {/* Convert Firestore Timestamp to readable date */}
                  {expense.date.toDate().toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </p>
              </div>
            </div>
            <div className="ml-4 flex-shrink-0 flex items-center">
              <IconButton
                onClick={() => handleEdit(expense.id)}
                aria-label="Edit expense"
              >
                <Edit size={18} />
              </IconButton>
              <IconButton
                onClick={() => handleDelete(expense.id)}
                aria-label="Delete expense"
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 size={18} />
              </IconButton>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};