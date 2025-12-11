# Persistence Fix Summary

## Problems Fixed

### 1. ✅ Images and Descriptions Not Persisting
**Root Cause**: SQLite database stored on ephemeral filesystem was being wiped on service restart/sleep.

**Solution**: Migrated to PostgreSQL database which is persistent on Render.

### 2. ✅ URLs Changing for Same Artifact
**Root Cause**: When database was wiped, auto-seed would create new artifacts with new random IDs.

**Solution**: With PostgreSQL persistence, artifacts keep their original IDs. URLs will remain stable once artifacts are created.

## What Changed

### Code Changes

1. **Database Abstraction Layer** (`server/src/db.ts`)
   - Supports both SQLite (local dev) and PostgreSQL (production)
   - Automatically detects which to use based on `DATABASE_URL` environment variable
   - Handles async operations for PostgreSQL

2. **API Routes** (`server/src/index.ts`)
   - Updated all routes to support async database operations
   - Works with both SQLite (sync) and PostgreSQL (async)

3. **Auto-seed** (`server/src/auto-seed.ts`)
   - Updated to support async database operations
   - Only runs when database is empty

4. **Dependencies** (`server/package.json`)
   - Added `pg` (PostgreSQL driver)
   - Added `@types/pg` (TypeScript types)

5. **Render Configuration** (`render.yaml`)
   - Added PostgreSQL database service
   - Configured automatic linking

## What You Need to Do

### Step 1: Install Dependencies

```bash
cd server
npm install
```

### Step 2: Set Up PostgreSQL on Render

**Option A: Automatic (if render.yaml works)**
1. Push changes to Git
2. Render will automatically create the database
3. Verify `DATABASE_URL` is set in backend service

**Option B: Manual Setup**
1. Create PostgreSQL database in Render dashboard
2. Link it to your backend service
3. Set `DATABASE_URL` environment variable

See `POSTGRESQL_SETUP_GUIDE.md` for detailed instructions.

### Step 3: Deploy

1. Commit and push your changes:
   ```bash
   git add .
   git commit -m "Add PostgreSQL support for persistent storage"
   git push
   ```

2. Render will automatically redeploy your services

3. Check logs to verify:
   - Backend should show: `🗄️  Using PostgreSQL database`
   - Database schema will be created automatically

### Step 4: Test

1. Create a new artifact with an image
2. Wait a few minutes (or manually restart the service)
3. Verify the artifact and image are still there
4. Check that the artifact URL doesn't change

## How It Works Now

### Database Selection
- **Production (Render)**: Uses PostgreSQL if `DATABASE_URL` is set
- **Local Development**: Uses SQLite if `DATABASE_URL` is not set

### Data Persistence
- ✅ All artifacts stored in PostgreSQL
- ✅ Images stored as base64 in PostgreSQL
- ✅ Descriptions stored as text
- ✅ Data survives restarts, sleep, and redeployments

### URL Stability
- ✅ Artifact IDs are generated once when created
- ✅ IDs are stored in database and never change
- ✅ URLs remain stable: `/artifact/{id}`
- ✅ Can also access by barcode: `/artifact/by-barcode/{barcode}`

## Important Notes

### Image Storage
- Images are currently stored as **base64 strings** in the database
- This works well for small-medium images (< 1MB each)
- For larger scale, consider external storage (Cloudinary, S3, etc.)

### Database Costs
- **Free Tier**: 90 days free, then $7/month
- **Starter Plan**: $7/month (no sleep, better for production)

### Migration
- Existing SQLite data will be lost (it's ephemeral anyway)
- You'll need to re-upload artifacts after migration
- Auto-seed will populate the database with sample data if empty

## Troubleshooting

### "Using SQLite database" in logs
- `DATABASE_URL` environment variable is not set
- Check backend service environment variables
- Make sure database is linked to backend service

### Connection errors
- Verify database service is running
- Check `DATABASE_URL` is correct
- Use "Internal Database URL" for better performance

### Images not showing
- Images uploaded before migration are lost (expected)
- Re-upload images after PostgreSQL is set up
- Check database connection is working

## Next Steps

1. ✅ Set up PostgreSQL database
2. ✅ Deploy updated code
3. ✅ Test artifact creation with images
4. ✅ Verify persistence after restart
5. ✅ (Optional) Consider external image storage for larger scale

## Support

- See `POSTGRESQL_SETUP_GUIDE.md` for detailed setup instructions
- Check Render service logs for errors
- Verify environment variables are set correctly

