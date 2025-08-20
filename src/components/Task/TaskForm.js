import { useState, useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { TextField, Button, Stack, MenuItem, FormControl, InputLabel, Select, Box, Alert } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import useAuth from '@/hooks/useAuth';

const schema = yup.object().shape({
  title: yup.string().required('Title is required').min(3, 'Title must be at least 3 characters'),
  description: yup.string().required('Description is required'),
  status: yup.string().required('Status is required'),
  dueDate: yup.date().required('Due date is required').min(new Date(), 'Due date must be in the future'),
  assignedTo: yup.string().nullable(), 
});

const TaskForm = ({ task, onSubmit, users, error }) => {
  const { user } = useAuth();
  const { register, handleSubmit, control, reset, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: task || {
      title: '',
      description: '',
      status: 'todo',
      dueDate: new Date(),
      assignedTo: '',
    }
  });

  useEffect(() => {
    if (task) {
      reset({
        ...task,
        dueDate: task.dueDate ? new Date(task.dueDate) : new Date(),
        assignedTo: task.assignedTo || '',
      });
    }
  }, [task, reset]);

  const handleFormSubmit = (data) => {
    const formattedData = {
      ...data,
      ownerId: user.uid,
      assignedTo: data.assignedTo || null,
      dueDate: data.dueDate instanceof Date ? data.dueDate.toISOString() : data.dueDate,
    };
    onSubmit(formattedData);
  };

  const assignableUsers = users ? users.filter(u =>
    u.uid !== user.uid && u.role !== 'admin'
  ) : [];

  return (
    <Box component="form" onSubmit={handleSubmit(handleFormSubmit)} sx={{ mt: 2 }}>
      <Stack spacing={3}>
        {error && <Alert severity="error">{error}</Alert>}

        <TextField
          label="Title"
          {...register('title')}
          error={!!errors.title}
          helperText={errors.title?.message}
          fullWidth
        />

        <TextField
          label="Description"
          {...register('description')}
          error={!!errors.description}
          helperText={errors.description?.message}
          multiline
          rows={4}
          fullWidth
        />

        <FormControl fullWidth error={!!errors.status}>
          <InputLabel>Status</InputLabel>
          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                label="Status"
              >
                <MenuItem value="todo">To Do</MenuItem>
                <MenuItem value="in-progress">In Progress</MenuItem>
                <MenuItem value="done">Done</MenuItem>
              </Select>
            )}
          />
          {errors.status && <Alert severity="error">{errors.status.message}</Alert>}
        </FormControl>

        <Controller
          name="dueDate"
          control={control}
          render={({ field }) => (
            <DatePicker
              label="Due Date"
              value={field.value}
              onChange={(newValue) => {
                field.onChange(newValue);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  error={!!errors.dueDate}
                  helperText={errors.dueDate?.message}
                  fullWidth
                />
              )}
            />
          )}
        />

        {/* Assignment Section - Always show for both admin and regular users */}
        <FormControl fullWidth>
          <InputLabel>Assign To</InputLabel>
          <Controller
            name="assignedTo"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                label="Assign To"
                value={field.value || ''}
              >
                <MenuItem value="">
                  <em>Unassigned</em>
                </MenuItem>
                {assignableUsers.map((assignableUser) => (
                  <MenuItem key={assignableUser.uid} value={assignableUser.uid}>
                    {assignableUser.email || assignableUser.displayName || `User ${assignableUser.uid}`}
                  </MenuItem>
                ))}
              </Select>
            )}
          />
        </FormControl>

        <Button
          type="submit"
          variant="contained"
          size="large"
          fullWidth
        >
          {task ? 'Update Task' : 'Create Task'}
        </Button>
      </Stack>
    </Box>
  );
};

export default TaskForm;