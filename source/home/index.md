---
title: 主页
layout: page
top_img: false
aside: false
---
<div class="plog-wrap plog-home">
<section class="plog-card plog-profile plog-fade">
<div class="plog-profile-top">
<div class="plog-profile-info">
<h1 class="plog-name">Neon</h1>
<p class="plog-sign">软件技术 | 编程学习记录</p>
<p class="plog-bio">欢迎来到我的个人博客，这里记录我的学习、思考与生活点滴。</p>
<div class="plog-search">
<i class="fas fa-magnifying-glass"></i>
<input id="plog-search-input" type="text" placeholder="搜索文章…" autocomplete="off">
</div>
</div>
<div class="plog-profile-avatar">
<img src="/img/qianzhu.jpg" alt="Neon 的头像">
</div>
</div>
<div class="plog-profile-foot">
<div class="plog-profile-stats">
{% plog_site_stats %}
</div>
<nav class="plog-quick-nav">
<a class="plog-quick-item" href="/blog">
<span class="plog-quick-icon"><i class="fas fa-book-open"></i></span>
<span>文章</span>
</a>
<a class="plog-quick-item" href="/photo">
<span class="plog-quick-icon"><i class="fas fa-images"></i></span>
<span>相册</span>
</a>
<a class="plog-quick-item" href="/music">
<span class="plog-quick-icon"><i class="fas fa-music"></i></span>
<span>音乐</span>
</a>
<a class="plog-quick-item" href="/links">
<span class="plog-quick-icon"><i class="fas fa-link"></i></span>
<span>友链</span>
</a>
<a class="plog-quick-item" href="/about">
<span class="plog-quick-icon"><i class="fas fa-user"></i></span>
<span>关于</span>
</a>
</nav>
</div>
</section>
<div class="plog-home-grid plog-fade-2">
<section class="plog-card plog-section-card">
<h2 class="plog-card-title"><i class="fas fa-images"></i> 相册</h2>
{% plog_photo_preview 6 %}
</section>
<section class="plog-card plog-section-card">
<h2 class="plog-card-title"><i class="fas fa-music"></i> 音乐</h2>
<div id="home-player"></div>
</section>
</div>
<div class="plog-home-grid plog-home-grid-alt plog-fade-3">
<section class="plog-card plog-section-card plog-latest-card">
<h2 class="plog-card-title"><i class="fas fa-newspaper"></i> 最新文章</h2>
{% plog_latest 3 %}
</section>
<section class="plog-card plog-section-card">
<h2 class="plog-card-title"><i class="fas fa-note-sticky"></i> 最新说说</h2>
{% plog_shuoshuo 4 %}
<a class="plog-more" href="/talk">全部说说 <i class="fas fa-chevron-right"></i></a>
</section>
</div>
<div class="plog-home-actions plog-fade-4">
<a class="plog-btn" href="https://github.com/NeonByte0109" target="_blank" rel="noopener"><i class="fab fa-github"></i> GitHub</a>
<a class="plog-btn plog-btn-ghost" href="/about"><i class="fas fa-user"></i> 关于我</a>
</div>
{% plog_search_data %}
</div>

<script>
(function () {
  if (!window.PlogPlayer) return;
  new PlogPlayer({ el: '#home-player', mode: 'mini', songs: window.PlogSongs });
})();
</script>
