const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
let Component;
const nodes = new Map();
const node = key => {
  if (!nodes.has(key)) nodes.set(key, {innerHTML:'',textContent:'',value:key==='#sort'?'new':'',style:{},classList:{add(){},remove(){}},setAttribute(){},addEventListener(){},querySelectorAll(){return []},getContext(){return {}},getBoundingClientRect(){return {left:0,top:0}},showModal(){this.open=true},close(){this.open=false}});
  return nodes.get(key);
};
const root={querySelector:node,querySelectorAll:()=>[]};
const sandbox={customElements:{define(_,C){Component=C}},HTMLElement:class {attachShadow(){this.shadowRoot=root}},window:{SILVER_DATA:{thoughts:[]}},document:{hidden:false},matchMedia:()=>({matches:false,addEventListener(){},removeEventListener(){}}),ResizeObserver:class {observe(){}disconnect(){}},IntersectionObserver:class {observe(){}disconnect(){}},requestAnimationFrame:()=>1,cancelAnimationFrame(){},devicePixelRatio:1};
vm.runInNewContext(fs.readFileSync('starfield.js','utf8'),sandbox);
let component=new Component();component.connectedCallback();assert.match(node('#count').textContent,/0 \/ 0/);component.disconnectedCallback();
sandbox.window.SILVER_DATA.thoughts=[{title:'<img src=x onerror=alert(1)>',category:'<script>',body:'hello',_visibility:'published'},{title:'private',_visibility:'private'},{title:'draft',_visibility:'draft'}];
component=new Component();component.connectedCallback();assert.match(node('#count').textContent,/1 \/ 1/);assert(!node('#list').innerHTML.includes('<img'));assert(node('#list').innerHTML.includes('&lt;img'));assert(!node('.filters').innerHTML.includes('<script>'));
node('#search').value='unmatched';node('#search').oninput();assert.match(node('#count').textContent,/0 \/ 1/);component.disconnectedCallback();
console.log('PASS: empty state, public-only records, escaped content, search, lifecycle cleanup');
