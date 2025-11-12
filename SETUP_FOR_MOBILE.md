# Setup for Mobile Access - Windows

## Quick Fix (2 minutes)

### Step 1: Find Your IP Address
```powershell
ipconfig | findstr IPv4
```
Look for an address like `192.168.x.x` (not `127.0.0.1`)

### Step 2: Create Environment File

**In PowerShell:**
```powershell
echo REACT_APP_API_URL=http://YOUR_IP:4000 > .env
```

**Replace `YOUR_IP` with your actual IP.** For example:
```powershell
echo REACT_APP_API_URL=http://192.168.4.29:4000 > .env
```

### Step 3: Restart Servers

**Kill all running servers:**
Press `Ctrl+C` in any terminal running the app.

**Start backend:**
```powershell
cd server
npm start
```

**Start frontend (in new terminal):**
```powershell
npm start
```

### Step 4: Test

Open on your phone: `http://YOUR_IP:3000`

**Example:** `http://192.168.4.29:3000`

---

## Windows Firewall (If Still Not Working)

1. Open **Windows Security**
2. Go to **Firewall & network protection**
3. Click **Allow an app through firewall**
4. Click **Change Settings**
5. Click **Allow another app...**
6. Click **Browse**
7. Navigate to: `C:\Program Files\nodejs\`
8. Select `node.exe`
9. Click **Add**
10. Check both **Private** and **Public** boxes
11. Click **OK**

---

## Verify It's Working

**On your phone:**
1. Open `http://YOUR_IP:4000/api/artifacts`
2. Should see JSON data
3. If you see data, open `http://YOUR_IP:3000`
4. Should see your artifacts!

**On your computer:**
```powershell
curl http://YOUR_IP:4000/api/artifacts
```
Should return JSON data.

---

## Making It Permanent

The `.env` file you created will be used automatically every time you run `npm start`. You don't need to do anything else!

---

## If Your IP Changes

If your computer gets a new IP address (e.g., connecting to different WiFi):

1. Find new IP: `ipconfig | findstr IPv4`
2. Update `.env` file with new IP
3. Restart servers

Or just delete `.env` and it will use `localhost` again.

---

## Quick Commands Reference

```powershell
# Find IP
ipconfig | findstr IPv4

# Create .env file
echo REACT_APP_API_URL=http://192.168.4.29:4000 > .env

# Start backend
cd server
npm start

# Start frontend (in new terminal)
npm start

# Access from phone
http://192.168.4.29:3000
```

---

## Troubleshooting

### No artifacts showing
- ✅ Backend running?
- ✅ Check: http://YOUR_IP:4000/api/artifacts on phone
- ✅ Same WiFi network?
- ✅ Windows Firewall allowed Node.js?

### Can't access from phone
- ✅ On same WiFi?
- ✅ IP address correct?
- ✅ Firewall settings?
- ✅ Backend says "Listening on 0.0.0.0:4000"?

### QR codes not working
- Old QR codes may have old URLs
- Create a new artifact to get a fresh QR code
- QR codes will use `YOUR_IP` after this setup

