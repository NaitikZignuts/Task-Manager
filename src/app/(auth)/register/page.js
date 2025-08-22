"use client"
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Stack, Typography, Link } from '@mui/material';
import { registerUser } from '../../../features/auth/authService';
import { useDispatch } from 'react-redux';
import { setUser } from '../../../features/auth/authSlice';
import GuestGuard from '@/components/GuestGuard';
import { useForm } from 'react-hook-form';
import FormInput from '@/components/common/FormInput';
import { EmailRules, PasswordRules, RequiredRules } from '@/components/common/commonRules';
import toast from 'react-hot-toast';

const RegisterPage = () => {
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();
  
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm({
    mode:"all",
    reValidateMode:'onChange',
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: ''
    }
  });

  const password = watch('password');

  const onSubmit = async (data) => {
    try {
      setIsLoading(true); 
      const user = await registerUser(data.email, data.password);
      dispatch(setUser(user));
      toast.success('Registration successful! Welcome aboard!', {
        duration: 4000,
        position: 'top-center',
      });
      
      router.push('/dashboard/user');
    } catch (err) {
      toast.error('Registration failed. Please try again.'); 
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
              <div className="mx-auto w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-500 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
              </div>
              <Typography variant="h4" className="font-bold text-gray-900 mb-2">
                Create Account
              </Typography>
              <Typography variant="body2" className="text-gray-500">
                Join us today! Its free and only takes a minute
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
                    rules={EmailRules}
                    fullWidth
                  />
                </div>

                <div className="space-y-2">
                  <FormInput
                    name="password"
                    type="password"
                    placeholder="Create a strong password"
                    label="Password"
                    control={control}
                    errors={errors}
                    rules={PasswordRules}
                    fullWidth
                  />
                </div>

                <div className="space-y-2">
                  <FormInput
                    name="confirmPassword"
                    type="password"
                    placeholder="Confirm your password"
                    label="Confirm Password"
                    control={control}
                    errors={errors}
                    rules={{
                      required: 'Confirm Password is required',
                      validate: value => value === password || 'Passwords do not match'
                    }}
                    fullWidth
                  />
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
                  {isLoading ? 'Creating Account...' : 'Create Account'}
                </Button>
              </Stack>
            </form>

            <div className="mt-8 text-center">
              <Typography variant="body2" className="text-gray-600">
                Already have an account?{' '}
                <Link 
                  href="/login" 
                  className="text-blue-600 hover:text-blue-500 font-semibold transition-colors duration-200"
                >
                  Sign in here
                </Link>
              </Typography>
            </div>
          </div>
        </div>
      </div>
    </GuestGuard>
  );
};

export default RegisterPage;