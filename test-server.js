/**
 * Test script to verify server-static.js will work correctly
 * Run: node test-server.js
 */

const path = require('path');
const fs = require('fs');

console.log('Testing server-static.js configuration...\n');

// Test 1: Check if express is available
console.log('1. Checking Express dependency...');
try {
  const express = require('express');
  console.log('   ✓ Express is available\n');
} catch (error) {
  console.log('   ✗ Express not found. Run: npm install express\n');
  process.exit(1);
}

// Test 2: Check if build directory structure is correct
console.log('2. Checking build directory structure...');
const buildDir = path.join(__dirname, 'build');
const indexFile = path.join(buildDir, 'index.html');

if (!fs.existsSync(buildDir)) {
  console.log(`   ⚠ Build directory not found at: ${buildDir}`);
  console.log('   This is expected if you haven\'t run "npm run build" yet');
  console.log('   The server will check this at startup\n');
} else {
  console.log(`   ✓ Build directory exists: ${buildDir}`);
  
  if (fs.existsSync(indexFile)) {
    console.log(`   ✓ index.html exists: ${indexFile}`);
  } else {
    console.log(`   ✗ index.html not found: ${indexFile}`);
    console.log('   Run: npm run build\n');
  }
  
  // Check for static assets
  const staticDir = path.join(buildDir, 'static');
  if (fs.existsSync(staticDir)) {
    console.log(`   ✓ static directory exists: ${staticDir}`);
  } else {
    console.log(`   ⚠ static directory not found (will be created on build)`);
  }
  console.log('');
}

// Test 3: Verify server-static.js syntax
console.log('3. Checking server-static.js syntax...');
try {
  const serverCode = fs.readFileSync(path.join(__dirname, 'server-static.js'), 'utf8');
  
  // Basic syntax check
  new Function(serverCode);
  console.log('   ✓ server-static.js has valid syntax\n');
  
  // Check for required components
  if (serverCode.includes('express.static')) {
    console.log('   ✓ Uses express.static for serving files');
  }
  if (serverCode.includes('app.get(\'*\'')) {
    console.log('   ✓ Has catch-all route for React Router');
  }
  if (serverCode.includes('0.0.0.0')) {
    console.log('   ✓ Listens on 0.0.0.0 (required for Render)\n');
  }
} catch (error) {
  console.log(`   ✗ Error reading server-static.js: ${error.message}\n`);
}

// Test 4: Check render.yaml configuration
console.log('4. Checking render.yaml configuration...');
try {
  const renderYaml = fs.readFileSync(path.join(__dirname, 'render.yaml'), 'utf8');
  
  if (renderYaml.includes('type: web')) {
    console.log('   ✓ Frontend is configured as web service (not static)');
  }
  if (renderYaml.includes('node server-static.js')) {
    console.log('   ✓ Start command uses server-static.js');
  }
  if (renderYaml.includes('npm run build')) {
    console.log('   ✓ Build command is correct');
  }
  console.log('');
} catch (error) {
  console.log(`   ⚠ Could not read render.yaml: ${error.message}\n`);
}

// Test 5: Verify package.json
console.log('5. Checking package.json...');
try {
  const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, 'package.json'), 'utf8'));
  
  if (packageJson.dependencies && packageJson.dependencies.express) {
    console.log(`   ✓ Express is in dependencies: ${packageJson.dependencies.express}`);
  } else {
    console.log('   ✗ Express not found in dependencies');
  }
  console.log('');
} catch (error) {
  console.log(`   ✗ Error reading package.json: ${error.message}\n`);
}

console.log('Testing complete!');
console.log('\nTo test locally:');
console.log('  1. Run: npm run build');
console.log('  2. Run: node server-static.js');
console.log('  3. Open: http://localhost:3000');
console.log('  4. Try navigating to: http://localhost:3000/artifact/test123?barcode=TEST123');

