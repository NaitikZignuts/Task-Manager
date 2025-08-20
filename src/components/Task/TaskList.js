import { useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Button, Chip, Stack, Typography, IconButton, Box, Alert } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import TaskForm from './TaskForm';
import { Dialog, DialogTitle, DialogContent } from '@mui/material';
import { useRouter } from 'next/navigation';
import ConfirmationDialog from '../ConfirmationDialog';

const statusColors = {
  todo: 'default',
  'in-progress': 'primary',
  done: 'success',
};

const TaskList = ({ tasks, users, onTaskCreated, onTaskUpdated, onTaskDeleted, currentUser }) => {
  const [open, setOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [formError, setFormError] = useState('');
  const router = useRouter();

  const canEditTask = (task) => {
    return currentUser?.role === 'admin' || task.ownerId === currentUser?.uid;
  };

  const canDeleteTask = (task) => {
    return currentUser?.role === 'admin' || task.ownerId === currentUser?.uid;
  };

  const columns = [
    { field: 'title', headerName: 'Title', flex: 1 },
    { field: 'description', headerName: 'Description', flex: 1.5 },
    {
      field: 'status',
      headerName: 'Status',
      flex: 1,
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={statusColors[params.value]}
          variant="outlined"
        />
      )
    },
    {
      field: 'dueDate',
      headerName: 'Due Date',
      flex: 1,
      valueFormatter: (params) => {
        try {
          return new Date(params.value).toLocaleDateString();
        } catch (e) {
          return 'Invalid Date';
        }
      }
    },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 1,
      renderCell: (params) => {
        const task = params.row;
        return (
          <Box>
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                handleEdit(task);
              }}
              disabled={!canEditTask(task)}
              size="small"
            >
              <Edit />
            </IconButton>
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteClick(task);
              }}
              disabled={!canDeleteTask(task)}
              size="small"
              color="error"
            >
              <Delete />
            </IconButton>
          </Box>
        );
      }
    }
  ];

  const handleRowClick = (params) => {
    router.push(`/tasks/${params.id}`);
  };

  const handleCreate = () => {
    setSelectedTask(null);
    setFormError('');
    setOpen(true);
  };

  const handleEdit = (task) => {
    setSelectedTask(task);
    setFormError('');
    setOpen(true);
  };

  const handleDeleteClick = (task) => {
    setTaskToDelete(task);
    setConfirmOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (taskToDelete) {
      try {
        await onTaskDeleted(taskToDelete.id);
        setConfirmOpen(false);
        setTaskToDelete(null);
      } catch (err) {
        console.error('Failed to delete task:', err);
        setFormError('Failed to delete task. Please check your permissions.');
      }
    }
  };

  const handleSubmit = async (taskData, event) => {
    if (event) {
      event.preventDefault();
    }
    try {
      if (selectedTask) {
        await onTaskUpdated(selectedTask.id, taskData);
      } else {
        await onTaskCreated(taskData);
      }
      setOpen(false);
      setFormError('');
    } catch (err) {
      console.error('Failed to save task:', err);
      setFormError('Failed to save task. Please check your permissions.');
    }
  };

  return (
    <div style={{ height: 600, width: '100%' }}>
      <Stack direction="row" justifyContent="space-between" mb={2}>
        <Typography variant="h5">Task List</Typography>
        <Button variant="contained" onClick={handleCreate}>
          Create Task
        </Button>
      </Stack>

      <DataGrid
        rows={tasks}
        columns={columns}
        pageSize={10}
        rowsPerPageOptions={[10]}
      />

      <Dialog
        open={open}
        onClose={(e) => {
          e.stopPropagation();
          setOpen(false);
        }}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>{selectedTask ? 'Edit Task' : 'Create Task'}</DialogTitle>
        <DialogContent>
          {formError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {formError}
            </Alert>
          )}
          <TaskForm
            task={selectedTask}
            onSubmit={handleSubmit}
            users={users}
            error={formError}
          />
        </DialogContent>
      </Dialog>

      <ConfirmationDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Confirm Delete"
        message="Are you sure you want to delete this task? This action cannot be undone."
      />
    </div>
  );
};

export default TaskList;