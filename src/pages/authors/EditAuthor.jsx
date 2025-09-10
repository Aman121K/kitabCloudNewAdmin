import React, { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  Paper,
  Button,
  Grid,
  CircularProgress
} from '@mui/material'
import { ArrowBack, Save } from '@mui/icons-material'
import { useNavigate, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { api, API_ENDPOINTS } from '../../config/api'
import { toast } from 'react-toastify'
import { TextFieldComponent, SwitchFieldComponent, FileUploadComponent } from '../../components/common/FormField'

const schema = yup.object({
  name: yup.string().required('Author name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters'),
  phone: yup.string(),
  biography: yup.string(),
  status: yup.boolean()
})

const EditAuthor = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const [loading, setLoading] = useState(false)
  const [loadingAuthor, setLoadingAuthor] = useState(true)

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      phone: '',
      biography: '',
      status: true
    }
  })

  useEffect(() => {
    fetchAuthor()
  }, [id])

  const fetchAuthor = async () => {
    try {
      const response = await api.get(`/authors/${id}`)
      const author = response.data
      
      Object.keys(author).forEach(key => {
        if (key !== 'password') {
          setValue(key, author[key])
        }
      })
    } catch (error) {
      console.error('Error fetching author:', error)
      toast.error('Failed to fetch author details')
      navigate('/authors')
    } finally {
      setLoadingAuthor(false)
    }
  }

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      if (!data.password) {
        delete data.password
      }
      
      await api.put(`/authors/${id}`, data)
      toast.success('Author updated successfully')
      navigate('/authors')
    } catch (error) {
      console.error('Error updating author:', error)
      toast.error(error.response?.data?.message || 'Failed to update author')
    } finally {
      setLoading(false)
    }
  }

  if (loadingAuthor) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate('/authors')}
          sx={{ mr: 2 }}
        >
          Back
        </Button>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
          Edit Author
        </Typography>
      </Box>

      {/* Form */}
      <Paper sx={{ p: 3 }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextFieldComponent
                control={control}
                name="name"
                label="Author Name"
                error={errors.name}
                helperText={errors.name?.message}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextFieldComponent
                control={control}
                name="email"
                label="Email"
                type="email"
                error={errors.email}
                helperText={errors.email?.message}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextFieldComponent
                control={control}
                name="password"
                label="Password (leave empty to keep current)"
                type="password"
                error={errors.password}
                helperText={errors.password?.message}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextFieldComponent
                control={control}
                name="phone"
                label="Phone"
                error={errors.phone}
                helperText={errors.phone?.message}
              />
            </Grid>

            <Grid item xs={12}>
              <TextFieldComponent
                control={control}
                name="biography"
                label="Biography"
                multiline
                rows={4}
                error={errors.biography}
                helperText={errors.biography?.message}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FileUploadComponent
                control={control}
                name="profile_image"
                label="Upload Profile Image"
                accept="image/*"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <SwitchFieldComponent
                control={control}
                name="status"
                label="Active Status"
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
                  {loading ? 'Updating...' : 'Update Author'}
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/authors')}
                >
                  Cancel
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  )
}

export default EditAuthor
