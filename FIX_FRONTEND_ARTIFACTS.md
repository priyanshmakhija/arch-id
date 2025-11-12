# Fix: Frontend Not Showing Artifacts

## Current Status

✅ **Backend has artifacts:** 11 artifacts confirmed
✅ **Seed script works:** Created 10 artifacts successfully
❌ **Frontend not showing artifacts:** Need to check why

## Issue

The frontend is not displaying artifacts even though they exist in the backend. This is likely because:
1. Frontend is not connecting to the backend (API URL issue)
2. Frontend is catching errors silently
3. Frontend needs to be rebuilt with correct API URL

## Solution

### Step 1: Check Browser Console

1. **Visit your website:**
   - `https://archaeology-frontend.onrender.com/artifacts`

2. **Open browser console (F12):**
   - Look for: `API URL configured: https://archaeology-api.onrender.com`
   - Look for: `Fetching artifacts from: https://archaeology-api.onrender.com/api/artifacts`
   - Look for: `Fetched artifacts: 11` (or number of artifacts)
   - Check for any errors in the console

3. **Check Network tab:**
   - Look for request to: `https://archaeology-api.onrender.com/api/artifacts`
   - Check if request is successful (status 200)
   - Check the response - should contain artifacts array

### Step 2: Set Frontend Environment Variable

1. **Go to Render Dashboard:**
   - https://dashboard.render.com

2. **Click on `archaeology-frontend` service**

3. **Go to "Environment" tab**

4. **Add/Update environment variable:**
   - **Key:** `REACT_APP_API_URL`
   - **Value:** `https://archaeology-api.onrender.com`
   - Click "Save Changes"

5. **Redeploy frontend:**
   - Frontend will automatically redeploy (takes 5-10 minutes)
   - Or manually redeploy: "Manual Deploy" → "Deploy latest commit"

### Step 3: Verify Frontend is Using Correct API URL

After frontend redeploys:

1. **Visit your website:**
   - `https://archaeology-frontend.onrender.com/artifacts`

2. **Open browser console (F12):**
   - Should see: `API URL configured: https://archaeology-api.onrender.com`
   - Should see: `Fetching artifacts from: https://archaeology-api.onrender.com/api/artifacts`
   - Should see: `Fetched artifacts: 11`
   - Should NOT see errors

3. **Check Network tab:**
   - Should see successful request to: `https://archaeology-api.onrender.com/api/artifacts`
   - Status should be: 200 OK
   - Response should contain 11 artifacts

### Step 4: Test Artifacts Page

After verifying the API URL:

1. **Visit artifacts page:**
   - `https://archaeology-frontend.onrender.com/artifacts`

2. **Expected result:**
   - Should show 11 artifacts in a grid
   - Each artifact should have:
     - Name
     - Details
     - QR code
     - Image placeholder (if no image)
   - Artifacts should be clickable

## Current Code Status

The frontend code has a fallback that should work automatically:

```typescript
const getApiUrl = (): string => {
  if (process.env.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL;
  }
  
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return 'http://localhost:4000';
  }
  
  // Production fallback
  return 'https://archaeology-api.onrender.com';
};
```

**This should work automatically**, but the frontend needs to be rebuilt if the environment variable wasn't set during the initial build.

## Debugging

### Check What's Happening

1. **Open browser console:**
   - Visit: `https://archaeology-frontend.onrender.com/artifacts`
   - Press F12
   - Look for console logs:
     - `API URL configured: ...`
     - `Fetching artifacts from: ...`
     - `Fetched artifacts: ...`
     - Any errors

2. **Check Network tab:**
   - Look for request to: `/api/artifacts`
   - Check status code
   - Check response body
   - Check for CORS errors

3. **Test backend directly:**
   - Visit: `https://archaeology-api.onrender.com/api/artifacts`
   - Should return JSON array with 11 artifacts

### Common Issues

#### Issue 1: API URL is wrong
**Symptoms:** Console shows wrong API URL (e.g., `localhost:4000`)
**Solution:** Set `REACT_APP_API_URL` environment variable in Render and rebuild

#### Issue 2: CORS Error
**Symptoms:** Browser console shows CORS error
**Solution:** Check backend CORS configuration (should allow all origins)

#### Issue 3: Connection Error
**Symptoms:** Browser console shows connection error
**Solution:** Verify backend is running and accessible

#### Issue 4: Empty Response
**Symptoms:** Network request succeeds but returns empty array
**Solution:** Verify artifacts exist in backend (they do - 11 artifacts)

## Quick Fix

### Option 1: Set Environment Variable (Recommended)

1. Render Dashboard → `archaeology-frontend` → Environment
2. Add: `REACT_APP_API_URL` = `https://archaeology-api.onrender.com`
3. Save and wait for redeploy (5-10 minutes)

### Option 2: Commit and Push Changes

I've added better logging to help debug. Commit and push:

```powershell
git add src/utils/api.ts src/pages/AllArtifactsPage.tsx
git commit -m "Add better logging to diagnose frontend artifact fetching issue"
git push origin main
```

Then redeploy frontend on Render.

## Expected Results

### After Fix:

1. **Browser Console:**
   - ✅ `API URL configured: https://archaeology-api.onrender.com`
   - ✅ `Fetching artifacts from: https://archaeology-api.onrender.com/api/artifacts`
   - ✅ `Fetched artifacts: 11`
   - ✅ No errors

2. **Network Tab:**
   - ✅ Request to: `https://archaeology-api.onrender.com/api/artifacts`
   - ✅ Status: 200 OK
   - ✅ Response: JSON array with 11 artifacts

3. **Frontend:**
   - ✅ Shows 11 artifacts in a grid
   - ✅ Each artifact displays correctly
   - ✅ QR codes are visible
   - ✅ Artifacts are clickable

## Summary

The backend is working correctly (11 artifacts exist). The frontend just needs to:
1. Connect to the correct backend URL
2. Fetch artifacts successfully
3. Display them in the UI

The frontend code has a fallback that should work automatically, but setting the environment variable explicitly is recommended for reliability.

After setting the environment variable and redeploying, artifacts should appear on the frontend!

