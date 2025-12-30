# 🌸 Silver.Z Blog

![Node.js >= 18](https://img.shields.io/badge/node.js-%3E%3D18-brightgreen) ![pnpm >= 9](https://img.shields.io/badge/pnpm-%3E%3D9-blue) ![Astro 5.13.7](https://img.shields.io/badge/Astro-5.13.7-orange) ![TypeScript 5.9.2](https://img.shields.io/badge/TypeScript-5.9.2-blue) ![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)

一个现代化的个人博客系统，采用纯静态前端架构，具有美观的界面和丰富的功能。该系统支持博客文章展示、相册展示、标签分类等核心功能。

## ✨ 核心特性

- **现代化技术栈**：采用前沿技术，确保系统性能和可维护性
- **纯静态架构**：无需后端服务器，便于部署和维护
- **响应式设计**：适配桌面端、平板和手机等多种设备
- **Markdown支持**：支持使用Markdown编写博客文章
- **丰富的组件库**：内置多种实用组件，如音乐播放器、看板娘等
- **照片画廊**：支持相册照片的精美展示
- **搜索功能**：支持全站内容搜索
- **国际化支持**：支持多种语言切换

## 🛠️ 技术栈

| 技术 | 版本 | 用途 |
|------|------|------|
| Astro | 5.13.7 | 现代前端框架，用于构建快速的静态网站 |
| Svelte | 5.38.10 | 轻量级JavaScript框架，用于构建交互式组件 |
| Tailwind CSS | 3.4.17 | 实用优先的CSS框架，用于样式设计 |
| TypeScript | 5.9.2 | 类型安全的JavaScript超集 |
| Swup | 1.7.0 | 页面过渡库，实现流畅的页面切换 |
| Photoswipe | 5.4.4 | 图片画廊插件，用于照片预览 |
| Pagefind | 1.4.0 | 静态网站搜索库 |

## 📁 项目结构

```
├── src/              # 前端源代码
│   ├── components/   # 可复用组件
│   ├── content/      # 博客文章和内容文件
│   ├── layouts/      # 页面布局
│   ├── pages/        # 页面文件
│   └── utils/        # 工具函数
├── public/           # 静态资源
├── astro.config.mjs  # Astro配置文件
├── package.json      # 项目依赖配置
└── README.md         # 项目说明文档
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

### 前端部署

1. **安装依赖**
   ```bash
   pnpm install
   ```

2. **启动开发服务器**
   ```bash
   pnpm dev
   ```
   访问 http://localhost:3000 查看博客

3. **构建生产版本**
   ```bash
   pnpm build
   ```
   构建后的文件将生成在 `dist` 目录

4. **预览生产版本**
   ```bash
   pnpm preview
   ```

## 📖 使用指南

### 添加博客文章

1. 在 `src/content/posts` 目录下创建新的Markdown文件
2. 按照以下格式编写文章元数据和内容：
   ```markdown
   --- 
title: "文章标题"
date: 2025-12-30
description: "文章描述"
banner: "/assets/images/banner.jpg"
tags: ["标签1", "标签2"]
categories: ["分类"]
published: true
---

# 文章内容

使用Markdown语法编写文章内容...
   ```

### 添加相册

1. 在 `public/images/albums` 目录下创建新的相册目录
2. 在该目录下添加照片文件和 `info.json` 配置文件：
   ```json
   {
     "title": "相册标题",
     "description": "相册描述",
     "date": "2025-12-30",
     "cover": "cover.jpg"
   }
   ```

## 🔧 配置说明

### 前端配置

编辑 `src/config.ts` 文件，自定义博客标题、副标题、语言等基本信息：

```typescript
// 网站基本配置
export const siteConfig = {
  title: "Silver.Z Blog",
  subtitle: "一个现代化的个人博客",
  lang: "zh_CN",
  // 其他配置...
};
```

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 🙏 致谢

- 基于 [Mizuki Blog](https://github.com/matsuzaka-yuki/mizuki) 模板开发
- 感谢所有开源项目的贡献者

---

**文档版本**：v3.0.0
**更新日期**：2025-12-30
**编写者**：Silver.Z