@echo off
echo ========================================
echo Facebook/TikTok Batch Uploader Deployment
echo ========================================
echo.

echo [1/5] Installing dependencies...
call npm install
if %errorlevel% neq 0 (
    echo Error: npm install failed
    pause
    exit /b %errorlevel%
)

echo.
echo [2/5] Building Next.js application...
call npm run build
if %errorlevel% neq 0 (
    echo Error: Build failed
    pause
    exit /b %errorlevel%
)

echo.
echo [3/5] Installing PM2 globally...
call npm install -g pm2
if %errorlevel% neq 0 (
    echo Error: PM2 installation failed
    pause
    exit /b %errorlevel%
)

echo.
echo [4/5] Creating logs directory...
if not exist "logs" mkdir logs

echo.
echo [5/5] Starting application with PM2...
call pm2 start ecosystem.config.js
if %errorlevel% neq 0 (
    echo Error: PM2 start failed
    pause
    exit /b %errorlevel%
)

echo.
echo ========================================
echo Deployment completed successfully!
echo ========================================
echo.
echo Application is running on http://localhost:3000
echo.
echo Useful PM2 commands:
echo   pm2 status          - Check application status
echo   pm2 logs            - View logs
echo   pm2 restart all     - Restart application
echo   pm2 stop all        - Stop application
echo   pm2 startup         - Configure PM2 to run on system startup
echo.

pause
