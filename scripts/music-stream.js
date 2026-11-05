'use strict';

/**
 * /stream/ 音乐流路由：支持 HTTP Range（字节范围请求），
 * 让 MP3 在浏览器里可拖动进度条（hexo 默认静态服务不支持 Range，
 * 导致音频 seekable 为空、拖动进度会回到 0 秒）。
 * 只注册 /stream/ 前缀，不占用 hexo 已有的 /music/ 静态路由。
 */

const fs = require('fs');
const path = require('path');

const MUSIC_DIR = path.join(hexo.base_dir, 'source/music');

hexo.extend.filter.register('server_middleware', function (app) {
  app.use('/stream', function (req, res, next) {
    const urlPath = decodeURIComponent(String(req.originalUrl || req.url || '').split('?')[0]);
    const name = urlPath.split('/').pop() || '';
    const file = path.join(MUSIC_DIR, name);
    if (!name || !file.startsWith(MUSIC_DIR) || !fs.existsSync(file) || !fs.statSync(file).isFile()) {
      return next();
    }
    const stat = fs.statSync(file);
    const total = stat.size;
    const range = req.headers.range;

    res.setHeader('Accept-Ranges', 'bytes');
    res.setHeader('Content-Type', 'audio/mpeg');

    if (range) {
      const m = /bytes=(\d*)-(\d*)/.exec(range);
      let start = m && m[1] ? parseInt(m[1], 10) : 0;
      let end = m && m[2] ? parseInt(m[2], 10) : total - 1;
      if (isNaN(start) || start < 0) start = 0;
      if (isNaN(end) || end >= total) end = total - 1;
      if (start > end) {
        res.statusCode = 416;
        res.end();
        return;
      }
      res.statusCode = 206;
      res.setHeader('Content-Range', 'bytes ' + start + '-' + end + '/' + total);
      res.setHeader('Content-Length', end - start + 1);
      fs.createReadStream(file, { start: start, end: end }).pipe(res);
    } else {
      res.setHeader('Content-Length', total);
      fs.createReadStream(file).pipe(res);
    }
  });
});
