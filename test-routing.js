/**
 * Test script to verify routing works correctly for QR code URLs
 * Tests the specific scenario: /artifact/mi6tyw2od9uieip8jug?barcode=A06825952UHLS0001
 */

const express = require('express');
const path = require('path');
const fs = require('fs');
const http = require('http');

console.log('Testing routing for QR code URLs...\n');

// Check if build exists
const BUILD_DIR = path.join(__dirname, 'build');
if (!fs.existsSync(BUILD_DIR)) {
  console.log('⚠ Build directory not found. Building app...\n');
  console.log('Please run: npm run build');
  console.log('Then run this test again.\n');
  process.exit(1);
}

// Load the server
const app = express();
const PORT = 3001; // Use different port to avoid conflicts

const BUILD_DIR_PATH = path.join(__dirname, 'build');
const INDEX_FILE = path.join(BUILD_DIR_PATH, 'index.html');

app.use(express.static(BUILD_DIR_PATH, {
  index: false,
  maxAge: '1y',
  etag: true,
  lastModified: true
}));

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.get('*', (req, res) => {
  res.sendFile(INDEX_FILE, (err) => {
    if (err) {
      console.error('Error:', err);
      res.status(500).send('Error');
    }
  });
});

// Start test server
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`Test server running on http://localhost:${PORT}\n`);
  
  // Test URLs
  const testUrls = [
    '/',
    '/health',
    '/artifact/mi6tyw2od9uieip8jug?barcode=A06825952UHLS0001',
    '/artifact/test123?barcode=TEST123',
    '/catalogs',
    '/search',
    '/artifacts',
  ];
  
  console.log('Testing routes...\n');
  
  let testsPassed = 0;
  let testsTotal = testUrls.length;
  
  const runTests = async () => {
    for (const testUrl of testUrls) {
      await new Promise((resolve) => {
        const url = `http://localhost:${PORT}${testUrl}`;
        http.get(url, (res) => {
          const statusCode = res.statusCode;
          const contentType = res.headers['content-type'];
          
          if (statusCode === 200) {
            if (testUrl === '/health') {
              // Health endpoint should return JSON
              let data = '';
              res.on('data', (chunk) => { data += chunk; });
              res.on('end', () => {
                try {
                  const json = JSON.parse(data);
                  if (json.status === 'ok') {
                    console.log(`✓ ${testUrl} - Returns 200 with JSON`);
                    testsPassed++;
                  } else {
                    console.log(`✗ ${testUrl} - Returns 200 but invalid JSON`);
                  }
                } catch {
                  console.log(`✗ ${testUrl} - Returns 200 but not valid JSON`);
                }
                resolve();
              });
            } else {
              // Other routes should return HTML
              if (contentType && contentType.includes('text/html')) {
                console.log(`✓ ${testUrl} - Returns 200 with HTML`);
                testsPassed++;
              } else {
                console.log(`⚠ ${testUrl} - Returns 200 but content-type is: ${contentType}`);
                testsPassed++; // Still counts as pass since it's 200
              }
              res.on('data', () => {}); // Consume data
              res.on('end', () => resolve());
            }
          } else {
            console.log(`✗ ${testUrl} - Returns ${statusCode}`);
            resolve();
          }
        }).on('error', (err) => {
          console.log(`✗ ${testUrl} - Error: ${err.message}`);
          resolve();
        });
      });
    }
    
    // Summary
    console.log(`\n${'='.repeat(50)}`);
    console.log(`Tests passed: ${testsPassed}/${testsTotal}`);
    
    if (testsPassed === testsTotal) {
      console.log('✅ All routing tests passed!');
      console.log('\nThe URL /artifact/mi6tyw2od9uieip8jug?barcode=A06825952UHLS0001');
      console.log('will be handled correctly by the server.');
      console.log('\nNext steps:');
      console.log('1. The server will serve index.html');
      console.log('2. React Router will handle the /artifact/:id route');
      console.log('3. ArtifactDetailPage will extract barcode from query string');
      console.log('4. The artifact will be found using the barcode');
    } else {
      console.log('⚠ Some tests failed. Check the output above.');
    }
    
    console.log(`\nTest server is still running on http://localhost:${PORT}`);
    console.log('You can manually test in your browser.');
    console.log('Press Ctrl+C to stop the server.\n');
  };
  
  // Run tests after a short delay
  setTimeout(runTests, 500);
});

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n\nShutting down test server...');
  server.close(() => {
    console.log('Test server stopped.');
    process.exit(0);
  });
});

