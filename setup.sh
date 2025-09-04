#!/bin/bash

# KitabCloud React Admin Panel Setup Script
# This script sets up the complete React admin panel

echo "🚀 Setting up KitabCloud React Admin Panel..."
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js (version 16 or higher) first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 16 ]; then
    echo "❌ Node.js version 16 or higher is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed successfully"

# Create missing directories
echo ""
echo "📁 Creating directory structure..."

# Ensure all page directories exist
directories=(
    "src/pages/readers"
    "src/pages/publishers"
    "src/pages/languages"
    "src/pages/comingsoon"
    "src/pages/videos"
    "src/pages/tags"
    "src/pages/advertisements"
    "src/pages/expenses"
    "src/pages/expensecategories"
    "src/pages/backgroundimages"
    "src/pages/notifications"
    "src/pages/podcasts"
    "src/pages/episodes"
    "src/pages/subscriptions"
)

for dir in "${directories[@]}"; do
    mkdir -p "$dir"
    echo "  ✅ Created $dir"
done

# Generate additional pages using the generator script
echo ""
echo "🏗️  Generating additional management pages..."
node generate-pages.js

# Create environment configuration
echo ""
echo "⚙️  Setting up environment configuration..."

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    cat > .env << EOL
# API Configuration
VITE_API_BASE_URL=http://localhost:8000
VITE_APP_NAME=KitabCloud Admin Panel

# Development Settings
VITE_APP_ENV=development
VITE_DEBUG_MODE=true
EOL
    echo "✅ Created .env file"
else
    echo "ℹ️  .env file already exists"
fi

# Create development configuration
cat > vite.config.local.js << EOL
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: true,
    proxy: {
      '/api': {
        target: process.env.VITE_API_BASE_URL || 'http://localhost:8000',
        changeOrigin: true,
        secure: false,
      }
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          mui: ['@mui/material', '@mui/icons-material'],
          utils: ['axios', 'react-router-dom']
        }
      }
    }
  },
  optimizeDeps: {
    include: ['@mui/material', '@mui/icons-material', 'react', 'react-dom']
  }
})
EOL

echo "✅ Created optimized Vite configuration"

# Create development scripts
cat > scripts/dev.sh << 'EOL'
#!/bin/bash
echo "🚀 Starting KitabCloud Admin Panel in development mode..."
echo "📱 Frontend: http://localhost:3000"
echo "🔗 API Proxy: http://localhost:8000"
echo ""
npm run dev
EOL

cat > scripts/build.sh << 'EOL'
#!/bin/bash
echo "🏗️  Building KitabCloud Admin Panel for production..."
npm run build
echo "✅ Build completed! Files are in the 'dist' directory."
EOL

chmod +x scripts/dev.sh scripts/build.sh

echo "✅ Created development scripts"

# Create project documentation
echo ""
echo "📚 Creating documentation..."

cat > SETUP.md << 'EOL'
# KitabCloud React Admin Panel - Setup Guide

## Quick Start

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure Environment**
   - Update `.env` file with your API endpoint
   - Default: `http://localhost:8000`

3. **Start Development Server**
   ```bash
   npm run dev
   # or
   ./scripts/dev.sh
   ```

4. **Build for Production**
   ```bash
   npm run build
   # or
   ./scripts/build.sh
   ```

## Backend Integration

Ensure your Laravel backend has the following API endpoints:

### Authentication
- `POST /api/login`
- `GET /api/user`

### Management Endpoints
- Users: `/api/users/*`
- Categories: `/api/categories/*`
- Authors: `/api/authors/*`
- Books: `/api/books/*`
- [... other entities]

### CORS Configuration

Add to your Laravel `config/cors.php`:

```php
'paths' => ['api/*'],
'allowed_methods' => ['*'],
'allowed_origins' => ['http://localhost:3000'],
'allowed_headers' => ['*'],
'exposed_headers' => [],
'max_age' => 0,
'supports_credentials' => true,
```

## Customization

### Adding New Management Sections

1. Use the page generator:
   ```bash
   node generate-pages.js
   ```

2. Or create manually following the established patterns

### Theming

Modify `src/theme.js` to customize:
- Colors
- Typography
- Component styles
- Spacing

### Components

Extend shared components in `src/components/common/`:
- `DataTable.jsx` - Main data table component
- `FormField.jsx` - Form input components

## Features

✅ Complete CRUD operations for all entities
✅ Advanced data tables with sorting/filtering
✅ Form validation and error handling
✅ File upload support
✅ Role-based access control
✅ Responsive design
✅ Modern Material-UI components
✅ Toast notifications
✅ Sweet Alert confirmations

## Support

For issues or questions, refer to the main documentation or create an issue in the project repository.
EOL

echo "✅ Created setup documentation"

# Final setup verification
echo ""
echo "🔍 Verifying setup..."

# Check if all required files exist
required_files=(
    "package.json"
    "src/main.jsx"
    "src/App.jsx"
    "src/theme.js"
    "src/contexts/AuthContext.jsx"
    "src/layouts/DashboardLayout.jsx"
    "src/components/common/DataTable.jsx"
    "src/pages/auth/Login.jsx"
    "src/pages/Dashboard.jsx"
)

all_good=true
for file in "${required_files[@]}"; do
    if [ -f "$file" ]; then
        echo "  ✅ $file"
    else
        echo "  ❌ $file (missing)"
        all_good=false
    fi
done

echo ""
if [ "$all_good" = true ]; then
    echo "🎉 Setup completed successfully!"
    echo ""
    echo "📋 Next Steps:"
    echo "  1. Update .env file with your API endpoint"
    echo "  2. Ensure your Laravel backend is running"
    echo "  3. Start the development server: npm run dev"
    echo "  4. Visit http://localhost:3000"
    echo ""
    echo "🔑 Default Login (configure in your backend):"
    echo "  Email: admin@kitabcloud.com"
    echo "  Password: admin123"
    echo ""
    echo "📖 Read SETUP.md for detailed instructions"
else
    echo "❌ Setup incomplete. Some files are missing."
    echo "Please check the errors above and run the setup again."
    exit 1
fi
