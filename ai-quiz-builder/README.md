# AI Quiz Builder (Windows-Optimized)

## Windows Setup
- Run `setup-windows.bat` as Administrator for all dependencies.
- MongoDB will be extracted and data directory created at `C:\data\db`.
- All scripts and code use Windows-friendly path handling.

## Admin Privileges Required
- Installing Node.js, Python, and MongoDB system-wide
- Creating `C:\data\db` for MongoDB
- Running servers on privileged ports

## PowerShell Cleanup
- Use `cleanup.ps1` to stop MongoDB and clear temp quiz uploads.

## Validation Checklist
- Run `chcp 65001` before starting servers for UTF-8 support
- All code uses `path.join()` (Node) or `Path()` (Python) for file paths
- No native modules requiring compilation
- All files use CRLF line endings

## Node-Python Integration Example
```js
const { spawn } = require('child_process');
const python = spawn('python', ['ai-service/main.py'], { windowsHide: true });
```

## Testing
- Validate all file paths on Windows
- Test MongoDB startup and shutdown
- Ensure all scripts run without admin errors
