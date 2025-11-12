# Final Fix: 404 Error When Loading Artifacts

## Issue
Browser console shows:
```
artifacts:1 Failed to load resource: the server responded with a status of 404
```

## Root Cause
The frontend is trying to fetch from a relative URL (like `/artifacts`) instead of the full API URL (`https://archaeology-api.onrender.com/api/artifacts`).

This happens because:
1. React environment variables are replaced at **build time**
2. If `REACT_APP_API_URL` isn't set during build, the API_URL might be undefined
3. The fallback logic might not work correctly in all cases

## Solution Implemented

### 1. Runtime Configuration in index.html

Added a script in `public/index.html` that sets the API URL **before React loads**:

```html
<script>
  // Set API URL at runtime (before React loads)
  window.ARCHAEOLOGY_API_URL = 'https://archaeology-api.onrender.com';
  console.log('Runtime API URL configured:', window.ARCHAEOLOGY_API_URL);
</script>
```

This ensures the API URL is always available, even if the environment variable isn't set.

### 2. Improved API URL Detection

Updated `src/utils/api.ts` to check multiple sources:

1. **REACT_APP_API_URL** (build-time environment variable)
2. **window.ARCHAEOLOGY_API_URL** (runtime configuration from index.html)
3. **Runtime detection** (based on hostname)
4. **Hardcoded fallback** (always uses backend URL in production)

### 3. Better Error Handling

Added validation to ensure:
- API_URL is always set
- API_URL is always a full URL (starts with http:// or https://)
- Better error messages if API_URL is invalid

## Next Steps

### Step 1: Commit and Push Changes

The changes have been committed and pushed:
- ✅ Runtime configuration in `public/index.html`
- ✅ Improved API URL detection in `src/utils/api.ts`
- ✅ Better error handling and logging

### Step 2: Rebuild Frontend on Render

1. **Go to Render Dashboard:**
   - https://dashboard.render.com

2. **Click on `archaeology-frontend` service**

3. **Redeploy:**
   - Click "Manual Deploy" → "Deploy latest commit"
   - Wait 5-10 minutes for deployment

### Step 3: Verify After Deployment

After frontend redeploys:

1. **Visit your website:**
   - `https://archaeology-frontend.onrender.com/artifacts`

2. **Open browser console (F12):**
   - Should see: `Runtime API URL configured: https://archaeology-api.onrender.com`
   - Should see: `API URL configured: https://archaeology-api.onrender.com`
   - Should see: `Fetching artifacts from: https://archaeology-api.onrender.com/api/artifacts`
   - Should see: `Fetched artifacts: 11`
   - Should NOT see 404 errors

3. **Check Network tab:**
   - Should see request to: `https://archaeology-api.onrender.com/api/artifacts`
   - Status should be: 200 OK
   - Response should contain 11 artifacts

4. **Check artifacts page:**
   - Should show 11 artifacts in a grid
   - No "No artifacts found" message
   - Artifacts display correctly

## Expected Results

### After Deployment:

1. **Browser Console:**
   - ✅ `Runtime API URL configured: https://archaeology-api.onrender.com`
   - ✅ `API URL configured: https://archaeology-api.onrender.com`
   - ✅ `Fetching artifacts from: https://archaeology-api.onrender.com/api/artifacts`
   - ✅ `Fetched artifacts: 11`
   - ✅ No 404 errors

2. **Network Tab:**
   - ✅ Request to: `https://archaeology-api.onrender.com/api/artifacts`
   - ✅ Status: 200 OK
   - ✅ Response: JSON array with 11 artifacts

3. **Frontend:**
   - ✅ Shows 11 artifacts in a grid
   - ✅ Each artifact displays correctly
   - ✅ QR codes are visible
   - ✅ Artifacts are clickable

## Why This Works

### Runtime Configuration

By setting the API URL in `index.html` **before React loads**, we ensure:
1. The API URL is always available
2. It works even if the environment variable isn't set
3. It's available immediately when the page loads

### Multiple Fallbacks

The code now has multiple fallbacks:
1. Build-time environment variable (REACT_APP_API_URL)
2. Runtime window variable (ARCHAEOLOGY_API_URL)
3. Runtime hostname detection
4. Hardcoded production URL

This ensures the API URL is **always** set correctly.

## Summary

The fix ensures the frontend **always** uses the correct backend URL:
- ✅ Runtime configuration in index.html
- ✅ Multiple fallback mechanisms
- ✅ Better error handling
- ✅ Validation to ensure API_URL is correct

After redeploying the frontend, artifacts should appear correctly!

## Quick Checklist

- [ ] Changes committed and pushed
- [ ] Frontend rebuilt on Render (after deployment)
- [ ] Browser console shows correct API URL
- [ ] Network tab shows successful API requests
- [ ] Artifacts are showing on frontend
- [ ] No 404 errors

## Next Steps

1. **Wait for frontend to redeploy** (5-10 minutes)
2. **Visit:** `https://archaeology-frontend.onrender.com/artifacts`
3. **Check browser console** for API URL and fetch logs
4. **Verify artifacts are showing**

The fix is complete! After redeployment, artifacts should appear on the frontend. 🎉

