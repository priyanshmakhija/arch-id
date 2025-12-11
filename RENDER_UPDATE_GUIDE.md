# Render Dashboard Update Guide

## Problem
The frontend is still configured as a **Static Site** in Render, which causes 404 errors for React Router routes.

## Solution
Update the frontend service in Render dashboard to use **Web Service** instead of **Static Site**.

## Step-by-Step Instructions

### 1. Go to Render Dashboard
1. Log in to [render.com](https://render.com)
2. Navigate to your dashboard
3. Find the **archaeology-frontend** service

### 2. Update Service Type
1. Click on **archaeology-frontend** service
2. Go to **Settings** tab
3. Scroll down to **Service Type** or **Build & Deploy** section

### 3. Change Configuration

**Current (WRONG - Static Site):**
- Type: Static Site
- Build Command: `npm install && npm run build`
- Publish Directory: `build`

**New (CORRECT - Web Service):**
- Type: **Web Service** (change from Static Site)
- Environment: **Node**
- Build Command: `npm install && npm run build`
- Start Command: `node server-static.js`
- Environment Variables:
  - `NODE_ENV` = `production`
  - `PORT` = `3000` (or leave empty, Render will set it)
  - `REACT_APP_API_URL` = `https://archaeology-api.onrender.com`

### 4. Save and Redeploy
1. Click **Save Changes**
2. Render will automatically trigger a new deployment
3. Wait for deployment to complete (usually 2-5 minutes)

### 5. Verify Deployment
After deployment completes:
1. Check the **Logs** tab to see:
   ```
   Static file server running on port 3000
   Serving files from: /opt/render/project/src/build
   Health check: http://localhost:3000/health
   ```

2. Test the health endpoint:
   - Visit: `https://archaeology-frontend.onrender.com/health`
   - Should return: `{"status":"ok","timestamp":"..."}`

3. Test the artifact route:
   - Visit: `https://archaeology-frontend.onrender.com/artifact/mi6tyw2od9uieip8jug?barcode=A06825952UHLS0001`
   - Should load the React app (not 404)

## Alternative: Use render.yaml (If Supported)

If your Render account supports `render.yaml`:

1. Make sure `render.yaml` is in the root of your repository
2. In Render dashboard, go to **Settings** → **Build & Deploy**
3. Enable **Auto-Deploy** from Git
4. Render should automatically detect and use `render.yaml`

## Troubleshooting

### Issue: "Cannot find module 'express'"
**Solution:** Make sure `express` is in `package.json` dependencies (it should be: `"express": "^4.18.2"`)

### Issue: "Build directory not found"
**Solution:** The build command must run before the start command. Verify:
- Build Command: `npm install && npm run build`
- Start Command: `node server-static.js`

### Issue: Still getting 404
**Solution:** 
1. Check Render logs to see if server started correctly
2. Verify the service type is "Web Service" not "Static Site"
3. Check that `server-static.js` exists in the repository root
4. Verify PORT environment variable is set (or leave empty for auto)

### Issue: Service won't start
**Solution:**
1. Check the **Logs** tab for error messages
2. Verify `server-static.js` syntax is correct
3. Make sure `build` directory exists after build completes
4. Check that Express is in dependencies

## Quick Checklist

Before deploying, verify:
- [ ] `server-static.js` exists in repository root
- [ ] `express` is in `package.json` dependencies
- [ ] `render.yaml` is updated (if using)
- [ ] Service type is changed to "Web Service" in dashboard
- [ ] Start command is: `node server-static.js`
- [ ] Build command includes: `npm run build`
- [ ] Environment variables are set correctly

## After Deployment

Once deployed, test these URLs:
1. ✅ `https://archaeology-frontend.onrender.com/` - Home page
2. ✅ `https://archaeology-frontend.onrender.com/health` - Health check (should return JSON)
3. ✅ `https://archaeology-frontend.onrender.com/artifact/test?barcode=TEST` - Artifact route
4. ✅ `https://archaeology-frontend.onrender.com/catalogs` - Other routes

All should work without 404 errors!


