"use client"
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Typography, Link, Stack } from '@mui/material';
import { loginUser } from '../../../features/auth/authService';
import { useDispatch } from 'react-redux';
import { setUser } from '../../../features/auth/authSlice';
import GuestGuard from '../../../components/GuestGuard'
import { useForm } from 'react-hook-form';
import FormInput from '@/components/common/FormInput';

const LoginPage = () => {
  const [error, setError] = useState('');
  const router = useRouter();
  const dispatch = useDispatch();
  
  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    mode:"all"
  });

  const onSubmit = async (data) => {
    try {
      const user = await loginUser(data.email, data.password);
      dispatch(setUser(user));
      router.push('/dashboard/user');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <GuestGuard>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={3} sx={{ maxWidth: 400, mx: 'auto', mt: 8 }}>
          <Typography variant="h4">Login</Typography>
          {error && (
            <Typography color="error">{error}</Typography>
          )}
          <FormInput
            name="email"
            type="email"
            placeholder="Email"
            label="Email"
            control={control}
            errors={errors}
            rules={{
              required: 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address'
              }
            }}
            fullWidth
          />
          <FormInput
            name="password"
            type="password"
            placeholder="Password"
            label="Password"
            control={control}
            errors={errors}
            rules={{
              required: 'Password is required',
              minLength: {
                value: 6,
                message: 'Password must be at least 6 characters'
              }
            }}
            fullWidth
          />
          <Button
            type="submit"
            variant="contained"
            size="large"
          >
            Login
          </Button>
          <Typography>
            Dont have an account?{' '}
            <Link href="/register" underline="hover">
              Register here
            </Link>
          </Typography>
        </Stack>
      </form>
    </GuestGuard>
  );
};

export default LoginPage;
// import { useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { Button, Typography, Link } from '@mui/material';
// import { loginUser } from '../../../features/auth/authService';
// import { useDispatch } from 'react-redux';
// import { setUser } from '../../../features/auth/authSlice';
// import GuestGuard from '../../../components/GuestGuard'
// import { useForm } from 'react-hook-form';
// import FormInput from '@/components/common/FormInput';

// const LoginPage = () => {
//   const [error, setError] = useState('');
//   const router = useRouter();
//   const dispatch = useDispatch();
  
//   const {
//     control,
//     handleSubmit,
//     formState: { errors }
//   } = useForm({
//     mode:"all"
//   });

//   const onSubmit = async (data) => {
//     try {
//       const user = await loginUser(data.email, data.password);
//       dispatch(setUser(user));
//       router.push('/dashboard/user');
//     } catch (err) {
//       setError(err.message);
//     }
//   };

//   return (
//     <GuestGuard>
//       <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
//         <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
//           <div className="text-center">
//             <Typography variant="h4" className="font-bold text-gray-900">Sign in to your account</Typography>
//             <p className="mt-2 text-sm text-gray-600">
//               Or{' '}
//               <Link href="/register" className="font-medium text-indigo-600 hover:text-indigo-500">
//                 create a new account
//               </Link>
//             </p>
//           </div>
          
//           <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
//             {error && (
//               <div className="rounded-md bg-red-50 p-4 mb-4">
//                 <Typography color="error" className="text-sm">{error}</Typography>
//               </div>
//             )}
            
//             <div className="rounded-md shadow-sm -space-y-px">
//               <div className="mb-4">
//                 <FormInput
//                   name="email"
//                   type="email"
//                   placeholder="Email"
//                   label="Email"
//                   control={control}
//                   errors={errors}
//                   rules={{
//                     required: 'Email is required',
//                     pattern: {
//                       value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
//                       message: 'Invalid email address'
//                     }
//                   }}
//                   fullWidth
//                 />
//               </div>
              
//               <div>
//                 <FormInput
//                   name="password"
//                   type="password"
//                   placeholder="Password"
//                   label="Password"
//                   control={control}
//                   errors={errors}
//                   rules={{
//                     required: 'Password is required',
//                     minLength: {
//                       value: 6,
//                       message: 'Password must be at least 6 characters'
//                     }
//                   }}
//                   fullWidth
//                 />
//               </div>
//             </div>

//             <div className="flex items-center justify-between">
//               <div className="flex items-center">
//                 <input
//                   id="remember-me"
//                   name="remember-me"
//                   type="checkbox"
//                   className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
//                 />
//                 <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
//                   Remember me
//                 </label>
//               </div>

//               <div className="text-sm">
//                 <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
//                   Forgot your password?
//                 </a>
//               </div>
//             </div>

//             <div>
//               <Button
//                 type="submit"
//                 variant="contained"
//                 className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
//                 size="large"
//               >
//                 Sign in
//               </Button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </GuestGuard>
//   );
// };

// export default LoginPage;