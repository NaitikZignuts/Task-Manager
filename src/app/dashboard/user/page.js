"use client"
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createTask, editTask, fetchTasks, removeTask } from '../../../features/tasks/taskSlice';
import TaskList from '../../../components/Task/TaskList';
import DashboardLayout from '../../../components/DashboardLayout';
import { getUsers } from '../../../features/auth/authService';
import AuthGuard from '@/components/AuthGuard';
import { Typography, Box, Card, CardContent, Grid, Button, Alert, Tabs, Tab } from '@mui/material';
import { Download } from '@mui/icons-material';
import { exportTasksToCSV } from "../../../components/exportUtils"

const UserDashboard = () => {
  const dispatch = useDispatch();
  const { tasks, status, error } = useSelector((state) => state.tasks);
  const { user } = useSelector((state) => state.auth);
  const [users, setUsers] = useState([]);
  const [analytics, setAnalytics] = useState({});
  const [fetchError, setFetchError] = useState('');
  const [currentTab, setCurrentTab] = useState(0);

  // Filter tasks based on current tab
  const getFilteredTasks = () => {
    if (!tasks) return [];
    
    switch (currentTab) {
      case 0: // All Tasks (for admin) or My Tasks (for user)
        if (user?.role === 'admin') {
          return tasks;
        } else {
          return tasks.filter(task => task.ownerId === user?.uid);
        }
      case 1: // Assigned to Me
        return tasks.filter(task => task.assignedTo === user?.uid);
      case 2: // Created by Me (only for non-admin users)
        return tasks.filter(task => task.ownerId === user?.uid);
      default:
        return tasks;
    }
  };

  useEffect(() => {
    if (user?.uid) {  
      const fetchAllTasks = async () => {
        try {
          if (user.role === 'admin') {
            await dispatch(fetchTasks()).unwrap();
          } else {
            await dispatch(fetchTasks(user.uid)).unwrap();
          }
        } catch (err) {
          console.error('Failed to fetch tasks:', err);
          setFetchError('Failed to load tasks. Please check your permissions.');
        }
      };
      fetchAllTasks();
      getUsers()
        .then(setUsers)
        .catch(err => {
          console.error('Failed to fetch users:', err);
        });
    }
  }, [dispatch, user]); 

  useEffect(() => {
    if (tasks.length > 0) {
      const analyticsData = {
        total: tasks.length,
        todo: tasks.filter(task => task.status === 'todo').length,
        inProgress: tasks.filter(task => task.status === 'in-progress').length,
        done: tasks.filter(task => task.status === 'done').length,
        assignedToMe: tasks.filter(task => task.assignedTo === user?.uid).length,
        createdByMe: tasks.filter(task => task.ownerId === user?.uid).length,
      };
      setAnalytics(analyticsData);
    } else {
      setAnalytics({
        total: 0,
        todo: 0,
        inProgress: 0,
        done: 0,
        assignedToMe: 0,
        createdByMe: 0,
      });
    }
  }, [tasks, user?.uid]);

  const handleTaskCreated = async (taskData) => {
    try {
      await dispatch(createTask(taskData)).unwrap();
      // Refresh tasks after creation
      if (user.role === 'admin') {
        dispatch(fetchTasks());
      } else {
        dispatch(fetchTasks(user.uid));
      }
    } catch (err) {
      console.error('Failed to create task:', err);
      setFetchError('Failed to create task. Please check your permissions.');
    }
  };

  const handleTaskUpdated = async (taskId, taskData) => {
    try {
      await dispatch(editTask({ id: taskId, taskData })).unwrap();
      // Refresh tasks after update
      if (user.role === 'admin') {
        dispatch(fetchTasks());
      } else {
        dispatch(fetchTasks(user.uid));
      }
    } catch (err) {
      console.error('Failed to update task:', err);
      setFetchError('Failed to update task. Please check your permissions.');
    }
  };

  const handleTaskDeleted = async (taskId) => {
    try {
      await dispatch(removeTask(taskId)).unwrap();
      // Refresh tasks after deletion
      if (user.role === 'admin') {
        dispatch(fetchTasks());
      } else {
        dispatch(fetchTasks(user.uid));
      }
    } catch (err) {
      console.error('Failed to delete task:', err);
      setFetchError('Failed to delete task. Please check your permissions.');
    }
  };

  const handleExport = () => {
    exportTasksToCSV(tasks, users);
  };

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const filteredTasks = getFilteredTasks();

  return (
    <AuthGuard>
      <DashboardLayout>
        <Box mb={4}>
          <Typography variant="h4" gutterBottom>
            Task Dashboard
          </Typography>
          
          {fetchError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {fetchError}
            </Alert>
          )}
          
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          
          {user?.role === 'admin' && (
            <Box display="flex" justifyContent="flex-end" mb={2}>
              <Button 
                variant="outlined" 
                startIcon={<Download />}
                onClick={handleExport}
              >
                Export to CSV
              </Button>
            </Box>
          )}
          
          <Grid container spacing={3} mb={4}>
            <Grid item xs={12} sm={6} md={2}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Total Tasks
                  </Typography>
                  <Typography variant="h5">{analytics.total || 0}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    To Do
                  </Typography>
                  <Typography variant="h5">{analytics.todo || 0}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    In Progress
                  </Typography>
                  <Typography variant="h5">{analytics.inProgress || 0}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Done
                  </Typography>
                  <Typography variant="h5">{analytics.done || 0}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Assigned to Me
                  </Typography>
                  <Typography variant="h5">{analytics.assignedToMe || 0}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Created by Me
                  </Typography>
                  <Typography variant="h5">{analytics.createdByMe || 0}</Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Task Tabs */}
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
            <Tabs value={currentTab} onChange={handleTabChange} aria-label="task tabs">
              <Tab label={user?.role === 'admin' ? "All Tasks" : "My Tasks"} />
              <Tab label="Assigned to Me" />
              {user?.role !== 'admin' && <Tab label="Created by Me" />}
            </Tabs>
          </Box>
        </Box>

        <TaskList
          tasks={filteredTasks}
          users={users}
          onTaskCreated={handleTaskCreated}
          onTaskUpdated={handleTaskUpdated}
          onTaskDeleted={handleTaskDeleted}
          currentUser={user}
        />
      </DashboardLayout>
    </AuthGuard>
  );
};

export default UserDashboard;