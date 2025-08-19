import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Typography } from '@mui/material';
import DashboardLayout from '../../../components/DashboardLayout';
import { useSelector } from 'react-redux';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

const AnalyticsPage = () => {
  const { tasks } = useSelector((state) => state.tasks);

  const statusData = [
    { name: 'To Do', value: tasks.filter(task => task.status === 'todo').length },
    { name: 'In Progress', value: tasks.filter(task => task.status === 'in-progress').length },
    { name: 'Done', value: tasks.filter(task => task.status === 'done').length },
  ];

  return (
    <DashboardLayout>
      <Typography variant="h4" mb={4}>Task Analytics</Typography>
      
      <Typography variant="h6" mb={2}>Task Status Distribution</Typography>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={statusData}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
          >
            {statusData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>

      <Typography variant="h6" mt={4} mb={2}>Tasks by Due Date</Typography>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={tasks}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="dueDate" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="title" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </DashboardLayout>
  );
};

export default AnalyticsPage;