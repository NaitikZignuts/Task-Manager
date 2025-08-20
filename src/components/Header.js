import useAuth from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { AppBar, Toolbar, Typography, Button, IconButton, Drawer, Box, Divider } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useState } from 'react';

const Header = () => {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const toggleDrawer = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawerContent = (
    <Box className="w-64 flex flex-col h-full">
      <Box className="px-4 py-6 flex flex-col items-start space-y-2">
        <Typography variant="body1" className="font-medium">
          {user?.email}
        </Typography>
        <Typography variant="caption" className="capitalize opacity-70">
          {user?.role}
        </Typography>
      </Box>
      <Divider />
      <Box className="flex-1 px-4 py-4">
      </Box>
      <Box className="px-4 py-4">
        <Button 
          fullWidth 
          variant="outlined" 
          color="primary" 
          onClick={handleLogout}
        >
          Logout
        </Button>
      </Box>
    </Box>
  );

  return (
    <>
      <AppBar position="fixed" className="z-50 shadow-sm">
        <Toolbar className="px-4 sm:px-6 flex justify-between">
          <Typography variant="h6" component="div" className="font-semibold">
            Task Management System
          </Typography>

          <div className="hidden sm:flex items-center space-x-4">
            <div className="flex flex-col items-end">
              <Typography variant="body2" className="text-sm font-medium">
                {user?.email}
              </Typography>
              <Typography variant="caption" className="text-xs opacity-75 capitalize">
                ({user?.role})
              </Typography>
            </div>
            <Button 
              color="inherit" 
              onClick={handleLogout}
              size="small"
              className="px-3 py-1 text-sm font-medium hover:bg-blue-600 transition-colors"
            >
              Logout
            </Button>
          </div>

          <div className="sm:hidden">
            <IconButton color="inherit" edge="end" onClick={toggleDrawer}>
              <MenuIcon />
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>

      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={toggleDrawer}
        classes={{ paper: "sm:hidden" }}
      >
        {drawerContent}
      </Drawer>
    </>
  );
};

export default Header;
