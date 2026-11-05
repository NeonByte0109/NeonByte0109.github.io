---
title: 相册
layout: page
top_img: false
aside: false
---
<style>
.plog-photo-head { text-align: center; padding: 18px 0 4px; }
.plog-photo-tip {
  margin-top: 16px;
  text-align: center;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.8);
  text-shadow: 0 1px 6px rgba(0, 0, 0, 0.45);
}
.plog-photo-tip a { color: #ffffff; text-decoration: underline; }
</style>

<div class="plog-wrap plog-photos">
<header class="plog-photo-head plog-fade">
<h1 class="plog-title">相册</h1>
<p class="plog-sub">光影之间，留住美好瞬间</p>
</header>
{% plog_gallery %}
</div>

<div class="plog-lightbox" id="plog-lightbox">
<button class="plog-lightbox-close" id="plog-lightbox-close" type="button" aria-label="关闭"><i class="fas fa-times"></i></button>
<img id="plog-lightbox-img" src="" alt="照片预览">
<video id="plog-lightbox-video" controls playsinline></video>
<div class="plog-lightbox-caption" id="plog-lightbox-cap"></div>
</div>

<script>
(function () {
  var lb = document.getElementById('plog-lightbox');
  var img = document.getElementById('plog-lightbox-img');
  var vid = document.getElementById('plog-lightbox-video');
  var cap = document.getElementById('plog-lightbox-cap');
  var gallery = document.getElementById('plog-gallery');

  function open(item) {
    var isVideo = item.getAttribute('data-type') === 'video';
    cap.textContent = item.getAttribute('data-cap') || '';
    img.style.display = isVideo ? 'none' : 'block';
    vid.style.display = isVideo ? 'block' : 'none';
    if (isVideo) {
      img.removeAttribute('src');
      vid.src = item.getAttribute('data-src');
      vid.load();
      vid.play().catch(function () {});
    } else {
      vid.pause();
      vid.removeAttribute('src');
      img.src = item.getAttribute('data-src');
    }
    lb.classList.add('show');
    document.body.style.overflow = 'hidden';
  }
  function close() {
    lb.classList.remove('show');
    vid.pause();
    document.body.style.overflow = '';
  }

  if (gallery) {
    gallery.addEventListener('click', function (e) {
      var item = e.target.closest('.plog-photo');
      if (item) open(item);
    });
  }
  document.getElementById('plog-lightbox-close').addEventListener('click', close);
  lb.addEventListener('click', function (e) {
    if (e.target === lb) close();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') close();
  });
})();
</script>
