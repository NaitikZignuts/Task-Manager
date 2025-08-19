'use client'
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTasks } from '../../../features/tasks/taskSlice';
import TaskList from '../../../components/Task/TaskList';
import DashboardLayout from '../../../components/DashboardLayout';
import { getUsers } from '../../../features/auth/authService';
import { useState } from 'react';
import AuthGuard from '../../../components/AuthGuard'

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { tasks, status, error } = useSelector((state) => state.tasks);
  const { user } = useSelector((state) => state.auth);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (user) {
      dispatch(fetchTasks(user.uid));
      getUsers().then(setUsers);
    }
  }, [dispatch]);

  const handleTaskCreated = async (taskData) => {
    await dispatch(createTask(taskData));
    dispatch(fetchTasks(user.uid));
  };

  const handleTaskUpdated = async (taskId, taskData) => {
    await dispatch(editTask({ id: taskId, taskData }));
    dispatch(fetchTasks(user.uid));
  };

  const handleTaskDeleted = async (taskId) => {
    await dispatch(removeTask(taskId));
    dispatch(fetchTasks(user.uid));
  };

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <AuthGuard>
      <DashboardLayout>
        <TaskList
          tasks={tasks}
          users={users}
          onTaskCreated={handleTaskCreated}
          onTaskUpdated={handleTaskUpdated}
          onTaskDeleted={handleTaskDeleted}
        />
      </DashboardLayout>
    </AuthGuard>
  );
};

export default AdminDashboard;