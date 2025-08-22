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
import { RequiredRules } from '@/components/common/commonRules';
import toast from 'react-hot-toast';

const LoginPage = () => {
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
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
      setIsLoading(true); 
      setError('');
      
      const user = await loginUser(data.email, data.password);
      dispatch(setUser(user));
      
      toast.success('Login successful! Welcome back!', {
        duration: 4000,
        position: 'top-center',
      });
      
      router.push('/dashboard/user');
    } catch (err) {
      toast.error('Login failed. Please check your credentials.'); 
    } finally {
      setIsLoading(false); 
    }
  };

  return (
    <GuestGuard>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-sm sm:max-w-md">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 sm:p-8">
            <div className="text-center mb-8">
              
            <div className="mx-auto w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <Typography variant="h4" className="font-bold text-gray-900 mb-2">
                Welcome Back
              </Typography>
              <Typography variant="body2" className="text-gray-500">
                Please sign in to your account
              </Typography>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                  <div className="flex">
                    <svg className="w-5 h-5 text-red-400 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <Typography color="error" className="text-sm font-medium">
                      {error}
                    </Typography>
                  </div>
                </div>
              )}

              <Stack spacing={4}>
                <div className="space-y-2">
                  <FormInput
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    label="Email Address"
                    control={control}
                    errors={errors}
                    rules={RequiredRules}
                    fullWidth
                  />
                </div>

                <div className="space-y-2">
                  <FormInput
                    name="password"
                    type="password"
                    placeholder="Enter your password"
                    label="Password"
                    control={control}
                    errors={errors}
                    rules={RequiredRules}
                    fullWidth
                  />
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="remember-me" className="ml-2 text-gray-600">
                      Remember me
                    </label>
                  </div>
                </div>

                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                  sx={{
                    textTransform: 'none',
                    fontSize: '1rem',
                    background: 'linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #2563eb 0%, #4f46e5 100%)',
                    }
                  }}
                >
                  {isLoading ? 'Signing In...' : 'Sign In'}
                </Button>
              </Stack>
            </form>

            <div className="mt-8 text-center">
              <Typography variant="body2" className="text-gray-600">
              Don&#39;t have an account?{' '}
                <Link 
                  href="/register" 
                  className="text-blue-600 hover:text-blue-500 font-semibold transition-colors duration-200"
                >
                  Create account
                </Link>
              </Typography>
            </div>
          </div>
        </div>
      </div>
    </GuestGuard>
  );
};

export default LoginPage;