import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import DashboardLayout from '../../../components/DashboardLayout';
import TaskList from '../../../components/Task/TaskList';
import PrivateRoute from '../../../components/PrivateRoute';
import { fetchCreatedTasks } from '../../../features/tasks/taskSlice';

const CreatedTasksPage = () => {
  const dispatch = useDispatch();
  const { tasks, status, error } = useSelector((state) => state.tasks);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user) {
      dispatch(fetchCreatedTasks(user.uid));
    }
  }, [dispatch, user]);

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <PrivateRoute>
      <DashboardLayout>
        <TaskList
          tasks={tasks}
          showCreatedOnly={true}
        />
      </DashboardLayout>
    </PrivateRoute>
  );
};

export default CreatedTasksPage;