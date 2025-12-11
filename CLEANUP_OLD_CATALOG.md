# Cleanup Old Catalog Guide

## Overview

This guide helps you remove the "Historical Artifacts Collection" catalog and all its artifacts, leaving only the "Archaeology Artifacts Collection" catalog.

## Option 1: Using the Web Interface (Recommended)

### Step 1: Delete Artifacts

1. **Go to Catalogs page**
   - Navigate to `/catalogs` in your web app
   - Find "Historical Artifacts Collection"

2. **View Catalog Details**
   - Click on "Historical Artifacts Collection"
   - You'll see all artifacts in this catalog

3. **Delete Each Artifact**
   - For each artifact, click the delete button (trash icon)
   - Confirm deletion
   - Repeat until all artifacts are deleted

### Step 2: Delete Catalog

1. **Go back to Catalogs page**
2. **Find "Historical Artifacts Collection"**
3. **Click Delete** (if available in the UI)
4. **Or use API directly** (see Option 2)

## Option 2: Using API Directly

### Step 1: Get Catalog ID

1. **List all catalogs:**
   ```bash
   curl https://archaeology-api.onrender.com/api/catalogs
   ```

2. **Find the ID** of "Historical Artifacts Collection"

### Step 2: Delete All Artifacts

1. **List artifacts in the catalog:**
   ```bash
   curl https://archaeology-api.onrender.com/api/artifacts
   ```

2. **Delete each artifact** (replace `{artifact-id}` with actual ID):
   ```bash
   curl -X DELETE https://archaeology-api.onrender.com/api/artifacts/{artifact-id} \
     -H "x-user-role: admin"
   ```

### Step 3: Delete Catalog

```bash
curl -X DELETE https://archaeology-api.onrender.com/api/catalogs/{catalog-id}
```

## Option 3: Using Database Directly (Advanced)

If you have direct database access:

```sql
-- Delete all artifacts from the catalog
DELETE FROM artifacts WHERE "catalogId" = '{catalog-id}';

-- Delete the catalog
DELETE FROM catalogs WHERE id = '{catalog-id}';
```

## Option 4: Using Cleanup Script

1. **Install dependencies** (if needed):
   ```bash
   npm install node-fetch
   ```

2. **Run cleanup script:**
   ```bash
   API_URL=https://archaeology-api.onrender.com node scripts/cleanup-old-catalog.js
   ```

   **Note**: The script currently only logs what would be deleted. Uncomment the deletion code to actually delete.

## After Cleanup

1. **Verify cleanup:**
   - Go to `/catalogs` page
   - Should only see "Archaeology Artifacts Collection" (or none if you haven't created it yet)

2. **Create default catalog** (if needed):
   - Go to `/add-catalog`
   - Create "Archaeology Artifacts Collection"
   - Or it will be auto-created when you add your first artifact

3. **Start adding artifacts:**
   - Go to `/add-artifact`
   - Select "Archaeology Artifacts Collection"
   - Add your artifacts

## Quick SQL Cleanup (PostgreSQL)

If you have direct database access via Render:

```sql
-- Find the catalog ID
SELECT id, name FROM catalogs WHERE name LIKE '%Historical%';

-- Delete all artifacts from that catalog (replace {catalog-id})
DELETE FROM artifacts WHERE "catalogId" = '{catalog-id}';

-- Delete the catalog
DELETE FROM catalogs WHERE id = '{catalog-id}';
```

## Verification

After cleanup, verify:

- ✅ "Historical Artifacts Collection" is gone
- ✅ All its artifacts are deleted
- ✅ Only "Archaeology Artifacts Collection" exists (or will be auto-created)
- ✅ You can add new artifacts successfully

## Notes

- **Backup first**: If you have important data, export it before deleting
- **Cascading deletes**: Deleting a catalog should delete its artifacts (if foreign key constraints are set up)
- **Auto-creation**: The new default catalog "Archaeology Artifacts Collection" will be auto-created when you add your first artifact if no catalogs exist

## Troubleshooting

### Can't Delete Catalog

**Problem**: Catalog deletion fails

**Solution**:
- Make sure all artifacts are deleted first
- Check foreign key constraints
- Try deleting via API with admin role

### Artifacts Still Showing

**Problem**: Artifacts still appear after catalog deletion

**Solution**:
- Verify artifacts were actually deleted
- Check database directly
- Clear browser cache

### Default Catalog Not Created

**Problem**: "Archaeology Artifacts Collection" not appearing

**Solution**:
- It's auto-created when you add your first artifact
- Or manually create it via `/add-catalog`
- Check that auto-creation code is deployed

