(() => {
  const data = window.SILVER_DATA;
  if (!data) throw new Error("SILVER_DATA 未加载，请检查 content.js。");

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const esc = value => String(value).replace(/[&<>'"]/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[char]));
  const routeNames = { overview: "OVERVIEW", projects: "PROJECT ARCHIVE", project: "PROJECT RECORD", capabilities: "CAPABILITY SYSTEM", journey: "JOURNEY LOG", changelog: "LIFE CHANGELOG", connect: "OPEN CHANNEL" };
  let currentRoute = "";

  function parseRoute() {
    const params = new URLSearchParams(location.search);
    const view = routeNames[params.get("view")] ? params.get("view") : "overview";
    return { view, id: params.get("id") };
  }

  function metricMarkup(metrics) {
    return `<div class="dashboard-metrics">${metrics.map(item => `<article class="dash-metric"><span>${esc(item.label)}</span><strong>${esc(item.value)}</strong><small>${esc(item.note)}</small></article>`).join("")}</div>`;
  }

  function projectCard(project) {
    return `<a class="archive-card route-link" href="?view=project&id=${encodeURIComponent(project.slug)}" data-route="project">
      <div class="archive-visual" data-index="${esc(project.index)}"><span>${esc(project.id)}</span><i>${esc(project.status)}</i></div>
      <div class="archive-card-copy">
        <div><h3>${esc(project.title)}</h3><p class="mono">${esc(project.english)}</p></div><span class="open-record">OPEN RECORD ↗</span>
        <p>${esc(project.summary)}</p>
        <div class="archive-tags">${project.evidence.map(item => `<span>${esc(item)}</span>`).join("")}</div>
      </div>
    </a>`;
  }

  function viewHeader(code, title, description) {
    return `<header class="view-header"><div><p class="section-code mono">${esc(code)}</p><h1>${title}</h1></div><p>${esc(description)}</p></header>`;
  }

  function renderOverview() {
    const { profile } = data;
    const latest = data.versions[0];
    return `<section class="page overview-page">
      <div class="overview-grid" aria-hidden="true"></div>
      <div class="overview-identity">
        <p class="eyebrow"><i class="signal"></i>${esc(profile.availability)}</p>
        <div class="manga-kicker">第 21 话 <span>／</span> 进入游戏行业</div>
        <h1>SILVER<span>/</span>Z</h1>
        <p class="overview-role mono">${esc(profile.role)}</p>
        <p class="overview-statement">${esc(profile.statement)}</p>
        <a class="os-button route-link" href="?view=projects" data-route="projects">ENTER PROJECT ARCHIVE <span>↘</span></a>
      </div>
      <div class="manga-portrait-wrap">
        <figure class="manga-portrait" aria-label="Silver.Z 手绘个人形象">
          <img src="assets/silver-avatar.jpg" alt="Silver.Z 黑白手绘人物形象">
          <figcaption><span>CHARACTER FILE</span><strong>SILVER.Z</strong><i>主人公 / SYSTEM DESIGNER</i></figcaption>
          <b class="hand-note">Still<br>building.</b>
        </figure>
      </div>
      <aside class="current-chapter">
        <div class="module-label"><span>CURRENT CHAPTER</span><i>LIVE</i></div>
        <p class="mono">${esc(profile.chapter.code)}</p>
        <h2>${esc(profile.chapter.title)}</h2>
        <p>${esc(profile.chapter.summary)}</p>
        <dl>${profile.chapter.meta.map(([label, value]) => `<div><dt>${esc(label)}</dt><dd>${esc(value)}</dd></div>`).join("")}</dl>
        <div class="overview-quest"><div><span>MAIN QUEST</span><i>${profile.quest.progress}%</i></div><strong>${esc(profile.quest.title)}</strong><b><span style="width:${profile.quest.progress}%"></span></b></div>
      </aside>
      ${metricMarkup(profile.metrics)}
      <div class="dashboard-bottom">
        <section class="recent-records"><div class="module-label"><span>RECENT RECORDS</span><a class="route-link" href="?view=projects" data-route="projects">VIEW ALL →</a></div>${data.projects.slice(0, 2).map(p => `<a class="mini-record route-link" href="?view=project&id=${encodeURIComponent(p.slug)}" data-route="project"><span>${esc(p.id)}</span><strong>${esc(p.title)}</strong><i>${esc(p.status)}</i><b>↗</b></a>`).join("")}</section>
        <section class="latest-update"><div class="module-label"><span>LATEST UPDATE</span><a class="route-link" href="?view=changelog" data-route="changelog">HISTORY →</a></div><strong>${esc(latest.version)}</strong><h3>${esc(latest.title)}</h3><p>${esc(latest.changes[0][1])}</p></section>
      </div>
    </section>`;
  }

  function renderProjects() {
    return `<section class="page archive-page">${viewHeader("01 / PROJECT ARCHIVE", "项目档案", "不是作品清单，而是能力发生过的证据。选择一份记录，进入完整项目视图。")}
      <div class="archive-toolbar"><div class="record-filter" role="group" aria-label="项目筛选"><button class="filter active" data-filter="all">全部记录</button><button class="filter" data-filter="game">游戏</button><button class="filter" data-filter="ai">AI 实验</button></div><span class="mono">${String(data.projects.length).padStart(2, "0")} RECORDS FOUND</span></div>
      <div class="archive-grid manga-panels">${data.projects.map(projectCard).join("")}</div>
    </section>`;
  }

  function renderProject(id) {
    const project = data.projects.find(item => item.slug === id) || data.projects[0];
    const next = data.projects[(data.projects.indexOf(project) + 1) % data.projects.length];
    return `<article class="page project-page">
      <a class="back-link route-link mono" href="?view=projects" data-route="projects">← BACK TO ARCHIVE</a>
      <header class="project-hero"><div><p class="section-code mono">${esc(project.id)} / ${esc(project.status)}</p><h1>${esc(project.title)}</h1><p class="project-english mono">${esc(project.english)}</p></div><div class="project-number">${esc(project.index)}</div></header>
      <div class="project-detail-grid">
        <aside class="project-facts"><div><span>ROLE</span><strong>${esc(project.role)}</strong></div><div><span>CATEGORY</span><strong>${project.category === "game" ? "GAME SYSTEM" : "AI EXPERIMENT"}</strong></div><div><span>STATUS</span><strong>${esc(project.status)}</strong></div></aside>
        <div class="project-narrative">
          <section><span>00 / OVERVIEW</span><h2>${esc(project.summary)}</h2></section>
          <section><span>01 / PROBLEM</span><h3>这个项目要解决什么？</h3><p>${esc(project.problem)}</p></section>
          <section><span>02 / SYSTEM</span><h3>我的系统方案</h3><p>${esc(project.system)}</p><ul>${project.evidence.map(item => `<li>${esc(item)}</li>`).join("")}</ul></section>
          <section><span>03 / OUTCOME</span><h3>当前结果与下一步</h3><p>${esc(project.outcome)}</p></section>
        </div>
      </div>
      <a class="next-record route-link" href="?view=project&id=${encodeURIComponent(next.slug)}" data-route="project"><span>NEXT RECORD</span><strong>${esc(next.title)}</strong><i>→</i></a>
    </article>`;
  }

  function renderCapabilities() {
    return `<section class="page capability-page">${viewHeader("02 / CAPABILITY SYSTEM", "能力系统", "能力不由主观分数定义，而由它在真实项目中的用途和证据定义。")}
      <div class="capability-map"><div class="capability-core"><span>SILVER.Z</span><strong>SYSTEM<br>DESIGNER</strong><i>ACTIVE</i></div>${data.capabilities.map((item, index) => `<article class="cap-node"><span>${esc(item.code)}</span><strong>${esc(item.title)}</strong><p>${esc(item.desc)}</p><small>PROOF / ${esc(item.proof)}</small><i>0${index + 1}</i></article>`).join("")}</div>
      <div class="capability-note"><span class="mono">SYSTEM PRINCIPLE</span><p>设计规则，快速实现，让真实反馈替代封闭自评。</p></div>
    </section>`;
  }

  function renderJourney() {
    return `<section class="page journey-page">${viewHeader("03 / JOURNEY LOG", "人生章节", "这不是一张预设五年路线图，而是由真实选择、转折和验证构成的章节记录。")}
      <div class="chapter-browser"><nav aria-label="章节列表">${data.journey.map((item, index) => `<button class="chapter-tab${index === 0 ? " active" : ""}" data-chapter="${index}"><span>CH.0${data.journey.length - index}</span><strong>${esc(item.title)}</strong><i>${esc(item.date)}</i></button>`).join("")}</nav><div class="chapter-stage" id="chapter-stage"></div></div>
    </section>`;
  }

  function chapterStage(index) {
    const item = data.journey[index];
    const project = data.projects[Math.min(index, data.projects.length - 1)];
    return `<div class="stage-number">0${data.journey.length - index}</div><p class="mono">${esc(item.label)} / ${esc(item.date)}</p><h2>${esc(item.title)}</h2><p>${esc(item.text)}</p><div class="stage-unlocks"><span>ASSOCIATED RECORD</span><a class="route-link" href="?view=project&id=${encodeURIComponent(project.slug)}" data-route="project">${esc(project.title)} ↗</a></div>`;
  }

  function renderChangelog() {
    return `<section class="page changelog-page">${viewHeader("04 / LIFE CHANGELOG", `当前版本 <span>${esc(data.versions[0].version)}</span>`, "把人生阶段写成版本记录：新增了什么、修正了什么，以及下一步准备改变什么。")}
      <div class="release-layout"><aside><span class="mono">RELEASE CHANNEL</span><strong>PUBLIC<br>STABLE</strong><p>LAST UPDATED<br>${esc(data.profile.updatedAt)}</p></aside><div class="release-list">${data.versions.map((item, index) => `<article class="release${index === 0 ? " current" : ""}"><header><strong>${esc(item.version)}</strong><span>${esc(item.date)}</span><h2>${esc(item.title)}</h2><button aria-expanded="${index === 0}" data-release="${index}">${index === 0 ? "−" : "+"}</button></header><div class="release-changes"${index === 0 ? "" : " hidden"}>${item.changes.map(([type, text]) => `<p><span data-type="${esc(type)}">${esc(type)}</span>${esc(text)}</p>`).join("")}</div></article>`).join("")}</div></div>
    </section>`;
  }

  function renderConnect() {
    return `<section class="page connect-page"><p class="section-code mono">05 / OPEN CHANNEL</p><div class="connect-hero"><h1>把疯狂想法<br>变成可运行的系统。</h1><p>如果你正在做 AI 游戏、独立产品或任何值得快速验证的创造，欢迎联系我。</p></div><div class="contact-panel"><span class="mono">PRIMARY CHANNEL</span><a href="mailto:${esc(data.profile.email)}">${esc(data.profile.email)} <i>↗</i></a></div><div class="external-grid">${data.socials.map((item, index) => `<a href="${esc(item.href)}" target="_blank" rel="noreferrer"><span>0${index + 1}</span><strong>${esc(item.label)}</strong><i>↗</i></a>`).join("")}</div><footer class="view-footer"><span>SILVER.Z / PERSONAL OBSERVATORY</span><span>© ${new Date().getFullYear()}</span></footer></section>`;
  }

  function render(route) {
    const renderers = { overview: renderOverview, projects: renderProjects, project: () => renderProject(route.id), capabilities: renderCapabilities, journey: renderJourney, changelog: renderChangelog, connect: renderConnect };
    $("#view").innerHTML = renderers[route.view]();
    $("#route-label").textContent = routeNames[route.view];
    document.title = `${routeNames[route.view]} — Silver OS`;
    $$("[data-route]").forEach(link => link.classList.toggle("active", link.dataset.route === route.view || (route.view === "project" && link.dataset.route === "projects")));
    bindDynamicEvents(route);
    requestAnimationFrame(() => $$(".page > *, .archive-card, .cap-node, .release").forEach((node, index) => { node.style.setProperty("--enter-index", Math.min(index, 10)); node.classList.add("panel-enter"); }));
  }

  function bindDynamicEvents(route) {
    if (route.view === "projects") $$(".filter").forEach(button => button.addEventListener("click", () => {
      $$(".filter").forEach(item => item.classList.remove("active"));
      button.classList.add("active");
      $$(".archive-card").forEach(card => { const p = data.projects.find(item => card.href.includes(encodeURIComponent(item.slug))); card.hidden = button.dataset.filter !== "all" && p.category !== button.dataset.filter; });
    }));
    if (route.view === "journey") {
      $("#chapter-stage").innerHTML = chapterStage(0);
      $$(".chapter-tab").forEach(button => button.addEventListener("click", () => { $$(".chapter-tab").forEach(item => item.classList.remove("active")); button.classList.add("active"); $("#chapter-stage").innerHTML = chapterStage(Number(button.dataset.chapter)); bindRoutes($("#chapter-stage")); }));
    }
    if (route.view === "changelog") $$('[data-release]').forEach(button => button.addEventListener("click", () => { const body = button.closest(".release").querySelector(".release-changes"); body.hidden = !body.hidden; button.textContent = body.hidden ? "+" : "−"; button.setAttribute("aria-expanded", String(!body.hidden)); }));
    bindRoutes($("#view"));
  }

  function closeDrawer() { $("#mobile-drawer").hidden = true; $("#mobile-menu").setAttribute("aria-expanded", "false"); document.body.classList.remove("drawer-open"); }

  function navigate(url) {
    if (url === `${location.pathname}${location.search}`) return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const transition = $("#route-transition");
    const target = new URL(url, location.href);
    const targetRoute = new URLSearchParams(target.search).get("view") || "overview";
    $("#transition-copy").textContent = `OPENING ${routeNames[targetRoute] || "MODULE"}...`;
    closeDrawer();
    if (!reduced) transition.classList.add("active");
    setTimeout(() => { history.pushState({}, "", `${target.pathname}${target.search}`); currentRoute = target.search; render(parseRoute()); scrollTo({ top: 0, behavior: "instant" }); $("#view").focus({ preventScroll: true }); requestAnimationFrame(() => transition.classList.remove("active")); }, reduced ? 0 : 180);
  }

  function bindRoutes(root = document) {
    $$("a.route-link", root).forEach(link => { if (link.dataset.bound) return; link.dataset.bound = "true"; link.addEventListener("click", event => { if (event.ctrlKey || event.metaKey || event.shiftKey) return; event.preventDefault(); navigate(link.getAttribute("href")); }); });
  }

  $("#sidebar-version").textContent = data.versions[0].version;
  $("#theme-toggle").addEventListener("click", () => { const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark"; document.documentElement.dataset.theme = next; localStorage.setItem("silver-manga-theme", next); });
  $("#mobile-menu").addEventListener("click", () => { const drawer = $("#mobile-drawer"); drawer.hidden = !drawer.hidden; const open = !drawer.hidden; $("#mobile-menu").setAttribute("aria-expanded", String(open)); document.body.classList.toggle("drawer-open", open); });
  addEventListener("popstate", () => { render(parseRoute()); scrollTo(0, 0); });
  bindRoutes();
  currentRoute = location.search;
  render(parseRoute());

  addEventListener("pointermove", event => {
    const portrait = $(".manga-portrait img");
    if (!portrait || matchMedia("(prefers-reduced-motion: reduce)").matches || innerWidth < 900) return;
    const x = (event.clientX / innerWidth - .5) * 8;
    const y = (event.clientY / innerHeight - .5) * 6;
    portrait.style.transform = `translate3d(${x}px, ${y}px, 0)`;
  }, { passive: true });
})();
