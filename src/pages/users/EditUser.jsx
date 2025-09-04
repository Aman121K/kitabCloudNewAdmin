import React, { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Grid,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  CircularProgress
} from '@mui/material'
import { ArrowBack, Save } from '@mui/icons-material'
import { useNavigate, useParams } from 'react-router-dom'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import axios from 'axios'
import { toast } from 'react-toastify'

const schema = yup.object({
  full_name: yup.string().required('Full name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters'),
  phone: yup.string(),
  country: yup.string(),
  role: yup.number().required('Role is required'),
  status: yup.boolean()
})

const EditUser = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const [loading, setLoading] = useState(false)
  const [loadingUser, setLoadingUser] = useState(true)
  const [countries, setCountries] = useState([])

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      full_name: '',
      email: '',
      password: '',
      phone: '',
      country: '',
      role: 2,
      status: true
    }
  })

  useEffect(() => {
    fetchUser()
    fetchCountries()
  }, [id])

  const fetchUser = async () => {
    try {
      const response = await axios.get(`/api/users/${id}`)
      const user = response.data
      
      // Set form values
      Object.keys(user).forEach(key => {
        if (key !== 'password') { // Don't set password for editing
          setValue(key, user[key])
        }
      })
    } catch (error) {
      console.error('Error fetching user:', error)
      toast.error('Failed to fetch user details')
      navigate('/users')
    } finally {
      setLoadingUser(false)
    }
  }

  const fetchCountries = async () => {
    try {
      const response = await axios.get('/api/countries')
      setCountries(response.data || [])
    } catch (error) {
      console.error('Error fetching countries:', error)
    }
  }

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      // Remove password if empty (don't update password)
      if (!data.password) {
        delete data.password
      }
      
      await axios.put(`/api/users/${id}`, data)
      toast.success('User updated successfully')
      navigate('/users')
    } catch (error) {
      console.error('Error updating user:', error)
      toast.error(error.response?.data?.message || 'Failed to update user')
    } finally {
      setLoading(false)
    }
  }

  if (loadingUser) {
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
          onClick={() => navigate('/users')}
          sx={{ mr: 2 }}
        >
          Back
        </Button>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
          Edit User
        </Typography>
      </Box>

      {/* Form */}
      <Paper sx={{ p: 3 }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Controller
                name="full_name"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Full Name"
                    error={!!errors.full_name}
                    helperText={errors.full_name?.message}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Email"
                    type="email"
                    error={!!errors.email}
                    helperText={errors.email?.message}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Controller
                name="password"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Password (leave empty to keep current)"
                    type="password"
                    error={!!errors.password}
                    helperText={errors.password?.message}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Controller
                name="phone"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Phone"
                    error={!!errors.phone}
                    helperText={errors.phone?.message}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Country</InputLabel>
                <Controller
                  name="country"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      label="Country"
                      error={!!errors.country}
                    >
                      {countries.map((country) => (
                        <MenuItem key={country.id} value={country.name}>
                          {country.name}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                />
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Role</InputLabel>
                <Controller
                  name="role"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      label="Role"
                      error={!!errors.role}
                    >
                      <MenuItem value={1}>Admin</MenuItem>
                      <MenuItem value={2}>User</MenuItem>
                    </Select>
                  )}
                />
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      label="Status"
                      error={!!errors.status}
                    >
                      <MenuItem value={true}>Active</MenuItem>
                      <MenuItem value={false}>Inactive</MenuItem>
                    </Select>
                  )}
                />
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={<Save />}
                  disabled={loading}
                >
                  {loading ? 'Updating...' : 'Update User'}
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/users')}
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

export default EditUser