# Fix: No Artifacts Showing on Frontend

## Problem
Backend is working correctly (returns JSON from root route), but frontend shows no artifacts at `/artifacts`.

## Root Cause
The database is empty - no artifacts have been seeded yet.

## Solution: Seed the Database

### Option 1: Seed Database Using Script (Recommended)

#### Step 1: Get Your Backend URL

Your backend URL is: `https://archaeology-api.onrender.com`

#### Step 2: Update Seed Script

1. Open `scripts/seed-artifacts.js`
2. Update the API_URL at the top:
   ```javascript
   const API_URL = process.env.API_URL || 'https://archaeology-api.onrender.com';
   ```

#### Step 3: Run Seed Script

```powershell
# Set API URL environment variable
$env:API_URL="https://archaeology-api.onrender.com"

# Run seed script
npm run seed
```

Or if you have a seed script in package.json:

```powershell
# Run directly
node scripts/seed-artifacts.js
```

#### Step 4: Verify Artifacts

1. **Test backend directly:**
   - Visit: `https://archaeology-api.onrender.com/api/artifacts`
   - Should return JSON array with artifacts (not empty `[]`)

2. **Test frontend:**
   - Visit: `https://archaeology-frontend.onrender.com/artifacts`
   - Should show artifacts in a grid

### Option 2: Add Artifacts via Frontend

#### Step 1: Login

1. Go to: `https://archaeology-frontend.onrender.com`
2. Click **"Sign In"**
3. Login with:
   - Username: `admin`
   - Password: `admin`

#### Step 2: Create a Catalog (if needed)

1. Click **"Catalogs"** in navigation
2. Click **"Add Catalog"**
3. Fill in catalog details
4. Click **"Create Catalog"**

#### Step 3: Add Artifact

1. Click **"Add Artifact"** in navigation
2. Fill in artifact details:
   - Name
   - Barcode
   - Details
   - Location Found
   - Date Found
   - Catalog (select from dropdown)
   - Dimensions (optional)
3. Click **"Create Artifact"**
4. Artifact should appear on `/artifacts` page

### Option 3: Verify Database Connection

#### Test Backend Endpoints

1. **Root URL:**
   - `https://archaeology-api.onrender.com/`
   - Should return JSON with API info ✅ (You confirmed this works)

2. **Artifacts endpoint:**
   - `https://archaeology-api.onrender.com/api/artifacts`
   - Should return: `[]` if empty, or array of artifacts if seeded

3. **Stats endpoint:**
   - `https://archaeology-api.onrender.com/api/stats`
   - Should return: `{"catalogCount": 0, "artifactCount": 0, ...}` if empty

#### Check Frontend Connection

1. Open browser console (F12)
2. Visit: `https://archaeology-frontend.onrender.com/artifacts`
3. Check console for:
   - `API URL configured: https://archaeology-api.onrender.com`
   - Any errors in console
   - Network tab - check if `/api/artifacts` request is successful

### Quick Test Commands

```powershell
# Test backend artifacts endpoint
curl https://archaeology-api.onrender.com/api/artifacts

# Test backend stats endpoint
curl https://archaeology-api.onrender.com/api/stats

# Seed database (if API_URL is set)
$env:API_URL="https://archaeology-api.onrender.com"; npm run seed
```

## Expected Results

### Before Seeding:
- Backend `/api/artifacts` returns: `[]`
- Frontend shows: "No artifacts found"
- Stats shows: `{"artifactCount": 0, ...}`

### After Seeding:
- Backend `/api/artifacts` returns: `[{...}, {...}, ...]`
- Frontend shows: Grid of artifacts
- Stats shows: `{"artifactCount": X, ...}` (where X > 0)

## Troubleshooting

### Issue: Seed script fails

**Check:**
1. Backend is running and accessible
2. API_URL is set correctly
3. Backend accepts POST requests to `/api/artifacts`
4. You're logged in (if auth is required)

**Solution:**
- Check backend logs in Render dashboard
- Verify API endpoint is accessible
- Test with curl command

### Issue: Frontend still shows no artifacts

**Check:**
1. Browser console for errors
2. Network tab for API requests
3. API URL is correct in console
4. CORS is configured correctly

**Solution:**
- Check browser console for errors
- Verify API requests are successful
- Check if artifacts exist in backend

### Issue: Can't add artifacts via frontend

**Check:**
1. You're logged in as admin or archaeologist
2. Backend accepts POST requests
3. CORS is configured correctly
4. Backend is accessible

**Solution:**
- Login with admin/archaeologist account
- Check backend logs for errors
- Verify CORS configuration

## Next Steps

1. ✅ **Seed database** using script or frontend
2. ✅ **Verify artifacts** exist in backend
3. ✅ **Test frontend** shows artifacts
4. ✅ **Add more artifacts** as needed

## Quick Checklist

- [ ] Backend is running (returns JSON from root route) ✅
- [ ] Frontend can connect to backend
- [ ] Database is seeded with artifacts
- [ ] Backend `/api/artifacts` returns artifacts (not empty `[]`)
- [ ] Frontend shows artifacts on `/artifacts` page
- [ ] Login works (if needed to add artifacts)

## Summary

The backend is working correctly, but the database is empty. You need to:
1. Seed the database using the seed script, OR
2. Add artifacts via the frontend (login as admin/archaeologist)

Once artifacts are in the database, they will appear on the frontend automatically.

