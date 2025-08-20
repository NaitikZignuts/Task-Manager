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

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const UserDashboard = () => {
  const dispatch = useDispatch();
  const { tasks, status, error } = useSelector((state) => state.tasks);
  const { user } = useSelector((state) => state.auth);
  const [users, setUsers] = useState([]);
  const [analytics, setAnalytics] = useState({});
  const [fetchError, setFetchError] = useState('');
  const [currentTab, setCurrentTab] = useState(0);
  const [chartType, setChartType] = useState('bar');

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

  const getFilteredTasks = () => {
    if (!tasks) return [];
    
    let filtered = tasks;
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(task => 
        task.title.toLowerCase().includes(term) || 
        task.description.toLowerCase().includes(term)
      );
    }
    
    if (statusFilter && statusFilter !== 'all') {
      filtered = filtered.filter(task => task.status === statusFilter);
    }
    
    if (dateFilter !== 'all') {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      switch(dateFilter) {
        case 'today':
          filtered = filtered.filter(task => {
            const dueDate = new Date(task.dueDate);
            dueDate.setHours(0, 0, 0, 0);
            return dueDate.getTime() === today.getTime();
          });
          break;
        case 'week':
          const weekEnd = new Date(today);
          weekEnd.setDate(today.getDate() + 7);
          filtered = filtered.filter(task => {
            const dueDate = new Date(task.dueDate);
            return dueDate >= today && dueDate <= weekEnd;
          });
          break;
        case 'month':
          const monthEnd = new Date(today);
          monthEnd.setMonth(today.getMonth() + 1);
          filtered = filtered.filter(task => {
            const dueDate = new Date(task.dueDate);
            return dueDate >= today && dueDate <= monthEnd;
          });
          break;
        case 'overdue':
          filtered = filtered.filter(task => {
            const dueDate = new Date(task.dueDate);
            return dueDate < today;
          });
          break;
        default:
          break;
      }
    }
    
    switch (currentTab) {
      case 0: 
        if (user?.role === 'admin') {
          return filtered;
        } else {
          return filtered.filter(task => task.ownerId === user?.uid);
        }
      case 1:
        return filtered.filter(task => task.assignedTo === user?.uid);
      case 2: 
        if (user?.role === 'admin') {
          return [];
        } else {
          return filtered.filter(task => task.ownerId === user?.uid);
        }
      default:
        return filtered;
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
    { name: 'To Do', value: analytics.todo || 0 },
    { name: 'In Progress', value: analytics.inProgress || 0 },
    { name: 'Done', value: analytics.done || 0 },
  ];

  const statusOptions = [
    { value: 'todo', label: 'To Do' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'done', label: 'Done' }
  ];

  const dateOptions = [
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'Next 7 Days' },
    { value: 'month', label: 'This Month' },
    { value: 'overdue', label: 'Overdue' }
  ];

  return (
    <AuthGuard>
      <DashboardLayout>
        <div className="mb-8">
          <Typography variant="h4" className="mb-6 font-bold text-gray-900">
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
            <div className="flex justify-end mb-4">
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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
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

              {/* Analytics Charts */}
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

              {/* Search and Filters */}
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
          />
        )}
      </DashboardLayout>
    </AuthGuard>
  );
};

export default UserDashboard;