import { Drawer, List, ListItem, ListItemIcon, ListItemText, ListItemButton, Toolbar } from '@mui/material';
import { Dashboard, Task, People, Analytics } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { useTheme, useMediaQuery } from '@mui/material';

const Sidebar = ({ open, onClose }) => {
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const menuItems = [
    { text: 'Dashboard', icon: <Dashboard />, path: '/dashboard' },
    { text: 'Tasks', icon: <Task />, path: '/tasks' },
    { text: 'Users', icon: <People />, path: '/users', adminOnly: true },
    { text: 'Analytics', icon: <Analytics />, path: '/analytics', adminOnly: true },
  ];

  const handleItemClick = (path) => {
    router.push(path);
    if (isMobile) {
      onClose();
    }
  };

  return (
    <Drawer
      variant={isMobile ? 'temporary' : 'permanent'}
      open={open}
      onClose={onClose}
      sx={{
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          boxSizing: 'border-box',
        },
      }}
    >
      <Toolbar />
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton onClick={() => handleItemClick(item.path)}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;