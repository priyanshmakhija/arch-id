# Fix: Frontend Not Showing Artifacts

## Issue
- ✅ Backend has artifacts (11 artifacts confirmed)
- ✅ Seed script works (created 10 artifacts successfully)
- ❌ Frontend shows "No artifacts found" or empty page

## Root Cause
The frontend is either:
1. Not connecting to the backend (API URL issue)
2. Connecting but errors are being caught silently
3. Frontend needs to be rebuilt with correct API URL

## Solution

### Step 1: Check Frontend Environment Variable

1. **Go to Render Dashboard:**
   - https://dashboard.render.com

2. **Click on `archaeology-frontend` service**

3. **Go to "Environment" tab**

4. **Check if `REACT_APP_API_URL` is set:**
   - **Key:** `REACT_APP_API_URL`
   - **Value:** `https://archaeology-api.onrender.com`

5. **If not set or incorrect:**
   - Add/Update the environment variable
   - **Value:** `https://archaeology-api.onrender.com`
   - Click "Save Changes"
   - Frontend will automatically redeploy

### Step 2: Rebuild Frontend

**Important:** React environment variables are set at BUILD time, not runtime.

1. **After setting environment variable:**
   - Render will automatically rebuild and redeploy
   - Wait 5-10 minutes for deployment

2. **Or manually redeploy:**
   - Go to Render Dashboard
   - Click on `archaeology-frontend` service
   - Click "Manual Deploy" → "Deploy latest commit"
   - Wait 5-10 minutes for deployment

### Step 3: Check Browser Console

After frontend redeploys:

1. **Visit your website:**
   - `https://archaeology-frontend.onrender.com/artifacts`

2. **Open browser console (F12):**
   - Look for: `API URL configured: https://archaeology-api.onrender.com`
   - Look for: `Fetching artifacts from: https://archaeology-api.onrender.com/api/artifacts`
   - Look for: `Fetched artifacts: 11` (or the number of artifacts)
   - Check for any errors in the console

3. **Check Network tab:**
   - Look for request to: `https://archaeology-api.onrender.com/api/artifacts`
   - Check if request is successful (status 200)
   - Check the response - should contain artifacts array

### Step 4: Verify Frontend Code

The frontend code has a fallback that should use the backend URL automatically:

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

### Step 5: Test After Redeployment

After frontend redeploys:

1. **Visit your website:**
   - `https://archaeology-frontend.onrender.com/artifacts`

2. **Check browser console:**
   - Should see: `API URL configured: https://archaeology-api.onrender.com`
   - Should see: `Fetched artifacts: 11`
   - Should NOT see errors

3. **Check artifacts page:**
   - Should show 11 artifacts in a grid
   - Each artifact should have name, details, QR code

## Quick Fix Checklist

- [ ] Check frontend environment variable is set in Render
- [ ] Rebuild frontend on Render (after setting environment variable)
- [ ] Check browser console for API URL
- [ ] Check browser console for fetch errors
- [ ] Check Network tab for API requests
- [ ] Verify artifacts are showing on frontend

## Expected Results

### After Fix:

1. **Browser Console:**
   - `API URL configured: https://archaeology-api.onrender.com`
   - `Fetching artifacts from: https://archaeology-api.onrender.com/api/artifacts`
   - `Fetched artifacts: 11`

2. **Network Tab:**
   - Request to: `https://archaeology-api.onrender.com/api/artifacts`
   - Status: 200 OK
   - Response: JSON array with 11 artifacts

3. **Frontend:**
   - Shows 11 artifacts in a grid
   - Each artifact displays correctly
   - QR codes are visible
   - Artifacts are clickable

## Troubleshooting

### Issue: Still showing "No artifacts found"

**Check:**
1. Browser console for errors
2. Network tab for API requests
3. API URL is correct in console
4. Frontend was rebuilt after setting environment variable

**Solution:**
- Verify environment variable is set correctly
- Rebuild frontend on Render
- Check browser console for errors

### Issue: Browser console shows wrong API URL

**Check:**
- What API URL is shown in console?
- If it shows `localhost:4000`, the environment variable is not set
- If it shows the correct URL, check for CORS or connection errors

**Solution:**
- Set environment variable in Render
- Rebuild frontend
- Check CORS configuration

### Issue: Network requests are failing

**Check:**
- What error is shown in Network tab?
- Is it a CORS error?
- Is it a connection error?
- What status code is returned?

**Solution:**
- Check CORS configuration in backend
- Verify backend is accessible
- Check backend logs for errors

## Summary

The issue is that the frontend needs to be rebuilt with the correct API URL. 

**Solution:**
1. Set `REACT_APP_API_URL` environment variable in Render
2. Rebuild frontend (automatically or manually)
3. Check browser console for correct API URL
4. Verify artifacts are showing

The backend is working correctly (11 artifacts exist), so once the frontend is connected properly, artifacts will appear!

