import { createTheme } from '@mui/material/styles'

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#705ec8',      // Laravel admin panel primary purple
      light: '#8a7bd8',
      dark: '#5b4ba0',
    },
    secondary: {
      main: '#45aaf2',      // Blue accent from Laravel admin
    },
    background: {
      default: '#f8f9fa',   // Light background matching Laravel
      paper: '#ffffff',
    },
    text: {
      primary: '#1a1630',   // Dark text from Laravel admin
      secondary: '#6c757d',
    },
    success: {
      main: '#2dce89',      // Green from Laravel admin
      light: '#15ca7c',
    },
    info: {
      main: '#45aaf2',      // Blue from Laravel admin
      light: '#2d9eef',
    },
    warning: {
      main: '#ffc107',
    },
    error: {
      main: '#f56565',
    },
  },
  typography: {
    fontFamily: '"Poppins", "Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontWeight: 600 },
    h2: { fontWeight: 600 },
    h3: { fontWeight: 600 },
    h4: { fontWeight: 600 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
  },
  components: {
    // Laravel-style Cards
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          borderRadius: 8,
          border: '1px solid #ebecf1',
        },
      },
    },
    MuiCardHeader: {
      styleOverrides: {
        root: {
          backgroundColor: '#f8f9fa',
          borderBottom: '1px solid #ebecf1',
          padding: '1rem 1.5rem',
        },
        title: {
          fontSize: '1.1rem',
          fontWeight: 600,
          color: '#1a1630',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 6,
          fontWeight: 500,
        },
        containedPrimary: {
          background: '#705ec8',
          '&:hover': {
            background: '#5b4ba0',
          },
        },
        containedSuccess: {
          background: '#2dce89',
          '&:hover': {
            background: '#15ca7c',
          },
        },
      },
    },
    MuiDataGrid: {
      styleOverrides: {
        root: {
          border: '1px solid #ebecf1',
          borderRadius: 8,
          '& .MuiDataGrid-cell': {
            borderBottom: '1px solid #ebecf1',
          },
          '& .MuiDataGrid-columnHeaders': {
            backgroundColor: '#f8f9fa',
            borderBottom: '2px solid #ebecf1',
            fontWeight: 600,
          },
        },
      },
    },
    // Laravel-style form fields
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 6,
            '& fieldset': {
              borderColor: '#ebecf1',
            },
            '&:hover fieldset': {
              borderColor: '#705ec8',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#705ec8',
            },
          },
        },
      },
    },
  },
})

export default theme

