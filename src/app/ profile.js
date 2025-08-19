import { useState, useEffect } from 'react';
import { TextField, Button, Stack, Typography, Avatar } from '@mui/material';
import DashboardLayout from '../components/DashboardLayout';
import PrivateRoute from '../components/PrivateRoute';
import useAuth from '@/hooks/useAuth';

const ProfilePage = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        email: user.email,
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Update profile logic here
  };

  return (
    <PrivateRoute>
      <DashboardLayout>
        <Stack spacing={3} sx={{ maxWidth: 600, mx: 'auto' }}>
          <Typography variant="h4">Profile</Typography>
          <Avatar sx={{ width: 100, height: 100, fontSize: 40, mx: 'auto' }}>
            {user?.email?.charAt(0).toUpperCase()}
          </Avatar>
          <form onSubmit={handleSubmit}>
            <Stack spacing={3}>
              <TextField
                label="Email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled
                fullWidth
              />
              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled
              >
                Update Profile
              </Button>
            </Stack>
          </form>
        </Stack>
      </DashboardLayout>
    </PrivateRoute>
  );
};

export default ProfilePage;