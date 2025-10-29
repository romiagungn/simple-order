import React from 'react';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
   children: React.ReactNode;
   variant?: 'primary' | 'secondary';
};

export const Button = ({
   children,
   variant = 'primary',
   className = '',
   ...props
}: ButtonProps) => {
   const baseStyle =
      'w-full py-3 px-4 rounded-lg font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-opacity-75 transition-colors disabled:opacity-50 disabled:cursor-not-allowed';

   const variants = {
      primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
      secondary:
         'bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-400 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600 dark:focus:ring-gray-500',
   };

   return (
      <button className={`${baseStyle} ${variants[variant]} ${className}`} {...props}>
         {children}
      </button>
   );
};
