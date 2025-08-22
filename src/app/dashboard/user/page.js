"use client"
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createTask, editTask, fetchTasks, removeTask } from '../../../features/tasks/taskSlice';
import TaskList from '../../../components/Task/TaskList';
import UserList from '../../../components/User/UserList';
import DashboardLayout from '../../../components/DashboardLayout';
import { getUsers } from '../../../features/auth/authService';
import AuthGuard from '@/components/AuthGuard';
import {
  Typography,
  Card,
  CardContent,
  Button,
  Alert,
  Tabs,
  Tab,
  Box,
  Chip,
  CircularProgress
} from '@mui/material';
import {
  Download,
  People,
  Search,
  FilterList
} from '@mui/icons-material';
import { exportTasksToCSV } from "../../../components/exportUtils"
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import FormInput from '@/components/common/FormInput';
import FormAutocomplete from '@/components/common/FormAutocomplete';
import { Controller, useForm } from 'react-hook-form';
import { dateOptions, statusOptions } from '@/components/common/TaskOption';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const UserDashboard = () => {
  const dispatch = useDispatch();
  const { tasks, totalCount, totalPages, currentPage: reduxCurrentPage, status, error } = useSelector((state) => state.tasks);
  const { user } = useSelector((state) => state.auth);
  const [users, setUsers] = useState([]);
  const [analytics, setAnalytics] = useState({});
  const [fetchError, setFetchError] = useState('');
  const [currentTab, setCurrentTab] = useState(0);
  const [chartType, setChartType] = useState('bar');
  const [currentPage, setCurrentPage] = useState(1);
  const [allTasks, setAllTasks] = useState([]);
  const [pageSize] = useState(10);

  const { control, watch } = useForm({
    defaultValues: {
      searchTerm: '',
      statusFilter: 'all',
      dateFilter: 'all'
    }
  });

  const searchTerm = watch('searchTerm');
  const statusFilter = watch('statusFilter');
  const dateFilter = watch('dateFilter');

  const getTabFilteredTasks = () => {
    if (!tasks) return [];

    switch (currentTab) {
      case 0:
        if (user?.role === 'admin') {
          return tasks;
        } else {
          return tasks.filter(task => 
            task.assignedTo === user?.uid || 
            (task.ownerId === user?.uid && (!task.assignedTo || task.assignedTo === user?.uid))
          );
        }
      case 1:
        return tasks.filter(task => task.assignedTo === user?.uid);
      case 2:
        if (user?.role === 'admin') {
          return [];
        } else {
          return tasks.filter(task => task.ownerId === user?.uid);
        }
      default:
        return tasks;
    }
  };

  const fetchAllTasks = async () => {
    try {
      const params = {
        searchTerm,
        statusFilter,
        dateFilter,
        page: currentPage,
        pageSize
      };

      if (user.role === 'admin') {
        await dispatch(fetchTasks(params)).unwrap();
      } else {
        await dispatch(fetchTasks({ ...params, userId: user.uid })).unwrap();
      }
    } catch (err) {
      console.error('Failed to fetch tasks:', err);
      setFetchError('Failed to load tasks. Please check your permissions.');
    }
  };

  useEffect(() => {
    if (user?.uid) {
      fetchAllTasks();

      getUsers()
        .then(allUsers => {
          if (user.role === 'admin') {
            setUsers(allUsers);
          } else {
            setUsers(allUsers.filter(u => u.role !== 'admin'));
          }
        })
        .catch(err => {
          console.error('Failed to fetch users:', err);
          setFetchError('Failed to load users. Please check your permissions.');
        });
    }
  }, [dispatch, user, searchTerm, statusFilter, dateFilter, currentPage]);

  useEffect(() => {
    const analyticsTasksToUse = user?.role === 'admin' ? allTasks : allTasks;
    if (analyticsTasksToUse.length > 0) {
      const analyticsData = {
        total: analyticsTasksToUse.length,
        todo: analyticsTasksToUse.filter(task => task.status === 'todo').length,
        inProgress: analyticsTasksToUse.filter(task => task.status === 'in-progress').length,
        done: analyticsTasksToUse.filter(task => task.status === 'done').length,
        assignedToMe: analyticsTasksToUse.filter(task => task.assignedTo === user?.uid).length,
        createdByMe: analyticsTasksToUse.filter(task => task.ownerId === user?.uid).length,
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
  }, [allTasks, user?.uid]);

  const fetchAllTasksForAnalytics = async () => {
    try {
      const params = {
        searchTerm: '',
        statusFilter: 'all', 
        dateFilter: 'all',
        page: 1,
        pageSize: 1000
      };
  
      let analyticsTasksResponse;
      if (user.role === 'admin') {
        analyticsTasksResponse = await dispatch(fetchTasks(params)).unwrap();
      } else {
        analyticsTasksResponse = await dispatch(fetchTasks({ ...params, userId: user.uid })).unwrap();
      }
      
      setAllTasks(analyticsTasksResponse.tasks || []);
    } catch (err) {
      console.error('Failed to fetch tasks for analytics:', err);
    }
  };

  useEffect(() => {
    if (user?.uid) {
      fetchAllTasksForAnalytics();
    }
  }, [dispatch, user?.uid]);

  const handleTaskCreated = async (taskData) => {
    try {
      await dispatch(createTask(taskData)).unwrap();
      fetchAllTasks();
    } catch (err) {
      console.error('Failed to create task:', err);
      setFetchError('Failed to create task. Please check your permissions.');
    }
  };

  const handleTaskUpdated = async (taskId, taskData) => {
    try {
      await dispatch(editTask({ id: taskId, taskData })).unwrap();
      fetchAllTasks();
    } catch (err) {
      console.error('Failed to update task:', err);
      setFetchError('Failed to update task. Please check your permissions.');
    }
  };

  const handleTaskDeleted = async (taskId) => {
    try {
      await dispatch(removeTask(taskId)).unwrap();
      fetchAllTasks();
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

  const filteredTasks = getTabFilteredTasks();
  const getTabLabels = () => {
    if (user?.role === 'admin') {
      return [
        { label: "All Tasks", icon: null },
        { label: "Assigned to Me", icon: null },
        { label: "User Management", icon: <People /> }
      ];
    } else {
      return [
        { label: "My Tasks", icon: null },
        { label: "Assigned to Me", icon: null },
        { label: "Created by Me", icon: null }
      ];
    }
  };

  const tabLabels = getTabLabels();

  const chartData = [
    { name: 'To Do', value: allTasks.filter(task => task.status === 'todo').length || 0 },
    { name: 'In Progress', value: allTasks.filter(task => task.status === 'in-progress').length || 0 },
    { name: 'Done', value: allTasks.filter(task => task.status === 'done').length || 0 },
  ];

  return (
    <AuthGuard>
      <DashboardLayout>
        <div className="mb-8">
          <Typography variant="h4" className="mb-7 font-bold text-gray-900">
            Task Dashboard
          </Typography>

          {fetchError && (
            <Alert severity="error" className="mb-4">
              {fetchError}
            </Alert>
          )}

          {error && (
            <Alert severity="error" className="mb-4">
              {error}
            </Alert>
          )}

          {user?.role === 'admin' && (
            <div className="flex justify-end mb-4 mt-2">
              <Button
                variant="outlined"
                startIcon={<Download />}
                onClick={handleExport}
                className="shadow-sm"
              >
                Export to CSV
              </Button>
            </div>
          )}

          {!(user?.role === 'admin' && currentTab === 2) && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8 mt-3">
                <Card className="shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <Typography className="text-gray-600 text-sm mb-2">
                      Total Tasks
                    </Typography>
                    <Typography variant="h5" className="font-bold text-gray-900">
                      {analytics.total || 0}
                    </Typography>
                  </CardContent>
                </Card>
                <Card className="shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <Typography className="text-gray-600 text-sm mb-2">
                      To Do
                    </Typography>
                    <Typography variant="h5" className="font-bold text-blue-600">
                      {analytics.todo || 0}
                    </Typography>
                  </CardContent>
                </Card>
                <Card className="shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <Typography className="text-gray-600 text-sm mb-2">
                      In Progress
                    </Typography>
                    <Typography variant="h5" className="font-bold text-yellow-600">
                      {analytics.inProgress || 0}
                    </Typography>
                  </CardContent>
                </Card>
                <Card className="shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <Typography className="text-gray-600 text-sm mb-2">
                      Done
                    </Typography>
                    <Typography variant="h5" className="font-bold text-green-600">
                      {analytics.done || 0}
                    </Typography>
                  </CardContent>
                </Card>
                <Card className="shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <Typography className="text-gray-600 text-sm mb-2">
                      Assigned to Me
                    </Typography>
                    <Typography variant="h5" className="font-bold text-purple-600">
                      {analytics.assignedToMe || 0}
                    </Typography>
                  </CardContent>
                </Card>
                <Card className="shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <Typography className="text-gray-600 text-sm mb-2">
                      Created by Me
                    </Typography>
                    <Typography variant="h5" className="font-bold text-indigo-600">
                      {analytics.createdByMe || 0}
                    </Typography>
                  </CardContent>
                </Card>
              </div>

              {user?.role === 'admin' && (
                <Card className="mb-8 shadow-sm">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-center mb-6">
                      <Typography variant="h6" className="font-semibold">
                        Task Status Analytics
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Chip
                          label="Pie Chart"
                          onClick={() => setChartType('pie')}
                          color={chartType === 'pie' ? 'primary' : 'default'}
                          variant={chartType === 'pie' ? 'filled' : 'outlined'}
                        />
                        <Chip
                          label="Bar Chart"
                          onClick={() => setChartType('bar')}
                          color={chartType === 'bar' ? 'primary' : 'default'}
                          variant={chartType === 'bar' ? 'filled' : 'outlined'}
                        />
                      </Box>
                    </div>

                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        {chartType === 'pie' ? (
                          <PieChart>
                            <Pie
                              data={chartData}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                              outerRadius={80}
                              fill="#8884d8"
                              dataKey="value"
                            >
                              {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                          </PieChart>
                        ) : (
                          <BarChart
                            data={chartData}
                            margin={{
                              top: 5,
                              right: 30,
                              left: 20,
                              bottom: 5,
                            }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="value" fill="#8884d8" />
                          </BarChart>
                        )}
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              )}

              <Card className="mb-6 shadow-sm">
                <CardContent className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Controller
                      name="searchTerm"
                      control={control}
                      render={({ field }) => (
                        <FormInput
                          {...field}
                          placeholder="Search tasks..."
                          InputProps={{
                            startAdornment: (
                              <Search />
                            ),
                          }}
                          fullWidth
                          size="small"
                        />
                      )}
                    />

                    <Controller
                      name="statusFilter"
                      control={control}
                      defaultValue="all"
                      render={({ field }) => (
                        <FormAutocomplete
                          {...field}
                          control={control}
                          name="statusFilter"
                          options={statusOptions}
                          label="Status"
                          id="status-filter"
                          size="small"
                          InputProps={{
                            startAdornment: (
                              <FilterList fontSize="small" />
                            ),
                          }}
                        />
                      )}
                    />

                    <Controller
                      name="dateFilter"
                      control={control}
                      defaultValue="all"
                      render={({ field }) => (
                        <FormAutocomplete
                          {...field}
                          control={control}
                          name="dateFilter"
                          options={dateOptions}
                          label="Due Date"
                          id="date-filter"
                          size="small"
                        />
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          <div className="border-b border-gray-200 mb-6">
            <Tabs
              value={currentTab}
              onChange={handleTabChange}
              aria-label="dashboard tabs"
              className="min-h-12"
              variant="scrollable"
              scrollButtons="auto"
              allowScrollButtonsMobile
            >

              {tabLabels.map((tab, index) => (
                <Tab
                  key={index}
                  label={tab.label}
                  icon={tab.icon}
                  iconPosition="start"
                  className="min-h-12 text-sm font-medium"
                />
              ))}
            </Tabs>
          </div>
        </div>

        {user?.role === 'admin' && currentTab === 2 ? (
          <UserList users={users} currentUser={user} />
        ) : (
          <TaskList
            tasks={filteredTasks}
            users={users}
            onTaskCreated={handleTaskCreated}
            onTaskUpdated={handleTaskUpdated}
            onTaskDeleted={handleTaskDeleted}
            currentUser={user}
            currentTab={currentTab}
            totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={(event, newPage) => setCurrentPage(newPage)}
            loading={status === 'loading'}
          />
        )}
      </DashboardLayout>
    </AuthGuard>
  );
};

export default UserDashboard;