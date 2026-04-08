@echo off
REM ================================================
REM Share Screenshots Folder for Network Access
REM ================================================

echo.
echo ========================================
echo   Share Screenshots Folder
echo ========================================
echo.

REM Check if running as Administrator
net session >nul 2>&1
if %errorLevel% neq 0 (
    echo ERROR: This script must be run as Administrator!
    echo Right-click and select "Run as administrator"
    pause
    exit /b 1
)

echo [1/3] Creating folder if not exists...
if not exist "C:\VitaDairy\Screenshots" (
    mkdir "C:\VitaDairy\Screenshots"
    echo OK: Folder created
) else (
    echo OK: Folder already exists
)

echo.
echo [2/3] Sharing folder on network...
powershell -Command "New-SmbShare -Name 'Screenshots' -Path 'C:\VitaDairy\Screenshots' -ReadAccess 'Everyone' -ErrorAction SilentlyContinue"
if errorlevel 1 (
    echo WARNING: Share may already exist or failed
    echo Trying to update permissions...
    powershell -Command "Grant-SmbShareAccess -Name 'Screenshots' -AccountName 'Everyone' -AccessRight Read -Force -ErrorAction SilentlyContinue"
)
echo OK: Folder shared

echo.
echo [3/3] Verifying share...
powershell -Command "Get-SmbShare -Name 'Screenshots' | Format-List"

echo.
echo ========================================
echo   Share Complete!
echo ========================================
echo.
echo Network Path: \\BAK\Screenshots
echo or: \\192.168.14.204\Screenshots
echo.
echo Next steps:
echo 1. Update .env file:
echo    SCREENSHOT_PUBLIC_URL=\\\\192.168.14.204\\Screenshots
echo.
echo 2. Rebuild and restart server:
echo    npm run build
echo    npm start
echo.
pause
