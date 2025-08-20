import React from 'react';
import { Controller } from 'react-hook-form';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { Box, Typography } from '@mui/material';

const FormAutocomplete = (props) => {
  const {
    control,
    name,
    rules,
    label,
    id,
    options,
    placeholder,
    multiple,
    disabled,
    onChangeHandler,
    size,
    defaultValue,
    clearIcon,
    errors,
    watch
  } = props;

  // Safe getOptionLabel function that handles undefined values
  const getOptionLabel = (option) => {
    if (!option) return '';
    if (typeof option === 'string') {
      // If option is a string, try to find it in the options array
      const foundOption = options.find(opt => opt.value === option);
      return foundOption ? foundOption.label : option;
    }
    return option.label || '';
  };

  // Function to find the option object from a value
  const findOptionFromValue = (value) => {
    if (!value) return null;
    if (typeof value === 'object' && value !== null) return value;
    return options.find(opt => opt.value === value) || null;
  };

  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      defaultValue={defaultValue || (multiple ? [] : null)}
      render={({ field, fieldState }) => (
        <Box sx={{ width: '100%' }}>
          <Autocomplete
            disablePortal={false}
            id={id}
            defaultValue={defaultValue}
            disableClearable={clearIcon || false}
            key={`${JSON.stringify(field.value)}`}
            multiple={multiple || false}
            options={options || []}
            getOptionLabel={getOptionLabel}
            isOptionEqualToValue={(option, value) => {
              if (!option || !value) return false;
              const optionValue = typeof option === 'object' ? option.value : option;
              const compareValue = typeof value === 'object' ? value.value : value;
              return optionValue === compareValue;
            }}
            sx={{
              '& .MuiAutocomplete-option': {
                whiteSpace: 'pre-line !important' 
              },
              width: '100%',
              '.MuiChip-label.MuiChip-labelSmall': {
                color:  '#8185F5',
                zIndex: 0
              },
              '.MuiChip-label.MuiChip-labelMedium': {
                color: '#8185F5'
              },
              '.MuiChip-root': {
                backgroundColor:  '#E8E7FB',
                borderRadius: '5px'
              },
              '.MuiChip-deleteIcon': {
                color:'#8185F5',
                backgroundColor:  '#E8E7FB'
              }
            }}
            size={size ? 'small' : 'small'}
            value={findOptionFromValue(field.value)}
            disabled={disabled || false}
            onChange={(event, newValue) => {
              if (onChangeHandler) {
                onChangeHandler(newValue);
              }
              // Store only the value (not the whole object) if it's an object with value property
              if (newValue && typeof newValue === 'object' && 'value' in newValue) {
                field.onChange(newValue.value);
              } else {
                field.onChange(newValue);
              }
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label={label || ''}
                size={size ? 'small' : 'small'}
                placeholder={placeholder || ''}
                error={!!fieldState.error}
                fullWidth
              />
            )}
          />
          {fieldState.error && (
            <Typography color='error' variant='body2' sx={{ wordWrap: 'break-word', mt: 1 }}>
              {fieldState.error.message}
            </Typography>
          )}
        </Box>
      )}
    />
  );
};

export default FormAutocomplete;