@echo off
REM === Node.js (v18+ LTS) ===
winget install -e --id OpenJS.NodeJS.LTS

REM === Python 3.10 (system-wide) ===
curl https://www.python.org/ftp/python/3.10.11/python-3.10.11-amd64.exe -o python_installer.exe
python_installer.exe /quiet InstallAllUsers=1 PrependPath=1

REM === MongoDB (local instance) ===
curl https://fastdl.mongodb.org/windows/mongodb-windows-x86_64-6.0.6.zip -o mongodb.zip
tar -xf mongodb.zip
mkdir C:\data\db

REM === UTF-8 Console ===
chcp 65001

REM === Install NPM/Frontend/AI-Service dependencies ===
cd backend && npm install && cd ..
cd frontend && npm install && cd ..
cd ai-service && pip install -r requirements.txt && cd ..

echo Setup complete. Please review README.md for admin privileges and next steps.
