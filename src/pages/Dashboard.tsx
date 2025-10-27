// src/pages/Dashboard.tsx
import { Layout } from '../components/Layout';
import { ExpenseForm } from '../components/ExpenseForm';
import { ExpenseList } from '../components/ExpenseList';

export function Dashboard() {
  return (
    <Layout>
      {/* This grid layout is a common dashboard pattern.
        Your template's Tailwind config is ready for 'lg:col-span-2'
      */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main Content Area (span 2 cols on large screens) */}
        <div className="space-y-6 lg:col-span-2">
          {/* Placeholder for Phase 2: Create (ExpenseForm) */}
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <ExpenseForm/>
          </div>

          {/* Placeholder for Phase 2: Read (ExpenseList) */}
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <ExpenseList/>
          </div>
        </div>

        {/* Sidebar/Info Area (span 1 col on large screens) */}
        <div className="rounded-lg bg-white p-6 shadow-sm lg:col-span-1">
          <h2 className="text-lg font-semibold text-neutral-800">Summary</h2>
          <p className="mt-2 text-neutral-600">(Stats summary will go here)</p>
        </div>
      </div>
    </Layout>
  );
}