# Fix "Cannot GET /" Error on Render

## Problem
Backend shows "Cannot GET /" when accessing the root URL.

## Solution
The backend code has been updated to add a root route, but the changes need to be deployed to Render.

## Steps to Fix

### Step 1: Commit and Push Changes

Run these commands in PowerShell:

```powershell
# Check what files have changed
git status

# Add all changed files
git add .

# Commit the changes
git commit -m "Fix: Add root route to backend API and improve error handling"

# Push to GitHub
git push origin main
```

### Step 2: Redeploy Backend on Render

1. **Go to Render Dashboard:**
   - https://dashboard.render.com

2. **Click on `archaeology-api` service**

3. **Redeploy:**
   - Click **"Manual Deploy"** button
   - Select **"Deploy latest commit"**
   - Wait 5-10 minutes for deployment to complete

4. **Verify deployment:**
   - Check **"Logs"** tab for any errors
   - Should see: `API server running on http://0.0.0.0:4000`

### Step 3: Test Backend

After deployment completes:

1. **Test root URL:**
   - Visit: `https://archaeology-api.onrender.com/`
   - Should return JSON:
     ```json
     {
       "message": "Archaeology Catalog API",
       "version": "1.0.0",
       "endpoints": {
         "login": "POST /api/login",
         "catalogs": "GET /api/catalogs",
         "artifacts": "GET /api/artifacts",
         "stats": "GET /api/stats"
       },
       "status": "running"
     }
     ```

2. **Test artifacts endpoint:**
   - Visit: `https://archaeology-api.onrender.com/api/artifacts`
   - Should return: `[]` (empty array if no artifacts)

3. **Test login endpoint:**
   - Use browser console or curl:
     ```javascript
     fetch('https://archaeology-api.onrender.com/api/login', {
       method: 'POST',
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify({ username: 'admin', password: 'admin' })
     }).then(r => r.json()).then(console.log)
     ```
   - Should return: `{"name":"Admin","role":"admin"}`

### Step 4: Fix Frontend Connection

1. **Get your backend URL:**
   - From Render dashboard, copy the backend service URL
   - Should be: `https://archaeology-api.onrender.com`

2. **Set frontend environment variable:**
   - Go to Render dashboard
   - Click on **archaeology-frontend** service
   - Go to **"Environment"** tab
   - Add/Update:
     - **Key:** `REACT_APP_API_URL`
     - **Value:** `https://archaeology-api.onrender.com` (your actual backend URL)
   - Click **"Save Changes"**
   - Frontend will automatically redeploy

3. **Wait for redeployment:**
   - Takes 5-10 minutes
   - Check build logs for errors

### Step 5: Test Frontend

1. **Visit your website:**
   - `https://archaeology-frontend.onrender.com`

2. **Open browser console (F12):**
   - Should see: `API URL configured: https://archaeology-api.onrender.com`
   - Check for any errors

3. **Test login:**
   - Click **"Sign In"**
   - Username: `admin`
   - Password: `admin`
   - Should successfully log in

4. **Test artifacts:**
   - Click **"All Artifacts"**
   - Should show artifacts (if database is seeded) or empty list

## What Was Changed

### Backend (`server/src/index.ts`)

1. **Added root route:**
   ```typescript
   app.get('/', (_req, res) => {
     res.json({
       message: 'Archaeology Catalog API',
       version: '1.0.0',
       endpoints: { ... },
       status: 'running'
     });
   });
   ```

2. **Improved CORS configuration:**
   - Uses environment variable for CORS origin
   - Allows credentials

### Frontend (`src/utils/api.ts`)

1. **Added fallback API URL:**
   - Uses `https://archaeology-api.onrender.com` if env var not set
   - Better error handling

2. **Improved error messages:**
   - Shows connection errors clearly
   - Logs API URL for debugging

## Quick Command Reference

```powershell
# Commit and push changes
git add .
git commit -m "Fix: Add root route to backend API and improve error handling"
git push origin main

# After pushing, redeploy on Render:
# 1. Go to Render dashboard
# 2. Click archaeology-api service
# 3. Click "Manual Deploy" → "Deploy latest commit"
# 4. Wait 5-10 minutes
# 5. Test: https://archaeology-api.onrender.com/
```

## Expected Results

### After Backend Deployment:

✅ `https://archaeology-api.onrender.com/` returns API info JSON
✅ `https://archaeology-api.onrender.com/api/artifacts` returns `[]`
✅ `https://archaeology-api.onrender.com/api/login` accepts POST requests

### After Frontend Deployment:

✅ Website loads without errors
✅ Browser console shows correct API URL
✅ Login works with `admin`/`admin`
✅ Artifacts page loads (even if empty)

## Troubleshooting

### Still seeing "Cannot GET /"

1. **Check deployment status:**
   - Render dashboard → Service → Check if deployment completed
   - Look for green "Live" status

2. **Check logs:**
   - Render dashboard → Service → Logs
   - Look for errors during deployment

3. **Verify code was pushed:**
   - Check GitHub repository
   - Verify latest commit includes the root route

4. **Clear browser cache:**
   - Hard refresh: Ctrl+F5
   - Or clear browser cache

### Frontend still can't connect

1. **Verify environment variable:**
   - Render dashboard → Frontend service → Environment
   - Check `REACT_APP_API_URL` is set correctly

2. **Check browser console:**
   - Look for API URL being used
   - Check for CORS errors
   - Check for connection errors

3. **Verify backend is accessible:**
   - Test backend URL directly in browser
   - Should return JSON (not error)

## Next Steps

1. ✅ Commit and push changes
2. ✅ Redeploy backend on Render
3. ✅ Set frontend environment variable
4. ✅ Redeploy frontend on Render
5. ✅ Test website
6. ✅ Seed database (if no artifacts showing)

