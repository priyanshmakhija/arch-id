# Verify Database Seeding

## Step 1: Run Seed Script

Open PowerShell in your project directory and run:

```powershell
cd C:\Users\vinit\archaeology-catalog
npm run seed
```

Or run directly:

```powershell
node scripts/seed-artifacts.js
```

## Step 2: Check Output

You should see output like:

```
🌱 Seed Script Starting...
📍 API URL: https://archaeology-api.onrender.com

✅ Using existing catalog: Historical Artifacts Collection
   OR
✅ Created new catalog: Historical Artifacts Collection

📦 Creating 10 artifacts...

  ✅ 1. Neolithic Stone Axe Head (A...)
  ✅ 2. Roman Bronze Coin - Denarius (A...)
  ✅ 3. Ancient Egyptian Scarab Amulet (A...)
  ... (more artifacts)

✨ Seeding complete!
   ✅ Successfully created: 10 artifacts
```

## Step 3: Verify Artifacts Were Created

### Option A: Test Backend Endpoint

Open your browser and visit:
- `https://archaeology-api.onrender.com/api/artifacts`

**Expected:** JSON array with artifacts (not empty `[]`)

### Option B: Test Frontend

1. Go to: `https://archaeology-frontend.onrender.com/artifacts`
2. **Expected:** Grid of artifacts with images, names, details

### Option C: Check Stats

Visit:
- `https://archaeology-api.onrender.com/api/stats`

**Expected:** 
```json
{
  "catalogCount": 1,
  "artifactCount": 10,
  ...
}
```

## Troubleshooting

### Issue: Seed script fails with "fetch is not available"

**Solution:**
```powershell
npm install node-fetch@2
```

Then run the seed script again.

### Issue: Seed script fails with connection error

**Check:**
1. Backend is running: `https://archaeology-api.onrender.com/`
2. Backend returns JSON (not error)
3. Network connection is working

**Solution:**
- Verify backend is accessible
- Check backend logs in Render dashboard
- Make sure backend URL is correct

### Issue: Seed script runs but no artifacts appear

**Check:**
1. Seed script output shows "Successfully created: X artifacts"
2. Backend endpoint returns artifacts: `https://archaeology-api.onrender.com/api/artifacts`
3. Frontend is using correct API URL

**Solution:**
- Check backend logs for errors
- Verify artifacts exist in backend
- Clear browser cache and refresh frontend

### Issue: Frontend still shows "No artifacts found"

**Check:**
1. Browser console (F12) - check for errors
2. Network tab - check if `/api/artifacts` request succeeded
3. API URL in console - should be `https://archaeology-api.onrender.com`

**Solution:**
- Verify frontend environment variable is set
- Check browser console for errors
- Verify backend has artifacts

## Quick Verification Commands

```powershell
# Test backend artifacts endpoint
curl https://archaeology-api.onrender.com/api/artifacts

# Test backend stats endpoint
curl https://archaeology-api.onrender.com/api/stats

# Run seed script
npm run seed
```

## Expected Results

### After Successful Seeding:

1. **Backend:**
   - `/api/artifacts` returns array with 10 artifacts
   - `/api/stats` shows `artifactCount: 10`

2. **Frontend:**
   - `/artifacts` page shows grid of artifacts
   - Each artifact has name, details, QR code
   - Artifacts are clickable to view details

## Next Steps

1. ✅ Run seed script
2. ✅ Verify artifacts were created
3. ✅ Check frontend shows artifacts
4. ✅ Test artifact details page
5. ✅ Test search functionality

## Summary

The seed script should create 10 test artifacts in your database. After running the script:

1. Verify artifacts exist in backend
2. Check frontend shows artifacts
3. Test all features work correctly

If artifacts don't appear, check the troubleshooting section above.

