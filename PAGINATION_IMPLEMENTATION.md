# Pagination Implementation Guide

## Overview

I've successfully implemented server-side pagination for all listing APIs in your React admin panel. This ensures better performance and user experience when dealing with large datasets.

## Changes Made

### 1. API Configuration Updates (`src/config/api.js`)

#### New Helper Functions Added:
```javascript
// Build paginated endpoint with page and limit parameters
export const buildPaginatedEndpoint = (baseEndpoint, page = 1, limit = 10) => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString()
  })
  return `${baseEndpoint}?${params.toString()}`
}

// Build search endpoint with pagination
export const buildSearchEndpoint = (baseEndpoint, searchTerm = '', page = 1, limit = 10) => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString()
  })
  
  if (searchTerm) {
    params.append('search', searchTerm)
  }
  
  return `${baseEndpoint}?${params.toString()}`
}
```

### 2. DataTable Component Updates (`src/components/common/DataTable.jsx`)

#### New Props Added:
- `totalRows`: Total number of rows for server-side pagination
- `onPaginationChange`: Callback function when pagination changes
- `serverSidePagination`: Boolean to enable server-side pagination

#### Key Features:
- Server-side pagination mode
- Automatic page size options (10, 25, 50, 100)
- Pagination state management
- Seamless integration with MUI DataGrid

### 3. Management Pages Updates

All management pages now include:

#### State Management:
```javascript
const [items, setItems] = useState([])
const [pagination, setPagination] = useState({
  page: 1,
  limit: 10,
  total: 0,
  totalPages: 0
})
const [loading, setLoading] = useState(false)
```

#### Paginated Fetch Function:
```javascript
const fetchItems = async (page = 1, limit = 10) => {
  setLoading(true)
  try {
    const response = await api.get(buildPaginatedEndpoint(API_ENDPOINTS.ITEMS, page, limit))
    const data = response.data
    
    setItems(data.data || data.items || [])
    setPagination({
      page: data.current_page || data.page || page,
      limit: data.per_page || data.limit || limit,
      total: data.total || data.total_count || 0,
      totalPages: data.last_page || data.total_pages || Math.ceil((data.total || 0) / (data.per_page || limit))
    })
  } catch (error) {
    console.error('Error fetching items:', error)
    toast.error('Failed to fetch items')
  } finally {
    setLoading(false)
  }
}
```

#### Pagination Change Handler:
```javascript
const handlePaginationChange = (page, limit) => {
  fetchItems(page, limit)
}
```

#### Updated DataTable Usage:
```javascript
<DataTable
  rows={items}
  columns={columns}
  loading={loading}
  onEdit={handleEdit}
  onDelete={handleDelete}
  onToggleStatus={handleToggleStatus}
  title="Item"
  pageSize={pagination.limit}
  totalRows={pagination.total}
  onPaginationChange={handlePaginationChange}
  serverSidePagination={true}
/>
```

## Updated Files

### Management Pages (12 files):
1. `src/pages/users/UserManagement.jsx`
2. `src/pages/categories/CategoryManagement.jsx`
3. `src/pages/subcategories/SubCategoryManagement.jsx`
4. `src/pages/authors/AuthorManagement.jsx`
5. `src/pages/readers/ReaderManagement.jsx`
6. `src/pages/publishers/PublisherManagement.jsx`
7. `src/pages/languages/LanguageManagement.jsx`
8. `src/pages/books/BookManagement.jsx`
9. `src/pages/videos/VideoManagement.jsx`
10. `src/pages/tags/TagManagement.jsx`
11. `src/pages/notifications/NotificationManagement.jsx`
12. `src/pages/podcasts/PodcastManagement.jsx`

### Core Components:
- `src/config/api.js` - API configuration and helper functions
- `src/components/common/DataTable.jsx` - Enhanced DataTable component
- `src/pages/Dashboard.jsx` - Updated imports

## API Request Format

All listing APIs now send requests in this format:
```
GET /admin/users?page=1&limit=10
GET /admin/categories?page=2&limit=25
GET /admin/authors?page=1&limit=50&search=john
```

## Expected Backend Response Format

Your backend should return data in this format:
```json
{
  "data": [
    // Array of items
  ],
  "current_page": 1,
  "per_page": 10,
  "total": 100,
  "last_page": 10,
  "from": 1,
  "to": 10
}
```

### Alternative Response Formats Supported:
```json
// Laravel-style pagination
{
  "data": [...],
  "current_page": 1,
  "per_page": 10,
  "total": 100,
  "last_page": 10
}

// Simple pagination
{
  "items": [...],
  "page": 1,
  "limit": 10,
  "total_count": 100,
  "total_pages": 10
}
```

## Benefits

1. **Performance**: Only loads data for current page
2. **Scalability**: Handles large datasets efficiently
3. **User Experience**: Faster loading times
4. **Memory Efficiency**: Reduced memory usage
5. **Network Optimization**: Smaller payload sizes

## Testing

To test the pagination:

1. **Start your backend server** on `http://localhost:3002`
2. **Start the React app**: `npm run dev`
3. **Navigate to any management page** (e.g., Users, Categories)
4. **Test pagination controls**:
   - Change page size (10, 25, 50, 100)
   - Navigate between pages
   - Verify data loads correctly
5. **Check network tab** to see pagination parameters in requests

## Backend Requirements

Your backend should handle these query parameters:
- `page`: Page number (1-based)
- `limit`: Number of items per page
- `search`: Optional search term

Example backend implementation:
```javascript
// Express.js example
app.get('/admin/users', (req, res) => {
  const { page = 1, limit = 10, search = '' } = req.query;
  
  // Your database query with pagination
  const offset = (page - 1) * limit;
  
  // Return paginated results
  res.json({
    data: users,
    current_page: parseInt(page),
    per_page: parseInt(limit),
    total: totalCount,
    last_page: Math.ceil(totalCount / limit)
  });
});
```

## Summary

✅ **Server-side pagination implemented** for all listing APIs
✅ **Page and limit parameters** added to all GET requests
✅ **DataTable component enhanced** with pagination support
✅ **12 management pages updated** with pagination logic
✅ **Flexible response format support** for different backend implementations
✅ **Performance optimized** for large datasets

Your React admin panel now efficiently handles pagination for all data listings!
