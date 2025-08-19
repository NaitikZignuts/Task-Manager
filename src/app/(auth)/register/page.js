"use client"
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { TextField, Button, Stack, Typography, Link } from '@mui/material';
import { registerUser } from '../../../features/auth/authService';
import { useDispatch } from 'react-redux';
import { setUser } from '../../../features/auth/authSlice';
import GuestGuard from '@/components/GuestGuard';

const RegisterPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    try {
      const user = await registerUser(email, password);
      dispatch(setUser(user));
      router.push('/dashboard/user');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <GuestGuard>
      <Stack spacing={3} sx={{ maxWidth: 400, mx: 'auto', mt: 8 }}>
        <Typography variant="h4">Register</Typography>
        {error && (
          <Typography color="error">{error}</Typography>
        )}
        <TextField
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
        />
        <TextField
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
        />
        <TextField
          label="Confirm Password"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          fullWidth
        />
        <Button
          variant="contained"
          size="large"
          onClick={handleSubmit}
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
    </GuestGuard>
  );
};

export default RegisterPage;