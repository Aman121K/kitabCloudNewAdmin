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
  description: yup.string(),
  color: yup.string(),
  status: yup.boolean()
})

const AddTag = () => {
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
      description: '',
      color: '',
      status: true
    }
  })

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      await axios.post('/api/tags', data)
      toast.success('Tag created successfully')
      navigate('/tags')
    } catch (error) {
      console.error('Error creating tag:', error)
      toast.error(error.response?.data?.message || 'Failed to create tag')
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
          onClick={() => navigate('/tags')}
          sx={{ mr: 2 }}
        >
          Back
        </Button>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
          Add Tag
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
                name="color"
                label="Color"
                type="text"
                
                error={errors.color}
                helperText={errors.color?.message}
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
                  {loading ? 'Creating...' : 'Create Tag'}
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

export default AddTag