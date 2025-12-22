# 🌸 Silver.Z Blog

![Node.js >= 18](https://img.shields.io/badge/node.js-%3E%3D18-brightgreen) ![pnpm >= 9](https://img.shields.io/badge/pnpm-%3E%3D9-blue) ![Astro 5.13.7](https://img.shields.io/badge/Astro-5.13.7-orange) ![TypeScript 5.9.2](https://img.shields.io/badge/TypeScript-5.9.2-blue) ![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)

一个现代化的个人博客系统，采用前后端分离架构，具有美观的界面和丰富的功能。该系统支持博客文章管理、相册管理、标签分类等核心功能，并提供了友好的管理后台。

## ✨ 核心特性

- **现代化技术栈**：采用前沿技术，确保系统性能和可维护性
- **前后端分离**：前端负责展示，后端提供API，便于独立开发和部署
- **响应式设计**：适配桌面端、平板和手机等多种设备
- **丰富的管理功能**：博客文章管理、相册管理、标签管理等
- **安全认证**：基于JWT的身份验证，保障系统安全
- **Markdown支持**：支持使用Markdown编辑博客文章
- **照片上传功能**：支持相册照片的批量上传和管理

## 🛠️ 技术栈

### 前端技术栈

| 技术 | 版本 | 用途 |
|------|------|------|
| Astro | 5.13.7 | 现代前端框架，用于构建快速的静态网站 |
| Svelte | 5.38.10 | 轻量级JavaScript框架，用于构建交互式组件 |
| Tailwind CSS | 3.4.17 | 实用优先的CSS框架，用于样式设计 |
| TypeScript | 5.9.2 | 类型安全的JavaScript超集 |
| Swup | 1.7.0 | 页面过渡库，实现流畅的页面切换 |
| Photoswipe | 5.4.4 | 图片画廊插件，用于照片预览 |

### 后端技术栈

| 技术 | 版本 | 用途 |
|------|------|------|
| Express | 4.21.2 | Node.js Web框架 |
| Node.js | 18.x | 后端开发语言和运行时 |
| JSON 文件存储 | - | 简单的数据存储方式 |
| JWT | 9.0.2 | 用于用户身份验证的令牌 |
| bcryptjs | 2.4.3 | 密码哈希库 |
| multer | 1.4.5-lts.1 | 文件上传中间件 |
| express-validator | 7.2.0 | 请求验证中间件 |
| cors | 2.8.5 | 跨域资源共享中间件 |
| dotenv | 16.4.5 | 环境变量管理 |

## 📁 项目结构

```
├── frontend/             # 前端代码目录
│   ├── src/              # 前端源代码
│   │   ├── components/   # 可复用组件
│   │   ├── layouts/      # 页面布局
│   │   ├── pages/        # 页面文件
│   │   └── utils/        # 工具函数
│   ├── public/           # 静态资源
│   └── astro.config.mjs  # Astro配置文件
├── backend/              # 后端代码目录
│   ├── controllers/      # 控制器，处理请求逻辑
│   ├── database/         # 数据存储目录
│   ├── middleware/       # 中间件
│   ├── routes/           # 路由定义
│   └── server.js         # 后端入口文件
└── README.md             # 项目说明文档
```

## 🚀 快速开始

### 环境准备

1. **安装Node.js**
   - 访问 [Node.js官网](https://nodejs.org/) 下载并安装LTS版本
   - 验证安装：`node -v` 和 `npm -v`

2. **安装pnpm**
   ```bash
   npm install -g pnpm
   ```
   - 验证安装：`pnpm -v`

### 后端部署（Express）

1. **安装后端依赖**
   ```bash
   cd backend
   npm install
   ```

2. **配置环境变量**
   ```bash
   cp .env.example .env
   # 编辑.env文件，根据需要修改配置项
   ```

3. **启动后端服务**
   ```bash
   # 开发模式
   npm run dev
   
   # 生产模式
   npm start
   ```

### 前端部署

1. **安装前端依赖**
   ```bash
   cd frontend
   pnpm install
   ```

2. **启动开发服务器**
   ```bash
   pnpm dev
   ```

3. **构建生产版本**
   ```bash
   pnpm build
   ```

## 📖 使用指南

### 登录管理后台

1. 打开浏览器访问 `http://localhost:3000/admin/login/`
2. 输入默认管理员账号密码：
   - 用户名：`admin`
   - 密码：`admin123`
3. 点击登录按钮进入管理后台

### 博客文章管理

- **创建文章**：登录管理后台，点击"Posts" -> "New Post"，使用Markdown编辑文章
- **编辑文章**：在文章列表中找到要编辑的文章，点击编辑图标进行修改
- **删除文章**：在文章列表中勾选文章，点击删除按钮

### 相册管理

- **创建相册**：登录管理后台，点击"Albums" -> "New Album"，填写相册信息
- **上传照片**：进入相册详情，点击"Upload Photos"，选择要上传的照片
- **编辑相册**：在相册列表中找到要编辑的相册，点击编辑图标进行修改

## 📝 API接口说明

### 认证相关接口

- **管理员登录**：`POST /api/admin/login`

### 博客文章接口

- **获取文章列表**：`GET /api/posts`
- **创建文章**：`POST /api/admin/posts`
- **获取文章详情**：`GET /api/posts/:id`
- **更新文章**：`PUT /api/admin/posts/:id`
- **删除文章**：`DELETE /api/admin/posts/:id`

### 相册接口

- **获取相册列表**：`GET /api/albums`
- **创建相册**：`POST /api/admin/albums`
- **获取相册详情**：`GET /api/albums/:id`
- **上传照片**：`POST /api/admin/albums/:id/photos`

## 🔧 配置说明

### 前端配置

编辑 `frontend/src/config.ts` 文件，自定义博客标题、副标题、语言等基本信息。

### 后端配置

编辑 `backend/.env` 文件，配置端口、JWT密钥等信息。

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 🙏 致谢

- 基于 [Mizuki Blog](https://github.com/matsuzaka-yuki/mizuki) 模板开发
- 感谢所有开源项目的贡献者

---

**文档版本**：v2.0.0
**更新日期**：2025-12-22
**编写者**：Silver.Z