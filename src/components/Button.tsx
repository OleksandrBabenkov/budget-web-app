// src/components/Button.tsx
import React from 'react';
import clsx from 'clsx'; // Import clsx

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  // You can add variants later, e.g., variant?: 'primary' | 'secondary'
};

export const Button = (props: ButtonProps) => {
  const { className, children, ...rest } = props;

  return (
    <button
      {...rest}
      className={clsx(
        // Base styles
        'inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-semibold shadow-sm transition-colors',
        
        // Color & States
        'bg-primary-600 text-white hover:bg-primary-700',
        
        // Disabled state
        'disabled:opacity-50 disabled:pointer-events-none',
        
        // Focus state (for accessibility)
        'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',

        // Merge with any extra classes passed in
        className 
      )}
    >
      {children}
    </button>
  );
};