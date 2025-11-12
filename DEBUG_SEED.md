# Debug Seed Script Failures

## Issue
All 10 artifacts are failing to be created. The seed script shows:
- ✅ Successfully created: 0 artifacts
- ❌ Failed: 10 artifacts

## Common Causes

### 1. Authentication/Authorization Error (403)
**Symptoms:** All requests return 403 Forbidden
**Cause:** The `x-user-role` header is not being recognized
**Fix:** Check if the header is being sent correctly

### 2. Validation Error (400)
**Symptoms:** All requests return 400 Bad Request
**Cause:** Required fields are missing or invalid
**Fix:** Check the error message for which fields are invalid

### 3. Database Constraint Error (500)
**Symptoms:** All requests return 500 Internal Server Error
**Cause:** Database constraint violation (e.g., duplicate barcode, foreign key constraint)
**Fix:** Check database constraints and ensure data is unique

### 4. Network Error
**Symptoms:** Connection errors, timeouts
**Cause:** Backend is not accessible or CORS issue
**Fix:** Verify backend is running and accessible

## Diagnostic Steps

### Step 1: Run Test Script

Run the single artifact test script to see the exact error:

```powershell
node test-seed-single.js
```

This will show:
- The exact error response
- The status code
- The error message
- The artifact data being sent

### Step 2: Check Backend Logs

1. Go to Render Dashboard
2. Click on `archaeology-api` service
3. Click on "Logs" tab
4. Look for errors when artifacts are being created

### Step 3: Test Backend Endpoint Manually

Test the backend endpoint directly:

```powershell
# Test with curl
$body = @{
    id = "test123"
    catalogId = "catalog123"
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

### Step 4: Check Database Constraints

The database might have constraints that are causing failures:
- Unique constraint on `barcode`
- Foreign key constraint on `catalogId`
- Not null constraints on required fields

## Updated Seed Script

The seed script has been updated to:
1. ✅ Better error logging - shows exact error messages
2. ✅ Regenerate barcodes with delays to ensure uniqueness
3. ✅ Validate all required fields are present
4. ✅ Show detailed error information

## Next Steps

1. **Run the test script:**
   ```powershell
   node test-seed-single.js
   ```

2. **Check the error output** - it will show:
   - Status code (403, 400, 500, etc.)
   - Error message
   - Artifact data being sent

3. **Based on the error:**
   - **403 Forbidden:** Check authentication/authorization
   - **400 Bad Request:** Check validation errors
   - **500 Internal Server Error:** Check database constraints
   - **Network Error:** Check backend connectivity

4. **Run the seed script with improved logging:**
   ```powershell
   npm run seed
   ```

The improved logging will show exactly what's failing for each artifact.

