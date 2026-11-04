Write-Host "==================================================" -ForegroundColor Cyan
Write-Host "  Launching DHANLEKHA (धनलेख) Backend Service     " -ForegroundColor Yellow
Write-Host "  Port: 8080 | Java 21 Spring Boot               " -ForegroundColor Green
Write-Host "==================================================" -ForegroundColor Cyan

Set-Location -Path "$PSScriptRoot\backend"
java -jar target/dhanlekha-backend-1.0.0.jar
