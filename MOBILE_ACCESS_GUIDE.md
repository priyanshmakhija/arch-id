# Mobile Access Guide - Quick Fix

## Problem
Your phone can access the frontend at `192.168.4.29:3000` but sees no artifacts because the frontend is trying to connect to `localhost:4000` which your phone can't reach.

## Solution: Restart with Network Access

The backend server has been updated to listen on all network interfaces. You need to:

### 1. Stop the current servers
Press `Ctrl+C` in both terminal windows running the frontend and backend.

### 2. Restart the backend server
```bash
cd server
npm start
```

You should see:
```
API server running on http://0.0.0.0:4000
Accessible from your local network at http://192.168.4.29:4000
```

### 3. Set environment variable and restart frontend

**Option A: Using Environment Variable (Recommended)**

Create a file named `.env` in the project root:
```env
REACT_APP_API_URL=http://192.168.4.29:4000
```

Then restart the frontend:
```bash
npm start
```

**Option B: Temporary Fix (Windows PowerShell)**

If you can't create .env file, run:
```powershell
$env:REACT_APP_API_URL="http://192.168.4.29:4000"
npm start
```

### 4. Test from your phone

Open on your phone: `http://192.168.4.29:3000`

You should now see your artifacts! ✅

## Why This Happened

- Frontend runs on port 3000
- Backend runs on port 4000  
- From your phone, `localhost` means your phone, not your computer
- The frontend was hardcoded to use `localhost:4000`
- We need to tell the frontend to use `192.168.4.29:4000` instead

## Permanent Fix

Create a `.env` file in the project root with:
```env
REACT_APP_API_URL=http://192.168.4.29:4000
```

This will automatically be used when you run `npm start`.

## QR Code URLs

Once this is fixed, your QR codes will be generated with the correct network URL, so scanning them from your phone will work properly!

## Windows Firewall

If it still doesn't work, you may need to allow Node.js through Windows Firewall:

1. Windows Security → Firewall & network protection
2. Allow an app through firewall
3. Change Settings → Allow another app
4. Browse to `C:\Program Files\nodejs\node.exe`
5. Check both Private and Public
6. OK

## Troubleshooting

### Still can't see artifacts
- Check the browser console on your phone (remote debugging)
- Verify backend is running: open `http://192.168.4.29:4000/api/artifacts` on your phone
- Make sure you're on the same WiFi network

### Network issues
- Try restarting both computers
- Check your IP didn't change: `ipconfig | findstr IPv4`
- Verify both devices are on the same network

### QR codes not working
- QR codes are generated when you create/edit artifacts
- Old QR codes in the database still have old URLs
- Create a new artifact to generate a QR code with the correct URL

