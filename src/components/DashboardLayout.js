"use client"
import { useState } from 'react';
import { CssBaseline, Toolbar, useTheme, useMediaQuery } from '@mui/material';
import Header from './Header';

const DashboardLayout = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <CssBaseline />
      <Header onDrawerToggle={handleDrawerToggle} />
      <main className="flex-1 w-full overflow-auto">
        <Toolbar />
        <div className="p-3 sm:p-4 lg:p-6 max-w-full">
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;