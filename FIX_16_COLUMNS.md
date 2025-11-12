# Fix: "15 values for 16 columns" Error

## Issue
Error when creating artifacts: `"15 values for 16 columns"`

## Root Cause
The SQL INSERT statement listed 16 columns but only had 15 placeholders (`?`) in the VALUES clause.

## Solution
Added the missing placeholder (`?`) to match all 16 columns.

### Before (WRONG):
```sql
VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
```
15 placeholders for 16 columns ❌

### After (CORRECT):
```sql
VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
```
16 placeholders for 16 columns ✅

## Columns in artifacts table:
1. id
2. catalogId
3. subCatalogId
4. name
5. barcode
6. details
7. length
8. heightDepth
9. width
10. locationFound
11. dateFound
12. images2D
13. image3D
14. video
15. creationDate
16. lastModified

## Next Steps

### Step 1: Commit and Push Changes

```powershell
git add server/src/index.ts
git commit -m "Fix: Add missing placeholder in artifact INSERT statement (16 columns, 16 placeholders)"
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

**Expected:** ✅ Artifact created successfully!

### Step 4: Run Seed Script

If the test works, run the full seed script:

```powershell
npm run seed
```

**Expected:** ✅ All 10 artifacts created successfully!

## Summary

The issue was a simple SQL syntax error - missing one placeholder in the VALUES clause. The fix is straightforward and should resolve the 500 error completely.

After redeploying, artifacts should be created successfully! 🎉

