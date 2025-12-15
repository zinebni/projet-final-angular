# ================================
# Smart Queue - Docker Starter
# ================================

Write-Host "================================" -ForegroundColor Cyan
Write-Host "Smart Queue - Docker" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# Check if Docker is running
Write-Host "Checking Docker..." -ForegroundColor Yellow
try {
    docker info | Out-Null
    Write-Host "✅ Docker is running" -ForegroundColor Green
} catch {
    Write-Host "❌ Docker is not running" -ForegroundColor Red
    Write-Host "Please start Docker Desktop and try again" -ForegroundColor Yellow
    exit 1
}

Write-Host ""

# Stop and remove existing containers
Write-Host "Cleaning up existing containers..." -ForegroundColor Yellow
docker-compose down 2>&1 | Out-Null

Write-Host ""

# Build and start containers
Write-Host "Building and starting containers..." -ForegroundColor Yellow
Write-Host "This may take a few minutes on first run..." -ForegroundColor White
Write-Host ""

docker-compose up --build -d

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "================================" -ForegroundColor Green
    Write-Host "✅ Smart Queue Started!" -ForegroundColor Green
    Write-Host "================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "📱 Frontend: http://localhost:3000" -ForegroundColor Cyan
    Write-Host "🔌 Backend API: http://localhost:5000/api" -ForegroundColor Cyan
    Write-Host "💾 MongoDB: localhost:27017" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "⏳ Waiting for services to be healthy (30-60 seconds)..." -ForegroundColor Yellow
    Start-Sleep -Seconds 5
    
    Write-Host ""
    Write-Host "📝 Initialize database (recommended on first run):" -ForegroundColor Yellow
    Write-Host "   docker exec smartqueue-backend npm run seed" -ForegroundColor White
    Write-Host ""
    Write-Host "👤 Default credentials (after seed):" -ForegroundColor Yellow
    Write-Host "   Admin: admin / admin123" -ForegroundColor White
    Write-Host "   Agent: agent1 / agent123" -ForegroundColor White
    Write-Host ""
    Write-Host "🔍 View logs: docker-compose logs -f" -ForegroundColor White
    Write-Host "🛑 Stop: docker-compose down" -ForegroundColor White
    Write-Host ""
} else {
    Write-Host ""
    Write-Host "❌ Failed to start containers" -ForegroundColor Red
    Write-Host "Check the logs above for errors" -ForegroundColor Yellow
    Write-Host ""
}

