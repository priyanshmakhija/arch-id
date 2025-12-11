# Manual PostgreSQL Setup on Render

This guide walks you through manually creating a PostgreSQL database and linking it to your backend service.

## Step 1: Create PostgreSQL Database

1. **Go to Render Dashboard**
   - Visit: https://dashboard.render.com
   - Log in to your account

2. **Create New Database**
   - Click the **"New +"** button (top right)
   - Select **"PostgreSQL"** from the dropdown

3. **Configure Database**
   - **Name**: `archaeology-db` (or any name you prefer)
   - **Database**: Leave default or set to `archaeology_db`
   - **User**: Leave default (auto-generated)
   - **Region**: Choose the same region as your backend service (for better performance)
   - **Plan**: 
     - **Free** (for testing - 90 days free, then $7/month)
     - **Starter** ($7/month - recommended for production, no sleep)
   - **PostgreSQL Version**: Leave default (latest)

4. **Create Database**
   - Click **"Create Database"**
   - Wait 1-2 minutes for database to be created
   - You'll see a green status when it's ready

## Step 2: Get Database Connection String

1. **Open Database Service**
   - Click on your `archaeology-db` service in the dashboard

2. **Find Connection String**
   - Scroll down to **"Connections"** section
   - You'll see two connection strings:
     - **Internal Database URL** (recommended - faster, same network)
     - **External Database URL** (for external access)

3. **Copy Internal Database URL**
   - Click the **"Copy"** button next to **"Internal Database URL"**
   - It will look like: `postgres://user:password@dpg-xxxxx-a.oregon-postgres.render.com/archaeology_db`
   - **Save this URL** - you'll need it in the next step

## Step 3: Link Database to Backend Service

1. **Open Backend Service**
   - Go to your `archaeology-api` service in the dashboard

2. **Go to Environment Tab**
   - Click on **"Environment"** in the left sidebar

3. **Add DATABASE_URL Variable**
   - Click **"Add Environment Variable"** button
   - **Key**: `DATABASE_URL`
   - **Value**: Paste the Internal Database URL you copied in Step 2
   - Click **"Save Changes"**

   **OR use the Link Database feature:**
   - Click **"Link Database"** button (if available)
   - Select `archaeology-db` from the dropdown
   - Render will automatically set `DATABASE_URL`

4. **Verify Environment Variable**
   - You should now see `DATABASE_URL` in your environment variables list
   - The value should start with `postgres://`

## Step 4: Verify Setup

1. **Check Service Logs**
   - Go to your `archaeology-api` service
   - Click on **"Logs"** tab
   - Look for: `🗄️  Using PostgreSQL database`
   - If you see: `🗄️  Using SQLite database (local development)`, the `DATABASE_URL` is not set correctly

2. **Check for Errors**
   - Look for any database connection errors
   - Common errors:
     - `Connection refused` → Database might be sleeping (free tier) or wrong URL
     - `Authentication failed` → Wrong password in connection string
     - `Database does not exist` → Wrong database name

3. **Test Database Connection**
   - The schema will be created automatically on first startup
   - Check logs for schema creation messages
   - No errors = connection successful!

## Step 5: Test Persistence

1. **Create an Artifact**
   - Use your web interface to create a test artifact with an image
   - Verify it saves successfully

2. **Restart Service** (optional test)
   - Go to your `archaeology-api` service
   - Click **"Manual Deploy"** → **"Clear build cache & deploy"**
   - Wait for deployment to complete

3. **Verify Data Persists**
   - Check that your test artifact is still there
   - Images should still be visible
   - Data should not be lost

## Troubleshooting

### Database URL Not Working

**Problem**: Service still shows "Using SQLite database"

**Solutions**:
1. Verify `DATABASE_URL` is set in environment variables
2. Check that the value starts with `postgres://`
3. Make sure you saved the changes (service should redeploy automatically)
4. Check service logs for connection errors

### Database Connection Errors

**Error**: `Connection refused` or `timeout`

**Solutions**:
1. Use **Internal Database URL** (not external) - it's faster and more reliable
2. Make sure database and backend are in the same region
3. Check that database service is running (not sleeping)
4. On free tier, database sleeps after 7 days - wake it up by accessing it

**Error**: `Authentication failed`

**Solutions**:
1. Verify you copied the entire connection string correctly
2. Make sure there are no extra spaces or characters
3. Try copying the connection string again from the database service

**Error**: `Database does not exist`

**Solutions**:
1. Check the database name in the connection string matches your actual database
2. Verify the database was created successfully

### Database is Sleeping (Free Tier)

**Problem**: Database goes to sleep after 7 days of inactivity

**Solutions**:
1. **Wake it up**: Make a request to your backend (it will wake the database)
2. **Upgrade to Starter**: $7/month prevents sleep
3. **Use a keep-alive service**: External service that pings your database periodically

## Quick Reference

### Environment Variables Checklist

Your `archaeology-api` service should have:
- ✅ `NODE_ENV` = `production`
- ✅ `PORT` = `4000`
- ✅ `CORS_ORIGIN` = `https://archaeology-frontend.onrender.com`
- ✅ `DATABASE_URL` = `postgres://...` (your database connection string)
- ✅ `DISABLE_AUTO_SEED` = `true` (optional, but recommended)

### Database Service Info

- **Service Name**: `archaeology-db`
- **Type**: PostgreSQL
- **Status**: Should be "Available" (green)
- **Region**: Should match your backend service region

## Next Steps

Once setup is complete:

1. ✅ Database is created and running
2. ✅ `DATABASE_URL` is set in backend service
3. ✅ Backend logs show "Using PostgreSQL database"
4. ✅ Schema is created automatically
5. ✅ Test creating artifacts with images
6. ✅ Verify data persists after restart

## Support

If you're still having issues:
1. Check Render's documentation: https://render.com/docs/databases
2. Check service logs for specific error messages
3. Verify all environment variables are set correctly
4. Make sure database service is running (not sleeping)

