import { Card, CardContent, Typography, Chip, Stack, Button } from '@mui/material';
import { useRouter } from 'next/navigation';

const statusColors = {
  todo: 'default',
  'in-progress': 'primary',
  done: 'success',
};

const TaskItem = ({ task, onEdit, onDelete }) => {
  const router = useRouter();

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h5">{task.title}</Typography>
          <Chip 
            label={task.status} 
            color={statusColors[task.status]} 
            variant="outlined"
          />
        </Stack>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          {task.description}
        </Typography>
        <Typography variant="caption" display="block" sx={{ mt: 1 }}>
          Due: {new Date(task.dueDate).toLocaleDateString()}
        </Typography>
        <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
          <Button 
            size="small" 
            variant="outlined"
            onClick={() => onEdit(task)}
          >
            Edit
          </Button>
          <Button 
            size="small" 
            variant="outlined" 
            color="error"
            onClick={() => onDelete(task.id)}
          >
            Delete
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default TaskItem;