# Silver.Z Blog 全面说明文档

## 1. 项目概述

Mizuki Blog 是一个现代化的个人博客系统，本项目是基于Mizuki Blog进行后端管理界面开发成为属于我自己的Silver.Z Blog，采用前后端分离架构，具有美观的界面和丰富的功能。该系统支持博客文章管理、相册管理、标签分类等核心功能，并提供了友好的管理后台。

### 1.1 项目定位

- **面向用户**：个人博客作者、摄影爱好者、内容创作者
- **使用场景**：个人博客网站、摄影作品展示、作品集网站
- **设计理念**：简洁美观、功能丰富、易于使用、安全可靠

### 1.2 主要特性

- ✅ **现代化技术栈**：采用前沿技术，确保系统性能和可维护性
- ✅ **前后端分离**：前端负责展示，后端提供API，便于独立开发和部署
- ✅ **响应式设计**：适配桌面端、平板和手机等多种设备
- ✅ **丰富的管理功能**：博客文章管理、相册管理、标签管理等
- ✅ **安全认证**：基于JWT的身份验证，保障系统安全
- ✅ **Markdown支持**：支持使用Markdown编辑博客文章
- ✅ **照片上传功能**：支持相册照片的批量上传和管理

## 2. 核心功能模块

### 2.1 博客文章管理

| 功能 | 描述 |
|------|------|
| 文章创建 | 支持Markdown编辑，可添加标题、内容、标签、分类等 |
| 文章编辑 | 支持修改已发布或草稿状态的文章 |
| 文章删除 | 支持单个或批量删除文章 |
| 文章状态管理 | 支持发布（published）和草稿（draft）两种状态 |
| 标签分类 | 支持按标签和分类管理文章 |
| 文章搜索 | 支持按标题、内容搜索文章 |

### 2.2 相册管理

| 功能 | 描述 |
|------|------|
| 相册创建 | 支持创建相册，设置名称、描述、封面等 |
| 照片上传 | 支持批量上传照片，自动生成缩略图 |
| 照片管理 | 支持查看、删除照片，设置相册封面 |
| 相册编辑 | 支持修改相册信息，添加或删除照片 |
| 相册删除 | 支持单个或批量删除相册 |
| 照片预览 | 支持点击照片查看大图 |

### 2.3 标签管理

| 功能 | 描述 |
|------|------|
| 标签创建 | 在创建或编辑文章时自动生成标签 |
| 标签关联 | 支持一篇文章关联多个标签 |
| 标签筛选 | 支持按标签筛选文章 |
| 标签统计 | 显示每个标签关联的文章数量 |

### 2.4 管理后台

| 功能 | 描述 |
|------|------|
| 用户登录 | 基于JWT的身份验证 |
| 仪表盘 | 显示系统概览信息 |
| 菜单管理 | 左侧菜单栏，方便切换不同功能模块 |
| 用户管理 | 支持管理员账号管理 |
| 系统设置 | 支持基本系统配置 |

## 3. 技术架构

### 3.1 架构图

```
┌───────────────────────────────────────────────────────────────────┐
│                         前端 (Frontend)                          │
├───────────────────────────────────────────────────────────────────┤
│  Astro 5.13.7  │  Svelte 5.38.10  │  Tailwind CSS 3.4.17         │
├───────────────────────────────────────────────────────────────────┤
│  页面渲染       │  交互组件         │  样式设计                    │
└─────────────────────────────────────┬─────────────────────────────┘
                                      │
                                      │  HTTP/HTTPS
                                      │
┌─────────────────────────────────────▼─────────────────────────────┐
│                         后端 (Backend)                           │
├───────────────────────────────────────────────────────────────────┤
│  Express 4.21.2  │  Node.js 18.x  │  JSON 文件存储  │  File Storage │
├───────────────────────────────────────────────────────────────────┤
│  Web框架           │  开发语言   │  数据存储         │  文件存储     │
├───────────────────────────────────────────────────────────────────┤
│  JWT  │  bcryptjs  │  multer  │  express-validator              │
└─────────────────────────────────────┬─────────────────────────────┘
                                      │
                                      │
┌─────────────────────────────────────▼─────────────────────────────┐
│                         存储层 (Storage)                          │
├───────────────────────────────────────────────────────────────────┤
│  JSON Files  │  File System (uploads)                            │
└───────────────────────────────────────────────────────────────────┘
```

