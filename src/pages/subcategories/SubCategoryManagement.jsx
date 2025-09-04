import React, { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  Paper,
  Button
} from '@mui/material'
import { Add } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'
import DataTable, { StatusChip } from '../../components/common/DataTable'

const SubCategoryManagement = () => {
  const navigate = useNavigate()
  const [subCategories, setSubCategories] = useState([])
  const [loading, setLoading] = useState(false)

  const columns = [
    {
      field: 'id',
      headerName: 'ID',
      width: 70,
    },
    {
      field: 'name',
      headerName: 'Sub Category Name',
      width: 200,
    },
    {
      field: 'category',
      headerName: 'Category',
      width: 150,
      renderCell: (params) => params.row.category?.category_name || 'N/A'
    },
    {
      field: 'description',
      headerName: 'Description',
      width: 300,
    },
    {
      field: 'created_at',
      headerName: 'Created At',
      width: 150,
      renderCell: (params) => (
        new Date(params.value).toLocaleDateString()
      )
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 120,
      renderCell: (params) => <StatusChip status={params.value} />
    },
  ]

  useEffect(() => {
    fetchSubCategories()
  }, [])

  const fetchSubCategories = async () => {
    setLoading(true)
    try {
      const response = await axios.get('/api/subcategories')
      setSubCategories(response.data.data || response.data)
    } catch (error) {
      console.error('Error fetching sub categories:', error)
      toast.error('Failed to fetch sub categories')
    } finally {
      setLoading(false)
    }
  }

  const handleAdd = () => {
    navigate('/subcategories/add')
  }

  const handleEdit = (subCategory) => {
    navigate(`/subcategories/edit/${subCategory.id}`)
  }

  const handleDelete = async (subCategory) => {
    try {
      await axios.delete(`/api/subcategories/${subCategory.id}`)
      await fetchSubCategories()
      return Promise.resolve()
    } catch (error) {
      console.error('Error deleting sub category:', error)
      return Promise.reject(error)
    }
  }

  const handleToggleStatus = async (subCategoryId, newStatus) => {
    try {
      await axios.post(`/api/subcategories/${subCategoryId}/status`, { status: newStatus })
      await fetchSubCategories()
      return Promise.resolve()
    } catch (error) {
      console.error('Error updating sub category status:', error)
      return Promise.reject(error)
    }
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
            Sub Category Management
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage all sub categories in the system
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleAdd}
        >
          Add Sub Category
        </Button>
      </Box>

      {/* Data Table */}
      <Paper sx={{ p: 2 }}>
        <DataTable
          rows={subCategories}
          columns={columns}
          loading={loading}
          onAdd={handleAdd}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onToggleStatus={handleToggleStatus}
          title="Sub Category"
        />
      </Paper>
    </Box>
  )
}

export default SubCategoryManagement
