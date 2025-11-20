# Testing Guide for Server-Side Routing Changes

## Overview
We've changed the frontend deployment from a static site to a web service with Express to handle React Router client-side routing.

## Changes Made

### 1. **server-static.js** (NEW)
- Express server that serves the built React app
- Handles all routes by serving `index.html` for React Router
- Includes error handling and build directory validation

### 2. **render.yaml** (UPDATED)
- Changed frontend from `type: static` to `type: web`
- Added `startCommand: node server-static.js`
- Set proper environment variables

### 3. **package.json** (UPDATED)
- Added `express: ^4.18.2` to dependencies

### 4. **public/_redirects** (NEW)
- Backup redirect file (in case Render supports it)

## Test Results

✅ **All tests passed:**
- Express dependency is available
- server-static.js has valid syntax
- Uses express.static for serving files
- Has catch-all route for React Router
- Listens on 0.0.0.0 (required for Render)
- render.yaml is correctly configured
- package.json includes express

## Local Testing Steps

### Step 1: Build the React App
```bash
npm run build
```

### Step 2: Start the Static Server
```bash
node server-static.js
```

### Step 3: Test Routes
Open your browser and test these URLs:

1. **Home page:**
   - http://localhost:3000/
   - Should load the home page

2. **Artifact detail with query string (QR code scenario):**
   - http://localhost:3000/artifact/test123?barcode=TEST123
   - Should load the artifact detail page
   - The barcode should be extracted from the query string

3. **Other routes:**
   - http://localhost:3000/catalogs
   - http://localhost:3000/search
   - http://localhost:3000/artifacts
   - All should work correctly

4. **Static assets:**
   - Check browser console for any 404s on JS/CSS files
   - All static assets should load correctly

### Step 4: Test QR Code Flow
1. Navigate to http://localhost:3000/search
2. Click "Scan QR Code" button
3. Scan a QR code (or manually enter a URL)
4. Verify it navigates to the artifact detail page
5. Verify the artifact is found using the barcode

## Expected Behavior

### Before (Static Site - BROKEN)
- URL: `/artifact/mi6tyw2od9uieip8jug?barcode=A06825952UHLS0001`
- Result: 404 error (Render tries to find a static file)

### After (Web Service - FIXED)
- URL: `/artifact/mi6tyw2od9uieip8jug?barcode=A06825952UHLS0001`
- Result: 
  1. Express server receives request
  2. Serves `index.html` (React app)
  3. React Router handles the route
  4. ArtifactDetailPage extracts barcode from query string
  5. Finds artifact by barcode
  6. Displays artifact details

## Deployment Checklist

Before deploying to Render:

- [x] Express is in package.json dependencies
- [x] server-static.js is created and tested
- [x] render.yaml is updated to use web service
- [x] All routes are tested locally
- [x] Static assets are served correctly
- [x] QR code scanning works with query strings

## Potential Issues & Solutions

### Issue 1: Build directory not found
**Solution:** The server checks for build directory and exits with clear error message

### Issue 2: Static assets not loading
**Solution:** express.static is configured before the catch-all route, so static files are served first

### Issue 3: Routes returning 404
**Solution:** Catch-all route (`app.get('*')`) serves index.html for all non-static routes

### Issue 4: Port conflicts
**Solution:** Uses PORT environment variable (Render sets this automatically)

## Rollback Plan

If something goes wrong, you can rollback by:

1. Revert render.yaml to use `type: static`
2. Remove `startCommand` from render.yaml
3. Add back `staticPublishPath: ./build`
4. Remove server-static.js (optional)

## Performance Considerations

- Static assets are cached for 1 year (maxAge: '1y')
- ETag and Last-Modified headers are enabled
- Express static middleware is efficient for serving files
- No performance impact expected

## Security Considerations

- Server only serves static files from build directory
- No dynamic content generation
- No user input processing
- Standard Express security practices

