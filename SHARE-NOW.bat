@echo off
REM ================================================
REM Share Screenshots Folder - Run as Administrator
REM ================================================

echo.
echo ========================================
echo   Share Screenshots Folder
echo ========================================
echo.

REM Check Administrator
net session >nul 2>&1
if %errorLevel% neq 0 (
    echo ERROR: Must run as Administrator!
    echo Right-click this file and select "Run as administrator"
    pause
    exit /b 1
)

echo [1/2] Sharing folder...
powershell -Command "New-SmbShare -Name 'Screenshots' -Path 'C:\VitaDairy\Screenshots' -ReadAccess 'Everyone' -Force"

echo.
echo [2/2] Verifying share...
powershell -Command "Get-SmbShare -Name 'Screenshots'"

echo.
echo ========================================
echo   Share Complete!
echo ========================================
echo.
echo Network Path: \\192.168.14.204\Screenshots
echo.
echo Test: Open File Explorer and type:
echo   \\192.168.14.204\Screenshots
echo.
pause
