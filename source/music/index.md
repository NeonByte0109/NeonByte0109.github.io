---
title: 音乐
layout: page
top_img: false
aside: false
---
<style>
.plog-music-head { text-align: center; padding: 18px 0 4px; }
.plog-player-card { margin-top: 24px; padding: 24px; }
</style>

<div class="plog-wrap plog-music">
<header class="plog-music-head plog-fade">
<h1 class="plog-title">音乐</h1>
<p class="plog-sub">戴上耳机，享受旋律</p>
</header>
<div class="plog-card plog-player-card plog-fade-1">
<div id="music-player"></div>
</div>
</div>

<script>
(function () {
  if (!window.PlogPlayer) return;
  new PlogPlayer({ el: '#music-player', mode: 'full', songs: window.PlogSongs });
})();
</script>
