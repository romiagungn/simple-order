import React from 'react';

export const AuthLayout = ({ children, title }: { children: React.ReactNode; title: string }) => {
   return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col justify-center items-center p-4">
         <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
            <h1 className="text-3xl font-bold text-center text-gray-800 dark:text-gray-100 mb-8">
               {title}
            </h1>
            {children}
         </div>
      </div>
   );
};
