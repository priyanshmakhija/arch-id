# Render Deployment Troubleshooting Guide

## Issues: No Artifacts Showing & Login Not Working

### Problem 1: Frontend Can't Connect to Backend

**Symptoms:**
- No artifacts showing on `/artifacts` page
- Login not working
- Network errors in browser console
- CORS errors

**Root Cause:**
The frontend is trying to connect to the backend, but:
1. The `REACT_APP_API_URL` environment variable might not be set correctly
2. The backend might not be accessible
3. CORS might be blocking requests

**Solution:**

#### Step 1: Verify Backend is Running

1. Go to Render dashboard: https://dashboard.render.com
2. Click on **archaeology-api** service
3. Check service status:
   - Should be **"Live"** (green)
   - If **"Suspended"** (yellow), click **"Manual Deploy"** → **"Deploy latest commit"**
4. Check logs:
   - Click **"Logs"** tab
   - Look for: `API server running on http://0.0.0.0:4000`
   - If you see errors, fix them first

#### Step 2: Get Backend URL

1. In Render dashboard, click on **archaeology-api** service
2. Copy the service URL (e.g., `https://archaeology-api.onrender.com`)
3. Test the backend:
   - Open: `https://archaeology-api.onrender.com/api/artifacts`
   - Should return JSON (empty array `[]` if no artifacts)
   - If you see an error, backend isn't running properly

#### Step 3: Set Frontend Environment Variable

**Option A: Using Render Dashboard (Recommended)**

1. Go to Render dashboard
2. Click on **archaeology-frontend** service
3. Go to **"Environment"** tab
4. Add/Update environment variable:
   - **Key:** `REACT_APP_API_URL`
   - **Value:** `https://archaeology-api.onrender.com` (use your actual backend URL)
5. Click **"Save Changes"**
6. Service will automatically redeploy

**Option B: Update render.yaml**

Update `render.yaml` to ensure the environment variable is set:

```yaml
# Frontend Static Site
- type: web
  name: archaeology-frontend
  env: static
  buildCommand: npm install && npm run build
  staticPublishPath: ./build
  envVars:
    - key: REACT_APP_API_URL
      fromService:
        type: web
        name: archaeology-api
        property: host
      format: https://${host}
```

Then redeploy.

#### Step 4: Rebuild Frontend

After setting the environment variable:

1. Go to **archaeology-frontend** service
2. Click **"Manual Deploy"** → **"Deploy latest commit"**
3. Wait 5-10 minutes for deployment
4. Check build logs for any errors

#### Step 5: Verify Frontend is Using Correct API URL

1. Open your website: `https://archaeology-frontend.onrender.com`
2. Open browser console (F12)
3. Check for API calls:
   - Look for network requests to `/api/login` or `/api/artifacts`
   - Check if they're going to the correct backend URL
   - If they're going to `localhost:4000`, the environment variable isn't set

### Problem 2: Database is Empty

**Symptoms:**
- No artifacts showing (even if API is working)
- Empty arrays returned from API

**Solution:**

#### Option 1: Seed Database Using Script

1. **Get backend URL:**
   - From Render dashboard: `https://archaeology-api.onrender.com`

2. **Update seed script:**
   - Open `scripts/seed-artifacts.js`
   - Update `API_URL` at the top:
     ```javascript
     const API_URL = process.env.API_URL || 'https://archaeology-api.onrender.com';
     ```

3. **Run seed script locally:**
   ```powershell
   cd C:\Users\vinit\archaeology-catalog
   npm run seed
   ```

4. **Or run seed script with API URL:**
   ```powershell
   $env:API_URL="https://archaeology-api.onrender.com"; npm run seed
   ```

#### Option 2: Add Artifacts via Frontend

1. Go to your website: `https://archaeology-frontend.onrender.com`
2. Login with:
   - Username: `admin`
   - Password: `admin`
3. Click **"Add Artifact"**
4. Fill in artifact details
5. Save

### Problem 3: Login Not Working

**Symptoms:**
- Can't login with `admin`/`admin`
- Getting authentication errors
- Login button not responding

**Solution:**

#### Step 1: Check Backend is Running

1. Verify backend is **"Live"** in Render dashboard
2. Test login endpoint:
   - Open: `https://archaeology-api.onrender.com/api/login`
   - Should return 400 (method not allowed) or 404 (not found)
   - This means backend is running

#### Step 2: Test Login Endpoint

Test the login endpoint directly:

```bash
curl -X POST https://archaeology-api.onrender.com/api/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin"}'
```

Should return:
```json
{"name":"Admin","role":"admin"}
```

