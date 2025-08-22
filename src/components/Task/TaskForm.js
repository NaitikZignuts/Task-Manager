import { useState, useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Button, Stack, Box, Alert, IconButton, Typography } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import useAuth from '@/hooks/useAuth';
import FormInput from '@/components/common/FormInput';
import FormAutocomplete from '@/components/common/FormAutocomplete';
import { statusOptions } from '../common/TaskOption';
import { DescriptionRules, DueDateRules, RequiredRules, TitleRules } from '../common/commonRules';
import CloseIcon from '@mui/icons-material/Close';

const TaskForm = ({ task, onSubmit, users, error, onClose }) => {
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
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleFormSubmit = async (data) => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    const formattedData = {
      ...data,
      ownerId: user.uid,
      assignedTo: data.assignedTo || null,
      dueDate: data.dueDate instanceof Date ? data.dueDate.toISOString() : data.dueDate,
      createdAt: task?.createdAt || new Date().toISOString(),
    };

    try {
      await onSubmit(formattedData);
    } finally {
      setIsSubmitting(false);
    }
  };

  const assignableUsers = users ? users
    .filter(u => u.uid !== user.uid && u.role !== 'admin')
    .map(user => ({
      value: user.uid,
      label: user.email || user.displayName || `User ${user.uid}`
    })) : [];


  const currentAssignedTo = assignableUsers.find(user => user.value === task?.assignedTo) || null;
  const currentStatus = statusOptions.find(status => status.value === task?.status) || statusOptions[0];

  if (!isFormReady) {
    return null;
  }

  return (
    <Box component="form" onSubmit={handleSubmit(handleFormSubmit)} sx={{ mt: 2 }}>
      <IconButton
        aria-label="close"
        onClick={onClose}
        sx={{
          position: 'absolute',
          right: 8,
          top: 8,
          color: (theme) => theme.palette.grey[500],
        }}
      >
        <CloseIcon />
      </IconButton>
      <Stack spacing={3}>
        {error && <Alert severity="error">{error}</Alert>}

        <FormInput
          name="title"
          label="Title"
          control={control}
          errors={errors}
          rules={TitleRules}
          fullWidth
        />

        <FormInput
          name="description"
          label="Description"
          control={control}
          errors={errors}
          rules={DescriptionRules}
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
          rules={RequiredRules}
          defaultValue={currentStatus}
        />

        <Controller
          name="dueDate"
          control={control}
          rules={DueDateRules}
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
                  rules={RequiredRules}
                />
              )}
            />
          )}
        />
        {errors.dueDate && (
          <Typography
            variant="caption"
            color="error"
            sx={{ marginTop:'0px !important' }}
          >
            {errors.dueDate.message}
          </Typography>
        )}

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
          disabled={isSubmitting}
        >
          {isSubmitting
            ? (task ? 'Updating Task...' : 'Creating Task...')
            : (task ? 'Update Task' : 'Create Task')
          }
        </Button>
      </Stack>
    </Box>
  );
};

export default TaskForm;