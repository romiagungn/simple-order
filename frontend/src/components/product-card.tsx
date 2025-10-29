import type { IProduct } from '../services/product.service.ts';
import { formatRupiah } from '../lib/util.ts';

interface ProductCardProps {
   product: IProduct;
   quantityInCart: number;
   onQuantityChange: (newQuantity: number) => void;
}

export const ProductCard = ({ product, quantityInCart, onQuantityChange }: ProductCardProps) => {
   const handleIncrease = () => {
      if (quantityInCart < product.stock) {
         onQuantityChange(quantityInCart + 1);
      }
   };

   const handleDecrease = () => {
      if (quantityInCart > 0) {
         onQuantityChange(quantityInCart - 1);
      }
   };

   return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden transition-all hover:shadow-lg">
         <div className="w-full h-48 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
            <span className="text-gray-500 dark:text-gray-400">Gambar Produk</span>
         </div>

         <div className="p-4">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 truncate">
               {product.name}
            </h3>
            <p className="text-xl font-bold text-blue-600 dark:text-blue-400 my-2">
               {formatRupiah(product.price)}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
               Stok tersisa: {product.stock}
            </p>

            <div className="flex items-center justify-center space-x-3">
               <button
                  onClick={handleDecrease}
                  disabled={quantityInCart === 0}
                  className="w-10 h-10 rounded-full bg-gray-200 text-gray-700 text-xl font-bold hover:bg-gray-300 disabled:opacity-50 dark:bg-gray-600 dark:text-gray-100 dark:hover:bg-gray-500"
               >
                  -
               </button>

               <span className="text-xl font-semibold w-12 text-center dark:text-gray-100">
                  {quantityInCart}
               </span>

               <button
                  onClick={handleIncrease}
                  disabled={quantityInCart === product.stock}
                  className="w-10 h-10 rounded-full bg-blue-600 text-white text-xl font-bold hover:bg-blue-700 disabled:opacity-50"
               >
                  +
               </button>
            </div>
         </div>
      </div>
   );
};
