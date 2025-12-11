# Removing archaeology-frontend Service

## Overview

The `archaeology-frontend` service is no longer being used. Your actual frontend is `arch-id`. This guide helps you remove the unused service.

## Changes Made

### 1. Updated render.yaml
- ✅ Removed `archaeology-frontend` service definition
- ✅ Updated `CORS_ORIGIN` to point to `https://arch-id.onrender.com`

### 2. What You Need to Do

#### Option A: If render.yaml is Auto-Applied

1. **Commit and push changes:**
   ```bash
   git add render.yaml
   git commit -m "Remove unused archaeology-frontend service, update CORS to arch-id"
   git push
   ```

2. **Render will automatically:**
   - Remove the `archaeology-frontend` service
   - Update backend CORS settings

#### Option B: Manual Removal

If render.yaml doesn't auto-apply, do it manually:

1. **Delete Service in Render Dashboard:**
   - Go to [Render Dashboard](https://dashboard.render.com)
   - Find `archaeology-frontend` service
   - Click on the service
   - Go to **Settings** tab
   - Scroll down and click **"Delete Service"**
   - Confirm deletion

2. **Update Backend CORS:**
   - Go to `archaeology-api` service
   - Click **"Environment"** tab
   - Find `CORS_ORIGIN` variable
   - Update value to: `https://arch-id.onrender.com`
   - Click **"Save Changes"**

## Verify Changes

After removing the service:

1. **Check Render Dashboard:**
   - `archaeology-frontend` should no longer appear
   - Only `archaeology-api` and `archaeology-db` should be visible

2. **Verify CORS:**
   - Check `archaeology-api` environment variables
   - `CORS_ORIGIN` should be `https://arch-id.onrender.com`

3. **Test Frontend:**
   - Visit `https://arch-id.onrender.com`
   - Should load without CORS errors
   - API calls should work correctly

## Current Services

After cleanup, you should have:

1. **archaeology-db** (PostgreSQL Database)
   - Type: PostgreSQL
   - Purpose: Persistent data storage

2. **archaeology-api** (Backend API)
   - Type: Web Service
   - Purpose: API server
   - CORS: `https://arch-id.onrender.com`

3. **arch-id** (Frontend - separate service)
   - Type: Web Service (or Static Site)
   - Purpose: React frontend application
   - This is your actual frontend service

## Notes

- The `arch-id` service is separate and should remain
- Only `archaeology-frontend` (unused) is being removed
- Backend CORS is updated to allow `arch-id` instead

## Troubleshooting

### CORS Errors After Removal

If you see CORS errors:

1. Verify `CORS_ORIGIN` in `archaeology-api` is set to `https://arch-id.onrender.com`
2. Check that the frontend URL matches exactly
3. Restart the backend service if needed

### Service Still Appears

If `archaeology-frontend` still appears:

1. Check if it's managed by render.yaml (may need manual deletion)
2. Delete it manually from Render Dashboard
3. Verify render.yaml doesn't have it defined

## Summary

✅ Removed `archaeology-frontend` from render.yaml
✅ Updated CORS to point to `arch-id`
✅ Cleaned up unused service definition

Your setup now only includes the services you're actually using!

