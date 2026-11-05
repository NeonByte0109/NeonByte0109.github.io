'use strict';

/**
 * 自定义标签插件（plog_ 前缀避免与主题自带标签冲突）
 * - {% plog_gallery %}            自动扫描 source/img/gallery/ 生成相册（图片+视频+分类筛选）
 * - {% plog_recent_posts N %}     输出最新 N 篇文章列表
 * - {% plog_site_stats %}         输出站点统计（文章 / 照片 / 视频 / 标签）
 * - {% plog_shuoshuo N %}         输出最近 N 条说说（便利贴）
 * - {% plog_archive %}            输出时光河流归档（按年月分组）
 * - {% plog_projects %}           输出项目卡片（source/_data/projects.yml）
 * - {% plog_links %}              输出友链漂流瓶（source/_data/links.yml）
 * - {% plog_photo_preview N %}    输出相册预览横条
 * - {% plog_carousel %}           输出最新文章轮播
 * - {% plog_search_data %}        输出文章搜索数据 JSON
 */

const fs = require('fs');
const path = require('path');

const GALLERY_REL = 'source/img/gallery';
const EXT_IMAGE = /\.(jpe?g|png|gif|webp|avif)$/i;
const EXT_VIDEO = /\.(mp4|webm|mov)$/i;

function readYaml(name) {
  const file = path.join(hexo.base_dir, 'source/_data/' + name);
  try {
    if (!fs.existsSync(file)) return [];
    const yaml = require('js-yaml');
    const data = yaml.load(fs.readFileSync(file, 'utf8'));
    return Array.isArray(data) ? data : [];
  } catch (e) {
    hexo.log.warn(name + ' 解析失败：' + e.message);
    return [];
  }
}

function galleryFiles() {
  const dir = path.join(hexo.base_dir, GALLERY_REL);
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir)
    .filter((f) => EXT_IMAGE.test(f) || EXT_VIDEO.test(f))
    .sort();
}

function galleryMeta() {
  const map = {};
  readYaml('gallery.yml').forEach((it) => {
    if (it && it.file) map[it.file] = { caption: it.caption || '', category: it.category || '未分类' };
  });
  return map;
}

