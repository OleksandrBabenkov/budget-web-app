import React, { useState } from 'react';
import type { FormEvent } from 'react';
import { db } from '../firebaseConfig'; // Import your configured db instance
import { collection, addDoc, Timestamp, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext'; // Import your custom Auth hook

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
const Button = (props: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button
    {...props}
    className="w-full p-2 bg-blue-600 text-white rounded disabled:bg-gray-400"
  />
);
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

export const ExpenseForm = () => {
  // Form state
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState(expenseCategories[0]);
  const [date, setDate] = useState('');
  const [comment, setComment] = useState('');

  // App state
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { user } = useAuth(); // Get user from your AuthContext

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

    try {
      // 2. Prepare the data object
      // This matches the structure we defined
      const expenseData = {
        userId: user.uid,
        amount: parseFloat(amount),
        category: category,
        // Convert the date input string to a Firestore Timestamp
        date: Timestamp.fromDate(new Date(date + 'T00:00:00')), // Ensures it's the start of the local day
        comment: comment,
        createdAt: serverTimestamp(), // Firestore sets this on the server
      };

      // 3. Save to Firestore
      const expensesColRef = collection(db, 'expenses');
      await addDoc(expensesColRef, expenseData);

      // 4. Reset form on success
      setAmount('');
      setCategory(expenseCategories[0]);
      setDate('');
      setComment('');
      
    } catch (err) {
      console.error(err);
      setError('Failed to add expense. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded-lg shadow-sm">
      <h3 className="text-lg font-semibold">Add New Expense</h3>
      
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

      <Button type="submit" disabled={isLoading}>
        {isLoading ? 'Adding...' : 'Add Expense'}
      </Button>
    </form>
  );
};