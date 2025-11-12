# Quick Guide: Seed Database with Artifacts

## Problem
Your backend is working correctly (returns JSON), but no artifacts are showing on the frontend because the database is empty.

## Solution: Seed the Database

### Step 1: Update Seed Script

The seed script is already updated to use your backend URL: `https://archaeology-api.onrender.com`

### Step 2: Run Seed Script

Open PowerShell in your project directory and run:

```powershell
# Navigate to project directory
cd C:\Users\vinit\archaeology-catalog

# Run seed script (it will use the backend URL automatically)
npm run seed
```

Or set the API URL explicitly:

```powershell
$env:API_URL="https://archaeology-api.onrender.com"; npm run seed
```

### Step 3: Verify Artifacts Were Created

1. **Test backend directly:**
   - Visit: `https://archaeology-api.onrender.com/api/artifacts`
   - Should return JSON array with artifacts (not empty `[]`)

2. **Test frontend:**
   - Visit: `https://archaeology-frontend.onrender.com/artifacts`
   - Should show artifacts in a grid

### Step 4: Check Browser Console

1. Open browser console (F12)
2. Visit: `https://archaeology-frontend.onrender.com/artifacts`
3. Check console for:
   - `API URL configured: https://archaeology-api.onrender.com`
   - Any errors
   - Network tab - check if `/api/artifacts` request succeeded

## Alternative: Add Artifacts via Frontend

### Step 1: Login

1. Go to: `https://archaeology-frontend.onrender.com`
2. Click **"Sign In"**
3. Login with:
   - Username: `admin`
   - Password: `admin`

### Step 2: Create a Catalog

1. Click **"Catalogs"** in navigation
2. Click **"Add Catalog"** (if no catalogs exist)
3. Fill in catalog details:
   - Name: "Main Catalog"
   - Description: "Main archaeology catalog"
4. Click **"Create Catalog"**

### Step 3: Add Artifact

1. Click **"Add Artifact"** in navigation
2. Fill in artifact details:
   - Name: "Test Artifact"
   - Barcode: "TEST001"
   - Details: "Test artifact description"
   - Location Found: "Test Site"
   - Date Found: "2024-01-01"
   - Catalog: Select from dropdown
   - Dimensions (optional):
     - Length: "10 cm"
     - Height/Depth: "5 cm"
     - Width: "3 cm"
3. Click **"Create Artifact"**
4. Artifact should appear on `/artifacts` page

## Troubleshooting

### Issue: Seed script fails with "Failed to create catalog"

**Solution:**
- Check if backend is accessible
- Verify API URL is correct
- Check backend logs in Render dashboard

### Issue: Seed script fails with "Failed to create artifact"

**Solution:**
- Check if catalog was created successfully
- Verify backend accepts POST requests
- Check backend logs for errors
- Make sure you're using the correct backend URL

### Issue: Frontend still shows no artifacts after seeding

**Check:**
1. Backend has artifacts:
   - Visit: `https://archaeology-api.onrender.com/api/artifacts`
   - Should return array with artifacts

2. Frontend can connect to backend:
   - Open browser console
   - Check for errors
   - Verify API URL is correct

3. Browser cache:
   - Hard refresh: Ctrl+F5
   - Or clear browser cache

## Expected Results

### After Seeding:

1. **Backend:**
   - `https://archaeology-api.onrender.com/api/artifacts` returns array of artifacts
   - `https://archaeology-api.onrender.com/api/stats` shows artifact count > 0

2. **Frontend:**
   - `https://archaeology-frontend.onrender.com/artifacts` shows grid of artifacts
   - Each artifact displays with image, name, details, QR code

## Quick Test Commands

```powershell
# Test backend artifacts endpoint
curl https://archaeology-api.onrender.com/api/artifacts

# Test backend stats endpoint
curl https://archaeology-api.onrender.com/api/stats

# Seed database
npm run seed
```

## Summary

Your backend is working correctly! The issue is that the database is empty. 

**To fix:**
1. Run `npm run seed` to seed the database with test artifacts
2. Verify artifacts were created by checking the backend endpoint
3. Refresh the frontend to see artifacts

Once artifacts are in the database, they will appear on the frontend automatically.

