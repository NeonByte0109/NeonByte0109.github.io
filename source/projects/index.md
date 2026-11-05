---
title: 项目
layout: page
top_img: false
aside: false
---
<style>
.plog-projects-head { text-align: center; padding: 18px 0 4px; }
.plog-projects-tip {
  margin-top: 16px;
  text-align: center;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.7);
  text-shadow: 0 1px 6px rgba(0, 0, 0, 0.45);
}
[data-theme="light"] .plog-projects-tip { color: rgba(55, 65, 81, 0.7); text-shadow: none; }
</style>

<div class="plog-wrap plog-projects-page">
<header class="plog-projects-head plog-fade">
<h1 class="plog-title">项目</h1>
<p class="plog-sub">做过的一些小作品</p>
</header>
<div class="plog-projects-search plog-fade-1">
<i class="fas fa-magnifying-glass"></i>
<input id="plog-projects-input" type="text" placeholder="搜索项目…" autocomplete="off">
</div>
{% plog_projects %}
</div>
