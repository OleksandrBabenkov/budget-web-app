// src/components/Modal.tsx
import React from 'react';
import { X } from 'lucide-react'; // Import the icon

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title: string;
}

export const Modal = ({ isOpen, onClose, title, children }: ModalProps) => {
  if (!isOpen) return null;

  return (
    // Backdrop
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/50" // Use neutral-900 with 50% opacity
      onClick={onClose}
    >
      {/* Modal Content */}
      <div
        className="relative w-full max-w-lg rounded-lg bg-white p-6 shadow-xl" // Use bg-white (or bg-neutral-0/50) and theme shadows/rounding
        onClick={(e) => e.stopPropagation()} // Prevent click-through
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-neutral-200">
          <h3 className="text-lg font-semibold text-neutral-900">{title}</h3>
          <button
            onClick={onClose}
            className="rounded-full p-1 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        {/* Body */}
        <div className="mt-4">{children}</div>
      </div>
    </div>
  );
};

// Also, a placeholder for your main button
// export const Button = (props: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
//   <button
//     {...props}
//     className={`p-2 px-4 rounded text-white bg-blue-600 disabled:bg-gray-400 ${props.className || ''}`}
//   />
// );