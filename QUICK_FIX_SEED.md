# Quick Fix: Seed Script Failing

## Issue
All 10 artifacts are failing to be created:
- ✅ Successfully created: 0 artifacts
- ❌ Failed: 10 artifacts

## Solution

### Step 1: Run Test Script to See Exact Error

Run the test script to see the exact error:

```powershell
node test-seed-single.js
```

This will show:
- The exact error message
- The HTTP status code (403, 400, 500, etc.)
- The response from the backend

### Step 2: Check the Error

Based on the error code:

#### If Error is 403 (Forbidden):
**Problem:** Authentication/authorization issue
**Fix:** The `x-user-role` header might not be recognized
**Solution:** Check if backend is receiving the header correctly

#### If Error is 400 (Bad Request):
**Problem:** Validation error
**Fix:** Check which fields are missing or invalid
**Solution:** Verify all required fields are present

#### If Error is 500 (Internal Server Error):
**Problem:** Database constraint violation
**Fix:** Check for duplicate barcodes or foreign key constraints
**Solution:** Ensure barcodes are unique and catalogId exists

### Step 3: Run Improved Seed Script

The seed script has been improved with:
- ✅ Better error logging
- ✅ Delays between requests
- ✅ Regenerated barcodes
- ✅ Validation of required fields

Run it:

```powershell
npm run seed
```

The improved logging will show exactly what's failing.

## Most Likely Issues

### 1. Authentication Error (403)
The backend requires `x-user-role: admin` header, which should be sent. If this is failing, check:
- Is the header being sent correctly?
- Is the backend recognizing the header?

### 2. Validation Error (400)
The backend schema requires:
- `id`: string
- `catalogId`: string (must exist in database)
- `name`: string (min 1 character)
- `barcode`: string (min 1 character)
- `details`: string
- `locationFound`: string
- `dateFound`: string
- `images2D`: array of strings
- `creationDate`: string
- `lastModified`: string

All these fields should be present in the seed script.

### 3. Database Constraint Error (500)
Possible issues:
- Duplicate barcodes (if database has unique constraint)
- Foreign key constraint on `catalogId` (catalog doesn't exist)
- Other database constraints

## Next Steps

1. **Run test script:**
   ```powershell
   node test-seed-single.js
   ```

2. **Check the error output** - it will show the exact issue

3. **Share the error** so we can fix it properly

4. **Run seed script:**
   ```powershell
   npm run seed
   ```

## Updated Seed Script

The seed script now:
- ✅ Regenerates barcodes with delays to ensure uniqueness
- ✅ Validates all required fields
- ✅ Shows detailed error messages
- ✅ Logs request/response details

## Summary

The seed script is failing, but the improved error logging will show exactly why. Run `node test-seed-single.js` to see the exact error, then we can fix it.

