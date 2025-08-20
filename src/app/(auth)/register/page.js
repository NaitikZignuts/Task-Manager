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

const RegisterPage = () => {
  const [error, setError] = useState('');
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
      const user = await registerUser(data.email, data.password);
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
          <Typography variant="h4">Register</Typography>
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
          <FormInput
            name="confirmPassword"
            type="password"
            placeholder="Confirm Password"
            label="Confirm Password"
            control={control}
            errors={errors}
            rules={{
              required: 'Confirm Password is required',
              validate: value => value === password || 'Passwords do not match'
            }}
            fullWidth
          />
          <Button
            type="submit"
            variant="contained"
            size="large"
          >
            Register
          </Button>
          <Typography>
            Already have an account?{' '}
            <Link href="/login" underline="hover">
              Login here
            </Link>
          </Typography>
        </Stack>
      </form>
    </GuestGuard>
  );
};

export default RegisterPage;