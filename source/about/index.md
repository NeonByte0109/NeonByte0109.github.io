---
title: 关于我
layout: page
top_img: false
aside: false
---
<style>
.plog-about-head { text-align: center; padding: 18px 0 4px; }
.plog-about-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-top: 26px;
}
.plog-about-grid .full { grid-column: 1 / -1; }
.plog-about-card { padding: 22px; }
.plog-about-profile { text-align: center; }
.plog-about-avatar {
  width: 92px;
  height: 92px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid rgba(255, 255, 255, 0.85);
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.3);
}
.plog-about-name { margin: 12px 0 2px; font-size: 21px; font-weight: 700; color: #1a1a1a; }
[data-theme="dark"] .plog-about-name { color: #ffffff; }
.plog-about-desc { font-size: 13.5px; opacity: 0.7; margin: 4px 0 14px; }
.plog-about-btn-row {
  display: flex;
  justify-content: center;
  gap: 10px;
  flex-wrap: wrap;
  margin-top: 8px;
}
.plog-about-text { font-size: 14px; line-height: 1.9; opacity: 0.85; margin: 0; }
@media (max-width: 768px) {
  .plog-about-grid { grid-template-columns: 1fr; }
}
</style>

<div class="plog-wrap plog-about">
<header class="plog-about-head plog-fade">
<h1 class="plog-title">关于我</h1>
<p class="plog-sub">你好，很高兴认识你</p>
</header>
<div class="plog-about-grid">
<section class="plog-card plog-about-card plog-about-profile plog-fade-1">
<img class="plog-about-avatar" src="/img/qianzhu.jpg" alt="头像">
<h2 class="plog-about-name">Neon</h2>
<p class="plog-about-desc">软件技术学习者 | 编程爱好者</p>
<div class="plog-about-btn-row">
<a class="plog-btn" href="https://github.com/NeonByte0109" target="_blank" rel="noopener"><i class="fab fa-github"></i> GitHub</a>
<a class="plog-btn plog-btn-ghost" href="/blog">我的文章</a>
</div>
</section>
<section class="plog-card plog-about-card plog-fade-2">
<h2 class="plog-card-title"><i class="fas fa-code"></i> 技能栈</h2>
<div>
<span class="plog-chip">JavaScript</span>
<span class="plog-chip">Python</span>
<span class="plog-chip">C++</span>
<span class="plog-chip">HTML / CSS</span>
<span class="plog-chip">Hexo</span>
<span class="plog-chip">Git</span>
</div>
</section>
<section class="plog-card plog-about-card full plog-fade-3">
<h2 class="plog-card-title"><i class="fas fa-clock"></i> 时间线</h2>
<ul class="plog-timeline">
<li>
<div class="plog-timeline-time">2026 · 10</div>
<div class="plog-timeline-title">个人博客上线</div>
<p class="plog-timeline-desc">基于 Hexo + Butterfly 搭建个人博客，开始记录学习与生活。</p>
</li>
<li>
<div class="plog-timeline-time">2026 · 06</div>
<div class="plog-timeline-title">开始学习前端开发</div>
<p class="plog-timeline-desc">HTML、CSS、JavaScript 入门，动手做一些小项目。</p>
</li>
<li>
<div class="plog-timeline-time">更早</div>
<div class="plog-timeline-title">与编程结缘</div>
<p class="plog-timeline-desc">从第一行 Hello World 开始，保持热爱，持续学习。</p>
</li>
</ul>
</section>
<section class="plog-card plog-about-card full plog-fade-4">
<h2 class="plog-card-title"><i class="fas fa-heart"></i> 关于本站</h2>
<p class="plog-about-text">本站基于 <b>Hexo</b> + <b>Butterfly</b> 主题搭建，所有内容手写维护。这里会记录我的编程学习笔记、项目心得和生活随想，希望你能在这里找到有用的东西。想交流的话，欢迎通过 GitHub 联系我。</p>
</section>
</div>
</div>