### 3.2 前端技术栈

| 技术 | 版本 | 用途 | 溯源 |
|------|------|------|------|
| Astro | 5.13.7 | 现代前端框架，用于构建快速的静态网站 | [package.json:36](frontend/package.json:36) |
| Svelte | 5.38.10 | 轻量级JavaScript框架，用于构建交互式组件 | [package.json:64](frontend/package.json:64) |
| Tailwind CSS | 3.4.17 | 实用优先的CSS框架，用于样式设计 | [package.json:65](frontend/package.json:65) |
| TypeScript | 5.9.2 | 类型安全的JavaScript超集 | [package.json:66](frontend/package.json:66) |
| Swup | 1.7.0 | 页面过渡库，实现流畅的页面切换 | [package.json:34](frontend/package.json:34) |
| Photoswipe | 5.4.4 | 图片画廊插件，用于照片预览 | [package.json:49](frontend/package.json:49) |

### 3.3 后端技术栈

| 技术 | 版本 | 用途 | 溯源 |
|------|------|------|------|
| Express | 4.21.2 | Node.js Web框架 | [backend/package.json:18](backend/package.json:18) |
| Node.js | 18.x | 后端开发语言和运行时 | [backend/package.json:1](backend/package.json:1) |
| JSON 文件存储 | - | 简单的数据存储方式 | [backend/database](backend/database) |
| JWT | 9.0.2 | 用于用户身份验证的令牌 | [backend/package.json:20](backend/package.json:20) |
| bcryptjs | 2.4.3 | 密码哈希库 | [backend/package.json:14](backend/package.json:14) |
| multer | 1.4.5-lts.1 | 文件上传中间件 | [backend/package.json:21](backend/package.json:21) |
| express-validator | 7.2.0 | 请求验证中间件 | [backend/package.json:19](backend/package.json:19) |
| cors | 2.8.5 | 跨域资源共享中间件 | [backend/package.json:16](backend/package.json:16) |
| dotenv | 16.4.5 | 环境变量管理 | [backend/package.json:17](backend/package.json:17) |
| cookie-parser | 1.4.7 | Cookie处理中间件 | [backend/package.json:15](backend/package.json:15) |

### 3.4 项目结构

#### 3.4.1 前端结构

```
frontend/
├── src/                      # 源代码目录
│   ├── components/           # 可复用组件
│   │   ├── admin/           # 管理后台组件
│   │   ├── widget/          # 小部件组件
│   │   └── ...              # 其他组件
│   ├── layouts/             # 页面布局
│   ├── pages/               # 页面文件
│   │   ├── admin/           # 管理后台页面
│   │   ├── posts/           # 博客文章页面
│   │   ├── albums/          # 相册页面
│   │   └── index.astro      # 首页
│   ├── styles/              # 全局样式
│   ├── utils/               # 工具函数
│   ├── config.ts            # 配置文件
│   └── types/               # TypeScript类型定义
├── public/                  # 静态资源
│   ├── assets/              # 静态资源文件
│   └── uploads/             # 上传文件存储目录
├── astro.config.mjs         # Astro配置文件
├── package.json             # 前端依赖
└── pnpm-lock.yaml           # 依赖锁定文件
```

#### 3.4.2 后端结构

