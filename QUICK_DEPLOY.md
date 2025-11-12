# Quick Deployment Guide

## Deploy in 5 Minutes with Vercel + Render

This is the fastest way to get your Archaeology Catalog accessible worldwide!

### Prerequisites
- GitHub account
- Vercel account (free)
- Render account (free)

---

## Step 1: Prepare Your Code

1. Make sure your code is on GitHub:
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

---

## Step 2: Deploy Backend to Render (3 minutes)

1. Go to [render.com](https://render.com) and sign up/login
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name:** `archaeology-api`
   - **Region:** Choose closest to you
   - **Branch:** `main`
   - **Root Directory:** Leave blank (or set to `server` if deploying just server)
   - **Environment:** `Node`
   - **Build Command:** `cd server && npm install && npm run build`
   - **Start Command:** `cd server && npm start`
5. Click "Advanced" and add Environment Variables:
   ```
   NODE_ENV=production
   PORT=4000
   ```
6. Scroll down and click "Create Web Service"
7. Wait ~3-5 minutes for first deployment
8. **Copy your service URL** (e.g., `https://archaeology-api.onrender.com`)

---

## Step 3: Deploy Frontend to Vercel (2 minutes)

### Option A: Using Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy (from project root)
vercel

# Set environment variable
vercel env add REACT_APP_API_URL production
# When prompted, enter: https://your-api-url.onrender.com/api
# (Replace with your actual Render URL)

# Deploy to production
vercel --prod
```

### Option B: Using Vercel Dashboard

1. Go to [vercel.com](https://vercel.com) and sign up/login
2. Click "Add New..." → "Project"
3. Import your GitHub repository
4. Configure:
   - **Framework Preset:** Create React App
   - **Root Directory:** `./`
   - **Build Command:** `npm run build`
   - **Output Directory:** `build`
5. Add Environment Variable:
   - **Key:** `REACT_APP_API_URL`
   - **Value:** `https://your-api-url.onrender.com/api` (from Render)
6. Click "Deploy"
7. Wait ~2-3 minutes

---

## Step 4: Update CORS on Render

1. Go back to Render dashboard
2. Click on your web service
3. Go to "Environment" tab
4. Add new variable:
   ```
   CORS_ORIGIN=https://your-app-name.vercel.app
   ```
5. Render will automatically redeploy

---

## Step 5: Test!

1. Visit your Vercel URL
2. Try adding an artifact
3. Scan the QR code with your phone
4. It should open on your phone! 🎉

---

## Your URLs

After deployment, you'll have:
- **Frontend:** `https://your-app-name.vercel.app`
- **Backend API:** `https://archaeology-api.onrender.com`
- **QR Codes:** Will automatically use frontend URL

---

## Troubleshooting

### QR Codes show localhost
**Fix:** Make sure you deployed with `REACT_APP_API_URL` environment variable set

### CORS errors
**Fix:** Add `CORS_ORIGIN` environment variable in Render pointing to your Vercel URL

### Backend spins down
**Fix:** This is normal on Render free tier. First request after 15 min will be slow (~30s). Upgrade to paid plan to keep it always-on.

### Images not loading
**Fix:** Images are stored in the database as base64. Make sure your backend has enough memory.

---

## Cost Breakdown

| Service | Tier | Monthly Cost |
|---------|------|--------------|
| Vercel | Free | $0 |
| Render | Free | $0 |
| **Total** | | **$0** |

**Note:** Free tier limitations:
- Render: Service spins down after 15 min inactivity
- Both have usage limits (very generous for personal projects)
- No custom domains on free Vercel (get `project.vercel.app` URL)

---

## Upgrade for Production

When ready for production use:

### Vercel Pro ($20/month)
- Custom domain
- Unlimited bandwidth
- Better analytics
- Team collaboration

### Render Standard ($25/month)
- Always-on service
- Better performance
- No spin-down delays
- Priority support

---

## Alternative: Quick Self-Hosted Option

If you want to host everything yourself on a VPS:

### Using DigitalOcean App Platform

1. Create account at [digitalocean.com](https://digitalocean.com)
2. Create new App
3. Connect GitHub repo
4. Build settings:
   - Frontend: `npm run build`
   - Backend: `cd server && npm start`
5. Add environment variables
6. Deploy!

**Cost:** $5-12/month for basic droplet

---

## Need Help?

Check the full [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) for:
- Detailed platform comparisons
- Advanced configurations
- Security setup
- Monitoring and backups
- Custom domain setup

