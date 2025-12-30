## 在Netlify上部署Express后端的实现方案

### 核心思路

将完整的Express应用转换为Netlify Functions，利用`serverless-http`库适配Express应用到Serverless环境。

### 实现步骤

#### 1. 安装必要依赖

```bash
# 在项目根目录执行
npm install serverless-http netlify-cli -D
```

#### 2. 创建Netlify Functions配置文件

* 在项目根目录创建`netlify.toml`文件

* 配置函数目录和构建命令

#### 3. 重构后端代码为Netlify Function

* 创建`netlify/functions/api`目录

* 将Express应用转换为Netlify Function

* 使用`serverless-http`包装Express应用

#### 4. 调整文件路径和依赖

* 更新所有文件路径引用

* 确保依赖在Netlify环境中能正常工作

#### 5. 部署到Netlify

* 初始化Netlify项目

* 部署Functions

* 配置环境变量

### 预期结果

* 后端API能通过Netlify Functions访问

* 所有原有功能保持不变

* 支持博客文章的CRUD操作

* 支持图片上传功能

### 注意事项

* Netlify Functions有执行时间限制（默认10秒）

* 不支持持久化文件系统，需要将图片存储改为外部服务

* 需要调整CORS配置以允许前端访问

### 具体实现细节

1. **netlify.toml配置**：

   ```toml
   [build]
     functions = "netlify/functions"
     command = "npm run build"

   [dev]
     functions = "netlify/functions"

   [[redirects]]
     from = "/api/*"
     to = "/.netlify/functions/api/:splat"
     status = 200
   ```

2. **Express应用转换**：

   ```javascript
   // netlify/functions/api/index.js
   const serverless = require('serverless-http');
   const app = require('../../../backend/server');

   module.exports.handler = serverless(app);
   ```

3. **调整文件路径**：

   * 更新Express应用中的所有绝对路径引用

   * 确保相对路径能在Functions环境中正常工作

4. **部署命令**：

   ```bash
   netlify init
   netlify deploy --prod
   ```

### 后续优化

* 将图片存储迁移到云存储服务

* 优化函数执行时间

* 添加错误处理和日志监控

