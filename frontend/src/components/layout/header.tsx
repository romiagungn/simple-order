import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export const Header = () => {
   const { user, logout } = useAuth();
   const navigate = useNavigate();

   const handleLogout = () => {
      logout();
      navigate('/login');
   };

   const getNavLinkClass = ({ isActive }: { isActive: boolean }) =>
      isActive
         ? 'text-blue-500 font-semibold'
         : 'text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400';

   return (
      <header className="bg-white dark:bg-gray-800 shadow-md w-full dark:border-b dark:border-gray-700">
         <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
            <div className="text-xl font-bold text-blue-600 dark:text-blue-500">Simple Orders</div>
            <div className="flex items-center space-x-6">
               <NavLink to="/" className={getNavLinkClass}>
                  Produk
               </NavLink>
               <NavLink to="/orders" className={getNavLinkClass}>
                  Riwayat
               </NavLink>
            </div>
            <div className="flex items-center space-x-4">
               <span className="text-gray-700 dark:text-gray-300 hidden md:block">
                  {user?.email}
               </span>
               <button
                  onClick={handleLogout}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400"
               >
                  Logout
               </button>
            </div>
         </nav>
      </header>
   );
};
