import { useState, useEffect, useCallback } from 'react';
import { getProducts, type IProduct } from '../services/product.service';
import { createOrder, type ICreateOrderPayload } from '../services/order.service';
import { Button } from '../components/ui/Button';
import { AppLayout } from '../components/layout';
import { ProductCard } from '../components/product-card.tsx';
import { formatRupiah } from '../lib/util.ts';
import { AddProductForm } from '../components/product-form.tsx';

export default function ProductPage() {
   const [products, setProducts] = useState<IProduct[]>([]);
   const [cart, setCart] = useState<Map<string, number>>(new Map());
   const [isLoading, setIsLoading] = useState(true);
   const [isSubmitting, setIsSubmitting] = useState(false);
   const [error, setError] = useState<string | null>(null);
   const [orderSuccess, setOrderSuccess] = useState<string | null>(null);

   const fetchProducts = useCallback(async () => {
      try {
         setIsLoading(true);
         setError(null);
         const data = await getProducts();
         setProducts(data);
      } catch (err: any) {
         setError(err.response?.data?.responseMessage || 'Gagal mengambil produk.');
      } finally {
         setIsLoading(false);
      }
   }, []);

   useEffect(() => {
      fetchProducts();
   }, [fetchProducts]);

   const handleQuantityChange = (productId: string, newQuantity: number) => {
      setCart((prevCart) => {
         const newCart = new Map(prevCart);
         if (newQuantity <= 0) {
            newCart.delete(productId);
         } else {
            newCart.set(productId, newQuantity);
         }
         return newCart;
      });
   };

   const calculateTotal = () => {
      let total = 0;
      for (const [productId, quantity] of cart.entries()) {
         const product = products.find((p) => p.id === productId);
         if (product) {
            total += product.price * quantity;
         }
      }
      return total;
   };

   const handleCreateOrder = async () => {
      setIsSubmitting(true);
      setError(null);
      setOrderSuccess(null);

      try {
         const items = Array.from(cart.entries()).map(([productId, quantity]) => ({
            productId,
            quantity,
         }));

         const payload: ICreateOrderPayload = { items };
         const response = await createOrder(payload);

         if (response.responseCode === 'CREATED') {
            setOrderSuccess(`Pesanan ${response.responseData.orderId} berhasil dibuat!`);
            setCart(new Map());
            fetchProducts();
         } else {
            setError(response.responseMessage);
         }
      } catch (err: any) {
         setError(err.response?.data?.responseMessage || 'Gagal membuat pesanan.');
      } finally {
         setIsSubmitting(false);
      }
   };

   const total = calculateTotal();

   return (
      <AppLayout>
         {error && (
            <div className="p-4 mb-4 text-sm text-red-800 bg-red-100 dark:bg-red-900 dark:text-red-200 rounded-lg">
               {error}
            </div>
         )}
         {orderSuccess && (
            <div className="p-4 mb-4 text-sm text-green-800 bg-green-100 dark:bg-green-900 dark:text-green-200 rounded-lg">
               {orderSuccess}
            </div>
         )}

         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
               <AddProductForm onProductAdded={fetchProducts} />

               <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">
                  Daftar Produk
               </h1>

               {isLoading && <p className="dark:text-gray-300">Loading produk...</p>}

               {!isLoading && products.length === 0 ? (
                  <p className="dark:text-gray-300">
                     Tidak ada produk yang tersedia. Silakan tambahkan produk baru.
                  </p>
               ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                     {products.map((product) => (
                        <ProductCard
                           key={product.id}
                           product={product}
                           quantityInCart={cart.get(product.id) || 0}
                           onQuantityChange={(newQuantity: number) =>
                              handleQuantityChange(product.id, newQuantity)
                           }
                        />
                     ))}
                  </div>
               )}
            </div>

            <div className="lg:col-span-1">
               <div className="sticky top-24 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border dark:border-gray-700">
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">
                     Pesanan Anda
                  </h2>
                  {cart.size === 0 ? (
                     <p className="text-gray-500 dark:text-gray-400">
                        Keranjang Anda masih kosong.
                     </p>
                  ) : (
                     <>
                        <div className="space-y-3 mb-4">
                           {Array.from(cart.entries()).map(([productId, quantity]) => {
                              const product = products.find((p) => p.id === productId);
                              return product ? (
                                 <div
                                    key={productId}
                                    className="flex justify-between items-center text-sm"
                                 >
                                    <span className="font-medium text-gray-700 dark:text-gray-200">
                                       {product.name} (x{quantity})
                                    </span>
                                    <span className="text-gray-600 dark:text-gray-300">
                                       {formatRupiah(product.price * quantity)}
                                    </span>
                                 </div>
                              ) : null;
                           })}
                        </div>
                        <hr className="my-4 dark:border-gray-600" />
                        <div className="flex justify-between items-center text-lg font-bold mb-4 dark:text-gray-100">
                           <span>Total:</span>
                           <span>{formatRupiah(total)}</span>
                        </div>
                        <Button
                           onClick={handleCreateOrder}
                           disabled={isSubmitting || cart.size === 0}
                        >
                           {isSubmitting ? 'Memproses...' : 'Buat Pesanan'}
                        </Button>
                     </>
                  )}
               </div>
            </div>
         </div>
      </AppLayout>
   );
}
