# Troubleshoot: No Artifacts Showing on Frontend

## Issue
- `npm run seed` runs without errors
- But no artifacts showing on `https://archaeology-frontend.onrender.com/artifacts`

## Possible Causes

### 1. Seed Script Not Actually Creating Artifacts
**Check:** Run seed script and check output
**Solution:** Verify seed script is actually creating artifacts

### 2. Frontend Not Connected to Backend
**Check:** Browser console - check API URL
**Solution:** Verify frontend is using correct backend URL

### 3. CORS Issue
**Check:** Browser console - check for CORS errors
**Solution:** Verify CORS is configured correctly

### 4. Database is Ephemeral (Render Free Tier)
**Check:** Render restarts might wipe database
**Solution:** Database gets reset on every deployment/restart on Render free tier

### 5. Frontend Environment Variable Not Set
**Check:** Frontend might not have `REACT_APP_API_URL` set
**Solution:** Set environment variable in Render dashboard

## Diagnostic Steps

### Step 1: Check Backend Has Artifacts

Run this script to check if artifacts exist in backend:

```powershell
node check-artifacts.js
```

**Expected:** Should show number of artifacts in database

### Step 2: Check Seed Script Output

Run seed script and check the output:

```powershell
npm run seed
```

**Expected:** Should show:
- ✅ Successfully created: X artifacts
- ❌ Failed: 0 artifacts

### Step 3: Check Frontend API URL

1. Open: `https://archaeology-frontend.onrender.com/artifacts`
2. Open browser console (F12)
3. Look for: `API URL configured: https://archaeology-api.onrender.com`
4. Check Network tab for API requests

**Expected:** 
- API URL should be `https://archaeology-api.onrender.com`
- Network requests should be successful

### Step 4: Test Backend Directly

Visit these URLs in browser:

1. **Root URL:**
   - `https://archaeology-api.onrender.com/`
   - Should return JSON with API info

2. **Artifacts endpoint:**
   - `https://archaeology-api.onrender.com/api/artifacts`
   - Should return JSON array with artifacts (or empty `[]`)

3. **Stats endpoint:**
   - `https://archaeology-api.onrender.com/api/stats`
   - Should show artifact count

### Step 5: Check Render Database

**Important:** On Render's free tier, the database is **ephemeral**, meaning:
- Database gets wiped on every service restart
- Database gets wiped on every deployment
- Data doesn't persist between deployments

**Solution:** 
- After seeding, artifacts exist until next restart/deployment
- Need to reseed after every deployment

## Solutions

### Solution 1: Verify Artifacts Exist

Run check script:
```powershell
node check-artifacts.js
```

If no artifacts found, run seed script:
```powershell
npm run seed
```

### Solution 2: Verify Frontend Connection

1. Check browser console for API URL
2. Check Network tab for API requests
3. Verify no CORS errors
4. Verify API requests are successful

### Solution 3: Set Frontend Environment Variable

1. Go to Render Dashboard
2. Click on `archaeology-frontend` service
3. Go to "Environment" tab
4. Add/Update:
   - **Key:** `REACT_APP_API_URL`
   - **Value:** `https://archaeology-api.onrender.com`
5. Save and redeploy

### Solution 4: Handle Ephemeral Database

**Option A: Reseed After Every Deployment**
- Run seed script after every deployment
- Or create a startup script that seeds database

**Option B: Use Persistent Database**
- Upgrade to Render paid tier
- Or use external database (PostgreSQL, etc.)

**Option C: Create Startup Script**
- Create script that seeds database on startup
- Add to `render.yaml` or server startup

## Quick Fix Checklist

- [ ] Run `node check-artifacts.js` - verify artifacts exist in backend
- [ ] Run `npm run seed` - verify seed script creates artifacts
- [ ] Check browser console - verify API URL is correct
- [ ] Check Network tab - verify API requests are successful
- [ ] Verify frontend environment variable is set
- [ ] Test backend directly - verify artifacts endpoint returns data
- [ ] Check if database is ephemeral - artifacts might be wiped

## Next Steps

1. **Run diagnostic script:**
   ```powershell
   node check-artifacts.js
   ```

2. **Check seed script output:**
   ```powershell
   npm run seed
   ```

3. **Check browser console:**
   - Open: `https://archaeology-frontend.onrender.com/artifacts`
   - Press F12
   - Check Console and Network tabs

4. **Test backend directly:**
   - Visit: `https://archaeology-api.onrender.com/api/artifacts`
   - Should return JSON array with artifacts

## Expected Results

### After Running Seed Script:
- Backend `/api/artifacts` returns array with artifacts
- Stats shows artifact count > 0

### After Checking Frontend:
- Browser console shows correct API URL
- Network tab shows successful API requests
- Frontend displays artifacts

## Summary

The issue could be:
1. Seed script not creating artifacts (check output)
2. Frontend not connected to backend (check API URL)
3. Database is ephemeral (artifacts wiped on restart)
4. Frontend environment variable not set
5. CORS or connection issue

Run the diagnostic steps above to identify the exact issue.

