# Quick Deployment Guide - Make Your Website Public

This guide will help you deploy your archaeology catalog application so anyone on the internet can access it.

## Recommended: Deploy to Render (Free Tier)

Render is the easiest option since you already have `render.yaml` configured. It can host both your frontend and backend.

### Step 1: Create Render Account

1. Go to [https://render.com](https://render.com)
2. Sign up with your GitHub account (recommended) or email
3. Verify your email if needed

### Step 2: Connect Your GitHub Repository

1. In Render dashboard, click **"New +"** → **"Blueprint"**
2. Click **"Connect account"** to link your GitHub account
3. Select your repository: `priyanshmakhija/arch-id`
4. Render will automatically detect your `render.yaml` file

### Step 3: Deploy

1. Render will show you two services:
   - **archaeology-api** (Backend)
   - **archaeology-frontend** (Frontend)
2. Click **"Apply"** to deploy both services
3. Wait 5-10 minutes for deployment to complete

### Step 4: Access Your Website

1. Once deployed, you'll get URLs like:
   - Frontend: `https://archaeology-frontend.onrender.com`
   - Backend: `https://archaeology-api.onrender.com`
2. Your website will be accessible to anyone at the frontend URL!

### Step 5: Update Frontend API URL (If Needed)

If the frontend doesn't connect to the backend automatically:

1. Go to Render dashboard
2. Select **archaeology-frontend** service
3. Go to **Environment** tab
4. Add/update: `REACT_APP_API_URL=https://archaeology-api.onrender.com`
5. Click **"Save Changes"** (will trigger redeploy)

## Alternative: Deploy Frontend to Vercel (Easier for Frontend)

Vercel offers the easiest React deployment with automatic SSL and CDN.

### Step 1: Install Vercel CLI

```powershell
npm install -g vercel
```

### Step 2: Deploy Frontend

```powershell
# Make sure you're in the project root
cd C:\Users\vinit\archaeology-catalog

# Deploy to Vercel
vercel
```

### Step 3: Follow Prompts

1. Login to Vercel (will open browser)
2. Link to existing project or create new
3. Configure:
   - **Project name**: archaeology-catalog
   - **Directory**: `./` (current directory)
   - **Build command**: `npm run build`
   - **Output directory**: `build`

### Step 4: Set Environment Variable

1. In Vercel dashboard, go to your project
2. Go to **Settings** → **Environment Variables**
3. Add: `REACT_APP_API_URL=https://your-backend-url.com`
4. Redeploy

### Step 5: Deploy Backend Separately

Deploy backend to Render (see above) or another service, then update `REACT_APP_API_URL` in Vercel.

## Alternative: Deploy to Railway (Simple Full-Stack)

Railway is great for deploying both frontend and backend together.

### Step 1: Create Railway Account

1. Go to [https://railway.app](https://railway.app)
2. Sign up with GitHub
3. Click **"New Project"**

### Step 2: Deploy Backend

1. Click **"New"** → **"GitHub Repo"**
2. Select your repository
3. Railway will detect it's a Node.js project
4. Set root directory to: `server`
5. Set start command: `npm start`
6. Add environment variable: `NODE_ENV=production`

### Step 3: Deploy Frontend

1. Click **"New"** → **"GitHub Repo"**
2. Select the same repository
3. Set root directory to: `.` (root)
4. Set build command: `npm install && npm run build`
5. Set start command: `npx serve -s build`
6. Add environment variable: `REACT_APP_API_URL=https://your-backend-url.railway.app`

## Important Notes

### Free Tier Limitations

- **Render Free Tier**: 
  - Services spin down after 15 minutes of inactivity
  - First request after spin-down takes ~30 seconds
  - Upgrade to paid plan for always-on service

- **Vercel Free Tier**:
  - Unlimited deployments
  - Always-on
  - 100GB bandwidth/month

- **Railway Free Tier**:
  - $5 free credit/month
  - Pay-as-you-go after that

### Database Considerations

Your current setup uses SQLite (file-based database). For production:

1. **Option 1: Keep SQLite** (Simple)
   - Works for low traffic
   - Data persists on Render's file system
   - May lose data on service restart (free tier)

2. **Option 2: Use PostgreSQL** (Recommended for production)
   - Render offers free PostgreSQL
   - More reliable for production
   - Requires code changes to switch from SQLite

### Security Considerations

1. **Remove Token from `.git/config`** (if you haven't already):
   ```powershell
   git remote set-url origin https://github.com/priyanshmakhija/arch-id.git
   ```

2. **Use Environment Variables** for sensitive data:
   - Never commit tokens/passwords to Git
   - Use Render/Railway environment variables

3. **Update CORS** settings in backend for production domain

## Testing Your Deployment

1. Visit your frontend URL
2. Try logging in with:
   - Username: `admin`, Password: `admin`
   - Username: `archaeologist`, Password: `archaeologist`
3. Test adding/viewing artifacts
4. Test QR code generation

## Troubleshooting

### Frontend can't connect to backend

1. Check `REACT_APP_API_URL` environment variable
2. Verify backend URL is correct
3. Check backend CORS settings
4. Verify backend is running (check Render dashboard)

### Backend shows errors

1. Check Render logs: Dashboard → Service → Logs
2. Verify environment variables are set
3. Check database path is correct
4. Verify Node.js version matches

### Services keep spinning down (Render free tier)

1. This is normal for free tier
2. First request after spin-down is slow
3. Upgrade to paid plan for always-on service
4. Or use a monitoring service to ping your URL every 10 minutes

## Next Steps

1. **Set up custom domain** (optional):
   - Add your domain in Render/Vercel dashboard
   - Update DNS records as instructed
   - SSL certificate auto-configured

2. **Set up database backups**:
   - For SQLite: Download database file periodically
   - For PostgreSQL: Use Render's backup feature

3. **Monitor your deployment**:
   - Use Render's built-in logs
   - Set up Uptime Robot (free) to monitor uptime
   - Use Sentry for error tracking (free tier available)

4. **Optimize performance**:
   - Enable caching in Render
   - Optimize images
   - Use CDN for static assets

## Quick Start (Render - Recommended)

1. Push your code to GitHub (already done)
2. Go to [render.com](https://render.com) and sign up
3. Click **"New +"** → **"Blueprint"**
4. Connect GitHub and select your repo
5. Click **"Apply"** to deploy
6. Wait 5-10 minutes
7. Access your website at the provided URL!

Your website will be live and accessible to anyone on the internet! 🚀

