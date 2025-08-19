import { DataGrid } from '@mui/x-data-grid';
import { Typography } from '@mui/material';

const columns = [
  { field: 'email', headerName: 'Email', flex: 1 },
  { field: 'role', headerName: 'Role', flex: 1 },
];

const UserList = ({ users }) => {
  return (
    <div style={{ height: 600, width: '100%' }}>
      <Typography variant="h4" mb={2}>Users</Typography>
      <DataGrid
        rows={users}
        columns={columns}
        pageSize={10}
        rowsPerPageOptions={[10]}
      />
    </div>
  );
};

export default UserList;