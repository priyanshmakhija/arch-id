# Deploy Changes Now - Fix "Cannot GET /"

## Quick Steps to Deploy

### Step 1: Commit and Push Changes

Run these commands in PowerShell:

```powershell
# Navigate to project directory
cd C:\Users\vinit\archaeology-catalog

# Check what files changed
git status

# Add all changed files
git add .

# Commit the changes
git commit -m "Fix: Add root route to backend, improve API error handling, and fix frontend-backend connection"

# Push to GitHub
git push origin main
```

### Step 2: Redeploy Backend on Render

1. **Go to Render Dashboard:**
   - https://dashboard.render.com

2. **Find and click on `archaeology-api` service**

3. **Click "Manual Deploy" button** (top right)

4. **Select "Deploy latest commit"**

5. **Wait 5-10 minutes** for deployment to complete

6. **Check deployment status:**
   - Should show "Live" (green) when complete
   - Check "Logs" tab for any errors

### Step 3: Test Backend

After deployment completes, test these URLs:

1. **Root URL:**
   - `https://archaeology-api.onrender.com/`
   - Should return JSON with API information (NOT "Cannot GET /")

2. **Artifacts:**
   - `https://archaeology-api.onrender.com/api/artifacts`
   - Should return: `[]` (empty array)

3. **Login:**
   - Use browser console:
     ```javascript
     fetch('https://archaeology-api.onrender.com/api/login', {
       method: 'POST',
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify({ username: 'admin', password: 'admin' })
     }).then(r => r.json()).then(console.log)
     ```
   - Should return: `{name: "Admin", role: "admin"}`

### Step 4: Set Frontend Environment Variable

1. **Go to Render Dashboard**
2. **Click on `archaeology-frontend` service**
3. **Go to "Environment" tab**
4. **Add/Update environment variable:**
   - **Key:** `REACT_APP_API_URL`
   - **Value:** `https://archaeology-api.onrender.com` (your actual backend URL)
5. **Click "Save Changes"**
6. **Frontend will automatically redeploy** (takes 5-10 minutes)

### Step 5: Test Frontend

1. **Visit your website:**
   - `https://archaeology-frontend.onrender.com`

2. **Open browser console (F12):**
   - Should see: `API URL configured: https://archaeology-api.onrender.com`
   - No errors

3. **Test login:**
   - Username: `admin`
   - Password: `admin`
   - Should work!

4. **Test artifacts:**
   - Should show artifacts or empty list

## What Changed

### Backend Changes:
- ✅ Added root route (`/`) that returns API info
- ✅ Improved CORS configuration
- ✅ Better error handling

### Frontend Changes:
- ✅ Added fallback API URL
- ✅ Better error handling
- ✅ Improved connection error messages

## Verification Checklist

After deployment:

- [ ] Backend root URL returns JSON (not "Cannot GET /")
- [ ] Backend artifacts endpoint returns `[]`
- [ ] Backend login endpoint works
- [ ] Frontend environment variable is set
- [ ] Frontend shows correct API URL in console
- [ ] Frontend login works
- [ ] Frontend artifacts page loads

## If Still Having Issues

1. **Check Render Logs:**
   - Backend service → Logs tab
   - Frontend service → Logs tab
   - Look for errors

2. **Verify Backend URL:**
   - Get exact URL from Render dashboard
   - Update frontend environment variable
   - Redeploy frontend

3. **Check Browser Console:**
   - Open website
   - Press F12
   - Check Console and Network tabs
   - Look for errors

4. **Test Backend Directly:**
   - Visit backend URL in browser
   - Should return JSON (not error)

## Expected Timeline

- **Commit and push:** 1-2 minutes
- **Backend deployment:** 5-10 minutes
- **Frontend deployment:** 5-10 minutes
- **Total:** ~15-20 minutes

## Quick Test Commands

```powershell
# Test backend root
curl https://archaeology-api.onrender.com/

# Test backend artifacts
curl https://archaeology-api.onrender.com/api/artifacts

# Test backend login
curl -X POST https://archaeology-api.onrender.com/api/login -H "Content-Type: application/json" -d '{"username":"admin","password":"admin"}'
```

