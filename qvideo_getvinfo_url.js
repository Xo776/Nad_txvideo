/**
 * getvinfo GET 查询串去贴片（h5vv6 / vv 等）
 * 挂载：script-request-header
 */
function zero(path) {
  if (!path) return path;
  path = path.replace(/sppreviewtype=\d+/gi, "sppreviewtype=0");
  path = path.replace(/spsrt=\d+/gi, "spsrt=0");
  path = path.replace(/spadseg=\d+/gi, "spadseg=0");
  return path;
}

let path = $request.url.replace(/^https?:\/\/[^\/]+/i, "");
$done({ path: zero(path) });
