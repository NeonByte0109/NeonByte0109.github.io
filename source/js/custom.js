/* Kirameku 风格交互层：设计面板 / 鼠标特效 / 进度条 / 3D 倾斜 / 轮播 / 搜索 / 分类筛选 */
(function () {
  'use strict';

  var SETTINGS_KEY = 'plog-settings';
  var BGS = {
    gradient: 'linear-gradient(135deg, #0f0b2e 0%, #1a1145 25%, #0d1b3e 50%, #1e1145 75%, #0f0b28 100%)',
    banner: 'url(/img/banner.jpg)',
    photo3: 'url(/img/gallery/moment-03.jpg)',
    photo6: 'url(/img/gallery/moment-06.jpg)'
  };
  var LIGHT_GRADIENT = 'linear-gradient(135deg, #e9edfb 0%, #f6f8ff 30%, #eef1fb 60%, #e7eaf8 100%)';

  function readSettings() {
    try {
      return JSON.parse(localStorage.getItem(SETTINGS_KEY)) || {};
    } catch (e) {
      return {};
    }
  }
  function writeSettings(s) {
    try { localStorage.setItem(SETTINGS_KEY, JSON.stringify(s)); } catch (e) { }
  }

  var settings = readSettings();

  /* 尽早应用主题与背景（避免闪烁） */
  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme || 'dark');
  }
  function applyBg(bg, blur) {
    var root = document.documentElement.style;
    var theme = document.documentElement.getAttribute('data-theme') || 'light';
    var isGradient = bg === 'gradient' || !bg;
    var val = BGS[bg];
    if (!val || isGradient) val = theme === 'dark' ? BGS.gradient : LIGHT_GRADIENT;
    root.setProperty('--plog-bg', val);
    root.setProperty('--plog-blur', (parseInt(blur, 10) || 0) + 'px');
  }
  if (settings.theme) applyTheme(settings.theme);
  if (settings.bg) applyBg(settings.bg, settings.blur);

  function onReady(fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn);
    } else {
      fn();
    }
  }

  /* 鼠标点击特效 */
  var SPARKS = ['❤', '✨', '⭐', '💙', '🌟', '💜'];
  var sparkleOn = settings.sparkles !== false;
  var lastSpark = 0;
  function spawnSpark(x, y) {
    var now = Date.now();
    if (now - lastSpark < 90) return;
    lastSpark = now;
    var s = document.createElement('span');
    s.className = 'plog-spark';
    s.textContent = SPARKS[Math.floor(Math.random() * SPARKS.length)];
    s.style.left = x + 'px';
    s.style.top = y + 'px';
    s.style.transform = 'translate(-50%,-50%) rotate(' + (Math.random() * 60 - 30) + 'deg)';
    document.body.appendChild(s);
    setTimeout(function () { s.remove(); }, 1000);
  }
  function toggleSparkles(on) {
    sparkleOn = !!on;
    settings.sparkles = !!on;
    writeSettings(settings);
  }
  document.addEventListener('click', function (e) {
    if (!sparkleOn) return;
    var t = e.target;
    if (t && (t.closest('#plog-panel') || t.closest('#plog-panel-btn') || t.closest('input') || t.closest('textarea') || t.closest('button'))) return;
    spawnSpark(e.clientX, e.clientY);
  });

  onReady(function () {
    var root = document.documentElement;

    /* 主题优先级：设计面板设置 > 默认浅色。
       主题自带脚本会读取它自己的 localStorage 状态覆盖 data-theme，
       这里在 DOM 就绪后重新应用，保证浅色默认生效 */
    if (!settings.theme) {
      try { localStorage.removeItem('theme'); } catch (e) { }
    }
    applyTheme(settings.theme || 'dark');
    if (settings.bg) {
      applyBg(settings.bg, settings.blur);
    } else {
      applyBg('banner', settings.blur || 0);
    }

    /* ============ 设计面板 ============ */
    var gear = document.createElement('button');
    gear.id = 'plog-panel-btn';
    gear.type = 'button';
    gear.title = '设计面板';
    gear.setAttribute('aria-label', '设计面板');
    gear.innerHTML = '<i class="fas fa-palette"></i>';

    var panel = document.createElement('div');
    panel.id = 'plog-panel';
    panel.innerHTML =
      '<h3 class="plog-panel-title"><i class="fas fa-palette"></i> 设计面板</h3>' +
      '<div class="plog-panel-group">' +
      '<span class="plog-panel-label">背景</span>' +
      '<div class="plog-bg-options" id="plog-bg-options">' +
      '<button class="plog-bg-opt bg-gradient" data-bg="gradient" type="button" title="深空渐变"></button>' +
      '<button class="plog-bg-opt bg-banner" data-bg="banner" type="button" title="横幅"></button>' +
      '<button class="plog-bg-opt bg-photo3" data-bg="photo3" type="button" title="照片 3"></button>' +
      '<button class="plog-bg-opt bg-photo6" data-bg="photo6" type="button" title="照片 6"></button>' +
      '</div></div>' +
      '<div class="plog-panel-group">' +
      '<span class="plog-panel-label">背景模糊度</span>' +
      '<input type="range" id="plog-blur-range" min="0" max="20" step="1" value="0">' +
      '</div>' +
      '<div class="plog-panel-group">' +
      '<div class="plog-switch-row"><span>鼠标点击特效</span><button class="plog-switch" id="plog-spark-switch" type="button"></button></div>' +
      '<div class="plog-switch-row"><span>主题模式</span></div>' +
      '<div class="plog-theme-btns">' +
      '<button class="plog-theme-btn" data-theme="dark" type="button"><i class="fas fa-moon"></i> 深色</button>' +
      '<button class="plog-theme-btn" data-theme="light" type="button"><i class="fas fa-sun"></i> 浅色</button>' +
      '</div></div>';

    document.body.appendChild(gear);
    document.body.appendChild(panel);

    var bgOpts = panel.querySelectorAll('.plog-bg-opt');
    var blurRange = panel.querySelector('#plog-blur-range');
    var sparkSwitch = panel.querySelector('#plog-spark-switch');
    var themeBtns = panel.querySelectorAll('.plog-theme-btn');

    function syncPanel() {
      var bg = settings.bg || 'banner';
      var blur = parseInt(settings.blur, 10) || 0;
      var theme = root.getAttribute('data-theme') || 'dark';
      bgOpts.forEach(function (b) { b.classList.toggle('active', b.getAttribute('data-bg') === bg); });
      blurRange.value = blur;
      sparkSwitch.classList.toggle('on', sparkleOn);
      themeBtns.forEach(function (b) { b.classList.toggle('active', b.getAttribute('data-theme') === theme); });
    }
    syncPanel();

    gear.addEventListener('click', function () {
      panel.classList.toggle('show');
      syncPanel();
    });
    bgOpts.forEach(function (b) {
      b.addEventListener('click', function () {
        settings.bg = b.getAttribute('data-bg');
        writeSettings(settings);
        applyBg(settings.bg, settings.blur);
        syncPanel();
      });
    });
    blurRange.addEventListener('input', function () {
      settings.blur = blurRange.value;
      writeSettings(settings);
      applyBg(settings.bg, settings.blur);
    });
    sparkSwitch.addEventListener('click', function () {
      toggleSparkles(!sparkleOn);
      sparkSwitch.classList.toggle('on', sparkleOn);
    });
    themeBtns.forEach(function (b) {
      b.addEventListener('click', function () {
        var theme = b.getAttribute('data-theme');
        settings.theme = theme;
        writeSettings(settings);
        applyTheme(theme);
        // 同步主题自身的状态存储，避免主题脚本下次加载时抢回旧状态
        try {
          localStorage.setItem('theme', JSON.stringify({ value: theme, expiry: Date.now() + 315360000000 }));
        } catch (e) { }
        if (settings.bg === 'gradient') {
          applyBg('gradient', settings.blur);
        } else {
          applyBg(settings.bg || 'banner', settings.blur);
        }
        syncPanel();
      });
    });

    /* ============ 阅读进度条（仅文章页） ============ */
    var bodyWrap = document.getElementById('body-wrap');
    if (bodyWrap && bodyWrap.classList.contains('post')) {
      var bar = document.createElement('div');
      bar.id = 'plog-progress';
      document.body.appendChild(bar);
      var update = function () {
        var h = document.documentElement.scrollHeight - window.innerHeight;
        var p = h > 0 ? (window.scrollY / h) * 100 : 0;
        bar.style.width = Math.min(p, 100) + '%';
      };
      window.addEventListener('scroll', update, { passive: true });
      update();
    }

    /* ============ 3D 倾斜卡片 ============ */
    var tiltables = document.querySelectorAll('.recent-post-item, .plog-slide');
    tiltables.forEach(function (el) {
      el.addEventListener('mousemove', function (e) {
        var r = el.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width - 0.5;
        var py = (e.clientY - r.top) / r.height - 0.5;
        el.style.transform = 'perspective(900px) rotateY(' + (px * 6) + 'deg) rotateX(' + (-py * 6) + 'deg)';
      });
      el.addEventListener('mouseleave', function () {
        el.style.transform = '';
      });
    });

    /* ============ 最新文章轮播 ============ */
    var carousel = document.getElementById('plog-carousel');
    if (carousel) {
      var track = carousel.querySelector('.plog-car-track');
      var slides = carousel.querySelectorAll('.plog-slide');
      var dots = carousel.querySelectorAll('.plog-dot');
      var idx = 0;
      var timer = null;
      function go(i) {
        idx = (i + slides.length) % slides.length;
        track.style.transform = 'translateX(-' + idx * 100 + '%)';
        dots.forEach(function (d, di) { d.classList.toggle('active', di === idx); });
      }
      function play() {
        timer = setInterval(function () { go(idx + 1); }, 5000);
      }
      function stop() { if (timer) { clearInterval(timer); timer = null; } }
      carousel.querySelector('.plog-car-btn.prev').addEventListener('click', function () { go(idx - 1); });
      carousel.querySelector('.plog-car-btn.next').addEventListener('click', function () { go(idx + 1); });
      dots.forEach(function (d) {
        d.addEventListener('click', function () { go(parseInt(d.getAttribute('data-i'), 10)); });
      });
      carousel.addEventListener('mouseenter', stop);
      carousel.addEventListener('mouseleave', play);
      play();
    }

    /* ============ 主页搜索 ============ */
    var searchInput = document.getElementById('plog-search-input');
    var searchDataEl = document.getElementById('plog-search-data');
    if (searchInput && searchDataEl) {
      var posts = [];
      try { posts = JSON.parse(searchDataEl.textContent); } catch (e) { }
      var drop = document.createElement('div');
      drop.className = 'plog-search-drop';
      searchInput.parentNode.appendChild(drop);
      function render(q) {
        var kw = q.trim().toLowerCase();
        if (!kw) { drop.classList.remove('show'); return; }
        var hits = posts.filter(function (p) {
          return (p.title + ' ' + (p.tags || []).join(' ')).toLowerCase().indexOf(kw) !== -1;
        }).slice(0, 6);
        drop.innerHTML = hits.length
          ? hits.map(function (p) {
            return '<a href="' + p.url + '"><span class="plog-search-title">' + p.title + '</span><span class="plog-search-date">' + p.date + '</span></a>';
          }).join('')
          : '<div class="plog-search-empty">没有找到相关文章</div>';
        drop.classList.add('show');
      }
      searchInput.addEventListener('input', function () { render(searchInput.value); });
      searchInput.addEventListener('focus', function () { if (searchInput.value) render(searchInput.value); });
      document.addEventListener('click', function (e) {
        if (!e.target.closest('.plog-search')) drop.classList.remove('show');
      });
    }

    /* ============ 相册分类筛选 ============ */
    var gallery = document.getElementById('plog-gallery');
    var filterBtns = document.querySelectorAll('.plog-filter-btn');
    if (gallery && filterBtns.length) {
      filterBtns.forEach(function (btn) {
        btn.addEventListener('click', function () {
          filterBtns.forEach(function (b) { b.classList.remove('active'); });
          btn.classList.add('active');
          var f = btn.getAttribute('data-filter');
          gallery.querySelectorAll('.plog-photo').forEach(function (p) {
            var show = f === '全部' || p.getAttribute('data-cat') === f;
            p.classList.toggle('hidden-cat', !show);
          });
        });
      });
    }

    /* ============ 项目搜索筛选 ============ */
    var projInput = document.getElementById('plog-projects-input');
    if (projInput) {
      projInput.addEventListener('input', function () {
        var kw = projInput.value.trim().toLowerCase();
        document.querySelectorAll('.plog-project').forEach(function (p) {
          var hit = !kw || (p.getAttribute('data-search') || '').indexOf(kw) !== -1;
          p.classList.toggle('hidden-cat', !hit);
        });
      });
    }

    /* ============ 滚动浮现 ============ */
    var revealEls = document.querySelectorAll('.plog-reveal, .plog-river-year, .plog-project, .plog-bottle, .plog-note');
    if (revealEls.length && 'IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) {
            en.target.classList.add('visible');
            io.unobserve(en.target);
          }
        });
      }, { threshold: 0.12 });
      revealEls.forEach(function (el) { io.observe(el); });
    } else {
      revealEls.forEach(function (el) { el.classList.add('visible'); });
    }
  });
})();

