#!/usr/bin/env node

/**
 * Page Generator for KitabCloud React Admin Panel
 * 
 * This script generates CRUD pages for various entities following the established patterns.
 * Run with: node generate-pages.js
 */

const fs = require('fs')
const path = require('path')

// Entity configurations
const entities = [
  {
    name: 'Reader',
    path: 'readers',
    fields: [
      { name: 'name', type: 'text', required: true },
      { name: 'email', type: 'email', required: true },
      { name: 'password', type: 'password', required: true },
      { name: 'phone', type: 'text' },
      { name: 'biography', type: 'textarea' },
      { name: 'status', type: 'switch', default: true }
    ],
    columns: [
      { field: 'id', headerName: 'ID', width: 70 },
      { field: 'name', headerName: 'Reader Name', width: 200 },
      { field: 'email', headerName: 'Email', width: 250 },
      { field: 'phone', headerName: 'Phone', width: 150 },
      { field: 'created_at', headerName: 'Created At', width: 150, type: 'date' },
      { field: 'status', headerName: 'Status', width: 120, type: 'status' }
    ]
  },
  {
    name: 'Publisher',
    path: 'publishers',
    fields: [
      { name: 'name', type: 'text', required: true },
      { name: 'email', type: 'email', required: true },
      { name: 'password', type: 'password', required: true },
      { name: 'phone', type: 'text' },
      { name: 'address', type: 'textarea' },
      { name: 'website', type: 'text' },
      { name: 'status', type: 'switch', default: true }
    ],
    columns: [
      { field: 'id', headerName: 'ID', width: 70 },
      { field: 'name', headerName: 'Publisher Name', width: 200 },
      { field: 'email', headerName: 'Email', width: 250 },
      { field: 'website', headerName: 'Website', width: 200 },
      { field: 'created_at', headerName: 'Created At', width: 150, type: 'date' },
      { field: 'status', headerName: 'Status', width: 120, type: 'status' }
    ]
  },
  {
    name: 'Language',
    path: 'languages',
    fields: [
      { name: 'name', type: 'text', required: true },
      { name: 'code', type: 'text', required: true },
      { name: 'native_name', type: 'text' },
      { name: 'status', type: 'switch', default: true }
    ],
    columns: [
      { field: 'id', headerName: 'ID', width: 70 },
      { field: 'name', headerName: 'Language Name', width: 200 },
      { field: 'code', headerName: 'Language Code', width: 120 },
      { field: 'native_name', headerName: 'Native Name', width: 200 },
      { field: 'created_at', headerName: 'Created At', width: 150, type: 'date' },
      { field: 'status', headerName: 'Status', width: 120, type: 'status' }
    ]
  },
  {
    name: 'Tag',
    path: 'tags',
    fields: [
      { name: 'name', type: 'text', required: true },
      { name: 'description', type: 'textarea' },
      { name: 'color', type: 'text' },
      { name: 'status', type: 'switch', default: true }
    ],
    columns: [
      { field: 'id', headerName: 'ID', width: 70 },
      { field: 'name', headerName: 'Tag Name', width: 200 },
      { field: 'description', headerName: 'Description', width: 300 },
      { field: 'color', headerName: 'Color', width: 100 },
      { field: 'created_at', headerName: 'Created At', width: 150, type: 'date' },
      { field: 'status', headerName: 'Status', width: 120, type: 'status' }
    ]
  },
  {
    name: 'Video',
    path: 'videos',
    fields: [
      { name: 'title', type: 'text', required: true },
      { name: 'description', type: 'textarea' },
      { name: 'video_url', type: 'text' },
      { name: 'thumbnail', type: 'file', accept: 'image/*' },
      { name: 'duration', type: 'text' },
      { name: 'status', type: 'switch', default: true }
    ],
    columns: [
      { field: 'id', headerName: 'ID', width: 70 },
      { field: 'title', headerName: 'Video Title', width: 200 },
      { field: 'duration', headerName: 'Duration', width: 120 },
      { field: 'video_url', headerName: 'URL', width: 250 },
      { field: 'created_at', headerName: 'Created At', width: 150, type: 'date' },
      { field: 'status', headerName: 'Status', width: 120, type: 'status' }
    ]
  },
  {
    name: 'Podcast',
    path: 'podcasts',
    fields: [
      { name: 'name', type: 'text', required: true },
      { name: 'description', type: 'textarea' },
      { name: 'cover_image', type: 'file', accept: 'image/*' },
      { name: 'author_id', type: 'select', relation: 'authors' },
      { name: 'status', type: 'switch', default: true }
    ],
    columns: [
      { field: 'id', headerName: 'ID', width: 70 },
      { field: 'name', headerName: 'Podcast Name', width: 200 },
      { field: 'author', headerName: 'Author', width: 150, relation: 'author.name' },
      { field: 'created_at', headerName: 'Created At', width: 150, type: 'date' },
      { field: 'status', headerName: 'Status', width: 120, type: 'status' }
    ]
  },
  {
    name: 'Notification',
    path: 'notifications',
    fields: [
      { name: 'title', type: 'text', required: true },
      { name: 'message', type: 'textarea', required: true },
      { name: 'type', type: 'select', options: [
        { value: 'info', label: 'Info' },
        { value: 'success', label: 'Success' },
        { value: 'warning', label: 'Warning' },
        { value: 'error', label: 'Error' }
      ]},
      { name: 'target_audience', type: 'select', options: [
        { value: 'all', label: 'All Users' },
        { value: 'authors', label: 'Authors' },
        { value: 'readers', label: 'Readers' },
        { value: 'publishers', label: 'Publishers' }
      ]},
      { name: 'scheduled_at', type: 'datetime' },
      { name: 'status', type: 'switch', default: true }
    ],
    columns: [
      { field: 'id', headerName: 'ID', width: 70 },
      { field: 'title', headerName: 'Title', width: 200 },
      { field: 'type', headerName: 'Type', width: 100 },
      { field: 'target_audience', headerName: 'Target', width: 150 },
      { field: 'scheduled_at', headerName: 'Scheduled', width: 150, type: 'date' },
      { field: 'status', headerName: 'Status', width: 120, type: 'status' }
    ]
  }
]

