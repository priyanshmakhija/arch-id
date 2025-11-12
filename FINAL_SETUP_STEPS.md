# Final Setup Steps - You're Almost Done!

## ✅ What's Already Done

1. ✅ `.env` file created with correct API URL
2. ✅ Backend server configured to listen on all interfaces  
3. ✅ Backend is accessible from network: `http://192.168.4.29:4000`

## 🚀 Next Steps

### Start the Servers

Open **TWO separate terminal/PowerShell windows** in the project folder:

#### Terminal 1 - Backend
```powershell
cd server
npm start
```

Wait until you see:
```
API server running on http://0.0.0.0:4000
Accessible from your local network at http://192.168.4.29:4000
```

#### Terminal 2 - Frontend  
```powershell
npm start
```

Wait until you see:
```
Compiled successfully!
webpack compiled with 1 warning in 1234 ms
```

### Test from Your Phone

1. **Make sure phone is on same WiFi** as your computer
2. **Open browser on phone**
3. **Navigate to:** `http://192.168.4.29:3000`
4. **You should see your artifacts!** 🎉

### If You See Artifacts

**Congratulations!** Your mobile access is working!

### If You Don't See Artifacts

**Check these:**

1. **Same network?**
   - Phone and computer must be on same WiFi

2. **Firewall blocking?**
   - Windows Security → Firewall
   - Allow Node.js through firewall

3. **Backend running?**
   - Check: http://192.168.4.29:4000/api/artifacts on phone
   - Should show JSON data

4. **Frontend console errors?**
   - Open browser dev tools on phone
   - Look for errors in console

### Test QR Code Scanning

1. Create a new artifact or view existing ones
2. Scan the QR code with your phone
3. It should open the artifact detail page!

## Quick Reference

**Your URLs:**
- Frontend: `http://192.168.4.29:3000`
- Backend API: `http://192.168.4.29:4000`

**To find your IP if it changes:**
```powershell
ipconfig | findstr IPv4
```

**To restart everything:**
1. Press `Ctrl+C` in both terminals to stop
2. Run the commands above again to restart

## You're All Set!

Once you see artifacts on your phone, you're done! The setup will work every time as long as:
- Your IP address doesn't change (if it does, update `.env`)
- Your phone and computer are on same network

Enjoy your Archaeology Catalog! 🏺✨

