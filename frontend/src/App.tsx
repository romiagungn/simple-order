import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import ProductPage from './pages/product.pages';
import OrderHistoryPage from './pages/order.pages';
import LoginPage from './pages/login.pages';
import React from 'react';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
   const { isAuthenticated, isLoading } = useAuth();

   if (isLoading) {
      return <div>Loading...</div>;
   }

   if (!isAuthenticated) {
      return <Navigate to="/login" replace />;
   }

   return children;
};

function App() {
   return (
      <Router>
         <Routes>
            <Route path="/login" element={<LoginPage />} />

            <Route
               path="/"
               element={
                  <ProtectedRoute>
                     <ProductPage />
                  </ProtectedRoute>
               }
            />
            <Route
               path="/orders"
               element={
                  <ProtectedRoute>
                     <OrderHistoryPage />
                  </ProtectedRoute>
               }
            />

            <Route path="*" element={<Navigate to="/" />} />
         </Routes>
      </Router>
   );
}

export default App;
