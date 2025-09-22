import React, { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  Paper
} from '@mui/material'
import { api, API_ENDPOINTS } from '../../config/api'
import { toast } from 'react-toastify'
import DataTable from '../../components/common/DataTable'

const FeedbackManagement = () => {
  const [feedback, setFeedback] = useState([])
  const [loading, setLoading] = useState(false)

  const columns = [
    {
      field: 'id',
      headerName: 'ID',
      width: 70,
    },
    {
      field: 'feedback',
      headerName: 'Feedback',
      width: 400,
      renderCell: (params) => (
        <Box sx={{ 
          maxWidth: 400, 
          overflow: 'hidden', 
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap'
        }}>
          {params.value}
        </Box>
      )
    },
    {
      field: 'timestamp',
      headerName: 'Date',
      width: 150,
      renderCell: (params) => (
        new Date(params.value).toLocaleDateString()
      )
    },
    {
      field: 'created_at',
      headerName: 'Created',
      width: 150,
      renderCell: (params) => (
        new Date(params.value).toLocaleDateString()
      )
    }
  ]

  useEffect(() => {
    fetchFeedback()
  }, [])

  const fetchFeedback = async () => {
    setLoading(true)
    try {
      const response = await api.get(API_ENDPOINTS.FEEDBACK)
      setFeedback(response.data.data || response.data)
    } catch (error) {
      console.error('Error fetching feedback:', error)
      toast.error('Failed to fetch feedback')
    } finally {
      setLoading(false)
    }
  }

  const handleView = (feedbackItem) => {
    // Show full feedback in a dialog or modal
    toast.info(`Feedback: ${feedbackItem.feedback}`)
  }

  const handleDelete = async (feedbackItem) => {
    try {
      await api.delete(`${API_ENDPOINTS.FEEDBACK}/${feedbackItem.id}`)
      await fetchFeedback()
      return Promise.resolve()
    } catch (error) {
      console.error('Error deleting feedback:', error)
      return Promise.reject(error)
    }
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
            Feedback Management
          </Typography>
          <Typography variant="body1" color="text.secondary">
            View and manage user feedback
          </Typography>
        </Box>
      </Box>

      {/* Data Table */}
      <Paper sx={{ p: 2 }}>
        <DataTable
          rows={feedback}
          columns={columns}
          loading={loading}
          onView={handleView}
          onDelete={handleDelete}
          title="Feedback"
        />
      </Paper>
    </Box>
  )
}

export default FeedbackManagement
