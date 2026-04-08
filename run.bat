@echo off
echo ========================================
echo Facebook/TikTok Batch Uploader
echo ========================================
echo.

REM Clean .next cache if exists
if exist ".next" (
    echo Xoa cache .next...
    rmdir /s /q .next
)

REM Check if node_modules exists
if not exist "node_modules" (
    echo [1/2] Cai dat dependencies lan dau...
    echo Vui long cho, co the mat vai phut...
    echo.
    call npm install
    if %errorlevel% neq 0 (
        echo.
        echo Loi: Khong the cai dat dependencies
        echo Vui long kiem tra ket noi internet va thu lai
        pause
        exit /b %errorlevel%
    )
) else (
    echo [1/2] Dependencies da duoc cai dat
)

echo.
echo [2/2] Khoi dong development server...
echo.
echo ========================================
echo Server dang chay tai: http://localhost:3000
echo ========================================
echo.
echo Nhan Ctrl+C de dung server
echo.

timeout /t 2 /nobreak >nul
start http://localhost:3000

call npm run dev
