import { useState, useEffect } from 'react';
import { Button, Chip, Typography, IconButton, Alert, Pagination, Box } from '@mui/material';
import { Edit } from '@mui/icons-material';
import TaskForm from './TaskForm';
import { Dialog, DialogTitle, DialogContent } from '@mui/material';
import { useRouter } from 'next/navigation';
import ConfirmationDialog from '../ConfirmationDialog';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import toast from 'react-hot-toast';

const statusColors = {
  todo: 'default',
  'in-progress': 'primary',
  done: 'success',
};

const TaskList = ({ tasks, users, onTaskCreated, onTaskUpdated, onTaskDeleted, currentUser, totalPages, currentPage, onPageChange }) => {
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

  const handleRowClick = (taskId) => {
    router.push(`/tasks/${taskId}`);
  };

  const handleCreate = () => {
    setSelectedTask(null);
    setFormError('');
    setOpen(true);
  };

  const handleEdit = (task, e) => {
    e.stopPropagation();
    setSelectedTask(task);
    setFormError('');
    setOpen(true);
  };

  const handleDeleteClick = (task, e) => {
    e.stopPropagation();
    setTaskToDelete(task);
    setConfirmOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (taskToDelete) {
      try {
        await onTaskDeleted(taskToDelete.id);
        toast.success('Task deleted successfully!', {
          duration: 4000,
          position: 'top-center',
        });
        setConfirmOpen(false);
        setTaskToDelete(null);
      } catch (err) {
        console.error('Failed to delete task:', err);
        const errorMsg = 'Failed to delete task. Please check your permissions.';
        setFormError(errorMsg);
        toast.error(errorMsg);
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
        toast.success('Task updated successfully!', {
          duration: 4000,
          position: 'top-center',
        });
      } else {
        await onTaskCreated(taskData);
        toast.success('Task created successfully!', {
          duration: 4000,
          position: 'top-center',
        });
      }
      setOpen(false);
      setFormError('');
    } catch (err) {
      console.error('Failed to save task:', err);
      const errorMsg = 'Failed to save task. Please check your permissions.';
      setFormError(errorMsg);
      toast.error(errorMsg);
    }
  };

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString();
    } catch (e) {
      return 'Invalid Date';
    }
  };

  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <Typography variant="h5" className="font-semibold text-gray-900">
          Task List
        </Typography>
        <Button
          variant="contained"
          onClick={handleCreate}
          className="w-full sm:w-auto shadow-sm"
        >
          Create Task
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="block sm:hidden bg-gray-50 px-4 py-3 border-b border-gray-200">
          <Typography variant="subtitle2" className="font-semibold text-gray-700">
          Tasks ({tasks.length}) - Page {currentPage} of {totalPages}
          </Typography>
        </div>
        <div className="hidden sm:grid sm:grid-cols-12 bg-gray-50 px-6 py-3 border-b border-gray-200 text-sm font-medium text-gray-700">
          <div className="col-span-3">Title</div>
          <div className="col-span-4">Description</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-2">Due Date</div>
          <div className="col-span-1 text-center">Actions</div>
        </div>

        <div className="divide-y divide-gray-100">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="hover:bg-gray-50 cursor-pointer transition-colors duration-150"
            >
              <div className="block sm:hidden p-4">
                <div className="flex justify-between items-start mb-2">
                  <Typography variant="subtitle1" className="font-medium text-gray-900 flex-1 mr-2">
                    Title :- {task.title}
                  </Typography>
                  <div className="flex items-center gap-1 ml-2">
                    <IconButton
                      onClick={(e) => handleEdit(task, e)}
                      disabled={!canEditTask(task)}
                      size="small"
                      className="p-1"
                    >
                      <Edit fontSize="small" />
                    </IconButton>
                    <IconButton
                      onClick={(e) => handleDeleteClick(task, e)}
                      disabled={!canDeleteTask(task)}
                      size="small"
                      color="error"
                      className="p-1"
                    >
                      <DeleteOutlineIcon fontSize="small" />
                    </IconButton>
                  </div>
                </div>

                <Typography variant="body2" className="text-gray-600 mb-3 line-clamp-2">
                  Description :- {task.description}
                </Typography>

                <div className="flex flex-wrap items-center gap-2 mt-3">
                  Status :- <Chip
                    label={task.status}
                    color={statusColors[task.status]}
                    variant="outlined"
                    size="small"
                  />
                </div>
                <div className='mt-2'>
                <Typography variant="caption" className="text-gray-500">
                    DueDate :- {formatDate(task.dueDate)}
                  </Typography>
                  </div>
              </div>

              <div className="hidden sm:grid sm:grid-cols-12 px-6 py-4 items-center">
                <div className="col-span-3">
                  <Typography variant="body2" className="font-medium text-gray-900 truncate">
                    {task.title}
                  </Typography>
                </div>

                <div className="col-span-4">
                  <Typography variant="body2" className="text-gray-600 line-clamp-2">
                    {task.description}
                  </Typography>
                </div>

                <div className="col-span-2">
                  <Chip
                    label={task.status}
                    color={statusColors[task.status]}
                    variant="outlined"
                    size="small"
                  />
                </div>

                <div className="col-span-2">
                  <Typography variant="body2" className="text-gray-600">
                    {formatDate(task.dueDate)}
                  </Typography>
                </div>

                <div className="col-span-1 flex justify-center">
                  <div className="flex items-center gap-1">
                    <IconButton
                      onClick={(e) => handleEdit(task, e)}
                      disabled={!canEditTask(task)}
                      size="small"
                    >
                      <Edit fontSize="small" />
                    </IconButton>
                    <IconButton
                      onClick={(e) => handleDeleteClick(task, e)}
                      disabled={!canDeleteTask(task)}
                      size="small"
                      color="error"
                    >
                      <DeleteOutlineIcon fontSize="small" />
                    </IconButton>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {tasks?.length === 0 && (
          <div className="px-6 py-12 text-center">
            <Typography variant="body1" className="text-gray-500">
              No tasks found. Create your first task to get started.
            </Typography>
          </div>
        )}
      </div>

      {tasks.length > 0 && (
        <Box className="flex justify-center mt-6">
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={onPageChange}
            color="primary"
            showFirstButton
            showLastButton
            size="large"
          />
        </Box>
      )}

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>{selectedTask ? 'Edit Task' : 'Create Task'}</DialogTitle>
        <DialogContent>
          {formError && (
            <Alert severity="error" className="mb-4">
              {formError}
            </Alert>
          )}
          <TaskForm
            task={selectedTask}
            onSubmit={handleSubmit}
            users={users}
            error={formError}
            onClose={() => setOpen(false)}
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