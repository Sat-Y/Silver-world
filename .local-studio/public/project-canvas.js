function mountProjectCanvas() {
  const frame = document.querySelector('#project-canvas');
  const project = state.data.projects[state.selectedProject];
  if (!frame || !project) return;
  const projectIndex = state.selectedProject;
  frame.addEventListener('load', () => {
    const doc = frame.contentDocument;
    const bind = (selector, key, label, index) => {
      const node = doc.querySelector(selector);
      if (!node) return;
      node.contentEditable = 'plaintext-only';
      node.setAttribute('role', 'textbox');
      node.setAttribute('aria-label', label);
      node.setAttribute('title', '点击修改' + label);
      node.dataset.placeholder = label;
      node.addEventListener('input', () => {
        const value = node.innerText.replace(/\r/g, '');
        const path = ['projects', projectIndex, key];
        if (index !== undefined) path.push(index);
        setAt(path, value);
        const input = document.querySelector(`[data-path="${pathAttr(path)}"]`);
        if (input) input.value = value;
        if (key === 'title') {
          const title = document.querySelector('.record-item.is-active strong');
          if (title) title.textContent = value || '未命名项目';
        }
        markDirty();
      });
      node.addEventListener('keydown', event => {
        if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 's') {
          event.preventDefault(); saveDraft(false);
        }
      });
    };
    bind('.project-hero h1', 'title', '中文名称');
    bind('.project-english', 'english', '英文名称');
    bind('.project-facts > div:nth-child(1) strong', 'role', '个人职责');
    bind('.project-facts > div:nth-child(3) strong', 'status', '项目状态');
    bind('.project-facts > div:nth-child(4) strong', 'date', '项目日期');
    bind('.project-narrative > section:first-child h2', 'summary', '项目摘要');
    const sections = [...doc.querySelectorAll('.project-narrative > section')];
    for (const [prefix, key, label] of [['01 /','problem','问题与目标'],['02 /','system','系统方案'],['03 /','outcome','结果与复盘']]) {
      const section = sections.find(n => n.querySelector('span')?.textContent.startsWith(prefix));
      if (section) { section.dataset.editSection = key; bind(`[data-edit-section="${key}"] > p`,key,label); }
    }
    doc.querySelectorAll('.project-narrative li').forEach((node,index) => {
      node.dataset.evidence = index; bind(`[data-evidence="${index}"]`,'evidence','能力证据',index);
    });
    doc.addEventListener('click', event => { if(event.target.closest('a')) event.preventDefault(); });
  }, { once: true });
  frame.srcdoc = `<!doctype html><html lang="zh-CN" data-theme="light"><head><meta charset="utf-8"><base href="/site/"><meta name="viewport" content="width=device-width,initial-scale=1"><link rel="stylesheet" href="styles.css?v=20261019-12"><link rel="stylesheet" href="portfolio.css?v=20261107-25"><style>
  body{margin:0;overflow-x:hidden} .project-page{padding:32px!important;min-height:0}.back-link{display:none!important}
  [contenteditable]{cursor:text;white-space:pre-wrap;border-radius:3px;outline:1px dashed transparent;outline-offset:5px;min-height:1em}
  [contenteditable]:hover{outline-color:#b2c3ba}[contenteditable]:focus{outline:2px solid #739b88;background:#f1f6f2}
  [contenteditable]:empty:before{content:attr(data-placeholder);color:#8b938f}
  @media(max-width:600px){.project-page{padding:24px 18px!important}}
  </style></head><body class="os-body" data-view="project">${window.renderSilverProject(project,true)}</body></html>`;
}
// Settings edits also refresh the real page layout after the field loses focus.
document.addEventListener('change', event => {
  if (event.target.closest('.project-settings') && event.target.dataset.path) mountProjectCanvas();
});
