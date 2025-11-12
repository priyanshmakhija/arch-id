# ⚡ One Minute Fix

## Do This Now:

### 1. Stop Everything
Press `Ctrl+C` in both terminals

### 2. Start Backend
**Terminal 1:**
```powershell
cd server
npm start
```

### 3. Start Frontend  
**Terminal 2 (NEW terminal):**
```powershell
npm start
```

### 4. Test on Phone
```
http://192.168.4.29:3000
```

**Done!** 🎉

---

## Why?

React Create App reads `.env` files ONLY when it starts. If you created `.env` while servers were running, the frontend didn't see it. A restart fixes this!