```
backend/
├── controllers/              # 控制器，处理请求逻辑
│   ├── albums.js            # 相册相关控制器
│   ├── auth.js              # 认证相关控制器
│   └── posts.js             # 博客文章相关控制器
├── database/                # 数据存储目录
│   └── albums/              # 相册数据存储
├── middleware/              # 中间件
│   └── auth.js              # 认证中间件
├── public/                  # 静态资源
│   └── uploads/             # 上传文件存储
├── routes/                  # 路由定义
│   ├── albums.js            # 相册相关路由
│   ├── auth.js              # 认证相关路由
│   └── posts.js             # 博客文章相关路由
├── utils/                   # 工具函数
│   └── auth.js              # 认证相关工具函数
├── .env.example             # 环境变量示例
├── package.json             # 后端依赖配置
└── server.js                # 后端入口文件
```

## 4. 环境配置要求

### 4.1 硬件要求

| 硬件 | 最低配置 | 推荐配置 |
|------|----------|----------|
| CPU | 1核 | 2核及以上 |
| 内存 | 2GB | 4GB及以上 |
| 存储空间 | 10GB | 20GB及以上 |
| 网络 | 1Mbps | 10Mbps及以上 |

### 4.2 软件要求

#### 4.2.1 前端环境

| 软件 | 版本 | 用途 | 溯源 |
|------|------|------|------|
| Node.js | 18.x 或更高 | JavaScript运行环境 | [package.json:1](frontend/package.json:1) |
| pnpm | 9.x 或更高 | 前端包管理器 | [package.json:81](frontend/package.json:81) |

#### 4.2.2 后端环境

| 软件 | 版本 | 用途 | 溯源 |
|------|------|------|------|
| Node.js | 18.x 或更高 | JavaScript运行环境 | [package.json:1](backend/package.json:1) |
| npm | 9.x 或更高 | 后端包管理器 | Node.js内置 |

#### 4.2.3 开发工具

- **IDE推荐**：VS Code、WebStorm
- **浏览器**：Chrome、Firefox、Edge等现代浏览器
- **Git**：版本控制系统

## 5. 安装部署流程

### 5.1 环境准备

#### 5.1.1 安装Node.js和pnpm