function esc(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function postUrl(p) {
  const urlFor = hexo.extend.helper.get('url_for');
  if (urlFor) return urlFor.call(hexo, p.path);
  return '/' + String(p.path).replace(/\\/g, '/').replace(/index\.html$/, '');
}

hexo.extend.tag.register('plog_gallery', function () {
  const files = galleryFiles();
  if (!files.length) {
    return '<div class="plog-gallery plog-gallery-empty plog-fade-1"><p>相册还是空的 —— 把图片或视频放进 source/img/gallery/ 目录，或到 <a href="/admin">后台管理</a> 粘贴上传图片，即可自动出现在这里。</p></div>';
  }
  const meta = galleryMeta();
  const items = files.map((f, i) => {
    const info = meta[f] || { caption: '', category: '未分类' };
    const src = '/img/gallery/' + encodeURIComponent(f);
    const cap = esc(info.caption || f.replace(/\.[^.]+$/, ''));
    const cat = esc(info.category);
    const style = ' style="--i:' + i + '"';
    if (EXT_VIDEO.test(f)) {
      return '<figure class="plog-photo plog-video" data-src="' + src + '" data-cap="' + esc(info.caption || '') + '" data-cat="' + cat + '" data-type="video"' + style + '>'
        + '<video src="' + src + '" preload="metadata" muted playsinline></video>'
        + '<span class="plog-video-badge"><i class="fas fa-play"></i></span>'
        + '<figcaption>' + cap + '</figcaption>'
        + '</figure>';
    }
    return '<figure class="plog-photo" data-src="' + src + '" data-cap="' + esc(info.caption || '') + '" data-cat="' + cat + '"' + style + '>'
      + '<img src="' + src + '" alt="' + cap + '" loading="lazy">'
      + '<figcaption>' + cap + '</figcaption>'
      + '</figure>';
  }).join('');
  const cats = ['全部'];
  files.forEach((f) => {
    const c = (meta[f] || {}).category || '未分类';
    if (cats.indexOf(c) === -1) cats.push(c);
  });
  const filters = '<div class="plog-filters">' + cats.map((c, i) => {
    return '<button class="plog-filter-btn' + (i === 0 ? ' active' : '') + '" data-filter="' + esc(c) + '" type="button">' + esc(c) + '</button>';
  }).join('') + '</div>';
  return filters + '<div class="plog-gallery plog-fade-1" id="plog-gallery">' + items + '</div>';
}, { async: false });

hexo.extend.tag.register('plog_recent_posts', function (args) {
  const count = Math.min(Math.max(parseInt(args[0], 10) || 5, 1), 10);
  const posts = hexo.locals.get('posts').sort('-date').limit(count);
  const items = posts.map((p) => {
    const href = postUrl(p);
    const title = esc(p.title || '');
    const date = p.date.format('YYYY-MM-DD');
    return '<a class="plog-post-item" href="' + href + '">'
      + '<span class="plog-post-title">' + title + '</span>'
      + '<span class="plog-post-date">' + date + '</span>'
      + '<span class="plog-post-arrow"><i class="fas fa-chevron-right"></i></span>'
      + '</a>';
  });
  return '<div class="plog-post-list">' + items.join('') + '</div>';
}, { async: false });

hexo.extend.tag.register('plog_site_stats', function () {
  const posts = hexo.locals.get('posts');
  const tags = hexo.locals.get('tags');
  const files = galleryFiles();
  const stats = [
    { n: posts ? posts.length : 0, label: '文章' },
    { n: files.filter((f) => !EXT_VIDEO.test(f)).length, label: '照片' },
    { n: files.filter((f) => EXT_VIDEO.test(f)).length, label: '视频' },
    { n: tags ? tags.length : 0, label: '标签' },
  ];
  const items = stats.map((s) => {
    return '<div class="plog-card plog-stat"><span class="plog-stat-n">' + s.n + '</span><span class="plog-stat-l">' + s.label + '</span></div>';
  });
  return '<div class="plog-stats">' + items.join('') + '</div>';
}, { async: false });

hexo.extend.tag.register('plog_shuoshuo', function (args) {
  const count = Math.min(Math.max(parseInt(args[0], 10) || 6, 1), 12);
  const list = readYaml('shuoshuo.yml').slice(0, count);
  if (!list.length) {
    return '<p class="plog-note-empty">还没有说说，编辑 source/_data/shuoshuo.yml 添加吧。</p>';
  }
  const items = list.map((s, i) => {
    const text = esc(s.text || '');
    const date = esc(s.date || '');
    // 便利贴颜色：常用颜色名映射为浅色便签色（含中文名）；十六进制/rgb/hsl 原样使用；未知回退黄色
    const COLOR_MAP = {
      yellow: '#fdf1c2', pink: '#fce1ef', blue: '#d9e7fd', green: '#d4f4e2',
      red: '#fbd5d5', orange: '#ffe4c4', purple: '#e9d8fd', violet: '#e9d8fd',
      teal: '#bfe8e0', jade: '#c8ecdc', cyan: '#c9f2f2', gray: '#e5e7eb', grey: '#e5e7eb',
      white: '#ffffff', black: '#c8cdd4',
      '红': '#fbd5d5', '红色': '#fbd5d5', '橙': '#ffe4c4', '橙色': '#ffe4c4', '黄': '#fdf1c2', '黄色': '#fdf1c2',
      '绿': '#d4f4e2', '绿色': '#d4f4e2', '青': '#c9f2f2', '青色': '#c9f2f2', '蓝': '#d9e7fd', '蓝色': '#d9e7fd',
      '紫': '#e9d8fd', '紫色': '#e9d8fd', '粉': '#fce1ef', '粉色': '#fce1ef', '灰': '#e5e7eb', '灰色': '#e5e7eb',
      '玉': '#c8ecdc', '玉色': '#c8ecdc'
    };
    const rawColor = String(s.color || 'yellow').trim();
    const key = rawColor.toLowerCase();
    let bg = '#fdf1c2';
    if (COLOR_MAP[key] !== undefined) bg = COLOR_MAP[key];
    else if (/^(#[0-9a-f]{3,8}|rgb\(|hsl\()/i.test(key)) bg = rawColor;
    const img = s.image ? '<img src="' + esc(s.image) + '" alt="配图" loading="lazy" data-src="' + esc(s.image) + '" data-cap="' + esc(s.text || '') + '">' : '';
    return '<div class="plog-note" style="--i:' + i + ';background:' + bg + '">'
      + (img ? '<div class="plog-note-img">' + img + '</div>' : '')
      + '<p class="plog-note-text">' + text + '</p>'
      + '<time class="plog-note-date">' + date + '</time>'
      + '</div>';
  });
  return '<div class="plog-notes">' + items.join('') + '</div>';
}, { async: false });

hexo.extend.tag.register('plog_archive', function () {
  const posts = hexo.locals.get('posts').sort('-date');
  const byYear = {};
  posts.forEach((p) => {
    const y = p.date.format('YYYY');
    const m = p.date.format('MM');
    if (!byYear[y]) byYear[y] = {};
    if (!byYear[y][m]) byYear[y][m] = [];
    byYear[y][m].push(p);
  });
  const years = Object.keys(byYear).sort().reverse();
  let html = '<div class="plog-river">';
  years.forEach((y, yi) => {
    const months = Object.keys(byYear[y]).sort().reverse();
    html += '<div class="plog-river-year" style="--yi:' + yi + '">'
      + '<div class="plog-river-year-title"><span class="plog-river-dot"></span>' + y + ' 年 · ' + months.reduce((n, m) => n + byYear[y][m].length, 0) + ' 篇</div>';
    months.forEach((m) => {
      html += '<div class="plog-river-month">'
        + '<div class="plog-river-month-label">' + m + ' 月</div>'
        + '<div class="plog-river-posts">';
      byYear[y][m].forEach((p) => {
        html += '<a class="plog-river-post" href="' + postUrl(p) + '">'
          + '<span class="plog-river-post-title">' + esc(p.title || '') + '</span>'
          + '<span class="plog-river-post-date">' + p.date.format('MM-DD') + '</span>'
          + '</a>';
      });
      html += '</div></div>';
    });
    html += '</div>';
  });
  html += '</div>';
  return html;
}, { async: false });

hexo.extend.tag.register('plog_projects', function () {
  const list = readYaml('projects.yml');
  if (!list.length) {
    return '<p class="plog-note-empty">还没有项目，编辑 source/_data/projects.yml 添加吧。</p>';
  }
  const items = list.map((p, i) => {
    const tags = (p.tags || []).map((t) => '<span class="plog-chip">' + esc(t) + '</span>').join('');
    const link = p.link ? '<a class="plog-btn" href="' + esc(p.link) + '" target="_blank" rel="noopener"><i class="fas fa-arrow-up-right-from-square"></i> 访问</a>' : '';
    return '<div class="plog-card plog-project" style="--i:' + i + '" data-search="' + esc((p.name + ' ' + p.desc + ' ' + (p.tags || []).join(' ')).toLowerCase()) + '">'
      + '<div class="plog-project-head">'
      + '<span class="plog-project-icon"><i class="' + esc(p.icon || 'fas fa-cube') + '"></i></span>'
      + '<h2 class="plog-project-name">' + esc(p.name || '') + '</h2>'
      + '</div>'
      + '<p class="plog-project-desc">' + esc(p.desc || '') + '</p>'
      + '<div class="plog-project-foot"><div class="plog-project-tags">' + tags + '</div>' + link + '</div>'
      + '</div>';
  });
  return '<div class="plog-projects">' + items.join('') + '</div>';
}, { async: false });

hexo.extend.tag.register('plog_links', function () {
  const list = readYaml('links.yml');
  if (!list.length) {
    return '<p class="plog-note-empty">还没有友链，编辑 source/_data/links.yml 添加吧。</p>';
  }
  const items = list.map((l, i) => {
    const initial = esc((l.name || '?').slice(0, 1));
    return '<a class="plog-bottle" href="' + esc(l.url || '#') + '" target="_blank" rel="noopener" style="--i:' + i + '">'
      + '<span class="plog-bottle-cork"></span>'
      + '<span class="plog-bottle-body"><span class="plog-bottle-letter">' + initial + '</span>'
      + '<span class="plog-bottle-name">' + esc(l.name || '') + '</span>'
      + '<span class="plog-bottle-desc">' + esc(l.desc || '') + '</span></span>'
      + '</a>';
  });
  return '<div class="plog-bottles">' + items.join('') + '</div>';
}, { async: false });

hexo.extend.tag.register('plog_photo_preview', function (args) {
  const count = Math.min(Math.max(parseInt(args[0], 10) || 6, 1), 10);
  const files = galleryFiles().filter((f) => EXT_IMAGE.test(f)).slice(0, count);
  if (!files.length) return '';
  const items = files.map((f, i) => {
    const src = '/img/gallery/' + encodeURIComponent(f);
    return '<a class="plog-preview-item" href="/photo" style="--i:' + i + '"><img src="' + src + '" alt="照片" loading="lazy"></a>';
  });
  return '<div class="plog-photo-preview">' + items.join('') + '<a class="plog-preview-more" href="/photo">更多 <i class="fas fa-chevron-right"></i></a></div>';
}, { async: false });

function postExcerpt(p) {
  const stripHtml = hexo.extend.helper.get('strip_html');
  let ex = (p.excerpt || p.content || p._content || '').slice(0, 600);
  if (stripHtml) ex = stripHtml.call(hexo, ex);
  return ex
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/[#>*`_~]+/g, '')
    .replace(/\|+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 90);
}

hexo.extend.tag.register('plog_carousel', function () {
  const posts = hexo.locals.get('posts').sort('-date').limit(5);
  if (!posts.length) return '';
  const slides = posts.map((p, i) => {
    const href = postUrl(p);
    const ex = postExcerpt(p);
    const excerpt = ex ? '<span class="plog-slide-excerpt">' + esc(ex) + '</span>' : '';
    return '<a class="plog-slide' + (i === 0 ? ' active' : '') + '" href="' + href + '">'
      + '<span class="plog-slide-date">' + p.date.format('YYYY-MM-DD') + '</span>'
      + '<span class="plog-slide-title">' + esc(p.title || '') + '</span>'
      + excerpt
      + '<span class="plog-slide-tags">' + (p.tags ? p.tags.map((t) => '#' + esc(t.name)).join(' ') : '') + '</span>'
      + '</a>';
  });
  const dots = posts.map((p, i) => '<button class="plog-dot' + (i === 0 ? ' active' : '') + '" data-i="' + i + '" type="button" aria-label="第 ' + (i + 1) + ' 篇"></button>').join('');
  return '<div class="plog-carousel" id="plog-carousel">'
    + '<button class="plog-car-btn prev" type="button" aria-label="上一篇"><i class="fas fa-chevron-left"></i></button>'
    + '<div class="plog-car-viewport"><div class="plog-car-track">' + slides.join('') + '</div></div>'
    + '<button class="plog-car-btn next" type="button" aria-label="下一篇"><i class="fas fa-chevron-right"></i></button>'
    + '<div class="plog-car-dots">' + dots + '</div>'
    + '</div>';
}, { async: false });

hexo.extend.tag.register('plog_latest', function (args) {
  const count = Math.min(Math.max(parseInt(args[0], 10) || 3, 1), 6);
  const posts = hexo.locals.get('posts').sort('-date').limit(count);
  if (!posts.length) return '';
  const items = posts.map((p) => {
    const href = postUrl(p);
    const ex = postExcerpt(p);
    const excerpt = ex ? '<span class="plog-slide-excerpt">' + esc(ex) + '</span>' : '';
    return '<a class="plog-latest-item" href="' + href + '">'
      + '<span class="plog-slide-date">' + p.date.format('YYYY-MM-DD') + '</span>'
      + '<span class="plog-slide-title">' + esc(p.title || '') + '</span>'
      + excerpt
      + '<span class="plog-slide-tags">' + (p.tags ? p.tags.map((t) => '#' + esc(t.name)).join(' ') : '') + '</span>'
      + '</a>';
  });
  return '<div class="plog-latest">' + items.join('') + '</div>';
}, { async: false });

hexo.extend.tag.register('plog_search_data', function () {
  const posts = hexo.locals.get('posts').sort('-date');
  const data = posts.map((p) => ({
    title: p.title || '',
    url: postUrl(p),
    date: p.date.format('YYYY-MM-DD'),
    tags: p.tags ? p.tags.map((t) => t.name) : [],
  }));
  return '<script type="application/json" id="plog-search-data">' + JSON.stringify(data).replace(/</g, '\\u003c') + '</script>';
}, { async: false });
