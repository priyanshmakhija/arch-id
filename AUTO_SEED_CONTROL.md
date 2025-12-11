# Auto-Seed Control Guide

## Overview

The application includes an auto-seed feature that populates the database with sample artifacts when the database is empty. This is useful for:
- **SQLite (local development)**: Fresh database setup
- **Testing**: Quick database population

However, with **PostgreSQL on Render**, your data persists, so you typically don't want auto-seed to run on every restart.

## How Auto-Seed Works

Auto-seed **only runs** when:
1. ✅ Database is **completely empty** (no artifacts exist)
2. ✅ `DISABLE_AUTO_SEED` environment variable is **not** set to `"true"`

Auto-seed **skips** when:
- ❌ Database already has artifacts (even just 1)
- ❌ `DISABLE_AUTO_SEED=true` is set

## Disabling Auto-Seed

### Option 1: Environment Variable (Recommended for PostgreSQL)

Set the `DISABLE_AUTO_SEED` environment variable to `"true"`:

**On Render:**
1. Go to your `archaeology-api` service
2. Navigate to **Environment** tab
3. Add environment variable:
   - **Key**: `DISABLE_AUTO_SEED`
   - **Value**: `true`
4. Click **Save Changes**
5. Service will automatically redeploy

**In render.yaml:**
The `render.yaml` file already includes this setting:
```yaml
envVars:
  - key: DISABLE_AUTO_SEED
    value: "true"
```

### Option 2: Keep It Enabled (But It Won't Re-Seed)

Even if auto-seed is enabled, it **won't re-seed** if your database already has data. With PostgreSQL:
- ✅ First deployment: Seeds sample data (if database is empty)
- ✅ Subsequent restarts: Skips seeding (database has data)

## When to Use Each Option

### Disable Auto-Seed (`DISABLE_AUTO_SEED=true`)
**Use when:**
- ✅ Using PostgreSQL for production
- ✅ You have real data you want to keep
- ✅ You don't want any sample data
- ✅ You want to control exactly what's in your database

### Enable Auto-Seed (default)
**Use when:**
- ✅ Local development with SQLite
- ✅ Testing with fresh databases
- ✅ You want sample data for demos
- ✅ Database is empty and you want quick setup

## Current Behavior

### With PostgreSQL (Production)
- **First deployment**: Seeds if database is empty
- **Subsequent restarts**: Skips (database has data)
- **Recommended**: Set `DISABLE_AUTO_SEED=true` to prevent any seeding

### With SQLite (Local Development)
- **First run**: Seeds if database file doesn't exist or is empty
- **Subsequent runs**: Skips (database has data)
- **Note**: SQLite file persists locally, so it won't re-seed

## Manual Seeding

If you want to seed the database manually:

1. **Temporarily enable auto-seed**:
   - Remove or set `DISABLE_AUTO_SEED=false`
   - Clear your database (delete all artifacts)
   - Restart the service

2. **Or use the seed script**:
   ```bash
   cd server
   npm run seed  # If you have a seed script
   ```

## Troubleshooting

### Auto-seed runs every restart
**Problem**: Database is being wiped or is empty each time

**Solutions**:
1. Check that PostgreSQL is properly connected (`DATABASE_URL` is set)
2. Verify database persists between restarts
3. Set `DISABLE_AUTO_SEED=true` to prevent seeding entirely

### Auto-seed doesn't run when I want it to
**Problem**: Database already has data

**Solution**: 
- Clear the database manually, or
- Remove `DISABLE_AUTO_SEED` environment variable

### Want to re-seed with fresh sample data
**Solution**:
1. Delete all artifacts from database (via API or database client)
2. Restart service (auto-seed will run if enabled)

## Best Practice

For **production with PostgreSQL**:
```yaml
envVars:
  - key: DISABLE_AUTO_SEED
    value: "true"
```

This ensures:
- ✅ No unwanted sample data
- ✅ Full control over your database
- ✅ No seeding on restarts/deployments

For **local development**:
- Leave `DISABLE_AUTO_SEED` unset (or `false`)
- Auto-seed will populate empty databases with sample data
- Useful for quick testing and development

