# Deployment Guide

This guide covers deploying the Archaeology Artifact Catalog to make it accessible outside your local network.

## Table of Contents
1. [Quick Deploy Options](#quick-deploy-options)
2. [Production Build](#production-build)
3. [Deployment Platforms](#deployment-platforms)
4. [Environment Configuration](#environment-configuration)
5. [Post-Deployment Steps](#post-deployment-steps)

## Quick Deploy Options

### Option 1: Vercel (Recommended for Frontend)

Vercel offers the easiest deployment for React apps with automatic SSL, CDN, and zero configuration.

**Steps:**
1. Create a [Vercel account](https://vercel.com)
2. Install Vercel CLI: `npm i -g vercel`
3. Deploy:
   ```bash
   vercel
   ```
4. Follow the prompts

**Pros:**
- Free tier available
- Automatic SSL certificates
- Global CDN
- Easy custom domain setup
- Automatic deployments from Git

**Cons:**
- Frontend only (you'll need a separate backend hosting)
- Serverless functions have execution time limits

### Option 2: Render (Recommended for Full Stack)

Render provides seamless deployment for both frontend and backend with a free tier.

**Frontend + Backend Setup:**
1. Go to [render.com](https://render.com)
2. Create a new "Static Site" for the frontend
3. Create a new "Web Service" for the backend
4. Connect your Git repository

**Pros:**
- Free tier for both frontend and backend
- Automatic SSL
- Easy database setup
- Git-based deployments
- Custom domains

**Cons:**
- Free tier spins down after 15 minutes of inactivity
- Higher tier required for always-on service

### Option 3: Railway (Good for Backend + Database)

Railway is excellent for deploying the backend API and database.

**Steps:**
1. Go to [railway.app](https://railway.app)
2. Create a new project
3. Add PostgreSQL or MongoDB
4. Deploy your backend

**Pros:**
- Simple setup
- Good database integrations
- Auto-deploy from Git
- $5 free credit monthly

**Cons:**
- Limited free tier
- Pricing can add up

### Option 4: Cloudflare Workers + Pages

Deploy the frontend on Cloudflare Pages and backend API on Workers.

**Pros:**
- Excellent performance
- Generous free tier
- Global edge network
- Built-in DDoS protection

**Cons:**
- More complex setup
- Different architecture for Workers

### Option 5: Self-Hosted VPS (DigitalOcean, Linode, AWS EC2)

For full control, deploy to a VPS.

**Steps:**
1. Create a VPS instance (Ubuntu recommended)
2. Install Node.js and Nginx
3. Set up SSL with Let's Encrypt
4. Configure reverse proxy

**Pros:**
- Full control
- No platform-specific limitations
- Cost-effective for high traffic

**Cons:**
- Manual setup required
- Server management needed
- Security maintenance

## Production Build

Before deploying, create a production build:

```bash
# Build the frontend
npm run build

# Build the backend
cd server
npm run build
cd ..

# Build both at once
npm run server:build
```

The `build/` directory contains optimized static files for the frontend.

The `server/dist/` directory contains the compiled backend code.

## Deployment Platforms

### Deploy Frontend (React App)

**Static Hosting Options:**
- **Netlify**: Drag and drop `build/` folder or connect Git
- **GitHub Pages**: Simple for static sites
- **AWS S3 + CloudFront**: Enterprise solution
- **Firebase Hosting**: Google's solution

**Configuration:**
Create a `netlify.toml` or `vercel.json` if needed:

```json
{
  "version": 2,
  "builds": [
    { "src": "package.json", "use": "@vercel/static-build" }
  ],
  "routes": [
    { "src": "/static/(.*)", "dest": "/static/$1" },
    { "src": "/(.*)", "dest": "/index.html" }
  ],
  "env": {
    "REACT_APP_API_URL": "https://your-backend-url.com"
  }
}
```

### Deploy Backend (Express API)

**Hosting Options:**
- **Render**: Web Service
- **Railway**: Full-stack deployment
- **Heroku**: Traditional PaaS (requires credit card for free tier)
- **Fly.io**: Global edge deployment
- **DigitalOcean App Platform**: Simple PaaS

**Environment Variables:**
```bash
NODE_ENV=production
PORT=4000
DATABASE_PATH=/path/to/database.db  # or PostgreSQL connection string
CORS_ORIGIN=https://your-frontend-domain.com
```

## Environment Configuration

### 1. Create `.env` file for production

**Frontend `.env.production`:**
```env
REACT_APP_API_URL=https://your-api-domain.com/api
```

**Backend `.env`:**
```env
NODE_ENV=production
PORT=4000
DATABASE_PATH=/var/data/artifacts.db
```

### 2. Update API configuration

The frontend needs to know where the backend is deployed:

```typescript
// src/utils/api.ts
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000';
```

### 3. Configure CORS

Update `server/src/index.ts`:

```typescript
app.use(cors({ 
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true 
}));
```

## Post-Deployment Steps

### 1. Test QR Codes

After deployment, QR codes will automatically use the production URL. Test by:
1. Creating a new artifact
2. Scanning the QR code
3. Verifying it opens the correct artifact page

### 2. Set up Custom Domain

**For Vercel/Netlify:**
1. Add custom domain in dashboard
2. Update DNS records as instructed
3. SSL certificate auto-configured

**For VPS:**
1. Point A record to server IP
2. Configure Nginx with your domain
3. Install SSL with Certbot

### 3. Database Backup

Set up automatic backups for production data:

```bash
# Backup SQLite database
cp server/data/artifacts.db backups/artifacts-$(date +%Y%m%d).db

# Or use a managed database service
# - Render PostgreSQL
# - Railway PostgreSQL
# - Supabase (free tier)
```

### 4. Monitoring

Set up monitoring for your deployment:
- **Sentry**: Error tracking
- **LogRocket**: User session replay
- **Datadog**: Performance monitoring
- **Uptime Robot**: Uptime monitoring (free)

### 5. CI/CD Pipeline

Automate deployments with GitHub Actions:

**.github/workflows/deploy.yml:**
```yaml
name: Deploy
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: npm ci
      - run: npm run build
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
```

## Recommended Architecture

### Architecture A: Vercel Frontend + Render Backend

```
Frontend (React)    →  Vercel (https://your-app.vercel.app)
                         ↓
Backend (Express)   →  Render (https://your-api.onrender.com)
                         ↓
Database (SQLite)   →  Render (file system or PostgreSQL)
```

**Setup Time:** 15 minutes
**Monthly Cost:** $0 (free tier)
**Pros:** Easy, fast setup
**Cons:** Backend spins down after inactivity

### Architecture B: Railway Full Stack

```
Frontend (React)    →  Railway Static Site
                         ↓
Backend (Express)   →  Railway Web Service
                         ↓
Database (PostgreSQL) → Railway PostgreSQL
```

**Setup Time:** 20 minutes
**Monthly Cost:** $5-20
**Pros:** Always on, better for production
**Cons:** Requires payment for reliable service

### Architecture C: Self-Hosted VPS

```
Frontend + Backend  →  Single VPS (DigitalOcean $5/month)
                         ↓
Database (PostgreSQL) → Same VPS or managed DB
                         ↓
Nginx Reverse Proxy → SSL + CDN (Cloudflare free)
```

**Setup Time:** 2-3 hours
**Monthly Cost:** $5-12
**Pros:** Full control, predictable pricing
**Cons:** Manual setup and maintenance

## Quick Start: Vercel + Render

### 1. Deploy Frontend to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy from project root
vercel

# Set environment variable
vercel env add REACT_APP_API_URL production
# Enter: https://your-api.onrender.com/api
```

### 2. Deploy Backend to Render

1. Push code to GitHub
2. Go to render.com/dashboard
3. Click "New +" → "Web Service"
4. Connect GitHub repo
5. Configure:
   - **Build Command:** `cd server && npm install && npm run build`
   - **Start Command:** `cd server && npm start`
   - **Environment:** Node
6. Add environment variables:
   - `NODE_ENV=production`
   - `PORT=4000`
7. Deploy

### 3. Update Frontend API URL

```bash
# Set environment variable in Vercel
vercel env add REACT_APP_API_URL production https://your-api.onrender.com/api

# Redeploy frontend
vercel --prod
```

### 4. Update CORS in Backend

In Render dashboard, add environment variable:
```
CORS_ORIGIN=https://your-app.vercel.app
```

### 5. Test

1. Visit your Vercel URL
2. Create a test artifact
3. Scan QR code with mobile
4. Verify it works!

## Security Checklist

- [ ] Use HTTPS (most platforms auto-configure)
- [ ] Set secure environment variables
- [ ] Configure CORS properly
- [ ] Enable rate limiting on API
- [ ] Set up database backups
- [ ] Use strong database passwords (if applicable)
- [ ] Configure firewall rules (VPS only)
- [ ] Keep dependencies updated
- [ ] Monitor for security vulnerabilities

## Troubleshooting

### QR Codes Not Working

**Problem:** QR codes show `localhost:3000`

**Solution:** Rebuild with correct environment variable:
```bash
REACT_APP_API_URL=https://your-backend-url.com npm run build
```

### CORS Errors

**Problem:** `Access-Control-Allow-Origin` error

**Solution:** Update CORS origin in backend:
```typescript
app.use(cors({ 
  origin: ['https://your-frontend-url.com'],
  credentials: true 
}));
```

### Database Not Persisting (Render)

**Problem:** Data lost on restart

**Solution:** Use PostgreSQL addon or configure persistent disk:
```bash
# In Render, add PostgreSQL addon
# Update database connection
```

### Build Fails

**Problem:** TypeScript or build errors

**Solution:** Test locally first:
```bash
npm run build
cd server && npm run build
```

## Support

For platform-specific help:
- Vercel: [vercel.com/docs](https://vercel.com/docs)
- Render: [render.com/docs](https://render.com/docs)
- Railway: [docs.railway.app](https://docs.railway.app)
- DigitalOcean: [docs.digitalocean.com](https://docs.digitalocean.com)

## Next Steps

1. Choose a deployment platform
2. Follow the quick start guide
3. Set up monitoring
4. Configure backups
5. Share your deployed URL! 🚀

