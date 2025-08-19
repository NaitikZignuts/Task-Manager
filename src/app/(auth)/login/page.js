"use client"
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { TextField, Button, Typography, Link, Stack } from '@mui/material';
import { loginUser } from '../../../features/auth/authService';
import { useDispatch } from 'react-redux';
import { setUser } from '../../../features/auth/authSlice';
import GuestGuard from '../../../components/GuestGuard'

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = await loginUser(email, password);
      dispatch(setUser(user));
      router.push('/dashboard/user');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <GuestGuard>
      <Stack spacing={3} sx={{ maxWidth: 400, mx: 'auto', mt: 8 }}>
        <Typography variant="h4">Login</Typography>
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
        <Button
          variant="contained"
          size="large"
          onClick={handleSubmit}
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
    </GuestGuard>
  );
};

export default LoginPage;