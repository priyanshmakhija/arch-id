# Render Migration Guide: Static Site → Web Service

## Problem
Render doesn't allow changing a Static Site to a Web Service. We need to create a new service.

## Solution: Create New Web Service

### Option 1: Create New Service (Recommended)

1. **Create New Web Service**
   - Go to Render Dashboard
   - Click **"New +"** button
   - Select **"Web Service"**
   - Connect your Git repository (same one you're using)

2. **Configure the New Service**
   - **Name**: `archaeology-frontend-v2` (or any name you prefer)
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `node server-static.js`
   - **Plan**: Free

3. **Set Environment Variables**
   - `NODE_ENV` = `production`
   - `PORT` = `3000` (or leave empty - Render auto-assigns)
   - `REACT_APP_API_URL` = `https://archaeology-api.onrender.com`

4. **Deploy**
   - Click **"Create Web Service"**
   - Wait for deployment to complete

5. **Update Backend CORS** (if needed)
   - Go to `archaeology-api` service
   - Update `CORS_ORIGIN` environment variable to include the new frontend URL
   - Or set it to `*` temporarily to test

6. **Test New Service**
   - Visit the new service URL
   - Test: `/health` endpoint
   - Test: `/artifact/mi6tyw2od9uieip8jug?barcode=A06825952UHLS0001`

7. **Switch DNS/Custom Domain** (if you have one)
   - Update custom domain to point to new service
   - Or update any external references

8. **Delete Old Static Site** (after confirming new one works)
   - Go to old `archaeology-frontend` service
   - Settings → Delete Service

### Option 2: Use render.yaml (If Your Account Supports It)

Some Render accounts support automatic configuration from `render.yaml`:

1. **Check if render.yaml is detected**
   - Go to your repository on Render
   - Check if it shows "Using render.yaml" in the service settings

2. **If detected, it should automatically:**
   - Create services from the YAML
   - Use the correct service types
   - Apply the configuration

3. **If not detected:**
   - You may need to manually create services first
   - Or your Render plan might not support it

### Option 3: Alternative - Use _redirects File (Limited)

If you must keep it as a Static Site, we can try using a `_redirects` file, but this has limitations:

1. Create `public/_redirects` file (already created)
2. But Render Static Sites might not support this
3. This is why Web Service is the better solution

## Recommended Steps (Detailed)

### Step 1: Create New Web Service

```
1. Render Dashboard → New + → Web Service
2. Connect Repository: [Your Git Repo]
3. Configure:
   - Name: archaeology-frontend
   - Region: [Choose closest]
   - Branch: main (or your default branch)
   - Root Directory: / (root)
   - Environment: Node
   - Build Command: npm install && npm run build
   - Start Command: node server-static.js
   - Plan: Free
```

### Step 2: Add Environment Variables

In the new service, go to **Environment** tab and add:
```
NODE_ENV = production
PORT = 3000
REACT_APP_API_URL = https://archaeology-api.onrender.com
```

### Step 3: Deploy and Test

1. Click **"Create Web Service"**
2. Wait for build to complete (watch logs)
3. Test endpoints:
   - `https://[new-service-url].onrender.com/health`
   - `https://[new-service-url].onrender.com/artifact/test?barcode=TEST`

### Step 4: Update Backend CORS

Go to `archaeology-api` service → Environment Variables:
- Update `CORS_ORIGIN` to include new frontend URL
- Or set to: `https://archaeology-frontend.onrender.com,https://[new-service-url].onrender.com`

### Step 5: Update Any External References

- Update any documentation
- Update QR codes if they have hardcoded URLs
- Update any API configurations

### Step 6: Clean Up (After Testing)

Once new service is confirmed working:
1. Delete old Static Site service
2. (Optional) Rename new service to `archaeology-frontend` if you want the same name

## Verification Checklist

After creating the new service, verify:

- [ ] Service builds successfully (check logs)
- [ ] Service starts without errors
- [ ] `/health` endpoint returns JSON
- [ ] Home page loads: `/`
- [ ] Artifact route works: `/artifact/test?barcode=TEST`
- [ ] No 404 errors in browser console
- [ ] Static assets (JS, CSS) load correctly
- [ ] QR code scanning works

## Troubleshooting

### Build Fails
- Check logs for error messages
- Verify `package.json` has `express` dependency
- Verify `server-static.js` exists in root

### Service Won't Start
- Check logs for error messages
- Verify `build` directory exists after build
- Verify PORT environment variable

### Still Getting 404
- Verify service type is "Web Service" not "Static Site"
- Check logs to see if server started
- Verify start command is: `node server-static.js`

### CORS Errors
- Update backend `CORS_ORIGIN` to include new frontend URL
- Check backend logs for CORS errors

## Quick Reference

**Old (Static Site - BROKEN):**
- Type: Static Site
- Publish Directory: build
- ❌ Can't handle React Router routes

**New (Web Service - FIXED):**
- Type: Web Service
- Build: `npm install && npm run build`
- Start: `node server-static.js`
- ✅ Handles all React Router routes


