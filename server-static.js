const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;
const BUILD_DIR = path.join(__dirname, 'build');
const INDEX_FILE = path.join(BUILD_DIR, 'index.html');

// Verify build directory exists
if (!fs.existsSync(BUILD_DIR)) {
  console.error(`ERROR: Build directory not found at ${BUILD_DIR}`);
  console.error('Please run "npm run build" first');
  process.exit(1);
}

if (!fs.existsSync(INDEX_FILE)) {
  console.error(`ERROR: index.html not found at ${INDEX_FILE}`);
  console.error('Please run "npm run build" first');
  process.exit(1);
}

// Serve static files from the React app build directory
// This must come before the catch-all route
app.use(express.static(BUILD_DIR, {
  // Don't send index.html for static file requests
  index: false,
  // Set cache headers for static assets
  maxAge: '1y',
  etag: true,
  lastModified: true
}));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Handle React routing - return all requests to React app
// This catch-all must be last to allow static files to be served first
// express.static above will handle all static files (JS, CSS, images, etc.)
// This route only catches routes that don't match static files
app.get('*', (req, res) => {
  res.sendFile(INDEX_FILE, (err) => {
    if (err) {
      console.error('Error sending index.html:', err);
      res.status(500).send('Internal server error');
    }
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Static file server running on port ${PORT}`);
  console.log(`Serving files from: ${BUILD_DIR}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});

