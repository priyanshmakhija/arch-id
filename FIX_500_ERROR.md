# Fix: 500 Internal Server Error When Creating Artifacts

## Issue
Getting 500 Internal Server Error when trying to create artifacts via seed script.

## Root Cause
The backend was not handling database errors properly, causing unhandled exceptions that resulted in 500 errors.

## Solution

### Changes Made

1. **Added Error Handling to Backend** (`server/src/index.ts`):
   - Added try-catch around database operations
   - Verify catalog exists before inserting artifact
   - Check for duplicate barcodes and IDs
   - Proper error messages for different error types
   - Console logging for debugging

2. **Fixed Test Script** (`test-seed-single.js`):
   - Fixed issue where response body was read twice
   - Better error message display

3. **Improved Seed Script** (`scripts/seed-artifacts.js`):
   - Better error logging
   - Regenerate barcodes with delays
   - Validate all required fields

## Next Steps

### Step 1: Commit and Push Changes

```powershell
git add server/src/index.ts test-seed-single.js scripts/seed-artifacts.js
git commit -m "Fix: Add error handling to artifact creation endpoint"
git push origin main
```

### Step 2: Redeploy Backend on Render

1. Go to Render Dashboard: https://dashboard.render.com
2. Click on `archaeology-api` service
3. Click "Manual Deploy" → "Deploy latest commit"
4. Wait 5-10 minutes for deployment

### Step 3: Test Again

After deployment, run the test script:

```powershell
node test-seed-single.js
```

You should now see:
- **Better error messages** (if there are still errors)
- **Proper error handling** (400 instead of 500 for validation errors)
- **Clear error details** (what exactly failed)

### Step 4: Run Seed Script

If the test works, run the full seed script:

```powershell
npm run seed
```

## Expected Results

### Before Fix:
- ❌ 500 Internal Server Error
- ❌ No error details
- ❌ Unhandled exceptions

### After Fix:
- ✅ Proper error handling
- ✅ Clear error messages
- ✅ 400 errors for validation issues
- ✅ 500 errors only for unexpected issues (with error details)

## Common Errors and Solutions

### Error: "Catalog with id X does not exist"
**Cause:** Catalog ID doesn't exist in database
**Solution:** Verify catalog exists before creating artifacts

### Error: "Artifact with barcode X already exists"
**Cause:** Barcode already exists in database
**Solution:** Use unique barcodes or delete existing artifacts

### Error: "Artifact with id X already exists"
**Cause:** Artifact ID already exists in database
**Solution:** Use unique IDs or delete existing artifacts

### Error: "Database constraint violation"
**Cause:** Foreign key constraint or other database constraint violated
**Solution:** Check database constraints and ensure data is valid

## Debugging

### Check Backend Logs

1. Go to Render Dashboard
2. Click on `archaeology-api` service
3. Click "Logs" tab
4. Look for error messages when artifacts are created

### Test Backend Endpoint

```powershell
# Test with curl
$body = @{
    id = "test123"
    catalogId = "mhvjsmp1cjejfcx64d6"
    name = "Test Artifact"
    barcode = "TEST001"
    details = "Test details"
    locationFound = "Test Site"
    dateFound = "2024-01-01"
    images2D = @()
    creationDate = "2024-01-01T00:00:00.000Z"
    lastModified = "2024-01-01T00:00:00.000Z"
} | ConvertTo-Json

Invoke-RestMethod -Uri "https://archaeology-api.onrender.com/api/artifacts" `
    -Method Post `
    -Headers @{
        "Content-Type" = "application/json"
        "x-user-role" = "admin"
    } `
    -Body $body
```

## Summary

The backend now has proper error handling:
- ✅ Catches database errors
- ✅ Returns proper HTTP status codes
- ✅ Provides clear error messages
- ✅ Logs errors for debugging

After redeploying, you should see better error messages that will help identify the exact issue.

