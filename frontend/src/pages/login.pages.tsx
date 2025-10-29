import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import type { ILoginPayload } from '../services/auth.service.ts';
import { useState } from 'react';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { AuthLayout } from '../components/layout/auth-layout.tsx';

export default function LoginPage() {
   const [apiError, setApiError] = useState<string | null>(null);
   const { login } = useAuth();
   const navigate = useNavigate();

   const {
      register: formRegister,
      handleSubmit,
      formState: { errors, isSubmitting },
   } = useForm<ILoginPayload>();

   const onSubmit: SubmitHandler<ILoginPayload> = async (data) => {
      setApiError(null);
      try {
         const success = await login(data);
         if (success) {
            navigate('/');
         } else {
            setApiError('Kredensial tidak valid.');
         }
      } catch (err: any) {
         setApiError(err.response?.data?.responseMessage || 'Terjadi kesalahan.');
      }
   };

   return (
      <AuthLayout title="Login Akun">
         <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {apiError && (
               <div className="p-3 text-sm text-red-800 bg-red-100 dark:bg-red-900 dark:text-red-200 rounded-lg">
                  {apiError}
               </div>
            )}

            <Input
               id="email"
               label="Email"
               type="email"
               {...formRegister('email', { required: 'Email wajib diisi' })}
               error={errors.email?.message}
               disabled={isSubmitting}
            />

            <Input
               id="password"
               label="Password"
               type="password"
               {...formRegister('password', { required: 'Password wajib diisi' })}
               error={errors.password?.message}
               disabled={isSubmitting}
            />

            <Button type="submit" variant="primary" disabled={isSubmitting}>
               {isSubmitting ? 'Loading...' : 'Login'}
            </Button>
         </form>

         <div className="mt-6 text-center">
            <Link
               to="/register"
               className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
            >
               Belum punya akun? Daftar di sini.
            </Link>
         </div>
      </AuthLayout>
   );
}
