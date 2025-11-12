# Quick Fix: Render Deployment Issues

## Issue: No Artifacts & Login Not Working

### Immediate Steps to Fix:

#### Step 1: Verify Backend is Running

1. **Go to Render Dashboard:**
   - https://dashboard.render.com
   - Click on **archaeology-api** service

2. **Check Service Status:**
   - Should show **"Live"** (green)
   - If **"Suspended"** (yellow), click **"Manual Deploy"** → **"Deploy latest commit"**

3. **Get Backend URL:**
   - Copy the service URL (e.g., `https://archaeology-api.onrender.com`)
   - Test it: Open `https://archaeology-api.onrender.com/api/artifacts` in browser
   - Should return: `[]` (empty array) - this is normal if no artifacts

#### Step 2: Update Frontend to Use Correct Backend URL

**Option A: Set Environment Variable in Render (Recommended)**

1. Go to Render dashboard
2. Click on **archaeology-frontend** service
3. Go to **"Environment"** tab
4. Click **"Add Environment Variable"**
5. Add:
   - **Key:** `REACT_APP_API_URL`
   - **Value:** `https://archaeology-api.onrender.com` (use your actual backend URL)
6. Click **"Save Changes"**
7. Service will automatically redeploy (takes 5-10 minutes)

**Option B: Update Code with Backend URL (Faster Fix)**

1. **Update `src/utils/api.ts`:**
   - Change line 18 from:
     ```typescript
     return 'https://archaeology-api.onrender.com';
     ```
   - To your actual backend URL (get it from Render dashboard)

2. **Commit and push:**
   ```powershell
   git add .
   git commit -m "Fix: Update backend API URL"
   git push origin main
   ```

3. **Redeploy on Render:**
   - Go to Render dashboard
   - Click **archaeology-frontend** service
   - Click **"Manual Deploy"** → **"Deploy latest commit"**

#### Step 3: Seed Database (If No Artifacts Showing)

**Option 1: Seed via Script**

1. **Get your backend URL from Render dashboard**

2. **Update seed script:**
   - Open `scripts/seed-artifacts.js`
   - Change line 2:
     ```javascript
     const API_URL = process.env.API_URL || 'https://archaeology-api.onrender.com';
     ```
   - Replace with your actual backend URL

3. **Run seed script:**
   ```powershell
   cd C:\Users\vinit\archaeology-catalog
   npm run seed
   ```

**Option 2: Add Artifacts via Frontend**

1. Go to your website: `https://archaeology-frontend.onrender.com`
2. Login with:
   - Username: `admin`
   - Password: `admin`
3. Click **"Add Artifact"**
4. Fill in details and save

#### Step 4: Test Your Website

1. **Open your website:**
   - `https://archaeology-frontend.onrender.com`

2. **Check browser console (F12):**
   - Look for: `API URL configured: https://archaeology-api.onrender.com`
   - Should show your backend URL
   - Check for any errors

3. **Test login:**
   - Click **"Sign In"**
   - Username: `admin`
   - Password: `admin`
   - Should successfully log in

4. **Test artifacts:**
   - Click **"All Artifacts"**
   - Should show artifacts (if database is seeded)

### Common Issues & Solutions

#### Issue: "Cannot connect to backend API"

**Solution:**
1. Check backend is **"Live"** in Render dashboard
2. Verify backend URL is correct
3. Check backend logs for errors
4. Make sure CORS is configured correctly

#### Issue: "Failed to authenticate"

**Solution:**
1. Verify you're using correct credentials:
   - Username: `admin`
   - Password: `admin`
2. Check backend logs for login errors
3. Test login endpoint directly:
   ```bash
   curl -X POST https://archaeology-api.onrender.com/api/login \
     -H "Content-Type: application/json" \
     -d '{"username":"admin","password":"admin"}'
   ```

#### Issue: Empty artifacts list

**Solution:**
1. Database is empty - seed it using the script
2. Or add artifacts via frontend
3. Check backend returns data: `https://archaeology-api.onrender.com/api/artifacts`

#### Issue: CORS errors

**Solution:**
1. Backend CORS is configured to allow all origins
2. If still seeing errors, check backend logs
3. Verify backend is running and accessible

### Verify Everything is Working

1. **Backend:**
   - ✅ Service is **"Live"** (green)
   - ✅ URL is accessible: `https://archaeology-api.onrender.com/api/artifacts`
   - ✅ Returns JSON (even if empty array)

2. **Frontend:**
   - ✅ Service is **"Live"** (green)
   - ✅ Environment variable `REACT_APP_API_URL` is set
   - ✅ Browser console shows correct API URL
   - ✅ No CORS errors

3. **Database:**
   - ✅ Database is seeded (or has artifacts)
   - ✅ Artifacts are visible on frontend

### Quick Checklist

- [ ] Backend service is **"Live"** in Render dashboard
- [ ] Backend URL is accessible and returns JSON
- [ ] Frontend environment variable `REACT_APP_API_URL` is set to backend URL
- [ ] Frontend has been rebuilt after setting environment variable
- [ ] Browser console shows correct API URL
- [ ] No errors in browser console
- [ ] Database has been seeded (if no artifacts showing)
- [ ] Login works with `admin`/`admin`
- [ ] Artifacts are visible on `/artifacts` page

### Next Steps

1. **Monitor deployment:**
   - Check logs regularly
   - Monitor service health
   - Set up alerts if needed

2. **Test all features:**
   - Login with different roles
   - Add/edit artifacts
   - Generate QR codes
   - Search artifacts

3. **Optimize:**
   - Set up custom domain
   - Configure database backups
   - Monitor performance

## Still Not Working?

1. **Check Render Status:**
   - https://status.render.com
   - Check for service issues

2. **Review Error Logs:**
   - Check both frontend and backend logs in Render dashboard
   - Look for specific error messages

3. **Test Backend Directly:**
   - Visit: `https://archaeology-api.onrender.com/api/artifacts`
   - Visit: `https://archaeology-api.onrender.com/api/login` (should return error - that's normal)
   - Test login: Use curl command above

4. **Check Browser Console:**
   - Open website in browser
   - Press F12
   - Check Console tab for errors
   - Check Network tab for API requests

5. **Contact Support:**
   - If issues persist, check Render documentation
   - Contact Render support if needed

