import { useState } from 'react';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { addProduct, type IAddProductPayload } from '../services/product.service.ts';
import { Button } from './ui/Button.tsx';
import { Input } from './ui/Input.tsx';

interface AddProductFormProps {
   onProductAdded: () => void;
}

export const AddProductForm = ({ onProductAdded }: AddProductFormProps) => {
   const [apiError, setApiError] = useState<string | null>(null);
   const [isExpanded, setIsExpanded] = useState(false);

   const {
      register,
      handleSubmit,
      reset,
      formState: { errors, isSubmitting },
   } = useForm<IAddProductPayload>();

   const onSubmit: SubmitHandler<IAddProductPayload> = async (data) => {
      setApiError(null);
      try {
         const payload = {
            ...data,
            price: Number(data.price),
            stock: Number(data.stock),
         };

         const response = await addProduct(payload);

         if (response.responseCode === 'CREATED') {
            reset();
            setIsExpanded(false);
            onProductAdded();
         } else {
            setApiError(response.responseMessage);
         }
      } catch (err: any) {
         setApiError(err.response?.data?.responseMessage || 'Gagal menambahkan produk.');
      }
   };

   if (!isExpanded) {
      return (
         <Button
            variant="secondary"
            onClick={() => setIsExpanded(true)}
            className="mb-6 w-auto px-6"
         >
            + Tambah Produk Baru
         </Button>
      );
   }

   return (
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border dark:border-gray-700 mb-6">
         <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">
            Form Tambah Produk
         </h2>
         <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {apiError && (
               <div className="p-3 text-sm text-red-800 bg-red-100 dark:bg-red-900 dark:text-red-200 rounded-lg">
                  {apiError}
               </div>
            )}

            <Input
               id="name"
               label="Nama Produk"
               type="text"
               {...register('name', { required: 'Nama wajib diisi' })}
               error={errors.name?.message}
               disabled={isSubmitting}
            />

            <Input
               id="price"
               label="Harga (Rp)"
               type="number"
               {...register('price', {
                  required: 'Harga wajib diisi',
                  valueAsNumber: true,
                  min: { value: 1, message: 'Harga harus positif' },
               })}
               error={errors.price?.message}
               disabled={isSubmitting}
            />

            <Input
               id="stock"
               label="Stok Awal"
               type="number"
               {...register('stock', {
                  required: 'Stok wajib diisi',
                  valueAsNumber: true,
                  min: { value: 1, message: 'Stok harus positif' },
               })}
               error={errors.stock?.message}
               disabled={isSubmitting}
            />

            <div className="flex space-x-4">
               <Button type="submit" variant="primary" disabled={isSubmitting}>
                  {isSubmitting ? 'Menyimpan...' : 'Simpan Produk'}
               </Button>
               <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setIsExpanded(false)}
                  disabled={isSubmitting}
               >
                  Batal
               </Button>
            </div>
         </form>
      </div>
   );
};
