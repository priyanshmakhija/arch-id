# Deployment Checklist

## Before Deploying

- [x] Code is pushed to GitHub
- [x] `.gitignore` is configured (node_modules, etc. excluded)
- [ ] Remove any tokens/secrets from `.git/config` (if present)
- [ ] Test production build locally

## Quick Deploy Options

### Option 1: Render (Recommended - Easiest)

**Time: 10 minutes**

1. Go to [render.com](https://render.com) and sign up
2. Click **"New +"** → **"Blueprint"**
3. Connect GitHub account
4. Select repository: `priyanshmakhija/arch-id`
5. Render detects `render.yaml` automatically
6. Click **"Apply"** to deploy both services
7. Wait 5-10 minutes
8. Access your website!

**URLs you'll get:**
- Frontend: `https://archaeology-frontend.onrender.com`
- Backend: `https://archaeology-api.onrender.com`

**Free Tier Note:** Services spin down after 15 min inactivity. First request after spin-down is slow (~30 seconds).

### Option 2: Vercel (Frontend) + Render (Backend)

**Time: 15 minutes**

**Deploy Frontend to Vercel:**
1. Go to [vercel.com](https://vercel.com) and sign up
2. Click **"New Project"**
3. Import GitHub repository
4. Configure:
   - Framework: Create React App
   - Build Command: `npm run build`
   - Output Directory: `build`
5. Add Environment Variable:
   - Key: `REACT_APP_API_URL`
   - Value: `https://your-backend-url.onrender.com` (get this after deploying backend)
6. Click **"Deploy"**

**Deploy Backend to Render:**
1. Follow Option 1 steps for backend only
2. Get backend URL
3. Update Vercel environment variable with backend URL
4. Redeploy frontend

### Option 3: Railway (Full Stack)

**Time: 15 minutes**

1. Go to [railway.app](https://railway.app) and sign up
2. Create new project
3. Deploy backend:
   - Add GitHub repo
   - Set root directory: `server`
   - Set start command: `npm start`
4. Deploy frontend:
   - Add GitHub repo (same)
   - Set root directory: `.` (root)
   - Set build command: `npm install && npm run build`
   - Set start command: `npx serve -s build`
   - Add env var: `REACT_APP_API_URL=https://your-backend-url.railway.app`

## Environment Variables to Set

### Frontend (Vercel/Render)
```
REACT_APP_API_URL=https://your-backend-url.onrender.com
```

### Backend (Render/Railway)
```
NODE_ENV=production
PORT=4000
CORS_ORIGIN=https://your-frontend-url.vercel.app
```

## After Deployment

1. **Test the website:**
   - Visit frontend URL
   - Try logging in (admin/admin)
   - Test adding/viewing artifacts
   - Test QR code generation

2. **Update CORS** (if needed):
   - If frontend can't connect to backend
   - Update backend CORS to allow frontend URL

3. **Set up monitoring:**
   - Use Render/Vercel built-in logs
   - Set up Uptime Robot (free) to ping URL every 10 minutes (keeps Render services awake)

4. **Database backups:**
   - For SQLite: Download database file periodically
   - For production: Consider PostgreSQL (Render offers free tier)

## Troubleshooting

### Frontend can't connect to backend
- Check `REACT_APP_API_URL` environment variable
- Verify backend is running (check Render dashboard)
- Check browser console for CORS errors
- Verify backend CORS settings

### Backend shows errors
- Check Render logs: Dashboard → Service → Logs
- Verify environment variables are set
- Check database path is correct
- Verify Node.js version

### Services keep spinning down
- This is normal for Render free tier
- Use Uptime Robot to ping URL every 10 minutes
- Or upgrade to paid plan for always-on service

## Security Reminders

1. **Remove tokens from Git:**
   ```powershell
   git remote set-url origin https://github.com/priyanshmakhija/arch-id.git
   ```

2. **Use environment variables:**
   - Never commit secrets to Git
   - Use Render/Vercel environment variables

3. **Update passwords:**
   - Change default passwords (admin/admin) for production
   - Consider using environment variables for user credentials

## Quick Start (Recommended)

**Deploy to Render (Easiest):**

1. Push code to GitHub ✅ (already done)
2. Go to [render.com](https://render.com)
3. Sign up with GitHub
4. Click **"New +"** → **"Blueprint"**
5. Select your repository
6. Click **"Apply"**
7. Wait 5-10 minutes
8. Your website is live! 🎉

## Next Steps

- Set up custom domain (optional)
- Set up database backups
- Monitor deployment
- Optimize performance
- Set up CI/CD for automatic deployments

