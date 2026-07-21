/**
 * getvinfo 请求 — 关闭贴片参数（对齐社区 + Soul 远程 script-request-body）
 */
function fix(s) {
  if (!s) return s;
  return String(s)
    .replace(/sppreviewtype=\d+/gi, "sppreviewtype=0")
    .replace(/spsrt=\d+/gi, "spsrt=0")
    .replace(/spadseg=\d+/gi, "spadseg=0");
}
$done({ body: fix($request.body || "") });
