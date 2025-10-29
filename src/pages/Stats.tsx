// src/pages/Stats.tsx
import React, { useState, useEffect } from 'react';
import { Layout } from '../components/Layout';
import { useAuth } from '../contexts/AuthContext'; //
import { db } from '../firebaseConfig';
import { collection, query, where, getDocs, Timestamp } from 'firebase/firestore';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// --- Register the components Chart.js needs ---
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// Define the shape of our expense data
interface Expense {
  id: string;
  amount: number;
  category: string;
  date: Timestamp;
}

// Define the shape of the data Chart.js expects
interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string;
  }[];
}

export function Stats() {
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth(); //

  // --- Data Fetching Effect ---
  useEffect(() => {
    const fetchAndProcessData = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        // 1. Fetch all expenses for the user (no real-time listener needed here)
        const expensesColRef = collection(db, 'expenses');
        const q = query(expensesColRef, where('userId', '==', user.uid));
        const querySnapshot = await getDocs(q);

        const expenses: Expense[] = [];
        querySnapshot.forEach((doc) => {
          expenses.push(doc.data() as Expense);
        });

        // 2. Process the data for the chart
        // We'll group expenses by category
        const expensesByCategory: { [key: string]: number } = {};

        expenses.forEach((expense) => {
          const category = expense.category;
          if (expensesByCategory[category]) {
            expensesByCategory[category] += expense.amount;
          } else {
            expensesByCategory[category] = expense.amount;
          }
        });

        // 3. Format for Chart.js
        const labels = Object.keys(expensesByCategory);
        const data = Object.values(expensesByCategory);

        setChartData({
          labels,
          datasets: [
            {
              label: 'Total Expenses by Category',
              data,
              backgroundColor: 'rgba(54, 162, 235, 0.6)', // Example color
            },
          ],
        });

      } catch (err) {
        console.error(err);
        setError('Failed to fetch stats.');
      } finally {
        setLoading(false);
      }
    };

    fetchAndProcessData();
  }, [user]); // Re-fetch if user changes

  // --- Chart Options ---
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Your Spending Summary',
      },
    },
  };

  // --- Render Logic ---
  const renderContent = () => {
    if (loading) {
      return <div>Loading stats...</div>;
    }
    if (error) {
      return <div className="text-red-500">{error}</div>;
    }
    if (!chartData || chartData.datasets[0].data.length === 0) {
      return <div>You have no expense data to display.</div>;
    }
    return <Bar options={options} data={chartData} />;
  };

  return (
    <Layout>
      <div className="rounded-lg bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-neutral-800 mb-4">
          Expense Visualization
        </h2>
        <div className="relative h-96">
          {/* Chart.js needs a relatively positioned container */}
          {renderContent()}
        </div>
      </div>
    </Layout>
  );
}