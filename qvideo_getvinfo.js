/**
 * 腾讯视频 getvinfo — 关闭贴片开关
 * 抓包：svv.video.qq.com/getvinfo POST 含 sppreviewtype=1 / spsrt / spadseg
 * 仅挂 script-request-body（同一 URL 不可再挂第二条重写）
 */
function fix(s) {
  if (!s) return s;
  return s
    .replace(/sppreviewtype=\d+/gi, "sppreviewtype=0")
    .replace(/spsrt=\d+/gi, "spsrt=0")
    .replace(/spadseg=\d+/gi, "spadseg=0");
}
$done({ body: fix($request.body || "") });
