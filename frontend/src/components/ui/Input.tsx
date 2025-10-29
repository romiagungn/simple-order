import React, { forwardRef } from 'react';

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
   label: string;
   error?: string;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
   ({ label, id, error, className = '', ...props }, ref) => {

      const baseStyle = "w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600";
      const errorStyle = "border-red-500 dark:border-red-500 focus:ring-red-500";

      return (
         <div className="w-full mb-4">
            <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
               {label}
            </label>
            <input
               id={id}
               ref={ref}
               className={`${baseStyle} ${error ? errorStyle : ''} ${className}`}
               {...props}
            />
            {error && (
               <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>
            )}
         </div>
      );
   }
);