// Template generators
const generateListPage = (entity) => {
  const columns = entity.columns.map(col => {
    let render = ''
    if (col.type === 'date') {
      render = `renderCell: (params) => (
        new Date(params.value).toLocaleDateString()
      )`
    } else if (col.type === 'status') {
      render = `renderCell: (params) => <StatusChip status={params.value} />`
    } else if (col.relation) {
      render = `renderCell: (params) => params.row.${col.relation} || 'N/A'`
    }

    return `    {
      field: '${col.field}',
      headerName: '${col.headerName}',
      width: ${col.width},${render ? '\n      ' + render : ''}
    }`
  }).join(',\n')

  return `import React, { useState, useEffect } from 'react'
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

const ${entity.name}Management = () => {
  const navigate = useNavigate()
  const [${entity.path}, set${entity.name}s] = useState([])
  const [loading, setLoading] = useState(false)

  const columns = [
${columns}
  ]

  useEffect(() => {
    fetch${entity.name}s()
  }, [])

  const fetch${entity.name}s = async () => {
    setLoading(true)
    try {
      const response = await axios.get('/api/${entity.path}')
      set${entity.name}s(response.data.data || response.data)
    } catch (error) {
      console.error('Error fetching ${entity.path}:', error)
      toast.error('Failed to fetch ${entity.path}')
    } finally {
      setLoading(false)
    }
  }

  const handleAdd = () => {
    navigate('/${entity.path}/add')
  }

  const handleEdit = (${entity.name.toLowerCase()}) => {
    navigate(\`/${entity.path}/edit/\${${entity.name.toLowerCase()}.id}\`)
  }

  const handleDelete = async (${entity.name.toLowerCase()}) => {
    try {
      await axios.delete(\`/api/${entity.path}/\${${entity.name.toLowerCase()}.id}\`)
      await fetch${entity.name}s()
      return Promise.resolve()
    } catch (error) {
      console.error('Error deleting ${entity.name.toLowerCase()}:', error)
      return Promise.reject(error)
    }
  }

  const handleToggleStatus = async (${entity.name.toLowerCase()}Id, newStatus) => {
    try {
      await axios.post(\`/api/${entity.path}/\${${entity.name.toLowerCase()}Id}/status\`, { status: newStatus })
      await fetch${entity.name}s()
      return Promise.resolve()
    } catch (error) {
      console.error('Error updating ${entity.name.toLowerCase()} status:', error)
      return Promise.reject(error)
    }
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
            ${entity.name} Management
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage all ${entity.path} in the system
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleAdd}
        >
          Add ${entity.name}
        </Button>
      </Box>

      {/* Data Table */}
      <Paper sx={{ p: 2 }}>
        <DataTable
          rows={${entity.path}}
          columns={columns}
          loading={loading}
          onAdd={handleAdd}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onToggleStatus={handleToggleStatus}
          title="${entity.name}"
        />
      </Paper>
    </Box>
  )
}

export default ${entity.name}Management`
}

