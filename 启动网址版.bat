@echo off
chcp 65001 >nul
cd /d "%~dp0"

where node >nul 2>&1
if errorlevel 1 (
  echo [错误] 未找到 Node.js，请双击「打开看板.bat」直接打开页面。
  pause
  exit /b 1
)

echo 正在启动本地服务（端口 8765）...
start "AIGC电影风格提示词转译器" cmd /k "cd /d "%~dp0" && node server.js"

echo 等待服务就绪...
timeout /t 2 /nobreak >nul

start "" "http://127.0.0.1:8765/index.html"
echo.
echo 浏览器应已打开。若仍无法访问，请确认地址栏为：
echo http://127.0.0.1:8765/index.html
echo （必须带 :8765 端口，不能只输入 127.0.0.1）
echo.
pause