1. **安装Node.js**
   - 访问 [Node.js官网](https://nodejs.org/) 下载并安装LTS版本
   - 验证安装：`node -v` 和 `npm -v`

2. **安装pnpm**
   ```bash
   npm install -g pnpm
   ```
   - 验证安装：`pnpm -v`



### 5.2 安装部署步骤

#### 5.2.1 后端部署（Express）

1. **安装后端依赖**
   ```bash
   cd backend
   npm install
   ```

2. **配置环境变量**
   - 复制环境变量示例文件：
     ```bash
     cp .env.example .env
     ```
   - 编辑 `.env` 文件，根据需要修改配置项（端口、JWT密钥等）

3. **启动后端服务**
   - 开发模式（带自动重启）：
     ```bash
     npm run dev
     ```
   - 生产模式：
     ```bash
     npm start
     ```

4. **验证后端服务**
   - 访问 `http://localhost:3001/api/health`，看到成功响应即表示启动成功

#### 5.2.2 前端部署

1. **安装依赖**
   ```bash
   cd frontend
   pnpm install
   ```

2. **配置API地址**
   - 编辑 `src/utils/api-utils.ts` 文件（如果存在）
   - 确保API地址指向正确的后端服务：
     ```typescript
     export const API_BASE_URL = 'http://localhost:3001/api';
     ```

3. **启动开发服务器**
   ```bash
   pnpm dev
   ```

4. **访问前端**
   - 打开浏览器访问 `http://localhost:3000`

5. **构建生产版本**
   ```bash
   pnpm build
   ```
   - 构建产物将生成在 `dist/` 目录

6. **部署生产版本**
   ```bash
   pnpm preview
   ```
   - 或使用Nginx、Apache等Web服务器部署 `dist/` 目录

## 6. 使用指南

### 6.1 登录管理后台

1. 打开浏览器访问 `http://localhost:3000/admin/login/`
2. 输入默认管理员账号密码：
   - 用户名：`admin`
   - 密码：`admin123`
3. 点击登录按钮进入管理后台

### 6.2 博客文章管理

#### 6.2.1 创建博客文章

1. 登录管理后台后，点击左侧菜单的 "Posts"
2. 点击 "New Post" 按钮
3. 填写文章标题、内容、标签等信息
4. 在编辑器中使用Markdown语法编写文章内容
5. 选择文章状态（published/draft）
6. 点击 "Save" 按钮保存

#### 6.2.2 编辑博客文章

1. 在文章列表中，找到要编辑的文章
2. 点击文章右侧的编辑图标（铅笔图标）
3. 修改文章内容和其他信息
4. 点击 "Save" 按钮保存修改

#### 6.2.3 删除博客文章

1. 在文章列表中，找到要删除的文章
2. 点击文章右侧的删除图标（垃圾桶图标）
3. 在弹出的确认对话框中点击 "Delete" 确认删除

### 6.3 相册管理

#### 6.3.1 创建相册

1. 登录管理后台后，点击左侧菜单的 "Albums"
2. 点击 "New Album" 按钮
3. 填写相册标题、描述等信息
4. 点击 "Save" 按钮保存

#### 6.3.2 上传照片

1. 在相册列表中，点击相册封面或标题进入相册详情
2. 点击 "Upload Photos" 按钮
3. 选择要上传的照片文件（支持多选）
4. 等待上传完成

#### 6.3.3 编辑相册

1. 在相册列表中，找到要编辑的相册
2. 点击相册右侧的编辑图标
3. 修改相册信息（名称、描述等）
4. 可以重新上传封面图片
5. 可以添加或删除照片
6. 点击 "Save" 按钮保存修改

#### 6.3.4 删除相册

1. 在相册列表中，找到要删除的相册
2. 勾选相册的复选框
3. 点击批量操作区域的 "Delete Selected" 按钮
4. 在弹出的确认对话框中点击 "Delete" 确认删除

### 6.4 标签管理

- 在创建或编辑文章时，直接在标签输入框中输入标签名称，用逗号分隔
- 系统会自动创建新标签或关联已有标签
- 在文章列表页面，可以点击标签筛选相关文章

## 7. API接口说明

### 7.1 认证相关接口

#### 7.1.1 管理员登录

- **接口地址**：`POST /api/admin/login`
- **请求参数**：
  ```json
  {
    "username": "admin",
    "password": "admin123"
  }
  ```
- **响应示例**：
  ```json
  {
    "success": true,
    "data": {
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "user": {
        "id": 1,
        "username": "admin"
      }
    },
    "message": "Login successful"
  }
  ```

### 7.2 博客文章接口

#### 7.2.1 获取文章列表

- **接口地址**：`GET /api/posts`
- **请求参数**：
  - `page`：页码，默认1
  - `limit`：每页数量，默认10
  - `status`：状态，可选值：published, draft
  - `tags`：标签，多个用逗号分隔
- **响应示例**：
  ```json
  {
    "success": true,
    "data": {
      "posts": [
        {
          "id": 1,
          "title": "测试文章",
          "content": "# 测试内容...",
          "status": "published",
          "tags": ["test"],
          "createdAt": "2023-01-01T00:00:00.000Z",
          "updatedAt": "2023-01-01T00:00:00.000Z"
        }
      ],
      "total": 1,
      "page": 1,
      "limit": 10
    },
    "message": "Success"
  }
  ```

### 7.3 相册接口

#### 7.3.1 获取相册列表

- **接口地址**：`GET /api/albums`
- **请求参数**：
  - `page`：页码，默认1
  - `limit`：每页数量，默认10
- **响应示例**：
  ```json
  {
    "success": true,
    "data": {
      "albums": [
        {
          "id": "1765874139052",
          "title": "测试相册",
          "description": "测试相册描述",
          "photos": [
            {
              "id": "1765874145595-210534348",
              "url": "/uploads/photo.jpg",
              "filename": "photo.jpg",
              "size": 102400,
              "uploadedAt": "2023-01-01T00:00:00.000Z"
            }
          ],
          "createdAt": "2023-01-01T00:00:00.000Z",
          "updatedAt": "2023-01-01T00:00:00.000Z"
        }
      ],
      "total": 1,
      "page": 1,
      "limit": 10
    },
    "message": "Success"
  }
  ```

#### 7.3.2 创建相册

- **接口地址**：`POST /api/admin/albums`
- **请求头**：`Authorization: Bearer your_token`
- **请求参数**：
  ```json
  {
    "title": "新相册",
    "description": "相册描述",
    "date": "2023-01-01",
    "location": "北京",
    "tags": ["travel", "photo"]
  }
  ```
- **响应示例**：
  ```json
  {
    "success": true,
    "data": {
      "id": "1765874139052",
      "title": "新相册",
      "description": "相册描述",
      "photos": [],
      "createdAt": "2023-01-01T00:00:00.000Z",
      "updatedAt": "2023-01-01T00:00:00.000Z"
    },
    "message": "Album created successfully"
  }
  ```

### 7.4 文件上传接口

#### 7.4.1 上传照片到相册

- **接口地址**：`POST /api/admin/albums/:id/photos`
- **请求头**：`Authorization: Bearer your_token`
- **请求体**：`multipart/form-data`
  - `photos`：照片文件（支持多个）
- **响应示例**：
  ```json
  {
    "success": true,
    "data": {
      "albumId": "1765874139052",
      "photos": [
        {
          "id": "1765874145595-210534348",
          "url": "/uploads/photo.jpg",
          "filename": "photo.jpg",
          "size": 102400,
          "uploadedAt": "2023-01-01T00:00:00.000Z"
        }
      ]
    },
    "message": "Photos uploaded successfully"
  }
  ```

## 8. 常见问题解答(FAQ)

### 8.1 登录失败怎么办？

**问题**：输入正确的用户名和密码，但登录失败

**解决方案**：
1. 检查后端服务是否正常运行
2. 检查浏览器缓存，重新尝试登录
3. 检查浏览器控制台是否有错误信息
4. 查看后端日志，查找具体错误信息

### 8.2 图片上传失败怎么办？

**问题**：上传照片时失败，没有反应或报错

**解决方案**：
1. 检查文件大小是否超过限制（默认单文件5MB）
2. 检查文件类型是否为图片格式（支持jpg、png、gif等）
3. 检查上传目录权限是否正确
4. 检查后端服务是否正常运行
5. 查看浏览器控制台和后端日志，查找具体错误信息

### 8.3 博客文章无法正常显示怎么办？

**问题**：发布文章后，前端页面无法显示或显示异常

**解决方案**：
1. 检查文章状态是否为 "published"
2. 检查文章内容是否有语法错误
3. 检查前端是否正确请求了文章数据
4. 查看浏览器控制台和后端日志，查找具体错误信息
5. 尝试重新构建前端项目

### 8.4 后端服务启动失败怎么办？

**问题**：后端服务无法启动，出现错误

**解决方案**：
1. 检查端口是否被占用（默认3001端口）
2. 查看控制台输出的错误信息，定位具体问题
3. 检查Node.js版本是否符合要求（必须是Node.js 18.x或更高）
4. 检查环境变量配置是否正确

### 8.5 如何修改默认端口？

**前端**：
- 修改 `astro.config.mjs` 文件中的端口配置

**后端**：
- 修改 `.env` 文件中的 `PORT` 环境变量
  ```
  PORT=8080
  ```

### 8.6 如何修改管理员密码？

**解决方案**：
1. 登录管理后台
2. 进入用户管理页面（如果有）
3. 找到管理员用户，点击修改密码
4. 输入新密码并保存

或直接修改后端的管理员密码配置（具体位置取决于实现）

## 9. 维护与更新日志

### 9.1 维护指南

#### 9.1.1 数据备份

- **数据文件备份**：
  - 定期备份 `backend/database` 目录，该目录存储了所有JSON数据文件

- **文件备份**：
  - 定期备份 `public/uploads` 目录，该目录存储了所有上传的照片

#### 9.1.2 日志查看

- **后端日志**：
  - Express默认日志输出到控制台
  - 可以根据需要添加日志中间件（如morgan）来记录更详细的日志

- **前端日志**：
  - 使用浏览器开发者工具查看控制台日志
  - 使用 `console.log()` 在代码中添加调试信息

#### 9.1.3 性能优化

- **数据优化**：
  - 定期清理无用数据文件
  - 优化JSON数据结构，减少数据大小

- **前端优化**：
  - 压缩静态资源
  - 懒加载图片
  - 使用CDN加速静态资源访问

### 9.2 更新日志

#### 9.2.1 版本 2.0.0（Express 精简版）

- **发布日期**：2025-12-17
- **主要更新**：
  - 简化后端架构，采用 Node.js + Express 实现
  - 使用 JSON 文件存储数据，简化部署流程
  - 保留完整的 RESTful API 功能
  - 使用 JWT + bcryptjs 实现安全认证
  - 优化了文件上传功能
  - 精简项目体积，提高部署效率
  - 改进了管理后台界面

#### 9.2.2 版本 1.0.0

- **发布日期**：2024-06-01
- **主要更新**：
  - 初始版本发布
  - 实现博客文章管理功能
  - 实现相册管理功能
  - 实现标签分类功能
  - 实现响应式设计
  - 实现管理后台
  - 实现基于JWT的用户认证

### 9.3 更新流程

1. **备份数据**：在更新前备份数据文件和上传文件
2. **更新代码**：使用Git拉取最新代码或上传新版本代码
3. **更新后端**：
   - 安装依赖：`npm install`
   - 停止旧服务，启动新服务：`npm start`
4. **更新前端**：
   - 安装依赖：`pnpm install`
   - 构建生产版本：`pnpm build`
   - 部署新的构建产物
5. **验证功能**：检查系统各功能是否正常运行

## 10. 附录

### 10.1 技术术语解释

| 术语 | 解释 |
|------|------|
| Astro | 现代化前端框架，用于构建快速的静态网站 |
| Svelte | 轻量级JavaScript框架，用于构建交互式组件 |
| Tailwind CSS | 实用优先的CSS框架，用于样式设计 |
| Express | Node.js的Web应用框架，提供简洁的API接口 |
| Node.js | 基于Chrome V8引擎的JavaScript运行时，用于构建高性能的网络应用 |
| JWT | JSON Web Token，用于用户身份验证的令牌 |
| RESTful API | 一种软件架构风格，用于设计网络应用程序接口 |
| Markdown | 一种轻量级标记语言，用于编写格式化文档 |
| bcryptjs | 用于密码哈希的JavaScript库 |
| multer | Node.js的中间件，用于处理`multipart/form-data`类型的表单数据，主要用于文件上传 |
| pnpm | 高性能的Node.js包管理器 |

### 10.2 相关资源

- **官方文档**：
  - [Astro 文档](https://docs.astro.build/)
  - [Svelte 文档](https://svelte.dev/docs/)
  - [Express 文档](https://expressjs.com/)
  - [Node.js 文档](https://nodejs.org/docs/)

- **学习资源**：
  - [MDN Web Docs](https://developer.mozilla.org/)
  - [Express 官方教程](https://expressjs.com/en/starter/installing.html)
  - [Tailwind CSS 教程](https://tailwindcss.com/docs/)



感谢您使用 Silver.Z Blog 系统！希望这份文档能帮助您更好地了解和使用该系统。如果您有任何问题或建议，欢迎随时反馈。

祝您使用愉快！

---

**文档版本**：v2.0.0
**更新日期**：2025-12-17
**编写者**：Silver.Z 

---

