# PowerShell script to create Windows Task Scheduler for auto-start server
# Run as Administrator

$taskName = "Social Batch Uploader Server"
$scriptPath = "C:\Users\vitadairy\.gemini\antigravity\scratch\social-batch-uploader\START-SERVER.bat"
$workingDir = "C:\Users\vitadairy\.gemini\antigravity\scratch\social-batch-uploader"

Write-Host "Creating Windows Task Scheduler for auto-start server..." -ForegroundColor Green

# Check if task already exists
$existingTask = Get-ScheduledTask -TaskName $taskName -ErrorAction SilentlyContinue
if ($existingTask) {
    Write-Host "Task already exists. Removing old task..." -ForegroundColor Yellow
    Unregister-ScheduledTask -TaskName $taskName -Confirm:$false
}

# Create action
$action = New-ScheduledTaskAction -Execute $scriptPath -WorkingDirectory $workingDir

# Create trigger (at startup, delay 30 seconds)
$trigger = New-ScheduledTaskTrigger -AtStartup
$trigger.Delay = "PT30S"

# Create settings
$settings = New-ScheduledTaskSettingsSet `
    -AllowStartIfOnBatteries `
    -DontStopIfGoingOnBatteries `
    -StartWhenAvailable `
    -RestartCount 3 `
    -RestartInterval (New-TimeSpan -Minutes 1)

# Create principal (run with highest privileges)
$principal = New-ScheduledTaskPrincipal -UserId "SYSTEM" -LogonType ServiceAccount -RunLevel Highest

# Register task
Register-ScheduledTask `
    -TaskName $taskName `
    -Action $action `
    -Trigger $trigger `
    -Settings $settings `
    -Principal $principal `
    -Description "Auto-start Social Batch Uploader server on Windows boot"

Write-Host "`nTask created successfully!" -ForegroundColor Green
Write-Host "Task Name: $taskName" -ForegroundColor Cyan
Write-Host "Script: $scriptPath" -ForegroundColor Cyan
Write-Host "`nServer will auto-start on Windows boot (30 seconds delay)" -ForegroundColor Yellow
Write-Host "Auto-restart on crash: Yes (max 3 times, every 1 minute)" -ForegroundColor Yellow

# Test run
Write-Host "`nDo you want to test run the task now? (Y/N): " -NoNewline -ForegroundColor Magenta
$response = Read-Host
if ($response -eq "Y" -or $response -eq "y") {
    Write-Host "Starting task..." -ForegroundColor Green
    Start-ScheduledTask -TaskName $taskName
    Write-Host "Task started! Check http://localhost:3000" -ForegroundColor Green
}

Write-Host "`nSetup complete!" -ForegroundColor Green
