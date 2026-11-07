/* Life is recorded, never forecast. Values below are drawing coordinates, not scores. */
(() => {
 const events = [
  [0,'2005.02.06','故事开始','出生在小康家庭，童年平稳。','平稳的成长起点','出生','没有明显波动'],
  [26,'2011 · 6 岁','进入小学','开始小学生活，家庭条件逐步改善。','进入新的学习阶段','进入小学','整体平稳，温和向上'],
  [50,'2017 · 12 岁','分校上岸','参加私立学校考试，调剂到分校。','开始适应新的学习环境','私校考试上岸','一次小成功'],
  [55,'2018 · 13 岁','从 600 到前 150','入学时约 600 / 1000，逐步进入学校前 150。','学习表现持续提升','排名进入前 150','持续向上'],
  [58,'2019 · 14 岁','进入快班','成功分入快班。','进入新的学习环境','分入快班','延续上升趋势'],
  [61,'2020.06','中考高点','中考 685 / 750，漳州市芗城区第 151 名，随后进入新的私立学校。','学习积累得到验证','中考区第 151 名','轻松应考，达到阶段高位'],
  [66,'2021 · 16 岁','高位保持','多次数学位列年段前 150，总分表现保持。','学习能力继续巩固','多次数学年段前 150','高位横盘'],
  [70,'2022 · 17 岁','慢慢向上','整体状态逐步提升。','稳步积累','这一阶段未单独记录成就','慢慢向上'],
  [72,'高三 · 2022—2023','三次班级第一','高三期间共取得三次班级第一，状态持续上升。','学习表现进一步提升','三次班级第一','不断上涨，接近学业高点'],
  [73,'2023.06','一次落差','高考福建省约 2 万名，结果未达预期，进入普通一本院校。','开始面对预期与结果的差距','进入大学','低落约一周，此后低位震荡'],
  [79,'2024 · 19 岁','在比赛中回升','参加挑战杯和科创比赛，获得多个省级奖项。','积累项目与竞赛经验','多个省级奖项','温和回升'],
  [83,'2025 · 20 岁','寻找自己的方向','思考未来，尝试准备考研，也尝试游戏方向。','探索适合自己的路径','尝试不同方向','迷茫与探索，横盘震荡'],
  [85,'2026.05','走进真实的工作','成功找到实习，开始新的职业阶段。','进入实际工作环境','获得实习机会','方向逐渐清晰，状态上行'],
  [86,'2026.09.18','一次投资高点','股票资金翻倍。','记录投资经历','股票资金翻倍','整体状态继续上探'],
  [87,'2026.10.20','经历回撤','股票资金随后腰斩，对个人状态造成中等影响。','经历投资波动','未记录新的成就','中等程度回撤'],
  [87,'2026.11.01','新的阶段高点','获得转正名额（HC）。当前整体状态略高于过去的学业高点。','职业道路继续向前','获得转正名额','从回撤中恢复，略高于过去高点']
 ];
 // Undated milestones are placed approximately within their year, not asserted as exact dates.
 const anchors=[[0,22],[23,22],[26,29],[47,30],[49,29],[50,34],[51,35],[55,48],[58,54],[61,72],[67,73],[71,79],[72,84],[73,48],[75,49],[79,66],[80,64],[81,66],[82,63],[83,65],[84,67],[85,78],[86,94],[87,99]];
 // Seeded variation keeps quiet years natural and stable across reloads.
 function variation(i,salt=0){let x=Math.imul(i+1+salt,374761393);x=Math.imul(x^(x>>>13),1274126177);return ((x^(x>>>16))>>>0)/4294967296;}
 function series(){
  const points=[];
  for(let i=0;i<88;i++){
   let a=anchors[0],b=anchors.at(-1);
   for(let n=1;n<anchors.length;n++)if(anchors[n][0]>=i){a=anchors[n-1];b=anchors[n];break;}
   const t=b[0]===a[0]?0:(i-a[0])/(b[0]-a[0]);
   const base=a[1]+(b[1]-a[1])*t,anchored=anchors.some(p=>p[0]===i);
   const open=i?points[i-1].close:21;
   let close=base+(anchored?0:i<48?(variation(i)-.5)*5.4:Math.sin(i*2.1)*1.2);
   if(i<48&&!anchored&&Math.abs(close-open)<.85){close=base+(open<=base?1:-1)*(1.1+variation(i,31)*1.5);}
   const upper=i<48?.25+variation(i,71)*1.65:2;
   const lower=i<48?.2+variation(i,137)*1.8:i===73?3:2;
   points.push({i,open,close,high:Math.max(open,close)+upper,low:i===87?65:Math.min(open,close)-lower});
  }
  return points;
 }

 const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 class LifeChart extends HTMLElement{
 connectedCallback(){
  const points=series();
  // Pan the fixed-scale viewport upward to fit the recorded high; lower history may leave the bottom.
  const ceiling=Math.max(...points.map(p=>p.high));
  const y=v=>30+(ceiling-v)*4.1;
  this.innerHTML=`<section class="life-hero" aria-labelledby="life-name"><div class="life-stage"><div class="life-heading"><div><span class="life-eyebrow">A LIFE, IN QUARTERS</span><p class="life-tagline">人生，自有起伏。</p></div><p>成长、成就，以及真实的感受。<br>从 2005 年开始，走到此刻。</p></div><div class="life-bottom"><div class="life-detail" aria-live="polite"></div><aside class="life-note"><span>一季一根 · 左右拖动</span><p>基于个人回忆绘制，不代表客观评分。<br>空白季度为衔接走势；无精确日期的事件按年龄归档。<br>记录截至 2026.11.07，未来尚未绘制。</p></aside></div><div class="life-chart-head"><span>MY LIFE / 2005 — NOW</span><span class="life-live">2026 Q4 · 进行中</span></div><div class="life-scroll" tabindex="0" role="region" aria-label="人生季度 K 线，可左右拖动或使用方向键"><div class="life-track">${points.map(p=>{const es=events.filter(e=>e[0]===p.i),year=2005+Math.floor(p.i/4),q=p.i%4+1;return `<button class="life-candle ${p.close>=p.open?'up':'down'} ${es.length?'has-event':''} ${p.i===87?'is-current':''}" data-index="${p.i}" aria-label="${year} 年第 ${q} 季度${es.length?'：'+es.map(e=>e[2]).join('、'):'：过渡走势'}" aria-pressed="false"><svg viewBox="0 0 44 350" preserveAspectRatio="none" aria-hidden="true"><line x1="22" x2="22" y1="${y(p.high)}" y2="${y(p.low)}"/><rect x="14" y="${y(Math.max(p.open,p.close))}" width="16" height="${Math.max(2,Math.abs(p.close-p.open)*4.1)}" rx="1"/>${es.length?`<circle cx="22" cy="${y(p.high)-12}" r="3"/>`:''}</svg><span class="life-quarter">Q${q}</span>${q===1?`<span class="life-year">${year}</span>`:''}</button>`}).join('')}<div class="life-unwritten"><span>故事仍在继续。<br><small>THE REST IS UNWRITTEN</small></span></div></div></div><div class="life-navigation"><button data-jump="start">← 出生 / 2005</button><input class="life-range" type="range" min="0" max="1000" value="1000" aria-label="移动人生时间轴"><button data-jump="now">回到现在 →</button></div><a class="life-explore" href="#work">Explore my work ↓</a><div class="life-signature"><h1 id="life-name">Silver.Z</h1><p>我设计由 AI 驱动的游戏机制，也在设计自己的成长系统。</p></div></div></section>`;
  const scroll=this.querySelector('.life-scroll'),range=this.querySelector('.life-range');
  const show=i=>{this.querySelectorAll('.life-candle').forEach(b=>b.setAttribute('aria-pressed',String(+b.dataset.index===i)));const es=events.filter(e=>e[0]===i),year=2005+Math.floor(i/4),q=i%4+1;this.querySelector('.life-detail').innerHTML=es.length?`<span class="life-detail-date">${year} / Q${q}${i===87?' · 截至 11 月 7 日':''}</span>${es.map(e=>`<article><h2>${escape(e[2])}<small>${escape(e[1])}</small></h2><p>${escape(e[3])}</p><dl>${['成长','成就','体感'].map((k,n)=>`<div><dt>${k}</dt><dd>${escape(e[n+4])}</dd></div>`).join('')}</dl></article>`).join('')}`:`<span class="life-detail-date">${year} / Q${q}</span><h2>平常的日子，也构成人生。</h2><p>这个季度没有单独的事件记录，K 线是依据相邻阶段绘制的过渡走势。</p>`;};
  const candles=[...this.querySelectorAll('.life-candle')];
  let displayedCeiling=ceiling,targetCeiling=ceiling;
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const paint=()=>{
   const py=v=>30+(displayedCeiling-v)*4.1;
   candles.forEach((button,i)=>{const p=points[i],line=button.querySelector('line'),rect=button.querySelector('rect'),dot=button.querySelector('circle');line.setAttribute('y1',py(p.high));line.setAttribute('y2',py(p.low));rect.setAttribute('y',py(Math.max(p.open,p.close)));if(dot)dot.setAttribute('cy',py(p.high)-12);});
  };
  const animate=()=>{const delta=targetCeiling-displayedCeiling;displayedCeiling=reduced||Math.abs(delta)<.03?targetCeiling:displayedCeiling+delta*.18;paint();this.panFrame=displayedCeiling===targetCeiling?null:requestAnimationFrame(animate);};
  const reframe=()=>{
   const width=candles[0].offsetWidth,left=scroll.scrollLeft,right=left+scroll.clientWidth;
   const visible=points.filter((p,i)=>{const x=22+i*width;return x+width*.82>left&&x+width*.18<right;});
   if(!visible.length)return;
   const high=Math.max(...visible.map(p=>p.high)),low=Math.min(...visible.map(p=>p.low));
   // Pan only: keep a fixed vertical scale, center quiet ranges and leave headroom at peaks.
   targetCeiling=Math.max(high,(high+low)/2+35);
   if(this.panFrame==null)this.panFrame=requestAnimationFrame(animate);
  };
  this.resizeObserver=new ResizeObserver(reframe);this.resizeObserver.observe(scroll);
  let drag=null,moved=false;
  scroll.addEventListener('pointerdown',e=>{if(e.pointerType==='touch')return;drag={x:e.clientX,left:scroll.scrollLeft};moved=false;});
  scroll.addEventListener('pointermove',e=>{if(!drag)return;if(Math.abs(e.clientX-drag.x)>5){moved=true;scroll.setPointerCapture(e.pointerId);scroll.scrollLeft=drag.left-(e.clientX-drag.x);}});
  const stop=()=>drag=null;scroll.addEventListener('pointerup',stop);scroll.addEventListener('pointercancel',stop);
  scroll.addEventListener('click',e=>{const b=e.target.closest('.life-candle');if(b&&!moved)show(+b.dataset.index);moved=false;});
  scroll.addEventListener('keydown',e=>{if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();scroll.scrollLeft+=e.key==='ArrowRight'?176:-176;}if(e.key==='Home'){e.preventDefault();scroll.scrollLeft=0;}if(e.key==='End'){e.preventDefault();scroll.scrollLeft=scroll.scrollWidth;}});
  scroll.addEventListener('scroll',()=>{range.value=1000*scroll.scrollLeft/Math.max(1,scroll.scrollWidth-scroll.clientWidth);reframe();},{passive:true});
  range.addEventListener('input',()=>scroll.scrollLeft=(scroll.scrollWidth-scroll.clientWidth)*range.value/1000);
  this.querySelectorAll('[data-jump]').forEach(b=>b.addEventListener('click',()=>{scroll.scrollLeft=b.dataset.jump==='start'?0:scroll.scrollWidth;show(b.dataset.jump==='start'?0:87);}));
  show(87);this.frame=requestAnimationFrame(()=>{scroll.scrollLeft=scroll.scrollWidth;reframe();});
 }
 disconnectedCallback(){cancelAnimationFrame(this.frame);cancelAnimationFrame(this.panFrame);this.resizeObserver?.disconnect();}
 }
 customElements.define('silver-life-chart',LifeChart);
})();
