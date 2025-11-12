# How to Find Your Backend URL on Render

## Step 1: Access Render Dashboard

1. Go to: https://dashboard.render.com
2. Sign in to your account

## Step 2: Find Your Backend Service

1. In the dashboard, you should see a list of services
2. Look for the service named: **archaeology-api**
3. Click on it

## Step 3: Get the Service URL

1. At the top of the service page, you'll see:
   - Service name: **archaeology-api**
   - Service URL: `https://archaeology-api.onrender.com` (or similar)

2. **Copy this URL** - this is your backend API URL

## Step 4: Verify the Backend is Working

Test these URLs in your browser:

1. **Root URL:**
   - `https://archaeology-api.onrender.com/`
   - Should return JSON with API information

2. **Artifacts endpoint:**
   - `https://archaeology-api.onrender.com/api/artifacts`
   - Should return: `[]` (empty array if no artifacts)

3. **Stats endpoint:**
   - `https://archaeology-api.onrender.com/api/stats`
   - Should return JSON with catalog and artifact counts

## Step 5: Set Frontend Environment Variable

1. In Render dashboard, click on **archaeology-frontend** service
2. Go to **"Environment"** tab
3. Look for environment variable: `REACT_APP_API_URL`
4. If it doesn't exist, click **"Add Environment Variable"**:
   - **Key:** `REACT_APP_API_URL`
   - **Value:** Your backend URL (e.g., `https://archaeology-api.onrender.com`)
5. Click **"Save Changes"**
6. Service will automatically redeploy (takes 5-10 minutes)

## Step 6: Verify Frontend is Using Correct URL

1. After frontend redeploys, visit your website
2. Open browser console (F12)
3. Look for: `API URL configured: https://archaeology-api.onrender.com`
4. Should show your backend URL

## Common Backend URLs on Render

Based on your service name, your backend URL is most likely:
- `https://archaeology-api.onrender.com`

But it could also be:
- `https://archaeology-api-XXXXX.onrender.com` (if service name was modified)

## If You Can't Find the URL

1. Check the service **"Logs"** tab
2. Look for: `API server running on http://0.0.0.0:4000`
3. The service URL is shown at the top of the service page in Render dashboard
4. Check the **"Settings"** tab for service URL

## Quick Test

Once you have your backend URL, test it:

```bash
# Test root endpoint
curl https://archaeology-api.onrender.com/

# Test artifacts endpoint
curl https://archaeology-api.onrender.com/api/artifacts

# Test login endpoint
curl -X POST https://archaeology-api.onrender.com/api/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin"}'
```

## Update Code (If Needed)

If your backend URL is different from `https://archaeology-api.onrender.com`, update `src/utils/api.ts`:

1. Open `src/utils/api.ts`
2. Find line 18:
   ```typescript
   return 'https://archaeology-api.onrender.com';
   ```
3. Replace with your actual backend URL
4. Commit and push:
   ```powershell
   git add .
   git commit -m "Update backend API URL"
   git push origin main
   ```
5. Redeploy on Render

