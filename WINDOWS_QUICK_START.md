# Windows Quick Start Commands

## For PowerShell Users

If you get execution policy errors, always use `cmd /c`:

### Start Backend:
```powershell
cmd /c "cd server && npm start"
```

### Start Frontend:
```powershell
cmd /c "npm start"
```

### Seed Database:
```powershell
cmd /c "npm run seed"
```

---

## Or Fix PowerShell (Permanent Solution)

Run this once as Administrator:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

Then you can use `npm start` directly.

---

## Alternative: Use CMD Instead

Just use regular Command Prompt instead of PowerShell:
```cmd
cd server
npm start
```

Then in another CMD window:
```cmd
cd C:\Users\vinit\archaeology-catalog
npm start
```

