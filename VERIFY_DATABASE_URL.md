# Verify DATABASE_URL is Set Correctly

## Issue: Still Seeing SQLite

If you're still seeing `🗄️  Using SQLite database` after setting `DATABASE_URL`, follow these steps:

## Step 1: Verify Environment Variable in Render

1. **Go to Render Dashboard**
   - Open your `archaeology-api` service
   - Click **"Environment"** tab

2. **Check for DATABASE_URL**
   - Look for `DATABASE_URL` in the environment variables list
   - **If it's NOT there:**
     - Click **"Add Environment Variable"**
     - Key: `DATABASE_URL`
     - Value: Your PostgreSQL connection string (from `archaeology-db` service)
     - Click **"Save Changes"**

3. **If DATABASE_URL exists, verify the value:**
   - Click the edit icon (pencil) next to it
   - Make sure it:
     - Starts with `postgres://`
     - Has no quotes around it
     - Has no extra spaces
     - Is the complete connection string

4. **Copy the exact value** (for debugging)

## Step 2: Verify Code is Deployed

The debug logging should show:
- `⚠️  DATABASE_URL is NOT set` (if not set)
- `🔍 DATABASE_URL is set: ...` (if set)

**If you don't see these messages**, the updated code hasn't been deployed:

1. **Check if code is committed:**
   ```bash
   git status
   git log --oneline -5
   ```

2. **Commit and push if needed:**
   ```bash
   git add server/src/db.ts
   git commit -m "Add DATABASE_URL debug logging"
   git push
   ```

3. **Trigger manual deploy in Render:**
   - Go to `archaeology-api` service
   - Click **"Manual Deploy"**
   - Select **"Deploy latest commit"**
   - Or **"Clear build cache & deploy"** (recommended)

## Step 3: Check Build Logs

1. Go to your `archaeology-api` service
2. Click **"Events"** or **"Logs"** tab
3. Look at the **build logs** (not runtime logs)
4. Verify:
   - Code is being built from latest commit
   - No build errors
   - TypeScript compilation succeeded

## Step 4: Check Runtime Logs

After deployment, check **runtime logs**:

**Expected output if DATABASE_URL is set:**
```
🔍 DATABASE_URL is set: postgres://user:pass...host:port/db
🗄️  Using PostgreSQL database
```

**Expected output if DATABASE_URL is NOT set:**
```
⚠️  DATABASE_URL is NOT set - using SQLite
   To use PostgreSQL, set DATABASE_URL environment variable
🗄️  Using SQLite database (local development)
```

## Step 5: Common Issues

### Issue 1: Environment Variable Not Visible to Code

**Possible causes:**
- Variable was added but service didn't redeploy
- Build cache issue
- Variable name has typo (should be exactly `DATABASE_URL`)

**Solution:**
1. Verify variable is saved in Render
2. Do a **"Clear build cache & deploy"**
3. Check logs for the debug messages

### Issue 2: Variable Set But Wrong Format

**Check:**
- Starts with `postgres://` (not `postgresql://` or `http://`)
- No quotes: `postgres://...` ✅ (not `"postgres://..."` ❌)
- Complete string (not truncated)

**Solution:**
- Copy the **Internal Database URL** directly from database service
- Don't modify it
- Paste it exactly as shown

### Issue 3: Database Connection String Format

**Correct format:**
```
postgres://username:password@hostname:port/database_name
```

**Example:**
```
postgres://archaeology_user:abc123@dpg-xxxxx-a.oregon-postgres.render.com:5432/archaeology_db_xxxx
```

### Issue 4: Code Not Updated

**If you don't see the debug messages**, the code hasn't been deployed:

1. **Verify code is in repository:**
   - Check `server/src/db.ts` has the debug logging
   - Lines 112-118 should have the debug code

2. **Force rebuild:**
   - Render → Manual Deploy → Clear build cache & deploy

## Step 6: Test Connection String

If you want to verify the connection string works:

1. **Get connection string from database service:**
   - Go to `archaeology-db` service
   - Copy **Internal Database URL**

2. **Test locally (optional):**
   ```bash
   # Set environment variable
   export DATABASE_URL="postgres://..."
   
   # Run server
   cd server
   npm start
   ```

3. **Check logs** - should show PostgreSQL

## Quick Checklist

- [ ] `DATABASE_URL` exists in Render environment variables
- [ ] Value starts with `postgres://`
- [ ] No quotes or extra spaces
- [ ] Code changes committed and pushed
- [ ] Service redeployed (check Events tab)
- [ ] Build logs show successful build
- [ ] Runtime logs show debug messages
- [ ] Runtime logs show "Using PostgreSQL database"

## Still Not Working?

If after all these steps you still see SQLite:

1. **Double-check environment variable:**
   - Go to Environment tab
   - Click edit on `DATABASE_URL`
   - Copy the value
   - Verify it's exactly what you expect

2. **Try clearing build cache:**
   - Manual Deploy → Clear build cache & deploy

3. **Check for multiple environment variable definitions:**
   - Sometimes there can be conflicts
   - Make sure there's only one `DATABASE_URL`

4. **Verify database service is running:**
   - `archaeology-db` should show "Available" status
   - Not sleeping or paused

5. **Check service region:**
   - Database and API should be in same region for Internal URL

## Next Steps

Once you see `🗄️  Using PostgreSQL database`:
- ✅ Connection is working
- ✅ Schema will be created automatically
- ✅ Data will persist permanently
- ✅ No more SQLite!

