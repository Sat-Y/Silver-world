/* Shared prompts keep the public atlas and local editor in sync. */
window.SILVER_GAME_ATLAS = (() => {
  const sections = [
    { key: "experience", title: "游玩观察", ability: "从真实体验发现问题", fields: [
      ["hook", "一句话体验", "最吸引你的是什么？用一个具体体验描述，而不只是“好玩”。"],
      ["moment", "关键体验与证据", "记录关卡、任务、版本或时间点：发生了什么，你做了什么，结果如何？"],
      ["friction", "流失点与回流动机", "在哪一刻想退出或继续？区分个人偏好与可能普遍存在的问题。"] ] },
    { key: "systems", title: "核心玩法与系统", ability: "机制抽象与系统设计", fields: [
      ["loop", "核心循环", "玩家行动 → 消耗或风险 → 反馈与奖励 → 下一轮目标。分别看单局与长线。"],
      ["decisions", "关键决策与取舍", "玩家有哪些有效选择？信息、成本、风险和收益如何形成策略差异？"],
      ["connections", "系统联动", "战斗、养成、装备、任务如何互相驱动？哪个规则变化会影响其他系统？"] ] },
    { key: "economy", title: "数值与经济", ability: "数值建模与平衡判断", fields: [
      ["resources", "资源产出与消耗", "主要货币、资源从哪里来，到哪里去？哪些限制节奏，哪些可能溢出？"],
      ["progression", "成长与难度曲线", "记录可观察的数值或耗时、采样条件和样本量；分析门槛、反馈和边际收益。"],
      ["balance", "平衡与商业化", "是否存在主导策略？付费或奖励如何改变体验与公平性？不适用可留空。"] ] },
    { key: "levels", title: "关卡与节奏", ability: "教学、挑战与空间设计", fields: [
      ["onboarding", "教学与学习路径", "如何引入规则、让玩家安全练习，再检查掌握程度？"],
      ["pacing", "关卡与情绪节奏", "分析一个具体片段：目标、路线、敌人或谜题配置，以及紧张与休息的交替。"] ] },
    { key: "presentation", title: "叙事与交互", ability: "表达设计意图与理解玩家", fields: [
      ["narrative", "叙事与机制的关系", "剧情、世界观、角色动机是否通过玩家行为表达？举一个对应或冲突的例子。"],
      ["feedback", "操作、信息与反馈", "玩家能否理解当前状态、行动结果和下一目标？关注提示、音画反馈与可访问性。"],
      ["audience", "目标用户与社交动机", "它服务哪类玩家的什么需求？合作、竞争或社区如何影响体验？标明你的推测。"] ] },
    { key: "practice", title: "改进与设计迁移", ability: "方案落地、验证与复盘", fields: [
      ["hypothesis", "问题与原因假设", "观察事实 → 可能原因 → 受影响玩家。把已知与推测分开。"],
      ["proposal", "改进方案与代价", "只改一个关键点：规则怎么变？预期收益、开发成本和副作用是什么？"],
      ["validation", "最小验证计划", "用什么原型或测试验证？观察谁、什么行为或指标，怎样判断成功与失败？"],
      ["transfer", "可迁移的设计原则", "提炼可用于自己项目的一条原则，同时写明适用条件与不适用边界。"] ] }
  ];
  const onlineSections = [
    { key: "online-experience", title: "游玩与留存", ability: "从持续体验识别留存动力", fields: [
      ["hook", "一句话体验", "这款游戏最稳定的吸引力是什么？用一个具体体验描述。"],
      ["moment", "关键体验与证据", "记录一次对局、任务、赛季或回流节点：发生了什么，为什么继续或退出？"],
      ["retention", "回流与日常节奏", "日常、周常、赛季、活动怎样组织目标？哪些是主动期待，哪些容易形成负担？"] ] },
    { key: "online-loop", title: "核心循环与成长", ability: "分析短局体验与长线目标", fields: [
      ["loop", "核心循环", "单局行动、反馈与奖励如何连接到局外成长？"],
      ["progression", "长线成长", "养成线如何制造阶段目标？追赶、重置和新旧内容之间怎样衔接？"],
      ["balance", "环境与平衡", "版本中有哪些主导策略？更新如何改变选择空间与公平感？"] ] },
    { key: "online-operations", title: "运营、经济与社交", ability: "理解持续运营的系统协作", fields: [
      ["resources", "资源与付费", "核心资源如何产出和回收？商业化如何影响节奏、选择与公平性？"],
      ["liveops", "活动与内容更新", "活动怎样复用或改变核心玩法？奖励、频率和内容成本是否可持续？"],
      ["social", "社交与生态", "组队、公会、竞争、交易或社区如何产生关系与内容？有哪些负面外部性？"] ] },
    { key: "online-practice", title: "问题、方案与验证", ability: "提出可验证且考虑运营代价的方案", fields: [
      ["hypothesis", "问题与原因假设", "观察事实 → 可能原因 → 受影响玩家。区分新手、活跃、回流与付费玩家。"],
      ["proposal", "改进方案与代价", "规则、奖励或运营节奏怎么变？同时记录开发、内容和社区风险。"],
      ["validation", "验证指标与护栏", "观察留存、参与、完成、付费或社区行为中的哪些变化？哪些指标不能被牺牲？"],
      ["transfer", "可迁移的设计原则", "提炼一条可复用原则，并写明它适用的产品阶段和边界。"] ] }
  ];
  const formats = [
    { value: "indie", label: "独立 / 单机游戏" },
    { value: "online", label: "网络游戏" }
  ];
  const statuses = ["在玩", "已通关", "持续游玩", "暂时搁置", "已弃坑"];
  const escape = value => String(value ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  const text = value => escape(value).replace(/\n/g, "<br>");
  const entries = () => Array.isArray(window.SILVER_DATA.games) ? window.SILVER_DATA.games : [];
  const getSections = game => game?.format === "online" ? onlineSections : sections;
  const formatLabel = game => formats.find(item => item.value === (game.format || "indie"))?.label || formats[0].label;
  const allFields = [...new Map([...sections, ...onlineSections].flatMap(s => s.fields).map(field => [field[0], field])).values()];
  const filled = game => allFields.filter(([key]) => String(game[key] || "").trim()).length;
  function render(id) {
    const games = entries();
    const game = id ? games.find(g => g.id === id) : null;
    if (id && !game) return `<section class="page game-atlas"><h1>未找到这份游戏记录</h1><a class="route-link" href="?view=games" data-route="games">返回游戏图鉴</a></section>`;
    if (game) return `<article class="page game-atlas"><a class="back-link route-link mono" href="?view=games" data-route="games">← 返回游戏图鉴</a><header class="game-heading"><span class="game-format">${escape(formatLabel(game))}</span><h1>${escape(game.title || "未命名游戏")}</h1><p>${escape([game.genre, game.platform, game.status].filter(Boolean).join(" / "))}</p></header><dl class="game-facts">${[["游玩时长", game.hours === "" || game.hours == null ? "未记录" : `${game.hours} 小时`], ["版本 / 难度", game.version], ["游玩时间", [game.startedAt, game.finishedAt].filter(Boolean).join(" — ")], ["拆解主题", game.focus]].map(([k,v]) => `<div><dt>${escape(k)}</dt><dd>${escape(v || "未记录")}</dd></div>`).join("")}</dl>${game.cover && /^(assets\/|https?:\/\/)/.test(game.cover) ? `<img class="game-cover" src="${escape(game.cover)}" alt="${escape(game.title)}游戏截图" loading="lazy">` : ""}<div class="game-analysis">${getSections(game).map(s => { const fields = s.fields.filter(([key]) => String(game[key] || "").trim()); return fields.length ? `<section><header><h2>${s.title}</h2><p>${s.ability}</p></header><div>${fields.map(([key,label]) => `<section><h3>${label}</h3><p>${text(game[key])}</p></section>`).join("")}</div></section>` : ""; }).join("") || '<p class="game-empty">这份记录已建立，策划观察还在整理中。</p>'}</div></article>`;
    return `<section class="page game-atlas"><header class="game-heading"><h1>游戏图鉴</h1><p>从玩家的体验出发，留下游戏策划的观察。独立游戏关注完整体验，网络游戏聚焦循环、成长与持续运营。</p></header><div class="game-toolbar"><label>搜索游戏<input id="game-search" type="search" placeholder="游戏名、类型或拆解主题"></label><label>游戏形态<select id="game-format"><option value="">全部形态</option>${formats.map(f => `<option value="${f.value}">${f.label}</option>`).join("")}</select></label><label>游玩状态<select id="game-status"><option value="">全部状态</option>${statuses.map(s => `<option>${s}</option>`).join("")}</select></label><span id="game-count" role="status">${games.length} 款游戏</span></div><div id="game-records">${games.map(g => `<a class="game-row route-link" data-game-id="${escape(g.id)}" href="?view=game&id=${encodeURIComponent(g.id)}" data-route="game"><div><span class="game-format">${escape(formatLabel(g))}</span><h2>${escape(g.title || "未命名游戏")}</h2><p>${escape([g.genre, g.platform, g.focus].filter(Boolean).join(" · ") || "基础资料待补充")}</p><p>${escape(g.hook || "还没有记录一句话体验")}</p></div><div class="game-row-meta"><span>${escape(g.status || "未记录状态")}</span><span>${g.hours === "" || g.hours == null ? "时长未记录" : `${escape(g.hours)} h`}</span><small>${filled(g) ? `${filled(g)} 项观察` : "游玩记录"}</small></div></a>`).join("")}</div><p id="game-no-results" class="game-empty" ${games.length ? "hidden" : ""}>${games.length ? "没有匹配的游戏，试试其他关键词或状态。" : "图鉴还没有记录。在本地内容工作台的“游戏图鉴”中新建第一款游戏。"}</p><details class="game-guide" ${games.length ? "" : "open"}><summary>两类游戏分别记录什么？</summary><p><strong>独立 / 单机游戏</strong>适合完整拆解玩法、关卡、叙事和体验；<strong>网络游戏</strong>使用精简模板，重点分析短局循环、长线成长、运营经济、社交生态和留存。</p></details></section>`;
  }
  function bind() {
    const search = document.querySelector("#game-search"), status = document.querySelector("#game-status"), format = document.querySelector("#game-format");
    if (!search || !status || !format) return;
    function filter() {
      const query = search.value.trim().toLocaleLowerCase();
      let count = 0;
      document.querySelectorAll(".game-row").forEach(row => {
        const game = entries().find(g => g.id === row.dataset.gameId);
        row.hidden = !(game && (!format.value || (game.format || "indie") === format.value) && (!status.value || game.status === status.value) && [game.title, game.genre, game.focus, game.platform].join(" ").toLocaleLowerCase().includes(query));
        if (!row.hidden) count++;
      });
      document.querySelector("#game-count").textContent = `${count} 款游戏`;
      document.querySelector("#game-no-results").hidden = count > 0;
    }
    search.addEventListener("input", filter);
    status.addEventListener("change", filter);
    format.addEventListener("change", filter);
  }
  return { sections, onlineSections, formats, statuses, getSections, render, bind };
})();
