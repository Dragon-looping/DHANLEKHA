Write-Host "==================================================" -ForegroundColor Cyan
Write-Host "  Launching DHANLEKHA (धनलेख) Frontend Interface   " -ForegroundColor Yellow
Write-Host "  Port: 5173 | Vite + React + Three.js            " -ForegroundColor Green
Write-Host "==================================================" -ForegroundColor Cyan

Set-Location -Path "$PSScriptRoot\frontend"
npm run dev
