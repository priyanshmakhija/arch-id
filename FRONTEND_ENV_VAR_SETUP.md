# Frontend Environment Variable Setup

## REACT_APP_API_URL Configuration

### What It Should Be

**Environment Variable:** `REACT_APP_API_URL`  
**Value:** `https://archaeology-api.onrender.com`  
**Important:** No trailing slash!

### Why

The `REACT_APP_API_URL` environment variable tells the React frontend where the backend API is located. This is used during the build process to embed the API URL into the compiled JavaScript.

### Current Setup

In `render.yaml`, the frontend service is configured with:

```yaml
envVars:
  - key: REACT_APP_API_URL
    value: https://archaeology-api.onrender.com
```

This ensures the frontend knows where to find the backend API.

## How It Works

### Priority Order

The frontend code (`src/utils/api.ts`) checks for the API URL in this order:

1. **REACT_APP_API_URL** (build-time environment variable) ← **Highest Priority**
2. **window.ARCHAEOLOGY_API_URL** (runtime configuration from index.html)
3. **Runtime detection** (based on hostname)
4. **Hardcoded fallback** (https://archaeology-api.onrender.com)

### Build-Time vs Runtime

- **Build-Time (`REACT_APP_API_URL`):** Set during `npm run build`, embedded in compiled code
- **Runtime (`window.ARCHAEOLOGY_API_URL`):** Set in `index.html`, available when page loads
- **Fallback:** Used if neither is set

## Setting in Render Dashboard

### Option 1: Using render.yaml (Recommended)

The `render.yaml` file is already configured:

```yaml
services:
  - type: web
    name: archaeology-frontend
    env: static
    envVars:
      - key: REACT_APP_API_URL
        value: https://archaeology-api.onrender.com
```

When you deploy using Render Blueprint, this environment variable is automatically set.

### Option 2: Manual Setup in Render Dashboard

If you need to set it manually:

1. **Go to Render Dashboard:**
   - https://dashboard.render.com

2. **Click on `archaeology-frontend` service**

3. **Go to "Environment" tab**

4. **Add/Update environment variable:**
   - **Key:** `REACT_APP_API_URL`
   - **Value:** `https://archaeology-api.onrender.com`
   - Click "Save Changes"

5. **Redeploy:**
   - Frontend will automatically redeploy (takes 5-10 minutes)
   - Or manually redeploy: "Manual Deploy" → "Deploy latest commit"

## Verification

### After Deployment

1. **Check Build Logs:**
   - Go to Render Dashboard → `archaeology-frontend` → Logs
   - Should see: `REACT_APP_API_URL=https://archaeology-api.onrender.com` during build

2. **Check Browser Console:**
   - Visit: `https://archaeology-frontend.onrender.com/`
   - Open browser console (F12)
   - Should see: `API URL configured: https://archaeology-api.onrender.com`
   - Should see: `Environment REACT_APP_API_URL: https://archaeology-api.onrender.com`

3. **Check Network Tab:**
   - Requests should go to: `https://archaeology-api.onrender.com/api/stats`
   - No double slashes
   - Status: 200 OK

## Troubleshooting

### Issue: API_URL is undefined

**Check:**
- Is `REACT_APP_API_URL` set in Render dashboard?
- Was the frontend rebuilt after setting the environment variable?
- Check browser console for: `Environment REACT_APP_API_URL: not set`

**Solution:**
- Set `REACT_APP_API_URL` in Render dashboard
- Rebuild frontend (automatic or manual)

### Issue: API_URL has trailing slash

**Check:**
- Browser console shows: `API URL configured: https://archaeology-api.onrender.com/`

**Solution:**
- The code automatically removes trailing slashes
- But if it persists, check `render.yaml` doesn't have a trailing slash
- Ensure value is: `https://archaeology-api.onrender.com` (no trailing slash)

### Issue: Double slashes in URL

**Check:**
- Network tab shows: `https://archaeology-api.onrender.com//api/stats`

**Solution:**
- The code automatically removes trailing slashes
- But if it persists, check `REACT_APP_API_URL` doesn't have a trailing slash
- Ensure value is: `https://archaeology-api.onrender.com` (no trailing slash)

## Summary

### ✅ Correct Configuration

- **Key:** `REACT_APP_API_URL`
- **Value:** `https://archaeology-api.onrender.com`
- **No trailing slash!**
- **Set in:** `render.yaml` (recommended) or Render Dashboard

### 📋 Priority Order

1. `REACT_APP_API_URL` (build-time)
2. `window.ARCHAEOLOGY_API_URL` (runtime)
3. Runtime detection
4. Hardcoded fallback

### 🎯 Expected Result

After deployment:
- ✅ Browser console shows: `API URL configured: https://archaeology-api.onrender.com`
- ✅ Environment variable is set: `REACT_APP_API_URL: https://archaeology-api.onrender.com`
- ✅ No double slashes in URLs
- ✅ All API calls work correctly

## Quick Reference

```yaml
# render.yaml
envVars:
  - key: REACT_APP_API_URL
    value: https://archaeology-api.onrender.com
```

```html
<!-- public/index.html (backup) -->
<script>
  window.ARCHAEOLOGY_API_URL = 'https://archaeology-api.onrender.com';
</script>
```

```typescript
// src/utils/api.ts (fallback)
return 'https://archaeology-api.onrender.com';
```

All three are set to the same value, ensuring the frontend always knows where the backend is!

