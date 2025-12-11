# Troubleshooting DATABASE_URL Not Detected

## Problem

Your service is showing:
```
🗄️  Using SQLite database (local development)
```

Instead of:
```
🗄️  Using PostgreSQL database
```

This means the `DATABASE_URL` environment variable is **not set** or **not being detected**.

## Quick Fix Steps

### Step 1: Verify Database Exists

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Check if you have a PostgreSQL database service
3. If not, create it:
   - Click **"New +"** → **"PostgreSQL"**
   - Name: `archaeology-db`
   - Click **"Create Database"**

### Step 2: Get Database Connection String

1. Open your PostgreSQL database service (`archaeology-db`)
2. Scroll to **"Connections"** section
3. Copy the **"Internal Database URL"**
   - Should look like: `postgres://user:pass@host:port/dbname`

### Step 3: Set DATABASE_URL in Backend Service

1. Go to your `archaeology-api` service
2. Click **"Environment"** tab
3. Look for `DATABASE_URL` in the list
4. **If it doesn't exist:**
   - Click **"Add Environment Variable"**
   - Key: `DATABASE_URL`
   - Value: Paste the Internal Database URL
   - Click **"Save Changes"**
5. **If it exists but is wrong:**
   - Click the edit icon (pencil)
   - Update the value
   - Click **"Save Changes"**

### Step 4: Redeploy Service

After saving the environment variable:
1. Render should automatically redeploy
2. If not, go to **"Manual Deploy"** → **"Deploy latest commit"**
3. Wait for deployment to complete

### Step 5: Check Logs

1. Go to **"Logs"** tab
2. Look for:
   - ✅ `🗄️  Using PostgreSQL database` (success!)
   - ❌ `⚠️  DATABASE_URL is NOT set` (still not set)
   - ❌ `🗄️  Using SQLite database` (still using SQLite)

## Common Issues

### Issue 1: Environment Variable Not Saved

**Symptom**: You added it but it's not showing in logs

**Solution**:
1. Double-check the environment variable is saved
2. Make sure there are no extra spaces
3. Verify the service redeployed after saving
4. Check the value starts with `postgres://`

### Issue 2: Wrong Connection String

**Symptom**: Connection errors in logs

**Solution**:
1. Use **Internal Database URL** (not External)
2. Make sure you copied the entire string
3. No extra characters or spaces
4. Should start with `postgres://`

### Issue 3: Database Not Created Yet

**Symptom**: Can't find database service

**Solution**:
1. Create PostgreSQL database first
2. Wait for it to be ready (green status)
3. Then get the connection string
4. Then set it in backend service

### Issue 4: Service Not Redeploying

**Symptom**: Changes not taking effect

**Solution**:
1. Manually trigger deploy: **"Manual Deploy"** → **"Deploy latest commit"**
2. Or make a small code change and push to trigger auto-deploy
3. Wait for deployment to complete

## Verification Checklist

After setting up, verify:

- [ ] PostgreSQL database service exists and is running
- [ ] `DATABASE_URL` is in backend service environment variables
- [ ] Value starts with `postgres://`
- [ ] Service has been redeployed after setting variable
- [ ] Logs show: `🗄️  Using PostgreSQL database`
- [ ] No connection errors in logs

## Debug Information

The updated code now shows debug messages:

- `🔍 DATABASE_URL is set: ...` - Shows it detected the variable
- `⚠️  DATABASE_URL is NOT set` - Shows it's missing
- `🗄️  Using PostgreSQL database` - Success!
- `🗄️  Using SQLite database` - Still using SQLite (DATABASE_URL not set)

## Still Not Working?

1. **Check environment variable format:**
   - Should be: `postgres://user:password@host:port/database`
   - No quotes around it
   - No extra spaces

2. **Verify database is accessible:**
   - Database service should show "Available" status
   - Not sleeping (free tier sleeps after 7 days)

3. **Check service logs for errors:**
   - Look for connection errors
   - Look for authentication errors
   - Look for database not found errors

4. **Try manual deploy:**
   - Sometimes environment variables need a fresh deploy
   - Go to "Manual Deploy" → "Clear build cache & deploy"

## Next Steps

Once you see `🗄️  Using PostgreSQL database` in logs:
- ✅ Database connection is working
- ✅ Schema will be created automatically
- ✅ Your data will persist permanently
- ✅ No more data loss on restarts!

