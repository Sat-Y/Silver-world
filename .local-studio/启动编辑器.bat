@echo off
chcp 65001 >nul
cd /d "%~dp0"
title Silver OS Local Server
echo 正在启动 Silver OS 前端与 Content Studio...
echo.
node server.js
if errorlevel 1 (
  echo.
  echo 无法启动：请确认电脑已安装 Node.js，或检查 4178 端口是否已被占用。
  pause
)
