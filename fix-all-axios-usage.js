const fs = require('fs');
const path = require('path');

// Files to fix (excluding config/api.js and generate-pages.js)
const filesToFix = [
  'src/pages/categories/EditCategory.jsx',
  'src/pages/languages/AddLanguage.jsx',
  'src/pages/notifications/AddNotification.jsx',
  'src/pages/podcasts/AddPodcast.jsx',
  'src/pages/publishers/AddPublisher.jsx',
  'src/pages/readers/AddReader.jsx',
  'src/pages/readers/EditReader.jsx',
  'src/pages/roles/RolePermissionManagement.jsx',
  'src/pages/subcategories/AddSubCategory.jsx',
  'src/pages/subcategories/EditSubCategory.jsx',
  'src/pages/tags/AddTag.jsx',
  'src/pages/users/AddUser.jsx',
  'src/pages/videos/AddVideo.jsx',
  'src/pages/users/EditUser.jsx',
  'src/pages/categories/AddCategory.jsx',
  'src/pages/authors/EditAuthor.jsx',
  'src/pages/authors/AddAuthor.jsx'
];

// API endpoint mappings
const apiMappings = {
  '/api/categories': 'API_ENDPOINTS.CATEGORIES',
  '/api/subcategories': 'API_ENDPOINTS.SUBCATEGORIES',
  '/api/authors': 'API_ENDPOINTS.AUTHORS',
  '/api/readers': 'API_ENDPOINTS.READERS',
  '/api/publishers': 'API_ENDPOINTS.PUBLISHERS',
  '/api/languages': 'API_ENDPOINTS.LANGUAGES',
  '/api/books': 'API_ENDPOINTS.BOOKS',
  '/api/videos': 'API_ENDPOINTS.VIDEOS',
  '/api/tags': 'API_ENDPOINTS.TAGS',
  '/api/notifications': 'API_ENDPOINTS.NOTIFICATIONS',
  '/api/podcasts': 'API_ENDPOINTS.PODCASTS',
  '/api/users': 'API_ENDPOINTS.USERS',
  '/api/countries': 'API_ENDPOINTS.COUNTRIES',
  '/api/roles': 'API_ENDPOINTS.ROLES',
  '/api/permissions': 'API_ENDPOINTS.PERMISSIONS',
  '/api/role-permissions': 'API_ENDPOINTS.ROLE_PERMISSIONS'
};

function fixAxiosUsage(filePath) {
  try {
    if (!fs.existsSync(filePath)) {
      console.log(`File not found: ${filePath}`);
      return;
    }

    let content = fs.readFileSync(filePath, 'utf8');
    let updated = false;

    // Fix import statement
    if (content.includes("import axios from 'axios'")) {
      // Determine the correct import path based on file location
      const depth = filePath.split('/').length - 3; // Calculate depth from src/
      const importPath = '../'.repeat(depth) + 'config/api';
      
      content = content.replace(
        "import axios from 'axios'",
        `import { api, API_ENDPOINTS } from '${importPath}'`
      );
      updated = true;
      console.log(`Fixed import in: ${filePath}`);
    }

    // Fix axios calls to use api
    if (content.includes('axios.')) {
      content = content.replace(/axios\.(get|post|put|delete|patch)/g, 'api.$1');
      updated = true;
      console.log(`Fixed axios calls in: ${filePath}`);
    }

    // Fix API endpoints
    Object.entries(apiMappings).forEach(([oldEndpoint, newEndpoint]) => {
      const regex = new RegExp(`'${oldEndpoint.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}'`, 'g');
      if (content.includes(`'${oldEndpoint}'`)) {
        content = content.replace(regex, newEndpoint);
        updated = true;
        console.log(`Fixed endpoint ${oldEndpoint} in: ${filePath}`);
      }
    });

    // Fix dynamic endpoints (like /api/users/${id})
    Object.entries(apiMappings).forEach(([oldEndpoint, newEndpoint]) => {
      const baseEndpoint = oldEndpoint.replace('/api/', '');
      const regex = new RegExp(`'${oldEndpoint.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}/\\$\\{([^}]+)\\}`, 'g');
      if (content.includes(`'${oldEndpoint}/$`)) {
        content = content.replace(regex, `${newEndpoint} + '/$1'`);
        updated = true;
        console.log(`Fixed dynamic endpoint ${oldEndpoint} in: ${filePath}`);
      }
    });

    if (updated) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Updated: ${filePath}`);
    } else {
      console.log(`✅ No changes needed: ${filePath}`);
    }
  } catch (error) {
    console.error(`❌ Error updating ${filePath}:`, error.message);
  }
}

console.log('Fixing ALL axios usage to use configured BASE_URL...');
console.log('=====================================');

filesToFix.forEach(fixAxiosUsage);

console.log('=====================================');
console.log('All axios usage fix complete!');
console.log('');
console.log('Now ALL API calls will use: http://localhost:3002/api');
