import React, { useState } from 'react'
import {
  Box,
  Typography,
  Paper,
  Button,
  Grid
} from '@mui/material'
import { ArrowBack, Save } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { api, API_ENDPOINTS } from '../../config/api'
import { toast } from 'react-toastify'
import { 
  TextFieldComponent, 
  SelectFieldComponent, 
  SwitchFieldComponent, 
  FileUploadComponent 
} from '../../components/common/FormField'

const schema = yup.object({
  title: yup.string().required('title is required'),
  message: yup.string().required('message is required'),
  type: yup.string(),
  target_audience: yup.string(),
  scheduled_at: yup.string(),
  status: yup.boolean()
})

const AddNotification = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      title: '',
      message: '',
      type: '',
      target_audience: '',
      scheduled_at: '',
      status: true
    }
  })

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      await api.post(API_ENDPOINTS.NOTIFICATIONS, data)
      toast.success('Notification created successfully')
      navigate('/notifications')
    } catch (error) {
      console.error('Error creating notification:', error)
      toast.error(error.response?.data?.message || 'Failed to create notification')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate('/notifications')}
          sx={{ mr: 2 }}
        >
          Back
        </Button>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
          Add Notification
        </Typography>
      </Box>

      {/* Form */}
      <Paper sx={{ p: 3 }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextFieldComponent
                control={control}
                name="title"
                label="Title"
                type="text"
                
                error={errors.title}
                helperText={errors.title?.message}
              />
            </Grid>

            <Grid item xs={12}>
              <TextFieldComponent
                control={control}
                name="message"
                label="Message"
                type="text"
                multiline
                rows={4}
                error={errors.message}
                helperText={errors.message?.message}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <SelectFieldComponent
                control={control}
                name="type"
                label="Type"
                options={[{ value: 'info', label: 'Info' }, { value: 'success', label: 'Success' }, { value: 'warning', label: 'Warning' }, { value: 'error', label: 'Error' }]}
                error={errors.type}
                helperText={errors.type?.message}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <SelectFieldComponent
                control={control}
                name="target_audience"
                label="Target Audience"
                options={[{ value: 'all', label: 'All Users' }, { value: 'authors', label: 'Authors' }, { value: 'readers', label: 'Readers' }, { value: 'publishers', label: 'Publishers' }]}
                error={errors.target_audience}
                helperText={errors.target_audience?.message}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextFieldComponent
                control={control}
                name="scheduled_at"
                label="Scheduled At"
                type="datetime"
                
                error={errors.scheduled_at}
                helperText={errors.scheduled_at?.message}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <SwitchFieldComponent
                control={control}
                name="status"
                label="Status"
              />
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={<Save />}
                  disabled={loading}
                >
                  {loading ? 'Creating...' : 'Create Notification'}
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => reset()}
                >
                  Reset
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  )
}

export default AddNotification