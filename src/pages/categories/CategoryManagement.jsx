import React, { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  Card,
  CardHeader,
  CardContent,
  Button,
  Avatar
} from '@mui/material'
import { Add, CheckCircle } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { api, API_ENDPOINTS } from '../../config/api'
import { toast } from 'react-toastify'
import DataTable from '../../components/common/DataTable'

const CategoryManagement = () => {
  const navigate = useNavigate()
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)

  // Columns matching Laravel exactly
  const columns = [
    {
      field: 'id',
      headerName: 'Sr No',
      width: 70,
    },
    {
      field: 'category_name',
      headerName: 'Category Name',
      width: 200,
      flex: 1,
    },
    {
      field: 'category_image',
      headerName: 'Category Image',
      width: 150,
      renderCell: (params) => (
        params.value ? (
          <Avatar
            src={params.value}
            sx={{ width: 50, height: 50 }}
            variant="rounded"
          />
        ) : (
          <Avatar sx={{ width: 50, height: 50 }} variant="rounded">
            No Image
          </Avatar>
        )
      )
    },
    {
      field: 'category_color',
      headerName: 'Category Color',
      width: 150,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box
            sx={{
              width: 30,
              height: 30,
              backgroundColor: params.value || '#ccc',
              borderRadius: 1,
              border: '1px solid #ccc'
            }}
          />
          <Typography variant="body2">{params.value}</Typography>
        </Box>
      )
    }
  ]

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    setLoading(true)
    try {
      const response = await api.get(API_ENDPOINTS.CATEGORIES)
      setCategories(response.data.data || response.data)
    } catch (error) {
      console.error('Error fetching categories:', error)
      toast.error('Failed to fetch categories')
    } finally {
      setLoading(false)
    }
  }

  const handleAdd = () => {
    navigate('/categories/add')
  }

  const handleEdit = (category) => {
    navigate(`/categories/edit/${category.id}`)
  }

  const handleDelete = async (category) => {
    try {
      await api.delete(`/admin/categories/${category.id}`)
      await fetchCategories()
      return Promise.resolve()
    } catch (error) {
      console.error('Error deleting category:', error)
      return Promise.reject(error)
    }
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Laravel-style Card */}
      <Card>
        <CardHeader
          title="Category List"
          action={
            <Button
              variant="contained"
              startIcon={<Add />}
              endIcon={<CheckCircle />}
              onClick={handleAdd}
              sx={{
                backgroundColor: '#2dce89',
                '&:hover': { backgroundColor: '#15ca7c' }
              }}
            >
              Add Category
            </Button>
          }
          sx={{
            backgroundColor: '#f8f9fa',
            borderBottom: '1px solid #ebecf1'
          }}
        />
        <CardContent>
          <DataTable
            rows={categories}
            columns={columns}
            loading={loading}
            onEdit={handleEdit}
            onDelete={handleDelete}
            title="Category"
            pageSize={10}
          />
        </CardContent>
      </Card>
    </Box>
  )
}

export default CategoryManagement
