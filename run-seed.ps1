# PowerShell script to run seed script and verify results
Write-Host "🌱 Starting database seed script..." -ForegroundColor Green
Write-Host ""

# Set API URL
$env:API_URL = "https://archaeology-api.onrender.com"

# Run seed script
Write-Host "Running seed script..." -ForegroundColor Yellow
node scripts/seed-artifacts.js

# Check exit code
if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✅ Seed script completed!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Verifying artifacts were created..." -ForegroundColor Yellow
    
    # Test backend endpoint
    try {
        $response = Invoke-RestMethod -Uri "https://archaeology-api.onrender.com/api/artifacts" -Method Get
        $artifactCount = $response.Count
        Write-Host "✅ Found $artifactCount artifacts in database" -ForegroundColor Green
        
        if ($artifactCount -eq 0) {
            Write-Host "⚠️  Warning: No artifacts found. The seed script may have failed." -ForegroundColor Yellow
        } else {
            Write-Host "✅ Database seeded successfully!" -ForegroundColor Green
            Write-Host "You can now view artifacts at: https://archaeology-frontend.onrender.com/artifacts" -ForegroundColor Cyan
        }
    } catch {
        Write-Host "❌ Error verifying artifacts: $_" -ForegroundColor Red
    }
} else {
    Write-Host ""
    Write-Host "❌ Seed script failed with exit code: $LASTEXITCODE" -ForegroundColor Red
}

