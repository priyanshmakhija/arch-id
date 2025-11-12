# Fix: 404 Error When Loading Artifacts

## Issue
Browser console shows:
```
artifacts:1 Failed to load resource: the server responded with a status of 404
```

## Root Cause
The frontend is trying to fetch from a relative URL (like `/artifacts`) instead of the full API URL (`https://archaeology-api.onrender.com/api/artifacts`).

This happens because:
1. React environment variables are replaced at **build time**, not runtime
2. If `REACT_APP_API_URL` isn't set during build, it becomes `undefined` in the compiled code
3. The fallback logic might not work correctly in the compiled code
4. The frontend needs to be **rebuilt** with the correct API URL

## Solution

### Step 1: Set Frontend Environment Variable in Render

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

### Step 2: Verify Frontend is Rebuilt

After deployment:

1. **Visit your website:**
   - `https://archaeology-frontend.onrender.com/artifacts`

2. **Open browser console (F12):**
   - Should see: `API URL configured: https://archaeology-api.onrender.com`
   - Should see: `Environment REACT_APP_API_URL: https://archaeology-api.onrender.com`
   - Should see: `Fetching artifacts from: https://archaeology-api.onrender.com/api/artifacts`
   - Should NOT see 404 errors

### Step 3: Check Network Tab

1. **Open browser console (F12)**
2. **Go to Network tab**
3. **Refresh the page**
4. **Look for request to:**
   - `https://archaeology-api.onrender.com/api/artifacts`
   - Should be status: 200 OK
   - Should return JSON array with artifacts

## Why This Happens

### React Environment Variables

React environment variables (like `REACT_APP_API_URL`) are replaced at **build time**, not runtime:

1. **During build:** `process.env.REACT_APP_API_URL` is replaced with the actual value
2. **If not set:** It becomes `undefined` in the compiled code
3. **Runtime fallback:** The fallback code might not work correctly if the variable is `undefined`

### Solution

**Option 1: Set Environment Variable (Recommended)**
- Set `REACT_APP_API_URL` in Render dashboard
- Rebuild frontend
- Environment variable will be baked into the build

**Option 2: Use Runtime Configuration**
- Create a config file that's loaded at runtime
- Or use window variables
- But React apps work best with build-time variables

## Current Code

The code has a fallback that should work:

```typescript
const getApiUrl = (): string => {
  const envApiUrl = process.env.REACT_APP_API_URL;
  
  if (envApiUrl && envApiUrl.trim() !== '') {
    return envApiUrl.trim();
  }
  
  const hostname = window.location.hostname;
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return 'http://localhost:4000';
  }
  
  // Production fallback
  return 'https://archaeology-api.onrender.com';
};
```

**But** if `process.env.REACT_APP_API_URL` is `undefined` in the compiled code, the fallback should still work. The issue might be that the frontend was built before this code was added, or the fallback isn't working as expected.

## Quick Fix

### Option 1: Set Environment Variable and Rebuild (Recommended)

1. Render Dashboard → `archaeology-frontend` → Environment
2. Add: `REACT_APP_API_URL` = `https://archaeology-api.onrender.com`
3. Save and wait for rebuild (5-10 minutes)

### Option 2: Commit and Push Latest Code

The latest code has better error handling and logging:

```powershell
git add src/utils/api.ts
git commit -m "Fix: Improve API URL detection and error handling"
git push origin main
```

Then redeploy frontend on Render.

## Expected Results

### After Fix:

1. **Browser Console:**
   - ✅ `API URL configured: https://archaeology-api.onrender.com`
   - ✅ `Environment REACT_APP_API_URL: https://archaeology-api.onrender.com`
   - ✅ `Fetching artifacts from: https://archaeology-api.onrender.com/api/artifacts`
   - ✅ `Fetched artifacts: 11`
   - ✅ No 404 errors

2. **Network Tab:**
   - ✅ Request to: `https://archaeology-api.onrender.com/api/artifacts`
   - ✅ Status: 200 OK
   - ✅ Response: JSON array with 11 artifacts

3. **Frontend:**
   - ✅ Shows 11 artifacts in a grid
   - ✅ No "No artifacts found" message
   - ✅ Artifacts display correctly

## Troubleshooting

### Issue: Still seeing 404 error

**Check:**
1. What URL is shown in browser console?
2. Is it a relative URL (like `/artifacts`) or full URL (like `https://archaeology-api.onrender.com/api/artifacts`)?
3. Is the environment variable set in Render?
4. Was the frontend rebuilt after setting the environment variable?

**Solution:**
- Verify environment variable is set correctly
- Rebuild frontend on Render
- Check browser console for actual URL being used

### Issue: API_URL is undefined

**Check:**
- Browser console shows: `API_URL value: undefined`
- Or: `API URL configured: undefined`

**Solution:**
- Set `REACT_APP_API_URL` environment variable in Render
- Rebuild frontend
- The fallback should work, but setting the variable is more reliable

## Summary

The 404 error is happening because the frontend is trying to fetch from a relative URL instead of the full API URL. 

**Solution:**
1. Set `REACT_APP_API_URL` environment variable in Render
2. Rebuild frontend (automatically or manually)
3. Verify the API URL is correct in browser console
4. Check Network tab for successful API requests

After setting the environment variable and rebuilding, the frontend should connect to the backend correctly and display artifacts!

