import React from 'react'
import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Switch,
  FormControlLabel,
  Chip,
  Box,
  Button
} from '@mui/material'
import { CloudUpload } from '@mui/icons-material'
import { Controller } from 'react-hook-form'

export const TextFieldComponent = ({ control, name, label, error, helperText, type = 'text', multiline = false, rows = 4, ...props }) => (
  <Controller
    name={name}
    control={control}
    render={({ field }) => (
      <TextField
        {...field}
        fullWidth
        label={label}
        type={type}
        multiline={multiline}
        rows={multiline ? rows : 1}
        error={!!error}
        helperText={helperText}
        {...props}
      />
    )}
  />
)

export const SelectFieldComponent = ({ control, name, label, options, error, helperText, ...props }) => (
  <FormControl fullWidth error={!!error}>
    <InputLabel>{label}</InputLabel>
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <Select
          {...field}
          label={label}
          {...props}
        >
          {options.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      )}
    />
    {helperText && <FormHelperText>{helperText}</FormHelperText>}
  </FormControl>
)

export const SwitchFieldComponent = ({ control, name, label, ...props }) => (
  <Controller
    name={name}
    control={control}
    render={({ field }) => (
      <FormControlLabel
        control={
          <Switch
            {...field}
            checked={field.value}
            {...props}
          />
        }
        label={label}
      />
    )}
  />
)

export const FileUploadComponent = ({ control, name, label, accept = "image/*", multiple = false, onFileChange, currentFiles = [] }) => (
  <Controller
    name={name}
    control={control}
    render={({ field: { onChange, value, ...field } }) => (
      <Box>
        <Button
          component="label"
          variant="outlined"
          startIcon={<CloudUpload />}
          fullWidth
          sx={{ mb: 1 }}
        >
          {label}
          <input
            {...field}
            type="file"
            accept={accept}
            multiple={multiple}
            hidden
            onChange={(e) => {
              const files = Array.from(e.target.files)
              onChange(files)
              if (onFileChange) onFileChange(files)
            }}
          />
        </Button>
        {currentFiles.length > 0 && (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {currentFiles.map((file, index) => (
              <Chip
                key={index}
                label={file.name || `File ${index + 1}`}
                size="small"
                variant="outlined"
              />
            ))}
          </Box>
        )}
      </Box>
    )}
  />
)

export const MultiSelectComponent = ({ control, name, label, options, error, helperText }) => (
  <FormControl fullWidth error={!!error}>
    <InputLabel>{label}</InputLabel>
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <Select
          {...field}
          multiple
          label={label}
          renderValue={(selected) => (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {selected.map((value) => {
                const option = options.find(opt => opt.value === value)
                return (
                  <Chip key={value} label={option?.label || value} size="small" />
                )
              })}
            </Box>
          )}
        >
          {options.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      )}
    />
    {helperText && <FormHelperText>{helperText}</FormHelperText>}
  </FormControl>
)
