# Fix: CORS Error and Double Slash in URL

## Issues Found

### 1. Double Slash in URL ❌
**Error:**
```
https://archaeology-api.onrender.com//api/stats
```

**Cause:**
- API_URL was configured with trailing slash: `https://archaeology-api.onrender.com/`
- When concatenating with `/api/stats`, it becomes `//api/stats`

**Fix:**
- Added `getCleanApiUrl()` function that removes trailing slashes
- Ensures API_URL never has a trailing slash
- All API calls now use clean URLs

### 2. CORS Error ❌
**Error:**
```
Access to fetch at 'https://archaeology-api.onrender.com//api/stats' from origin 'https://archaeology-frontend.onrender.com' has been blocked by CORS policy: The 'Access-Control-Allow-Origin' header contains the invalid value 'archaeology-frontend'.
```

**Cause:**
- `render.yaml` was using `fromService` with `property: host`
- For static sites, this returns just the service name, not the full URL
- Backend received `archaeology-frontend` instead of `https://archaeology-frontend.onrender.com`

**Fix:**
- Updated `render.yaml` to set `CORS_ORIGIN` directly to full URL
- Changed from `fromService` to direct value: `https://archaeology-frontend.onrender.com`
- Updated backend CORS configuration to handle multiple origins
- Added better logging for CORS configuration

## Changes Made

### 1. Frontend: src/utils/api.ts ✅

**Added trailing slash removal:**
```typescript
// Get API URL and remove trailing slash to prevent double slashes
const getCleanApiUrl = (): string => {
  const url = getApiUrl();
  // Remove trailing slash if present
  return url.replace(/\/+$/, '');
};

const API_URL = getCleanApiUrl();
```

**Simplified fetchArtifacts:**
- Removed redundant URL validation (already handled in getCleanApiUrl)
- API_URL is guaranteed to be clean (no trailing slash)

### 2. Backend: server/src/index.ts ✅

**Improved CORS configuration:**
```typescript
const corsOrigin = process.env.CORS_ORIGIN || '*';
const allowedOrigins = corsOrigin === '*' 
  ? true 
  : corsOrigin.split(',').map(origin => origin.trim()).filter(origin => origin);

console.log('CORS Origin configured:', corsOrigin);
console.log('Allowed origins:', allowedOrigins);

app.use(cors({ 
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-user-role']
}));
```

**Features:**
- Supports multiple origins (comma-separated)
- Better logging for debugging
- Explicit methods and headers
- Allows credentials

### 3. Deployment: render.yaml ✅

**Fixed CORS_ORIGIN:**
```yaml
envVars:
  - key: CORS_ORIGIN
    value: https://archaeology-frontend.onrender.com
```

**Changed from:**
```yaml
envVars:
  - key: CORS_ORIGIN
    fromService:
      type: web
      name: archaeology-frontend
      property: host
```

**Why:**
- `fromService` with `property: host` doesn't work correctly for static sites
- Returns just the service name, not the full URL
- Setting directly ensures the full URL is used

## Next Steps

### Step 1: Commit and Push Changes

```powershell
# Add all changes
git add -A

# Commit changes
git commit -m "Fix: Remove trailing slash from API URL, fix CORS origin to use full URL"

# Push to GitHub
git push origin main
```

### Step 2: Redeploy on Render

1. **Backend (archaeology-api):**
   - Render should auto-detect new commit
   - Or manually trigger redeploy
   - Wait 5-10 minutes

2. **Frontend (archaeology-frontend):**
   - Render should auto-detect new commit
   - Or manually trigger redeploy
   - Wait 5-10 minutes

### Step 3: Verify After Deployment

1. **Check Backend Logs:**
   - Go to Render Dashboard → `archaeology-api` → Logs
   - Should see: `CORS Origin configured: https://archaeology-frontend.onrender.com`
   - Should see: `Allowed origins: [ 'https://archaeology-frontend.onrender.com' ]`

2. **Check Frontend:**
   - Visit: `https://archaeology-frontend.onrender.com/`
   - Open browser console (F12)
   - Should see: `API URL configured: https://archaeology-api.onrender.com` (no trailing slash)
   - Should NOT see double slashes in URLs
   - Should NOT see CORS errors

3. **Test API Calls:**
   - Check Network tab
   - Requests should go to: `https://archaeology-api.onrender.com/api/stats` (no double slash)
   - Status should be: 200 OK
   - No CORS errors

## Expected Results

### After Deployment:

1. **Browser Console:**
   - ✅ `API URL configured: https://archaeology-api.onrender.com` (no trailing slash)
   - ✅ `Fetching artifacts from: https://archaeology-api.onrender.com/api/artifacts` (no double slash)
   - ✅ No CORS errors
   - ✅ No 404 errors

2. **Network Tab:**
   - ✅ Requests to: `https://archaeology-api.onrender.com/api/stats` (no double slash)
   - ✅ Status: 200 OK
   - ✅ CORS headers present: `Access-Control-Allow-Origin: https://archaeology-frontend.onrender.com`

3. **Backend Logs:**
   - ✅ `CORS Origin configured: https://archaeology-frontend.onrender.com`
   - ✅ `Allowed origins: [ 'https://archaeology-frontend.onrender.com' ]`

4. **Frontend:**
   - ✅ Home page loads correctly
   - ✅ Stats are fetched successfully
   - ✅ Artifacts are fetched successfully
   - ✅ No errors in console

## Summary

### ✅ Fixed Issues:

1. **Double Slash:**
   - Added `getCleanApiUrl()` to remove trailing slashes
   - All API URLs are now clean (no trailing slash)
   - No more `//api/stats` errors

2. **CORS Error:**
   - Set `CORS_ORIGIN` directly to full URL in `render.yaml`
   - Updated backend CORS configuration to handle multiple origins
   - Added better logging for debugging
   - Explicit methods and headers

### 📋 Next Steps:

1. ✅ Commit and push changes
2. ✅ Redeploy on Render (backend and frontend)
3. ✅ Verify CORS is working
4. ✅ Verify no double slashes in URLs
5. ✅ Test all API calls

### 🎯 Expected Result:

After deployment:
- ✅ No double slashes in URLs
- ✅ No CORS errors
- ✅ All API calls work correctly
- ✅ Frontend loads and displays data correctly

The fixes are complete! After redeploying, both issues should be resolved. 🎉

