import { useState, useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Button, Stack, Box, Alert } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import useAuth from '@/hooks/useAuth';
import FormInput from '@/components/common/FormInput';
import FormAutocomplete from '@/components/common/FormAutocomplete';

const TaskForm = ({ task, onSubmit, users, error }) => {
  const { user } = useAuth();
  const { control, handleSubmit, reset, formState: { errors }, watch } = useForm({
    mode: "all",
    defaultValues: {
      title: '',
      description: '',
      status: 'todo',
      dueDate: new Date(),
      assignedTo: null
    }
  });

  const dueDateValue = watch('dueDate');
  const [isFormReady, setIsFormReady] = useState(false);

  useEffect(() => {
    if (task) {
      reset({
        title: task.title || '',
        description: task.description || '',
        status: task.status || 'todo',
        dueDate: task.dueDate ? new Date(task.dueDate) : new Date(),
        assignedTo: task.assignedTo || null,
      });
    }
    setIsFormReady(true);
  }, [task, reset]);

  const validateDueDate = (date) => {
    if (!date) return 'Due date is required';
    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate < today) {
      return 'Due date must be in the future - past dates are not allowed';
    }
    return true;
  };

  const handleFormSubmit = (data) => {
    const formattedData = {
      ...data,
      ownerId: user.uid,
      assignedTo: data.assignedTo || null,
      dueDate: data.dueDate instanceof Date ? data.dueDate.toISOString() : data.dueDate,
      createdAt: task?.createdAt || new Date().toISOString(),
    };
    onSubmit(formattedData);
  };

  const assignableUsers = users ? users
    .filter(u => u.uid !== user.uid && u.role !== 'admin')
    .map(user => ({
      value: user.uid,
      label: user.email || user.displayName || `User ${user.uid}`
    })) : [];

  const statusOptions = [
    { value: 'todo', label: 'To Do' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'done', label: 'Done' }
  ];

  // Get current values for the form as option objects
  const currentAssignedTo = assignableUsers.find(user => user.value === task?.assignedTo) || null;
  const currentStatus = statusOptions.find(status => status.value === task?.status) || statusOptions[0];

  // Don't render the form until it's ready to prevent the uncontrolled to controlled error
  if (!isFormReady) {
    return null;
  }

  return (
    <Box component="form" onSubmit={handleSubmit(handleFormSubmit)} sx={{ mt: 2 }}>
      <Stack spacing={3}>
        {error && <Alert severity="error">{error}</Alert>}

        <FormInput
          name="title"
          label="Title"
          control={control}
          errors={errors}
          rules={{
            required: 'Title is required',
            minLength: {
              value: 3,
              message: 'Title must be at least 3 characters'
            }
          }}
          fullWidth
        />

        <FormInput
          name="description"
          label="Description"
          control={control}
          errors={errors}
          rules={{
            required: 'Description is required'
          }}
          multiline={true}
          rows={4}
          fullWidth
        />

        <FormAutocomplete
          name="status"
          label="Status"
          control={control}
          id="status-select"
          options={statusOptions}
          rules={{ required: 'Status is required' }}
          defaultValue={currentStatus}
        />

        <Controller
          name="dueDate"
          control={control}
          rules={{
            required: 'Due date is required',
            validate: validateDueDate
          }}
          render={({ field }) => (
            <DatePicker
              label="Due Date"
              value={field.value}
              onChange={(newValue) => {
                field.onChange(newValue);
              }}
              minDate={new Date()}
              renderInput={(params) => (
                <FormInput
                  name="dueDate"
                  control={control}
                  errors={errors}
                  inputProps={params.inputProps}
                  fullWidth
                  {...params}
                  customMsg={errors.dueDate?.message}
                  rules={{
                    required: 'DueDate is required'
                  }}
                />
              )}
            />
          )}
        />

        {/* Assignment Section */}
        <FormAutocomplete
          name="assignedTo"
          label="Assign To"
          control={control}
          id="assignee-select"
          options={assignableUsers}
          clearIcon={true}
          defaultValue={currentAssignedTo}
        />

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