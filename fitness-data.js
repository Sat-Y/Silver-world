window.SILVER_FITNESS = {
  profile: { age: 21, gender: "男", height: 173, weight: 55, waist: 66.4, pushups: 20, narrowPullups: 6, widePullups: 1, targetWeight: 65, phaseTarget: "57–59kg", goal: "薄肌 · 肩背更明显 · 保持细腰" },
  phases: [
    { weeks: "W01–04", title: "建立系统", target: "≈ 56kg", goals: ["建立每周 4 练习惯", "学会标准动作", "体重开始缓慢上涨"] },
    { weeks: "W05–08", title: "增肌阶段", target: "56.5–58kg", goals: ["提高训练容量", "增加阻力或动作难度", "肩、胸、背出现视觉变化"] },
    { weeks: "W09–12", title: "视觉强化", target: "57–59kg", goals: ["强化肩、背、上胸与手臂", "保持腰围相对稳定", "完成 Day 84 身材对比"] }
  ],
  week: [
    { day: "周一", code: "MON", type: "PUSH", focus: "胸 / 肩 / 三头", duration: "19:30–20:15", training: true }, { day: "周二", code: "TUE", type: "REST", focus: "恢复", training: false },
    { day: "周三", code: "WED", type: "PULL", focus: "背 / 二头", duration: "19:30–20:15", training: true }, { day: "周四", code: "THU", type: "REST", focus: "恢复", training: false },
    { day: "周五", code: "FRI", type: "LEGS", focus: "腿 / 臀 / 核心", duration: "19:30–20:15", training: true }, { day: "周六", code: "SAT", type: "UPPER", focus: "上半身强化", duration: "45–60 MIN", training: true },
    { day: "周日", code: "SUN", type: "OFF", focus: "完全休息", training: false }
  ],
  workouts: {
    PUSH: [["标准俯卧撑", "4 × 8–15"], ["脚垫高俯卧撑", "3 × 6–12"], ["Pike 俯卧撑", "3 × 6–12"], ["弹力带侧平举", "3 × 12–20"], ["窄距俯卧撑", "2 × 6–12"], ["平板支撑", "2 × 30–60秒"]],
    PULL: [["引体向上", "4 × 2–5"], ["弹力带高位下拉", "3 × 10–15"], ["弹力带划船", "4 × 10–15"], ["弹力带面拉", "3 × 12–20"], ["弹力带反向飞鸟", "2 × 12–20"], ["弹力带弯举", "3 × 10–15"]],
    LEGS: [["自重深蹲", "4 × 15–20"], ["保加利亚分腿蹲", "3 × 8–12 / 每腿"], ["弹力带罗马尼亚硬拉", "3 × 10–15"], ["臀桥", "3 × 15–20"], ["单腿提踵", "3 × 15–25 / 每腿"], ["反向卷腹", "3 × 10–15"], ["Dead Bug", "2 × 10 / 每侧"]],
    UPPER: [["脚垫高俯卧撑", "3 × 8–15"], ["弹力带划船", "3 × 10–15"], ["Pike 俯卧撑", "3 × 6–12"], ["弹力带侧平举", "4 × 12–20"], ["弹力带面拉", "3 × 12–20"], ["弹力带弯举", "3 × 10–15"], ["窄距俯卧撑", "3 × 8–15"], ["卷腹", "3 × 12–20"]]
  },
  meals: [{ label: "早餐 · ¥11", title: "2 鸡蛋 + 豆浆 + 1–2 馒头", note: "豆浆正常糖或少糖；剩余额度优先拿饮用水。" }, { label: "午餐 · ¥8.5", title: "牛肉饭团 × 1", note: "早餐额度允许时，可把额外鸡蛋留到中午。" }, { label: "晚餐 · ¥22", title: "鸡腿 + 米饭 + 豆腐/蛋 + 绿叶菜", note: "鸡腿 ¥8；米饭 ¥3 无限续，吃约 1.5–2 碗。" }],
  vegetables: ["菠菜", "油麦菜", "小白菜", "西兰花", "空心菜", "芥蓝", "花菜"]
};
