(() => {
  const data = window.SILVER_DATA;
  if (!data) throw new Error("SILVER_DATA 未加载，请检查 content.js。");

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const esc = value => String(value).replace(/[&<>'"]/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[char]));
  const sha256 = async value => [...new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value)))].map(byte => byte.toString(16).padStart(2, "0")).join("");
  const routeNames = { resume: "RESUME", projects: "PROJECT ARCHIVE", project: "PROJECT RECORD", lab: "EXPERIMENT LAB", journey: "FOOTPRINT ATLAS", changelog: "LIFE CHANGELOG", connect: "OPEN CHANNEL" };
  let currentRoute = "";

  function parseRoute() {
    const params = new URLSearchParams(location.search);
    const requested = params.get("view");
    const view = routeNames[requested] ? requested : "resume";
    return { view, id: params.get("id") };
  }

  function metricMarkup(metrics) {
    return `<div class="dashboard-metrics">${metrics.map(item => `<article class="dash-metric"><span>${esc(item.label)}</span><strong>${esc(item.value)}</strong><small>${esc(item.note)}</small></article>`).join("")}</div>`;
  }

  function projectCard(project) {
    return `<a class="archive-card route-link" href="?view=project&id=${encodeURIComponent(project.slug)}" data-route="project">
      <div class="archive-visual" data-index="${esc(project.index)}"><span>${esc(project.id)}</span><i>${esc(project.status)}</i></div>
      <div class="archive-card-copy">
        <div><h3>${esc(project.title)}</h3><p class="mono">${esc(project.english)}${project.date ? ` · ${esc(project.date)}` : ""}</p></div><span class="open-record">OPEN RECORD ↗</span>
        <p>${esc(project.summary)}</p>
        <div class="archive-tags">${project.evidence.map(item => `<span>${esc(item)}</span>`).join("")}</div>
      </div>
    </a>`;
  }

  function viewHeader(code, title, description) {
    return `<header class="view-header"><div><p class="section-code mono">${esc(code)}</p><h1>${title}</h1></div><p>${esc(description)}</p></header>`;
  }

  function renderResume() {
    const { profile } = data;
    const latest = data.versions[0];
    return `<section class="page overview-page resume-page">
      <div class="resume-cover">
      <div class="hero-art" aria-hidden="true"><div class="hero-art-shift"><div class="hero-art-image"></div><div class="hero-monitor-glow"></div><div class="hero-night-lights"></div></div><div class="hero-paper-texture"></div><div class="hero-reading-shade"></div></div>
      <div class="overview-grid" aria-hidden="true"></div>
      <div class="overview-identity">
        <p class="eyebrow"><i class="signal"></i>${esc(profile.availability)}</p>
        <div class="manga-kicker">RESUME FILE <span>／</span> OPEN TO OPPORTUNITIES</div>
        <h1>SILVER<span>/</span>Z</h1>
        <p class="overview-role mono">${esc(profile.role)}</p>
        <p class="overview-statement">${esc(profile.statement)}</p>
        <div class="resume-actions"><a class="os-button route-link" href="?view=projects" data-route="projects">VIEW SELECTED WORK <span>↘</span></a><a class="resume-text-link route-link" href="?view=connect" data-route="connect">CONTACT ME →</a></div>
      </div>
      <a class="resume-scroll-cue" href="#resume-content" aria-label="向下滚动查看完整简历"><span>SCROLL TO RESUME</span><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4v15M6.5 13.5 12 19l5.5-5.5"/></svg></a>
      </div>
      <div class="resume-document">
      <section class="resume-document-profile" aria-label="个人简历信息">
        <div class="manga-portrait-wrap">
          <figure class="manga-portrait" aria-label="Silver.Z 手绘个人形象">
            <img src="assets/silver-avatar.jpg" alt="Silver.Z 黑白手绘人物形象">
            <b class="hand-note">Still<br>building.</b>
          </figure>
          <div class="portrait-id-card"><span>CHARACTER<br>FILE</span><div><strong>SILVER.Z</strong><i>主人公 / SYSTEM DESIGNER</i></div></div>
        </div>
        <div class="resume-profile-copy">
          <span class="mono">PROFILE / 2026</span>
          <h2>周瑜鸿 <i>SILVER.Z</i></h2>
          <p>${esc(profile.role)}</p>
          <dl><div><dt>EDUCATION</dt><dd>${esc(data.education.school)} · ${esc(data.education.major)}</dd></div><div><dt>LOCATION</dt><dd>杭州 · 中国</dd></div><div><dt>PHONE</dt><dd><a href="tel:19858810407">19858810407</a></dd></div><div><dt>EMAIL</dt><dd><a href="mailto:${esc(profile.email)}">${esc(profile.email)}</a></dd></div></dl>
        </div>
      </section>
      <aside class="current-chapter" id="resume-content">
        <div class="module-label"><span>CURRENT CHAPTER</span><i>LIVE</i></div>
        <p class="mono">${esc(profile.chapter.code)}</p>
        <h2>${esc(profile.chapter.title)}</h2>
        <p>${esc(profile.chapter.summary)}</p>
        <dl>${profile.chapter.meta.map(([label, value]) => `<div><dt>${esc(label)}</dt><dd>${esc(value)}</dd></div>`).join("")}</dl>
        <div class="overview-quest"><div><span>MAIN QUEST</span><i>${profile.quest.progress}%</i></div><strong>${esc(profile.quest.title)}</strong><b><span style="width:${profile.quest.progress}%"></span></b></div>
      </aside>
      ${metricMarkup(profile.metrics)}
      <section class="resume-section resume-experience"><div class="module-label"><span>INTERNSHIP EXPERIENCE</span><i>01 RECORD</i></div><div class="experience-list">${data.experience.map(item => `<article class="experience-record"><div class="experience-time"><span>${esc(item.period)}</span><i>${esc(item.status)}</i></div><div class="experience-main"><p>${esc(item.company)}</p><h2>${esc(item.role)}</h2><p>${esc(item.summary)}</p><ul>${item.highlights.map(point => `<li>${esc(point)}</li>`).join("")}</ul></div></article>`).join("")}</div></section>
      <section class="resume-section resume-capabilities"><div class="module-label"><span>CAPABILITY EVIDENCE</span><a class="route-link" href="?view=projects" data-route="projects">TRACE TO PROJECTS →</a></div><div class="resume-cap-grid">${data.capabilities.map(item => `<article><span>${esc(item.code)}</span><h3>${esc(item.title)}</h3><p>${esc(item.desc)}</p><small>${esc(item.proof)}</small></article>`).join("")}</div></section>
      <section class="resume-section resume-education"><div class="module-label"><span>EDUCATION & TOOLKIT</span><i>VERIFIED PROFILE</i></div><div class="education-layout"><div class="education-primary"><span>EDUCATION</span><h2>${esc(data.education.school)}</h2><p>${esc(data.education.major)} · ${esc(data.education.degree)}</p><small>${esc(data.education.direction)}</small></div><div class="skill-ledger">${data.skillGroups.map(item => `<div><span>${esc(item.label)}</span><strong>${esc(item.value)}</strong></div>`).join("")}</div></div><div class="honor-strip"><span>SELECTED HONORS</span><p>${data.honors.map(item => `<i>${esc(item)}</i>`).join("")}</p></div></section>
      <div class="dashboard-bottom">
        <section class="recent-records"><div class="module-label"><span>RECENT RECORDS</span><a class="route-link" href="?view=projects" data-route="projects">VIEW ALL →</a></div>${data.projects.slice(0, 2).map(p => `<a class="mini-record route-link" href="?view=project&id=${encodeURIComponent(p.slug)}" data-route="project"><span>${esc(p.id)}</span><strong>${esc(p.title)}</strong><i>${esc(p.status)}</i><b>↗</b></a>`).join("")}</section>
        <section class="latest-update"><div class="module-label"><span>LATEST UPDATE</span><a class="route-link" href="?view=changelog" data-route="changelog">HISTORY →</a></div><strong>${esc(latest.version)}</strong><h3>${esc(latest.title)}</h3><p>${esc(latest.changes[0][1])}</p></section>
      </div>
      </div>
    </section>`;
  }

  function renderLab() {
    const experiments = data.lab;
    return `<section class="page lab-page">${viewHeader("02 / EXPERIMENT LAB", "实验与原型", "记录正在验证的问题、快速原型和未进入正式项目档案的探索。")}
      <div class="lab-status"><span class="mono"><i class="signal"></i>LAB CHANNEL ACTIVE</span><p>这里展示过程而不是包装完成度。后续内容将从 content.js 独立维护。</p></div>
      <div class="lab-queue">${experiments.map((item, index) => `<article class="lab-entry"><span class="lab-index">0${index + 1}</span><div><small>${esc(item.status)} / ${esc(item.id)}</small><h2>${esc(item.title)}</h2><p>${esc(item.summary)}</p><blockquote><span>QUESTION</span>${esc(item.question)}</blockquote><div class="archive-tags">${item.stack.map(tag => `<span>${esc(tag)}</span>`).join("")}</div></div><span class="lab-log-state">CASE NOTE</span></article>`).join("")}</div>
      <section class="lab-intake"><span class="mono">NEW EXPERIMENT TEMPLATE</span><div><strong>验证问题</strong><strong>原型方法</strong><strong>当前发现</strong><strong>下一步</strong></div></section>
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
        <aside class="project-facts"><div><span>ROLE</span><strong>${esc(project.role)}</strong></div><div><span>CATEGORY</span><strong>${project.category === "game" ? "GAME SYSTEM" : "AI EXPERIMENT"}</strong></div><div><span>STATUS</span><strong>${esc(project.status)}</strong></div>${project.date ? `<div><span>DATE</span><strong>${esc(project.date)}</strong></div>` : ""}</aside>
        <div class="project-narrative">
          <section><span>00 / OVERVIEW</span><h2>${esc(project.summary)}</h2></section>
          ${project.demoVideo ? `<section class="project-demo"><span>DEMO / GAMEPLAY</span><h3>项目演示</h3><div class="project-video-frame"><video controls preload="metadata" playsinline aria-label="${esc(project.title)}项目演示视频"><source src="${esc(project.demoVideo)}" type="video/mp4">你的浏览器暂不支持视频播放。</video></div></section>` : ""}
          ${project.showcaseImage ? `<section class="project-showcase${project.showcaseCrop ? " project-showcase--crop" : ""}"><span>SHOWCASE / SCREENSHOT</span><h3>项目展示</h3><figure class="project-image-frame"><picture>${project.showcaseImageWebp ? `<source srcset="${esc(project.showcaseImageWebp)}" type="image/webp">` : ""}<img src="${esc(project.showcaseImage)}" alt="${esc(project.title)}项目运行界面" loading="lazy" decoding="async"></picture><figcaption>${esc(project.title)} / ${esc(project.showcaseCaption || "项目运行界面")}</figcaption></figure></section>` : ""}
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
      region.addEventListener("pointerenter", () => { const label = $("#map-location-name"); if (label) label.textContent = region.dataset.mapRegion; });
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
    const recordColor = count => Math.round(12 + Math.min(count, 10) * 5.4);
    const fixedProvinceColor = name => name === "北京市" || name === "上海市";
    const provinces = (window.SILVER_CHINA_MAP?.features || []).filter(feature => feature.properties?.name);
    const provincePaths = provinces.map(feature => { const name = feature.properties.name; const count = provinceCounts.get(name) || 0; const fixed = fixedProvinceColor(name); const explored = count > 0 || fixed; const strength = fixed ? 66 : recordColor(count); return `<path class="map-region map-province${explored ? " is-explored" : ""}"${explored ? ` style="--record-color:${strength}%"` : ""} d="${geoPath(feature.geometry, project)}" data-map-region="${esc(name)}" tabindex="-1" role="button" aria-label="${esc(name)}${explored ? "，已有足迹" : "，尚未建立足迹"}"><title>${esc(name)}</title></path>`; }).join("");
    const provinceLabels = provinces.map(feature => { const name = feature.properties.name; const points = geometryPoints(feature.geometry); const xs = points.map(point => point[0]), ys = points.map(point => point[1]); const [x, y] = project((Math.min(...xs) + Math.max(...xs)) / 2, (Math.min(...ys) + Math.max(...ys)) / 2); return `<text x="${x.toFixed(1)}" y="${y.toFixed(1)}">${esc(name.replace(/省|市|壮族自治区|回族自治区|维吾尔自治区|自治区|特别行政区/g, ""))}</text>`; }).join("");
    canvas.innerHTML = `<svg class="footprint-svg footprint-world" viewBox="35 20 1130 560" role="group" aria-label="可交互世界国家与中国省级地图" data-world-viewbox="35 20 1130 560" data-default-label="CHINA ACTIVE"><g class="country-layer">${features.map(feature => { const name = feature.properties?.name || feature.id || "Unknown"; const china = feature.id === "CHN" || name === "China"; const count = countryCounts.get(name) || 0; const explored = count > 0; const strength = recordColor(count); return `<path class="map-region country-region${china ? " country-china" : ""}${explored ? " is-explored" : ""}"${explored ? ` style="--record-color:${strength}%"` : ""} d="${geoPath(feature.geometry, project)}" data-map-region="${esc(name)}" tabindex="0" role="button" aria-label="${esc(name)}${explored ? "，已有足迹" : "，暂未探索"}"><title>${esc(name)}</title></path>`; }).join("")}</g><g class="embedded-province-layer">${provincePaths}</g><g class="province-labels embedded-province-labels" aria-hidden="true">${provinceLabels}</g></svg>`;
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
    const paths = features.map(feature => { const name = feature.properties.name; const count = provinceCounts.get(name) || 0; const fixed = name === "北京市" || name === "上海市"; const explored = count > 0 || fixed; const strength = fixed ? 66 : Math.round(12 + Math.min(count, 10) * 5.4); return `<path class="map-region map-province${explored ? " is-explored" : ""}"${explored ? ` style="--record-color:${strength}%"` : ""} d="${geoPath(feature.geometry, project)}" data-map-region="${esc(name)}" tabindex="0" role="button" aria-label="${esc(name)}${explored ? "，已有足迹" : "，尚未建立足迹"}"><title>${esc(name)}</title></path>`; }).join("");
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
        <header class="map-toolbar"><div class="map-brand"><span class="mono">03 / FOOTPRINT ATLAS</span><strong>人生足迹</strong></div><div class="map-context"><span class="mono" id="map-level">WORLD / COUNTRY INDEX</span><strong id="map-location-name">LOADING MAP DATA</strong></div><button type="button" id="map-back" hidden>← 返回世界地图</button></header>
        <div class="map-layout"><div class="map-viewport"><div class="map-axis map-axis-x">180°W <span>0°</span> 180°E</div><div class="map-axis map-axis-y">90°N <span>0°</span> 90°S</div><div id="footprint-map-canvas" class="footprint-map-canvas" aria-live="polite"><div class="map-loading"><i></i><span>LOADING GEOGRAPHIC ARCHIVE</span></div></div></div><aside class="footprint-panel" id="footprint-panel" aria-label="足迹详情"><button class="footprint-panel-close" type="button" aria-label="关闭足迹详情">×</button><div class="footprint-panel-content"></div></aside></div>
        <footer class="map-legend"><span><i class="is-active"></i>已有足迹</span><span><i></i>暂未探索 / 暂无记录</span><b>DRAG DISABLED · SELECT TO EXPLORE</b></footer>
      </section>
    </section>`;
  }

  function renderChangelog() {
    return `<section class="page changelog-page">${viewHeader("04 / LIFE CHANGELOG", `当前版本 <span>${esc(data.versions[0].version)}</span>`, "把人生阶段写成版本记录：新增了什么、修正了什么，以及下一步准备改变什么。")}
      <div class="release-layout"><aside><span class="mono">RELEASE CHANNEL</span><strong>PUBLIC<br>STABLE</strong><p>LAST UPDATED<br>${esc(data.profile.updatedAt)}</p></aside><div class="release-list">${data.versions.map((item, index) => `<article class="release${index === 0 ? " current" : ""}"><header><strong>${esc(item.version)}</strong><span>${esc(item.date)}</span><h2>${esc(item.title)}</h2><button aria-expanded="${index === 0}" data-release="${index}">${index === 0 ? "−" : "+"}</button></header><div class="release-changes"${index === 0 ? "" : " hidden"}>${item.changes.map(([type, text]) => `<p><span data-type="${esc(type)}">${esc(type)}</span>${esc(text)}</p>`).join("")}</div></article>`).join("")}<article class="release release-history"><header><strong>ARCHIVE</strong><span>LOCKED</span><h2>历史版本</h2><button type="button" aria-label="输入密码查找历史版本" data-history-lock>+</button></header></article></div></div>
    </section>`;
  }

  function renderConnect() {
    return `<section class="page connect-page"><p class="section-code mono">05 / OPEN CHANNEL</p><div class="connect-hero"><h1>把疯狂想法<br>变成可运行的系统。</h1><p>如果你正在做 AI 游戏、独立产品或任何值得快速验证的创造，欢迎联系我。</p></div><div class="contact-panel"><span class="mono">PRIMARY CHANNEL</span><a href="mailto:${esc(data.profile.email)}">${esc(data.profile.email)}</a></div><div class="external-grid">${data.socials.map((item, index) => `<a href="${esc(item.href)}" target="_blank" rel="noreferrer"><span>0${index + 1}</span><strong>${esc(item.label)}</strong><i>↗</i></a>`).join("")}</div><footer class="view-footer"><span>SILVER.Z / PERSONAL OBSERVATORY</span><span>© ${new Date().getFullYear()}</span></footer></section>`;
  }

  function render(route) {
    const renderers = { resume: renderResume, projects: renderProjects, project: () => renderProject(route.id), lab: renderLab, journey: renderJourney, changelog: renderChangelog, connect: renderConnect };
    $("#view").innerHTML = renderers[route.view]();
    document.body.dataset.view = route.view;
    $("#route-label").textContent = routeNames[route.view];
    document.title = `${routeNames[route.view]} — Silver OS`;
    $$("[data-route]").forEach(link => link.classList.toggle("active", link.dataset.route === route.view || (route.view === "project" && link.dataset.route === "projects")));
    bindDynamicEvents(route);
    requestAnimationFrame(() => $$(".page > *, .archive-card, .cap-node, .release").forEach((node, index) => { node.style.setProperty("--enter-index", Math.min(index, 10)); node.classList.add("panel-enter"); }));
  }

  function bindDynamicEvents(route) {
    if (route.view === "resume") {
      const cover = $(".resume-cover");
      if (cover && "IntersectionObserver" in window) new IntersectionObserver(([entry], observer) => { cover.classList.toggle("motion-paused", !entry.isIntersecting); if (!cover.isConnected) observer.disconnect(); }, { threshold: .05 }).observe(cover);
    }
    if (route.view === "projects") $$(".filter").forEach(button => button.addEventListener("click", () => {
      $$(".filter").forEach(item => item.classList.remove("active"));
      button.classList.add("active");
      $$(".archive-card").forEach(card => { const p = data.projects.find(item => card.href.includes(encodeURIComponent(item.slug))); card.hidden = button.dataset.filter !== "all" && p.category !== button.dataset.filter; });
    }));
    if (route.view === "journey") initFootprintMap();
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
    if (url === `${location.pathname}${location.search}`) { closeDrawer(); return; }
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const transition = $("#route-transition");
    const target = new URL(url, location.href);
    const targetRoute = new URLSearchParams(target.search).get("view") || "resume";
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
  $("#desktop-nav-toggle").addEventListener("click", () => document.body.classList.contains("desktop-nav-open") ? closeDesktopNav() : openDesktopNav());
  $("#desktop-nav-close").addEventListener("click", closeDesktopNav);
  $("#desktop-nav-backdrop").addEventListener("click", closeDesktopNav);
  $("#mobile-menu").addEventListener("click", () => { const drawer = $("#mobile-drawer"); drawer.hidden = !drawer.hidden; const open = !drawer.hidden; $("#mobile-menu").setAttribute("aria-expanded", String(open)); document.body.classList.toggle("drawer-open", open); });
  $("#mobile-more").addEventListener("click", () => { const drawer = $("#mobile-drawer"); drawer.hidden = !drawer.hidden; const open = !drawer.hidden; $("#mobile-more").setAttribute("aria-expanded", String(open)); document.body.classList.toggle("drawer-open", open); });
  addEventListener("popstate", () => { render(parseRoute()); scrollTo(0, 0); });
  addEventListener("keydown", event => { if (event.key === "Escape" && document.body.classList.contains("desktop-nav-open")) { closeDesktopNav(); $("#desktop-nav-toggle").focus(); } });
  bindRoutes();
  currentRoute = location.search;
  render(parseRoute());

  addEventListener("pointermove", event => {
    const cover = $(".resume-cover");
    if (cover && !matchMedia("(prefers-reduced-motion: reduce)").matches && innerWidth >= 900) {
      cover.style.setProperty("--hero-x", `${(event.clientX / innerWidth - .5) * -8}px`);
      cover.style.setProperty("--hero-y", `${(event.clientY / innerHeight - .5) * -5}px`);
    }
    const portrait = $(".manga-portrait img");
    if (!portrait || matchMedia("(prefers-reduced-motion: reduce)").matches || innerWidth < 900) return;
    const x = (event.clientX / innerWidth - .5) * 8;
    const y = (event.clientY / innerHeight - .5) * 6;
    portrait.style.transform = `translate3d(${x}px, ${y}px, 0)`;
  }, { passive: true });
})();
