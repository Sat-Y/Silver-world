---
title: "vue前端标签的相关知识"
published: 2025-09-28T22:17:33.9966248
draft: false
category: "Study"
tags: ["Vue"]
description: |
   完成后的复盘 首页 进入网站先看我个人签名的加载动画 然后看到 涉及到的相关不懂的知识 1. HTML元素的显示类型差异 - < span是内联元素（inline） \t特点：不会独占一行，宽度由内容决定，与其他内联元素（如 <img ）在同一行显示 \t适用场景：包裹少量文本或行内元素，用于局部样式...
image: ""
lang: ""
pinned: false
author: ""
sourceLink: ""
licenseName: ""
licenseUrl: ""
encrypted: false
password: ""
---

<h2>完成后的复盘</h2>
<p>首页
进入网站先看我个人签名的加载动画
然后看到</p>
<p>涉及到的相关不懂的知识</p>
<ol>
<li>HTML元素的显示类型差异</li>
</ol>
<ul>
<li>
<p>&lt;&gt; span是内联元素（inline）
特点：不会独占一行，宽度由内容决定，与其他内联元素（如 <img> ）在同一行显示
适用场景：包裹少量文本或行内元素，用于局部样式控制</p>
</li>
<li>
<p>&lt;&gt; p是块级元素（block）
特点：默认独占一整行，宽度默认100%父容器，会强制换行
适用场景：段落文本，会在前后自动添加换行</p>
</li>
</ul>
<ol start="2">
<li>为什么 &lt;&gt; p标签会出现在图标下方？</li>
</ol>
<pre><code>&lt;!-- 错误示例：&lt;p&gt;会导致文字换行到图片下
方 --&gt;
&lt;img src=&quot;logo.png&quot; 
class=&quot;logo-img&quot;&gt;
&lt;p&gt;zyh‘s world&lt;/p&gt;
</code></pre>
<ul>
<li>因为块级元素会独占一行，所以 &lt;&gt; p 会被强制显示在图片的下一行</li>
<li>内联元素 &lt;&gt;span 则会与图片保持在同一行：</li>
</ul>
<pre><code>&lt;!-- 正确示例：图片和文字在同一行 --&gt;
&lt;img src=&quot;logo.png&quot; 
class=&quot;logo-img&quot;&gt;
&lt;span class=&quot;logo-text&quot;&gt;zyh‘s 
world&lt;/span&gt;
</code></pre>
<h3>二、相关核心知识点 1. HTML元素分类</h3>
<p>类型 特点 常见元素 内联元素 不独占一行，宽度由内容决定 &lt;&gt;span , &lt;&gt; a, <img> , &lt;&gt; strong块级元素 独占一行，宽度默认100% &lt;&gt; p, &lt;&gt; div, &lt;&gt;h1-&lt;&gt;h6 , &lt;&gt;ul , &lt;&gt;li 内联块元素 不独占一行，但可设置宽高 &lt;&gt;input , &lt;&gt;button , &lt;&gt;img</p>
<p>CSS display 属性（控制元素显示类型）</p>
<ul>
<li>display: inline ：转为内联元素（无法设置宽高）</li>
<li>display: block ：转为块级元素（可设置宽高和 margins/paddings）</li>
<li>display: inline-block ：内联块元素（兼具两者特性，常用作图标+文字组合）</li>
<li>display: flex ：弹性布局（现代布局首选，可轻松实现对齐） 3. 垂直对齐（ vertical-align ）</li>
<li>用于内联元素或表格单元格的垂直对齐</li>
<li>常用值： middle （居中对齐）、 top （顶部对齐）、 bottom （底部对齐）</li>
<li>示例（确保图片和文字居中对齐）：</li>
</ul>
<pre><code>.logo-img { vertical-align: 
middle; }
.logo-text { vertical-align: 
middle; }
``` 4. 实战建议：图片+文字组合的最佳实践
</code></pre>
<!-- 推荐：使用 flex 布局精确控制对齐 -->
<p>这里的<strong>div</strong>是要放到&lt;&gt;里面的</p>
<pre><code>&lt;class=&quot;logo-container&quot;&gt;**div**
  &lt; src=&quot;logo.png&quot; class=&quot;logo-img&quot;&gt;**img**
  &lt; class=&quot;logo-text&quot;&gt;zyh‘s **span**
  world&lt;&gt; **/span**
&lt;&gt; **/div**

.logo-container {
  display: flex;       /* 启用弹性布
  局 */
  align-items: center; /* 垂直居中对
  齐 */
  gap: 8px;            /* 图片和文字
  间距 */
}
</code></pre>
<h3>三、总结</h3>
<ul>
<li>核心问题 ：块级元素（如 &lt;&gt;p ）会强制换行，内联元素（如 &lt;&gt;span ）则保持同行</li>
<li>解决方案 ：使用内联元素或内联块元素，配合 vertical-align 或Flex布局控制对齐</li>
<li>最佳实践 ：Flex布局（ display: flex ）是现代网页中实现对齐的首选方案，灵活且兼容性好</li>
</ul>
