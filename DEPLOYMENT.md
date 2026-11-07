# 发布与资源优化

本地工作台仍通过 `启动 Silver OS.bat` 启动，编辑的是原始素材与内容。

发布构建：

```sh
npm ci
npm run build
```

Netlify 从 `netlify.toml` 读取构建命令，并仅发布 `dist/`。工作台源码、草稿、备份和临时文件不会进入发布目录。

构建脚本会扫描网站引用的资源，把 PNG/JPEG 转为 WebP（保留分辨率和透明度，仅在体积至少减少 5% 时替换），发布文件自动引用带内容哈希的新文件名；原图保留用于编辑。哈希图片使用长期缓存。视频维持原文件，项目视频继续按需加载。

后续更新：工作台导出公开内容后，提交 `content.js`、相关数据文件及新增素材，推送即可触发同一套优化流程。不要提交本地草稿与备份。


## 当前目录结构

- `index.html`、`app.js`、`portfolio.css`：公开网站入口、页面逻辑及当前视觉样式。
- `styles.css`：现有页面仍依赖的基础样式，保留。
- `content.js`、`trading-data.js`、`fitness-data.js`：网站内容与记录数据。
- `assets/`：网站素材、地图数据、人生 K 线和共享项目详情组件。
- `.local-studio/public/`：工作台界面、白天/夜间主题、可视化项目编辑。
- `.local-studio/server.js`：本地预览、保存、素材上传与导出服务。
- `.local-studio/data/`、`.local-studio/memories/`：私人草稿、备份、暂存素材与本地记忆，不公开发布。
- `scripts/build-site.cjs`：网站构建及图片优化；不再包含已取消的 3D 场景。
- `dist/`：自动生成的发布目录，不手动维护。
- `.artifacts/`：本地验证结果，不参与构建或发布。

工作台入口为 `http://127.0.0.1:4178/`，前端预览为 `http://127.0.0.1:4178/site/index.html`。
