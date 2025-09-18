@echo off
echo 🚀 Royalserve Complete Deployment Script
echo ========================================

echo.
echo 📍 Deployment Configuration:
echo Frontend: http://34.28.133.216:3000/
echo Backend:  http://34.28.133.216:8888/
echo.

echo 🔧 Step 1: Starting Backend Server...
cd backend
start "Royalserve Backend" cmd /k "node deploy.js"

echo ⏳ Waiting for backend to initialize...
timeout /t 5 /nobreak > nul

echo 🔧 Step 2: Starting Frontend Server...
cd ..\frontend
start "Royalserve Frontend" cmd /k "node deploy.js"

echo.
echo ✅ Deployment initiated!
echo.
echo 📋 Next Steps:
echo 1. Wait for both servers to start (check the opened windows)
echo 2. Access your application at: http://34.28.133.216:3000/
echo 3. Login with: admin@admin.com / admin123
echo.
echo 🔍 Troubleshooting:
echo - Check both terminal windows for any errors
echo - Ensure MongoDB is running
echo - Verify ports 3000 and 8888 are available
echo.

pause