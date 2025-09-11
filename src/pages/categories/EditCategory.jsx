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
import { TextFieldComponent, SwitchFieldComponent } from '../../components/common/FormField'

const schema = yup.object({
  category_name: yup.string().required('Category name is required'),
  description: yup.string(),
  status: yup.boolean()
})

const EditCategory = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const [loading, setLoading] = useState(false)
  const [loadingCategory, setLoadingCategory] = useState(true)

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      category_name: '',
      description: '',
      status: true
    }
  })

  useEffect(() => {
    fetchCategory()
  }, [id])

  const fetchCategory = async () => {
    try {
      const response = await api.get(`/admin/categories/${id}`)
      // Extract category data from nested response structure
      const category = response.data.data || response.data
      
      console.log('Fetched category data:', category) // Debug log
      
      // Set form values with proper field mapping
      const formData = {
        category_name: category.category_name || '',
        description: category.description || '',
        status: category.status === 1 ? true : false
      }
      
      // Set each form field
      Object.keys(formData).forEach(key => {
        setValue(key, formData[key])
      })
      
    } catch (error) {
      console.error('Error fetching category:', error)
      toast.error('Failed to fetch category details')
      navigate('/categories')
    } finally {
      setLoadingCategory(false)
    }
  }

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      await api.put(`/admin/categories/${id}`, data)
      toast.success('Category updated successfully')
      navigate('/categories')
    } catch (error) {
      console.error('Error updating category:', error)
      toast.error(error.response?.data?.message || 'Failed to update category')
    } finally {
      setLoading(false)
    }
  }

  if (loadingCategory) {
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
          onClick={() => navigate('/categories')}
          sx={{ mr: 2 }}
        >
          Back
        </Button>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
          Edit Category
        </Typography>
      </Box>

      {/* Form */}
      <Paper sx={{ p: 3 }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextFieldComponent
                control={control}
                name="category_name"
                label="Category Name"
                error={errors.category_name}
                helperText={errors.category_name?.message}
              />
            </Grid>

            <Grid item xs={12}>
              <TextFieldComponent
                control={control}
                name="description"
                label="Description"
                multiline
                rows={4}
                error={errors.description}
                helperText={errors.description?.message}
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
                  {loading ? 'Updating...' : 'Update Category'}
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/categories')}
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

export default EditCategory
