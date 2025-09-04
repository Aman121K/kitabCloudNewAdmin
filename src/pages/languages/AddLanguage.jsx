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
  code: yup.string().required('code is required'),
  native_name: yup.string(),
  status: yup.boolean()
})

const AddLanguage = () => {
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
      code: '',
      native_name: '',
      status: true
    }
  })

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      await axios.post('/api/languages', data)
      toast.success('Language created successfully')
      navigate('/languages')
    } catch (error) {
      console.error('Error creating language:', error)
      toast.error(error.response?.data?.message || 'Failed to create language')
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
          onClick={() => navigate('/languages')}
          sx={{ mr: 2 }}
        >
          Back
        </Button>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
          Add Language
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
                name="code"
                label="Code"
                type="text"
                
                error={errors.code}
                helperText={errors.code?.message}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextFieldComponent
                control={control}
                name="native_name"
                label="Native Name"
                type="text"
                
                error={errors.native_name}
                helperText={errors.native_name?.message}
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
                  {loading ? 'Creating...' : 'Create Language'}
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

export default AddLanguage