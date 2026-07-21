/**
 * 腾讯视频 getvinfo 去贴片参数（对齐社区成熟写法）
 *
 * 抓包证实 svv.video.qq.com/getvinfo POST body 含：
 *   sppreviewtype=1  → 开启前贴/预览广告
 *   spsrt=3
 *   spadseg=3
 * 改为 0 后播放器不再拉贴片广告清单。
 *
 * 挂载类型：script-request-body（Soul 同款远程 raw）
 */

function zeroAdParams(s) {
  if (!s) return s;
  s = s.replace(/sppreviewtype=\d+/gi, "sppreviewtype=0");
  s = s.replace(/spsrt=\d+/gi, "spsrt=0");
  s = s.replace(/spadseg=\d+/gi, "spadseg=0");
  return s;
}

let body = $request.body || "";
body = zeroAdParams(body);
$done({ body });
