# PostgreSQL Setup Guide for Render

This guide explains how to set up persistent database storage using PostgreSQL on Render, so your artifacts, images, and descriptions are never lost.

## Problem

On Render's free tier, the filesystem is **ephemeral** - meaning it gets wiped when:
- The service restarts
- The service goes to sleep (after 15 minutes of inactivity on free tier)
- The service is redeployed

This means:
- ❌ SQLite database files are lost
- ❌ Images stored in the database are lost
- ❌ All artifact data is lost

## Solution: PostgreSQL Database

PostgreSQL databases on Render are **persistent** - they survive restarts, sleep, and redeployments.

## Setup Steps

### Option 1: Using render.yaml (Recommended)

The `render.yaml` file has been updated to include a PostgreSQL database. If your Render account supports automatic configuration from `render.yaml`:

1. **Push your changes to Git**
   ```bash
   git add .
   git commit -m "Add PostgreSQL support for persistent storage"
   git push
   ```

2. **Render will automatically:**
   - Create a PostgreSQL database named `archaeology-db`
   - Link it to your backend service
   - Set the `DATABASE_URL` environment variable automatically

3. **Verify the setup:**
   - Go to your Render dashboard
   - Check that `archaeology-db` service exists
   - Check that `archaeology-api` has `DATABASE_URL` environment variable set

### Option 2: Manual Setup

If `render.yaml` doesn't work automatically, follow these steps:

#### Step 1: Create PostgreSQL Database

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click **"New +"** button
3. Select **"PostgreSQL"**
4. Configure:
   - **Name**: `archaeology-db`
   - **Database**: `archaeology_db` (or leave default)
   - **User**: (auto-generated)
   - **Region**: Choose closest to your backend
   - **Plan**: Free (for testing) or Starter ($7/month for production)
5. Click **"Create Database"**
6. Wait for database to be created (takes 1-2 minutes)

#### Step 2: Link Database to Backend

1. Go to your `archaeology-api` service
2. Go to **"Environment"** tab
3. Click **"Add Environment Variable"**
4. Add:
   - **Key**: `DATABASE_URL`
   - **Value**: Click **"Link Database"** and select `archaeology-db`
   - OR manually copy the **"Internal Database URL"** from the database service
5. Click **"Save Changes"**
6. The service will automatically redeploy

#### Step 3: Verify Connection

1. Check the backend service logs
2. You should see: `🗄️  Using PostgreSQL database`
3. If you see: `🗄️  Using SQLite database (local development)`, the `DATABASE_URL` is not set correctly

## How It Works

### Database Detection

The application automatically detects which database to use:

- **If `DATABASE_URL` starts with `postgres://`**: Uses PostgreSQL (production)
- **Otherwise**: Uses SQLite (local development)

### Schema Creation

The database schema is automatically created on first startup:
- `catalogs` table
- `artifacts` table with all required columns
- Foreign key relationships
- Unique constraints on barcodes

### Data Persistence

- ✅ **Artifacts**: Stored permanently in PostgreSQL
- ✅ **Images**: Stored as base64 in PostgreSQL (works for small-medium images)
- ✅ **Descriptions**: Stored as text in PostgreSQL
- ✅ **All data survives**: Restarts, sleep, redeployments

## Image Storage

Currently, images are stored as **base64 strings** in the PostgreSQL database. This works well for:
- Small to medium images (< 1MB each)
- Up to ~100 artifacts with images

### For Larger Scale (Future Enhancement)

If you need to store many large images, consider:
1. **Cloudinary** - Free tier: 25GB storage
2. **AWS S3** - Pay-as-you-go
3. **Render Disk** - Persistent disk storage (paid plans)

## Troubleshooting

### Database Connection Fails

**Error**: `Connection refused` or `timeout`

**Solutions**:
1. Verify `DATABASE_URL` is set in backend service environment variables
2. Make sure database service is running (not sleeping)
3. Use **"Internal Database URL"** (not external) for better performance
4. Check that database and backend are in the same region

### Schema Creation Fails

**Error**: `relation "catalogs" already exists`

**Solution**: This is normal if the database already has tables. The app uses `CREATE TABLE IF NOT EXISTS`.

### Images Not Showing

**Possible causes**:
1. Images were stored before PostgreSQL migration - they're lost (need to re-upload)
2. Base64 data is too large - consider external storage
3. Database connection issue - check logs

### Auto-seed Not Working

**Check**:
1. Database logs for errors
2. Backend logs for auto-seed messages
3. Verify database is empty (auto-seed only runs on empty database)

## Migration from SQLite

If you have existing data in SQLite:

1. **Export data** (if possible, before migration):
   ```bash
   # On local machine
   sqlite3 server/data.sqlite .dump > backup.sql
   ```

2. **After PostgreSQL is set up**, you can:
   - Re-upload artifacts through the web interface
   - Or write a migration script to import from SQLite

## Cost

- **Free Tier**: 
  - PostgreSQL: 90 days free, then $7/month
  - 1GB storage, 1GB RAM
  - Database sleeps after 7 days of inactivity
- **Starter Plan**: $7/month
  - No sleep
  - 1GB storage, 1GB RAM
  - Better for production

## Next Steps

1. ✅ Set up PostgreSQL database
2. ✅ Link to backend service
3. ✅ Verify connection in logs
4. ✅ Test creating artifacts with images
5. ✅ Verify data persists after service restart

## Support

If you encounter issues:
1. Check Render service logs
2. Check database logs
3. Verify environment variables
4. Check this guide's troubleshooting section

