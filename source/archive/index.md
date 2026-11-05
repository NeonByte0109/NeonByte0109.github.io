---
title: 归档
layout: page
top_img: false
aside: false
---
<style>
.plog-archive-head { text-align: center; padding: 18px 0 6px; }
.plog-archive-tip {
  margin-top: 18px;
  text-align: center;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.7);
  text-shadow: 0 1px 6px rgba(0, 0, 0, 0.45);
}
[data-theme="light"] .plog-archive-tip { color: rgba(55, 65, 81, 0.7); text-shadow: none; }
</style>

<div class="plog-wrap plog-archive">
<header class="plog-archive-head plog-fade">
<h1 class="plog-title">时光河流</h1>
<p class="plog-sub">沿着时间，回溯每一篇记录</p>
</header>
<div class="plog-fade-1">
{% plog_archive %}
</div>
</div>
