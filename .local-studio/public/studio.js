const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

const state = {
  data: null,
  status: null,
  mapCountries: [],
  section: "dashboard",
  selectedProject: 0,
  selectedProvince: "",
  selectedJournal: 0,
  dirty: false,
  saving: false,
  savePromise: null,
  uploadPath: null,
  autosaveTimer: null
};

const sectionMeta = {
  dashboard: ["WORKSPACE / OVERVIEW", "内容总览"],
  resume: ["CONTENT / RESUME", "简历编辑"],
  projects: ["CONTENT / PROJECTS", "项目档案"],
  footprints: ["CONTENT / FOOTPRINTS", "人生足迹"],
  fitness: ["CONTENT / FITNESS", "健身记录"],
  trading: ["CONTENT / TRADING", "交易系统"],
  advanced: ["SYSTEM / COMPLETE DATA", "高级数据"]
};

function esc(value = "") {
  return String(value).replace(/[&<>'"]/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[char]));
}

const countryNameAliases = {
  "United States of America": "美国", Russia: "俄罗斯", China: "中国", "South Korea": "韩国", "North Korea": "朝鲜",
  "Democratic Republic of the Congo": "刚果民主共和国", "Republic of the Congo": "刚果共和国", "United Republic of Tanzania": "坦桑尼亚",
  "East Timor": "东帝汶", "Czech Republic": "捷克", Iran: "伊朗", Syria: "叙利亚", Laos: "老挝", Vietnam: "越南",
  "Ivory Coast": "科特迪瓦", Swaziland: "斯威士兰", Macedonia: "北马其顿", Bolivia: "玻利维亚", Venezuela: "委内瑞拉",
  Moldova: "摩尔多瓦", Palestine: "巴勒斯坦", Brunei: "文莱", Taiwan: "中国台湾", Somaliland: "索马里兰"
};

function buildCountryTranslations() {
  const translations = new Map();
  try {
    const english = new Intl.DisplayNames(["en"], { type: "region" });
    const chinese = new Intl.DisplayNames(["zh-CN"], { type: "region" });
    for (let first = 65; first <= 90; first += 1) for (let second = 65; second <= 90; second += 1) {
      const code = String.fromCharCode(first, second);
      const englishName = english.of(code);
      const chineseName = chinese.of(code);
      if (englishName && englishName !== code && chineseName && chineseName !== code) translations.set(englishName, chineseName);
    }
  } catch { /* Older browsers keep the English-only fallback. */ }
  return translations;
}

const countryTranslations = buildCountryTranslations();
function countryOptionLabel(name) { return `${name} / ${countryNameAliases[name] || countryTranslations.get(name) || "中文名待补充"}`; }

function pathAttr(path) { return encodeURIComponent(JSON.stringify(path)); }
function getAt(path) { return path.reduce((value, key) => value?.[key], state.data); }
function setAt(path, value) {
  let target = state.data;
  path.slice(0, -1).forEach((key, index) => {
    if (target[key] == null || typeof target[key] !== "object") target[key] = typeof path[index + 1] === "number" ? [] : {};
    target = target[key];
  });
  target[path.at(-1)] = value;
}

function field(path, label, options = {}) {
  const value = getAt(path) ?? "";
  const full = options.full || options.multiline ? " full" : "";
  const help = options.help ? `<small class="field-help">${esc(options.help)}</small>` : "";
  if (options.select) {
    return `<label class="field${full}"><span>${esc(label)}</span><select data-path="${pathAttr(path)}">${options.select.map(item => `<option value="${esc(item.value)}"${String(value) === String(item.value) ? " selected" : ""}>${esc(item.label)}</option>`).join("")}</select>${help}</label>`;
  }
  if (options.multiline) return `<label class="field${full}"><span>${esc(label)}</span><textarea data-path="${pathAttr(path)}" rows="${options.rows || 4}">${esc(value)}</textarea>${help}</label>`;
  return `<label class="field${full}"><span>${esc(label)}</span><input data-path="${pathAttr(path)}" type="${options.type || "text"}" value="${esc(value)}">${help}</label>`;
}

function assetField(path, label) {
  return `<label class="field full"><span>${esc(label)}</span><div class="asset-control"><input data-path="${pathAttr(path)}" value="${esc(getAt(path) || "")}" placeholder="assets/uploads/..."><button class="button small secondary" type="button" data-upload-path="${pathAttr(path)}">上传文件</button></div><small class="field-help">素材会先保存在本地暂存区；仅当公开记录被导出时，才复制到网站 assets/uploads。</small></label>`;
}

function visibility(path) {
  return field(path, "公开状态", { select: [
    { value: "published", label: "公开：允许导出" },
    { value: "draft", label: "草稿：仅本地预览" },
    { value: "private", label: "私人：禁止导出" },
    { value: "hidden", label: "隐藏：暂不展示" }
  ] });
}

function heading(title, description, action = "") {
  return `<header class="page-heading"><div><h1>${esc(title)}</h1><p>${esc(description)}</p></div>${action}</header>`;
}

function sectionRule(title, note, action = "") {
  return `<div class="section-rule"><div><h2>${esc(title)}</h2><span>${esc(note)}</span></div>${action}</div>`;
}

function textList(path, label, addAction, removeAction) {
  const list = getAt(path) || [];
  return `${sectionRule(label, `${list.length} 条`, `<button class="button small" data-action="${addAction}" type="button">添加一条</button>`)}<div class="text-list">${list.map((item, index) => `<div class="text-list-row"><input data-path="${pathAttr([...path, index])}" value="${esc(item)}"><button class="icon-button" data-action="${removeAction}" data-index="${index}" type="button" aria-label="删除">×</button></div>`).join("") || `<div class="empty">尚无内容，点击“添加一条”开始记录。</div>`}</div>`;
}

function renderDashboard() {
  const projects = state.data.projects || [];
  const published = projects.filter(item => !item._visibility || item._visibility === "published").length;
  const drafts = projects.length - published;
  const posts = state.data.footprints?.records?.length || 0;
  const backups = state.status?.backups || [];
  return `${heading("你的内容控制台", "所有修改先保存在本地草稿库。确认无误后，再将公开内容导出到网站。")}
    <div class="dashboard-grid">
      <div class="metric"><span>PROJECT ARCHIVE</span><strong>${String(projects.length).padStart(2, "0")}</strong>项目档案</div>
      <div class="metric"><span>PUBLIC RECORDS</span><strong>${String(published).padStart(2, "0")}</strong>允许导出</div>
      <div class="metric"><span>LOCAL DRAFTS</span><strong>${String(drafts).padStart(2, "0")}</strong>非公开内容</div>
      <div class="metric"><span>FOOTPRINT POSTS</span><strong>${String(posts).padStart(2, "0")}</strong>全球足迹</div>
    </div>
    <div class="dashboard-section">
      <div><div class="section-rule"><div><h2>工作流程</h2><span>LOCAL → REVIEW → EXPORT</span></div></div><div class="activity">
        <div><span>01 / EDIT</span><p>在简历、项目和足迹模块中编辑内容，系统自动保存本地草稿。</p></div>
        <div><span>02 / PREVIEW</span><p>打开实时预览，使用草稿数据检查网站实际排版和图片效果。</p></div>
        <div><span>03 / EXPORT</span><p>确认后导出公开内容，工具会先备份现有版本，再更新 content.js。</p></div>
      </div></div>
      <aside class="checklist"><h2>公开边界</h2><p>下列保护规则由导出器自动执行。</p><ul><li>草稿、私人和隐藏记录不会导出</li><li>素材先进入本地暂存区</li><li>每次保存和导出都会留下备份</li><li>本地工作台目录被 Git 忽略</li></ul></aside>
    </div>
    ${sectionRule("最近备份", state.status?.backupDirectory || "LOCAL BACKUP DIRECTORY")}
    <div class="backup-list">${backups.map(name => `<div><code>${esc(name)}</code><button class="button small" data-action="restore-backup" data-filename="${esc(name)}" type="button">恢复此版本</button></div>`).join("") || `<div class="empty">第一次保存后，这里会出现可恢复版本。</div>`}</div>`;
}

function renderResume() {
  const experiences = state.data.experience || [];
  const skills = state.data.skillGroups || [];
  return `${heading("简历编辑", "更新首页身份、教育和实习经历。文字修改会自动保存到本地草稿。")}
    ${sectionRule("身份与首页", "PROFILE")}
    <div class="form-grid">
      ${field(["profile", "name"], "姓名")}
      ${field(["profile", "role"], "职业定位")}
      ${field(["profile", "availability"], "当前状态")}
      ${field(["profile", "email"], "邮箱")}
      ${field(["profile", "updatedAt"], "更新日期")}
      ${field(["profile", "statement"], "首页介绍", { multiline: true })}
      ${field(["profile", "chapter", "title"], "当前章节标题")}
      ${field(["profile", "chapter", "summary"], "当前章节说明", { multiline: true })}
    </div>
    ${sectionRule("教育经历", "EDUCATION")}
    <div class="form-grid">
      ${field(["education", "school"], "学校")}${field(["education", "major"], "专业")}
      ${field(["education", "degree"], "学历状态")}${field(["education", "direction"], "发展方向")}
    </div>
    ${sectionRule("实习与经历", `${experiences.length} 条`, `<button class="button small" data-action="add-experience" type="button">添加经历</button>`)}
    <div class="repeater">${experiences.map((item, index) => `<article class="repeater-row"><header class="repeater-row-header"><strong>${esc(item.company || `新经历 ${index + 1}`)}</strong><button class="button small danger" data-action="remove-experience" data-index="${index}" type="button">删除</button></header><div class="form-grid">
      ${field(["experience", index, "period"], "时间")}${field(["experience", index, "company"], "组织")}
      ${field(["experience", index, "role"], "岗位")}${field(["experience", index, "status"], "状态")}
      ${field(["experience", index, "summary"], "经历概述", { multiline: true })}
    </div>${textList(["experience", index, "highlights"], "关键工作", `add-highlight:${index}`, `remove-highlight:${index}`)}</article>`).join("") || `<div class="empty">还没有经历记录。</div>`}</div>
    ${sectionRule("能力与工具", `${skills.length} 组`, `<button class="button small" data-action="add-skill" type="button">添加能力组</button>`)}
    <div class="repeater">${skills.map((item, index) => `<article class="repeater-row"><header class="repeater-row-header"><strong>${esc(item.label || `能力组 ${index + 1}`)}</strong><button class="button small danger" data-action="remove-skill" data-index="${index}" type="button">删除</button></header><div class="form-grid">${field(["skillGroups", index, "label"], "分组名称")}${field(["skillGroups", index, "value"], "工具与能力", { multiline: true })}</div></article>`).join("")}</div>
    ${textList(["honors"], "荣誉与奖项", "add-honor", "remove-honor")}`;
}

function renderProjects() {
  const projects = state.data.projects || [];
  state.selectedProject = Math.min(state.selectedProject, Math.max(0, projects.length - 1));
  const project = projects[state.selectedProject];
  const list = `<div class="record-list">${projects.map((item, index) => `<button class="record-item${index === state.selectedProject ? " is-active" : ""}" data-action="select-project" data-index="${index}" type="button"><strong>${esc(item.title || "未命名项目")}</strong><small>${esc(item.status || "NO STATUS")} · ${esc(item.slug || "NO SLUG")}</small></button>`).join("")}</div>`;
  if (!project) return `${heading("项目档案", "添加第一个项目，建立可以直接展示在网站中的完整项目记录。", `<button class="button primary" data-action="add-project" type="button">新建项目</button>`)}<div class="empty">目前没有项目。</div>`;
  const p = ["projects", state.selectedProject];
  return `${heading("项目档案", "编辑项目文字、展示状态和媒体素材。项目 ID 与 slug 应保持唯一。", `<button class="button primary" data-action="add-project" type="button">新建项目</button>`)}
    <div class="split-editor">${list}<article class="record-editor"><header class="record-editor-header"><div><h2>${esc(project.title || "未命名项目")}</h2><p>${esc(project.english || "尚未填写英文名称")}</p></div><button class="button small danger" data-action="remove-project" type="button">删除项目</button></header>
      <div class="form-grid">
        ${visibility([...p, "_visibility"])}${field([...p, "status"], "项目状态")}
        ${field([...p, "title"], "中文名称")}${field([...p, "english"], "英文名称")}
        ${field([...p, "slug"], "页面 slug", { help: "只使用小写英文、数字和连字符。" })}${field([...p, "id"], "档案 ID")}
        ${field([...p, "date"], "项目日期")}${field([...p, "role"], "个人职责")}
        ${field([...p, "category"], "项目分类")}${field([...p, "index"], "展示序号")}
        ${field([...p, "summary"], "项目摘要", { multiline: true })}
        ${field([...p, "problem"], "问题与目标", { multiline: true })}
        ${field([...p, "system"], "系统方案", { multiline: true })}
        ${field([...p, "outcome"], "结果与复盘", { multiline: true })}
        ${assetField([...p, "showcaseImage"], "展示图片")}${assetField([...p, "demoVideo"], "演示视频")}
      </div>
      ${textList([...p, "evidence"], "能力证据", "add-evidence", "remove-evidence")}
    </article></div>`;
}

function renderFitness() {
  const records = state.data.fitnessPhotos || [];
  return `${heading("健身记录", "在本地工作台上传阶段体态照片并填写备注；公开网站只负责展示导出后的记录。")}
    ${sectionRule("阶段照片", `${records.filter(item => item.image).length} / 4 已记录`)}
    <div class="repeater">${records.map((item, index) => { const p = ["fitnessPhotos", index]; return `<article class="repeater-row"><header class="repeater-row-header"><strong>DAY ${esc(item.day)}</strong><span>${esc(item.date || "尚未记录")}</span></header><div class="form-grid">${visibility([...p, "_visibility"])}${field([...p, "day"], "阶段日", { type: "number" })}${field([...p, "date"], "拍摄日期")}${assetField([...p, "image"], "体态照片")}${field([...p, "note"], "阶段备注", { multiline: true })}</div></article>`; }).join("")}</div>`;
}

function renderTrading() {
  const trading = state.data.trading;
  const capital = trading.capital;
  const strategy = trading.strategy;
  const journals = trading.journals || [];
  state.selectedJournal = Math.min(state.selectedJournal, Math.max(0, journals.length - 1));
  const journal = journals[state.selectedJournal];
  const snapshotRows = capital.snapshots || [];
  const journalList = `<div class="record-list">${journals.map((item, index) => `<button class="record-item${index === state.selectedJournal ? " is-active" : ""}" data-action="select-journal" data-index="${index}" type="button"><strong>${esc(item.date || "日期待填写")}</strong><small>${esc(item.title || item.id || "TRADING JOURNAL")}</small></button>`).join("") || `<div class="empty compact">还没有交易日志。</div>`}</div>`;
  return `${heading("Silver Trading System", "资金、策略和 AI 对话日志共用同一份本地草稿；导出后会同步更新公开交易系统。", `<button class="button primary" data-action="add-journal" type="button">新建交易日志</button>`)}
    <div class="trading-sync-note"><div><strong>WORKBENCH → TRADING-DATA.JS</strong><p>保存草稿只更新本地工作台；点击“导出公开内容”后，前端 STS 才会读取这批已确认数据。</p></div><span>${String(snapshotRows.length).padStart(2, "0")} SNAPSHOTS · ${String(journals.length).padStart(2, "0")} JOURNALS</span></div>
    ${sectionRule("Capital / 资金", `${snapshotRows.length} 条资金快照`, `<button class="button small" data-action="add-snapshot" type="button">添加资金快照</button>`)}
    <div class="form-grid trading-capital-base">${field(["trading", "capital", "initial"], "初始资金", { type: "number", help: "未知时留空，不会显示为 0。" })}${field(["trading", "capital", "current"], "当前资金", { type: "number", help: "通常与最新一条资金快照一致。" })}</div>
    <div class="table-editor"><div class="table-editor-head"><span>日期</span><span>资金</span><span>当日盈亏</span><span>收益率 %</span><span>关联日志 ID</span><span>备注</span><span></span></div>${snapshotRows.map((item, index) => { const p = ["trading", "capital", "snapshots", index]; return `<div class="table-editor-row">${field([...p, "date"], "日期", { type: "date" })}${field([...p, "capital"], "资金", { type: "number" })}${field([...p, "pnl"], "当日盈亏", { type: "number" })}${field([...p, "pnlPercent"], "收益率 %", { type: "number" })}${field([...p, "journalId"], "日志 ID")}${field([...p, "note"], "备注")}<button class="icon-button" data-action="remove-snapshot" data-index="${index}" type="button" aria-label="删除资金快照">×</button></div>`; }).join("") || `<div class="empty compact">添加第一条真实资金记录后，前端才会生成资金曲线。</div>`}</div>
    ${sectionRule("Capital Milestones / 资金里程碑", `${capital.milestones.length} 个阶段`, `<button class="button small" data-action="add-milestone" type="button">添加里程碑</button>`)}
    <div class="repeater compact-repeater">${capital.milestones.map((item, index) => { const p = ["trading", "capital", "milestones", index]; return `<article class="repeater-row"><div class="form-grid milestone-grid">${field([...p, "amount"], "目标金额", { type: "number" })}${field([...p, "label"], "阶段标签")}${field([...p, "status"], "状态", { select: [{ value: "waiting", label: "等待达成" }, { value: "reached", label: "已经达成" }] })}<button class="button small danger" data-action="remove-milestone" data-index="${index}" type="button">删除</button></div></article>`; }).join("")}</div>
    ${sectionRule("Strategy / 当前策略", strategy.status || "IN DEVELOPMENT")}
    <div class="form-grid">${field(["trading", "strategy", "version"], "版本名称")}${field(["trading", "strategy", "status"], "验证状态")}${field(["trading", "strategy", "style"], "当前交易风格", { multiline: true })}${field(["trading", "strategy", "principle"], "核心原则", { multiline: true })}</div>
    <div class="trading-strategy-lists">${textList(["trading", "strategy", "flow"], "分析顺序", "add-strategy-flow", "remove-strategy-flow")}${textList(["trading", "strategy", "planScenarios"], "开盘情景", "add-plan-scenario", "remove-plan-scenario")}${textList(["trading", "strategy", "planFields"], "计划字段", "add-plan-field", "remove-plan-field")}</div>
    ${sectionRule("Trading Setups", `${strategy.setups.length} 个验证中 Setup`, `<button class="button small" data-action="add-setup" type="button">添加 Setup</button>`)}
    <div class="repeater">${strategy.setups.map((item, index) => { const p = ["trading", "strategy", "setups", index]; return `<article class="repeater-row"><header class="repeater-row-header"><strong>${esc(item.title || `Setup ${index + 1}`)}</strong><button class="button small danger" data-action="remove-setup" data-index="${index}" type="button">删除</button></header><div class="form-grid">${field([...p, "id"], "编号")}${field([...p, "title"], "英文名称")}${field([...p, "cn"], "中文名称")}${field([...p, "summary"], "逻辑说明", { multiline: true })}</div>${textList([...p, "checks"], "确认条件", `add-setup-check:${index}`, `remove-setup-check:${index}`)}</article>`; }).join("")}</div>
    ${sectionRule("Journal / AI 交易日志", `${journals.length} 天`, `<button class="button small" data-action="add-journal" type="button">新建日志</button>`)}
    <div class="split-editor">${journalList}${journal ? `<article class="record-editor"><header class="record-editor-header"><div><h2>${esc(journal.date || "新交易日志")}</h2><p>${esc(journal.title || journal.id)}</p></div><button class="button small danger" data-action="remove-journal" type="button">删除日志</button></header><div class="form-grid">${visibility(["trading", "journals", state.selectedJournal, "_visibility"])}${field(["trading", "journals", state.selectedJournal, "id"], "日志 ID", { help: "用于和资金快照的 journalId 建立关联。" })}${field(["trading", "journals", state.selectedJournal, "date"], "交易日期", { type: "date" })}${field(["trading", "journals", state.selectedJournal, "title"], "日志标题")}${field(["trading", "journals", state.selectedJournal, "context"], "Context / 市场背景", { multiline: true })}</div>
      ${sectionRule("Conversation / 关键对话", `${(journal.conversations || []).length} 段`, `<button class="button small" data-action="add-conversation" type="button">添加对话</button>`)}<div class="conversation-editor">${(journal.conversations || []).map((entry, index) => { const p = ["trading", "journals", state.selectedJournal, "conversations", index]; return `<div class="conversation-row">${field([...p, "role"], "角色", { select: [{ value: "silver", label: "Silver / 我的判断" }, { value: "ai", label: "AI / 分析回应" }] })}${field([...p, "content"], "对话内容", { multiline: true })}<button class="icon-button" data-action="remove-conversation" data-index="${index}" type="button" aria-label="删除对话">×</button></div>`; }).join("") || `<div class="empty compact">从你的判断开始，保留对话中真正改变决策的部分。</div>`}</div>
      <div class="form-grid journal-outcome">${field(["trading", "journals", state.selectedJournal, "decision"], "Decision / 最终决定", { multiline: true })}${field(["trading", "journals", state.selectedJournal, "execution"], "Execution / 实际操作", { multiline: true })}${field(["trading", "journals", state.selectedJournal, "result"], "Result / 市场结果", { multiline: true })}${field(["trading", "journals", state.selectedJournal, "review"], "Review / 盘后复盘", { multiline: true })}${field(["trading", "journals", state.selectedJournal, "lesson"], "Lesson / 当日经验", { multiline: true })}</div></article>` : `<div class="empty">新建一篇日志，记录当天从判断到复盘的完整思考链。</div>`}</div>`;
}

function footprintPost(path, item, index, removeAction) {
  const countryOptions = [...new Set([item.country, ...state.mapCountries].filter(Boolean))].map(name => ({ value: name, label: countryOptionLabel(name) }));
  const provinceOptions = [{ value: "", label: "未设置省份" }, ...Object.keys(state.data.footprints?.provinces || {}).map(name => ({ value: name, label: name }))];
  return `<article class="repeater-row"><header class="repeater-row-header"><strong>${esc(item.place || `足迹 ${index + 1}`)}</strong><button class="button small danger" data-action="${removeAction}" data-index="${index}" type="button">删除</button></header><div class="form-grid">
    ${visibility([...path, "_visibility"])}${field([...path, "country"], "国家", { select: countryOptions })}
    ${field([...path, "countryLabel"], "国家中文名")}${field([...path, "province"], "省份标签（中国）", { select: provinceOptions })}
    ${field([...path, "date"], "时间")}${field([...path, "name"], "显示名称")}
    ${field([...path, "place"], "地点", { full: true })}
    ${field([...path, "text"], "动态文案", { multiline: true })}${assetField([...path, "image", "src"], "动态图片")}
    ${field([...path, "image", "caption"], "图片说明", { full: true })}
  </div></article>`;
}

function renderFootprints() {
  const feed = state.data.footprints?.records || [];
  const provinces = state.data.footprints?.provinces || {};
  const names = Object.keys(provinces);
  if (!state.selectedProvince || !provinces[state.selectedProvince]) state.selectedProvince = names[0] || "";
  const province = provinces[state.selectedProvince];
  const linkedPosts = feed.map((item, index) => ({ item, index })).filter(entry => entry.item.country === "China" && entry.item.province === state.selectedProvince);
  return `${heading("人生足迹", "所有旅行和生活记录都进入同一个全球足迹库；国家与省份页面只是对这些记录进行筛选。")}
    ${sectionRule("全球足迹记录", `${feed.length} 条动态`, `<button class="button small" data-action="add-country-post" type="button">添加旅行经历</button>`)}
    <div class="repeater">${feed.map((item, index) => footprintPost(["footprints", "records", index], item, index, "remove-country-post")).join("") || `<div class="empty">尚无全球足迹记录。</div>`}</div>
    ${sectionRule("省份档案", `${names.length} 个省份`, `<button class="button small" data-action="add-province" type="button">添加省份</button>`)}
    <div class="split-editor"><div class="record-list">${names.map(name => `<button class="record-item${name === state.selectedProvince ? " is-active" : ""}" data-action="select-province" data-name="${esc(name)}" type="button"><strong>${esc(name)}</strong><small>${esc(provinces[name].status || "NO STATUS")}</small></button>`).join("") || `<div class="empty">暂无省份档案</div>`}</div>
      ${province ? `<article class="record-editor"><header class="record-editor-header"><div><h2>${esc(state.selectedProvince)}</h2><p>省份信息与关联动态</p></div><button class="button small danger" data-action="remove-province" type="button">删除省份</button></header><div class="form-grid">
        <label class="field full"><span>地图省份键名</span><div class="asset-control"><input id="province-name" value="${esc(state.selectedProvince)}"><button class="button small" data-action="rename-province" type="button">更新名称</button></div><small class="field-help">名称必须和地图数据中的省份名称一致，例如“浙江省”。</small></label>
        ${visibility(["footprints", "provinces", state.selectedProvince, "_visibility"])}
        ${field(["footprints", "provinces", state.selectedProvince, "status"], "状态")}
        ${field(["footprints", "provinces", state.selectedProvince, "title"], "面板标题", { full: true })}
        ${field(["footprints", "provinces", state.selectedProvince, "summary"], "省份概述", { multiline: true })}
        ${assetField(["footprints", "provinces", state.selectedProvince, "image", "src"], "省份展示图片")}
      </div>${sectionRule("关联动态", `${linkedPosts.length} 条`, `<button class="button small" data-action="add-province-post" type="button">添加${esc(state.selectedProvince)}动态</button>`)}<p class="field-help">这里筛选的是全球足迹库中“China + ${esc(state.selectedProvince)}”的同一批记录，任何修改都会同步到中国和世界层级。</p><div class="repeater">${linkedPosts.map(({ item, index }) => footprintPost(["footprints", "records", index], item, index, "remove-country-post")).join("") || `<div class="empty">还没有带有“${esc(state.selectedProvince)}”标签的中国动态。</div>`}</div></article>` : `<div class="empty">添加省份后即可编辑。</div>`}
    </div>`;
}

function renderAdvanced() {
  return `${heading("高级数据", "直接查看和编辑完整草稿数据。应用前会验证 JSON 格式；建议日常优先使用上方表单。")}
    <label class="field full"><span>STUDIO DATA / JSON</span><textarea class="code" id="advanced-json">${esc(JSON.stringify(state.data, null, 2))}</textarea><small class="field-help">这里包含网站的全部公开字段和本地可见性状态。</small></label>
    <div class="section-rule"><span>应用后仍只保存为本地草稿</span><button class="button primary" data-action="apply-json" type="button">验证并应用 JSON</button></div>`;
}

function render() {
  if (!state.data) return;
  const [route, title] = sectionMeta[state.section];
  $("#route-label").textContent = route;
  $("#page-title").textContent = title;
  $$(".nav-item").forEach(item => item.classList.toggle("is-active", item.dataset.section === state.section));
  const renderers = { dashboard: renderDashboard, resume: renderResume, projects: renderProjects, footprints: renderFootprints, fitness: renderFitness, trading: renderTrading, advanced: renderAdvanced };
  $("#editor").innerHTML = renderers[state.section]();
}

function markDirty() {
  state.dirty = true;
  $("#save-state").textContent = "存在未保存修改";
  $("#save-state").classList.add("is-dirty");
  clearTimeout(state.autosaveTimer);
  state.autosaveTimer = setTimeout(() => saveDraft(true), 1400);
}

async function request(url, options = {}) {
  const response = await fetch(url, { headers: { "Content-Type": "application/json" }, ...options });
  const payload = await response.json();
  if (!response.ok) throw new Error(payload.error || "操作失败");
  return payload;
}

async function saveDraft(silent = false) {
  if (!state.data) return;
  if (state.savePromise) return state.savePromise;
  state.savePromise = (async () => {
    state.saving = true;
    setBusy(true);
    $("#save-state").textContent = "正在保存…";
    try {
      const snapshot = JSON.stringify(state.data);
      await request("/api/save", { method: "POST", body: `{"data":${snapshot}}` });
      const unchanged = JSON.stringify(state.data) === snapshot;
      state.dirty = !unchanged;
      $("#save-state").textContent = unchanged ? `已保存 ${new Date().toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" })}` : "保存期间产生了新修改";
      $("#save-state").classList.toggle("is-dirty", !unchanged);
      if (!silent) toast("本地草稿已保存");
      await loadStatus();
      refreshPreview();
    } catch (error) { toast(error.message, true); throw error; }
    finally {
      state.saving = false;
      state.savePromise = null;
      setBusy(false);
      if (state.dirty) { clearTimeout(state.autosaveTimer); state.autosaveTimer = setTimeout(() => saveDraft(true), 500); }
    }
  })();
  return state.savePromise;
}

async function exportPublic() {
  if (!confirm("导出会先备份，再更新网站的 content.js 与 trading-data.js。只会包含状态为“公开”的内容，是否继续？")) return;
  try {
    do { await saveDraft(true); } while (state.dirty);
  } catch { return; }
  setBusy(true);
  try {
    const result = await request("/api/export", { method: "POST", body: "{}" });
    toast(`公开内容已导出：${result.targets?.length || 2} 个数据文件`);
    refreshPreview();
  } catch (error) { toast(error.message, true); }
  finally { setBusy(false); }
}

function setBusy(busy) {
  $("#save-button").disabled = busy;
  $("#export-button").disabled = busy;
}

async function loadStatus() {
  state.status = await request("/api/status");
  if (state.section === "dashboard") render();
}

async function restoreBackup(filename) {
  if (!confirm(`恢复备份“${filename}”？当前草稿会先自动备份。`)) return;
  setBusy(true);
  try {
    const result = await request("/api/restore", { method: "POST", body: JSON.stringify({ filename }) });
    state.data = result.data;
    state.dirty = false;
    await loadStatus();
    render();
    refreshPreview();
    toast(`已恢复：${filename}`);
  } catch (error) { toast(error.message, true); }
  finally { setBusy(false); }
}

function toast(message, error = false) {
  const node = $("#toast");
  node.textContent = message;
  node.classList.toggle("is-error", error);
  node.classList.add("is-visible");
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => node.classList.remove("is-visible"), 3200);
}

function previewView() {
  return state.section === "projects" && state.data.projects?.[state.selectedProject]?.slug
    ? `project&id=${encodeURIComponent(state.data.projects[state.selectedProject].slug)}`
    : state.section === "footprints" ? "journey" : state.section === "fitness" ? "fitness" : state.section === "trading" ? "trading" : state.section === "resume" ? "resume" : "projects";
}

function refreshPreview() {
  if (!$("#preview").classList.contains("is-open")) return;
  const route = previewView();
  $("#preview-route").textContent = route.toUpperCase();
  $("#preview-frame").src = `/site/index.html?view=${route}&studio=${Date.now()}`;
}

function openPreview() {
  $("#preview").classList.add("is-open");
  $(".workbench").classList.add("preview-open");
  $("#preview-button").textContent = "刷新预览";
  refreshPreview();
}

function closePreview() {
  $("#preview").classList.remove("is-open");
  $(".workbench").classList.remove("preview-open");
  $("#preview-button").textContent = "打开预览";
  $("#preview-frame").src = "about:blank";
}

function mutateAndRender(callback) {
  callback();
  markDirty();
  render();
}

function handleAction(button) {
  const [action, suffix] = button.dataset.action.split(":");
  const index = Number(button.dataset.index);
  if (action === "select-project") { state.selectedProject = index; render(); refreshPreview(); return; }
  if (action === "add-project") return mutateAndRender(() => {
    state.data.projects ||= [];
    state.data.projects.push({ _visibility: "draft", id: `OBS-P${String(state.data.projects.length + 1).padStart(2, "0")}`, slug: `new-project-${Date.now()}`, category: "game", status: "草稿", title: "未命名项目", english: "Untitled Project", summary: "", problem: "", system: "", outcome: "", role: "", evidence: [], index: String(state.data.projects.length + 1).padStart(2, "0") });
    state.selectedProject = state.data.projects.length - 1;
  });
  if (action === "remove-project") return mutateAndRender(() => { if (confirm("确定删除当前项目吗？本地备份仍可恢复。")) state.data.projects.splice(state.selectedProject, 1); });
  if (action === "add-evidence") return mutateAndRender(() => (state.data.projects[state.selectedProject].evidence ||= []).push(""));
  if (action === "remove-evidence") return mutateAndRender(() => state.data.projects[state.selectedProject].evidence.splice(index, 1));
  if (action === "add-experience") return mutateAndRender(() => (state.data.experience ||= []).push({ period: "", company: "新经历", role: "", status: "", summary: "", highlights: [] }));
  if (action === "remove-experience") return mutateAndRender(() => { if (confirm("确定删除这条经历吗？")) state.data.experience.splice(index, 1); });
  if (action === "add-highlight") return mutateAndRender(() => (state.data.experience[Number(suffix)].highlights ||= []).push(""));
  if (action === "remove-highlight") return mutateAndRender(() => state.data.experience[Number(suffix)].highlights.splice(index, 1));
  if (action === "add-skill") return mutateAndRender(() => (state.data.skillGroups ||= []).push({ label: "新能力组", value: "" }));
  if (action === "remove-skill") return mutateAndRender(() => state.data.skillGroups.splice(index, 1));
  if (action === "add-honor") return mutateAndRender(() => (state.data.honors ||= []).push(""));
  if (action === "remove-honor") return mutateAndRender(() => state.data.honors.splice(index, 1));
  if (action === "add-snapshot") return mutateAndRender(() => state.data.trading.capital.snapshots.push({ date: "", capital: null, pnl: null, pnlPercent: null, journalId: "", note: "" }));
  if (action === "remove-snapshot") return mutateAndRender(() => state.data.trading.capital.snapshots.splice(index, 1));
  if (action === "add-milestone") return mutateAndRender(() => state.data.trading.capital.milestones.push({ amount: null, label: "NEXT", status: "waiting" }));
  if (action === "remove-milestone") return mutateAndRender(() => state.data.trading.capital.milestones.splice(index, 1));
  if (action === "add-strategy-flow") return mutateAndRender(() => state.data.trading.strategy.flow.push(""));
  if (action === "remove-strategy-flow") return mutateAndRender(() => state.data.trading.strategy.flow.splice(index, 1));
  if (action === "add-plan-scenario") return mutateAndRender(() => state.data.trading.strategy.planScenarios.push(""));
  if (action === "remove-plan-scenario") return mutateAndRender(() => state.data.trading.strategy.planScenarios.splice(index, 1));
  if (action === "add-plan-field") return mutateAndRender(() => state.data.trading.strategy.planFields.push(""));
  if (action === "remove-plan-field") return mutateAndRender(() => state.data.trading.strategy.planFields.splice(index, 1));
  if (action === "add-setup") return mutateAndRender(() => state.data.trading.strategy.setups.push({ id: `SETUP ${String(state.data.trading.strategy.setups.length + 1).padStart(2, "0")}`, title: "New Setup", cn: "新交易模式", summary: "", checks: [] }));
  if (action === "remove-setup") return mutateAndRender(() => state.data.trading.strategy.setups.splice(index, 1));
  if (action === "add-setup-check") return mutateAndRender(() => state.data.trading.strategy.setups[Number(suffix)].checks.push(""));
  if (action === "remove-setup-check") return mutateAndRender(() => state.data.trading.strategy.setups[Number(suffix)].checks.splice(index, 1));
  if (action === "select-journal") { state.selectedJournal = index; render(); return; }
  if (action === "add-journal") return mutateAndRender(() => { state.data.trading.journals.unshift({ _visibility: "draft", id: `journal-${new Date().toISOString().slice(0, 10)}`, date: new Date().toISOString().slice(0, 10), title: "Trading Journal", context: "", conversations: [], decision: "", execution: "", result: "", review: "", lesson: "" }); state.selectedJournal = 0; });
  if (action === "remove-journal") return mutateAndRender(() => { if (confirm("确定删除这篇交易日志吗？本地备份仍可恢复。")) state.data.trading.journals.splice(state.selectedJournal, 1); });
  if (action === "add-conversation") return mutateAndRender(() => (state.data.trading.journals[state.selectedJournal].conversations ||= []).push({ role: "silver", content: "" }));
  if (action === "remove-conversation") return mutateAndRender(() => state.data.trading.journals[state.selectedJournal].conversations.splice(index, 1));
  if (action === "add-country-post") return mutateAndRender(() => (state.data.footprints.records ||= []).push({ _visibility: "draft", name: "Silver.Z", country: "China", countryLabel: "中国", province: "", place: "", date: "", text: "", image: { src: "", caption: "" } }));
  if (action === "add-province-post") return mutateAndRender(() => (state.data.footprints.records ||= []).push({ _visibility: "draft", name: "Silver.Z", country: "China", countryLabel: "中国", province: state.selectedProvince, place: "", date: "", text: "", image: { src: "", caption: "" } }));
  if (action === "remove-country-post") return mutateAndRender(() => state.data.footprints.records.splice(index, 1));
  if (action === "select-province") { state.selectedProvince = button.dataset.name; render(); return; }
  if (action === "add-province") return mutateAndRender(() => {
    let name = "新省份"; let count = 2;
    while (state.data.footprints.provinces[name]) name = `新省份${count++}`;
    state.data.footprints.provinces[name] = { _visibility: "draft", status: "DRAFT", title: name, summary: "", locations: [] };
    state.selectedProvince = name;
  });
  if (action === "remove-province") return mutateAndRender(() => { if (confirm(`确定删除“${state.selectedProvince}”吗？`)) { delete state.data.footprints.provinces[state.selectedProvince]; state.selectedProvince = ""; } });
  if (action === "rename-province") {
    const nextName = $("#province-name").value.trim();
    if (!nextName) return toast("省份名称不能为空", true);
    if (nextName !== state.selectedProvince && state.data.footprints.provinces[nextName]) return toast("这个省份名称已经存在", true);
    return mutateAndRender(() => {
      const record = state.data.footprints.provinces[state.selectedProvince];
      delete state.data.footprints.provinces[state.selectedProvince];
      state.data.footprints.provinces[nextName] = record;
      state.selectedProvince = nextName;
    });
  }
  if (action === "add-location") return mutateAndRender(() => (state.data.footprints.provinces[state.selectedProvince].locations ||= []).push(["", ""]));
  if (action === "remove-location") return mutateAndRender(() => state.data.footprints.provinces[state.selectedProvince].locations.splice(index, 1));
  if (action === "apply-json") {
    try { state.data = JSON.parse($("#advanced-json").value); markDirty(); render(); toast("JSON 已验证并应用到本地草稿"); }
    catch (error) { toast(`JSON 无效：${error.message}`, true); }
  }
  if (action === "restore-backup") restoreBackup(button.dataset.filename);
}

async function uploadAsset(file, path) {
  if (!file) return;
  if (file.size > 80 * 1024 * 1024) return toast("单个文件不能超过 80MB；较大的视频请先压缩。", true);
  toast("正在复制素材…");
  const data = await new Promise((resolve, reject) => { const reader = new FileReader(); reader.onload = () => resolve(reader.result); reader.onerror = reject; reader.readAsDataURL(file); });
  try {
    const result = await request("/api/upload", { method: "POST", body: JSON.stringify({ name: file.name, data }) });
    setAt(path, result.path);
    markDirty();
    render();
    toast(`素材已保存：${result.path}`);
  } catch (error) { toast(error.message, true); }
}

$("#studio-nav").addEventListener("click", event => {
  const button = event.target.closest("[data-section]");
  if (!button) return;
  state.section = button.dataset.section;
  render();
  refreshPreview();
});

$("#editor").addEventListener("input", event => {
  const encoded = event.target.dataset.path;
  if (!encoded) return;
  const path = JSON.parse(decodeURIComponent(encoded));
  const value = event.target.type === "number" ? (event.target.value === "" ? null : Number(event.target.value)) : event.target.value;
  setAt(path, value);
  markDirty();
});

$("#editor").addEventListener("change", event => {
  if (event.target.matches("select[data-path]")) render();
});

$("#editor").addEventListener("click", event => {
  const upload = event.target.closest("[data-upload-path]");
  if (upload) { state.uploadPath = JSON.parse(decodeURIComponent(upload.dataset.uploadPath)); $("#asset-input").click(); return; }
  const action = event.target.closest("[data-action]");
  if (action) handleAction(action);
});

$("#asset-input").addEventListener("change", event => { uploadAsset(event.target.files[0], state.uploadPath); event.target.value = ""; });
$("#save-button").addEventListener("click", () => saveDraft(false));
$("#export-button").addEventListener("click", exportPublic);
$("#preview-button").addEventListener("click", () => $("#preview").classList.contains("is-open") ? refreshPreview() : openPreview());
$("#close-preview").addEventListener("click", closePreview);
document.addEventListener("keydown", event => { if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "s") { event.preventDefault(); saveDraft(false); } });
window.addEventListener("beforeunload", event => { if (state.dirty) { event.preventDefault(); event.returnValue = ""; } });

(async function init() {
  try {
    const [payload, status, mapOptions] = await Promise.all([request("/api/data"), request("/api/status"), request("/api/map-options")]);
    state.data = payload.data;
    state.status = status;
    state.mapCountries = mapOptions.countries;
    render();
  } catch (error) {
    $("#editor").innerHTML = `<div class="empty"><strong>无法读取内容数据</strong><p>${esc(error.message)}</p></div>`;
  }
})();