const generateAddPage = (entity) => {
  const schemaFields = entity.fields.map(field => {
    if (field.required) {
      if (field.type === 'email') {
        return `  ${field.name}: yup.string().email('Invalid email').required('${field.name.replace('_', ' ')} is required')`
      } else if (field.type === 'password') {
        return `  ${field.name}: yup.string().min(6, 'Password must be at least 6 characters').required('${field.name.replace('_', ' ')} is required')`
      } else {
        return `  ${field.name}: yup.string().required('${field.name.replace('_', ' ')} is required')`
      }
    } else {
      return `  ${field.name}: yup.${field.type === 'switch' ? 'boolean' : 'string'}()`
    }
  }).join(',\n')

  const defaultValues = entity.fields.map(field => {
    const value = field.default !== undefined ? field.default : (field.type === 'switch' ? 'true' : "''")
    return `      ${field.name}: ${value}`
  }).join(',\n')

  const formFields = entity.fields.map((field, index) => {
    let component = ''
    const gridSize = field.type === 'textarea' ? 'xs={12}' : 'xs={12} md={6}'
    
    if (field.type === 'switch') {
      component = `              <SwitchFieldComponent
                control={control}
                name="${field.name}"
                label="${field.name.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}"
              />`
    } else if (field.type === 'file') {
      component = `              <FileUploadComponent
                control={control}
                name="${field.name}"
                label="Upload ${field.name.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}"
                accept="${field.accept || '*/*'}"
              />`
    } else if (field.type === 'select') {
      if (field.options) {
        const options = field.options.map(opt => `{ value: '${opt.value}', label: '${opt.label}' }`).join(', ')
        component = `              <SelectFieldComponent
                control={control}
                name="${field.name}"
                label="${field.name.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}"
                options={[${options}]}
                error={errors.${field.name}}
                helperText={errors.${field.name}?.message}
              />`
      } else {
        component = `              <SelectFieldComponent
                control={control}
                name="${field.name}"
                label="${field.name.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}"
                options={${field.relation}Options}
                error={errors.${field.name}}
                helperText={errors.${field.name}?.message}
              />`
      }
    } else {
      component = `              <TextFieldComponent
                control={control}
                name="${field.name}"
                label="${field.name.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}"
                type="${field.type === 'textarea' ? 'text' : field.type}"
                ${field.type === 'textarea' ? 'multiline\n                rows={4}' : ''}
                error={errors.${field.name}}
                helperText={errors.${field.name}?.message}
              />`
    }

    return `            <Grid item ${gridSize}>
${component}
            </Grid>`
  }).join('\n\n')

  return `import React, { useState } from 'react'
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
${schemaFields}
})

const Add${entity.name} = () => {
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
${defaultValues}
    }
  })

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      await axios.post('/api/${entity.path}', data)
      toast.success('${entity.name} created successfully')
      navigate('/${entity.path}')
    } catch (error) {
      console.error('Error creating ${entity.name.toLowerCase()}:', error)
      toast.error(error.response?.data?.message || 'Failed to create ${entity.name.toLowerCase()}')
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
          onClick={() => navigate('/${entity.path}')}
          sx={{ mr: 2 }}
        >
          Back
        </Button>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
          Add ${entity.name}
        </Typography>
      </Box>

      {/* Form */}
      <Paper sx={{ p: 3 }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3}>
${formFields}

            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={<Save />}
                  disabled={loading}
                >
                  {loading ? 'Creating...' : 'Create ${entity.name}'}
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

export default Add${entity.name}`
}

// Create directories and files
const createPages = () => {
  console.log('🚀 Generating React Admin Panel Pages...\n')

  entities.forEach(entity => {
    const dirPath = path.join(__dirname, 'src', 'pages', entity.path)
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true })
    }

    // Generate List page
    const listPage = generateListPage(entity)
    fs.writeFileSync(path.join(dirPath, `${entity.name}Management.jsx`), listPage)
    
    // Generate Add page
    const addPage = generateAddPage(entity)
    fs.writeFileSync(path.join(dirPath, `Add${entity.name}.jsx`), addPage)
    
    console.log(`✅ Generated ${entity.name} Management pages`)
  })

  console.log('\n🎉 All pages generated successfully!')
  console.log('\n📝 Next steps:')
  console.log('1. Review the generated pages')
  console.log('2. Customize field validations as needed')
  console.log('3. Add Edit pages following the same pattern')
  console.log('4. Test with your backend API')
  console.log('5. Add additional features like bulk operations')
}

// Run the generator
createPages()
