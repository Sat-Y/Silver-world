@echo off
chcp 65001 >nul
title Silver OS Local Server
cd /d "%~dp0"
echo 正在启动 Silver OS...
echo.
echo 前端网站: http://127.0.0.1:4178/site/index.html
echo 内容工作台: http://127.0.0.1:4178
echo.
echo 关闭此窗口即可停止全部本地服务。
echo.
node ".local-studio\server.js"
if errorlevel 1 (
  echo.
  echo 启动失败：请确认电脑已安装 Node.js，或检查 4178 端口是否已被占用。
  pause
)
