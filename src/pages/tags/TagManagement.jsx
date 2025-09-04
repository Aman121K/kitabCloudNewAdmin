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

const TagManagement = () => {
  const navigate = useNavigate()
  const [tags, setTags] = useState([])
  const [loading, setLoading] = useState(false)

  const columns = [
    {
      field: 'id',
      headerName: 'ID',
      width: 70,
    },
    {
      field: 'name',
      headerName: 'Tag Name',
      width: 200,
    },
    {
      field: 'description',
      headerName: 'Description',
      width: 300,
    },
    {
      field: 'color',
      headerName: 'Color',
      width: 100,
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
    }
  ]

  useEffect(() => {
    fetchTags()
  }, [])

  const fetchTags = async () => {
    setLoading(true)
    try {
      const response = await axios.get('/api/tags')
      setTags(response.data.data || response.data)
    } catch (error) {
      console.error('Error fetching tags:', error)
      toast.error('Failed to fetch tags')
    } finally {
      setLoading(false)
    }
  }

  const handleAdd = () => {
    navigate('/tags/add')
  }

  const handleEdit = (tag) => {
    navigate(`/tags/edit/${tag.id}`)
  }

  const handleDelete = async (tag) => {
    try {
      await axios.delete(`/api/tags/${tag.id}`)
      await fetchTags()
      return Promise.resolve()
    } catch (error) {
      console.error('Error deleting tag:', error)
      return Promise.reject(error)
    }
  }

  const handleToggleStatus = async (tagId, newStatus) => {
    try {
      await axios.post(`/api/tags/${tagId}/status`, { status: newStatus })
      await fetchTags()
      return Promise.resolve()
    } catch (error) {
      console.error('Error updating tag status:', error)
      return Promise.reject(error)
    }
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
            Tag Management
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage all tags in the system
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleAdd}
        >
          Add Tag
        </Button>
      </Box>

      {/* Data Table */}
      <Paper sx={{ p: 2 }}>
        <DataTable
          rows={tags}
          columns={columns}
          loading={loading}
          onAdd={handleAdd}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onToggleStatus={handleToggleStatus}
          title="Tag"
        />
      </Paper>
    </Box>
  )
}

export default TagManagement