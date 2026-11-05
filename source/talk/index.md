---
title: 说说
layout: page
top_img: false
aside: false
---
<style>
.plog-talk-head { text-align: center; padding: 18px 0 4px; }
.plog-talk-tip {
  margin-top: 18px;
  text-align: center;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.7);
  text-shadow: 0 1px 6px rgba(0, 0, 0, 0.45);
}
[data-theme="light"] .plog-talk-tip { color: rgba(55, 65, 81, 0.7); text-shadow: none; }
</style>

<div class="plog-wrap plog-talk">
<header class="plog-talk-head plog-fade">
<h1 class="plog-title">说说</h1>
<p class="plog-sub">琐碎日常 · 片刻心情</p>
</header>
{% plog_shuoshuo 12 %}
</div>

<div class="plog-lightbox" id="plog-lightbox">
<button class="plog-lightbox-close" id="plog-lightbox-close" type="button" aria-label="关闭"><i class="fas fa-times"></i></button>
<img id="plog-lightbox-img" src="" alt="说说配图">
<div class="plog-lightbox-caption" id="plog-lightbox-cap"></div>
</div>

<script>
(function () {
  var lb = document.getElementById('plog-lightbox');
  var img = document.getElementById('plog-lightbox-img');
  var cap = document.getElementById('plog-lightbox-cap');
  function open(note) {
    var src = note.getAttribute('data-src');
    if (!src) return;
    img.src = src;
    cap.textContent = note.getAttribute('data-cap') || '';
    lb.classList.add('show');
    document.body.style.overflow = 'hidden';
  }
  function close() {
    lb.classList.remove('show');
    document.body.style.overflow = '';
  }
  document.addEventListener('click', function (e) {
    var t = e.target.closest('.plog-note-img img');
    if (t) open(t);
  });
  document.getElementById('plog-lightbox-close').addEventListener('click', close);
  lb.addEventListener('click', function (e) {
    if (e.target === lb) close();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') close();
  });
})();
</script>
