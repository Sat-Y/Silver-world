(() => {
const esc = (value = "") => String(value).replace(/[&<>'"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"}[c]));
window.renderSilverProject = function(project, fromArchive = false) {
    return `<article class="page project-page">
      <a class="back-link route-link mono" href="${fromArchive ? '?view=projects' : '?view=resume#work'}" data-route="${fromArchive ? 'projects' : 'resume'}">${fromArchive ? '← BACK TO PROJECTS' : '← BACK TO WORK'}</a>
      <header class="project-hero"><div><p class="section-code mono">${esc(project.id)} / ${esc(project.status)}</p><h1>${esc(project.title)}</h1><p class="project-english mono">${esc(project.english)}</p></div></header>
      <div class="project-detail-grid">
        <aside class="project-facts"><div><span>ROLE</span><strong>${esc(project.role)}</strong></div><div><span>CATEGORY</span><strong>${project.category === "game" ? "GAME SYSTEM" : project.category === "prototype" ? "EXPERIMENT / PROTOTYPE" : "AI PROJECT"}</strong></div><div><span>STATUS</span><strong>${esc(project.status)}</strong></div>${project.date ? `<div><span>DATE</span><strong>${esc(project.date)}</strong></div>` : ""}</aside>
        <div class="project-narrative">
          <section><span>00 / OVERVIEW</span><h2>${esc(project.summary)}</h2></section>
          ${project.demoVideo ? `<section class="project-demo"><span>DEMO / GAMEPLAY</span><h3>项目演示</h3><div class="project-video-frame"><video controls preload="metadata" playsinline${project.demoPoster ? ` poster="${esc(project.demoPoster)}"` : ""} aria-label="${esc(project.title)}项目演示视频"><source src="${esc(project.demoVideo)}" type="video/mp4">你的浏览器暂不支持视频播放。</video></div></section>` : ""}
          ${project.showcaseImage ? `<section class="project-showcase${project.showcaseCrop ? " project-showcase--crop" : ""}"><span>SHOWCASE / SCREENSHOT</span><h3>项目展示</h3><figure class="project-image-frame"><picture>${project.showcaseImageWebp ? `<source srcset="${esc(project.showcaseImageWebp)}" type="image/webp">` : ""}<img src="${esc(project.showcaseImage)}" alt="${esc(project.title)}项目运行界面" loading="lazy" decoding="async"></picture><figcaption>${esc(project.title)} / ${esc(project.showcaseCaption || "项目运行界面")}</figcaption></figure></section>` : ""}
          <section><span>01 / PROBLEM</span><h3>这个项目要解决什么？</h3><p>${esc(project.problem)}</p></section>
          <section><span>02 / SYSTEM</span><h3>我的系统方案</h3><p>${esc(project.system)}</p><ul>${project.evidence.map(item => `<li>${esc(item)}</li>`).join("")}</ul></section>
          <section><span>03 / OUTCOME</span><h3>当前结果与下一步</h3><p>${esc(project.outcome)}</p></section>
        </div>
      </div>
    </article>`;
  };

})();
