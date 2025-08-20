import useAuth from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';

const Header = ({ onDrawerToggle }) => {
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <AppBar position="fixed" className="z-50 shadow-sm">
      <Toolbar className="px-4 sm:px-6">
        <Typography variant="h6" component="div" className="flex-1 font-semibold">
          Task Management System
        </Typography>
        <div className="flex items-center space-x-2 sm:space-x-4">
          <div className="hidden sm:flex flex-col items-end">
            <Typography variant="body2" className="text-sm font-medium">
              {user?.email}
            </Typography>
            <Typography variant="caption" className="text-xs opacity-75 capitalize">
              ({user?.role})
            </Typography>
          </div>
          <div className="flex sm:hidden flex-col items-end">
            <Typography variant="caption" className="text-xs font-medium">
              {user?.email?.split('@')[0]}
            </Typography>
            <Typography variant="caption" className="text-xs opacity-75 capitalize">
              {user?.role}
            </Typography>
          </div>
          <Button 
            color="inherit" 
            onClick={handleLogout}
            size="small"
            className="ml-2 px-3 py-1 text-sm font-medium hover:bg-black hover:bg-opacity-1 transition-colors"
          >
            Logout
          </Button>
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default Header;