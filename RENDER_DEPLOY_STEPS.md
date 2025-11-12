# Step-by-Step: Deploy to Render and Access Your Website

## Step 1: Create Render Account

1. **Go to Render website:**
   - Visit: [https://render.com](https://render.com)
   - Click **"Get Started for Free"** or **"Sign Up"**

2. **Sign up options:**
   - **Recommended:** Sign up with GitHub (easiest)
     - Click **"Sign up with GitHub"**
     - Authorize Render to access your GitHub account
   - **Alternative:** Sign up with email
     - Enter your email and create a password
     - Verify your email address

## Step 2: Access Render Dashboard

After signing up, you'll be redirected to the Render dashboard:

1. **Dashboard URL:** [https://dashboard.render.com](https://dashboard.render.com)
2. You'll see:
   - **Services** (your deployed applications)
   - **New +** button (to create new services)
   - **Blueprints** (pre-configured deployments)

## Step 3: Deploy Your Blueprint

### Option A: Deploy from Blueprint (Easiest - Uses render.yaml)

1. **Click "New +" button** (top right of dashboard)

2. **Select "Blueprint"**
   - This option uses your `render.yaml` file
   - Render will automatically detect both services (frontend + backend)

3. **Connect your GitHub repository:**
   - If not connected, click **"Connect account"** or **"Configure account"**
   - Authorize Render to access your GitHub repositories
   - Select your repository: **priyanshmakhija/arch-id**

4. **Configure the Blueprint:**
   - Render will automatically detect your `render.yaml` file
   - You'll see two services:
     - **archaeology-api** (Backend)
     - **archaeology-frontend** (Frontend)
   - Review the configuration (usually correct as-is)

5. **Click "Apply"** to deploy
   - Render will start building and deploying both services
   - This takes 5-10 minutes

6. **Wait for deployment:**
   - You'll see build logs in real-time
   - Green checkmark = deployment successful
   - Red X = deployment failed (check logs)

## Step 4: Access Your Deployed Website

### After Deployment Completes:

1. **Go to Render Dashboard:**
   - [https://dashboard.render.com](https://dashboard.render.com)

2. **Find your services:**
   - You'll see two services:
     - **archaeology-frontend** (Frontend)
     - **archaeology-api** (Backend)

3. **Get your website URL:**
   - Click on **"archaeology-frontend"** service
   - You'll see a URL like: `https://archaeology-frontend.onrender.com`
   - **This is your public website URL!**

4. **Test your website:**
   - Click the URL or copy it to your browser
   - Your website should load
   - Try logging in with:
     - Username: `admin`
     - Password: `admin`

## Step 5: Monitor Your Services

### View Service Status:

1. **Dashboard → Services:**
   - See all your deployed services
   - Green = Running
   - Yellow = Deploying
   - Red = Error

2. **Click on a service to see:**
   - **Logs:** Real-time application logs
   - **Metrics:** CPU, memory usage
   - **Events:** Deployment history
   - **Settings:** Environment variables, scaling

3. **Check backend service:**
   - Click on **"archaeology-api"**
   - URL will be like: `https://archaeology-api.onrender.com`
   - This is your backend API URL

## Step 6: Verify Deployment

### Test Your Website:

1. **Visit frontend URL:**
   - Example: `https://archaeology-frontend.onrender.com`
   - Website should load

2. **Test login:**
   - Click "Sign In"
   - Username: `admin`
   - Password: `admin`
   - Should successfully log in

3. **Test features:**
   - Browse artifacts
   - Add new artifact (if logged in as admin/archaeologist)
   - Generate QR codes
   - Search artifacts

## Troubleshooting

### Website Not Loading:

1. **Check service status:**
   - Go to Render dashboard
   - Check if service is "Live" (green)
   - If "Suspended" (yellow), click "Manual Deploy" → "Deploy latest commit"

2. **Check logs:**
   - Click on service → "Logs" tab
   - Look for errors
   - Common issues:
     - Build errors (check build logs)
     - Environment variable issues
     - Database connection errors

3. **Check environment variables:**
   - Click on service → "Environment" tab
   - Verify `REACT_APP_API_URL` is set (for frontend)
   - Verify `NODE_ENV=production` (for backend)

### Frontend Can't Connect to Backend:

1. **Check backend URL:**
   - Go to backend service → Copy URL
   - Should be like: `https://archaeology-api.onrender.com`

2. **Update frontend environment variable:**
   - Go to frontend service → "Environment" tab
   - Add/update: `REACT_APP_API_URL=https://archaeology-api.onrender.com`
   - Click "Save Changes"
   - Service will redeploy automatically

3. **Check CORS settings:**
   - Backend should allow frontend origin
   - Current setup: `cors({ origin: true })` allows all origins (works for now)

### Service Keeps Spinning Down (Free Tier):

1. **This is normal for free tier:**
   - Services spin down after 15 minutes of inactivity
   - First request after spin-down takes ~30 seconds

2. **Solutions:**
   - **Option 1:** Use Uptime Robot (free)
     - Go to [https://uptimerobot.com](https://uptimerobot.com)
     - Create account
     - Add monitor for your website URL
     - Set interval to 5 minutes
     - This keeps your service awake

   - **Option 2:** Upgrade to paid plan
     - Go to service → "Settings" → "Plan"
     - Upgrade to "Starter" plan ($7/month)
     - Service stays awake 24/7

## Quick Access Links

- **Render Dashboard:** [https://dashboard.render.com](https://dashboard.render.com)
- **Render Docs:** [https://render.com/docs](https://render.com/docs)
- **Your Repository:** [https://github.com/priyanshmakhija/arch-id](https://github.com/priyanshmakhija/arch-id)

## Your Website URLs

After deployment, you'll have:

- **Frontend:** `https://archaeology-frontend.onrender.com`
- **Backend:** `https://archaeology-api.onrender.com`

These URLs are publicly accessible to anyone on the internet!

## Next Steps

1. **Set up custom domain (optional):**
   - Go to service → "Settings" → "Custom Domains"
   - Add your domain
   - Update DNS records as instructed

2. **Set up monitoring:**
   - Use Uptime Robot to keep service awake
   - Monitor service health

3. **Set up backups:**
   - For SQLite: Download database file periodically
   - For production: Consider PostgreSQL

4. **Share your website:**
   - Share the frontend URL with users
   - They can access it from anywhere!

