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
  description: yup.string(),
  video_url: yup.string(),
  thumbnail: yup.string(),
  duration: yup.string(),
  status: yup.boolean()
})

const AddVideo = () => {
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
      description: '',
      video_url: '',
      thumbnail: '',
      duration: '',
      status: true
    }
  })

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      await api.post(API_ENDPOINTS.VIDEOS, data)
      toast.success('Video created successfully')
      navigate('/videos')
    } catch (error) {
      console.error('Error creating video:', error)
      toast.error(error.response?.data?.message || 'Failed to create video')
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
          onClick={() => navigate('/videos')}
          sx={{ mr: 2 }}
        >
          Back
        </Button>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
          Add Video
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
                name="description"
                label="Description"
                type="text"
                multiline
                rows={4}
                error={errors.description}
                helperText={errors.description?.message}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextFieldComponent
                control={control}
                name="video_url"
                label="Video Url"
                type="text"
                
                error={errors.video_url}
                helperText={errors.video_url?.message}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FileUploadComponent
                control={control}
                name="thumbnail"
                label="Upload Thumbnail"
                accept="image/*"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextFieldComponent
                control={control}
                name="duration"
                label="Duration"
                type="text"
                
                error={errors.duration}
                helperText={errors.duration?.message}
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
                  {loading ? 'Creating...' : 'Create Video'}
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

export default AddVideo