# PowerShell 7+ cleanup script
# Stop MongoDB if running
Get-Process mongod -ErrorAction SilentlyContinue | Stop-Process -Force
# Remove temp quiz uploads
Remove-Item -Path "$env:TEMP\quiz_uploads" -Recurse -Force -ErrorAction SilentlyContinue
Write-Host "Cleanup complete."
