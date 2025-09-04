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
import axios from 'axios'
import { toast } from 'react-toastify'
import { 
  TextFieldComponent, 
  SelectFieldComponent, 
  SwitchFieldComponent, 
  FileUploadComponent 
} from '../../components/common/FormField'

const schema = yup.object({
  name: yup.string().required('name is required'),
  email: yup.string().email('Invalid email').required('email is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('password is required'),
  phone: yup.string(),
  address: yup.string(),
  website: yup.string(),
  status: yup.boolean()
})

const AddPublisher = () => {
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
      name: '',
      email: '',
      password: '',
      phone: '',
      address: '',
      website: '',
      status: true
    }
  })

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      await axios.post('/api/publishers', data)
      toast.success('Publisher created successfully')
      navigate('/publishers')
    } catch (error) {
      console.error('Error creating publisher:', error)
      toast.error(error.response?.data?.message || 'Failed to create publisher')
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
          onClick={() => navigate('/publishers')}
          sx={{ mr: 2 }}
        >
          Back
        </Button>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
          Add Publisher
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
                label="Name"
                type="text"
                
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
                label="Password"
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
                type="text"
                
                error={errors.phone}
                helperText={errors.phone?.message}
              />
            </Grid>

            <Grid item xs={12}>
              <TextFieldComponent
                control={control}
                name="address"
                label="Address"
                type="text"
                multiline
                rows={4}
                error={errors.address}
                helperText={errors.address?.message}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextFieldComponent
                control={control}
                name="website"
                label="Website"
                type="text"
                
                error={errors.website}
                helperText={errors.website?.message}
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
                  {loading ? 'Creating...' : 'Create Publisher'}
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

export default AddPublisher