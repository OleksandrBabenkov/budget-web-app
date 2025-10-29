import React, { useState } from 'react';
import type { FormEvent } from 'react';
import { db } from '../firebaseConfig'; // Import your configured db instance
import { collection, addDoc, Timestamp, serverTimestamp,
  doc, getDoc, updateDoc
 } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext'; // Import your custom Auth hook
import { useEffect } from 'react';


interface ExpenseFormProps {
  editingExpenseId: string | null;
  onDone: () => void; // Function to call on success or cancel
}
// --- Design System Placeholders ---
// As per your report, you have a custom design system.
// Replace these placeholders with your actual pre-built components
// (e.g., from src/styles/theme.ts)
const Input = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input {...props} className="w-full p-2 border rounded" />
);
const Select = (props: React.SelectHTMLAttributes<HTMLSelectElement>) => (
  <select {...props} className="w-full p-2 border rounded" />
);
const Textarea = (props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => (
  <textarea {...props} className="w-full p-2 border rounded" />
);
import { Button } from './Button';
// const Button = (props: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
//   <button
//     {...props}
//     className="w-full p-2 bg-blue-600 text-white rounded disabled:bg-gray-400"
//   />
// );
// --- End of Placeholders ---

// A good practice is to define categories in a constant
const expenseCategories = [
  'Food',
  'Transport',
  'Bills',
  'Groceries',
  'Entertainment',
  'Other',
];

export const ExpenseForm = ({ editingExpenseId, onDone }: ExpenseFormProps) => {
  // Form state
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState(expenseCategories[0]);
  const [date, setDate] = useState('');
  const [comment, setComment] = useState('');

  // App state
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { user } = useAuth(); // Get user from your AuthContext

  useEffect(() => {
    // Function to fetch expense data and populate the form
    const fetchExpenseData = async (id: string) => {
      setIsLoading(true);
      try {
        const docRef = doc(db, 'expenses', id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const expense = docSnap.data();
          
          // --- Security check (optional but good) ---
          if (expense.userId !== user?.uid) {
            setError("You don't have permission to edit this expense.");
            onDone();

            return;
          }

          // Populate form
          setAmount(expense.amount.toString());
          setCategory(expense.category);
          setComment(expense.comment);
          
          // Convert Firestore Timestamp back to YYYY-MM-DD string
          const expenseDate = expense.date.toDate();
          const localDate = new Date(expenseDate.getTime() - (expenseDate.getTimezoneOffset() * 60000));
          setDate(localDate.toISOString().split('T')[0]);

        } else {
          setError('Expense not found.');
          onDone();
        }
      } catch (err) {
        console.error(err);
        setError('Failed to fetch expense data.');
        onDone();
      } finally {
        setIsLoading(false);
      }
    };

    if (editingExpenseId) {
      fetchExpenseData(editingExpenseId);
    } else {
      // Not in edit mode, so reset the form
      resetForm();
    }
  }, [editingExpenseId, user?.uid, onDone]); // Add dependencies

  const resetForm = () => {
    setAmount('');
    setCategory(expenseCategories[0]);
    setDate('');
    setComment('');
    setError(null);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    // 1. Validation
    if (!user) {
      setError('You must be logged in to add an expense.');
      return;
    }
    if (!amount || !category || !date) {
      setError('Please fill out all required fields.');
      return;
    }

    setIsLoading(true);

    const expenseData = {
      userId: user.uid,
      amount: parseFloat(amount),
      category: category,
      date: Timestamp.fromDate(new Date(date + 'T00:00:00')),
      comment: comment,
    };

    try {
      if (editingExpenseId) {
        // --- UPDATE LOGIC ---
        const docRef = doc(db, 'expenses', editingExpenseId);
        await updateDoc(docRef, { ...expenseData });
      } else {
        // --- CREATE LOGIC ---
        await addDoc(collection(db, 'expenses'), {
          ...expenseData,
          createdAt: serverTimestamp(),
        });
      }
      
      onDone(); // <-- Call this on success to close the modal
      
    } catch (err) {
      console.error(err);
      setError('Failed to save expense. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded-lg shadow-sm">
      {/*
      <h3 className="text-lg font-semibold">
        {editingExpenseId ? 'Update Expense' : 'Add New Expense'}
      </h3>
      */}
      
      {error && <p className="text-red-500">{error}</p>}

      <div>
        <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
          Amount
        </label>
        <Input
          id="amount"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="0.00"
          step="0.01"
          required
        />
      </div>

      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700">
          Category
        </label>
        <Select
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        >
          {expenseCategories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </Select>
      </div>

      <div>
        <label htmlFor="date" className="block text-sm font-medium text-gray-700">
          Date
        </label>
        <Input
          id="date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
      </div>

      <div>
        <label htmlFor="comment" className="block text-sm font-medium text-gray-700">
          Comment (Optional)
        </label>
        <Textarea
          id="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="e.g., Lunch with team"
          rows={3}
        />
      </div>

      <div className="flex gap-4">
        <Button type="submit" disabled={isLoading} className="flex-1">
          {isLoading 
            ? 'Saving...' 
            : (editingExpenseId ? 'Update Expense' : 'Add Expense')
          }
        </Button>
        
        {/* --- Cancel Button --- */}
        {editingExpenseId && (
        <Button
          type="button"
          className="flex-1 bg-gray-600"
          onClick={onDone} // <-- Call this to close the modal
        >
          Cancel
        </Button>
        )}
      </div>
    </form>
  );
};