/* ============ 自研音乐播放器（mini：首页紧凑版 / full：音乐页完整版） ============ */
window.PlogPlayer = function (opts) {
  var root = typeof opts.el === 'string' ? document.querySelector(opts.el) : opts.el;
  if (!root) return;
  var songs = opts.songs || [];
  if (!songs.length) return;
  var mode = opts.mode || 'full';
  var idx = 0;
  var audio = new Audio();
  // preload=auto：完整下载后浏览器才支持拖动进度（本地文件瞬间完成；
  // 服务端不支持 Range 时，非完整下载的 MP3 seekable 为空，拖动会回到 0 秒）
  audio.preload = 'auto';
  root.__plogAudio = audio;

  root.className = 'plog-pp ' + (mode === 'mini' ? 'plog-pp-mini' : 'plog-pp-full');

  var disc = document.createElement('div');
  disc.className = 'pp-disc';
  disc.title = '播放 / 暂停';
  var discImg = document.createElement('img');
  discImg.alt = '专辑封面';
  disc.appendChild(discImg);

  var meta = document.createElement('div');
  meta.className = 'pp-meta';
  var title = document.createElement('div');
  title.className = 'pp-title';
  var artist = document.createElement('div');
  artist.className = 'pp-artist';
  meta.appendChild(title);
  meta.appendChild(artist);

  var controls = document.createElement('div');
  controls.className = 'pp-controls';
  function mkBtn(icon, cls, label) {
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'pp-btn ' + cls;
    b.setAttribute('aria-label', label);
    b.innerHTML = '<i class="fas ' + icon + '"></i>';
    return b;
  }
  var prevBtn = mkBtn('fa-backward', 'pp-prev', '上一首');
  var playBtn = mkBtn('fa-play', 'pp-play', '播放');
  var nextBtn = mkBtn('fa-forward', 'pp-next', '下一首');
  controls.appendChild(prevBtn);
  controls.appendChild(playBtn);
  controls.appendChild(nextBtn);

  var progress = document.createElement('div');
  progress.className = 'pp-progress';
  var bar = document.createElement('div');
  bar.className = 'pp-bar';
  progress.appendChild(bar);

  var time = document.createElement('div');
  time.className = 'pp-time';
  var curT = document.createElement('span');
  curT.className = 'pp-cur';
  curT.textContent = '0:00';
  var durT = document.createElement('span');
  durT.className = 'pp-dur';
  durT.textContent = '0:00';
  time.appendChild(curT);
  time.appendChild(document.createTextNode(' / '));
  time.appendChild(durT);

  var lyricsEl = null;

  if (mode === 'mini') {
    // 迷你版：横向排列 —— 控制键在左、歌名中间、唱片在右；歌词在进度条上方
    lyricsEl = document.createElement('div');
    lyricsEl.className = 'pp-lyrics pp-lyrics-mini';
    root.appendChild(controls);
    root.appendChild(meta);
    root.appendChild(disc);
    root.appendChild(lyricsEl);
    root.appendChild(progress);
  } else {
    // 完整版：左唱片+控制，右歌词面板
    var left = document.createElement('div');
    left.className = 'pp-left';
    left.appendChild(disc);
    left.appendChild(meta);
    left.appendChild(controls);
    left.appendChild(progress);
    left.appendChild(time);
    root.appendChild(left);

    var right = document.createElement('div');
    right.className = 'pp-right';
    var lyTitle = document.createElement('div');
    lyTitle.className = 'pp-lyrics-title';
    lyTitle.innerHTML = '<i class="fas fa-align-left"></i> 歌词';
    lyricsEl = document.createElement('div');
    lyricsEl.className = 'pp-lyrics';
    right.appendChild(lyTitle);
    right.appendChild(lyricsEl);
    root.appendChild(right);
  }

  function fmt(s) {
    if (!isFinite(s) || s < 0) return '0:00';
    var m = Math.floor(s / 60);
    var sec = Math.floor(s % 60);
    return m + ':' + (sec < 10 ? '0' : '') + sec;
  }
  function parseLrc(text) {
    // 解析标准 LRC 文本，返回 [{ t: 秒, text }]，非 LRC 返回 null
    var lines = [];
    String(text || '').split('\n').forEach(function (l) {
      var m = l.match(/\[(\d{1,2}):(\d{1,2})(?:[.:](\d{1,3}))?\]\s*(.*)/);
      if (!m) return;
      var sec = parseInt(m[1], 10) * 60 + parseInt(m[2], 10);
      if (m[3]) sec += parseInt((m[3] + '00').slice(0, 3), 10) / 1000;
      var t = (m[4] || '').trim();
      if (t) lines.push({ t: sec, text: t });
    });
    return lines.length ? lines : null;
  }
  function renderLyrics() {
    if (!lyricsEl) return [];
    var lrc = songs[idx].lrc;
    var timed = typeof lrc === 'string' ? parseLrc(lrc) : null;
    var rows = timed || (Array.isArray(lrc) && lrc.length ? lrc : ['♪ 暂无歌词，敬请欣赏 ♪']);
    lyricsEl.innerHTML = '';
    var lines = [];
    var isTimed = !!timed;
    rows.forEach(function (row) {
      var p = document.createElement('p');
      p.className = 'pp-lyric-line';
      p.textContent = isTimed ? row.text : row;
      lines.push(p);
      lyricsEl.appendChild(p);
    });
    // 迷你版：未播放时默认显示第一句歌词
    if (mode === 'mini' && lines.length) lines[0].classList.add('active');
    lyricsEl.__timed = isTimed;
    lyricsEl.__rows = rows;
    return lines;
  }
  var lyricLines = [];
  function load() {
    var s = songs[idx];
    audio.src = s.url;
    discImg.src = s.cover;
    title.textContent = s.name;
    artist.textContent = s.artist;
    lyricLines = renderLyrics();
    bar.style.width = '0%';
    curT.textContent = '0:00';
    durT.textContent = '0:00';
  }
  function setPlaying(p) {
    root.classList.toggle('playing', p);
    playBtn.querySelector('i').className = 'fas ' + (p ? 'fa-pause' : 'fa-play');
    if (p) {
      audio.play().catch(function () { setPlaying(false); });
    } else {
      audio.pause();
    }
  }
  function playPause() {
    if (audio.src && !audio.paused) {
      setPlaying(false);
    } else if (audio.src) {
      setPlaying(true);
    } else {
      load();
      setPlaying(true);
    }
  }
  playBtn.addEventListener('click', playPause);
  disc.addEventListener('click', playPause);
  prevBtn.addEventListener('click', function () {
    idx = (idx - 1 + songs.length) % songs.length;
    load();
    if (root.classList.contains('playing')) setPlaying(true);
  });
  nextBtn.addEventListener('click', function () {
    idx = (idx + 1) % songs.length;
    load();
    if (root.classList.contains('playing')) setPlaying(true);
  });
  audio.addEventListener('timeupdate', function () {
    var d = audio.duration || 1;
    bar.style.width = Math.min((audio.currentTime / d) * 100, 100) + '%';
    curT.textContent = fmt(audio.currentTime);
    if (lyricLines.length) {
      var li;
      if (lyricsEl.__timed) {
        // LRC 时间轴：找最后一个时间 <= 当前播放时间的行
        var t = audio.currentTime;
        li = -1;
        for (var i = 0; i < lyricsEl.__rows.length; i++) {
          if (lyricsEl.__rows[i].t <= t) li = i; else break;
        }
        // 迷你版：还没唱到第一句时（未播放/前奏）固定显示第一句
        if (mode === 'mini' && li < 0) li = 0;
      } else {
        li = Math.min(Math.floor((audio.currentTime / d) * lyricLines.length), lyricLines.length - 1);
      }
      lyricLines.forEach(function (l, i) {
        l.classList.toggle('active', i === li);
      });
      // 正在唱的歌词保持垂直居中；开头几句无法居中时停留在顶部（scrollTop 钳制为 0）
      if (li < 0) {
        // 还没有唱到第一句（开头/前奏）：面板回到顶部
        if (lyricsEl) lyricsEl.scrollTop = 0;
      } else if (lyricLines[li] && lyricsEl) {
        var lr = lyricLines[li].getBoundingClientRect();
        var br = lyricsEl.getBoundingClientRect();
        var target = lyricsEl.scrollTop + (lr.top - br.top) - (br.height - lr.height) / 2;
        lyricsEl.scrollTop = Math.max(0, target);
      }
    }
  });
  audio.addEventListener('loadedmetadata', function () {
    durT.textContent = fmt(audio.duration);
  });
  audio.addEventListener('ended', function () {
    idx = (idx + 1) % songs.length;
    load();
    setPlaying(true);
  });
  audio.addEventListener('error', function () { setPlaying(false); });
  progress.addEventListener('click', function (e) {
    if (!isFinite(audio.duration) || audio.duration <= 0) return;
    var r = progress.getBoundingClientRect();
    var ratio = Math.max(0, Math.min(1, (e.clientX - r.left) / r.width));
    try {
      audio.currentTime = ratio * audio.duration;
    } catch (err) { }
  });

  load();
};
