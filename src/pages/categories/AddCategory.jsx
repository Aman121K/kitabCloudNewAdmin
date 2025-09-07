import React, { useState } from 'react'
import {
  Box,
  Typography,
  Card,
  CardHeader,
  CardContent,
  Button,
  Grid,
  TextField,
  InputLabel,
  styled
} from '@mui/material'
import { ArrowBack, Save } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { api, API_ENDPOINTS } from '../../config/api'
import { toast } from 'react-toastify'

const schema = yup.object({
  category_name: yup.string().required('Category name is required'),
  category_image: yup.mixed(),
  category_color: yup.string()
})

const UploadButton = styled('label')(({ theme }) => ({
  display: 'inline-block',
  padding: '8px 16px',
  backgroundColor: '#705ec8',
  color: 'white',
  borderRadius: '6px',
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: '#5b4ba0',
  },
}))

const AddCategory = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [imagePreview, setImagePreview] = useState(null)

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      category_name: '',
      category_image: null,
      category_color: '#705ec8'
    }
  })

  const handleImageChange = (event) => {
    const file = event.target.files[0]
    if (file) {
      setValue('category_image', file)
      const reader = new FileReader()
      reader.onload = (e) => setImagePreview(e.target.result)
      reader.readAsDataURL(file)
    }
  }

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('category_name', data.category_name)
      formData.append('category_color', data.category_color)
      if (data.category_image) {
        formData.append('category_image', data.category_image)
      }

      await api.post(API_ENDPOINTS.CATEGORIES, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      toast.success('Category created successfully')
      navigate('/categories')
    } catch (error) {
      console.error('Error creating category:', error)
      toast.error(error.response?.data?.message || 'Failed to create category')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box sx={{ p: 3 }}>
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
          Add Category
        </Typography>
      </Box>

      {/* Form Card - Laravel Style */}
      <Card>
        <CardHeader 
          title="Category Form"
          sx={{ 
            backgroundColor: '#f8f9fa',
            borderBottom: '1px solid #ebecf1'
          }}
        />
        <CardContent sx={{ p: 3 }}>
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Category Name - Laravel horizontal layout */}
            <Grid container spacing={2} sx={{ mb: 3, alignItems: 'center' }}>
              <Grid item xs={12} md={3}>
                <InputLabel sx={{ fontWeight: 500, color: 'text.primary' }}>
                  Category Name
                </InputLabel>
              </Grid>
              <Grid item xs={12} md={9}>
                <Controller
                  name="category_name"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      placeholder="Category Name"
                      error={!!errors.category_name}
                      helperText={errors.category_name?.message}
                      size="medium"
                    />
                  )}
                />
              </Grid>
            </Grid>

            {/* Category Image - Laravel style */}
            <Grid container spacing={2} sx={{ mb: 3, alignItems: 'center' }}>
              <Grid item xs={12} md={3}>
                <InputLabel sx={{ fontWeight: 500, color: 'text.primary' }}>
                  Category Image
                </InputLabel>
              </Grid>
              <Grid item xs={12} md={9}>
                <Box>
                  <input
                    type="file"
                    id="category_image"
                    style={{ display: 'none' }}
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                  <UploadButton htmlFor="category_image">
                    Choose Image
                  </UploadButton>
                  {imagePreview && (
                    <Box sx={{ mt: 2 }}>
                      <img
                        src={imagePreview}
                        alt="Preview"
                        style={{
                          width: '100px',
                          height: '100px',
                          objectFit: 'cover',
                          borderRadius: '8px',
                          border: '1px solid #ebecf1'
                        }}
                      />
                    </Box>
                  )}
                </Box>
              </Grid>
            </Grid>

            {/* Category Color - Laravel style */}
            <Grid container spacing={2} sx={{ mb: 4, alignItems: 'center' }}>
              <Grid item xs={12} md={3}>
                <InputLabel sx={{ fontWeight: 500, color: 'text.primary' }}>
                  Category Color
                </InputLabel>
              </Grid>
              <Grid item xs={12} md={9}>
                <Controller
                  name="category_color"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="color"
                      style={{
                        width: '60px',
                        height: '40px',
                        border: '1px solid #ebecf1',
                        borderRadius: '6px',
                        cursor: 'pointer'
                      }}
                    />
                  )}
                />
              </Grid>
            </Grid>

            {/* Submit Button - Laravel style */}
            <Grid container spacing={2}>
              <Grid item xs={12} md={3} />
              <Grid item xs={12} md={9}>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Button
                    type="submit"
                    variant="contained"
                    startIcon={<Save />}
                    disabled={loading}
                    sx={{ 
                      backgroundColor: '#705ec8',
                      '&:hover': { backgroundColor: '#5b4ba0' }
                    }}
                  >
                    {loading ? 'Creating...' : 'Submit'}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>
    </Box>
  )
}

export default AddCategory
