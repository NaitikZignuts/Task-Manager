import { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Avatar,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stack
} from '@mui/material';
import { 
  Person, 
  AdminPanelSettings, 
  Email, 
  CalendarToday,
  Info
} from '@mui/icons-material';

const UserList = ({ users, currentUser }) => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const handleViewDetails = (user) => {
    setSelectedUser(user);
    setDetailsOpen(true);
  };

  const handleCloseDetails = () => {
    setDetailsOpen(false);
    setSelectedUser(null);
  };

  const getRoleColor = (role) => {
    return role === 'admin' ? 'error' : 'primary';
  };

  const getRoleIcon = (role) => {
    return role === 'admin' ? <AdminPanelSettings /> : <Person />;
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    try {
      return new Date(timestamp).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return 'Invalid Date';
    }
  };

  if (!users || users.length === 0) {
    return (
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            User Management
          </Typography>
          <Typography color="textSecondary">
            No users found.
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Box>
      <Card>
        <CardContent>
          <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h6">
              User Management ({users.length} users)
            </Typography>
            <Chip 
              icon={<AdminPanelSettings />}
              label="Admin View" 
              color="error" 
              variant="outlined" 
            />
          </Stack>

          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>User</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Joined</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user) => (
                  <TableRow 
                    key={user.uid}
                    sx={{ 
                      backgroundColor: user.uid === currentUser?.uid ? 'action.hover' : 'inherit'
                    }}
                  >
                    <TableCell>
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Avatar sx={{ width: 32, height: 32 }}>
                          {user.displayName 
                            ? user.displayName.charAt(0).toUpperCase()
                            : user.email?.charAt(0).toUpperCase() || 'U'
                          }
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle2">
                            {user.displayName || 'No Name'}
                            {user.uid === currentUser?.uid && (
                              <Chip 
                                label="You" 
                                size="small" 
                                color="secondary" 
                                sx={{ ml: 1 }}
                              />
                            )}
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            ID: {user.uid.slice(-8)}...
                          </Typography>
                        </Box>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Email fontSize="small" color="action" />
                        <Typography variant="body2">
                          {user.email || 'No email'}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Chip
                        icon={getRoleIcon(user.role)}
                        label={user.role?.toUpperCase() || 'USER'}
                        color={getRoleColor(user.role)}
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <CalendarToday fontSize="small" color="action" />
                        <Typography variant="body2">
                          {formatDate(user.createdAt)}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip title="View Details">
                        <IconButton 
                          size="small"
                          onClick={() => handleViewDetails(user)}
                        >
                          <Info />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* User Details Dialog */}
      <Dialog 
        open={detailsOpen} 
        onClose={handleCloseDetails}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar>
              {selectedUser?.displayName 
                ? selectedUser.displayName.charAt(0).toUpperCase()
                : selectedUser?.email?.charAt(0).toUpperCase() || 'U'
              }
            </Avatar>
            <Box>
              <Typography variant="h6">
                {selectedUser?.displayName || 'No Name'}
              </Typography>
              <Typography variant="caption" color="textSecondary">
                User Details
              </Typography>
            </Box>
          </Stack>
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            <Box>
              <Typography variant="subtitle2" color="textSecondary">
                User ID
              </Typography>
              <Typography variant="body1">
                {selectedUser?.uid}
              </Typography>
            </Box>
            
            <Box>
              <Typography variant="subtitle2" color="textSecondary">
                Email
              </Typography>
              <Typography variant="body1">
                {selectedUser?.email || 'No email provided'}
              </Typography>
            </Box>
            
            <Box>
              <Typography variant="subtitle2" color="textSecondary">
                Display Name
              </Typography>
              <Typography variant="body1">
                {selectedUser?.displayName || 'No display name'}
              </Typography>
            </Box>
            
            <Box>
              <Typography variant="subtitle2" color="textSecondary">
                Role
              </Typography>
              <Chip
                icon={getRoleIcon(selectedUser?.role)}
                label={selectedUser?.role?.toUpperCase() || 'USER'}
                color={getRoleColor(selectedUser?.role)}
                size="small"
                variant="outlined"
              />
            </Box>
            
            <Box>
              <Typography variant="subtitle2" color="textSecondary">
                Account Created
              </Typography>
              <Typography variant="body1">
                {formatDate(selectedUser?.createdAt)}
              </Typography>
            </Box>
            
            {selectedUser?.lastLogin && (
              <Box>
                <Typography variant="subtitle2" color="textSecondary">
                  Last Login
                </Typography>
                <Typography variant="body1">
                  {formatDate(selectedUser.lastLogin)}
                </Typography>
              </Box>
            )}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDetails}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserList;