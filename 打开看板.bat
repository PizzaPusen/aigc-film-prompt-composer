@echo off
chcp 65001 >nul
cd /d "%~dp0"

echo 正在用浏览器打开看板（无需 localhost）...
echo 若示意图不显示，请按 Ctrl+Shift+R 强制刷新页面
start "" "%~dp0index.html"

echo.
echo 若页面空白或异常，请改双击「启动网址版.bat」
echo.
timeout /t 3 >nul
