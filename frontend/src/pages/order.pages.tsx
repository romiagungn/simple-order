import { useState, useEffect } from 'react';
import { getOrderHistory, type IOrderHistory } from '../services/order.service';
import { AppLayout } from '../components/layout';
import { formatDate, formatRupiah } from '../lib/util';

export default function OrderHistoryPage() {
   const [orders, setOrders] = useState<IOrderHistory[]>([]);
   const [isLoading, setIsLoading] = useState(true);
   const [error, setError] = useState<string | null>(null);

   useEffect(() => {
      const fetchOrders = async () => {
         try {
            setIsLoading(true);
            setError(null);
            const data = await getOrderHistory();
            setOrders(data);
         } catch (err: any) {
            setError(err.response?.data?.responseMessage || 'Gagal mengambil riwayat pesanan.');
         } finally {
            setIsLoading(false);
         }
      };
      fetchOrders();
   }, []);

   return (
      <AppLayout>
         <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">
            Riwayat Pesanan
         </h1>

         {isLoading && <p className="dark:text-gray-300">Loading riwayat pesanan...</p>}

         {error && (
            <div className="p-4 text-sm text-red-800 bg-red-100 dark:bg-red-900 dark:text-red-200 rounded-lg">
               {error}
            </div>
         )}

         {!isLoading && !error && (
            <div className="space-y-6">
               {orders.length === 0 ? (
                  <p className="text-gray-500 dark:text-gray-400">
                     Anda belum memiliki riwayat pesanan.
                  </p>
               ) : (
                  orders.map((order) => (
                     <div
                        key={order.id}
                        className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border dark:border-gray-700"
                     >
                        <div className="flex justify-between items-start mb-4">
                           <div>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                 Order ID: {order.id}
                              </p>
                              <p className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                                 {formatDate(order.created_at)}
                              </p>
                           </div>
                           <div className="text-right">
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                 Total Belanja
                              </p>
                              <p className="text-xl font-bold text-blue-600 dark:text-blue-400">
                                 {formatRupiah(order.total_amount)}
                              </p>
                           </div>
                        </div>

                        <hr className="my-4 dark:border-gray-700" />

                        <h4 className="text-md font-semibold mb-2 dark:text-gray-100">
                           Detail Item:
                        </h4>
                        <div className="space-y-2">
                           {order.items.map((item) => (
                              <div
                                 key={item.id}
                                 className="flex justify-between items-center text-sm"
                              >
                                 <div>
                                    <p className="text-gray-700 dark:text-gray-200 font-medium">
                                       {item.product.name}
                                    </p>
                                    <p className="text-gray-500 dark:text-gray-400">
                                       {item.quantity} x {formatRupiah(item.priceAtTime)}
                                    </p>
                                 </div>
                                 <p className="text-gray-600 dark:text-gray-300 font-medium">
                                    {formatRupiah(item.priceAtTime * item.quantity)}
                                 </p>
                              </div>
                           ))}
                        </div>
                     </div>
                  ))
               )}
            </div>
         )}
      </AppLayout>
   );
}
