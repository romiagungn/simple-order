import React from 'react';
import { Header } from './header';

export const AppLayout = ({ children }: { children: React.ReactNode }) => {
   return (
      <div className="min-h-screen w-full bg-gray-50 dark:bg-gray-900">
         <Header />
         <main className="container mx-auto p-6">
            {children}
         </main>
      </div>
   );
};