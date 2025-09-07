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
import { TextFieldComponent, SelectFieldComponent, SwitchFieldComponent } from '../../components/common/FormField'

const schema = yup.object({
  name: yup.string().required('Sub category name is required'),
  category_id: yup.number().required('Category is required'),
  description: yup.string(),
  status: yup.boolean()
})

const EditSubCategory = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const [loading, setLoading] = useState(false)
  const [loadingSubCategory, setLoadingSubCategory] = useState(true)
  const [categories, setCategories] = useState([])

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: '',
      category_id: '',
      description: '',
      status: true
    }
  })

  useEffect(() => {
    fetchSubCategory()
    fetchCategories()
  }, [id])

  const fetchSubCategory = async () => {
    try {
      const response = await api.get(`/api/subcategories/${id}`)
      const subCategory = response.data
      
      Object.keys(subCategory).forEach(key => {
        setValue(key, subCategory[key])
      })
    } catch (error) {
      console.error('Error fetching sub category:', error)
      toast.error('Failed to fetch sub category details')
      navigate('/subcategories')
    } finally {
      setLoadingSubCategory(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await api.get(API_ENDPOINTS.CATEGORIES)
      setCategories(response.data.data || response.data)
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      await api.put(`/api/subcategories/${id}`, data)
      toast.success('Sub category updated successfully')
      navigate('/subcategories')
    } catch (error) {
      console.error('Error updating sub category:', error)
      toast.error(error.response?.data?.message || 'Failed to update sub category')
    } finally {
      setLoading(false)
    }
  }

  const categoryOptions = categories.map(category => ({
    value: category.id,
    label: category.category_name
  }))

  if (loadingSubCategory) {
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
          onClick={() => navigate('/subcategories')}
          sx={{ mr: 2 }}
        >
          Back
        </Button>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
          Edit Sub Category
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
                label="Sub Category Name"
                error={errors.name}
                helperText={errors.name?.message}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <SelectFieldComponent
                control={control}
                name="category_id"
                label="Category"
                options={categoryOptions}
                error={errors.category_id}
                helperText={errors.category_id?.message}
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
                  {loading ? 'Updating...' : 'Update Sub Category'}
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/subcategories')}
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

export default EditSubCategory
