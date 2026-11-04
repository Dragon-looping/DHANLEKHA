Write-Host "==================================================" -ForegroundColor Cyan
Write-Host "  Starting DHANLEKHA (धनलेख) Full Platform        " -ForegroundColor Yellow
Write-Host "  Backend: http://localhost:8080                  " -ForegroundColor Green
Write-Host "  Frontend: http://localhost:5173                 " -ForegroundColor Green
Write-Host "==================================================" -ForegroundColor Cyan

Start-Process powershell -ArgumentList "-NoExit", "-File", "$PSScriptRoot\run-backend.ps1"
Start-Sleep -Seconds 3
Start-Process powershell -ArgumentList "-NoExit", "-File", "$PSScriptRoot\run-frontend.ps1"

Start-Sleep -Seconds 2
Start-Process "http://localhost:5173"
