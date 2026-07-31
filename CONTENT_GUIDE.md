# Silver OS 内容维护指南

网站内容集中在 `content.js`，日常更新不需要修改 HTML、CSS 或页面布局。

## 更新当前身份

编辑 `profile`：

- `availability`：公开状态与所在地
- `role`：职业定位
- `statement`：首页主张
- `updatedAt`：数据更新时间
- `chapter`：当前人生章节
- `quest`：当前主线与展示进度
- `metrics`：首屏四项摘要

## 新增项目

复制 `projects` 数组中的一个完整对象，修改以下字段：

- `id`：唯一档案编号
- `slug`：项目详情地址使用的英文标识，例如 `interrogation-room-0`，不可重复
- `category`：使用 `game` 或 `ai`，决定筛选分类
- `status`：开发中、已发布、暂停或归档
- `title` / `english`：中英文名称
- `summary`：一句项目说明
- `problem`：项目要解决的问题
- `system`：你的系统方案
- `outcome`：当前结果与下一步
- `role`：个人职责
- `evidence`：三项可验证能力或成果
- `index`：两位数显示编号

## 新增人生章节

在 `journey` 数组顶部添加一项。建议只记录真正改变方向的节点，不记录日常流水账。

## 新增版本记录

在 `versions` 数组顶部添加新版本。`changes` 支持自由标签，推荐使用：

- `ADD`：新增身份、能力或成果
- `FIX`：修正问题
- `LEARN`：得到的新认知
- `BREAK`：放弃旧习惯或旧方向
- `NEXT`：下一版本目标

首页的“当前版本”会自动读取 `versions` 第一项。

## 页面地址

网站使用独立视图 URL，可以直接分享并支持浏览器前进、后退：

- `?view=overview`：系统总览
- `?view=projects`：项目档案
- `?view=project&id=项目slug`：项目详情
- `?view=capabilities`：能力系统
- `?view=journey`：人生章节
- `?view=changelog`：版本记录
- `?view=connect`：联系页面

## 发布前检查

1. 确认链接与邮箱可以访问。
2. 更新 `profile.updatedAt`。
3. 项目证据尽量使用真实数据或可查看成果。
4. 不要在公开内容中写入资产、健康、公司内部信息等敏感数据。
