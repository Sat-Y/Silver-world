(() => {
  const data = window.SILVER_DATA;
  if (!data) throw new Error("SILVER_DATA 未加载，请检查 content.js。");

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const esc = value => String(value).replace(/[&<>'"]/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[char]));
  const sha256 = async value => [...new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value)))].map(byte => byte.toString(16).padStart(2, "0")).join("");
  const routeNames = { resume: "RESUME", projects: "PROJECT ARCHIVE", project: "PROJECT RECORD", journey: "FOOTPRINT ATLAS", changelog: "LIFE CHANGELOG", connect: "OPEN CHANNEL", fitness: "FITNESS PROTOCOL", trading: "CAPITAL CHANGE", report: "EXPORT REPORT" };
  let currentRoute = "";
  Object.assign(routeNames, { resume: "HOME", about: "ABOUT", games: "GAME ATLAS", game: "GAME STUDY", stars: "漫天繁星" });

  function parseRoute() {
    const params = new URLSearchParams(location.search);
    const requested = params.get("view") === "lab" ? "projects" : params.get("view");
    const view = routeNames[requested] ? requested : "resume";
    return { view, id: params.get("id"), type: params.get("type") };
  }

  function featuredCover(project) {
    const index = data.projects.findIndex(p => p.slug === project.slug);
    const number = String(index + 1).padStart(2, '0');
    return `<div class="featured-cover cover-tone-${index % 5}"><div class="featured-cover-top"><span>SILVER.Z / SELECTED WORK</span><span>NO. ${number}</span></div><div class="featured-cover-body"><span class="featured-cover-category">${project.category === 'ai' ? 'AI APPLICATION' : project.category === 'prototype' ? 'EXPERIMENT / PROTOTYPE' : 'GAME DESIGN'}</span><strong>${esc(project.title)}</strong><span class="featured-cover-rule"></span></div><div class="featured-cover-bottom"><span>${esc(project.evidence[0] || '独立创作')}</span><span aria-hidden="true">↗</span></div><span class="featured-cover-orbit" aria-hidden="true"></span></div>`;
  }

  function projectCard(project, options = {}) {
    const media = options.uniform ? featuredCover(project) : project.showcaseImage
      ? `<img src="${esc(project.showcaseImageWebp || project.showcaseImage)}" alt="${esc(project.title)}运行界面" loading="lazy" decoding="async">`
      : project.demoVideo
        ? `<video muted loop playsinline preload="metadata" aria-label="${esc(project.title)}演示"><source src="${esc(project.demoVideo)}#t=0.1" type="video/mp4"></video><span class="portfolio-video-label">▶ 项目演示</span>`
        : featuredCover(project);
    return `<a class="archive-card portfolio-work route-link" href="?view=project&id=${encodeURIComponent(project.slug)}${options.fromArchive ? '&from=projects' : ''}" data-route="project"><div class="portfolio-media media-${esc(project.category)}">${media}<span class="portfolio-open" aria-hidden="true">↗</span></div><div class="portfolio-work-meta"><div><h3>${esc(project.title)}</h3><p>${esc(project.summary)}</p></div><div class="portfolio-tags">${project.evidence.slice(0, 2).map(tag => `<span>${esc(tag)}</span>`).join('')}</div></div></a>`;
  }

  function worldIcon(route) {
    const paths = {
      games: '<path d="M7.5 7h9a4 4 0 0 1 3.9 3.1l1.1 6a2.5 2.5 0 0 1-4.2 2.2L14.5 16h-5l-2.8 2.3a2.5 2.5 0 0 1-4.2-2.2l1.1-6A4 4 0 0 1 7.5 7Z"/><path d="M7 10v4m-2-2h4m6-1h.01m3 2h.01M12 7V4"/>',
      journey: '<path d="m3 8 5-2 8 3 5-2v13l-5 2-8-3-5 2Z"/><path d="M8 11v8m8-5v8"/><path d="M16 6c0 3-4 6-4 6S8 9 8 6a4 4 0 0 1 8 0Z" fill="var(--world-icon-bg, #eceeeb)"/><circle cx="12" cy="6" r="1"/>',
      trading: '<path d="M4 4v16h16M7 14l4-4 4 2 5-7m-5 0h5v5"/>',
      fitness: '<rect x="4" y="6" width="4" height="12" rx="1.2"/><rect x="16" y="6" width="4" height="12" rx="1.2"/><path d="M8 10h8v4H8M2 10v4m20-4v4"/>',
      stars: '<path d="m12 3 2.4 6.6L21 12l-6.6 2.4L12 21l-2.4-6.6L3 12l6.6-2.4ZM20 3v4m-2-2h4"/>',
      changelog: '<path d="M8 5H5v16h14V5h-3M9 3h6v4H9ZM8 12h8m-8 4h5"/>'
    };
    return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[route] || ''}</svg>`;
  }

  function renderHome() {
    const projects = data.projectOrderManual ? [...data.projects] : [...data.projects].sort((a,b) => Number(Boolean(b.featuredOnHome)) - Number(Boolean(a.featuredOnHome)));
    const capital = window.SILVER_TRADING?.capital;
    const latest = [...(capital?.snapshots || [])].sort((a,b) => a.date.localeCompare(b.date)).at(-1);
    const world = [
      ['games', 'Game Atlas', '游戏图鉴', '游玩、观察与游戏设计拆解。', '◎'],
      ['journey', 'Footprints', '人生足迹', '走过的地方，留下的故事。', '↗'],
      ['stars', 'Starfield', '漫天繁星', '把零散的想法放进一片星空。', '✳'],
      ['trading', 'Capital', '财富记录', latest ? `${latest.date} · ¥${Number(latest.capital).toLocaleString('zh-CN', {minimumFractionDigits:2})}` : '记录资金变化与交易复盘。', '↗'],
      ['fitness', 'Fitness', '健身日志', '记录训练、体能与身体变化。', '↔'],
      ['changelog', 'Changelog', '版本记录', '持续更新中的个人成长档案。', '↻']
    ];
    return `<div class="portfolio-home">
      <section class="portfolio-hero video-hero" aria-labelledby="home-name"><video class="hero-pixel-video" autoplay muted loop playsinline preload="auto" aria-hidden="true" tabindex="-1"><source src="assets/home-background.mp4" type="video/mp4"></video><div class="hero-video-shade" aria-hidden="true"></div><div class="portfolio-hero-art signature-art"><button class="signature-replay" type="button" aria-label="重播 Silver.Z 签名动画"><svg class="silver-signature" viewBox="0 0 820 320" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Silver.Z 手写签名"><g stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path class="signature-stroke" pathLength="1" style="--delay:0s;--duration:.85s" stroke-width="3.5" d="M244 88 C271 43 193 39 150 76 C107 114 133 132 177 144 C225 157 233 177 204 201 C169 230 97 228 101 201 C104 183 139 173 171 181 M111 223 C146 216 215 180 260 164"/><path class="signature-stroke" pathLength="1" style="--delay:.65s;--duration:1.2s" stroke-width="3" d="M260 164 C270 151 278 145 278 153 L263 184 C257 203 282 189 298 173 C329 141 357 81 343 69 C327 56 313 109 307 143 C301 178 296 204 322 186 L345 166 C350 157 355 154 355 160 L351 184 C351 199 365 191 380 174 L401 148 C392 175 412 183 432 163 C461 128 478 145 458 164 C446 175 427 176 431 187 C439 202 473 183 491 160 L498 146 L487 181 C505 151 519 139 527 148 C534 157 522 169 540 163"/><path class="signature-stroke" pathLength="1" style="--delay:1.75s;--duration:.18s" stroke-width="4" d="M285 129 L287 125 M555 185 L557 183"/><path class="signature-stroke" pathLength="1" style="--delay:1.9s;--duration:.65s" stroke-width="3.7" d="M586 108 C624 86 676 88 713 83 C688 107 626 172 582 204 C623 183 668 190 700 187 C721 185 733 178 741 170"/><path class="signature-stroke signature-flourish" pathLength="1" style="--delay:2.4s;--duration:.65s" stroke-width="1.8" d="M148 253 C271 221 492 222 693 218 C722 217 749 211 763 205"/></g></svg><span class="signature-hint">REPLAY SIGNATURE ↺</span></button></div><div class="portfolio-intro"><h1 id="home-name">Silver.Z</h1><p>${esc(data.profile.statement)}</p></div><a class="portfolio-scroll" href="#work">Explore my work ↓</a></section>
      <section class="portfolio-section" id="work"><div class="portfolio-section-heading"><h2>/* Featured Work */</h2><a class="route-link portfolio-view-all" href="?view=projects" data-route="projects">View all ↗</a></div><div class="portfolio-grid">${projects.slice(0, 6).map(p => projectCard(p, {uniform:true})).join('')}</div></section>
      <section class="portfolio-section" id="world"><h2>/* My World */</h2><div class="portfolio-world">${world.map(([route,title,cn,copy,icon])=>`<a class="route-link portfolio-world-item world-${route}" href="?view=${route}" data-route="${route}"><div class="world-symbol" aria-hidden="true">${worldIcon(route)}</div><div><small>${cn}</small><h3>${title}</h3><p>${esc(copy)}</p></div><span aria-hidden="true">↗</span></a>`).join('')}</div></section>
      <footer class="portfolio-footer"><div class="portfolio-footer-callout"><p>Let’s create something</p><h2>worth playing.</h2><div class="portfolio-footer-actions"><a href="mailto:${esc(data.profile.email)}">Email Me ↗</a><a class="route-link" href="?view=about" data-route="about">About Me ↗</a></div></div><div class="portfolio-colophon"><span>Silver.Z<br>AI Game Planner / System Designer</span><span>${esc(data.education.school)} · ${esc(data.education.major)}<br>Based in Hangzhou, CN</span><a class="route-link" href="?view=changelog" data-route="changelog">${esc(data.versions[0].version)} · 持续更新</a></div></footer>
    </div>`;
  }

  function renderAbout() {
    const p = data.profile;
    return `<article class="page portfolio-about"><header class="about-intro"><img src="assets/silver-avatar.jpg" alt="Silver.Z 手绘头像"><div><span>/* About Me */</span><h1>${esc(p.name)}<br><em>Silver.Z</em></h1><p>${esc(p.statement)}</p><a href="mailto:${esc(p.email)}">${esc(p.email)} ↗</a><a class="route-link" href="?view=report&type=resume" data-route="report">导出简历 ↓</a></div></header><section class="about-section"><h2>现在 / Now</h2><div><h3>${esc(p.chapter.title)}</h3><p>${esc(p.chapter.summary)}</p><p>${esc(p.quest.title)}</p></div></section><section class="about-section"><h2>经历 / Experience</h2><div>${data.experience.map(e=>`<article><small>${esc(e.period)} · ${esc(e.company)}</small><h3>${esc(e.role)}</h3><p>${esc(e.summary)}</p><ul>${e.highlights.map(h=>`<li>${esc(h)}</li>`).join('')}</ul></article>`).join('')}</div></section><section class="about-section"><h2>教育 / Education</h2><div><h3>${esc(data.education.school)}</h3><p>${esc(data.education.major)} · ${esc(data.education.degree)}</p><p>${esc(data.education.direction)}</p></div></section><section class="about-section"><h2>工具 / Toolkit</h2><div>${data.skillGroups.map(s=>`<p><small>${esc(s.label)}</small><br>${esc(s.value)}</p>`).join('')}</div></section><section class="about-section"><h2>荣誉 / Honors</h2><div>${data.honors.map(h=>`<p>${esc(h)}</p>`).join('')}</div></section></article>`;
  }

  // Page module numbers use the same source as the desktop directory.
  function moduleCode(route) {
    const number = document.querySelector(`.os-nav [data-route="${route}"] > span`)?.textContent.trim();
    return number ? `${number} / ${routeNames[route]}` : routeNames[route];
  }

  function viewHeader(code, title, description) {
    return `<header class="view-header"><div><p class="section-code mono">${esc(code)}</p><h1>${title}</h1></div><p>${esc(description)}</p></header>`;
  }

  function renderProjects() {
    return `<section class="page archive-page">${viewHeader(moduleCode("projects"), "项目档案", "不是作品清单，而是能力发生过的证据。选择一份记录，进入完整项目视图。")}
      <div class="archive-toolbar"><div class="record-filter" role="group" aria-label="项目筛选"><button class="filter active" data-filter="all">全部记录</button><button class="filter" data-filter="game">游戏</button><button class="filter" data-filter="ai">AI 项目</button><button class="filter" data-filter="prototype">实验与原型</button></div><span class="mono">${String(data.projects.length).padStart(2, "0")} RECORDS FOUND</span></div>
      <div class="archive-grid manga-panels">${data.projects.map(p => projectCard(p, {fromArchive:true})).join("")}</div>
    </section>`;
  }

  function renderProject(id) {
    const project = data.projects.find(item => item.slug === id) || data.projects[0];
    return window.renderSilverProject(project, new URLSearchParams(location.search).get('from') === 'projects');
  }

  function renderCapabilities() {
    return `<section class="page capability-page">${viewHeader("02 / CAPABILITY SYSTEM", "能力系统", "能力不由主观分数定义，而由它在真实项目中的用途和证据定义。")}
      <div class="capability-map"><div class="capability-core"><span>SILVER.Z</span><strong>SYSTEM<br>DESIGNER</strong><i>ACTIVE</i></div>${data.capabilities.map((item, index) => `<article class="cap-node"><span>${esc(item.code)}</span><strong>${esc(item.title)}</strong><p>${esc(item.desc)}</p><small>PROOF / ${esc(item.proof)}</small><i>0${index + 1}</i></article>`).join("")}</div>
      <div class="capability-note"><span class="mono">SYSTEM PRINCIPLE</span><p>设计规则，快速实现，让真实反馈替代封闭自评。</p></div>
    </section>`;
  }

  function geometryPolygons(geometry) {
    if (!geometry) return [];
    if (geometry.type === "Polygon") return [geometry.coordinates];
    if (geometry.type === "MultiPolygon") return geometry.coordinates;
    return [];
  }

  function geometryPoints(geometry) {
    return geometryPolygons(geometry).flat(2);
  }

  function geoBounds(features) {
    const points = features.flatMap(feature => geometryPoints(feature.geometry));
    return points.reduce((bounds, [x, y]) => ({ minX: Math.min(bounds.minX, x), maxX: Math.max(bounds.maxX, x), minY: Math.min(bounds.minY, y), maxY: Math.max(bounds.maxY, y) }), { minX: Infinity, maxX: -Infinity, minY: Infinity, maxY: -Infinity });
  }

  function geoPath(geometry, project) {
    return geometryPolygons(geometry).map(polygon => polygon.map(ring => ring.map(([lon, lat], index) => { const [x, y] = project(lon, lat); return `${index ? "L" : "M"}${x.toFixed(2)},${y.toFixed(2)}`; }).join(" ") + " Z").join(" ")).join(" ");
  }

  function setFootprintPanel(title, code, body, locations = [], image = null) {
    const panel = $("#footprint-panel");
    if (!panel) return;
    const posts = locations.length
      ? locations.map(([place, note], index) => ({ place, text: note, image: index === 0 ? image : null }))
      : [{ place: title, text: body, image }];
    panel.classList.add("is-feed");
    $(".footprint-panel-content", panel).innerHTML = `<header class="footprint-feed-header"><span class="mono">${esc(code)}</span><h2>${esc(title)}</h2><p>${String(posts.length).padStart(2, "0")} 条足迹记录</p></header><div class="footprint-feed">${posts.map(post => `<article class="footprint-post"><img class="footprint-post-avatar" src="assets/silver-avatar.jpg" alt="" loading="lazy"><div class="footprint-post-body"><strong>Silver.Z</strong><p>${esc(post.text)}</p>${post.image?.src ? `<figure><img src="${esc(post.image.src)}" alt="${esc(post.image.alt || `${post.place}足迹照片`)}" loading="lazy" decoding="async">${post.image.caption ? `<figcaption>${esc(post.image.caption)}</figcaption>` : ""}</figure>` : ""}<footer><span>${esc(post.place)}</span><time>${locations.length ? "足迹记录" : "状态记录"}</time></footer></div></article>`).join("")}</div>`;
    panel.classList.add("is-open");
    panel.classList.remove("is-updating");
    requestAnimationFrame(() => panel.classList.add("is-updating"));
  }

  function resetMapFocus(forceWorld = false) {
    const svg = $(".footprint-svg");
    if (!svg) return;
    if (!forceWorld && svg.classList.contains("province-mode") && svg.dataset.chinaViewbox) {
      animateMapViewBox(svg, svg.dataset.chinaViewbox.split(" ").map(Number));
      return;
    }
    animateMapViewBox(svg, (svg.dataset.worldViewbox || "35 20 1130 560").split(" ").map(Number));
  }

  function closeFootprintPanel() {
    $("#footprint-panel")?.classList.remove("is-open");
    const svg = $(".footprint-svg");
    if (svg) delete svg.dataset.selectedRegion;
    resetMapFocus();
  }

  function closeFootprintExperience() {
    const svg = $(".footprint-world");
    if (svg?.classList.contains("province-mode")) {
      exitChinaProvinceMode();
      return;
    }
    closeFootprintPanel();
  }

  function animateMapViewBox(svg, target, duration = 620) {
    const animationId = String((Number(svg.dataset.mapAnimationId) || 0) + 1);
    svg.dataset.mapAnimationId = animationId;
    const start = [svg.viewBox.baseVal.x, svg.viewBox.baseVal.y, svg.viewBox.baseVal.width, svg.viewBox.baseVal.height];
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) { svg.setAttribute("viewBox", target.join(" ")); return; }
    const started = performance.now();
    const tick = now => {
      if (svg.dataset.mapAnimationId !== animationId) return;
      const progress = Math.min(1, (now - started) / duration);
      const eased = 1 - Math.pow(1 - progress, 4);
      svg.setAttribute("viewBox", progress === 1 ? target.join(" ") : start.map((value, index) => value + (target[index] - value) * eased).join(" "));
      if (progress < 1 && svg.isConnected) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  function focusMapRegion(region, zoomMode = "world") {
    const svg = region?.closest("svg");
    const viewport = region?.closest(".map-viewport");
    if (!svg || !viewport) return;
    const viewportRect = viewport.getBoundingClientRect();
    const panelWidth = Math.min(420, Math.max(0, viewportRect.width - 48));
    const availableWidth = Math.max(280, viewportRect.width - panelWidth);
    const box = region.getBBox();
    const worldViewBox = (svg.dataset.worldViewbox || "35 20 1130 560").split(" ").map(Number);
    const previousFocus = svg.dataset.focusViewbox?.split(" ").map(Number);
    const preserveScale = zoomMode === "preserve" && previousFocus;
    const provinceScale = zoomMode === "province" && previousFocus;
    const targetWidth = preserveScale ? previousFocus[2] : provinceScale ? previousFocus[2] / 3 : worldViewBox[2] / 3;
    const targetHeight = preserveScale ? previousFocus[3] : provinceScale ? previousFocus[3] / 3 : worldViewBox[3] / 3;
    const targetRatioX = availableWidth / viewportRect.width / 2;
    const centerX = box.x + box.width / 2;
    const centerY = box.y + box.height / 2;
    const compositionOffsetX = region.dataset.mapRegion === "Russia" ? targetWidth * .22 : 0;
    const target = [centerX + compositionOffsetX - targetWidth * targetRatioX, centerY - targetHeight / 2, targetWidth, targetHeight];
    svg.dataset.focusViewbox = target.join(" ");
    animateMapViewBox(svg, target);
  }

  function selectMapRegion(name, region) {
    const svg = region.closest("svg");
    if (svg.dataset.selectedRegion === name) {
      return false;
    }
    const isProvince = region.classList.contains("map-province") && svg.classList.contains("province-mode");
    const zoomMode = isProvince
      ? (svg.dataset.provinceFocusActive ? "preserve" : "province")
      : (svg.dataset.selectedRegion ? "preserve" : "world");
    svg.dataset.selectedRegion = name;
    if (isProvince) svg.dataset.provinceFocusActive = "true";
    focusMapRegion(region, zoomMode);
    return true;
  }

  function showFootprintFeed(title, code, posts) {
    const panel = $("#footprint-panel");
    if (!panel) return;
    panel.classList.add("is-feed", "is-open");
    $(".footprint-panel-content", panel).innerHTML = `<header class="footprint-feed-header"><span class="mono">${esc(code)}</span><h2>${esc(title)}</h2><p>${String(posts.length).padStart(2, "0")} 条公开记录</p></header><div class="footprint-feed">${posts.length ? posts.map(post => `<article class="footprint-post"><img class="footprint-post-avatar" src="assets/silver-avatar.jpg" alt="" loading="lazy"><div class="footprint-post-body"><strong>${esc(post.name || "Silver.Z")}</strong><p>${esc(post.text)}</p>${post.image?.src ? `<figure><img src="${esc(post.image.src)}" alt="${esc(post.image.alt || `${post.place}足迹照片`)}" loading="lazy" decoding="async">${post.image.caption ? `<figcaption>${esc(post.image.caption)}</figcaption>` : ""}</figure>` : ""}<footer><span>${esc(post.place)}</span><time>${esc(post.date)}</time></footer></div></article>`).join("") : `<div class="footprint-feed-empty">这个区域还没有公开足迹。</div>`}</div>`;
    panel.classList.remove("is-updating");
    requestAnimationFrame(() => panel.classList.add("is-updating"));
  }

  function footprintRecords() {
    if (Array.isArray(data.footprints?.records)) return data.footprints.records;
    return (data.footprints?.countryFeed || []).map(post => ({ country: "China", countryLabel: "中国", ...post }));
  }

  function mapRegionVisual(count = 0) {
    const strength = Math.round(Math.min(86, 46 + Math.log2(Math.max(count, 1)) * 14));
    return `--visit-strength:${strength}%`;
  }

  function showChinaFootprintFeed() {
    showFootprintFeed("中国内足迹", "CHINA / ALL FOOTPRINTS", footprintRecords().filter(post => post.country === "China"));
  }

  function showProvinceFootprintFeed(name, record) {
    const allPosts = footprintRecords().filter(post => post.country === "China");
    const legacyPlaces = new Set((record?.locations || []).map(location => location[0]));
    const posts = allPosts.filter(post => post.province === name || (!post.province && legacyPlaces.has(post.place)));
    showFootprintFeed(record?.title || name, `PROVINCE STATUS / ${record?.status || "NO RECORD"}`, posts);
  }

  function showCountryFootprintFeed(name) {
    const posts = footprintRecords().filter(post => post.country === name);
    const label = posts.find(post => post.countryLabel)?.countryLabel || name;
    showFootprintFeed(`${label}足迹`, `COUNTRY / ${name.toUpperCase()}`, posts);
  }

  function enterChinaProvinceMode(svg) {
    svg.dataset.chinaViewbox = svg.dataset.focusViewbox || `${svg.viewBox.baseVal.x} ${svg.viewBox.baseVal.y} ${svg.viewBox.baseVal.width} ${svg.viewBox.baseVal.height}`;
    delete svg.dataset.selectedRegion;
    delete svg.dataset.provinceFocusActive;
    svg.classList.add("province-mode");
    $$(".map-province", svg).forEach(region => region.setAttribute("tabindex", "0"));
    $("#map-back").hidden = false;
    $("#map-level").textContent = "WORLD / CHINA / PROVINCE INDEX";
    $("#map-location-name").textContent = "SELECT A PROVINCE";
    svg.dataset.defaultLabel = "SELECT A PROVINCE";
    showChinaFootprintFeed();
  }

  function exitChinaProvinceMode() {
    const svg = $(".footprint-world");
    if (!svg) return;
    $("#footprint-panel")?.classList.remove("is-open");
    svg.classList.remove("province-mode");
    $$(".map-province", svg).forEach(region => region.setAttribute("tabindex", "-1"));
    delete svg.dataset.selectedRegion;
    delete svg.dataset.chinaViewbox;
    delete svg.dataset.focusViewbox;
    delete svg.dataset.provinceFocusActive;
    resetMapFocus(true);
    $("#map-back").hidden = true;
    $("#map-level").textContent = "WORLD / COUNTRY INDEX";
    $("#map-location-name").textContent = "CHINA ACTIVE";
    svg.dataset.defaultLabel = "CHINA ACTIVE";
  }

  function bindMapRegions(svg, activate) {
    $$("[data-map-region]", svg).forEach(region => {
      const select = () => activate(region.dataset.mapRegion, region);
      region.addEventListener("click", select);
      region.addEventListener("keydown", event => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); select(); } });
      region.addEventListener("pointerenter", () => { const label = $("#map-location-name"); if (label) label.textContent = region.dataset.mapLabel || region.dataset.mapRegion; });
    });
    svg.addEventListener("pointerleave", () => { const label = $("#map-location-name"); if (label) label.textContent = svg.dataset.defaultLabel || "SELECT A REGION"; });
  }

  function drawWorldMap(geojson) {
    const canvas = $("#footprint-map-canvas");
    const back = $("#map-back");
    if (!canvas || !back) return;
    back.hidden = true;
    $("#map-level").textContent = "WORLD / COUNTRY INDEX";
    $("#map-location-name").textContent = "CHINA ACTIVE";
    const project = (lon, lat) => [(lon + 180) / 360 * 1200, (90 - lat) / 180 * 600];
    const features = geojson.features.filter(feature => feature.properties?.name !== "Antarctica");
    const records = footprintRecords();
    const countryCounts = records.reduce((counts, post) => {
      if (post.country) counts.set(post.country, (counts.get(post.country) || 0) + 1);
      return counts;
    }, new Map());
    const provinceCounts = records.reduce((counts, post) => {
      if (post.country === "China" && post.province) counts.set(post.province, (counts.get(post.province) || 0) + 1);
      return counts;
    }, new Map());
    const provinces = (window.SILVER_CHINA_MAP?.features || []).filter(feature => feature.properties?.name);
    const provincePaths = provinces.map(feature => { const name = feature.properties.name; const count = provinceCounts.get(name) || 0; const explored = count > 0; return `<path class="map-region map-province${explored ? " is-explored" : ""}" style="${mapRegionVisual(count)}" d="${geoPath(feature.geometry, project)}" data-map-region="${esc(name)}" tabindex="-1" role="button" aria-label="${esc(name)}${explored ? "，已有足迹" : "，尚未建立足迹"}"><title>${esc(name)}</title></path>`; }).join("");
    const provinceLabels = provinces.map(feature => { const name = feature.properties.name; const points = geometryPoints(feature.geometry); const xs = points.map(point => point[0]), ys = points.map(point => point[1]); const [x, y] = project((Math.min(...xs) + Math.max(...xs)) / 2, (Math.min(...ys) + Math.max(...ys)) / 2); return `<text x="${x.toFixed(1)}" y="${y.toFixed(1)}">${esc(name.replace(/省|市|壮族自治区|回族自治区|维吾尔自治区|自治区|特别行政区/g, ""))}</text>`; }).join("");
    canvas.innerHTML = `<svg class="footprint-svg footprint-world" viewBox="35 20 1130 560" role="group" aria-label="可交互世界国家与中国省级地图" data-world-viewbox="35 20 1130 560" data-default-label="CHINA ACTIVE"><g class="country-layer">${features.map(feature => { const sourceName = feature.properties?.name || feature.id || "Unknown"; const taiwan = feature.id === "TWN" || sourceName === "Taiwan"; const china = feature.id === "CHN" || sourceName === "China" || taiwan; const name = china ? "China" : sourceName; const displayName = taiwan ? "中国 · 台湾省" : name; const count = countryCounts.get(name) || 0; const explored = count > 0; return `<path class="map-region country-region${china ? " country-china" : ""}${explored ? " is-explored" : ""}" style="${mapRegionVisual(count)}" d="${geoPath(feature.geometry, project)}" data-map-region="${esc(name)}" data-map-label="${esc(displayName)}" tabindex="0" role="button" aria-label="${esc(displayName)}${explored ? `，中国共 ${count} 条足迹记录` : "，进入中国省级地图"}"><title>${esc(displayName)}${explored ? ` · 中国共 ${count} 条记录` : ""}</title></path>`; }).join("")}</g><g class="embedded-province-layer">${provincePaths}</g><g class="province-labels embedded-province-labels" aria-hidden="true">${provinceLabels}</g></svg>`;
    const svg = $(".footprint-svg", canvas);
    bindMapRegions(svg, (name, region) => {
      if (region.classList.contains("map-province")) {
        if (!selectMapRegion(name, region)) return;
        const record = data.footprints?.provinces?.[name];
        return setTimeout(() => {
          showProvinceFootprintFeed(name, record);
        }, 220);
      }
      if (!selectMapRegion(name, region)) return;
      if (name === "China") {
        enterChinaProvinceMode(svg);
        return;
      }
      setTimeout(() => showCountryFootprintFeed(name), 220);
    });
    closeFootprintPanel();
  }

  function drawChinaMap(geojson) {
    const canvas = $("#footprint-map-canvas");
    const back = $("#map-back");
    if (!canvas || !back) return;
    const features = geojson.features.filter(feature => feature.properties?.name);
    const bounds = geoBounds(features);
    const width = 860, height = 620, padding = 34;
    const scale = Math.min((width - padding * 2) / (bounds.maxX - bounds.minX), (height - padding * 2) / (bounds.maxY - bounds.minY));
    const project = (lon, lat) => [padding + (lon - bounds.minX) * scale, height - padding - (lat - bounds.minY) * scale];
    back.hidden = false;
    $("#map-level").textContent = "WORLD / CHINA / PROVINCE INDEX";
    $("#map-location-name").textContent = "浙江省 ACTIVE";
    const provinceCounts = footprintRecords().reduce((counts, post) => { if (post.country === "China" && post.province) counts.set(post.province, (counts.get(post.province) || 0) + 1); return counts; }, new Map());
    const paths = features.map(feature => { const name = feature.properties.name; const count = provinceCounts.get(name) || 0; const explored = count > 0; return `<path class="map-region map-province${explored ? " is-explored" : ""}" style="${mapRegionVisual(count)}" d="${geoPath(feature.geometry, project)}" data-map-region="${esc(name)}" tabindex="0" role="button" aria-label="${esc(name)}${explored ? `，${count} 条足迹记录` : "，尚未建立足迹"}"><title>${esc(name)}${explored ? ` · ${count} 条记录` : ""}</title></path>`; }).join("");
    const labels = features.map(feature => { const name = feature.properties.name; const points = geometryPoints(feature.geometry); const xs = points.map(point => point[0]), ys = points.map(point => point[1]); const [x, y] = project((Math.min(...xs) + Math.max(...xs)) / 2, (Math.min(...ys) + Math.max(...ys)) / 2); return `<text x="${x.toFixed(1)}" y="${y.toFixed(1)}">${esc(name.replace(/省|市|壮族自治区|回族自治区|维吾尔自治区|自治区|特别行政区/g, ""))}</text>`; }).join("");
    canvas.innerHTML = `<svg class="footprint-svg footprint-china" viewBox="0 0 ${width} ${height}" role="group" aria-label="可交互中国省级地图" data-default-label="浙江省 ACTIVE"><g>${paths}</g><g class="province-labels" aria-hidden="true">${labels}</g></svg>`;
    const svg = $(".footprint-svg", canvas);
    bindMapRegions(svg, (name, region) => {
      focusMapRegion(region);
      const record = data.footprints?.provinces?.[name];
      setTimeout(() => {
        showProvinceFootprintFeed(name, record);
      }, 220);
    });
    closeFootprintPanel();
  }

  function switchMap(draw) {
    const canvas = $("#footprint-map-canvas");
    if (!canvas) return;
    closeFootprintPanel();
    canvas.classList.add("is-switching");
    setTimeout(() => { draw(); requestAnimationFrame(() => canvas.classList.remove("is-switching")); }, 220);
  }

  function switchToChinaMap() { if (window.__silverChinaMap) switchMap(() => drawChinaMap(window.__silverChinaMap)); }
  function switchToWorldMap() { if (window.__silverWorldMap) switchMap(() => drawWorldMap(window.__silverWorldMap)); }

  function initFootprintMap() {
    try {
      const world = window.SILVER_WORLD_MAP;
      const china = window.SILVER_CHINA_MAP;
      if (!world?.features || !china?.features) throw new Error("Map data unavailable");
      window.__silverWorldMap = world;
      window.__silverChinaMap = china;
      drawWorldMap(world);
      $("#map-back")?.addEventListener("click", exitChinaProvinceMode);
      $(".footprint-panel-close")?.addEventListener("click", closeFootprintExperience);
    } catch (error) {
      const canvas = $("#footprint-map-canvas");
      if (canvas) canvas.innerHTML = `<div class="map-error"><strong>MAP DATA OFFLINE</strong><p>地图数据暂时无法读取，请刷新页面后重试。</p></div>`;
    }
  }

  function renderJourney() {
    return `<section class="page journey-page">
      <section class="footprint-atlas">
        <header class="map-toolbar"><div class="map-brand"><span class="mono">${esc(moduleCode("journey"))}</span><strong>人生足迹</strong></div><div class="map-context"><span class="mono" id="map-level">WORLD / COUNTRY INDEX</span><strong id="map-location-name">LOADING MAP DATA</strong></div><button type="button" id="map-back" hidden>← 返回世界地图</button></header>
        <div class="map-layout"><div class="map-viewport"><div class="map-axis map-axis-x">180°W <span>0°</span> 180°E</div><div class="map-axis map-axis-y">90°N <span>0°</span> 90°S</div><div id="footprint-map-canvas" class="footprint-map-canvas" aria-live="polite"><div class="map-loading"><i></i><span>LOADING GEOGRAPHIC ARCHIVE</span></div></div></div><aside class="footprint-panel" id="footprint-panel" aria-label="足迹详情"><button class="footprint-panel-close" type="button" aria-label="关闭足迹详情">×</button><div class="footprint-panel-content"></div></aside></div>
        <footer class="map-legend"><span><i></i>暂未探索</span><span><i class="visit-low"></i>少量足迹</span><span><i class="visit-mid"></i>多次到访</span><span><i class="visit-high"></i>频繁记录</span><b>橙色深浅代表到访次数</b></footer>
      </section>
    </section>`;
  }

  function renderChangelog() {
    return `<section class="page changelog-page">${viewHeader(moduleCode("changelog"), `当前版本 <span>${esc(data.versions[0].version)}</span>`, "把人生阶段写成版本记录：新增了什么、修正了什么，以及下一步准备改变什么。")}
      <div class="release-layout"><aside><span class="mono">RELEASE CHANNEL</span><strong>PUBLIC<br>STABLE</strong><p>LAST UPDATED<br>${esc(data.profile.updatedAt)}</p></aside><div class="release-list">${data.versions.map((item, index) => `<article class="release${index === 0 ? " current" : ""}"><header><strong>${esc(item.version)}</strong><span>${esc(item.date)}</span><h2>${esc(item.title)}</h2><button aria-expanded="${index === 0}" data-release="${index}">${index === 0 ? "−" : "+"}</button></header><div class="release-changes"${index === 0 ? "" : " hidden"}>${item.changes.map(([type, text]) => `<p><span data-type="${esc(type)}">${esc(type)}</span>${esc(text)}</p>`).join("")}</div></article>`).join("")}<article class="release release-history"><header><strong>ARCHIVE</strong><span>LOCKED</span><h2>历史版本</h2><button type="button" aria-label="输入密码查找历史版本" data-history-lock>+</button></header></article></div></div>
    </section>`;
  }

  function renderConnect() {
    return `<section class="page connect-page"><p class="section-code mono">${esc(moduleCode("connect"))}</p><div class="connect-hero"><h1>把疯狂想法<br>变成可运行的系统。</h1><p>如果你正在做 AI 游戏、独立产品或任何值得快速验证的创造，欢迎联系我。</p></div><div class="contact-panel"><span class="mono">PRIMARY CHANNEL</span><a href="mailto:${esc(data.profile.email)}">${esc(data.profile.email)}</a></div><div class="external-grid">${data.socials.map((item, index) => `<a href="${esc(item.href)}" target="_blank" rel="noreferrer"><span>0${index + 1}</span><strong>${esc(item.label)}</strong><i>↗</i></a>`).join("")}</div><footer class="view-footer"><span>SILVER.Z / PERSONAL OBSERVATORY</span><span>© ${new Date().getFullYear()}</span></footer></section>`;
  }

  function money(value) {
    return Number.isFinite(value) ? new Intl.NumberFormat("zh-CN", { style: "currency", currency: "CNY", maximumFractionDigits: 0 }).format(value) : "--";
  }

  function percent(value) { return Number.isFinite(value) ? `${value >= 0 ? "+" : ""}${value.toFixed(2)}%` : "--"; }

  function equityChart(snapshots) {
    const values = snapshots.map(item => item.capital), min = Math.min(...values), max = Math.max(...values), range = Math.max(1, max - min);
    const points = snapshots.map((item, index) => `${snapshots.length === 1 ? 50 : 4 + index / (snapshots.length - 1) * 92},${88 - (item.capital - min) / range * 72}`).join(" ");
    const precise = value => new Intl.NumberFormat("zh-CN", { style: "currency", currency: "CNY", minimumFractionDigits: 2 }).format(value);
    const dots = snapshots.map((item, index) => { const x = snapshots.length === 1 ? 50 : 4 + index / (snapshots.length - 1) * 92, y = 88 - (item.capital - min) / range * 72; const delta = index ? item.capital - snapshots[index - 1].capital : null; return `<button type="button" class="sts-chart-point" style="--point-x:${x}%;--point-y:${y}%" data-chart-index="${index}" data-date="${esc(item.date)}" data-value="${esc(precise(item.capital))}" data-change="${delta === null ? '首条记录' : esc(`${delta >= 0 ? '+' : '−'}${precise(Math.abs(delta))} · 较上一条记录`)}" data-journal="${esc(item.journalId || '')}" aria-label="${esc(`${item.date}，资金 ${precise(item.capital)}`)}"></button>`; }).join("");
    return `<div class="sts-chart"><div class="sts-chart-readout" aria-live="polite"><span data-chart-date>${esc(snapshots.at(-1).date)}</span><strong data-chart-value>${precise(snapshots.at(-1).capital)}</strong><span data-chart-change>移动、点选或用方向键查看记录</span><a data-chart-journal hidden>查看复盘 ↗</a></div><div class="sts-chart-plot"><svg viewBox="0 0 100 100" preserveAspectRatio="none" role="img" aria-label="资金曲线，共 ${snapshots.length} 条记录，横轴按记录等距排列"><path d="M4 16H96M4 40H96M4 64H96M4 88H96"/><polyline points="${points}"/></svg><span class="chart-guide" hidden></span>${dots}<span class="chart-scale chart-scale-high">${money(max)}</span><span class="chart-scale chart-scale-low">${money(min)}</span></div><div class="sts-chart-axis"><span>${esc(snapshots[0].date)}</span><strong>按记录排列 · 资金余额</strong><span>${esc(snapshots.at(-1).date)}</span></div></div>`;
  }

  function journalEntry(entry) {
    const outcomes = [["DECISION", "最终决定", entry.decision], ["EXECUTION", "实际操作", entry.execution], ["RESULT", "市场结果", entry.result], ["REVIEW", "盘后复盘", entry.review], ["LESSON", "当日经验", entry.lesson]].filter(([, , value]) => value);
    return `<article class="sts-journal-entry" id="journal-${esc(entry.id)}"><header><time>${esc(entry.date)}</time><span class="mono">${esc(entry.id)}</span></header><h3>${esc(entry.title || "资金变动记录")}</h3>${entry.context ? `<div class="sts-journal-context"><span class="mono">CONTEXT <small>市场背景</small></span><p>${esc(entry.context)}</p></div>` : ""}<div class="sts-conversation">${(entry.conversations || []).map(message => `<div class="${message.role === "ai" ? "is-ai" : "is-silver"}"><span class="mono">${message.role === "ai" ? "AI / 分析伙伴" : "SILVER / 我的判断"}</span><p>${esc(message.content).replace(/\n/g, "<br>")}</p></div>`).join("")}</div>${outcomes.length ? `<dl class="sts-journal-outcomes">${outcomes.map(([label, cn, value]) => `<div><dt>${label}<small>${cn}</small></dt><dd>${esc(value)}</dd></div>`).join("")}</dl>` : ""}</article>`;
  }

  function renderTrading() {
    const t = window.SILVER_TRADING;
    const journals = (t.journals || []).slice().sort((a, b) => b.date.localeCompare(a.date));
    const requestedJournal = new URLSearchParams(location.search).get("journal");
    const selectedJournalIndex = Math.max(0, journals.findIndex(item => item.id === requestedJournal));
    const selectedJournal = journals[selectedJournalIndex];
    const snapshots = (t.capital.snapshots || []).filter(item => item.date && Number.isFinite(item.capital)).sort((a, b) => a.date.localeCompare(b.date));
    const currentCapital = Number.isFinite(t.capital.current) ? t.capital.current : snapshots.at(-1)?.capital;
    const initialCapital = Number.isFinite(t.capital.initial) ? t.capital.initial : snapshots[0]?.capital;
    const hasCapital = snapshots.length > 0;
    const totalPnl = Number.isFinite(currentCapital) && Number.isFinite(initialCapital) ? currentCapital - initialCapital : null;
    const totalReturn = Number.isFinite(totalPnl) && initialCapital ? totalPnl / initialCapital * 100 : null;
    const latestSnapshot = snapshots.at(-1);
    const monthKeys = ["07", "08", "09", "10", "11", "12"];
    const monthLabels = ["JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
    const monthlyValues = monthKeys.map(month => { const records = snapshots.filter(item => item.date.slice(5, 7) === month); if (!records.length) return null; if (records.length > 1 && records[0].capital) return (records.at(-1).capital / records[0].capital - 1) * 100; return Number.isFinite(records[0].pnlPercent) ? records[0].pnlPercent : null; });
    return `<section class="page sts-page">
      <header class="sts-hero">
        <div class="sts-hero-copy"><span class="sts-cover-label mono">PERSONAL CAPITAL ARCHIVE / 个人资金档案</span><h1><span class="sts-title-owner">SILVER</span><span class="sts-title-main">CAPITAL</span><span class="sts-title-system">CHANGE</span></h1><p>记录资金如何变化，并按交易日归档判断、执行、市场结果与复盘。</p></div>
        <aside class="sts-hero-summary" aria-label="资金变动实时摘要">
          <dl>
            <div class="sts-hero-primary"><dt>CURRENT CAPITAL</dt><dd>${money(currentCapital)}</dd></div>
            <div><dt>TOTAL RETURN</dt><dd class="${totalReturn >= 0 ? "is-positive" : "is-negative"}">${percent(totalReturn)}</dd></div>
            <div><dt>UPDATED</dt><dd>${esc(latestSnapshot?.date || "WAITING")}</dd></div>
          </dl>
        </aside>
      </header>

      <section class="sts-chapter sts-capital" id="sts-capital">
        <header class="sts-chapter-head"><div><span class="sts-chapter-index mono">01 / RESULT</span><h2>资金发生了什么变化？</h2></div><p>Capital 是结果层。所有数字只来自真实记录；尚未同步的数据保持空白。</p></header>
        <div class="sts-capital-readout"><div><span class="mono">CURRENT CAPITAL</span><strong>${money(currentCapital)}</strong><small>${hasCapital ? `LATEST VERIFIED · ${esc(latestSnapshot.date)}` : "WAITING FOR VERIFIED DATA"}</small></div><dl><div><dt>INITIAL CAPITAL</dt><dd>${money(initialCapital)}</dd></div><div><dt>TOTAL P&amp;L</dt><dd>${money(totalPnl)}</dd></div><div><dt>TOTAL RETURN</dt><dd>${percent(totalReturn)}</dd></div><div><dt>LATEST P&amp;L</dt><dd>${money(latestSnapshot?.pnl)}</dd></div></dl></div>
        <div class="sts-equity-panel">
          <header><div><h3>Equity Curve</h3><span class="mono">DATE → CAPITAL</span></div><div class="sts-range" role="group" aria-label="资金曲线时间范围">${["1M", "3M", "6M", "YTD", "ALL"].map((x, i) => `<button type="button"${i === 4 ? ' class="active"' : ""} disabled>${x}</button>`).join("")}</div></header>
          ${hasCapital ? equityChart(snapshots) : `<div class="sts-chart-empty"><div class="sts-empty-line" aria-hidden="true"></div><strong>等待第一条资金快照</strong><p>录入真实 CapitalSnapshot 后，资金曲线会在这里出现，并可从日期进入对应的资金变动记录。</p></div>`}
        </div>
        <silver-life-chart class="life-embedded"></silver-life-chart>

      </section>

      <section class="sts-chapter sts-journal" id="sts-journal">
        <header class="sts-chapter-head"><div><span class="sts-chapter-index mono">02 / RECORDS</span><h2>资金变动记录</h2></div><p>按交易日记录判断、执行、市场结果与复盘，并与资金曲线中的对应日期互相连接。</p></header>
        <div class="sts-journal-chain mono"><span>MY THOUGHT<small>我的判断</small></span><i>→</i><span>AI RESPONSE<small>AI 回应</small></span><i>→</i><span>MY DECISION<small>我的决定</small></span><i>→</i><span>MARKET RESULT<small>市场结果</small></span><i>→</i><span>REVIEW<small>复盘</small></span></div>
        ${selectedJournal ? `<div class="sts-journal-browser"><div class="sts-journal-browser-copy"><span class="mono">CAPITAL RECORDS / 资金变动记录</span><strong>选择要查看的交易日</strong><small>共 ${journals.length} 天，当前为第 ${selectedJournalIndex + 1} 条</small></div><div class="sts-journal-controls"><label for="sts-journal-date">交易日期</label><select id="sts-journal-date" data-journal-select>${journals.map((item, index) => `<option value="${esc(item.id)}"${index === selectedJournalIndex ? " selected" : ""}>${esc(item.date)} · ${esc(item.title || "资金变动记录")}</option>`).join("")}</select><div><button type="button" data-journal-newer${selectedJournalIndex === 0 ? " disabled" : ""}>← 较新一天</button><button type="button" data-journal-older${selectedJournalIndex === journals.length - 1 ? " disabled" : ""}>较早一天 →</button></div></div></div><div class="sts-journal-list">${journalEntry(selectedJournal)}</div>` : `<div class="sts-journal-empty"><div><span class="mono">CAPITAL RECORDS</span><strong>暂无资金变动记录</strong></div><p>整理真实记录后，每一天会按 Context、Conversation、Decision、Execution、Result、Review 与 Lesson 展开，并与资金曲线上的同一天互相连接。</p><ul><li>Context</li><li>Conversation</li><li>Decision</li><li>Execution</li><li>Review</li><li>Lesson</li></ul></div>`}
      </section>
      <footer class="sts-footer"><span>SILVER CAPITAL CHANGE</span><strong>Capital × Records</strong><span>LONG-TERM ARCHIVE</span></footer>
    </section>`;
  }

  function fitnessStore() {
    try { return JSON.parse(localStorage.getItem("silver-fitness-v1")) || { completed: {}, weights: [] }; }
    catch { return { completed: {}, weights: [] }; }
  }

  function fitnessWeekKey() {
    const now = new Date(); const first = new Date(now.getFullYear(), 0, 1);
    return `${now.getFullYear()}-W${String(Math.ceil((((now - first) / 86400000) + first.getDay() + 1) / 7)).padStart(2, "0")}`;
  }

  function renderWeightChart(weights) {
    if (!weights.length) return `<div class="weight-empty"><strong>等待第一条记录</strong><span>录入体重后，这里会生成 7 日趋势。</span></div>`;
    const recent = weights.slice(-14), min = Math.min(...recent.map(x => x.value)) - .3, max = Math.max(...recent.map(x => x.value)) + .3;
    const points = recent.map((x, i) => `${recent.length === 1 ? 50 : i / (recent.length - 1) * 100},${84 - (x.value - min) / Math.max(.1, max - min) * 68}`).join(" ");
    return `<svg class="weight-chart" viewBox="0 0 100 100" preserveAspectRatio="none" role="img" aria-label="最近体重趋势"><path d="M0 84H100M0 50H100M0 16H100"/><polyline points="${points}"/><g>${recent.map((x, i) => `<circle cx="${recent.length === 1 ? 50 : i / (recent.length - 1) * 100}" cy="${84 - (x.value - min) / Math.max(.1, max - min) * 68}" r="1.4"><title>${esc(x.date)} · ${x.value}kg</title></circle>`).join("")}</g></svg>`;
  }

  function renderFitness() {
    const f = window.SILVER_FITNESS, store = fitnessStore(), weekKey = fitnessWeekKey(), done = store.completed[weekKey] || [];
    const weights = store.weights || [], latest = weights.at(-1)?.value ?? f.profile.weight, avg = weights.slice(-7).length ? (weights.slice(-7).reduce((sum, x) => sum + x.value, 0) / weights.slice(-7).length).toFixed(1) : "—";
    const stats = [["AGE", f.profile.age], ["HEIGHT", `${f.profile.height}cm`], ["WEIGHT", `${latest}kg`], ["WAIST", `≈${f.profile.waist}cm`], ["PUSH-UP PR", f.profile.pushups], ["PULL-UP / N", f.profile.narrowPullups], ["PULL-UP / W", f.profile.widePullups]];
    return `<section class="page fitness-page">
      <header class="fitness-command"><div class="fitness-title"><span class="mono">PERSONAL PHYSICAL SYSTEM · 12 WEEK PROTOCOL</span><h1>身体不是项目。<br><i>但成长需要系统。</i></h1><p>${esc(f.profile.goal)}。当前先从 ${f.profile.weight}kg 稳定走向 ${esc(f.profile.phaseTarget)}，用力量、外观与腰围共同判断进度。</p><a class="fitness-export route-link" href="?view=report&type=fitness" data-route="report">生成阶段报告 <span>↗</span></a></div><div class="fitness-target"><span class="mono">CURRENT VECTOR</span><div><b>55</b><i>→</i><strong>59</strong><small>KG / PHASE 01</small></div><p>最终方向 65kg，不设三个月硬性截止。</p></div></header>
      <div class="fitness-stat-strip">${stats.map(([label, value]) => `<div><span class="mono">${label}</span><strong>${value}</strong></div>`).join("")}</div>
      <section class="fitness-dashboard"><div class="section-intro"><h2>本周运行状态</h2><p>每周四练。完成一次训练，系统就向前推进一个刻度。</p></div><div class="fitness-live"><div class="completion-readout"><span class="mono">WEEKLY COMPLETION · ${esc(weekKey)}</span><strong><i data-fitness-count>${done.length}</i><small>/ 4</small></strong><div class="completion-track"><i data-fitness-progress style="width:${done.length / 4 * 100}%"></i></div></div><div class="tracking-grid"><div><span>今日体重</span><strong data-latest-weight>${latest}<small>kg</small></strong></div><div><span>7 日平均</span><strong data-average-weight>${avg}<small>${avg === "—" ? "" : "kg"}</small></strong></div><div><span>当前阶段增重</span><strong data-phase-gain>+${Math.max(0, latest - 55).toFixed(1)}<small>kg</small></strong></div><div><span>训练周数</span><strong>01<small>/ 12</small></strong></div></div></div></section>
      <section class="phase-section"><div class="section-intro"><h2>12 周阶段轨道</h2><p>先建立可以长期重复的系统，再逐步提高容量与视觉重点。</p></div><div class="phase-track">${f.phases.map((phase, i) => `<article${i === 0 ? ' class="active"' : ""}><div class="phase-marker"><span>0${i + 1}</span><i></i><b>${phase.weeks}</b></div><h3>${phase.title}</h3><strong>${phase.target}</strong><ul>${phase.goals.map(goal => `<li>${goal}</li>`).join("")}</ul></article>`).join("")}</div></section>
      <section class="weekly-section"><div class="section-intro"><h2>每周训练安排</h2><p>工作日固定 19:30–20:15；周六保留 45–60 分钟自由窗口。</p></div><div class="week-board">${f.week.map(day => `<article class="${day.training ? "training-day" : "rest-day"}"><span class="mono">${day.code}</span><strong>${day.day}</strong><b>${day.type}</b><p>${day.focus}</p><small>${day.duration || "RECOVERY"}</small>${day.training ? `<label><input type="checkbox" data-workout-day="${day.code}" ${done.includes(day.code) ? "checked" : ""}><span>完成</span></label>` : ""}</article>`).join("")}</div></section>
      <section class="workout-section"><div class="section-intro"><h2>动作协议</h2><p>${esc(f.equipment)}</p></div><div class="workout-list">${Object.entries(f.workouts).map(([type, moves], i) => `<details ${i === 0 ? "open" : ""}><summary><span class="mono">${String(i + 1).padStart(2, "0")} / ${type}</span><strong>${f.week.find(x => x.type === type).day} · ${f.week.find(x => x.type === type).focus}</strong><i>+</i></summary><div class="move-list">${moves.map(([name, dose], moveIndex) => `<label><input type="checkbox" data-exercise="${type}-${moveIndex}"><span><b>${name}</b><small>${dose}</small></span></label>`).join("")}</div><p class="safety-note">${esc(f.workoutNotes[type])}</p></details>`).join("")}</div></section>
      <section class="principle-section"><div class="section-intro"><h2>训练原则</h2><p>${esc(f.trainingRules)}</p></div><div class="principle-layout"><article><span class="mono">RIR ≈ 2</span><h3>每组留下两次余力</h3><p>不要每组完全力竭。动作开始变形之前结束这一组；出现锐痛、关节痛或无法控制阻力时立即停止。</p></article><div class="progression-flow"><span>按各动作次数范围递进</span><i>先补齐次数</i><strong>连续两次全组达到上限</strong><i>再提高难度</i><b>固定哑铃调整变式 / 弹力带增加张力</b><small>${esc(f.progression)}</small></div></div></section>
      <section class="nutrition-section"><div class="section-intro"><h2>低成本饮食系统</h2><p>每日蛋白质约 90g。优先公司餐补，不喝牛奶，暂不购买蛋白粉、增肌粉、肌酸或补剂。</p></div><div class="meal-grid">${f.meals.map(meal => `<article><span class="mono">${meal.label}</span><h3>${meal.title}</h3><p>${meal.note}</p></article>`).join("")}</div><div class="vegetable-line"><span>优先蔬菜</span>${f.vegetables.map(x => `<b>${x}</b>`).join("")}</div></section>
      ${/* 暂无体重计，暂时隐藏体重观测模块；保留代码方便恢复。
      <section class="weight-section"><div class="section-intro"><h2>体重观测与调节</h2><p>只依据 7 日平均调整饮食，不对单日波动作出反应。</p></div><div class="weight-console"><form id="weight-form"><label for="fitness-weight">录入今日体重</label><div><input id="fitness-weight" name="weight" type="number" min="40" max="100" step="0.1" required placeholder="55.0"><button type="submit">保存记录</button></div><small id="weight-feedback" aria-live="polite">数据仅保存在当前浏览器。</small></form><div data-weight-chart>${renderWeightChart(weights)}</div></div><div class="adjustment-logic"><article><span>&lt; 0.1kg / 周</span><strong>增加碳水</strong><p>晚餐加半碗至一碗米饭，或早餐增加低成本碳水。</p></article><article class="stable"><span>0.15–0.3kg / 周</span><strong>保持不变</strong><p>处于目标增速，继续当前训练与饮食结构。</p></article><article><span>&gt; 0.4–0.5kg / 周</span><strong>稍微减少</strong><p>长期超出范围时，减少额外碳水，不做激进调整。</p></article></div></section>
      */ ""}
      <section class="future-section"><div class="section-intro"><h2>长期里程碑</h2><p>第一阶段确认体重、力量和外观同步改善，腰围没有明显失控，并且训练能长期坚持。</p></div><div class="milestone-line"><strong class="current">55<small>NOW</small></strong><i></i><strong>60<small>NEXT</small></strong><i></i><strong>65<small>LONG TERM</small></strong></div></section>
    </section>`;
  }

  function bindFitnessEvents() {
    const weekKey = fitnessWeekKey();
    $$('[data-workout-day]').forEach(input => input.addEventListener("change", () => { const store = fitnessStore(); const set = new Set(store.completed[weekKey] || []); input.checked ? set.add(input.dataset.workoutDay) : set.delete(input.dataset.workoutDay); store.completed[weekKey] = [...set]; localStorage.setItem("silver-fitness-v1", JSON.stringify(store)); $("[data-fitness-count]").textContent = set.size; $("[data-fitness-progress]").style.width = `${set.size / 4 * 100}%`; }));
    $("#weight-form")?.addEventListener("submit", event => {
      event.preventDefault();
      const input = $("#fitness-weight"), value = Number(input?.value);
      if (!Number.isFinite(value) || value < 40 || value > 100) return;
      const store = fitnessStore(), date = new Date().toISOString().slice(0, 10);
      store.weights = [...(store.weights || []).filter(item => item.date !== date), { date, value }].sort((a, b) => a.date.localeCompare(b.date)).slice(-365);
      localStorage.setItem("silver-fitness-v1", JSON.stringify(store));
      render({ view: "fitness" });
    });
  }

  function reportToolbar(type) {
    return `<div class="report-toolbar" role="toolbar" aria-label="报告操作"><a class="route-link" href="?view=${type === "resume" ? "resume" : "fitness"}" data-route="${type === "resume" ? "resume" : "fitness"}">← 返回${type === "resume" ? "简历" : "健身计划"}</a><div><button type="button" data-report-print>打印 / 保存 PDF</button>${type === "fitness" ? `<button type="button" data-report-png>下载 4:5 PNG</button>` : ""}</div></div>`;
  }

  function renderResumeReport() {
    const p = data.profile, github = data.socials.find(x => x.label === "GitHub");
    data.skillGroups.forEach(group => { if (!group.items) group.items = [group.value]; });
    const resumeProjects = [...data.projects.filter(item => item.featuredOnHome), ...data.projects.filter(item => !item.featuredOnHome)].slice(0, 3);
    return `<section class="report-page resume-report">${reportToolbar("resume")}<article class="a4-sheet"><header><div><h1>${esc(p.name || "周瑜鸿")} <small>SILVER.Z</small></h1><p>${esc(p.role)}</p></div><address><a href="mailto:${esc(p.email)}">${esc(p.email)}</a><span>杭州，中国</span>${github ? `<a href="${esc(github.href)}">github.com/Sat-Y</a>` : ""}</address></header><p class="resume-summary">${esc(p.statement)}专注把生成式 AI 能力组织成可运行、可验证的游戏机制与产品流程。</p><section><h2>工作经历</h2>${data.experience.map(item => `<article class="resume-entry"><div><h3>${esc(item.role)}</h3><strong>${esc(item.company)}</strong></div><time>${esc(item.period)}</time><p>${esc(item.summary)}</p><ul>${item.highlights.map(x => `<li>${esc(x)}</li>`).join("")}</ul></article>`).join("")}</section><section><h2>精选项目</h2>${resumeProjects.map(item => `<article class="resume-entry project-entry"><div><h3>${esc(item.title)} <small>${esc(item.english)}</small></h3><strong>${esc(item.role)} · ${esc(item.status)}</strong></div><p>${esc(item.summary)}</p><ul>${item.evidence.map(x => `<li>${esc(x)}</li>`).join("")}</ul></article>`).join("")}</section><section class="resume-honors"><h2>奖项荣誉</h2><ul>${data.honors.map(item => `<li>${esc(item)}</li>`).join("")}</ul></section><section class="resume-bottom"><div><h2>教育经历</h2><article class="resume-entry"><div><h3>${esc(data.education.school)}</h3><strong>${esc(data.education.major)} · ${esc(data.education.degree)}</strong></div><p>${esc(data.education.direction)}</p></article></div><div><h2>能力与工具</h2><p>${data.capabilities.map(x => esc(x.title)).join(" · ")}</p><p>${data.skillGroups.flatMap(x => x.items || []).slice(0, 12).map(x => typeof x === "string" ? esc(x) : esc(x.name || x.label)).join(" · ")}</p></div></section><footer><span>SILVER OS / EVIDENCE RESUME</span><span>UPDATED ${esc(p.updatedAt)}</span></footer></article></section>`;
  }

  function fitnessReportData() {
    const f = window.SILVER_FITNESS, store = fitnessStore(), weights = store.weights || [], latest = weights.at(-1)?.value ?? f.profile.weight;
    const average = weights.slice(-7).length ? (weights.slice(-7).reduce((sum, x) => sum + x.value, 0) / weights.slice(-7).length).toFixed(1) : "—";
    const completed = Object.values(store.completed || {}).reduce((sum, days) => sum + days.length, 0);
    return { f, store, weights, latest, average, completed, gain: Math.max(0, latest - f.profile.weight).toFixed(1) };
  }

  function renderFitnessReport() {
    const { f, weights, latest, average, completed, gain } = fitnessReportData();
    return `<section class="report-page fitness-report">${reportToolbar("fitness")}<article class="social-sheet" id="fitness-social-card"><header><span>SILVER OS · PHYSICAL RECORD</span><time>${new Date().toLocaleDateString("zh-CN", { year: "numeric", month: "2-digit", day: "2-digit" })}</time></header><div class="social-title"><h1>阶段成长<br>记录</h1><p>${esc(f.profile.goal)}</p></div><div class="social-vector"><div><span>START</span><strong>${f.profile.weight}</strong><small>KG</small></div><i>→</i><div><span>CURRENT</span><strong>${latest}</strong><small>KG</small></div><b>+${gain} KG</b></div><div class="social-metrics"><div><span>7 日平均</span><strong>${average}${average === "—" ? "" : "kg"}</strong></div><div><span>累计训练</span><strong>${completed} 次</strong></div><div><span>俯卧撑 PR</span><strong>${f.profile.pushups} 次</strong></div><div><span>腰围</span><strong>≈ ${f.profile.waist}cm</strong></div></div><div class="social-chart"><span>WEIGHT TREND · RECENT 14 RECORDS</span>${renderWeightChart(weights)}</div><blockquote>“先让体重、力量与外观一起变好，<br>再进入下一个阶段。”</blockquote><footer><span>PHASE 01 · 55 → 57–59KG</span><span>@ SILVER.Z</span></footer></article><p class="report-hint">社交版按 1080 × 1350（4:5）导出；没有历史数据时会保留清晰的空状态。</p></section>`;
  }

  function renderReport(route) { return route.type === "resume" ? renderResumeReport() : renderFitnessReport(); }

  function downloadFitnessPng() {
    const { f, latest, average, completed, gain, weights } = fitnessReportData(), canvas = document.createElement("canvas"), ctx = canvas.getContext("2d");
    canvas.width = 1080; canvas.height = 1350; ctx.fillStyle = "#eceeea"; ctx.fillRect(0, 0, 1080, 1350); ctx.fillStyle = "#121618"; ctx.font = "24px Manrope, sans-serif"; ctx.fillText("SILVER OS  /  PHYSICAL RECORD", 72, 82); ctx.textAlign = "right"; ctx.fillText(new Date().toLocaleDateString("zh-CN"), 1008, 82); ctx.textAlign = "left";
    ctx.font = "500 104px Manrope, sans-serif"; ctx.fillText("阶段成长", 72, 238); ctx.fillText("记录", 72, 346); ctx.fillStyle = "#5f6668"; ctx.font = "30px Manrope, sans-serif"; ctx.fillText(f.profile.goal, 72, 410);
    ctx.strokeStyle = "rgba(18,22,24,.28)"; ctx.beginPath(); ctx.moveTo(72, 458); ctx.lineTo(1008, 458); ctx.stroke();
    ctx.fillStyle = "#121618"; ctx.font = "20px monospace"; ctx.fillText("START", 72, 520); ctx.fillText("CURRENT", 620, 520); ctx.font = "500 126px monospace"; ctx.fillText(String(f.profile.weight), 72, 654); ctx.fillStyle = "#176c79"; ctx.fillText(String(latest), 620, 654); ctx.fillStyle = "#176c79"; ctx.font = "500 34px monospace"; ctx.fillText(`+${gain} KG`, 825, 630);
    const metrics = [["7 日平均", average === "—" ? "—" : `${average}kg`], ["累计训练", `${completed} 次`], ["俯卧撑 PR", `${f.profile.pushups} 次`], ["腰围", `≈ ${f.profile.waist}cm`]]; metrics.forEach(([label, value], i) => { const x = 72 + i * 234; ctx.fillStyle = "#5f6668"; ctx.font = "22px Manrope, sans-serif"; ctx.fillText(label, x, 754); ctx.fillStyle = "#121618"; ctx.font = "500 38px Manrope, sans-serif"; ctx.fillText(value, x, 812); });
    ctx.fillStyle = "#5f6668"; ctx.font = "20px monospace"; ctx.fillText("WEIGHT TREND  /  RECENT 14 RECORDS", 72, 902); ctx.strokeStyle = "rgba(18,22,24,.2)"; ctx.strokeRect(72, 936, 936, 190); if (weights.length > 1) { const recent = weights.slice(-14), min = Math.min(...recent.map(x => x.value)) - .2, max = Math.max(...recent.map(x => x.value)) + .2; ctx.strokeStyle = "#176c79"; ctx.lineWidth = 4; ctx.beginPath(); recent.forEach((x, i) => { const px = 92 + i / (recent.length - 1) * 896, py = 1096 - (x.value - min) / Math.max(.1, max - min) * 130; i ? ctx.lineTo(px, py) : ctx.moveTo(px, py); }); ctx.stroke(); } else { ctx.fillStyle = "#5f6668"; ctx.font = "24px Manrope, sans-serif"; ctx.fillText("等待更多体重记录", 390, 1040); }
    ctx.fillStyle = "#121618"; ctx.font = "500 34px Manrope, sans-serif"; ctx.fillText("先让体重、力量与外观一起变好，", 72, 1200); ctx.fillText("再进入下一个阶段。", 72, 1248); ctx.fillStyle = "#176c79"; ctx.font = "20px monospace"; ctx.fillText("PHASE 01  ·  55 → 57–59KG", 72, 1310); ctx.textAlign = "right"; ctx.fillText("@ SILVER.Z", 1008, 1310);
    const link = document.createElement("a"); link.download = `silver-fitness-${new Date().toISOString().slice(0, 10)}.png`; link.href = canvas.toDataURL("image/png"); link.click();
  }

  function bindReportEvents(route) {
    $("[data-report-print]")?.addEventListener("click", () => print());
    if (route.type === "resume") {
      const projectsSection = $$(".a4-sheet > section")[1];
      if (projectsSection) projectsSection.insertAdjacentHTML("beforeend", `<p class="resume-more">更多项目经历与完整案例：<a href="https://silverz.netlify.app/">silverz.netlify.app</a></p>`);
    } else $("[data-report-png]")?.addEventListener("click", downloadFitnessPng);
  }

  let disposeCapabilities = () => {};
  function render(route) {
    disposeCapabilities();
    const renderers = { resume: renderHome, about: renderAbout, projects: renderProjects, project: () => renderProject(route.id), journey: renderJourney, changelog: renderChangelog, connect: renderConnect, fitness: renderFitness, trading: renderTrading, report: () => renderReport(route) };
    renderers.stars = () => '<silver-starfield></silver-starfield>';
    renderers.games = () => window.SILVER_GAME_ATLAS.render();
    renderers.game = () => window.SILVER_GAME_ATLAS.render(route.id || "missing");
    $("#view").innerHTML = renderers[route.view]();
    document.body.dataset.view = route.view;
    $("#route-label").textContent = routeNames[route.view];
    document.title = `${routeNames[route.view]} — Silver OS`;
    $$("[data-route]").forEach(link => link.classList.toggle("active", link.dataset.route === route.view || (route.view === "project" && link.dataset.route === "projects")));
    bindDynamicEvents(route);
    const previews = $$('.portfolio-media video');
    if (previews.length && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const observer = new IntersectionObserver(entries => entries.forEach(({target,isIntersecting}) => { if (isIntersecting) target.play().catch(() => {}); else target.pause(); }), {threshold:.3});
      previews.forEach(video => observer.observe(video));
      const previousDispose = disposeCapabilities;
      disposeCapabilities = () => { previousDispose(); observer.disconnect(); previews.forEach(video => video.pause()); };
    }
    if (route.view === "games" || route.view === "game") {
      window.SILVER_GAME_ATLAS.bind();
      $$('[data-route="games"]').forEach(link => link.classList.add("active"));
    }
    requestAnimationFrame(() => $$(".page > *, .archive-card, .cap-node, .release").forEach((node, index) => { node.style.setProperty("--enter-index", Math.min(index, 10)); node.classList.add("panel-enter"); }));
  }

  function bindDynamicEvents(route) {
    if (route.view === 'resume') {
      const video = $('.hero-pixel-video');
      if (video) {
        video.muted = true;
        const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (reduced) { video.removeAttribute('autoplay'); video.pause(); }
        else {
          const observer = new IntersectionObserver(entries => entries.forEach(e => e.isIntersecting ? video.play().catch(() => {}) : video.pause()), {threshold:.05});
          observer.observe(video);
          disposeCapabilities = () => { observer.disconnect(); video.pause(); };
        }
      }
    }
    if (route.view === 'resume') $('.signature-replay')?.addEventListener('click', () => {
      const svg = $('.silver-signature');
      const fresh = svg.cloneNode(true);
      svg.replaceWith(fresh);
    });
    if (route.view === "projects") $$(".filter").forEach(button => button.addEventListener("click", () => {
      $$(".filter").forEach(item => item.classList.remove("active"));
      button.classList.add("active");
      $$(".archive-card").forEach(card => { const p = data.projects.find(item => card.href.includes(encodeURIComponent(item.slug))); card.hidden = button.dataset.filter !== "all" && p.category !== button.dataset.filter; });
    }));
    if (route.view === "journey") initFootprintMap();
    if (route.view === "fitness") bindFitnessEvents();
    if (route.view === "trading") {
      const chart = $(".sts-chart");
      if (chart) {
        const dots = $$("[data-chart-index]", chart), plot = $(".sts-chart-plot", chart);
        const show = index => {
          const point = dots[index];
          dots.forEach(dot => dot.classList.toggle("is-selected", dot === point));
          $("[data-chart-date]", chart).textContent = point.dataset.date;
          $("[data-chart-value]", chart).textContent = point.dataset.value;
          $("[data-chart-change]", chart).textContent = point.dataset.change;
          const link = $("[data-chart-journal]", chart);
          link.hidden = !point.dataset.journal;
          link.href = `?view=trading&journal=${encodeURIComponent(point.dataset.journal)}#sts-journal`;
          const guide = $(".chart-guide", chart);
          guide.hidden = false;
          guide.style.left = point.style.getPropertyValue("--point-x");
        };
        plot.addEventListener("pointermove", event => {
          const rect = plot.getBoundingClientRect();
          const position = (event.clientX - rect.left) / rect.width * 100;
          const nearest = dots.reduce((best, dot, index) => Math.abs(parseFloat(dot.style.getPropertyValue("--point-x")) - position) < Math.abs(parseFloat(dots[best].style.getPropertyValue("--point-x")) - position) ? index : best, 0);
          show(nearest);
        });
        dots.forEach((dot, index) => {
          dot.addEventListener("focus", () => show(index));
          dot.addEventListener("click", () => show(index));
          dot.addEventListener("keydown", event => {
            if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
            event.preventDefault();
            const next = event.key === "Home" ? 0 : event.key === "End" ? dots.length - 1 : Math.max(0, Math.min(dots.length - 1, index + (event.key === "ArrowRight" ? 1 : -1)));
            dots[next].focus();
          });
        });
      }
      const openJournal = id => {
        const url = new URL(location.href);
        url.searchParams.set("view", "trading");
        url.searchParams.set("journal", id);
        url.hash = "sts-journal";
        history.replaceState({}, "", url);
        render(parseRoute());
        requestAnimationFrame(() => $("#sts-journal")?.scrollIntoView({ block: "start" }));
      };
      const select = $("[data-journal-select]");
      select?.addEventListener("change", () => openJournal(select.value));
      $("[data-journal-newer]")?.addEventListener("click", () => select && openJournal(select.options[Math.max(0, select.selectedIndex - 1)].value));
      $("[data-journal-older]")?.addEventListener("click", () => select && openJournal(select.options[Math.min(select.options.length - 1, select.selectedIndex + 1)].value));
    }
    if (route.view === "report") bindReportEvents(route);
    if (route.view === "changelog") $$('[data-release]').forEach(button => button.addEventListener("click", () => { const body = button.closest(".release").querySelector(".release-changes"); body.hidden = !body.hidden; button.textContent = body.hidden ? "+" : "−"; button.setAttribute("aria-expanded", String(!body.hidden)); }));
    if (route.view === "changelog") $("[data-history-lock]")?.addEventListener("click", async () => {
      const password = prompt("请输入历史版本访问密码");
      if (password === null) return;
      const valid = await sha256(password) === "5cc11a9bace64400d7ef0d5bdfc7431b78ac96d6be9f4af8366ecf5b69447462";
      alert(valid ? "数据查找不到" : "密码错误");
    });
    bindRoutes($("#view"));
  }

  function closeDesktopNav() { document.body.classList.remove("desktop-nav-open"); $("#desktop-nav-toggle").setAttribute("aria-expanded", "false"); }
  function openDesktopNav() { document.body.classList.add("desktop-nav-open"); $("#desktop-nav-toggle").setAttribute("aria-expanded", "true"); requestAnimationFrame(() => $("#desktop-nav-close").focus()); }
  function closeDrawer() { $("#mobile-drawer").hidden = true; $("#mobile-menu").setAttribute("aria-expanded", "false"); $("#mobile-more").setAttribute("aria-expanded", "false"); document.body.classList.remove("drawer-open"); closeDesktopNav(); }

  function navigate(url) {
    const target = new URL(url, location.href);
    closeDrawer();
    const samePage = target.search === location.search;
    if (target.href !== location.href) history.pushState({}, "", `${target.pathname}${target.search}${target.hash}`);
    if (!samePage) { currentRoute = target.search; render(parseRoute()); }
    requestAnimationFrame(() => {
      const anchor = target.hash && document.getElementById(decodeURIComponent(target.hash.slice(1)));
      if (anchor) anchor.scrollIntoView({behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block:'start'});
      else scrollTo({top:0, behavior:'instant'});
      if (!samePage) $("#view").focus({preventScroll:true});
    });
  }

  function bindRoutes(root = document) {
    $$("a.route-link", root).forEach(link => { if (link.dataset.bound) return; link.dataset.bound = "true"; link.addEventListener("click", event => { if (event.ctrlKey || event.metaKey || event.shiftKey) return; event.preventDefault(); navigate(link.getAttribute("href")); }); });
  }

  $("#sidebar-version").textContent = data.versions[0].version;
  $("#theme-toggle").addEventListener("click", () => { const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark"; document.documentElement.dataset.theme = next; localStorage.setItem("silver-manga-theme", next); });
  $("#desktop-nav-toggle").addEventListener("click", () => document.body.classList.contains("desktop-nav-open") ? closeDesktopNav() : openDesktopNav());
  $("#desktop-nav-close").addEventListener("click", closeDesktopNav);
  $("#desktop-nav-backdrop").addEventListener("click", closeDesktopNav);
  $("#mobile-menu").addEventListener("click", () => { const drawer = $("#mobile-drawer"); drawer.hidden = !drawer.hidden; const open = !drawer.hidden; $("#mobile-menu").setAttribute("aria-expanded", String(open)); document.body.classList.toggle("drawer-open", open); });
  $("#mobile-more").addEventListener("click", () => { const drawer = $("#mobile-drawer"); drawer.hidden = !drawer.hidden; const open = !drawer.hidden; $("#mobile-more").setAttribute("aria-expanded", String(open)); document.body.classList.toggle("drawer-open", open); });
  addEventListener("popstate", () => { render(parseRoute()); requestAnimationFrame(() => { const anchor = location.hash && document.getElementById(decodeURIComponent(location.hash.slice(1))); if (anchor) anchor.scrollIntoView(); else scrollTo(0, 0); }); });
  addEventListener("keydown", event => { if (event.key === "Escape" && document.body.classList.contains("desktop-nav-open")) { closeDesktopNav(); $("#desktop-nav-toggle").focus(); } });
  bindRoutes();
  const initialRoute = parseRoute();
  if (initialRoute.view === 'resume') {
    // Opening or refreshing home starts at the cover; in-page navigation still uses anchors.
    history.scrollRestoration = 'manual';
    if (location.hash) history.replaceState(history.state, '', location.pathname + location.search);
    const showCover = () => scrollTo({top:0, behavior:'instant'});
    requestAnimationFrame(showCover);
    addEventListener('load', showCover, {once:true});
  }
  currentRoute = location.search;
  render(initialRoute);
  if (initialRoute.view !== 'resume' && location.hash) requestAnimationFrame(() => document.getElementById(decodeURIComponent(location.hash.slice(1)))?.scrollIntoView());

})();
