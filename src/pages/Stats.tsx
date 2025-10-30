// src/pages/Stats.tsx
import { useState, useEffect } from 'react';
import { Layout } from '../components/Layout';
import { useAuth } from '../contexts/AuthContext'; //
import { db } from '../firebaseConfig';
import { collection, query, where, getDocs, Timestamp } from 'firebase/firestore';
import { Pie } from 'react-chartjs-2';
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   Title,
//   Tooltip,
//   Legend,
// } from 'chart.js';

import {
  Chart as ChartJS,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';


// --- Register the components Chart.js needs ---
// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   Title,
//   Tooltip,
//   Legend
// );

ChartJS.register(
  ArcElement,
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
    backgroundColor: string[];
    borderColor: string;
    borderWidth: number;
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

        const basicColors = [
          '#FF6384', // Red
          '#36A2EB', // Blue
          '#FFCE56', // Yellow
          '#4BC0C0', // Teal
          '#9966FF', // Purple
          '#FF9F40', // Orange
          '#C9CBCF', // Grey
        ];

        const backgroundColors = [];
        for (let i = 0; i < data.length; i++) {
          backgroundColors.push(basicColors[i % basicColors.length]);
        }

        setChartData({
          labels,
          datasets: [
            {
              label: 'Expenses by Category', // This is often shown in the tooltip
              data,
              backgroundColor: backgroundColors, // <-- CHANGED
              borderColor: '#FFFFFF', // Adds a white border between segments
              borderWidth: 2,
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
    maintainAspectRatio: false, // Allows our container to control the size
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Your Spending Summary by Category',
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            // Format tooltip to show percentage
            const label = context.label || '';
            const value = context.parsed || 0;
            const total = context.chart.getDatasetMeta(0).total || 1;
            const percentage = ((value / total) * 100).toFixed(2);
            return `${label}: $${value.toFixed(2)} (${percentage}%)`;
          }
        }
      }
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
    return <Pie options={options} data={chartData} />;
  };

  return (
    <Layout>
      <div className="rounded-lg bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-neutral-800 mb-4">
          Expense Visualization
        </h2>
        <div className="relative mx-auto w-full max-w-md h-96">
          {renderContent()}
        </div>
      </div>
    </Layout>
  );
}