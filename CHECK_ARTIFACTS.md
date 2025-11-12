# Check Why Artifacts Aren't Showing

## Quick Diagnostic Steps

### Step 1: Check if Artifacts Exist in Backend

**Test Backend Directly:**

Open these URLs in your browser:

1. **Artifacts endpoint:**
   - `https://archaeology-api.onrender.com/api/artifacts`
   - **Expected:** JSON array with artifacts (or empty `[]` if no artifacts)

2. **Stats endpoint:**
   - `https://archaeology-api.onrender.com/api/stats`
   - **Expected:** JSON with artifact count

**If artifacts exist:** The backend has artifacts, so the issue is with the frontend.

**If no artifacts:** The database is empty, so you need to run the seed script.

### Step 2: Check Seed Script Output

When you run `npm run seed`, check the output:

**Expected output:**
```
✨ Seeding complete!
   ✅ Successfully created: 10 artifacts
   ❌ Failed: 0 artifacts
```

**If you see "Successfully created: 0 artifacts":**
- The seed script ran but didn't create any artifacts
- Check the error messages above
- Fix the errors and run again

**If you see "Successfully created: X artifacts":**
- Artifacts were created successfully
- Check if they exist in the backend (Step 1)
- If they exist, check the frontend (Step 3)

### Step 3: Check Frontend Connection

1. **Open your website:**
   - `https://archaeology-frontend.onrender.com/artifacts`

2. **Open browser console (F12):**
   - Look for: `API URL configured: https://archaeology-api.onrender.com`
   - Check for any errors in the console
   - Check Network tab for API requests

3. **Check Network tab:**
   - Look for request to: `https://archaeology-api.onrender.com/api/artifacts`
   - Check if request is successful (status 200)
   - Check the response - should contain artifacts array

### Step 4: Check Frontend Environment Variable

1. **Go to Render Dashboard:**
   - https://dashboard.render.com

2. **Click on `archaeology-frontend` service**

3. **Go to "Environment" tab**

4. **Check if `REACT_APP_API_URL` is set:**
   - **Key:** `REACT_APP_API_URL`
   - **Value:** `https://archaeology-api.onrender.com`

5. **If not set:**
   - Add the environment variable
   - Save and redeploy frontend

### Step 5: Check Database Persistence

**Important:** On Render's free tier, the database is **ephemeral**, meaning:
- Database gets wiped on every service restart
- Database gets wiped on every deployment
- Data doesn't persist between deployments

**Solution:**
- After seeding, artifacts exist until next restart/deployment
- Need to reseed after every deployment/restart
- Or upgrade to paid tier for persistent database

## Common Issues and Solutions

### Issue 1: Seed Script Shows "Successfully created: 0 artifacts"

**Cause:** Seed script is failing silently or errors are being caught.

**Solution:**
1. Check seed script output for error messages
2. Run `node test-seed-single.js` to test a single artifact
3. Check backend logs in Render dashboard
4. Verify backend is accessible

### Issue 2: Artifacts Exist in Backend but Not Showing on Frontend

**Cause:** Frontend not connected to backend or API URL mismatch.

**Solution:**
1. Check browser console for API URL
2. Verify frontend environment variable is set
3. Check Network tab for API requests
4. Verify CORS is configured correctly

### Issue 3: Database is Empty After Deployment

**Cause:** Database is ephemeral on Render free tier.

**Solution:**
1. Reseed database after every deployment
2. Or upgrade to paid tier for persistent database
3. Or use external database (PostgreSQL, etc.)

### Issue 4: Frontend Shows "No artifacts found"

**Cause:** 
- Database is empty
- Frontend can't connect to backend
- API URL is incorrect

**Solution:**
1. Check if artifacts exist in backend (Step 1)
2. Check frontend API URL (Step 3)
3. Check browser console for errors
4. Run seed script if database is empty

## Quick Fix Checklist

- [ ] Check backend has artifacts: `https://archaeology-api.onrender.com/api/artifacts`
- [ ] Check seed script output shows "Successfully created: X artifacts"
- [ ] Check browser console shows correct API URL
- [ ] Check Network tab shows successful API requests
- [ ] Check frontend environment variable is set
- [ ] Check if database is ephemeral (artifacts wiped on restart)

## Next Steps

1. **Run diagnostic script:**
   ```powershell
   node diagnose-issue.js
   ```

2. **Check backend directly:**
   - Visit: `https://archaeology-api.onrender.com/api/artifacts`
   - Should return JSON array with artifacts

3. **Check frontend:**
   - Visit: `https://archaeology-frontend.onrender.com/artifacts`
   - Open browser console (F12)
   - Check for errors and API requests

4. **Run seed script if needed:**
   ```powershell
   npm run seed
   ```

## Summary

The issue is likely one of:
1. Database is empty (artifacts not created)
2. Frontend not connected to backend (API URL mismatch)
3. Database is ephemeral (artifacts wiped on restart)
4. Frontend environment variable not set

Run the diagnostic steps above to identify the exact issue.

