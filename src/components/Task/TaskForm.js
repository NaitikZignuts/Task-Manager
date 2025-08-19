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
  assignedTo: yup.string(),
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
      reset(task);
    }
  }, [task, reset]);

  const handleFormSubmit = (data) => {
    onSubmit({
      ...data,
      ownerId: user.uid,
    });
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)}>
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
          <Select
            label="Status"
            {...register('status')}
            defaultValue={task?.status || 'todo'}
          >
            <MenuItem value="todo">To Do</MenuItem>
            <MenuItem value="in-progress">In Progress</MenuItem>
            <MenuItem value="done">Done</MenuItem>
          </Select>
          {errors.status && <Box sx={{ color: 'error.main', fontSize: '0.75rem', ml: 2, mt: 0.5 }}>{errors.status.message}</Box>}
        </FormControl>
        
        <Box>
          <Controller
            name="dueDate"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <DatePicker
                label="Due Date"
                value={field.value}
                onChange={(newValue) => {
                  field.onChange(newValue);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    error={!!error}
                    helperText={error?.message}
                  />
                )}
              />
            )}
          />
        </Box>
        
        {users && users.length > 0 && (
          <FormControl fullWidth>
            <InputLabel>Assign To</InputLabel>
            <Select
              label="Assign To"
              {...register('assignedTo')}
              defaultValue={task?.assignedTo || ''}
            >
              <MenuItem value="">Unassigned</MenuItem>
              {users.map((user) => (
                <MenuItem key={user.uid} value={user.uid}>
                  {user.email}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
        
        <Button type="submit" variant="contained" size="large">
          {task ? 'Update Task' : 'Create Task'}
        </Button>
      </Stack>
    </form>
  );
};

export default TaskForm;