---
name: Silver OS
description: 面向招聘者、创作者与个人长期维护的个人数据观测站
colors:
  dark-background: "#0b0d0f"
  dark-surface: "#111417"
  dark-surface-raised: "#171b1f"
  dark-text: "#e8e9e5"
  light-background: "#eceeea"
  light-surface: "#f4f5f1"
  light-text: "#121618"
  cyan-accent-dark: "#a9d8df"
  cyan-accent-light: "#176c79"
  signal-green: "#9fe0b7"
typography:
  display:
    fontFamily: "Manrope, Noto Sans SC, sans-serif"
    fontSize: "clamp(3.25rem, 8vw, 7.5rem)"
    fontWeight: 500
    lineHeight: 0.9
    letterSpacing: "-0.04em"
  body:
    fontFamily: "Manrope, Noto Sans SC, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "IBM Plex Mono, monospace"
    fontSize: "0.6875rem"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "0.08em"
spacing:
  xs: "8px"
  sm: "12px"
  md: "20px"
  lg: "32px"
  xl: "64px"
components:
  action-primary:
    backgroundColor: "{colors.dark-text}"
    textColor: "{colors.dark-background}"
    padding: "12px 18px"
  panel:
    backgroundColor: "{colors.dark-surface}"
    textColor: "{colors.dark-text}"
    padding: "24px"
---

# Design System: Silver OS

## Overview

**Creative North Star: “The Living Career Observatory”**

Silver OS 是一套仍在运行的个人职业观测系统，而不是一次性完成的作品集。界面继承当前冷静的系统终端、数据档案与黑白漫画肖像语言，让招聘信息清晰可查，同时允许普通访客深入探索项目、实验和人生足迹。

默认窗口是 Resume。它负责在最短时间内建立身份、方向、能力证据与行动入口；其他窗口保持更强的探索感。视觉表达始终服务真实内容，不使用虚构数据制造“高级感”。

**Key Characteristics:**

- 克制的中性色表面与稀有青灰强调色。
- 大尺度无衬线标题与等宽数据标签形成双层信息语言。
- 头像作为人物锚点，档案编号和系统状态作为世界观线索。
- 页面各自拥有独立结构，但共享侧栏、顶栏、转场和状态规则。

## Colors

配色采用“中性观测台 + 单一信号色”策略。青灰色只用于当前状态、关键链接、焦点和少量数据，不铺满页面。

**The One Signal Rule.** 每个首屏只允许一个主要青灰视觉焦点；招聘信息的可读性优先于装饰。

## Typography

显示与正文使用 Manrope / Noto Sans SC，数据、编号、路径和状态使用 IBM Plex Mono。大标题保持紧凑但不低于 `-0.04em` 字距，正文行宽控制在约 65–75 个字符。

**The Two Voices Rule.** 等宽字体只表达系统信息、编号和测量结果，不用于大段叙述。

## Layout

桌面端由固定侧栏、粘性顶栏和独立内容窗口组成。Resume 使用非对称人物档案布局；Projects 使用档案索引；Lab 使用实验队列；Footprints 使用世界与中国两级地图；Changelog 使用版本流；Connect 使用单一明确联系动作。

移动端底部只暴露 Resume、Projects、Lab 和 More 四个入口，其余窗口进入抽屉。主要断点沿用现有实现，并保证内容顺序在单列布局中仍符合阅读优先级。

## Elevation & Depth

系统默认扁平，以明度差、细边界和内容密度表现层级。阴影只用于浮动导航、抽屉或正在发生的转场，不给静态卡片叠加装饰性阴影。

## Local Content Studio

Silver Content Studio 是仅供本人使用的本地 Operate 界面，继承 Silver OS 的中性表面、硬边界、青灰信号色与双层字体语言，但采用更稳定的侧栏、工具栏、表单和主从编辑结构。主要任务路径固定为“编辑草稿 → 实时预览 → 导出公开内容”。草稿、私人和隐藏记录不得进入公开导出；自动保存、历史备份和素材安全命名属于系统能力，而不是用户需要手工维护的步骤。桌面端优先保证长时间编辑效率，移动端允许完成轻量修改，但不替代桌面作为主要工作环境。

## Shapes

形态以直角、细线和裁切式分区为主。圆形仅用于状态灯，胶囊形仅用于小型筛选或状态控件。头像可使用硬边裁切，避免社交媒体式圆形头像。

## Components

### Navigation

- 桌面侧栏展示编号、英文窗口名和中文说明。
- 当前窗口使用强调色、状态标记和更高文字对比度。
- 顶栏展示完整路径；项目详情追加当前记录名称。
- 页面切换复用现有墨水扫描式转场，并尊重 `prefers-reduced-motion`。

### Resume

- 首屏必须包含头像、姓名、职业方向、简短价值主张、联系动作和简历下载占位。
- 后续依次展示经历、精选项目、能力证据、教育与工具。
- 未提供内容显示 `CONTENT PENDING`，不得生成虚假经历。

### Projects

- 只收录能够作为正式能力证据的项目。
- 项目详情围绕问题、系统、个人贡献、过程证据和结果组织。

### Lab

- 收录原型、工具、试验和进行中的探索。
- 每项标明状态、验证问题、使用技术和下一步，不与正式项目混用。

### Footprints / Changelog / Connect

- Footprints 以世界国家与中国省级两层 SVG 地图记录地点和人生阶段；中国为当前可深入区域，浙江承载已确认的温州与杭州足迹。
- 世界地图的其他国家显示“暂未探索”，中国地图中没有内容的省份显示“尚未建立足迹档案”，不虚构到访记录。
- 地图占满顶栏以下的视口，使用连续缩放式切换与键盘可访问区域；世界层级首次选择国家时统一放大至 3 倍，进入中国后首次选择省份再追加 3 倍的二级放大。同一层级切换其他国家或省份只平移中心，不继续叠加缩放。跨越地图投影边界的区域允许使用单独的视觉中心修正，例如俄罗斯需要向左调整主体构图。点击中国时，地图缩放、省界显现和右侧抽屉同步启动，省界在放大的中国轮廓内原地出现，不跳转独立地图。所有国家、省份和空状态的右侧抽屉都统一采用朋友圈式信息流，沿用米白、黑、红配色。全球足迹只维护一份 `records` 数据，每条记录通过 `country`、`province` 标签建立层级：点击国家筛选对应 `country`，点击中国读取全部中国记录，点击省份继续筛选 `China + province`，因此世界、国家和省份层级的文字、时间与图片始终同步。点击抽屉关闭按钮直接退出省级模式并回到世界地图。Changelog 强调最近变化，避免与足迹记录重复流水账。
- Connect 只保留真实可用渠道，并预留 PDF 简历下载入口。

## Do's and Don'ts

### Do:

- **Do** 让招聘者在 30 秒内找到身份、目标方向、代表证据和联系方式。
- **Do** 让每个窗口拥有符合内容的布局，而不是重复同一种卡片网格。
- **Do** 使用真实项目证据替代主观技能分数。
- **Do** 保持键盘焦点、移动端触控尺寸和减少动态偏好。

### Don't:

- **Don't** 虚构履历、指标、客户或项目结果。
- **Don't** 让系统世界观遮挡职位、经历和联系方式。
- **Don't** 把 Capabilities 继续作为顶级窗口；能力应嵌入 Resume 与项目证据。
- **Don't** 为每个元素添加扫描、闪烁或故障效果；主要动态只属于窗口切换。
