// src/pages/Dashboard.tsx
import { Layout } from '../components/Layout';
import { ExpenseForm } from '../components/ExpenseForm';
import { ExpenseList } from '../components/ExpenseList';
import { useState } from 'react';
import { Modal } from '../components/Modal';
import { Button } from '../components/Button';
import { ExpenseSummary } from '../components/ExpenseSummary';

export function Dashboard() {
  
  const [editingExpenseId, setEditingExpenseId] = useState<string | null>(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);

 
const handleShowAddForm = () => {
    setEditingExpenseId(null); // Ensure we're in "create" mode
    setIsFormModalOpen(true);
  };

  // Opens the modal for *editing* an existing expense
  // This will be passed to ExpenseList
  const handleShowEditForm = (id: string) => {
    setEditingExpenseId(id); // Set the ID to edit
    setIsFormModalOpen(true);
  };

  // Closes the modal and resets the form state
  const handleCloseForm = () => {
    setIsFormModalOpen(false);
    setEditingExpenseId(null);
  };

  return (
    <Layout>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main Content Area (now just the list) */}
        <div className="space-y-6 lg:col-span-2">
          
          {/* Button to trigger the modal */}
          <div className="flex justify-end">
            <Button onClick={handleShowAddForm}>
              Add New Expense
            </Button>
          </div>

          {/* The list is now the main view */}
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <ExpenseList 
              onEditExpense={handleShowEditForm}
            />
          </div>
        </div>

        {/* --- Sidebar/Info Area: CHANGED --- */}
        <div className="rounded-lg bg-white p-6 shadow-sm lg:col-span-1">
          <ExpenseSummary /> 
        </div>
      </div>

      {/* --- The Modal for the Form --- */}
      <Modal
        isOpen={isFormModalOpen}
        onClose={handleCloseForm}
        title={editingExpenseId ? 'Update Expense' : 'Add New Expense'}
      >
        <ExpenseForm
          editingExpenseId={editingExpenseId}
          onDone={handleCloseForm} // Pass the close fn to the form
        />
      </Modal>
    </Layout>
  );
}