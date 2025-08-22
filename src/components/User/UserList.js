import { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Chip,
  Avatar,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
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
      <Card className="w-full shadow-md">
        <CardContent className="p-4 md:p-6">
          <Typography variant="h6" className="font-semibold mb-2">
            User Management
          </Typography>
          <Typography className="text-gray-500">
            No users found.
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="w-full">
      <Card className="w-full shadow-md">
        <CardContent className="p-4 md:p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-2">
            <Typography variant="h6" className="font-semibold">
              User Management ({users.length} users)
            </Typography>
            <Chip 
              icon={<AdminPanelSettings />}
              label="Admin View" 
              color="error" 
              variant="outlined" 
              className="self-start md:self-center"
            />
          </div>

          <div className="block md:hidden space-y-4">
            {users.map((user) => (
              <div 
                key={user.uid}
                className={`p-4 rounded-lg border ${user.uid === currentUser?.uid ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-200'}`}
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-10 h-10">
                      {user.displayName 
                        ? user.displayName.charAt(0).toUpperCase()
                        : user.email?.charAt(0).toUpperCase() || 'U'
                      }
                    </Avatar>
                    <div>
                      <Typography variant="caption" className="text-gray-500">
                        ID: {user.uid.slice(-8)}...
                      </Typography>
                    </div>
                  </div>
                  <Tooltip title="View Details">
                    <IconButton 
                      size="small"
                      onClick={() => handleViewDetails(user)}
                    >
                      <Info />
                    </IconButton>
                  </Tooltip>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2 ml-2">
                    <Email fontSize="small" className="text-gray-400" />
                    <Typography variant="body2" className="text-gray-700">
                      {user.email || 'No email'}
                    </Typography>
                  </div>
                  <div className="flex items-center gap-2 ml-2">
                    <CalendarToday fontSize="small" className="text-gray-400" />
                    <Typography variant="body2" className="text-gray-700">
                      {formatDate(user.createdAt)}
                    </Typography>
                  </div>
                  <div className="flex items-center gap-2 ml-2 mt-2">
                    <Chip
                      icon={getRoleIcon(user.role)}
                      label={user.role?.toUpperCase() || 'USER'}
                      color={getRoleColor(user.role)}
                      size="small"
                      variant="outlined"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="hidden md:block">
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
                      className={user.uid === currentUser?.uid ? 'bg-blue-50' : ''}
                    >
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="w-8 h-8">
                            {user.displayName 
                              ? user.displayName.charAt(0).toUpperCase()
                              : user.email?.charAt(0).toUpperCase() || 'U'
                            }
                          </Avatar>
                          <div>
                            <Typography variant="caption" className="text-gray-500">
                              ID: {user.uid.slice(-8)}...
                            </Typography>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Email fontSize="small" className="text-gray-400" />
                          <Typography variant="body2">
                            {user.email || 'No email'}
                          </Typography>
                        </div>
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
                        <div className="flex items-center gap-2">
                          <CalendarToday fontSize="small" className="text-gray-400" />
                          <Typography variant="body2">
                            {formatDate(user.createdAt)}
                          </Typography>
                        </div>
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
          </div>
        </CardContent>
      </Card>

      <Dialog 
        open={detailsOpen} 
        onClose={handleCloseDetails}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <div className="flex items-center gap-3">
            <Avatar className="w-10 h-10">
              {selectedUser?.displayName 
                ? selectedUser.displayName.charAt(0).toUpperCase()
                : selectedUser?.email?.charAt(0).toUpperCase() || 'U'
              }
            </Avatar>
            <div>
              <Typography variant="h6">
                {selectedUser?.displayName || 'User Details'}
              </Typography>
              <Typography variant="caption" className="text-gray-500">
                User Details
              </Typography>
            </div>
          </div>
        </DialogTitle>
        <DialogContent>
          <div className="space-y-4 mt-2">
            <div>
              <Typography variant="subtitle2" className="text-gray-500">
                User ID
              </Typography>
              <Typography variant="body1" className="break-all">
                {selectedUser?.uid}
              </Typography>
            </div>
            
            <div>
              <Typography variant="subtitle2" className="text-gray-500">
                Email
              </Typography>
              <Typography variant="body1">
                {selectedUser?.email || 'No email provided'}
              </Typography>
            </div>
            
            <div>
              <Typography variant="subtitle2" className="text-gray-500">
                Role
              </Typography>
              <Chip
                icon={getRoleIcon(selectedUser?.role)}
                label={selectedUser?.role?.toUpperCase() || 'USER'}
                color={getRoleColor(selectedUser?.role)}
                size="small"
                variant="outlined"
              />
            </div>
            
            <div>
              <Typography variant="subtitle2" className="text-gray-500">
                Account Created
              </Typography>
              <Typography variant="body1">
                {formatDate(selectedUser?.createdAt)}
              </Typography>
            </div>
            
            {selectedUser?.lastLogin && (
              <div>
                <Typography variant="subtitle2" className="text-gray-500">
                  Last Login
                </Typography>
                <Typography variant="body1">
                  {formatDate(selectedUser.lastLogin)}
                </Typography>
              </div>
            )}
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDetails}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default UserList;