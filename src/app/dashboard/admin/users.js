import { useEffect, useState } from 'react';
import DashboardLayout from '../../../components/DashboardLayout';
import UserList from '../../../components/User/UserList';
import PrivateRoute from '../../../components/PrivateRoute';

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/users');
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  return (
    <PrivateRoute roles={['admin']}>
      <DashboardLayout>
        <UserList users={users} />
      </DashboardLayout>
    </PrivateRoute>
  );
};

export default AdminUsersPage;