"use client"
import React from 'react'
import { TextField, Typography, keyframes } from '@mui/material'
import { Controller } from 'react-hook-form'
import { Box } from '@mui/system'

const glowAnimation = keyframes`
  0% {
    border-color: #ff4444;
    box-shadow: 0 0 5px rgba(255, 68, 68, 0.3);
  }
  50% {
    border-color: #ff6666;
    box-shadow: 0 0 15px rgba(255, 68, 68, 0.6);
  }
  100% {
    border-color: #ff4444;
    box-shadow: 0 0 5px rgba(255, 68, 68, 0.3);
  }
`

function FormInput({
  control,
  rules,
  errors,
  name,
  type = 'text',
  placeholder,
  label,
  styles,
  id,
  disabled = false,
  multiline = false,
  extraProps = {},
  customMsg,
  rows = 1,
  onChangeCallback,
  onBlurCallback,
  fullWidth = true,
  variant = 'outlined',
  size = 'medium',
  onKeyDown,
  requiredFlag = false,
  inputProps,
  value,
  onChange
}) {
  const isRequired = requiredFlag || false

  // If control is provided (react-hook-form)
  if (control) {
    return (
      <Box sx={{ width: '100%' }}>
        <Controller
          name={name}
          control={control}
          rules={rules}
          defaultValue="" // Add default value to prevent undefined
          render={({ field: { onChange, value, ref } }) => (
            <>
              <TextField
                fullWidth={fullWidth}
                id={id}
                inputRef={ref}
                type={type}
                variant={variant}
                disabled={disabled}
                size={size}
                multiline={multiline}
                placeholder={placeholder}
                label={label}
                autoComplete='off'
                error={Boolean(errors?.[name])}
                value={value || ''} // Ensure value is never undefined
                inputProps={inputProps}
                onChange={(val) => {
                  const inputValue = val.target.value
                  if (type === 'number' && parseFloat(inputValue) >= 0) {
                    onChange(inputValue)
                    onChangeCallback && onChangeCallback(inputValue)
                  } else {
                    onChange(inputValue)
                    onChangeCallback && onChangeCallback(inputValue)
                  }
                }}
                onBlur={(val) => {
                  onBlurCallback && onBlurCallback(val.target.value || null)
                }}
                onKeyDown={onKeyDown}
                sx={{
                  ...styles,
                  '& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button': {
                    display: 'none'
                  },
                  '& input[type=number]': {
                    MozAppearance: 'textfield'
                  },
                  '& fieldset': {
                    border: errors?.[name] ? '1px solid #101e2433 !important' : '',
                    ...(isRequired &&
                      !errors?.[name] && {
                        border: '2px solid #ff4444 !important',
                        animation: `${glowAnimation} 2s ease-in-out infinite`
                      })
                  },
                  '&:focus-within fieldset':
                    isRequired && !errors?.[name]
                      ? {
                          border: '2px solid #ff6666 !important',
                          boxShadow: '0 0 10px rgba(255, 68, 68, 0.5)'
                        }
                      : {}
                }}
                InputProps={extraProps}
                rows={rows}
              />
            </>
          )}
        />
        {customMsg || errors?.[name] ? (
          <Typography color='error' variant='body2' sx={{ wordWrap: 'break-word' }}>
            {customMsg || (errors?.[name]?.message)}
          </Typography>
        ) : null}
      </Box>
    )
  }

  // If no control (regular input)
  return (
    <Box sx={{ width: '100%' }}>
      <TextField
        fullWidth={fullWidth}
        id={id}
        type={type}
        variant={variant}
        disabled={disabled}
        size={size}
        multiline={multiline}
        placeholder={placeholder}
        label={label}
        autoComplete='off'
        error={Boolean(errors?.[name])}
        value={value || ''} // Ensure value is never undefined
        inputProps={inputProps}
        onChange={onChange}
        onBlur={(val) => {
          onBlurCallback && onBlurCallback(val.target.value || null)
        }}
        onKeyDown={onKeyDown}
        sx={{
          ...styles,
          '& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button': {
            display: 'none'
          },
          '& input[type=number]': {
            MozAppearance: 'textfield'
          },
          '& fieldset': {
            border: errors?.[name] ? '1px solid #101e2433 !important' : '',
            ...(isRequired &&
              !errors?.[name] && {
                border: '2px solid #ff4444 !important',
                animation: `${glowAnimation} 2s ease-in-out infinite`
              })
          },
          '&:focus-within fieldset':
            isRequired && !errors?.[name]
              ? {
                  border: '2px solid #ff6666 !important',
                  boxShadow: '0 0 10px rgba(255, 68, 68, 0.5)'
                }
              : {}
        }}
        InputProps={extraProps}
        rows={rows}
      />
      {customMsg || errors?.[name] ? (
        <Typography color='error' variant='body2' sx={{ wordWrap: 'break-word' }}>
          {customMsg || (errors?.[name]?.message)}
        </Typography>
      ) : null}
    </Box>
  )
}

export default FormInput