If you get an error, check backend logs.

#### Step 3: Check Frontend API URL

1. Open browser console (F12)
2. Try to login
3. Check network tab:
   - Look for POST request to `/api/login`
   - Check if URL is correct (should be `https://archaeology-api.onrender.com/api/login`)
   - Check response status and error message

#### Step 4: Check CORS

1. Open browser console (F12)
2. Look for CORS errors:
   - `Access to fetch at '...' from origin '...' has been blocked by CORS policy`
   - If you see this, CORS isn't configured correctly

2. **Fix CORS:**
   - Backend should allow frontend origin
   - Check `server/src/index.ts` - CORS should allow all origins or specific frontend URL
   - Update backend CORS configuration if needed

### Problem 4: Environment Variables Not Working

**Symptoms:**
- Frontend still trying to connect to `localhost:4000`
- Environment variable not being used

**Solution:**

#### For Static Sites in Render

Render might not pass environment variables to static sites during build. 

**Workaround:**

1. **Hardcode backend URL in code (temporary):**
   - Update `src/utils/api.ts`:
     ```typescript
     const API_URL = 'https://archaeology-api.onrender.com';
     ```

2. **Or use a config file:**
   - Create `public/config.js`:
     ```javascript
     window.API_URL = 'https://archaeology-api.onrender.com';
     ```
   - Update `src/utils/api.ts`:
     ```typescript
     const API_URL = (window as any).API_URL || 'https://archaeology-api.onrender.com';
     ```

3. **Rebuild and redeploy**

### Quick Fix Checklist

- [ ] Backend service is **"Live"** (green) in Render dashboard
- [ ] Backend URL is accessible: `https://archaeology-api.onrender.com/api/artifacts`
- [ ] Frontend environment variable `REACT_APP_API_URL` is set to backend URL
- [ ] Frontend has been rebuilt after setting environment variable
- [ ] Browser console shows correct API URL being used
- [ ] No CORS errors in browser console
- [ ] Database has been seeded (if no artifacts showing)

### Debugging Steps

1. **Check Backend Logs:**
   - Render dashboard → **archaeology-api** → **Logs**
   - Look for errors or connection issues

2. **Check Frontend Logs:**
   - Render dashboard → **archaeology-frontend** → **Logs**
   - Look for build errors

3. **Check Browser Console:**
   - Open website in browser
   - Press F12 to open developer tools
   - Check **Console** tab for errors
   - Check **Network** tab for API requests

4. **Test Backend Directly:**
   - Visit: `https://archaeology-api.onrender.com/api/artifacts`
   - Should return JSON (empty array if no artifacts)
   - Visit: `https://archaeology-api.onrender.com/api/login` (should return error - that's normal)

5. **Test Login Endpoint:**
   ```bash
   curl -X POST https://archaeology-api.onrender.com/api/login \
     -H "Content-Type: application/json" \
     -d '{"username":"admin","password":"admin"}'
   ```

### Still Not Working?

1. **Check Render Status:**
   - Go to https://status.render.com
   - Check if there are any service issues

2. **Check Service Health:**
   - Render dashboard → Service → **Metrics**
   - Check CPU, memory usage
   - Check if service is responding

3. **Review Error Logs:**
   - Check both frontend and backend logs
   - Look for specific error messages
   - Google the error message for solutions

4. **Redeploy Services:**
   - Go to each service
   - Click **"Manual Deploy"** → **"Deploy latest commit"**
   - Wait for deployment to complete

5. **Check Environment Variables:**
   - Verify all environment variables are set correctly
   - Check for typos in variable names
   - Verify values are correct

## Expected Behavior

### After Fix:

1. **Backend:**
   - Accessible at: `https://archaeology-api.onrender.com`
   - Returns JSON from `/api/artifacts`, `/api/catalogs`, etc.
   - Login endpoint works: `POST /api/login`

2. **Frontend:**
   - Accessible at: `https://archaeology-frontend.onrender.com`
   - Can login with `admin`/`admin`
   - Can view artifacts (if database is seeded)
   - Can add/edit artifacts (if logged in as admin/archaeologist)

3. **Database:**
   - Contains artifacts (if seeded)
   - Can be accessed via API
   - Data persists across deployments

## Next Steps

1. **Seed Database:**
   - Run seed script to add test artifacts
   - Or add artifacts via frontend

2. **Test All Features:**
   - Login with different roles
   - Add/edit artifacts
   - Generate QR codes
   - Search artifacts

3. **Monitor Deployment:**
   - Check logs regularly
   - Monitor service health
   - Set up alerts if needed

