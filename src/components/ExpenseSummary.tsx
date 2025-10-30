// src/components/ExpenseSummary.tsx
import { useState, useEffect } from 'react';
import { db } from '../firebaseConfig';
import {
  collection,
  query,
  where,
  onSnapshot,
  Timestamp,
} from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import clsx from 'clsx'; // From your project setup

// Define the shape of the processed data
interface SummaryData {
  [category: string]: number;
}

// Define the time periods
type Period = 'day' | 'week' | 'month' | 'year';
const periods: Period[] = ['day', 'week', 'month', 'year'];

// --- Design System Placeholders ---
// Replace with your actual styled components/classes
const PlaceholderSegmentControl = ({
  selected,
  onSelect,
}: {
  selected: Period;
  onSelect: (period: Period) => void;
}) => (
  <div className="flex w-full rounded-md bg-neutral-200 p-1">
    {periods.map((p) => (
      <button
        key={p}
        onClick={() => onSelect(p)}
        className={clsx(
          'flex-1 rounded-md py-1 text-sm font-medium capitalize',
          selected === p
            ? 'bg-white text-primary-600 shadow-sm'
            : 'text-neutral-700 hover:bg-neutral-100'
        )}
      >
        {p}
      </button>
    ))}
  </div>
);
// --- End of Placeholders ---

// --- Helper Function for Date Logic ---
const getStartDate = (period: Period): Date => {
  const now = new Date();
  
  // Set to start of today
  now.setHours(0, 0, 0, 0);

  switch (period) {
    case 'day':
      // Already set to start of today
      return now;
    case 'week':
      // Get start of the week (Sunday)
      const dayOfWeek = now.getDay(); // 0 = Sunday, 1 = Monday...
      now.setDate(now.getDate() - dayOfWeek);
      return now;
    case 'month':
      // Get start of the month
      now.setDate(1);
      return now;
    case 'year':
      // Get start of the year
      now.setMonth(0);
      now.setDate(1);
      return now;
    default:
      return now;
  }
};

export const ExpenseSummary = () => {
  const [period, setPeriod] = useState<Period>('week');
  const [summary, setSummary] = useState<SummaryData>({});
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth(); //

  useEffect(() => {
    if (!user) {
      setLoading(false);
      setSummary({});
      setTotal(0);
      return;
    }

    setLoading(true);

    // 1. Calculate the start date based on the selected period
    const startDate = getStartDate(period);
    const startDateTimestamp = Timestamp.fromDate(startDate);
    
    // We don't need an endDate, as we're querying from the start date *until now*

    // 2. Create the real-time query
    const expensesColRef = collection(db, 'expenses');
    const q = query(
      expensesColRef,
      where('userId', '==', user.uid),
      where('date', '>=', startDateTimestamp)
    );
    
    // Note: This query is supported by the index we already built
    // for the ExpenseList (userId ASC, date DESC)! No new index needed.

    // 3. Set up the real-time listener
    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        let newSummary: SummaryData = {};
        let newTotal = 0;

        querySnapshot.forEach((doc) => {
          const { category, amount } = doc.data();
          
          // Process the summary
          if (newSummary[category]) {
            newSummary[category] += amount;
          } else {
            newSummary[category] = amount;
          }
          
          // Add to total
          newTotal += amount;
        });

        setSummary(newSummary);
        setTotal(newTotal);
        setLoading(false);
      },
      (err) => {
        console.error('Failed to get summary:', err);
        setLoading(false);
      }
    );

    // 4. Clean up listener
    return () => unsubscribe();
  }, [user, period]); // Re-run when the user or the period changes

  const sortedSummary = Object.entries(summary).sort(([, a], [, b]) => b - a);

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-neutral-800">Summary</h2>
      
      <PlaceholderSegmentControl selected={period} onSelect={setPeriod} />

      {loading && <div className="text-center text-neutral-500">Loading...</div>}

      {!loading && (
        <div className="space-y-3">
          {/* Total */}
          <div className="flex justify-between items-center py-2 border-b-2 border-neutral-800">
            <span className="text-base font-bold text-neutral-900">
              Total for this {period}
            </span>
            <span className="text-lg font-bold text-neutral-900">
              ${total.toFixed(2)}
            </span>
          </div>

          {/* List of categories */}
          {sortedSummary.length === 0 && (
            <p className="text-neutral-500 text-sm">No expenses for this period.</p>
          )}
          
          <ul className="space-y-2">
            {sortedSummary.map(([category, amount]) => (
              <li key={category} className="flex justify-between items-center text-sm">
                <span className="text-neutral-700">{category}</span>
                <span className="font-medium text-neutral-800">
                  ${amount.toFixed(2)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};