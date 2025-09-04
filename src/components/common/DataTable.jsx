import React, { useState } from 'react'
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarExport,
  GridToolbarDensitySelector
} from '@mui/x-data-grid'
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Chip,
  IconButton,
  Switch
} from '@mui/material'
import {
  Add,
  Edit,
  Delete,
  Visibility
} from '@mui/icons-material'
import Swal from 'sweetalert2'
import { toast } from 'react-toastify'

const CustomToolbar = ({ onAdd, title }) => (
  <GridToolbarContainer>
    <GridToolbarColumnsButton />
    <GridToolbarFilterButton />
    <GridToolbarDensitySelector />
    <GridToolbarExport />
    {onAdd && (
      <Button
        startIcon={<Add />}
        onClick={onAdd}
        sx={{ ml: 'auto' }}
      >
        Add {title}
      </Button>
    )}
  </GridToolbarContainer>
)

const StatusChip = ({ status }) => (
  <Chip
    label={status ? 'Active' : 'Inactive'}
    color={status ? 'success' : 'error'}
    size="small"
  />
)

const ActionButtons = ({ row, onEdit, onDelete, onView, onToggleStatus }) => (
  <Box sx={{ display: 'flex', gap: 1 }}>
    {onView && (
      <IconButton size="small" onClick={() => onView(row)} color="primary">
        <Visibility />
      </IconButton>
    )}
    {onEdit && (
      <IconButton size="small" onClick={() => onEdit(row)} color="primary">
        <Edit />
      </IconButton>
    )}
    {onToggleStatus && (
      <Switch
        checked={row.status}
        onChange={(e) => onToggleStatus(row.id, e.target.checked)}
        size="small"
      />
    )}
    {onDelete && (
      <IconButton size="small" onClick={() => onDelete(row)} color="error">
        <Delete />
      </IconButton>
    )}
  </Box>
)

const DataTable = ({
  rows,
  columns,
  loading = false,
  onAdd,
  onEdit,
  onDelete,
  onView,
  onToggleStatus,
  title = 'Item',
  pageSize = 10,
  ...props
}) => {
  const [paginationModel, setPaginationModel] = useState({
    pageSize,
    page: 0,
  })

  const handleDelete = async (row) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `You want to delete this ${title.toLowerCase()}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d32f2f',
      cancelButtonColor: '#1976d2',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    })

    if (result.isConfirmed && onDelete) {
      try {
        await onDelete(row)
        toast.success(`${title} deleted successfully`)
      } catch (error) {
        toast.error(`Failed to delete ${title.toLowerCase()}`)
      }
    }
  }

  const handleToggleStatus = async (id, newStatus) => {
    if (onToggleStatus) {
      try {
        await onToggleStatus(id, newStatus)
        toast.success('Status updated successfully')
      } catch (error) {
        toast.error('Failed to update status')
      }
    }
  }

  // Add action column if any action is provided
  const columnsWithActions = [
    ...columns,
    ...(onEdit || onDelete || onView || onToggleStatus ? [{
      field: 'actions',
      headerName: 'Actions',
      width: 200,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <ActionButtons
          row={params.row}
          onEdit={onEdit}
          onDelete={onDelete ? () => handleDelete(params.row) : null}
          onView={onView}
          onToggleStatus={onToggleStatus ? handleToggleStatus : null}
        />
      )
    }] : [])
  ]

  return (
    <Box sx={{ height: 600, width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columnsWithActions}
        loading={loading}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        pageSizeOptions={[10, 25, 50, 100]}
        checkboxSelection={false}
        disableRowSelectionOnClick
        slots={{
          toolbar: CustomToolbar,
        }}
        slotProps={{
          toolbar: {
            onAdd,
            title
          },
        }}
        sx={{
          '& .MuiDataGrid-cell': {
            borderBottom: '1px solid #f0f0f0',
          },
          '& .MuiDataGrid-columnHeaders': {
            backgroundColor: '#fafafa',
            borderBottom: '2px solid #e0e0e0',
          },
        }}
        {...props}
      />
    </Box>
  )
}

export { StatusChip, ActionButtons }
export default DataTable
