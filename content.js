/*
 * Silver OS 内容中心
 * 修改这个文件即可更新身份、项目、能力、人生章节和版本记录。
 * 页面布局与交互位于 app.js，视觉样式位于 styles.css。
 */
window.SILVER_DATA = {
  profile: {
    availability: "SYSTEM ONLINE · HANGZHOU, CN",
    role: "AI GAME PLANNER / SYSTEM DESIGNER",
    statement: "我设计由 AI 驱动的游戏机制，也在设计自己的成长系统。",
    email: "19858810407@139.com",
    updatedAt: "2026.07.31",
    chapter: {
      code: "CHAPTER 04 / CAREER ENTRY",
      title: "腾讯副本",
      summary: "从学生原型开发转向工业化游戏生产，在真实协作中建立玩法策划与 AI 系统能力。",
      meta: [
        ["LOCATION", "杭州"],
        ["ROLE", "AI 游戏策划"],
        ["STATUS", "探索中"]
      ]
    },
    quest: { title: "完成职业能力迁移", progress: 68 },
    metrics: [
      { label: "ACTIVE PROJECTS", value: "02", note: "BUILDING" },
      { label: "RELEASED PROTOTYPES", value: "04", note: "VERIFIED" },
      { label: "CURRENT VERSION", value: "21.4", note: "STABLE" },
      { label: "NEXT MILESTONE", value: "AI PRODUCT", note: "LOCKED" }
    ]
  },

  projects: [
    {
      id: "OBS–P01",
      slug: "interrogation-room-0",
      category: "game",
      status: "开发中",
      title: "0号审讯室",
      english: "Interrogation Room #0",
      summary: "心理博弈审讯模拟。玩家通过证物与对话策略，在嫌疑人的心理状态变化中寻找突破口。",
      problem: "传统对话树很容易退化成寻找正确选项。我希望审讯不是背答案，而是观察心理变化、组合证物并承担施压策略的后果。",
      system: "用 mental health、stress level 和 suspicion 构成三维心理状态；证物标签与对话行为持续修改状态，再由状态决定角色反馈和可用策略。",
      outcome: "核心审讯循环已经可以运行，下一阶段将补充完整案件内容、失败反馈与更清晰的心理状态表现。",
      role: "玩法策划 / 独立开发",
      evidence: ["三维心理状态引擎", "证物标签影响对话树", "Godot 4.5 / GDScript"],
      index: "01"
    },
    {
      id: "OBS–P02",
      slug: "the-final-resonance",
      category: "game",
      status: "可运行 Demo",
      title: "最终共鸣",
      english: "The Final Resonance",
      summary: "AI 驱动的心理惊悚叙事游戏。角色在动态 Prompt 控制下经历四阶段人格演变。",
      problem: "生成式角色很容易只有随机对话，没有可感知的剧情推进。项目需要让模型变化成为叙事机制，而不是聊天装饰。",
      system: "通过四阶段动态 Prompt、人格状态追踪和 RAG 镜像模仿控制角色演变，再将玩家行为映射到 16 种人格结局。",
      outcome: "完成可运行 Demo 与主要系统验证，证明 AI 角色变化可以被组织成有方向的游戏体验。",
      role: "系统设计 / 开发",
      evidence: ["RAG 镜像模仿", "16 种 MBTI 结局", "约 3,000 行代码"],
      index: "02"
    },
    {
      id: "OBS–P03",
      slug: "cloud-mirage-express",
      category: "game",
      status: "暂停",
      title: "云端列车",
      english: "Cloud Mirage Express",
      summary: "像素风调酒模拟经营，以收入、成本和税务构成三层经济循环。",
      problem: "模拟经营需要让每次调酒、定价和采购都进入同一经济循环，同时保持内容可以被快速扩充。",
      system: "以 CSV 管理配方与商品数据，结合 Godot Resource 承载运行状态，构成收入、成本和税务三层反馈。",
      outcome: "完成主要经营框架后暂停开发，保留为数据驱动架构与协作开发的验证记录。",
      role: "系统策划 / 协作开发",
      evidence: ["CSV 数据驱动", "Resource 混合架构", "经济循环设计"],
      index: "03"
    },
    {
      id: "OBS–P04",
      slug: "ai-toolset-experiments",
      category: "ai",
      status: "实验归档",
      title: "AI 工具实验",
      english: "AI Toolset Experiments",
      summary: "用短周期原型验证 AI API 的真实使用场景，包括桌宠、翻译器与代码助手。",
      problem: "很多 AI 想法停留在概念层，无法判断用户是否真的需要，也无法暴露接口延迟、容错和交互成本。",
      system: "把每个想法压缩为一天到数天的最小原型，优先打通输入、模型调用、异常处理和结果反馈。",
      outcome: "交付多个可使用的小工具，也形成了一套从想法到可运行验证的快速实验方法。",
      role: "产品构思 / 开发",
      evidence: ["1 天桌宠原型", "实时翻译悬浮窗", "DeepSeek API"],
      index: "04"
    }
  ],

  capabilities: [
    { code: "CAP–01", title: "AI 玩法与叙事系统", desc: "把模型能力转化成玩家可感知的规则、反馈和不确定性。", proof: "动态 Prompt / RAG / 多结局叙事" },
    { code: "CAP–02", title: "游戏机制与系统设计", desc: "从核心循环、状态变量到内容结构，建立可以解释和验证的玩法系统。", proof: "心理状态引擎 / 经济循环 / 数值框架" },
    { code: "CAP–03", title: "快速原型实现", desc: "不让策划停留在文档中，用可运行原型验证体验与技术风险。", proof: "Godot / GDScript / Python" },
    { code: "CAP–04", title: "AI 产品实验", desc: "从真实问题出发，用最小范围验证 API、工作流和交互方案。", proof: "工具原型 / API 容错 / 工作流设计" }
  ],

  journey: [
    { date: "2026 / NOW", title: "进入工业化游戏生产", label: "CURRENT", text: "在腾讯互动担任 AI 游戏策划实习生，把个人原型经验迁移到真实团队协作。" },
    { date: "2025 / 04", title: "第一次职业验证", label: "MILESTONE", text: "92 天集中重构作品与表达方式，获得腾讯子公司 AI 玩法策划实习 Offer。" },
    { date: "2025 / 01", title: "独立开发成为主线", label: "PIVOT", text: "开始持续制作 Godot 游戏原型，逐渐确认 AI、心理叙事与系统设计的交叉方向。" },
    { date: "2024", title: "从 AI 专业走向游戏", label: "ORIGIN", text: "在人工智能学习之外，通过竞赛、工具实验和游戏项目寻找更强的创造出口。" }
  ],

  versions: [
    {
      version: "v21.4",
      date: "2026.07",
      title: "职业迁移进行中",
      changes: [
        ["ADD", "进入 AI 游戏策划的真实生产环境"],
        ["ADD", "建立 Silver OS 产品方向"],
        ["FIX", "减少同时推进的支线项目"],
        ["NEXT", "完成一个可公开体验的 AI 产品"]
      ]
    },
    {
      version: "v20.9",
      date: "2025.04",
      title: "作品集重构版本",
      changes: [
        ["ADD", "获得腾讯互动实习 Offer"],
        ["ADD", "完成 0号审讯室核心循环"],
        ["LEARN", "外部反馈比封闭自评更有效"]
      ]
    },
    {
      version: "v20.6",
      date: "2025.01",
      title: "独立开发主线启动",
      changes: [
        ["ADD", "Godot 成为主要原型工具"],
        ["ADD", "AI 叙事系统进入项目实践"],
        ["BREAK", "停止等待完美计划后再行动"]
      ]
    }
  ],

  socials: [
    { label: "GitHub", href: "https://github.com/Sat-Y?tab=repositories" },
    { label: "Douyin", href: "https://www.douyin.com/user/MS4wLjABAAAAm1NLHxmXfGA4qVcc-2YIAgt3stWfl_zaNozQ13hUR-uq-dHHYggP68kIaGRLPfg8" }
  ]
};
